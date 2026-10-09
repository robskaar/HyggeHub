// The countdowns view: one small floating island per countdown, dressed for what it counts down to
// (a beach for the summer holiday, a gift and a cake for a birthday, mountains and a plane for a trip,
// a decorated tree for Christmas). A ring round each island fills up as the day comes closer.
import { ConeGeometry, Group, LatheGeometry, Mesh, MeshStandardMaterial, OctahedronGeometry, TorusGeometry, Vector2 } from 'three';
import { ball, capsule, ClayStage, clay, disc, part, rbox, type StageLook } from './stage';
import type { Theme } from './themes';

export type { Theme };


export interface IslandState {
  key: string;
  theme: Theme;
  /** 0-1, how much of the wait has passed. */
  progress: number;
  done: boolean;
}

export interface CountdownsState extends StageLook {
  /** Soonest first. */
  items: IslandState[];
  accent: string;
  /** The island in front; the ones either side wait smaller behind it. */
  index: number;
}


interface Island {
  state: IslandState;
  group: Group;
  ring: Mesh;
  ringFor: number;
  phase: number;
  spin: Group[];
  flames: Mesh[];
  /** Springs: where the island is in the carousel, its size, and their speeds. */
  x: number;
  vx: number;
  z: number;
  vz: number;
  s: number;
  vs: number;
}

/** A lathe from a profile written top-down; swept bottom-up so its faces point outwards. */
const lathe = (pts: Array<[number, number]>, seg = 40) => new LatheGeometry([...pts].reverse().map(([r, y]) => new Vector2(r, y)), seg);

export class CountdownScene extends ClayStage {
  private islands: Island[] = [];
  private signature = '';
  private state?: CountdownsState;
  private ringMat = new MeshStandardMaterial({ color: '#4aa8ff', roughness: 0.5, emissive: '#4aa8ff', emissiveIntensity: 0.4 });

  protected override azimuth = 0;
  protected override elevation = 16;
  // Swipes change the island instead of turning the camera.
  protected override allowYaw = false;

  setState(s: CountdownsState) {
    this.state = s;
    const sig = s.items.map(i => `${i.key}|${i.theme}`).join(';');
    if (sig !== this.signature) {
      this.signature = sig;
      this.build(s.items);
    }
    this.ringMat.color.set(s.accent);
    this.ringMat.emissive.set(s.accent);
    this.islands.forEach((isl, i) => {
      isl.state = s.items[i];
      this.updateRing(isl);
    });
    this.setLook(s);
  }

  private build(items: IslandState[]) {
    this.root.clear();
    this.anchors.clear();
    this.islands = [];
    items.forEach((it, i) => {
      const g = new Group();
      // Start small and off to the side, so the first frame already bounces into place.
      const isl: Island = { state: it, group: g, ring: new Mesh(), ringFor: -1, phase: i * 1.7, spin: [], flames: [], x: (i - (this.state?.index ?? 0)) * 4, vx: 0, z: 0, vz: 0, s: 0, vs: 0 };
      this.island(isl, it.theme);
      this.root.add(g);
      this.islands.push(isl);
      this.anchor(it.key, g, [0, 3.1, 0]);
      this.updateRing(isl);
    });
    // The camera frames the front island with a glimpse of its neighbours.
    this.framing.center.set(0, 0.7, 0);
    this.framing.radius = 3.3;
    this.layout();
  }

  private updateRing(isl: Island) {
    const p = Math.max(0.001, Math.min(1, isl.state.progress));
    if (Math.abs(p - isl.ringFor) < 0.005) return;
    isl.ringFor = p;
    isl.group.remove(isl.ring);
    isl.ring.geometry?.dispose();
    isl.ring = part(new TorusGeometry(1.86, 0.06, 8, 64, Math.PI * 2 * p), this.ringMat, [0, 0.02, 0], [Math.PI / 2, 0, Math.PI / 2]);
    isl.group.add(isl.ring);
  }

