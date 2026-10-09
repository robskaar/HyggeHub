// What every 3D view beyond the house shares: a renderer, the clay look, day and night light, a camera
// the viewer can swing by dragging, zooming in on one spot while details are open, and the screen
// positions of the labels. A view builds its own models on top (see people.ts and countdowns.ts).
import {
  ACESFilmicToneMapping,
  Box3,
  CapsuleGeometry,
  Clock,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  Sphere,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface StageLabel {
  key: string;
  x: number;
  y: number;
  visible: boolean;
}

/** What every view's state carries besides its own data. */
export interface StageLook {
  /** 0 day, 1 night. */
  night: number;
  /** False: a still frame, re-rendered on changes. */
  motion: boolean;
}

// ---------- clay helpers ----------

const materials = new Map<string, MeshStandardMaterial>();
/** Shared clay materials by colour, so a scene of many small parts stays cheap. */
export function clay(color: string, extra: Partial<{ roughness: number; metalness: number; emissive: string; emissiveIntensity: number }> = {}) {
  const key = color + JSON.stringify(extra);
  let m = materials.get(key);
  if (!m) {
    m = new MeshStandardMaterial({ color, roughness: extra.roughness ?? 0.9, metalness: extra.metalness ?? 0, emissive: extra.emissive ?? '#000000', emissiveIntensity: extra.emissiveIntensity ?? 1 });
    materials.set(key, m);
  }
  return m;
}

export function part(geo: BufferGeometry, mat: MeshStandardMaterial, pos: [number, number, number] = [0, 0, 0], rot: [number, number, number] = [0, 0, 0], scale: [number, number, number] = [1, 1, 1]) {
  const m = new Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.scale.set(...scale);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/**
 * Fewer draw calls: within every group, the meshes that share a material become one mesh. Groups keep
 * their transforms, so anything animated by moving a group (a head, an arm, a drone) still moves; a mesh
 * marked `userData.keep` is left alone (one that is scaled or moved on its own).
 */
export function mergeStatic(root: Object3D) {
  for (const child of [...root.children]) if (!(child as Mesh).isMesh) mergeStatic(child);
  const byMaterial = new Map<unknown, Mesh[]>();
  for (const child of root.children) {
    const m = child as Mesh;
    if (!m.isMesh || m.userData.keep || Array.isArray(m.material)) continue;
    const list = byMaterial.get(m.material) ?? [];
    list.push(m);
    byMaterial.set(m.material, list);
  }
  for (const [material, meshes] of byMaterial) {
    if (meshes.length < 2) continue;
    const geos = meshes.map(m => {
      m.updateMatrix();
      const g = m.geometry.index ? m.geometry.clone() : m.geometry.clone();
      return g.applyMatrix4(m.matrix);
    });
    let merged: BufferGeometry | null = null;
    try {
      merged = mergeGeometries(geos);
    } catch {
      merged = null;
    }
    if (!merged) continue;
    const mesh = new Mesh(merged, material as MeshStandardMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    meshes.forEach(m => {
      root.remove(m);
      m.geometry.dispose();
    });
    root.add(mesh);
  }
}

export const rbox = (w: number, h: number, d: number, r = 0.05) => new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3));
export const ball = (r: number, w = 16, h = 12) => new SphereGeometry(r, w, h);
export const capsule = (r: number, len: number) => new CapsuleGeometry(r, len, 6, 14);
export const disc = (r: number, h: number, seg = 32) => new CylinderGeometry(r, r, h, seg);

// ---------- the stage ----------

export abstract class ClayStage {
  protected readonly renderer: WebGLRenderer;
  protected readonly scene = new Scene();
  protected readonly camera = new PerspectiveCamera(24, 1, 0.5, 200);
  protected readonly root = new Group();
  protected readonly anchors = new Map<string, Object3D>();
  protected framing = new Sphere(new Vector3(), 6);
  protected look: StageLook = { night: 0, motion: true };
  protected time = 0;
  /** Camera angle around the scene and up from the ground, degrees. */
  protected azimuth = 0;
  protected elevation = 24;
  /** False: dragging doesn't swing the camera (the view uses swipes itself). */
  protected allowYaw = true;

  private readonly clock = new Clock();
  private readonly sun = new DirectionalLight('#fff1dc', 2.6);
  private readonly hemi = new HemisphereLight('#dfefff', '#5b6b4a', 1.15);
  private readonly fill = new DirectionalLight('#dfe8ff', 0.6);
  private night = 0;
  protected width = 1;
  protected height = 1;
  protected camDistance = 30;
  /** How far the camera is from a focused spot; unset: a little over half the usual distance. */
  protected focusDistance?: number;
  private yaw = 0;
  private yawVelocity = 0;
  private dragging = false;
  private lastDrag = 0;
  private frameId = 0;
  private running = false;
  private settle = 0;
  private focusPoint = new Vector3();
  private focusOn = false;
  private focusEase = 0;
  private focusSide: 'right' | 'bottom' = 'right';
  private lastLabels = '';
  /** 1 right after the view appears, easing to 0: the camera glides in. */
  private introT = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly onLabels: (labels: StageLabel[]) => void,
    pixelRatio: number,
  ) {
    // Throws when WebGL is unavailable; the card shows a message instead.
    const r = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer = r;
    r.setPixelRatio(pixelRatio);
    r.setClearColor(0x000000, 0);
    r.outputColorSpace = SRGBColorSpace;
    r.toneMapping = ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = true;
    r.shadowMap.type = PCFSoftShadowMap;

    this.scene.add(this.root, this.hemi, this.sun, this.sun.target, this.fill);
    this.sun.position.set(14, 22, 16);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.bias = -0.0008;
    this.sun.shadow.normalBias = 0.03;
    const sc = this.sun.shadow.camera;
    sc.left = sc.bottom = -12;
    sc.right = sc.top = 12;
    sc.near = 1;
    sc.far = 70;
    this.fill.position.set(-12, 7, 6);
    this.bindPointer();
  }

  /** A label's spot was focused (or null: unfocused). Views can react, e.g. a figure waving. */
  protected onFocus(_key: string | null) {}

  /** Glide the camera in from a little further out and round to the side, as when a tab opens. */
  intro() {
    // With motion off the view just appears where it settles.
    if (!this.look.motion) return;
    this.introT = 1;
    if (!this.running) this.animateFor(1.6);
  }

  /** Called every frame: animate the view's own models. `t` is seconds of motion so far. */
  protected abstract animate(dt: number, t: number, motion: boolean): void;

  /** After building the models: frame what is in `root`, cropping anything below `floor`. */
  protected frameContent(floor = -1.2, scale = 0.72) {
    const box = new Box3().setFromObject(this.root);
    box.min.y = Math.max(box.min.y, floor);
    box.getBoundingSphere(this.framing);
    this.framing.radius *= scale;
    this.layout();
  }

  protected anchor(key: string, at: Object3D, offset: [number, number, number]) {
    const o = new Object3D();
    o.position.set(...offset);
    at.add(o);
    this.anchors.set(key, o);
    return o;
  }

  setLook(look: StageLook) {
    this.look = look;
    if (!this.running) this.renderOnce();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    const loop = () => {
      if (!this.running) return;
      this.frameId = requestAnimationFrame(loop);
      this.tick(Math.min(0.05, this.clock.getDelta()));
    };
    this.frameId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  renderOnce() {
    this.tick(0, true);
  }

  resize(width: number, height: number) {
    if (width < 1 || height < 1) return;
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.layout();
    if (!this.running) this.renderOnce();
  }

  /** Zoom in on a label's spot while the card shows its details on `side`; null zooms back out. */
  focus(key: string | null, side: 'right' | 'bottom' = 'right') {
    const node = key ? this.anchors.get(key) : undefined;
    if (node && key) this.focusAt(key, node, this.focusPoint);
    this.focusOn = !!node;
    this.focusSide = side;
    this.onFocus(node ? key : null);
    if (!this.running) this.animateFor(1.2);
  }

  /** The point a focus looks at: by default a little below the label's spot (labels float over things). */
  protected focusAt(_key: string, node: Object3D, out: Vector3) {
    node.getWorldPosition(out);
    out.y = Math.max(0.4, out.y - 1.1);
  }

  private animateFor(seconds: number) {
    this.settle = seconds;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.settle -= dt;
      if (this.running) return;
      this.tick(dt, false, true);
      if (this.settle > 0) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  protected layout() {
    const aspect = this.width / this.height;
    this.camera.aspect = aspect;
    const vfov = MathUtils.degToRad(this.camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    this.camDistance = this.framing.radius / Math.sin(Math.min(vfov, hfov) / 2);
    this.camera.near = Math.max(0.3, this.camDistance - 40);
    this.camera.far = this.camDistance + 80;
    this.camera.updateProjectionMatrix();
  }

  private tick(dt: number, still = false, cameraOnly = false) {
    const motion = this.look.motion && !still && !cameraOnly;
    if (motion) this.time += dt;

    // Light eases between day and night.
    this.night += (this.look.night - this.night) * (still ? 1 : 1 - Math.exp(-dt * 1.5));
    const n = this.night;
    this.sun.color.set('#fff1dc').lerp(new Color('#9db4ff'), n);
    this.sun.intensity = MathUtils.lerp(2.6, 0.55, n);
    this.hemi.color.set('#dfefff').lerp(new Color('#3a4a78'), n);
    this.hemi.groundColor.set('#5b6b4a').lerp(new Color('#1c2230'), n);
    this.hemi.intensity = MathUtils.lerp(1.15, 0.5, n);
    this.fill.intensity = MathUtils.lerp(0.7, 0.15, n);

    // Camera: drag to swing, eases home; zoom on a focused spot with the picture slid aside.
    if (!this.dragging) {
      this.yaw += this.yawVelocity * dt;
      this.yawVelocity *= Math.exp(-dt * 4);
      if (performance.now() - this.lastDrag > 2500) this.yaw += (0 - this.yaw) * (1 - Math.exp(-dt * 1.2));
    }
    this.focusEase += ((this.focusOn ? 1 : 0) - this.focusEase) * (!this.look.motion || (still && !cameraOnly) ? 1 : 1 - Math.exp(-dt * 4));
    const f = this.focusEase;
    // Intro: ease out of a wider, turned view over about 1.3 s.
    if (!this.look.motion) this.introT = 0;
    else if (!still || cameraOnly) this.introT = Math.max(0, this.introT - dt / 1.3);
    const ie = this.introT * this.introT * (3 - 2 * this.introT);
    const az = MathUtils.degToRad(this.azimuth) + this.yaw + ie * 0.55;
    const el = MathUtils.degToRad(this.elevation + f * 4 + ie * 10);
    const c = this.framing.center.clone().lerp(this.focusPoint, f);
    const near = this.focusDistance ?? this.camDistance * 0.55;
    const dist = MathUtils.lerp(this.camDistance, near, f) * (1 + ie * 0.55);
    this.camera.position.set(c.x + Math.sin(az) * Math.cos(el) * dist, c.y + Math.sin(el) * dist, c.z + Math.cos(az) * Math.cos(el) * dist);
    this.camera.lookAt(c);
    if (f > 0.001) {
      const w = this.width, h = this.height;
      if (this.focusSide === 'right') this.camera.setViewOffset(w, h, w * 0.24 * f, 0, w, h);
      else this.camera.setViewOffset(w, h, 0, h * 0.26 * f, w, h);
    } else if (this.camera.view) this.camera.clearViewOffset();

    this.animate(dt, this.time, motion);
    this.renderer.render(this.scene, this.camera);
    this.emitLabels();
  }

  private emitLabels() {
    const out: StageLabel[] = [];
    const v = new Vector3();
    for (const [key, node] of this.anchors) {
      node.getWorldPosition(v);
      v.project(this.camera);
      const x = (v.x * 0.5 + 0.5) * this.width;
      const y = (-v.y * 0.5 + 0.5) * this.height;
      out.push({ key, x: Math.round(x * 2) / 2, y: Math.round(y * 2) / 2, visible: v.z < 1 && x > -60 && x < this.width + 60 });
    }
    const sig = out.map(l => `${l.x},${l.y},${l.visible}`).join(';');
    if (sig === this.lastLabels) return;
    this.lastLabels = sig;
    this.onLabels(out);
  }

  private bindPointer() {
    let lastX = 0;
    let lastT = 0;
    let id = -1;
    const c = this.canvas;
    c.addEventListener('pointerdown', ev => {
      if (!this.allowYaw) return;
      id = ev.pointerId;
      lastX = ev.clientX;
      lastT = performance.now();
      this.dragging = true;
      this.yawVelocity = 0;
      c.setPointerCapture(id);
    });
    c.addEventListener('pointermove', ev => {
      if (!this.dragging || ev.pointerId !== id) return;
      const now = performance.now();
      const d = (-(ev.clientX - lastX) / Math.max(200, this.width)) * Math.PI * 0.9;
      this.yaw = MathUtils.clamp(this.yaw + d, -1.2, 1.2);
      this.yawVelocity = d / Math.max(0.008, (now - lastT) / 1000);
      lastX = ev.clientX;
      lastT = now;
      this.lastDrag = now;
      if (!this.running) this.renderOnce();
    });
    const end = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return;
      this.dragging = false;
      this.lastDrag = performance.now();
      if (performance.now() - lastT > 80) this.yawVelocity = 0;
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
  }

  dispose() {
    this.stop();
    this.scene.traverse(o => {
      const m = o as Mesh;
      m.geometry?.dispose();
    });
    this.renderer.dispose();
  }
}
