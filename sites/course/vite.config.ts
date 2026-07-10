import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Megasite Phase 2: this vendored copy is served at /course/ under the
    // unified kcjugran.github.io site. MEGASITE=1 selects that base; the
    // original standalone-repo base logic is kept as fallback so this copy
    // could still be built standalone if ever needed.
    base: process.env.MEGASITE ? '/course/' : (process.env.GITHUB_PAGES ? '/personal-training-foundations/' : '/'),
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
