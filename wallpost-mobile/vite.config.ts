import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgrPlugin from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgrPlugin(),
  ],
  build: {
    outDir: 'dist',
    rolldownOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
    }
  }
})
