// Builds src/assets/island.glb: the house-on-a-yard diorama the 3D energy card shows.
//
//   npm run model
//
// The look is soft clay: rounded shapes, smooth shading, no textures. To keep the file small the GLB
// carries positions and indices only; vertices are split wherever an edge should stay crisp, and the
// card rebuilds smooth normals on load (the root node's extras say `normals: "compute"`).
//
// The card finds the live parts by name, so a replacement model (from Blender, say) only has to keep
// these names:
//
//   windows            mesh, material "Window": glows warm at night
//   lamp               mesh, material "Lamp": the lantern on the post, lit at night
//   drive_lights       mesh, material "DriveLight": the bollards along the driveway
//   glow_*             empty nodes; extras.glow = { radius, color } puts a pool of light on the ground
//                      under a light (driveway bollards)
//   car                node: the parked car, hidden when the card has no car; material "CarPaint" is
//                      tinted to the car's colour
//   charge_cable       mesh: shown while the car is plugged in
//   charger_led        mesh: the wallbox's status light
//   solar              node: hidden when the card has no solar sensor
//   bin_0, bin_1...    nodes: two-compartment wheelie bins, one per collection round in order;
//                      materials "Bin<n>A" and "Bin<n>B" are tinted to its two kinds of waste, and
//                      extras.out = [dx, dz] is how far it rolls to the kerb around collection day
//   anchor_<key>       empty nodes: where the labels for solar, grid, car, home and water sit
//   flow_<key>         empty nodes whose extras.points is the polyline the flow line follows,
//                      from the source to the house
//   light_<name>       empty nodes whose extras.light describes a point light that comes on at night
// Materials named Pine, PineDark, Leaf and Bush sway in the wind; "Brick" gets a brick pattern.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// GLTFExporter reads its output through FileReader, which Node lacks.
globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(b => {
      this.result = b;
      this.onloadend?.();
    });
  }
};

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/assets/island.glb');

// ---------- helpers ----------

let seed = 11;
const rand = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
/** Repeatable noise from a position, so vertices shared by several faces move together. */
const hash = (x, y, z) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

const mats = new Map();
const mat = (name, color, extra = {}) => {
  if (!mats.has(name)) mats.set(name, new THREE.MeshStandardMaterial({ name, color, roughness: 0.9, metalness: 0, ...extra }));
  return mats.get(name);
};

// A soft clay palette: slightly chalky, never fully saturated.
const M = {
  grass: mat('Grass', '#8dbb67'),
  soil: mat('Soil', '#b88a63'),
  base: mat('Base', '#5b524b'),
  brick: mat('Brick', '#e2c070'),
  trim: mat('Trim', '#f4f1ea'),
  roof: mat('Roof', '#45494f'),
  wood: mat('Wood', '#8a6446'),
  woodLight: mat('WoodLight', '#c49a6c'),
  pine: mat('Pine', '#4f8a5c'),
  pineDark: mat('PineDark', '#43785a'),
  leaf: mat('Leaf', '#a5c867'),
  bush: mat('Bush', '#6fa35e'),
  trunk: mat('Trunk', '#9a7556'),
  stone: mat('Stone', '#c2bcb2'),
  paving: mat('Paving', '#9d9a95'),
  plinth: mat('Plinth', '#8f8c88'),
  solar: mat('Solar', '#24395c', { roughness: 0.3, metalness: 0.3 }),
  metal: mat('Metal', '#cfd4d8', { roughness: 0.45, metalness: 0.4 }),
  dark: mat('Dark', '#33373b'),
  appliance: mat('Appliance', '#eceeef', { roughness: 0.6 }),
  water: mat('Water', '#5fb3d6', { roughness: 0.15 }),
  window: mat('Window', '#2b3a44', { roughness: 0.2, emissive: '#ffc27a', emissiveIntensity: 0 }),
  lamp: mat('Lamp', '#ffe2b0', { emissive: '#ffc27a', emissiveIntensity: 0 }),
  driveLight: mat('DriveLight', '#ffe9c4', { emissive: '#ffc983', emissiveIntensity: 0 }),
  door: mat('Door', '#5a4636'),
  wire: mat('Wire', '#2e2e2e', { roughness: 0.6 }),
  flower: mat('Flower', '#f2cf5a'),
  flowerPink: mat('FlowerPink', '#ec9fb0'),
};

/**
 * Ready a geometry for merging: indexed, normals, no UVs. `smooth` rebuilds the normals over shared
 * positions (for organic shapes); otherwise each face keeps the normals it was built with, so a box
 * keeps its crisp edges.
 */
