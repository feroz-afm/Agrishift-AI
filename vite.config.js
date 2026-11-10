import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import apiPlugin from './server/vite-api.js'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    apiPlugin(), // /api/* backend in dev & preview
  ],
  server: { host: true },
  build: { chunkSizeWarningLimit: 1200 },
})
