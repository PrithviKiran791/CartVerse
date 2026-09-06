import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('zustand')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion') || id.includes('gsap') || id.includes('canvas-confetti')) {
              return 'animation-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui-icons';
            }
            return 'vendor';
          }
          if (id.includes('src/data/mockProducts') || id.includes('src/data/coolingProducts')) {
            return 'hardware-catalog-data';
          }
          if (id.includes('src/components/catalog/DetailedSpecView')) {
            return 'detailed-specs-view';
          }
        },
      },
    },
  },
});
