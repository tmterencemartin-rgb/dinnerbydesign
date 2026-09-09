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
            const normalizedId = id.replaceAll('\\', '/');
            if (normalizedId.includes('/node_modules/@google/genai/')) {
              return 'gemini-vendor';
            }
            if (
              normalizedId.includes('/node_modules/firebase/auth/')
              || normalizedId.includes('/node_modules/@firebase/auth/')
            ) {
              return 'firebase-auth';
            }
            if (
              normalizedId.includes('/node_modules/firebase/firestore/')
              || normalizedId.includes('/node_modules/@firebase/firestore/')
            ) {
              return 'firebase-firestore';
            }
            if (normalizedId.includes('/node_modules/firebase/') || normalizedId.includes('/node_modules/@firebase/')) {
              return 'firebase-vendor';
            }
            if (normalizedId.includes('/node_modules/framer-motion/')) {
              return 'motion-vendor';
            }
            if (normalizedId.includes('/node_modules/lucide-react/')) {
              return 'icons-vendor';
            }
            return undefined;
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      exclude: ['e2e/**', 'node_modules/**', 'functions/**', 'dist/**'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
