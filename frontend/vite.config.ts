import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: '/Civicx/',
  server: {
    proxy: {
      '/api': 'https://civic-issue-reporter-application.onrender.com',
    },
  },
  plugins: [
    tailwindcss(),
  ],
})