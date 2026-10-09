// The three.js side of the 3D energy card. Loaded on demand (see energy-3d-card.ts), so dashboards
// without the card never download three.js.
//
// The model only has to follow the naming described in scripts/build-island.mjs; everything that moves
// or glows is found by name, and the flow lines, weather and lights are built here.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Clock,
  Color,
  CurvePath,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  LineCurve3,
  LineSegments,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Points,
  Scene,
  ShaderMaterial,
  TubeGeometry,
  Vector2,
  Vector3,
  CircleGeometry,
  SphereGeometry,
  ACESFilmicToneMapping,
  DoubleSide,
  WebGLRenderer,
  SRGBColorSpace,
  Box3,
  Sphere,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import islandUrl from '../../assets/island.glb?url';

/** The bundled island; a card can point `model` at its own GLB instead. */
export const DEFAULT_MODEL = islandUrl;

export type FlowKey = 'grid' | 'solar' | 'car' | 'water';
export type LabelKey = FlowKey | 'home' | 'bins';

export interface Weather {
  /** 0-1: how much of the sky is cloud. */
  clouds: number;
  /** 0-1: how dark the clouds are. */
  gloom: number;
  rain: number;
  snow: number;
  fog: number;
  lightning: boolean;
  /** Compass bearing the wind blows from, when the weather entity reports it. */
  windBearing?: number;
  /** m/s. */
  wind: number;
  /** °C, for chimney smoke. Undefined: no smoke. */
  temperature?: number;
}

export interface SceneState {
  /** Per flow: speed and direction. Positive runs towards the house, 0 shows the idle line, null hides it. */
  flows: Record<FlowKey, number | null>;
  colors: Record<FlowKey, string>;
  /** 0 day, 1 night. Fractions for dusk. */
  night: number;
  /** Sun direction in degrees, when known. */
  sun?: { elevation: number; azimuth: number };
  /** Compass bearing the front door faces, so the sun lights the side it really lights. */
  facing: number;
  weather: Weather;
  /** The parked car, or null when the card has none. */
  car: { color: string; plugged: boolean; charging: boolean; ledColor: string } | null;
  /** Parts to hide when the card has no entity for them. */
  hidden: Array<'solar'>;
  /**
   * One per collection round, in order, for the model's bin_0, bin_1...: the two compartments' colours,
   * and whether the bin is out at the kerb. Null: the card has no schedule, so the bins stand as they are.
   */
  bins: Array<{ colors: [string, string]; out: boolean }> | null;
  /** Driveway bollards: 0 off to 1 on. */
  driveLights: number;
  /** False: no animation, a still frame re-rendered only on changes. */
  motion: boolean;
  /** Theme background, used as fog colour. */
  fogColor: string;
}

export interface LabelPosition {
  key: LabelKey;
  x: number;
  y: number;
  /** Behind the camera or off the canvas. */
  visible: boolean;
}

// ---------- shaders ----------

/** Flow lines: comets of light travelling along the tube, plus a faint steady core. */
const flowVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vFacing = abs(dot(n, normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }
`;
const flowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPhase;
  uniform float uSpeed;
  uniform float uLength;
  uniform float uActive;
  uniform float uHalo;
  uniform float uNight;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    // Distance along the line in the direction of flow, and the travelling mark's distance from here.
    float s = uSpeed >= 0.0 ? vUv.x * uLength : (1.0 - vUv.x) * uLength;
    float d = uPhase * uLength - s;
    // One mark: a crisp nose and a short tail behind it.
    float mark = uActive * (d < 0.0 ? exp(-d * d / 0.004) : exp(-d / 0.28));
    if (uHalo > 0.5) {
      // A steady soft glow around the line, brighter where the mark is.
      float soft = pow(vFacing, 2.5);
      float a = (mix(0.06, 0.2, uActive) + mark * 0.6) * soft * mix(1.0, 1.4, uNight);
      gl_FragColor = vec4(uColor * (1.0 + mark), clamp(a, 0.0, 1.0));
    } else {
      // The line itself glows in its colour; the mark runs white-hot along it.
      vec3 c = mix(uColor * mix(0.75, 1.15, uActive), vec3(1.0), mark * 0.65);
      float a = mix(0.4, 0.85, uActive) + mark * 0.15;
      gl_FragColor = vec4(c * (1.0 + mark * 0.8), clamp(a, 0.0, 1.0));
    }
  }
`;

/** Rain: each drop is a short line; positions wrap in the shader so the CPU does nothing per frame. */
const rainVertex = /* glsl */ `
  attribute float aTip;
  uniform float uTime;
  uniform float uWind;
  uniform vec2 uDir;
  uniform float uTop;
  uniform float uHeight;
  varying float vTip;
  void main() {
    vec3 p = position;
    // y: how far this drop has fallen; it grows with time and wraps back to the top.
    float y = mod(p.y + uTime * 11.0, uHeight);
    p.y = uTop - y + aTip * 0.45;
    vec2 drift = uDir * uWind * 0.035;
    p.xz += drift * (y - uHeight * 0.5) - drift * aTip * 0.45;
    vTip = aTip;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const rainFragment = /* glsl */ `
  uniform float uAmount;
  uniform vec3 uColor;
  varying float vTip;
  void main() { gl_FragColor = vec4(uColor, (0.15 + vTip * 0.45) * uAmount); }
`;

/** Snow and chimney smoke: point sprites drifting in the shader. */
const snowVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uWind;
  uniform vec2 uDir;
  uniform float uTop;
  uniform float uHeight;
  uniform float uScale;
  void main() {
    vec3 p = position;
    float y = mod(p.y + uTime * (0.6 + aSeed * 0.5), uHeight);
    p.y = uTop - y;
    p.xz += uDir * uWind * 0.05 * (y - uHeight * 0.5);
    p.x += sin(uTime * 0.8 + aSeed * 30.0) * 0.35;
    p.z += cos(uTime * 0.6 + aSeed * 17.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uScale * (0.22 + aSeed * 0.18) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const snowFragment = /* glsl */ `
  uniform float uAmount;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 0.2, d) * 0.9 * uAmount);
  }
