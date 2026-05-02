import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'HabitFlow',
        short_name: 'HabitFlow',
        description: 'Design Your Perfect Day',
        theme_color: '#1e293b',
        background_color: '#f8fafc',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/5726/5726613.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/5726/5726613.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  server: {
    allowedHosts: [
      "unrequiting-postnuptial-etha.ngrok-free.dev"
    ]
    // 👉 For easier development, you can use:
    // allowedHosts: "all"
  }
})