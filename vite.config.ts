import { defineConfig } from 'vite';

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
});