function prep(g, smooth = false) {
  if (g.attributes.uv) g.deleteAttribute('uv');
  if (g.attributes.uv1) g.deleteAttribute('uv1');
  if (smooth) {
    g.deleteAttribute('normal');
    g = mergeVertices(g, 1e-4);
    g.computeVertexNormals();
    return g;
  }
  if (!g.attributes.normal) g.computeVertexNormals();
  return g.index ? g : mergeVertices(g, 1e-4);
}

function place(g, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1]) {
  const m = new THREE.Matrix4().compose(new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(...scale));
  return g.applyMatrix4(m);
}

/** Merges parts by material into one mesh per material. */
class Bucket {
  parts = new Map();
  add(g, m, pos, rot, scale, smooth = false) {
    const geo = place(prep(g, smooth), pos, rot, scale);
    if (!this.parts.has(m)) this.parts.set(m, []);
    this.parts.get(m).push(geo);
    return geo;
  }
  /** Organic shapes: smooth normals. */
  soft(g, m, pos, rot, scale) {
    return this.add(g, m, pos, rot, scale, true);
  }
  into(group, prefix) {
    for (const [m, geos] of this.parts) {
      const mesh = new THREE.Mesh(mergeGeometries(geos), m);
      mesh.name = this.parts.size === 1 ? prefix : `${prefix}_${m.name.toLowerCase()}`;
      group.add(mesh);
    }
    return group;
  }
}

const jitter = (g, amount) => {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = (a, b, c) => (hash(Math.round(a * 1000), Math.round(b * 1000), Math.round(c * 1000)) - 0.5) * amount;
    p.setXYZ(i, x + k(x, y, z), y + k(y, z, x), z + k(z, x, y));
  }
  return g;
};

const rbox = (w, h, d, r = 0.04, seg = 1) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3));
const cyl = (rt, rb, h, seg = 12) => new THREE.CylinderGeometry(rt, rb, h, seg);
const sphere = (r, w = 14, h = 10) => new THREE.SphereGeometry(r, w, h);
/** A lathe from [radius, y] pairs, swept around Y. Profiles run upwards for outward-facing surfaces. */
const lathe = (pts, seg = 24) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

const scene = new THREE.Scene();
const island = new THREE.Group();
island.name = 'island';
island.userData = { normals: 'compute' };
scene.add(island);
const S = new Bucket();

// ---------- the yard: a thick soft-edged slab, lawn on top, a sidewalk along the front ----------

const YARD = { x0: -5.4, x1: 5.4, z0: -3.6, z1: 5.2 };
const WALK = { z0: 4.1, z1: YARD.z1 };
const YW = YARD.x1 - YARD.x0, YD = YARD.z1 - YARD.z0, YCX = (YARD.x0 + YARD.x1) / 2, YCZ = (YARD.z0 + YARD.z1) / 2;
/** Is (x, z) at least `margin` inside the lawn (not on the sidewalk)? */
const inside = (x, z, margin = 0.4) => x > YARD.x0 + margin && x < YARD.x1 - margin && z > YARD.z0 + margin && z < WALK.z0 - margin;
S.add(rbox(YW, 0.3, YD, 0.14, 3), M.grass, [YCX, -0.15, YCZ]);
S.add(rbox(YW - 0.02, 1.1, YD - 0.02, 0.14, 3), M.base, [YCX, -0.82, YCZ]);
// Sidewalk: pale slabs with joints, a kerb on the lawn side.
S.add(rbox(YW, 0.12, WALK.z1 - WALK.z0, 0.05, 2), M.stone, [YCX, 0.0, (WALK.z0 + WALK.z1) / 2]);
for (let x = YARD.x0 + 0.9; x < YARD.x1 - 0.2; x += 0.9) S.add(new THREE.BoxGeometry(0.02, 0.122, WALK.z1 - WALK.z0 - 0.1), M.plinth, [x, 0.0, (WALK.z0 + WALK.z1) / 2]);

// ---------- the house: yellow brick, white windows, a dark roof ----------
// Body x ∈ [-2.1, 2.1], z ∈ [-2.1, 0.9], walls 2.2 high, ridge at 3.5 along x. Front (door) faces +z.

