import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["spoke-indices-questions-announcement.trycloudflare.com"], // allow all ngrok URLs
  },
})
