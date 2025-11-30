import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    port: 3000,
    host: true
  },

  plugins: [
    react(),

    VitePWA({
      manifest: {
        name: 'Pagla School',
        short_name: 'Pagla School',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          { src: '/logo.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo.png', sizes: '512x512', type: 'image/png' }
        ]
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],

        // Allow larger JS bundles if needed
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,

        // Exclude BIG assets so SW won't crash
        globIgnores: [
          "assets/img/theme/sidebar-bg-*.svg",
          "assets/img/icons/subject.svg"
        ]
      }
    })
  ],

  build: {
    rollupOptions: {
      output: {
        // Only splits vendor libs (minor impact)
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