`;
const smokeVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uScale;
  uniform float uWind;
  uniform vec2 uDir;
  varying float vAge;
  void main() {
    float age = fract(uTime * 0.12 + aSeed);
    vec3 p = position;
    p.y += age * 3.2;
    p.xz += uDir * age * age * (0.4 + uWind * 0.25);
    p.x += sin(age * 6.0 + aSeed * 20.0) * 0.15;
    vAge = age;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uScale * (0.8 + age * 3.0) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const smokeFragment = /* glsl */ `
  uniform float uAmount;
  uniform vec3 uColor;
  varying float vAge;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * (1.0 - vAge) * smoothstep(0.0, 0.1, vAge) * 0.5 * uAmount;
    gl_FragColor = vec4(uColor, a);
  }
`;

/** Wind: a bright head with a fading tail running along a curly tube. */
const windVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const windFragment = /* glsl */ `
  uniform float uHead;
  uniform float uAmount;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float d = uHead - vUv.x;
    // A soft leading edge and a long tail that thins out behind it.
    float a = smoothstep(0.0, 0.06, d) * (1.0 - smoothstep(0.08, 0.6, d));
    // Feathered across the ribbon, and faded in and out at its ends.
    float across = sin(vUv.y * 3.14159);
    a *= across * across * smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    gl_FragColor = vec4(uColor, a * uAmount);
  }
`;

/** A flat ribbon along a curve, `width` wide, lying across the direction of travel. */
function ribbon(curve: CatmullRomCurve3, segments: number, width: (t: number) => number): BufferGeometry {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const side = new Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    side.set(-tan.z, 0, tan.x).normalize();
    // Tilt the ribbon a little up towards the camera, so it reads as a band rather than a line.
    side.y = 0.35;
    side.normalize().multiplyScalar(width(t) / 2);
    pos.push(p.x - side.x, p.y - side.y, p.z - side.z, p.x + side.x, p.y + side.y, p.z + side.z);
    uv.push(t, 0, t, 1);
    if (i < segments) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  g.setAttribute('uv', new BufferAttribute(new Float32Array(uv), 2));
  g.setIndex(idx);
  return g;
}

/** A soft pool of light on the ground. */
const glowVertex = /* glsl */ `
  varying vec2 vP;
  void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const glowFragment = /* glsl */ `
  uniform float uRadius;
  uniform float uAmount;
  uniform vec3 uColor;
  varying vec2 vP;
  void main() {
    float r = length(vP) / uRadius;
    gl_FragColor = vec4(uColor, pow(max(0.0, 1.0 - r), 2.2) * uAmount);
  }
`;

/** Yellow brick: courses of bricks with lighter mortar, from the wall's own position, so no texture. */
function patchBrick(mat: MeshStandardMaterial) {
  mat.onBeforeCompile = shader => {
    const decl = 'varying vec3 vObjPos;\nvarying vec3 vObjNormal;';
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${decl}`)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;\nvObjNormal = normal;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\n${decl}`).replace(
      '#include <color_fragment>',
      `#include <color_fragment>
      {
        vec3 n = abs(normalize(vObjNormal));
        vec2 p = n.x > n.z ? vObjPos.zy : vObjPos.xy;
        vec2 b = p / vec2(0.26, 0.085);
        b.x += step(1.0, mod(floor(b.y), 2.0)) * 0.5;
        vec2 f = fract(b);
        vec2 w = fwidth(b) * 1.5;
        float brick = smoothstep(0.0, 0.06 + w.x, f.x) * smoothstep(0.0, 0.14 + w.y, f.y);
        float tone = fract(sin(dot(floor(b), vec2(12.9898, 78.233))) * 43758.5453);
        if (n.y < 0.6) diffuseColor.rgb *= mix(1.14, 0.9 + tone * 0.14, brick);
      }`,
    );
  };
}

// ---------- the scene ----------

interface Flow {
  key: FlowKey;
  core: Mesh<TubeGeometry, ShaderMaterial>;
  halo: Mesh<TubeGeometry, ShaderMaterial>;
  /** Where the mark is, 0-1 along the line. */
  phase: number;
}

interface Cloud {
  mesh: Mesh;
  speed: number;
  base: Vector3;
}

