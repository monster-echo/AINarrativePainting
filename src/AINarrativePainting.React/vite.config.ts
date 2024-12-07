/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const DEV_SERVER_COMFYUI_URL =
  process.env.DEV_SERVER_COMFYUI_URL || 'http://127.0.0.1:8188'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    proxy: {
      '/api': {
        target: DEV_SERVER_COMFYUI_URL,
        // Return empty array for extensions API as these modules
        // are not on vite's dev server.
        bypass: (req, res, options) => {
          if (req.url === '/api/extensions') {
            res.end(JSON.stringify([]))
          }
          return null
        },
      },
    },
  },
})
