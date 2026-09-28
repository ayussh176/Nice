import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
=======
        target: 'http://localhost:3001',
        changeOrigin: true
>>>>>>> 39e2ec5fbf1c01686a442360794d731fe05b21e6
      }
    }
  }
})
