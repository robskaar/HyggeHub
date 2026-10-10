// Sculpting in code. A figure is described the way a sculptor builds one in clay: soft lumps that melt
// into each other (a skull, cheeks, a nose, a mass of hair), shapes carved away (an open mouth, the
// hollow of an ear) and colour painted on (blush, brows, a sleeve). Underneath it is a signed distance
// field; `mesh()` turns it into one smooth surface with the colours in its vertices.
import { BufferAttribute, BufferGeometry, Color, Euler, Matrix4 } from 'three';

export type V3 = [number, number, number];
type Dist = (x: number, y: number, z: number) => number;

/** A shape: its distance function and a sphere it fits in (used to skip it where it can't matter). */
export interface Shape {
  d: Dist;
  c: V3;
  r: number;
}

interface Step {
  op: 'add' | 'sub' | 'paint';
  s: Shape;
  /** How far the step melts into what is there (add, sub), or the softness of a paint edge. */
  k: number;
  /** How soft the colour edge is. */
  ck: number;
  col?: V3;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const rgb = (hex: string): V3 => {
  const c = new Color(hex);
  return [c.r, c.g, c.b];
};

// ---------- shapes ----------

/** Place a shape made round the origin at `at`, turned by `rot` (radians, XYZ). */
function placed(at: V3, rot: V3 | undefined, r: number, local: Dist): Shape {
  const [cx, cy, cz] = at;
  if (!rot || (rot[0] === 0 && rot[1] === 0 && rot[2] === 0)) return { d: (x, y, z) => local(x - cx, y - cy, z - cz), c: at, r };
  const e = new Matrix4().makeRotationFromEuler(new Euler(...rot)).invert().elements;
  const [a, b, c, d, e2, f, g, h, i] = [e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]];
  return {
    d: (x, y, z) => {
      x -= cx;
      y -= cy;
      z -= cz;
      return local(a * x + b * y + c * z, d * x + e2 * y + f * z, g * x + h * y + i * z);
    },
    c: at,
    r,
  };
}

export const sphere = (at: V3, r: number): Shape => placed(at, undefined, r, (x, y, z) => Math.sqrt(x * x + y * y + z * z) - r);

/** An ellipsoid with radii `rad` (a close approximation of the distance, good for sculpting). */
export const ellipsoid = (at: V3, rad: V3, rot?: V3): Shape => {
  const [a, b, c] = rad;
  return placed(at, rot, Math.max(a, b, c), (x, y, z) => {
    const k0 = Math.sqrt((x / a) ** 2 + (y / b) ** 2 + (z / c) ** 2);
    const k1 = Math.sqrt((x / (a * a)) ** 2 + (y / (b * b)) ** 2 + (z / (c * c)) ** 2);
    return k1 < 1e-9 ? -Math.min(a, b, c) : (k0 * (k0 - 1)) / k1;
  });
};

export const roundBox = (at: V3, half: V3, round: number, rot?: V3): Shape => {
  const [hx, hy, hz] = half;
  return placed(at, rot, Math.hypot(hx, hy, hz), (x, y, z) => {
    const qx = Math.abs(x) - hx + round;
    const qy = Math.abs(y) - hy + round;
    const qz = Math.abs(z) - hz + round;
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - round;
  });
};

/** A ring round the y axis: radius `R`, thickness `r`. */
export const torus = (at: V3, R: number, r: number, rot?: V3): Shape =>
  placed(at, rot, R + r, (x, y, z) => {
    const q = Math.sqrt(x * x + z * z) - R;
    return Math.sqrt(q * q + y * y) - r;
  });

