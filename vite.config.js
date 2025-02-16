import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/game/chess/',
  plugins: [react()],
  server: {
    open: true,
    port: 6400,
  },
})