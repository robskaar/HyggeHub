import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

// The family's figures (modelled in Blender, scripts/blender) go beside the bundle as they are; the people
// view fetches them next to itself.
const FIGURES = 'scripts/blender/out';

// `npm run build` produces one self-contained ES module, dist/hyggehub.js, which Home Assistant
// loads as a dashboard resource and as the Appearance panel's module_url.
// `npm run dev` serves dev/index.html: every card rendered against a mock `hass`.
export default defineConfig({
  build: {
    lib: { entry: 'src/hyggehub.ts', formats: ['es'], fileName: () => 'hyggehub.js' },
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2021',
    sourcemap: false,
  },
  server: { open: '/dev/index.html' },
  plugins: [
    {
      name: 'hyggehub-people',
      // In development the figures are served from where Blender writes them.
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const m = /\/people\/([a-z0-9]+)\.glb$/.exec(req.url ?? '');
          const file = m && `${FIGURES}/${m[1]}.glb`;
          if (!file || !existsSync(file)) return next();
          res.setHeader('Content-Type', 'model/gltf-binary');
          res.end(readFileSync(file));
        });
      },
      generateBundle() {
        // The family's figures modelled in Blender (scripts/blender), one GLB each.
        if (existsSync(FIGURES)) for (const f of readdirSync(FIGURES)) if (f.endsWith('.glb')) this.emitFile({ type: 'asset', fileName: `people/${f}`, source: readFileSync(`${FIGURES}/${f}`) });
      },
    },
  ],
});
