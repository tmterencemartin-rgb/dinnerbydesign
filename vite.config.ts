import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      'globalThis.__DBD_API_BASE_URL__': JSON.stringify(env.VITE_API_BASE_URL || ''),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/firebase/') || id.includes('/node_modules/@firebase/')) {
              return 'firebase-vendor';
            }
            if (id.includes('/node_modules/framer-motion/')) {
              return 'motion-vendor';
            }
            if (id.includes('/node_modules/lucide-react/')) {
              return 'icons-vendor';
            }
            if (id.includes('/src/content/')) {
              return 'public-content';
            }
            return undefined;
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