  /** The island itself (top, soil, rock root), then the theme's props on top. */
  private island(isl: Island, theme: Theme) {
    const g = isl.group;
    const top = theme === 'beach' ? '#e8d3a2' : theme === 'christmas' ? '#f3f6f8' : '#8dbb67';
    g.add(part(lathe([[0, 0.02], [1.55, 0.02], [1.72, -0.06], [1.78, -0.2], [1.7, -0.32]]), clay(top)));
    g.add(part(lathe([[1.7, -0.3], [1.62, -0.55], [1.4, -0.75]]), clay('#b88a63')));
    g.add(part(lathe([[1.42, -0.72], [1.2, -1.1], [0.85, -1.6], [0.45, -2.1], [0, -2.4]], 28), clay('#a2958a')));

    switch (theme) {
      case 'beach': {
        // Palm: a leaning trunk of rings, fronds round the top, coconuts.
        const palm = new Group();
        palm.position.set(-0.55, 0, -0.2);
        for (let i = 0; i < 7; i++) palm.add(part(disc(0.11 - i * 0.008, 0.2, 14), clay('#9a7556'), [i * 0.06, 0.1 + i * 0.2, 0], [0, 0, -0.12 - i * 0.02]));
        const crown = new Group();
        crown.position.set(0.42, 1.45, 0);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          crown.add(part(ball(0.4, 16, 10), clay('#5f9a52'), [Math.cos(a) * 0.38, -0.08, Math.sin(a) * 0.38], [0, -a, -0.5], [1.4, 0.18, 0.45]));
        }
        for (const [x, z] of [[0.08, 0.06], [-0.06, 0.08], [0.02, -0.08]]) crown.add(part(ball(0.08, 12, 10), clay('#6b4528'), [x, -0.12, z]));
        palm.add(crown);
        g.add(palm);
        // Parasol, towel, ball, and a little pool.
        g.add(part(capsule(0.025, 1.1), clay('#f2eee6'), [0.6, 0.6, 0.35]));
        g.add(part(new ConeGeometry(0.62, 0.32, 10), clay('#e86a5a'), [0.6, 1.25, 0.35]));
        g.add(part(ball(0.06), clay('#f2eee6'), [0.6, 1.43, 0.35]));
        g.add(part(rbox(0.5, 0.03, 0.85, 0.01), clay('#5fb3d6'), [0.75, 0.04, 0.45], [0, 0.3, 0]));
        g.add(part(ball(0.13), clay('#f2cf5a'), [-0.2, 0.15, 0.85]));
        g.add(part(disc(0.42, 0.04, 28), clay('#5fb3d6', { roughness: 0.15 }), [-0.75, 0.03, 0.6]));
        break;
      }
      case 'gift': {
        // A big present with a ribbon and a bow, and a cake with candles.
        const box = new Group();
        box.position.set(-0.45, 0, -0.15);
        box.rotation.y = 0.35;
        box.add(part(rbox(1.0, 0.85, 1.0, 0.06), clay(this.state?.accent ?? '#e86a5a'), [0, 0.43, 0]));
        box.add(part(rbox(1.06, 0.14, 1.06, 0.04), clay(this.state?.accent ?? '#e86a5a'), [0, 0.88, 0]));
        box.add(part(rbox(0.16, 0.9, 1.08, 0.02), clay('#f4f1ea'), [0, 0.46, 0]));
        box.add(part(rbox(1.08, 0.9, 0.16, 0.02), clay('#f4f1ea'), [0, 0.46, 0]));
        for (const s of [-1, 1]) box.add(part(new TorusGeometry(0.16, 0.05, 8, 20), clay('#f4f1ea'), [s * 0.14, 1.04, 0], [0, s * 0.5, 0]));
        g.add(box);
        const cake = new Group();
        cake.position.set(0.7, 0, 0.45);
        cake.add(part(disc(0.42, 0.3, 28), clay('#f4dcc8'), [0, 0.15, 0]));
        cake.add(part(disc(0.3, 0.24, 28), clay('#ec9fb0'), [0, 0.42, 0]));
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          cake.add(part(disc(0.022, 0.18, 8), clay('#f4f1ea'), [Math.cos(a) * 0.18, 0.63, Math.sin(a) * 0.18]));
          const flame = part(ball(0.035, 8, 6), clay('#ffd27a', { emissive: '#ffb347', emissiveIntensity: 1.6 }), [Math.cos(a) * 0.18, 0.75, Math.sin(a) * 0.18], [0, 0, 0], [1, 1.5, 1]);
          isl.flames.push(flame);
          cake.add(flame);
        }
        g.add(cake);
        break;
      }
      case 'mountain': {
        // Two snow-capped peaks, a pine, and a small plane circling them.
        for (const [x, z, h, r] of [[-0.4, -0.3, 1.9, 0.95], [0.6, 0.0, 1.3, 0.7]]) {
          g.add(part(new ConeGeometry(r, h, 9), clay('#8f8a86'), [x, h / 2, z]));
          g.add(part(new ConeGeometry(r * 0.38, h * 0.38, 9), clay('#f3f6f8'), [x, h * 0.81, z]));
        }
        g.add(part(new ConeGeometry(0.3, 0.7, 8), clay('#4f8a5c'), [0.9, 0.4, 0.75]));
        const orbit = new Group();
        const plane = new Group();
        plane.position.set(1.5, 2.3, 0);
        plane.add(part(capsule(0.08, 0.5), clay('#f4f1ea'), [0, 0, 0], [Math.PI / 2, 0, 0]));
        plane.add(part(rbox(0.9, 0.03, 0.18, 0.01), clay('#f4f1ea'), [0, 0, 0.02]));
        plane.add(part(rbox(0.3, 0.03, 0.1, 0.01), clay('#e86a5a'), [0, 0.02, -0.3]));
        plane.add(part(rbox(0.03, 0.18, 0.12, 0.01), clay('#e86a5a'), [0, 0.1, -0.3]));
        orbit.add(plane);
        g.add(orbit);
        isl.spin.push(orbit);
        break;
      }
      case 'christmas': {
        // A decorated tree with a star, presents underneath.
        const tree = new Group();
        tree.position.set(-0.1, 0, -0.15);
        tree.add(part(disc(0.1, 0.4, 10), clay('#9a7556'), [0, 0.2, 0]));
        [[0.9, 0.9, 0.75], [0.7, 0.8, 1.3], [0.48, 0.7, 1.8]].forEach(([r, h, y]) => tree.add(part(new ConeGeometry(r, h, 12), clay('#43785a'), [0, y, 0])));
        const colours = ['#e86a5a', '#f2cf5a', '#5fb3d6', '#ec9fb0'];
        for (let i = 0; i < 14; i++) {
          const a = i * 2.4;
          const y = 0.55 + (i / 14) * 1.5;
          const r = 0.82 - (i / 14) * 0.55;
          tree.add(part(ball(0.06, 10, 8), clay(colours[i % 4], { emissive: colours[i % 4], emissiveIntensity: 0.25 }), [Math.cos(a) * r, y, Math.sin(a) * r]));
        }
        const star = part(new OctahedronGeometry(0.16), clay('#f2cf5a', { emissive: '#f2cf5a', emissiveIntensity: 0.8 }), [0, 2.25, 0]);
        tree.add(star);
        isl.spin.push(star as unknown as Group);
        g.add(tree);
        for (const [x, z, c] of [[0.75, 0.55, '#e86a5a'], [0.45, 0.9, '#5fb3d6']] as const) g.add(part(rbox(0.36, 0.3, 0.36, 0.04), clay(c), [x, 0.15, z], [0, 0.4, 0]));
        break;
      }
      default: {
        // A flag on a pole.
        g.add(part(disc(0.04, 2.2, 10), clay('#f4f1ea'), [0, 1.1, 0]));
        g.add(part(ball(0.07), clay('#f2cf5a'), [0, 2.24, 0]));
        const flag = part(rbox(0.8, 0.5, 0.03, 0.02), clay(this.state?.accent ?? '#4aa8ff'), [0.42, 1.9, 0]);
        g.add(flag);
        isl.spin.push(flag as unknown as Group);
        g.add(part(rbox(0.5, 0.12, 0.5, 0.04), clay('#c2bcb2'), [0, 0.06, 0]));
      }
    }
  }

  protected override animate(dt: number, t: number, motion: boolean) {
    const index = this.state?.index ?? 0;
    // Springs a little under-damped, so islands overshoot and bounce into their places.
    // Integrated in small steps, so the bounce takes the same time at any frame rate (a slow tablet
    // drawing a few frames a second still gets there).
    const spring = (x: number, v: number, target: number, k: number, d: number) => {
      if (!motion || dt === 0) return [target, 0];
      let left = Math.min(dt, 0.5);
      while (left > 0) {
        const step = Math.min(left, 1 / 120);
        v += ((target - x) * k - v * d) * step;
        x += v * step;
        left -= step;
      }
      return [x, v];
    };
    this.islands.forEach((isl, i) => {
      const k = i - index;
      const far = Math.abs(k);
      [isl.x, isl.vx] = spring(isl.x, isl.vx, k * 3.7, 70, 11);
      [isl.z, isl.vz] = spring(isl.z, isl.vz, -Math.min(far, 2) * 1.6, 70, 11);
      [isl.s, isl.vs] = spring(isl.s, isl.vs, far === 0 ? 1 : far === 1 ? 0.6 : 0, 110, 9);
      const scale = Math.max(0, isl.s);
      isl.group.visible = scale > 0.02;
      isl.group.scale.setScalar(scale);
      // Each island floats on its own rhythm; the neighbours sit a little lower.
      isl.group.position.set(isl.x, Math.sin(t * 0.7 + isl.phase) * 0.12 - (far ? 0.4 : 0), isl.z);
      isl.group.rotation.y = Math.sin(t * 0.25 + isl.phase) * 0.08 - k * 0.25;
      for (const s of isl.spin) {
        if (isl.state.theme === 'mountain') s.rotation.y = t * 0.6;
        else if (isl.state.theme === 'christmas') s.rotation.y = t * 1.2;
        else s.rotation.y = Math.sin(t * 2 + isl.phase) * 0.25;
      }
      isl.flames.forEach((f, i) => f.scale.set(1, 1.4 + Math.sin(t * 9 + i * 1.7) * 0.3, 1));
    });
  }
}