export class IslandScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(24, 1, 0.5, 200);
  private readonly clock = new Clock();
  private readonly root = new Group();
  private model?: Object3D;
  private flows: Flow[] = [];
  private anchors = new Map<LabelKey, Object3D>();
  private spinners: Array<{ node: Object3D; kind: string }> = [];
  private floaters: Array<{ node: Object3D; y: number; phase: number }> = [];
  private nightLights: Array<{ light: PointLight; max: number }> = [];
  private clouds: Cloud[] = [];
  private cloudMat = new MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#eef3ff', emissiveIntensity: 0.18 });
  private winds: Array<{ mesh: Mesh<BufferGeometry, ShaderMaterial>; phase: number; period: number }> = [];
  private readonly windGroup = new Group();
  private readonly windDir = new Vector3(1, 0, 0.3).normalize();
  /** Shared by every swaying material, so one write moves all the trees. */
  private readonly swayU = { uTime: { value: 0 }, uSway: { value: new Vector2() } };
  private glows: Array<Mesh<CircleGeometry, ShaderMaterial>> = [];
  private driveMat?: MeshStandardMaterial;
  private bins: Array<{ node: Object3D; home: Vector3; out: Vector3; lids: MeshStandardMaterial[] }> = [];
  private rain!: LineSegments<BufferGeometry, ShaderMaterial>;
  private snow!: Points<BufferGeometry, ShaderMaterial>;
  private smoke!: Points<BufferGeometry, ShaderMaterial>;
  private stars!: Points<BufferGeometry, ShaderMaterial>;
  private windowMat?: MeshStandardMaterial;
  private lampMat?: MeshStandardMaterial;
  private ledMat?: MeshStandardMaterial;
  private paintMat?: MeshStandardMaterial;
  private readonly sun = new DirectionalLight('#fff4e0', 2.6);
  private readonly hemi = new HemisphereLight('#dfefff', '#5b6b4a', 1.1);
  /** A cool fill from the far side, so shadowed clay reads soft rather than black. */
  private readonly fill = new DirectionalLight('#dfe8ff', 0.6);
  private readonly fog = new Fog('#dce3e5', 30, 80);

  private state?: SceneState;
  /** Values that ease towards the state, so changes fade rather than jump. */
  private eased = { night: 0, clouds: 0, gloom: 0, rain: 0, snow: 0, fog: 0, wind: 0, smoke: 0, drive: 0 };
  private spin = new Map<string, number>();
  private flash = 0;
  private nextFlash = 3;
  private secondFlash = 0;

  private width = 1;
  private height = 1;
  private yaw = 0;
  private yawVelocity = 0;
  private dragging = false;
  private lastDrag = 0;
  private frame = 0;
  private running = false;
  private time = 0;
  private framing = new Sphere(new Vector3(), 8);
  /** Zooming in on one spot while the card shows its details beside it. */
  private focusPoint = new Vector3();
  private focusOn = false;
  private focusEase = 0;
  private focusSide: 'right' | 'bottom' = 'right';
  private settle = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly onLabels: (labels: LabelPosition[]) => void,
    pixelRatio: number,
  ) {
    // Throws when WebGL is unavailable; the card then falls back to the flat energy card.
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer = renderer;
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    this.scene.add(this.root);
    this.scene.add(this.hemi);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.bias = -0.0008;
    this.sun.shadow.normalBias = 0.03;
    const sc = this.sun.shadow.camera;
    sc.left = sc.bottom = -9;
    sc.right = sc.top = 9;
    sc.near = 1;
    sc.far = 60;
    this.scene.add(this.sun, this.sun.target);
    this.fill.position.set(-12, 7, 6);
    this.scene.add(this.fill);
    this.scene.add(this.windGroup);

    this.buildWeather();
    this.bindPointer();
  }

  async load(url: string): Promise<void> {
    const gltf = await new GLTFLoader().loadAsync(url);
    const model = gltf.scene;
    this.model = model;
    this.root.add(model);

    // The bundled model ships without normals (smaller); rebuild them smooth where it says so.
    let computeNormals = false;
    model.traverse(o => {
      if (o.userData.normals === 'compute') computeNormals = true;
    });
    const patched = new Set<MeshStandardMaterial>();
    model.traverse(o => {
      if ((o as Mesh).isMesh) {
        const m = o as Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        const mat = m.material as MeshStandardMaterial;
        if (computeNormals && !m.geometry.attributes.normal) {
          m.geometry.computeVertexNormals();
          mat.flatShading = false;
          mat.needsUpdate = true;
        }
        if (!patched.has(mat)) {
          patched.add(mat);
          if (mat.name === 'Brick') patchBrick(mat);
          if (['Pine', 'PineDark', 'Leaf', 'Bush'].includes(mat.name)) this.patchSway(mat);
        }
        if (mat.name === 'DriveLight') this.driveMat = mat;
        if (mat.name === 'Window') this.windowMat = mat;
        if (mat.name === 'Lamp') this.lampMat = mat;
        if (mat.name === 'ChargerLed') this.ledMat = mat;
        if (mat.name === 'CarPaint') this.paintMat = mat;
      }
      if (o.name.startsWith('anchor_')) this.anchors.set(o.name.slice(7) as LabelKey, o);
      if (o.userData.spin) this.spinners.push({ node: o, kind: o.userData.spin });
      if (o.name.startsWith('floater_') && o.parent?.name !== o.name) this.floaters.push({ node: o, y: o.position.y, phase: Math.random() * 6 });
      const bin = /^bin_(\d+)$/.exec(o.name);
      if (bin && !(o as Mesh).isMesh) {
        const out: number[] = o.userData.out ?? [0, 0];
        const lids: MeshStandardMaterial[] = [];
        o.traverse(c => {
          const m = (c as Mesh).material as MeshStandardMaterial | undefined;
          if (m && new RegExp(`^Bin${bin[1]}[AB]$`).test(m.name) && !lids.includes(m)) lids.push(m);
        });
        lids.sort((a, b) => a.name.localeCompare(b.name));
        this.bins[Number(bin[1])] = { node: o, home: o.position.clone(), out: o.position.clone().add(new Vector3(out[0], 0, out[1])), lids };
      }
      if (o.userData.glow) {
        const g = o.userData.glow;
        const mesh = new Mesh(
          new CircleGeometry(g.radius, 28),
          new ShaderMaterial({
            vertexShader: glowVertex,
            fragmentShader: glowFragment,
            uniforms: { uRadius: { value: g.radius }, uAmount: { value: 0 }, uColor: { value: new Color(g.color) } },
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
          }),
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.renderOrder = 1;
        o.add(mesh);
        this.glows.push(mesh);
      }
      if (o.userData.light) {
        const l = o.userData.light;
        const light = new PointLight(l.color, 0, l.distance, 1.4);
        o.add(light);
        this.nightLights.push({ light, max: l.intensity * 2.4 });
      }
    });
    // Meshes inside floater groups share the group's name; only the groups should bob.
    this.floaters = this.floaters.filter(f => !(f.node as Mesh).isMesh);

    for (const key of ['grid', 'solar', 'car', 'water'] as FlowKey[]) {
      const node = model.getObjectByName(`flow_${key}`);
      const pts: number[][] | undefined = node?.userData.points;
      if (!node || !pts || pts.length < 2) continue;
      this.flows.push(this.buildFlow(key, pts.map(p => new Vector3(p[0], p[1], p[2]).applyMatrix4(node.parent!.matrixWorld))));
    }

    // Frame the island itself: not the floating rocks around it, and not all of the rock root below.
    const box = new Box3();
    model.traverse(o => {
      if ((o as Mesh).isMesh && !/^(floater_|grid_islet)/.test(o.name) && !/^(floater_|grid_islet)/.test(o.parent?.name ?? '')) box.expandByObject(o);
    });
    box.min.y = Math.max(box.min.y, -1.6);
    box.getBoundingSphere(this.framing);
    this.framing.radius *= 0.8;
    this.applyState();
    this.layout();
  }

  /** Trees and bushes lean and bob with the wind, more towards their tops. */
  private patchSway(mat: MeshStandardMaterial) {
    mat.onBeforeCompile = shader => {
      shader.uniforms.uTime = this.swayU.uTime;
      shader.uniforms.uSway = this.swayU.uSway;
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform vec2 uSway;').replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float h = max(transformed.y, 0.0);
        float gust = 0.55 + 0.45 * sin(uTime * 2.3 + transformed.x * 0.9 + transformed.z * 0.7);
        transformed.xz += uSway * h * h * 0.07 * gust;`,
      );
    };
  }

  private buildFlow(key: FlowKey, pts: Vector3[]): Flow {
    // Straight segments where the route has corners; a smooth curve where it is a sagging wire.
    const path = new CurvePath<Vector3>();
    let i = 0;
    while (i < pts.length - 1) {
      // Runs of closely spaced points (wires) become one smooth curve.
      let j = i + 1;
      while (j < pts.length - 1 && pts[j].distanceTo(pts[j + 1]) < 0.9 && pts[j - 1].distanceTo(pts[j]) < 0.9) j++;
      if (j - i > 2) path.add(new CatmullRomCurve3(pts.slice(i, j + 1)));
      else for (let k = i; k < j; k++) path.add(new LineCurve3(pts[k], pts[k + 1]));
      i = j;
    }
    const length = path.getLength();
    const segs = Math.max(16, Math.round(length * 14));
    const uniforms = () => ({
      uColor: { value: new Color('#ffffff') },
      uPhase: { value: 0 },
      uSpeed: { value: 1 },
      uLength: { value: length },
      uActive: { value: 0 },
      uHalo: { value: 0 },
      uNight: { value: 0 },
    });
    const make = (radius: number, halo: boolean) => {
      const mat = new ShaderMaterial({
        vertexShader: flowVertex,
        fragmentShader: flowFragment,
        uniforms: uniforms(),
        transparent: true,
        depthWrite: false,
        blending: halo ? AdditiveBlending : undefined,
      });
      mat.uniforms.uHalo.value = halo ? 1 : 0;
      const mesh = new Mesh(new TubeGeometry(path, segs, radius, 6, false), mat);
      mesh.renderOrder = halo ? 3 : 2;
      this.root.add(mesh);
      return mesh;
    };
    return { key, core: make(0.04, false), halo: make(0.12, true), phase: Math.random() };
  }

  private buildWeather() {
    const R = 7.5;
    const top = 8;
    const height = 16;
    // Rain.
    {
      const n = 900;
      const pos = new Float32Array(n * 6);
      const tip = new Float32Array(n * 2);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * R;
        const x = Math.cos(a) * r, y = Math.random() * height, z = Math.sin(a) * r;
        pos.set([x, y, z, x, y, z], i * 6);
        tip.set([0, 1], i * 2);
      }
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(pos, 3));
      g.setAttribute('aTip', new BufferAttribute(tip, 1));
      this.rain = new LineSegments(
        g,
        new ShaderMaterial({
          vertexShader: rainVertex,
          fragmentShader: rainFragment,
          uniforms: { uTime: { value: 0 }, uWind: { value: 0 }, uDir: { value: new Vector2(1, 0) }, uTop: { value: top }, uHeight: { value: height }, uAmount: { value: 0 }, uColor: { value: new Color('#cfe6f5') } },
          transparent: true,
          depthWrite: false,
        }),
      );
      this.rain.frustumCulled = false;
      this.scene.add(this.rain);
    }
    // Snow.
    {
      const n = 700;
      const pos = new Float32Array(n * 3);
      const seed = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * R;
        pos.set([Math.cos(a) * r, Math.random() * height, Math.sin(a) * r], i * 3);
        seed[i] = Math.random();
      }
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(pos, 3));
      g.setAttribute('aSeed', new BufferAttribute(seed, 1));
      this.snow = new Points(
        g,
        new ShaderMaterial({
          vertexShader: snowVertex,
          fragmentShader: snowFragment,
          uniforms: { uTime: { value: 0 }, uWind: { value: 0 }, uDir: { value: new Vector2(1, 0) }, uTop: { value: top }, uHeight: { value: height }, uAmount: { value: 0 }, uScale: { value: 400 } },
          transparent: true,
          depthWrite: false,
        }),
      );
      this.snow.frustumCulled = false;
      this.scene.add(this.snow);
    }
    // Chimney smoke (the chimney top in the model sits at about (-1, 4.2, -1.45)).
    {
      const n = 14;
      const pos = new Float32Array(n * 3);
      const seed = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        pos.set([-1.0, 4.25, -1.45], i * 3);
        seed[i] = i / n;
      }
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(pos, 3));
      g.setAttribute('aSeed', new BufferAttribute(seed, 1));
      this.smoke = new Points(
        g,
        new ShaderMaterial({
          vertexShader: smokeVertex,
          fragmentShader: smokeFragment,
          uniforms: { uTime: { value: 0 }, uScale: { value: 400 }, uWind: { value: 0 }, uDir: { value: new Vector2(1, 0) }, uAmount: { value: 0 }, uColor: { value: new Color('#e8ecef') } },
          transparent: true,
          depthWrite: false,
        }),
      );
      this.smoke.frustumCulled = false;
      this.root.add(this.smoke);
    }
    // Stars, on a shell behind the island, for clear nights.
    {
      const n = 160;
      const pos = new Float32Array(n * 3);
      const seed = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const v = new Vector3(Math.random() - 0.5, Math.random() * 0.8 + 0.05, Math.random() - 0.5).normalize().multiplyScalar(40);
        pos.set([v.x, v.y, v.z], i * 3);
        seed[i] = Math.random();
      }
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(pos, 3));
      g.setAttribute('aSeed', new BufferAttribute(seed, 1));
      this.stars = new Points(
        g,
        new ShaderMaterial({
          vertexShader: /* glsl */ `
            attribute float aSeed;
            uniform float uTime;
            varying float vTw;
            void main() {
              vTw = 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 40.0);
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = 1.5 + aSeed * 2.0;
              gl_Position = projectionMatrix * mv;
            }`,
          fragmentShader: /* glsl */ `
            uniform float uAmount;
            varying float vTw;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              gl_FragColor = vec4(vec3(1.0), smoothstep(0.5, 0.0, d) * vTw * uAmount);
            }`,
          uniforms: { uTime: { value: 0 }, uAmount: { value: 0 } },
          transparent: true,
          depthWrite: false,
        }),
      );
      this.stars.frustumCulled = false;
      this.scene.add(this.stars);
    }
    // Clouds: soft puffs with flat bottoms, like they were pressed out of clay.
    for (let i = 0; i < 6; i++) {
      const parts: BufferGeometry[] = [];
      const lumps = 3 + (i % 3);
      for (let k = 0; k < lumps; k++) {
        const mid = 1 - Math.abs(k - (lumps - 1) / 2) / lumps;
        const g = new SphereGeometry(0.42 + mid * 0.38 + Math.random() * 0.1, 18, 12);
        g.translate((k - (lumps - 1) / 2) * 0.62, mid * 0.18, (Math.random() - 0.5) * 0.4);
        g.deleteAttribute('uv');
        parts.push(g);
      }
      const geo = mergeGeometries(parts);
      const pos = geo.attributes.position;
      for (let v = 0; v < pos.count; v++) if (pos.getY(v) < 0) pos.setY(v, pos.getY(v) * 0.22);
      geo.computeVertexNormals();
      const mesh = new Mesh(geo, this.cloudMat);
      mesh.castShadow = true;
      const base = new Vector3(-10 + Math.random() * 20, 4.4 + Math.random() * 0.9, -7 + (i % 3) * 1.6 + Math.random());
      mesh.position.copy(base);
      mesh.scale.setScalar(0.85 + Math.random() * 0.5);
      this.scene.add(mesh);
      this.clouds.push({ mesh, base, speed: 0.15 + Math.random() * 0.15 });
    }

    // Wind: long translucent ribbons laid along +x, drifting in gentle waves with the odd curl; the
    // group turns to the wind's direction.
    for (let i = 0; i < 10; i++) {
      const pts: Vector3[] = [];
      const L = 11 + Math.random() * 5;
      const curl = i % 4 === 1;
      const ph = Math.random() * 6;
      for (let k = 0; k <= 60; k++) {
        const t = k / 60;
        let x = -L / 2 + L * t;
        let y = Math.sin(t * Math.PI * 1.3 + ph) * 0.35;
        const z = Math.sin(t * Math.PI * 0.9 + ph * 1.7) * 0.7;
        if (curl) {
          const a = MathUtils.clamp((t - 0.52) / 0.12, 0, 1) * Math.PI * 2;
          x -= Math.sin(a) * 0.55;
          y += (1 - Math.cos(a)) * 0.55;
        }
        pts.push(new Vector3(x, y, z));
      }
      const w = 0.3 + Math.random() * 0.28;
      const mesh = new Mesh(
        ribbon(new CatmullRomCurve3(pts), 140, t => w * (0.4 + 0.6 * Math.sin(Math.PI * t))),
        new ShaderMaterial({
          vertexShader: windVertex,
          fragmentShader: windFragment,
          uniforms: { uHead: { value: -1 }, uAmount: { value: 0 }, uColor: { value: new Color('#ffffff') } },
          transparent: true,
          depthWrite: false,
          side: DoubleSide,
        }),
      );
      mesh.position.set((Math.random() - 0.5) * 3, 0.6 + Math.random() * 3.2, -4.5 + (i / 9) * 9 + (Math.random() - 0.5));
      mesh.renderOrder = 4;
      mesh.frustumCulled = false;
      this.windGroup.add(mesh);
      this.winds.push({ mesh, phase: Math.random(), period: 0.9 + Math.random() * 0.7 });
    }
  }

  // ---------- state ----------

  setState(s: SceneState) {
    const first = !this.state;
    this.state = s;
    if (first) {
      // No easing on the first frame: start where the state says.
      Object.assign(this.eased, { night: s.night, clouds: s.weather.clouds, gloom: s.weather.gloom, rain: s.weather.rain, snow: s.weather.snow, fog: s.weather.fog, wind: s.weather.wind, drive: s.driveLights });
    }
    this.applyState();
    if (!this.running) this.renderOnce();
  }

  private applyState() {
    const s = this.state;
    if (!s || !this.model) return;
    const show = (name: string, on: boolean) => {
      const o = this.model!.getObjectByName(name);
      if (o) o.visible = on;
    };
    show('solar', !s.hidden.includes('solar'));
    show('car', !!s.car);
    show('charge_cable', !!s.car?.plugged);
    // Bins beyond the schedule's rounds are put away; without a schedule they all stay.
    this.bins.forEach((b, i) => {
      const round = s.bins?.[i];
      b.node.visible = !s.bins || !!round;
      round?.colors.forEach((c, k) => b.lids[k]?.color.set(c));
    });
    if (s.car) {
      this.paintMat?.color.set(s.car.color);
      this.ledMat?.color.set(s.car.ledColor);
      this.ledMat?.emissive.set(s.car.ledColor);
    }
    for (const f of this.flows) {
      const v = s.flows[f.key];
      f.core.visible = f.halo.visible = v !== null;
      for (const m of [f.core.material, f.halo.material]) {
        m.uniforms.uColor.value.set(s.colors[f.key]);
        m.uniforms.uSpeed.value = v ?? 0;
        m.uniforms.uActive.value = v ? 1 : 0;
      }
    }
    this.fog.color.set(s.fogColor);
  }

  // ---------- frame loop ----------

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    const loop = () => {
      if (!this.running) return;
      this.frame = requestAnimationFrame(loop);
      this.tick(Math.min(0.05, this.clock.getDelta()));
    };
    this.frame = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  /** One frame without advancing animation: for motion-off and for changes while stopped. */
  renderOnce() {
    this.tick(0, true);
  }

  /**
   * Zooms in on a label's spot (null zooms back out). `side` is where the card puts its details: the
   * view slides the other way, so the spot stays visible beside them.
   */
  focus(key: LabelKey | null, side: 'right' | 'bottom' = 'right') {
    const node = key ? this.anchors.get(key) : undefined;
    if (node) {
      // Aim at the thing itself, not at the label floating beside it: the bins and the car by their own
      // positions, anything else a little below its label.
      const car = this.model?.getObjectByName('car');
      if (key === 'bins' && this.bins.length) {
        this.focusPoint.set(0, 0, 0);
        this.bins.forEach(b => this.focusPoint.add(b.node.getWorldPosition(new Vector3())));
        this.focusPoint.divideScalar(this.bins.length).setY(0.6);
      } else if (key === 'car' && car?.visible) {
        car.getWorldPosition(this.focusPoint).setY(0.6);
      } else {
        node.getWorldPosition(this.focusPoint);
        this.focusPoint.y = Math.max(0.5, this.focusPoint.y - 1.4);
      }
    }
    this.focusOn = !!node;
    this.focusSide = side;
    if (!this.running) this.animateFor(1.2);
  }

  /** Runs frames for a while without motion, so a zoom still eases when animations are paused. */
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

  resize(width: number, height: number) {
    if (width < 1 || height < 1) return;
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.layout();
    if (!this.running) this.renderOnce();
  }

  private layout() {
    const aspect = this.width / this.height;
    this.camera.aspect = aspect;
    const vfov = MathUtils.degToRad(this.camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    const fit = Math.min(vfov, hfov);
    this.camDistance = this.framing.radius / Math.sin(fit / 2);
    this.camera.near = Math.max(0.5, this.camDistance - 30);
    this.camera.far = this.camDistance + 60;
    this.camera.updateProjectionMatrix();
  }
  private camDistance = 40;

  /** `cameraOnly`: a frame that moves the camera (a zoom easing in) while everything else stands still. */
  private tick(dt: number, still = false, cameraOnly = false) {
    const s = this.state;
    if (!s || !this.model) return;
    const motion = s.motion && !still && !cameraOnly;
    if (motion) this.time += dt;
    const t = this.time;
    const e = this.eased;
    const ease = still ? 1 : 1 - Math.exp(-dt * 1.5);
    const w = s.weather;
    const smokeTarget = w.temperature !== undefined && w.temperature < 12 ? 1 : 0;
    for (const [k, target] of [
      ['night', s.night],
      ['clouds', w.clouds],
      ['gloom', w.gloom],
      ['rain', w.rain],
      ['snow', w.snow],
      ['fog', w.fog],
      ['wind', w.wind],
      ['smoke', smokeTarget],
      ['drive', s.driveLights],
    ] as Array<[keyof typeof e, number]>) {
      e[k] = still && !motion ? target : e[k] + (target - e[k]) * ease;
    }

    // Camera: a fixed three-quarter view the viewer can swing by dragging; it eases home afterwards.
    if (!this.dragging) {
      this.yaw += this.yawVelocity * dt;
      this.yawVelocity *= Math.exp(-dt * 4);
      if (performance.now() - this.lastDrag > 2500) this.yaw += (0 - this.yaw) * (1 - Math.exp(-dt * 1.2));
    }
    // Zoom: ease towards the focused spot and closer in, and slide the picture aside for the details.
    this.focusEase += ((this.focusOn ? 1 : 0) - this.focusEase) * (still && !cameraOnly ? 1 : 1 - Math.exp(-dt * 4));
    const f = this.focusEase;
    const az = MathUtils.degToRad(34) + this.yaw;
    const el = MathUtils.degToRad(27 + f * 4);
    const c = this.framing.center.clone().lerp(this.focusPoint, f);
    const dist = this.camDistance * (1 - 0.5 * f);
    this.camera.position.set(c.x + Math.sin(az) * Math.cos(el) * dist, c.y + Math.sin(el) * dist, c.z + Math.cos(az) * Math.cos(el) * dist);
    this.camera.lookAt(c);
    if (f > 0.001) {
      const w = this.width, h = this.height;
      if (this.focusSide === 'right') this.camera.setViewOffset(w, h, w * 0.24 * f, 0, w, h);
      else this.camera.setViewOffset(w, h, 0, h * 0.26 * f, w, h);
    } else if (this.camera.view) this.camera.clearViewOffset();

    // Each bin rolls to the kerb for its own collection, and back afterwards.
    this.bins.forEach((b, i) => b.node.position.lerp(s.bins?.[i]?.out ? b.out : b.home, still ? 1 : 1 - Math.exp(-dt * 1.8)));
    for (const f of this.floaters) f.node.position.y = f.y + Math.sin(t * 0.8 + f.phase) * 0.18;

    // Spinners (the turbine) follow the wind.
    for (const sp of this.spinners) {
      const target = 0.4 + Math.min(e.wind, 20) * 0.45;
      const v = (this.spin.get(sp.kind) ?? 0) + (target - (this.spin.get(sp.kind) ?? 0)) * Math.min(1, dt * 1.2);
      this.spin.set(sp.kind, v);
      sp.node.rotateZ(v * dt);
    }

    // Light: sun or moon, softened by cloud.
    const n = e.night;
    const overcast = e.clouds * 0.5 + e.gloom * 0.35 + e.rain * 0.2;
    const sunDir = new Vector3();
    if (s.sun && n < 0.98) {
      const a = MathUtils.degToRad(s.facing - s.sun.azimuth);
      const elv = MathUtils.degToRad(Math.max(12, s.sun.elevation));
      sunDir.set(Math.sin(a) * Math.cos(elv), Math.sin(elv), Math.cos(a) * Math.cos(elv));
    } else {
      sunDir.set(0.55, 0.75, 0.45);
    }
    if (n > 0.5) sunDir.set(-0.4, 0.8, 0.5); // the moon sits up and to the left
    this.sun.position.copy(sunDir.normalize().multiplyScalar(25));
    this.sun.target.position.set(0, 0, 0);
    const dayColor = new Color('#fff1dc').lerp(new Color('#ffb877'), MathUtils.clamp(n * 2, 0, 1) * (n < 0.5 ? 1 : 0));
    const moon = new Color('#9db4ff');
    this.sun.color.copy(n < 0.5 ? dayColor : moon);
    this.sun.intensity = MathUtils.lerp(2.6, 0.55, n) * (1 - overcast * 0.6) + this.flash * 4;
    this.fill.intensity = MathUtils.lerp(0.7, 0.15, n) * (1 - overcast * 0.3);
    this.hemi.color.set('#dfefff').lerp(new Color('#3a4a78'), n).lerp(new Color('#9aa3ab'), overcast * (1 - n) * 0.6);
    this.hemi.groundColor.set('#5b6b4a').lerp(new Color('#1c2230'), n);
    this.hemi.intensity = MathUtils.lerp(1.15, 0.5, n) + this.flash * 2;

    // Lit windows and lamps at night (and a little on dark days).
    const glow = MathUtils.clamp(n + overcast * 0.25, 0, 1);
    if (this.windowMat) this.windowMat.emissiveIntensity = glow * 2.2;
    if (this.lampMat) this.lampMat.emissiveIntensity = glow * 3;
    // The wallbox light breathes while charging.
    if (this.ledMat) this.ledMat.emissiveIntensity = s.car?.charging && motion ? 0.9 + Math.sin(t * 1.2) * 0.45 : 0.6;
    for (const l of this.nightLights) l.light.intensity = l.max * MathUtils.clamp((n - 0.3) / 0.5, 0, 1);
    if (this.driveMat) this.driveMat.emissiveIntensity = e.drive * 3;
    for (const g of this.glows) g.material.uniforms.uAmount.value = e.drive * (0.25 + n * 0.75);

    // Wind: direction from the bearing (where it blows from) relative to the way the house faces.
    if (w.windBearing !== undefined) {
      const a = MathUtils.degToRad(s.facing - w.windBearing);
      this.windDir.set(-Math.sin(a), 0, -Math.cos(a));
    }
    this.windGroup.rotation.y = Math.atan2(-this.windDir.z, this.windDir.x);
    const strength = MathUtils.clamp(e.wind / 18, 0, 1);
    this.swayU.uTime.value = t;
    this.swayU.uSway.value.set(this.windDir.x, this.windDir.z).multiplyScalar(strength);
    const streaks = Math.round(MathUtils.clamp((e.wind - 1.5) / 11, 0, 1) * this.winds.length);
    const pace = 0.18 + e.wind * 0.035;
    this.winds.forEach((wd, i) => {
      const u = wd.mesh.material.uniforms;
      wd.mesh.visible = i < streaks;
      u.uHead.value = ((t * pace) / wd.period + wd.phase) % 1 * 1.8 - 0.2;
      u.uAmount.value = MathUtils.lerp(0.8, 0.4, n) * (1 - e.fog * 0.6) * (0.6 + strength * 0.4);
      u.uColor.value.set(n > 0.5 ? '#b9c8ff' : '#ffffff');
    });

    // Flow lines.
    for (const f of this.flows) {
      // One lap of the mark takes at least 1.6 s, so short lines (the charge cable) don't flicker past.
      const v = Math.abs(f.core.material.uniforms.uSpeed.value);
      const lap = v > 0 ? Math.max(1.6, f.core.material.uniforms.uLength.value / v) : Infinity;
      if (motion) f.phase = (f.phase + dt / lap) % 1;
      for (const m of [f.core.material, f.halo.material]) {
        m.uniforms.uPhase.value = f.phase;
        m.uniforms.uNight.value = n;
      }
    }

    // Weather.
    const ru = this.rain.material.uniforms;
    ru.uTime.value = t;
    ru.uAmount.value = e.rain;
    ru.uWind.value = e.wind;
    ru.uDir.value.set(this.windDir.x, this.windDir.z);
    this.rain.visible = e.rain > 0.01;
    this.rain.geometry.setDrawRange(0, Math.round(this.rain.geometry.attributes.position.count * Math.min(1, e.rain + 0.2)));
    const su = this.snow.material.uniforms;
    su.uTime.value = t;
    su.uAmount.value = e.snow;
    su.uWind.value = e.wind;
    su.uDir.value.set(this.windDir.x, this.windDir.z);
    su.uScale.value = this.height * this.renderer.getPixelRatio() * 0.9;
    this.snow.visible = e.snow > 0.01;
    const mu = this.smoke.material.uniforms;
    mu.uTime.value = t;
    mu.uAmount.value = e.smoke;
    mu.uWind.value = e.wind;
    mu.uDir.value.set(this.windDir.x, this.windDir.z);
    mu.uScale.value = this.height * this.renderer.getPixelRatio() * 0.9;
    mu.uColor.value.set(n > 0.5 ? '#7d8796' : '#eef1f4');
    this.smoke.visible = e.smoke > 0.01;
    const stu = this.stars.material.uniforms;
    stu.uTime.value = t;
    stu.uAmount.value = MathUtils.clamp((n - 0.5) * 2, 0, 1) * (1 - e.clouds) * (1 - e.fog);
    this.stars.visible = stu.uAmount.value > 0.01;

    const cloudCount = Math.round(e.clouds * this.clouds.length);
    const cloudColor = new Color('#ffffff').lerp(new Color('#6f7880'), e.gloom).lerp(new Color('#2c3444'), n * 0.7);
    this.cloudMat.color.copy(cloudColor);
    this.clouds.forEach((cl, i) => {
      cl.mesh.visible = i < cloudCount;
      // Drift with the wind, wrapping around the island.
      const d = ((t * cl.speed * (1 + e.wind * 0.15) + i * 4) % 24) - 12;
      cl.mesh.position.set(cl.base.x * 0.4 + this.windDir.x * d, cl.base.y + Math.sin(t * 0.3 + i) * 0.15, cl.base.z * 0.6 + this.windDir.z * d);
    });

    // Lightning: rare double flashes while a storm is on.
    if (motion && w.lightning) {
      this.nextFlash -= dt;
      if (this.nextFlash <= 0) {
        this.flash = 1;
        this.secondFlash = 0.18;
        this.nextFlash = 4 + Math.random() * 7;
      }
      if (this.secondFlash > 0) {
        this.secondFlash -= dt;
        if (this.secondFlash <= 0) this.flash = 0.8;
      }
    }
    this.flash = Math.max(0, this.flash - dt * 4);

    this.scene.fog = e.fog > 0.02 ? this.fog : null;
    this.fog.near = this.camDistance - 6 + (1 - e.fog) * 30;
    this.fog.far = this.camDistance + 8 + (1 - e.fog) * 60;

    this.renderer.render(this.scene, this.camera);
    this.emitLabels();
  }

  private lastLabels = '';
  private emitLabels() {
    const out: LabelPosition[] = [];
    const v = new Vector3();
    for (const [key, node] of this.anchors) {
      node.getWorldPosition(v);
      v.project(this.camera);
      const x = (v.x * 0.5 + 0.5) * this.width;
      const y = (-v.y * 0.5 + 0.5) * this.height;
      out.push({ key, x: Math.round(x * 2) / 2, y: Math.round(y * 2) / 2, visible: v.z < 1 && x > -40 && x < this.width + 40 });
    }
    const sig = out.map(l => `${l.x},${l.y},${l.visible}`).join(';');
    if (sig === this.lastLabels) return;
    this.lastLabels = sig;
    this.onLabels(out);
  }

  // ---------- pointer: drag to swing the island around ----------

  private bindPointer() {
    let lastX = 0;
    let lastT = 0;
    let id = -1;
    const c = this.canvas;
    c.addEventListener('pointerdown', ev => {
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
      const dx = ev.clientX - lastX;
      const d = (-dx / Math.max(200, this.width)) * Math.PI * 0.9;
      this.yaw = MathUtils.clamp(this.yaw + d, -1.4, 1.4);
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
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as { dispose?: () => void } | Array<{ dispose(): void }> | undefined;
      if (Array.isArray(mat)) mat.forEach(x => x.dispose());
      else mat?.dispose?.();
    });
    this.renderer.dispose();
  }
}