const HX = 2.1, HZ1 = 0.9, HZC = -0.6, WALL = 2.2, RIDGE = 3.5;
const house = new Bucket();
const RUN = 1.8, RISE = (RIDGE - WALL) * (RUN / 1.5), ANG = Math.atan2(RISE, RUN);
{
  const s = new THREE.Shape();
  s.moveTo(-1.5, 0);
  s.lineTo(1.5, 0);
  s.lineTo(1.5, WALL);
  s.lineTo(0, RIDGE);
  s.lineTo(-1.5, WALL);
  s.closePath();
  const body = new THREE.ExtrudeGeometry(s, { depth: HX * 2 - 0.08, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
  house.add(body, M.brick, [-HX + 0.04, 0, HZC], [0, Math.PI / 2, 0]);
  // Plinth.
  house.add(rbox(HX * 2 + 0.16, 0.26, 3.16, 0.06), M.plinth, [0, 0.13, HZC]);
  // Roof: two thick soft slabs with a rounded ridge, white fascia boards under the eaves.
  const len = Math.hypot(RUN, RISE) + 0.1;
  for (const side of [1, -1]) {
    const mid = new THREE.Vector3(0, RIDGE - RISE / 2 + Math.cos(ANG) * 0.09, HZC + (side * RUN) / 2 + side * Math.sin(ANG) * 0.09);
    house.add(rbox(HX * 2 + 0.55, 0.18, len, 0.08, 3), M.roof, mid.toArray(), [side * ANG, 0, 0]);
    // Soft tile ridges across the slope.
    for (let i = 1; i < 6; i++) {
      const t = i / 6 - 0.5;
      const p = mid.clone().add(new THREE.Vector3(0, Math.cos(ANG) * 0.1 - t * len * Math.sin(ANG), side * (t * len * Math.cos(ANG) + Math.sin(ANG) * 0.1)));
      house.soft(cyl(0.035, 0.035, HX * 2 + 0.5, 8), M.roof, p.toArray(), [0, 0, Math.PI / 2]);
    }
    const eave = new THREE.Vector3(0, WALL - 0.3 * (RISE / RUN) - 0.05, HZC + side * (1.5 + 0.3));
    house.add(rbox(HX * 2 + 0.55, 0.14, 0.06, 0.03), M.trim, eave.toArray());
  }
  house.soft(cyl(0.11, 0.11, HX * 2 + 0.6, 12), M.roof, [0, RIDGE + 0.15, HZC], [0, 0, Math.PI / 2]);
  // Chimney on the back slope, brick with a dark cap.
  house.add(rbox(0.5, 1.4, 0.5, 0.05), M.brick, [-1.0, RIDGE - 0.15, -1.45]);
  house.add(rbox(0.62, 0.12, 0.62, 0.05), M.dark, [-1.0, RIDGE + 0.6, -1.45]);
  // Door with frame, step, handle and a little porch roof.
  house.add(rbox(0.82, 1.78, 0.08, 0.03), M.door, [0.4, 0.26 + 0.89, HZ1 + 0.03]);
  for (const y of [0.75, 1.25]) house.add(rbox(0.6, 0.3, 0.03, 0.02), M.door, [0.4, y, HZ1 + 0.08]);
  house.add(rbox(1.0, 0.1, 0.14, 0.04), M.trim, [0.4, 2.1, HZ1 + 0.05]);
  for (const x of [-0.05, 0.85]) house.add(rbox(0.1, 1.86, 0.14, 0.04), M.trim, [x, 1.17, HZ1 + 0.05]);
  house.add(rbox(1.2, 0.16, 0.6, 0.06), M.stone, [0.4, 0.08, HZ1 + 0.3]);
  house.soft(sphere(0.04, 8, 6), M.metal, [0.7, 1.15, HZ1 + 0.12]);
  house.add(rbox(1.3, 0.1, 0.7, 0.05), M.roof, [0.4, 2.3, HZ1 + 0.33], [-0.25, 0, 0]);
  // Meter cabinet, where every flow line ends.
  house.add(rbox(0.5, 0.5, 0.12, 0.04), M.appliance, [-0.45, 0.6, HZ1 + 0.06]);
  house.add(rbox(0.3, 0.12, 0.02, 0.01), M.dark, [-0.45, 0.68, HZ1 + 0.13]);
  // Outdoor tap for the water line.
  house.add(cyl(0.04, 0.04, 0.18, 8), M.metal, [1.7, 0.4, HZ1 + 0.09], [Math.PI / 2, 0, 0]);
  house.soft(sphere(0.06, 8, 6), M.metal, [1.7, 0.48, HZ1 + 0.17]);
}

// Windows: panes in one mesh (they glow together), frames and sills with the house.
const glass = new Bucket();
function windowAt(face, u, v, w, h) {
  // face: 'front' (z = HZ1) or 'side' (x = HX). u is the along-wall centre, v the centre height.
  const at = (du, dv, dn) => (face === 'front' ? [u + du, v + dv, HZ1 + dn] : [HX + dn, v + dv, u + du]);
  const rot = face === 'front' ? [0, 0, 0] : [0, Math.PI / 2, 0];
  // The wall's bevel puts its surface 0.04 out; the pane sits clearly in front of it, or the two fight
  // for the same depth and flicker as the view moves.
  glass.add(rbox(w, h, 0.04, 0.015), M.window, at(0, 0, 0.055), rot);
  const t = 0.08;
  house.add(rbox(w + t * 2, t, 0.1, 0.035), M.trim, at(0, h / 2 + t / 2, 0.04), rot);
  house.add(rbox(w + t * 3, t * 1.2, 0.18, 0.04), M.trim, at(0, -h / 2 - t / 2, 0.07), rot);
  house.add(rbox(t, h, 0.1, 0.035), M.trim, at(-w / 2 - t / 2, 0, 0.04), rot);
  house.add(rbox(t, h, 0.1, 0.035), M.trim, at(w / 2 + t / 2, 0, 0.04), rot);
  house.add(rbox(0.05, h, 0.07, 0.02), M.trim, at(0, 0, 0.05), rot);
  house.add(rbox(w, 0.05, 0.07, 0.02), M.trim, at(0, 0, 0.05), rot);
}
windowAt('front', -1.2, 1.35, 0.8, 0.9);
windowAt('front', 1.5, 1.35, 0.7, 0.9);
windowAt('side', -0.9, 1.35, 0.8, 0.9);
windowAt('side', HZC, 2.75, 0.45, 0.45);
glass.add(rbox(0.36, 0.5, 0.03, 0.01), M.window, [0.4, 1.6, HZ1 + 0.1]);
const houseGroup = house.into(new THREE.Group(), 'house');
houseGroup.name = 'house';
island.add(houseGroup);
const windows = new THREE.Mesh(mergeGeometries(glass.parts.get(M.window)), M.window);
windows.name = 'windows';
island.add(windows);

// ---------- solar panels on the front slope ----------
{
  const solar = new Bucket();
  // Built flat in slope space (x across, z down the slope), then tilted onto the roof.
  const pw = 0.9, pl = 0.62, gap = 0.07;
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 3; c++) {
      const x = (c - 1) * (pw + gap);
      const z = 0.35 + r * (pl + gap);
      solar.add(rbox(pw + 0.04, 0.05, pl + 0.04, 0.02), M.metal, [x, -0.01, z]);
      solar.add(rbox(pw, 0.05, pl, 0.015), M.solar, [x, 0.005, z]);
      for (const dx of [-pw / 3, 0, pw / 3]) solar.add(new THREE.BoxGeometry(0.01, 0.052, pl - 0.02), M.metal, [x + dx, 0.006, z]);
      solar.add(new THREE.BoxGeometry(pw - 0.02, 0.052, 0.01), M.metal, [x, 0.006, z]);
    }
  const g = solar.into(new THREE.Group(), 'solar');
  g.name = 'solar';
  g.position.set(0, RIDGE + 0.24, HZC + 0.05);
  g.rotation.set(ANG, 0, 0);
  island.add(g);
}

// ---------- the car: a white ID.5-like crossover with a black glass roof ----------
// Car group origin on the ground at its centre; front towards +z. The charge port is on the house
// side near the front, so the cable stays in view from the camera's side.
const CAR = { x: 3.4, z: -0.3 };
const PORT = new THREE.Vector3(CAR.x - 0.6, 0.68, CAR.z + 0.95);
const WALLBOX = new THREE.Vector3(HX + 0.14, 1.0, CAR.z + 0.95);
{
  const car = new THREE.Group();
  car.name = 'car';
  car.position.set(CAR.x, 0, CAR.z);
  const b = new Bucket();
  const paint = mat('CarPaint', '#eef0f1', { roughness: 0.3, metalness: 0.1 });
  const glassM = mat('CarGlass', '#14181c', { roughness: 0.12, metalness: 0.3 });
  const trimM = mat('CarTrim', '#202326', { roughness: 0.7 });

  // Side profiles (z along the car, y up) extruded across the car with soft bevelled edges.
  const profile = (draw, width, m, bevel = 0.07) => {
    const s = new THREE.Shape();
    draw(s);
    const g = new THREE.ExtrudeGeometry(s, { depth: width - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 3, curveSegments: 10 });
    // Shape x -> world z, extrusion -> world x, centred.
    b.add(g, m, [width / 2 - bevel, 0, 0], [0, -Math.PI / 2, 0]);
  };
  // Lower body: a low rounded nose, long bonnet, a short tail with a lip.
  profile(
    s => {
      s.moveTo(-1.3, 0.3);
      s.lineTo(1.25, 0.3);
      s.quadraticCurveTo(1.42, 0.32, 1.42, 0.5);
      s.quadraticCurveTo(1.4, 0.68, 1.15, 0.74);
      s.lineTo(0.75, 0.82);
      s.lineTo(-1.2, 0.86);
      s.quadraticCurveTo(-1.42, 0.84, -1.42, 0.62);
      s.quadraticCurveTo(-1.42, 0.32, -1.3, 0.3);
    },
    1.16,
    paint,
  );
  // Black glasshouse: windscreen, side glass and the panoramic roof in one dark piece, coupé roofline.
  profile(
    s => {
      s.moveTo(0.8, 0.8);
      s.quadraticCurveTo(0.45, 1.12, 0.2, 1.17);
      s.lineTo(-0.6, 1.16);
      s.quadraticCurveTo(-1.05, 1.1, -1.22, 0.86);
      s.lineTo(0.8, 0.8);
    },
    1.02,
    glassM,
    0.08,
  );
  // Black cladding: sills, bumpers and wheel arches, the ID.5's dark lower band.
  b.add(rbox(1.18, 0.12, 1.5, 0.05), trimM, [0, 0.33, 0.02]);
  b.add(rbox(1.12, 0.14, 0.12, 0.05), trimM, [0, 0.36, 1.38]);
  b.add(rbox(1.12, 0.14, 0.12, 0.05), trimM, [0, 0.38, -1.38]);
  for (const x of [-0.58, 0.58])
    for (const z of [-0.85, 0.88]) {
      b.soft(new THREE.TorusGeometry(0.33, 0.05, 6, 16, Math.PI), trimM, [x, 0.33, z], [0, Math.PI / 2, 0]);
      // Tyre and a dark aero rim.
      b.soft(cyl(0.3, 0.3, 0.24, 18), M.dark, [x * 0.95, 0.3, z], [0, 0, Math.PI / 2]);
      b.soft(cyl(0.19, 0.19, 0.02, 14), mat('Rim', '#5c6268', { roughness: 0.4, metalness: 0.5 }), [x * 0.95 + Math.sign(x) * 0.12, 0.3, z], [0, 0, Math.PI / 2]);
    }
  // Light bar across the nose, LED strip across the tail.
  b.add(rbox(0.98, 0.04, 0.04, 0.015), mat('CarLights', '#f3f8ff', { emissive: '#eef6ff', emissiveIntensity: 0.5 }), [0, 0.66, 1.38]);
  b.add(rbox(1.0, 0.05, 0.04, 0.015), mat('CarTail', '#c8302a', { emissive: '#c8302a', emissiveIntensity: 0.5 }), [0, 0.74, -1.4]);
  // Mirrors, roof rails, charge flap.
  for (const x of [-0.6, 0.6]) b.add(rbox(0.12, 0.08, 0.14, 0.03), trimM, [x, 0.9, 0.62]);
  for (const x of [-0.46, 0.46]) b.add(rbox(0.03, 0.03, 1.0, 0.012), M.metal, [x, 1.19, -0.25]);
  b.add(rbox(0.02, 0.1, 0.1, 0.008), trimM, [-0.59, 0.68, 0.95]);
  b.into(car, 'car_body');
  island.add(car);

  // Wallbox, its status light, the cable (shown while plugged in).
  S.add(rbox(0.16, 0.44, 0.34, 0.05), M.appliance, WALLBOX.toArray());
  S.add(rbox(0.08, 0.12, 0.12, 0.03), M.dark, [WALLBOX.x + 0.1, WALLBOX.y - 0.12, WALLBOX.z]);
  const led = new THREE.Mesh(prep(place(rbox(0.03, 0.05, 0.22, 0.01), [WALLBOX.x + 0.085, WALLBOX.y + 0.12, WALLBOX.z])), mat('ChargerLed', '#58c27a', { emissive: '#58c27a', emissiveIntensity: 0.6 }));
  led.name = 'charger_led';
  island.add(led);
}

// ---------- the driveway, with three bollard lights along its right side ----------
const DRIVE = { x: CAR.x, w: 1.9, z0: CAR.z - 1.6 };
{
  // Runs from behind the car out to the sidewalk.
  const z1 = WALK.z0;
  DRIVE.z1 = z1;
  const len = z1 - DRIVE.z0;
  S.add(rbox(DRIVE.w, 0.08, len, 0.04), M.paving, [DRIVE.x, 0.0, DRIVE.z0 + len / 2]);
  // Paver joints.
  for (let z = DRIVE.z0 + 0.5; z < z1 - 0.1; z += 0.5) S.add(new THREE.BoxGeometry(DRIVE.w - 0.1, 0.082, 0.02), M.plinth, [DRIVE.x, 0.0, z]);
  // Kerb along both sides.
  for (const s of [-1, 1]) S.add(rbox(0.1, 0.1, len, 0.04), M.stone, [DRIVE.x + (s * DRIVE.w) / 2, 0.03, DRIVE.z0 + len / 2]);

  const lights = new Bucket();
  const bx = DRIVE.x + DRIVE.w / 2 + 0.28;
  const span = z1 - 0.4 - (DRIVE.z0 + 1.2);
  for (let i = 0; i < 3; i++) {
    const z = DRIVE.z0 + 1.2 + (span * i) / 2;
    S.add(rbox(0.16, 0.5, 0.16, 0.05), M.dark, [bx, 0.25, z]);
    S.add(rbox(0.2, 0.05, 0.2, 0.02), M.dark, [bx, 0.62, z]);
    lights.add(rbox(0.13, 0.1, 0.13, 0.03), M.driveLight, [bx, 0.54, z]);
    const glow = new THREE.Object3D();
    glow.name = `glow_drive_${i}`;
    // Above the sidewalk's top (0.06) and the kerb, so the pool of light never shares their depth.
    glow.position.set(bx - 0.15, 0.11, z);
    glow.userData = { glow: { radius: 0.95, color: '#ffc983' } };
    island.add(glow);
  }
  const lm = new THREE.Mesh(mergeGeometries(lights.parts.get(M.driveLight)), M.driveLight);
  lm.name = 'drive_lights';
  island.add(lm);
}

// ---------- grid: a pole fed from the street, and the line to the house ----------
const POLE = { x: -3.55, z: 1.2, h: 3.9 };
/** Where the grid cable comes in from the street: left of the bins, then under the lawn to the pole. */
const GRID_IN = -4.7;
{
  S.soft(cyl(0.07, 0.09, POLE.h, 10), M.wood, [POLE.x, POLE.h / 2, POLE.z]);
  S.add(rbox(1.0, 0.1, 0.1, 0.03), M.wood, [POLE.x, POLE.h - 0.25, POLE.z], [0, Math.atan2(1, 1.4) - Math.PI / 4, 0]);
  for (const d of [-0.38, 0, 0.38]) S.soft(cyl(0.035, 0.05, 0.16, 8), M.appliance, [POLE.x + d * 0.7, POLE.h - 0.12, POLE.z - d * 0.7]);
  S.soft(cyl(0.16, 0.16, 0.42, 12), M.metal, [POLE.x + 0.14, POLE.h - 0.75, POLE.z + 0.1]);
}

/** A sagging wire from a to b, as points. */
function sag(a, b, drop, n = 14) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = new THREE.Vector3().lerpVectors(a, b, t);
    p.y -= Math.sin(t * Math.PI) * drop;
    pts.push(p);
  }
  return pts;
}
const poleTop = new THREE.Vector3(POLE.x, POLE.h - 0.1, POLE.z);
const houseCorner = new THREE.Vector3(-HX - 0.05, WALL - 0.05, HZ1 + 0.05);
const drop = sag(poleTop.clone().add(new THREE.Vector3(0.14, -0.6, 0.1)), houseCorner, 0.22, 10);
S.soft(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(drop), 16, 0.02, 6), M.wire);

