import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local-first static app. No backend, no proxy.
export default defineConfig({
  plugins: [react()],
})
