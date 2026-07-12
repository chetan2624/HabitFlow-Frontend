import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'HabitFlow',
        short_name: 'HabitFlow',
        description: 'Design Your Perfect Day',
        theme_color: '#1C1A14',
        background_color: '#FDFAF6',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          }
        ]
      }
    })
  ],

  server: {
    port: 5173,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})