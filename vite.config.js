import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Base URL configuration for GitHub Pages
  // Set to './' for relative paths to enable proper asset loading on GitHub Pages
  base: './',
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Add content hashing to ensure proper cache invalidation
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', '@vueuse/core']
        }
      }
    }
  }
})