// ---------- water meter by the path ----------
const METER = { x: 1.9, z: 3.5 };
S.add(rbox(0.3, 0.6, 0.24, 0.06), M.appliance, [METER.x, 0.3, METER.z]);
S.soft(cyl(0.08, 0.08, 0.04, 14), M.water, [METER.x, 0.45, METER.z + 0.12], [Math.PI / 2, 0, 0]);
S.add(rbox(0.36, 0.06, 0.3, 0.03), M.dark, [METER.x, 0.62, METER.z]);

// ---------- garden ----------
/** A clay pine: three soft tiers on a short trunk. */
function pine(x, z, s) {
  if (!inside(x, z, 0.5)) return;
  S.soft(cyl(0.07 * s, 0.1 * s, 0.6 * s, 8), M.trunk, [x, 0.3 * s, z]);
  const tiers = [[0.85, 1.05, 0.6], [0.66, 0.9, 1.15], [0.45, 0.75, 1.65]];
  tiers.forEach(([r, h, y], i) => {
    const g = lathe([[0, 0], [r * 0.8, 0.02], [r, 0.12], [r * 0.55, h * 0.55], [0.05, h * 0.98], [0, h]], 16);
    S.soft(g, i % 2 ? M.pineDark : M.pine, [x, y * s, z], [0, rand() * 3, 0], [s, s, s]);
  });
}
/** A round clay tree: a few overlapping puffs. */
function tree(x, z, s) {
  if (!inside(x, z, 0.5)) return;
  S.soft(cyl(0.06 * s, 0.09 * s, 1.3 * s, 8), M.trunk, [x, 0.65 * s, z]);
  S.soft(sphere(0.55 * s), M.leaf, [x, 1.6 * s, z]);
  S.soft(sphere(0.4 * s), M.leaf, [x + 0.35 * s, 1.4 * s, z + 0.1 * s]);
  S.soft(sphere(0.38 * s), M.leaf, [x - 0.3 * s, 1.45 * s, z - 0.15 * s]);
}
const bush = (x, z, s = 1) => inside(x, z, 0.3) && S.soft(jitter(sphere(0.3 * s, 12, 8), 0.06 * s), M.bush, [x, 0.18 * s, z], [0, rand() * 3, 0], [1, 0.8, 1]);

