import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// IMPORTANT: Change 'eml-site' to match your exact GitHub repo name
// e.g. repo is github.com/nageh-allam/eml-website → base: '/eml-website/'
export default defineConfig({
  plugins: [react()],
  base: '/eml-site/',
})
