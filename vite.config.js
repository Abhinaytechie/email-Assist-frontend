import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://springboot-backend-sb2z.onrender.com', // Adjust to your Spring Boot backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