// Kept sparse on purpose: a few trees framing the house, bushes and flowers along the front wall.
pine(-4.6, -2.8, 1.15);
pine(-3.5, -3.0, 0.85);
tree(4.5, -2.7, 0.95);
tree(-4.5, 2.7, 0.8);

// Three two-compartment wheelie bins by the sidewalk, one per collection round. Each lid is split in
// two, tinted to its two kinds of waste; a bin rolls out to the kerb around its own collection day.
const BINS = { x: -2.75, z: WALK.z0 - 0.55, gap: 0.78 };
{
  const bodyM = mat('BinBody', '#4b5257', { roughness: 0.75 });
  for (let i = 0; i < 3; i++) {
    const bin = new THREE.Group();
    bin.name = `bin_${i}`;
    bin.position.set(BINS.x + (i - 1) * BINS.gap, 0, BINS.z);
    bin.userData = { out: [0, 1.0] };
    const b = new Bucket();
    const [ma, mb] = ['A', 'B'].map((h, k) => mat(`Bin${i}${h}`, k ? '#5f8f47' : '#6b777d', { roughness: 0.6 }));
    // A slightly tapered body: wider at the top, like the real thing.
    const g = rbox(0.6, 0.92, 0.66, 0.07, 2);
    const pos = g.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const k = 0.88 + 0.12 * ((pos.getY(v) + 0.46) / 0.92);
      pos.setX(v, pos.getX(v) * k);
      pos.setZ(v, pos.getZ(v) * k);
    }
    b.add(g, bodyM, [0, 0.52, 0]);
    // Split lid: one half per compartment, with a dark divider between.
    b.add(rbox(0.32, 0.07, 0.74, 0.03), ma, [-0.165, 1.0, -0.02]);
    b.add(rbox(0.32, 0.07, 0.74, 0.03), mb, [0.165, 1.0, -0.02]);
    b.add(rbox(0.03, 0.08, 0.74, 0.01), M.dark, [0, 1.0, -0.02]);
    // Colour labels on the front, one per compartment.
    b.add(rbox(0.22, 0.2, 0.03, 0.02), ma, [-0.14, 0.72, 0.335]);
    b.add(rbox(0.22, 0.2, 0.03, 0.02), mb, [0.14, 0.72, 0.335]);
    b.add(rbox(0.5, 0.05, 0.06, 0.02), M.dark, [0, 0.95, -0.38]);
    for (const w of [-0.22, 0.22]) b.soft(cyl(0.09, 0.09, 0.06, 12), M.dark, [w, 0.09, -0.3], [0, 0, Math.PI / 2]);
    b.into(bin, `bin_${i}`);
    island.add(bin);
  }
}
[[-2.0, 1.25], [-1.55, 1.3], [1.95, 1.3], [2.3, 1.7]].forEach(([x, z]) => bush(x, z, 0.8 + rand() * 0.4));
for (let i = 0; i < 14; i++) S.soft(sphere(0.055, 8, 6), i % 3 ? M.flower : M.flowerPink, [-1.95 + rand() * 0.9, 0.36 + rand() * 0.06, 1.12 + rand() * 0.3]);
// A paved path from the door to the sidewalk.
{
  const z0 = HZ1 + 0.6, len = WALK.z0 - z0;
  S.add(rbox(0.9, 0.08, len, 0.04), M.paving, [0.4, 0.0, z0 + len / 2]);
  for (let z = z0 + 0.45; z < WALK.z0 - 0.1; z += 0.45) S.add(new THREE.BoxGeometry(0.82, 0.082, 0.02), M.plinth, [0.4, 0.0, z]);
}

