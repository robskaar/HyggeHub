// Bakes the family's figurines into src/cards/energy-3d/hyggehub-people.glb.gz (shipped as
// dist/hyggehub-people.glb.gz), so the people view loads them instead of sculpting them in the browser:
//
//   npm run people
//
// Who: scripts/people.json (their avatar and interests as in the dashboard). Run it again after changing
// those, or the figure code (bump SHAPES_VERSION in figures.ts when the shapes change: older baked meshes
// are then ignored and sculpted live until baked again).
//
// Every sculpted mesh is one node, its key in extras.key; a head's eyes, brows and smile (points, not
// meshes) are in the scene's extras.heads. To keep it small: each mesh is simplified (the sculpting
// grid gives far more triangles than its shape needs; within a fraction of a millimetre), positions are 16-bit, scaled and placed
// by the node (KHR_mesh_quantization), colours 8-bit, no normals (the card works them out), and the
// whole file is gzipped (the card unzips it with DecompressionStream).
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { MeshoptSimplifier } from 'meshoptimizer';

// GLTFExporter reads its output through FileReader, which Node lacks.
globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(b => {
      this.result = b;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(b => {
      this.result = `data:${blob.type};base64,${Buffer.from(b).toString('base64')}`;
      this.onloadend?.();
    });
  }
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'src/cards/energy-3d/hyggehub-people.glb.gz');
const tmp = resolve(root, 'scripts/.people-bake.mjs');

await build({ entryPoints: [resolve(root, 'scripts/people-bake.ts')], bundle: true, platform: 'node', format: 'esm', outfile: tmp, logLevel: 'error', external: ['three'] });
const { bake } = await import(pathToFileURL(tmp).href);
rmSync(tmp);

await MeshoptSimplifier.ready;
/** Fewer triangles where they don't change the shape (or the painted colours) by more than `err` metres. */
const simplify = (geo, err) => {
  const pos = geo.getAttribute('position');
  const col = geo.getAttribute('color');
  const idx = Uint32Array.from(geo.getIndex().array);
  const P = Float32Array.from(pos.array);
  const [out] = col
    ? MeshoptSimplifier.simplifyWithAttributes(idx, P, 3, Float32Array.from(col.array), 3, [0.02, 0.02, 0.02], null, 0, err, ['ErrorAbsolute'])
    : MeshoptSimplifier.simplify(idx, P, 3, 0, err, ['ErrorAbsolute']);
  const [remap, unique] = MeshoptSimplifier.compactMesh(out);
  const g = new THREE.BufferGeometry();
  const np = new Float32Array(unique * 3);
  const nc = col ? new Float32Array(unique * 3) : undefined;
  for (let i = 0; i < pos.count; i++) {
    const j = remap[i];
    if (j === 0xffffffff || j >= unique) continue;
    np.set(P.subarray(i * 3, i * 3 + 3), j * 3);
    if (nc) nc.set(col.array.subarray(i * 3, i * 3 + 3), j * 3);
  }
  g.setAttribute('position', new THREE.BufferAttribute(np, 3));
  if (nc) g.setAttribute('color', new THREE.BufferAttribute(nc, 3));
  g.setIndex(new THREE.BufferAttribute(out, 1));
  return g;
};

const { people } = JSON.parse(readFileSync(resolve(root, 'scripts/people.json'), 'utf8'));
const t0 = Date.now();
const { version, meshes, heads } = bake(people);
console.log(`sculpted ${people.length} people in ${((Date.now() - t0) / 1000).toFixed(1)} s`);

// Only what the card reads: positions, and colours where they vary (the faces, the plushes).
const scene = new THREE.Scene();
let before = 0;
let after = 0;
const node = (key, src) => {
  before += src.getAttribute('position').count;
  const geo = simplify(src, 0.0006);
  after += geo.getAttribute('position').count;
  const g = new THREE.BufferGeometry();
  const pos = geo.getAttribute('position');
  geo.computeBoundingBox();
  const { min, max } = geo.boundingBox;
  const c = min.clone().add(max).multiplyScalar(0.5);
  const h = max.clone().sub(min).multiplyScalar(0.5).max(new THREE.Vector3(1e-6, 1e-6, 1e-6));
  const q = new Int16Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    q[i * 3] = Math.round(((pos.getX(i) - c.x) / h.x) * 32767);
    q[i * 3 + 1] = Math.round(((pos.getY(i) - c.y) / h.y) * 32767);
    q[i * 3 + 2] = Math.round(((pos.getZ(i) - c.z) / h.z) * 32767);
  }
  g.setAttribute('position', new THREE.BufferAttribute(q, 3, true));
  const col = geo.getAttribute('color');
  if (col && varies(col)) g.setAttribute('color', new THREE.BufferAttribute(Uint8Array.from(col.array, v => Math.round(Math.min(1, Math.max(0, v)) * 255)), 3, true));
  const idx = geo.getIndex().array;
  g.setIndex(new THREE.BufferAttribute(pos.count < 65536 ? Uint16Array.from(idx) : Uint32Array.from(idx), 1));
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial());
  m.position.copy(c);
  m.scale.copy(h);
  m.userData.key = key;
  scene.add(m);
};
const varies = col => {
  for (let i = 3; i < col.array.length; i++) if (Math.abs(col.array[i] - col.array[i % 3]) > 1e-3) return true;
  return false;
};
for (const [key, geo] of meshes) node(key, geo);
const headInfo = {};
for (const [key, h] of heads) {
  node(`${key}#skin`, h.skin);
  if (h.hair) node(`${key}#hair`, h.hair);
  if (h.beard) node(`${key}#beard`, h.beard);
  headInfo[key] = { eyes: h.eyes, eyeR: h.eyeR, brows: h.brows, browR: h.browR, smile: h.smile, hair: !!h.hair, beard: !!h.beard };
}
scene.userData = { version, heads: headInfo };

console.log(`${before} vertices simplified to ${after}`);
const glb = await new GLTFExporter().parseAsync(scene, { binary: true });
const gz = gzipSync(Buffer.from(glb), { level: 9 });
writeFileSync(out, gz);
console.log(`wrote ${out} (${(gz.byteLength / 1024 / 1024).toFixed(2)} MB, ${(glb.byteLength / 1024 / 1024).toFixed(2)} MB unzipped, ${scene.children.length} meshes)`);
