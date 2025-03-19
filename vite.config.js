import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Base URL configuration for GitHub Pages
  // Use './' for relative paths to enable proper asset loading on GitHub Pages
  base: './',
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Enable source maps for debugging
    sourcemap: true,
    // Optimize dependencies
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue']
        }
      }
    }
  }
})