/** A limb: from `a` (radius `ra`) to `b` (radius `rb`), rounded at both ends. */
export function cone(a: V3, b: V3, ra: number, rb: number): Shape {
  const [ax, ay, az] = a;
  const bax = b[0] - ax, bay = b[1] - ay, baz = b[2] - az;
  const l2 = bax * bax + bay * bay + baz * baz;
  const rr = ra - rb;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;
  return {
    d: (x, y, z) => {
      const pax = x - ax, pay = y - ay, paz = z - az;
      const yy = pax * bax + pay * bay + paz * baz;
      const zz = yy - l2;
      const qx = pax * l2 - bax * yy, qy = pay * l2 - bay * yy, qz = paz * l2 - baz * yy;
      const x2 = qx * qx + qy * qy + qz * qz;
      const y2 = yy * yy * l2;
      const z2 = zz * zz * l2;
      const k = Math.sign(rr) * rr * rr * x2;
      if (Math.sign(zz) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - rb;
      if (Math.sign(yy) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - ra;
      return (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - ra;
    },
    c: [(ax + b[0]) / 2, (ay + b[1]) / 2, (az + b[2]) / 2],
    r: Math.sqrt(l2) / 2 + Math.max(ra, rb),
  };
}

/** A chain of limbs through points, each with its radius: an arm, a lock of hair. */
export function chain(points: Array<[V3, number]>): Shape {
  const parts = points.slice(1).map((p, i) => cone(points[i][0], p[0], points[i][1], p[1]));
  return union(...parts);
}

/** Several shapes as one, hard-edged where they meet. */
export function union(...shapes: Shape[]): Shape {
  const c: V3 = [0, 0, 0];
  shapes.forEach(s => s.c.forEach((v, i) => (c[i] += v / shapes.length)));
  const r = Math.max(...shapes.map(s => Math.hypot(s.c[0] - c[0], s.c[1] - c[1], s.c[2] - c[2]) + s.r));
  return {
    d: (x, y, z) => {
      let d = Infinity;
      for (const s of shapes) d = Math.min(d, s.d(x, y, z));
      return d;
    },
    c,
    r,
  };
}

/**
 * Only the part of `s` on the inside of a plane: points where n·p < offset. `soft` rounds the cut edge.
 * For a hairline, the bottom of a grin, the front of an apron.
 */
export function clip(s: Shape, n: V3, offset: number, soft = 0): Shape {
  const len = Math.hypot(...n);
  const [nx, ny, nz] = n.map(v => v / len);
  return {
    d: (x, y, z) => smax(s.d(x, y, z), nx * x + ny * y + nz * z - offset, soft),
    c: s.c,
    r: s.r,
  };
}

/** Only where `s` and `t` overlap. */
export function intersect(s: Shape, t: Shape, soft = 0): Shape {
  return { d: (x, y, z) => smax(s.d(x, y, z), t.d(x, y, z), soft), c: s.c, r: s.r };
}

/** A shell `t` thick round the outside of `s`: a layer of hair over a skull, a beard over a jaw. */
export function shell(s: Shape, t: number): Shape {
  return { d: (x, y, z) => s.d(x, y, z) - t, c: s.c, r: s.r + t };
}

function smax(a: number, b: number, k: number) {
  if (k <= 0) return Math.max(a, b);
  const h = clamp01(0.5 - (0.5 * (b - a)) / k);
  return b + (a - b) * h + k * h * (1 - h);
}

// ---------- the sculpt ----------

export class Sculpt {
  private steps: Step[] = [];
  /** Colour edges are never sharper than the mesh can show (a vertex apart), or they come out jagged. */
  private minCk = 0;

  /** Add clay of `color`, melting into what is there over `k`. */
  add(s: Shape, color: string, k = 0, ck = Math.min(k, 0.006)) {
    this.steps.push({ op: 'add', s, k, ck, col: rgb(color) });
    return this;
  }

  /** Carve `s` away, softened over `k`; the cut surface takes `color` if given (the inside of a mouth). */
  sub(s: Shape, k = 0, color?: string, ck = 0.004) {
    this.steps.push({ op: 'sub', s, k, ck, col: color ? rgb(color) : undefined });
    return this;
  }

  /** Paint the surface inside `s` with `color`; `soft` blurs the edge. */
  paint(s: Shape, color: string, soft = 0.004) {
    this.steps.push({ op: 'paint', s, k: soft, ck: soft, col: rgb(color) });
    return this;
  }

  /** Distance to the surface (negative inside). */
  dist(x: number, y: number, z: number) {
    let d = 1e9;
    for (const st of this.steps) {
      if (st.op === 'paint') continue;
      const s = st.s;
      const lb = Math.sqrt((x - s.c[0]) ** 2 + (y - s.c[1]) ** 2 + (z - s.c[2]) ** 2) - s.r;
      const k = st.k;
      if (st.op === 'add') {
        if (lb >= d + k) continue;
        const ds = s.d(x, y, z);
        if (k <= 0) d = Math.min(d, ds);
        else {
          const h = clamp01(0.5 + (0.5 * (ds - d)) / k);
          d = ds + (d - ds) * h - k * h * (1 - h);
        }
      } else {
        if (lb >= k - d) continue;
        d = smax(d, -s.d(x, y, z), k);
      }
    }
    return d;
  }

  /**
   * Where a ray from `p` straight back (towards -z) meets the surface, lifted `lift` off it along the
   * normal: for placing eyes on a face, or drawing a smile or a brow onto it.
   */
  onSurface(p: V3, lift = 0): V3 {
    const [x, y] = p;
    let z = p[2];
    for (let i = 0; i < 200; i++) {
      const d = this.dist(x, y, z);
      if (d < 1e-5) break;
      z -= Math.max(d, 1e-4);
    }
    const e = 1e-4;
    const d = this.dist(x, y, z);
    let gx = this.dist(x + e, y, z) - d;
    let gy = this.dist(x, y + e, z) - d;
    let gz = this.dist(x, y, z + e) - d;
    const g = Math.hypot(gx, gy, gz) || 1;
    gx /= g;
    gy /= g;
    gz /= g;
    return [x + gx * lift, y + gy * lift, z + gz * lift];
  }

  /** The colour at a point on the surface. */
  colour(x: number, y: number, z: number): V3 {
    let d = 1e9;
    let r = 0, g = 0, b = 0;
    for (const st of this.steps) {
      const s = st.s;
      const c = st.col;
      const ck = Math.max(st.ck, this.minCk, 1e-4);
      if (st.op === 'paint') {
        const lb = Math.sqrt((x - s.c[0]) ** 2 + (y - s.c[1]) ** 2 + (z - s.c[2]) ** 2) - s.r;
        if (lb > ck) continue;
        const w = clamp01((ck - s.d(x, y, z)) / (2 * ck));
        r += (c![0] - r) * w;
        g += (c![1] - g) * w;
        b += (c![2] - b) * w;
        continue;
      }
      const lb = Math.sqrt((x - s.c[0]) ** 2 + (y - s.c[1]) ** 2 + (z - s.c[2]) ** 2) - s.r;
      const k = st.k;
      if (st.op === 'add') {
        if (lb >= d + Math.max(k, ck)) continue;
        const ds = s.d(x, y, z);
        const w = 1 - clamp01(0.5 + (0.5 * (ds - d)) / ck);
        r += (c![0] - r) * w;
        g += (c![1] - g) * w;
        b += (c![2] - b) * w;
        if (k <= 0) d = Math.min(d, ds);
        else {
          const h = clamp01(0.5 + (0.5 * (ds - d)) / k);
          d = ds + (d - ds) * h - k * h * (1 - h);
        }
      } else {
        if (lb >= Math.max(k, ck) - d) continue;
        const ds = -s.d(x, y, z);
        if (c) {
          const w = clamp01(0.5 + (0.5 * (ds - d)) / ck);
          r += (c[0] - r) * w;
          g += (c[1] - g) * w;
          b += (c[2] - b) * w;
        }
        d = smax(d, ds, k);
      }
    }
    return [r, g, b];
  }

  /**
   * The surface as a mesh, `cell` apart (surface nets: one vertex per grid cell the surface passes
   * through, pulled onto the surface, with normals from the field so it shades smooth).
   */
  mesh(cell: number): BufferGeometry {
    this.minCk = cell * 0.5;
    // Bounds: everything added, with a margin.
    const lo: V3 = [Infinity, Infinity, Infinity];
    const hi: V3 = [-Infinity, -Infinity, -Infinity];
    for (const st of this.steps) {
      if (st.op !== 'add') continue;
      for (let i = 0; i < 3; i++) {
        lo[i] = Math.min(lo[i], st.s.c[i] - st.s.r - st.k);
        hi[i] = Math.max(hi[i], st.s.c[i] + st.s.r + st.k);
      }
    }
    for (let i = 0; i < 3; i++) {
      lo[i] -= cell * 2;
      hi[i] += cell * 2;
    }
    const nx = Math.ceil((hi[0] - lo[0]) / cell) + 1;
    const ny = Math.ceil((hi[1] - lo[1]) / cell) + 1;
    const nz = Math.ceil((hi[2] - lo[2]) / cell) + 1;
    const at = (i: number, j: number, k: number) => i + nx * (j + ny * k);

    // The field on a coarse grid first; the fine grid is only worked out exactly near the surface
    // (a distance field can't change faster than the distance moved).
    const C = 4;
    const cnx = Math.ceil(nx / C) + 1, cny = Math.ceil(ny / C) + 1, cnz = Math.ceil(nz / C) + 1;
    const coarse = new Float32Array(cnx * cny * cnz);
    for (let k = 0; k < cnz; k++)
      for (let j = 0; j < cny; j++)
        for (let i = 0; i < cnx; i++) coarse[i + cnx * (j + cny * k)] = this.dist(lo[0] + i * C * cell, lo[1] + j * C * cell, lo[2] + k * C * cell);
    const band = C * cell * 1.3;
    const v = new Float32Array(nx * ny * nz);
    for (let k = 0; k < nz; k++)
      for (let j = 0; j < ny; j++)
        for (let i = 0; i < nx; i++) {
          const cv = coarse[Math.round(i / C) + cnx * (Math.round(j / C) + cny * Math.round(k / C))];
          v[at(i, j, k)] = Math.abs(cv) > band ? cv : this.dist(lo[0] + i * cell, lo[1] + j * cell, lo[2] + k * cell);
        }

    // A vertex in every cell the surface crosses.
    const cellIdx = new Int32Array(nx * ny * nz).fill(-1);
    const pos: number[] = [];
    const corners = [
      [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
      [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],
    ];
    const edges = [
      [0, 1], [2, 3], [4, 5], [6, 7],
      [0, 2], [1, 3], [4, 6], [5, 7],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    const val = new Float32Array(8);
    for (let k = 0; k < nz - 1; k++)
      for (let j = 0; j < ny - 1; j++)
        for (let i = 0; i < nx - 1; i++) {
          let inside = 0;
          for (let c = 0; c < 8; c++) {
            const [a, b, d] = corners[c];
            val[c] = v[at(i + a, j + b, k + d)];
            if (val[c] < 0) inside++;
          }
          if (inside === 0 || inside === 8) continue;
          let sx = 0, sy = 0, sz = 0, n = 0;
          for (const [e0, e1] of edges) {
            const a = val[e0], b = val[e1];
            if (a < 0 === b < 0) continue;
            const t = a / (a - b);
            const p = corners[e0], q = corners[e1];
            sx += p[0] + (q[0] - p[0]) * t;
            sy += p[1] + (q[1] - p[1]) * t;
            sz += p[2] + (q[2] - p[2]) * t;
            n++;
          }
          cellIdx[at(i, j, k)] = pos.length / 3;
          pos.push(lo[0] + (i + sx / n) * cell, lo[1] + (j + sy / n) * cell, lo[2] + (k + sz / n) * cell);
        }

    // Two triangles for every grid edge the surface crosses, joining the four cells round it.
    const idx: number[] = [];
    const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
      if (a < 0 || b < 0 || c < 0 || d < 0) return;
      if (flip) [b, d] = [d, b];
      idx.push(a, b, c, a, c, d);
    };
    for (let k = 1; k < nz - 1; k++)
      for (let j = 1; j < ny - 1; j++)
        for (let i = 0; i < nx - 1; i++) {
          const a = v[at(i, j, k)], b = v[at(i + 1, j, k)];
          if (a < 0 === b < 0) continue;
          quad(cellIdx[at(i, j - 1, k - 1)], cellIdx[at(i, j, k - 1)], cellIdx[at(i, j, k)], cellIdx[at(i, j - 1, k)], !(a < 0));
        }
    for (let k = 1; k < nz - 1; k++)
      for (let j = 0; j < ny - 1; j++)
        for (let i = 1; i < nx - 1; i++) {
          const a = v[at(i, j, k)], b = v[at(i, j + 1, k)];
          if (a < 0 === b < 0) continue;
          quad(cellIdx[at(i - 1, j, k - 1)], cellIdx[at(i - 1, j, k)], cellIdx[at(i, j, k)], cellIdx[at(i, j, k - 1)], !(a < 0));
        }
    for (let k = 0; k < nz - 1; k++)
      for (let j = 1; j < ny - 1; j++)
        for (let i = 1; i < nx - 1; i++) {
          const a = v[at(i, j, k)], b = v[at(i, j, k + 1)];
          if (a < 0 === b < 0) continue;
          quad(cellIdx[at(i - 1, j - 1, k)], cellIdx[at(i, j - 1, k)], cellIdx[at(i, j, k)], cellIdx[at(i - 1, j, k)], !(a < 0));
        }

    // Pull each vertex onto the surface, and take its normal and colour there.
    const count = pos.length / 3;
    const P = new Float32Array(pos.length);
    const N = new Float32Array(pos.length);
    const Cl = new Float32Array(pos.length);
    const e = cell * 0.5;
    for (let n = 0; n < count; n++) {
      let x = pos[n * 3], y = pos[n * 3 + 1], z = pos[n * 3 + 2];
      // One step along the field's gradient onto the surface; the gradient is the normal too.
      const d = this.dist(x, y, z);
      let gx = this.dist(x + e, y, z) - d;
      let gy = this.dist(x, y + e, z) - d;
      let gz = this.dist(x, y, z + e) - d;
      const g = Math.hypot(gx, gy, gz) || 1;
      gx /= g;
      gy /= g;
      gz /= g;
      const m = Math.max(-cell * 0.5, Math.min(cell * 0.5, d));
      x -= gx * m;
      y -= gy * m;
      z -= gz * m;
      P.set([x, y, z], n * 3);
      N.set([gx, gy, gz], n * 3);
      Cl.set(this.colour(x, y, z), n * 3);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(P, 3));
    geo.setAttribute('normal', new BufferAttribute(N, 3));
    geo.setAttribute('color', new BufferAttribute(Cl, 3));
    geo.setIndex(idx);
    geo.computeBoundingSphere();
    return geo;
  }
}

/** Sculpted meshes by what they are made of, so a view built again (a tab switch) doesn't re-sculpt. */
const made = new Map<string, BufferGeometry>();
export function sculpted(key: string, cell: number, build: () => Sculpt) {
  let g = made.get(key);
  if (!g) {
    g = build().mesh(cell);
    made.set(key, g);
  }
  return g;
}

/** `s` with `t` taken out of it: a crescent from two ellipses. */
export function minus(s: Shape, t: Shape, soft = 0): Shape {
  return { d: (x, y, z) => smax(s.d(x, y, z), -t.d(x, y, z), soft), c: s.c, r: s.r };
}