// Lamp post by the path; the lantern glows at night.
{
  const lx = 1.25, lz = 2.7;
  S.soft(cyl(0.04, 0.055, 1.7, 8), M.dark, [lx, 0.85, lz]);
  S.add(rbox(0.28, 0.05, 0.28, 0.02), M.dark, [lx, 1.72, lz]);
  S.soft(new THREE.ConeGeometry(0.22, 0.18, 4), M.dark, [lx, 2.06, lz], [0, Math.PI / 4, 0]);
  const lantern = new THREE.Mesh(prep(place(rbox(0.18, 0.26, 0.18, 0.04), [lx, 1.86, lz])), M.lamp);
  lantern.name = 'lamp';
  island.add(lantern);
  const light = new THREE.Object3D();
  light.name = 'light_lamp';
  light.position.set(lx, 1.9, lz);
  light.userData = { light: { color: '#ffc27a', intensity: 3, distance: 5 } };
  island.add(light);
  const porch = new THREE.Object3D();
  porch.name = 'light_porch';
  porch.position.set(0.4, 2.0, HZ1 + 0.6);
  porch.userData = { light: { color: '#ffb866', intensity: 2.5, distance: 4.5 } };
  island.add(porch);
}

// ---------- label anchors and flow routes ----------
const v = (x, y, z) => new THREE.Vector3(x, y, z);
const anchor = (key, p) => {
  const o = new THREE.Object3D();
  o.name = `anchor_${key}`;
  o.position.copy(p);
  island.add(o);
};
anchor('grid', v(POLE.x - 0.3, POLE.h + 0.55, POLE.z));
anchor('solar', v(1.3, RIDGE + 0.8, -0.4));
anchor('car', v(CAR.x + 1.4, 1.7, CAR.z - 1.0));
anchor('home', v(-0.75, 0.35, HZ1 + 1.6));
anchor('water', v(METER.x + 0.7, 0.9, METER.z + 0.4));
anchor('bins', v(BINS.x - 1.2, 2.3, BINS.z + 0.2));

