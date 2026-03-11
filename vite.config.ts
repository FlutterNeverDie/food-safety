import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IPs
  },
  resolve: {
    dedupe: ['react', 'react-dom', '@toss/use-overlay', '@emotion/react', '@emotion/styled'],
  },
  optimizeDeps: {
    exclude: ['@toss/use-overlay'],
  },
})
