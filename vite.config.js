import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/react-chess-app/'  // <-- IMPORTANT: use your GitHub repo name
})