// Every route ends at the meter cabinet on the front wall (x ≈ -0.45, y 0.35-0.85).
const F = HZ1 + 0.07;
const flow = (key, pts) => {
  const o = new THREE.Object3D();
  o.name = `flow_${key}`;
  o.userData = { points: pts.map(p => p.toArray().map(n => +n.toFixed(3))) };
  island.add(o);
};
{
  // Grid: in from the street, up the slab's front face, across the sidewalk and under the lawn to the pole, up the pole, along the service drop and down the wall.
  const toPole = v(POLE.x, 0, POLE.z);
  flow('grid', [
    v(GRID_IN, -1.0, YARD.z1 + 0.03),
    v(GRID_IN, 0.08, YARD.z1 + 0.03),
    v(GRID_IN, 0.08, WALK.z0 - 0.05),
    toPole.clone().setY(0.04),
    v(POLE.x + 0.1, POLE.h - 0.6, POLE.z + 0.08),
    ...drop,
    v(-HX - 0.05, 0.62, F),
    v(-0.72, 0.62, F),
  ]);
}
{
  const roofY = z => RIDGE - ((z - HZC) / RUN) * RISE + 0.24;
  flow('solar', [v(-0.35, roofY(0.15) + 0.06, 0.15), v(-0.35, roofY(1.12) + 0.03, 1.12), v(-0.35, roofY(1.25) - 0.25, 1.25), v(-0.35, 1.9, F), v(-0.35, 0.86, F)]);
}
// The car's route runs from the car to the house like every other source; charging runs it backwards.
{
  const cable = sag(PORT, v(WALLBOX.x + 0.12, WALLBOX.y - 0.18, WALLBOX.z), 0.42, 12);
  const mesh = new THREE.Mesh(prep(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cable), 20, 0.024, 6), true), M.wire);
  mesh.name = 'charge_cable';
  island.add(mesh);
  // Ends at the wallbox: following the front wall to the meter put it right beside the solar line.
  flow('car', [...cable.map(p => p.clone().add(v(0, 0.045, 0))), v(HX + 0.06, WALLBOX.y + 0.3, WALLBOX.z)]);
}
flow('water', [v(METER.x, 0.64, METER.z), v(METER.x, 0.04, METER.z - 0.2), v(1.7, 0.04, 1.3), v(1.7, 0.04, F), v(1.7, 0.36, F)]);

// ---------- finish ----------
S.into(island, 'island');
// Ship positions and indices only: vertices that had different normals stay separate, so the card's
// recomputed normals keep crisp edges crisp and soft shapes soft.
island.traverse(o => {
  if (!o.isMesh) return;
  const g = mergeVertices(o.geometry, 1e-4);
  g.deleteAttribute('normal');
  o.geometry = g;
});

mkdirSync(dirname(OUT), { recursive: true });
new GLTFExporter().parse(
  scene,
  buf => {
    writeFileSync(OUT, Buffer.from(buf));
    let tris = 0, verts = 0, meshes = 0;
    scene.traverse(o => {
      if (o.isMesh) {
        meshes++;
        verts += o.geometry.attributes.position.count;
        tris += o.geometry.index.count / 3;
      }
    });
    console.log(`Wrote ${OUT}: ${(buf.byteLength / 1024).toFixed(0)} KB, ${meshes} meshes, ${verts} vertices, ${tris} triangles`);
  },
  err => {
    console.error(err);
    process.exit(1);
  },
  { binary: true },
);
