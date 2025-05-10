import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const API_BASE = process.env.VITE_API_URL || '/api'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  publicDir: 'public',
  server: {
    proxy: {
      '/api': {
        target: API_BASE,
        changeOrigin: true,
        secure: false
      }
    }
  }
})