import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Docker/most hosts serve the app at the root ('/'), GitHub Pages serves it
  // under '/<repo-name>/'. VITE_BASE_PATH lets each build target set this
  // without editing code. Defaults to '/' (correct for Docker).
  base: process.env.VITE_BASE_PATH || '/',
  
  // Build optimizations
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['bootstrap', 'react-icons', 'react-hot-toast'],
        }
      }
    }
  },
  
  // Development server
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  
  // Preview server
  preview: {
    port: 4173,
    host: true,
  },
})