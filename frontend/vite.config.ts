import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Optimize and prevent SSR externalization for some client-only ESM packages
// to avoid Vite bundling warnings about module-level directives like 'use client'.
export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/api': 'https://urbancare-hiut.onrender.com',
    },
  },
  optimizeDeps: {
    include: [
      'sonner',
      'framer-motion',
      '@tanstack/react-query',
      '@tanstack/query-core',
      '@tanstack/react-query-devtools',
      'react-router',
      'react-router-dom',
    ],
  },
  ssr: {
    noExternal: [
      'sonner',
      'framer-motion',
      '@tanstack/react-query',
      '@tanstack/query-core',
      '@tanstack/react-query-devtools',
      'react-router',
      'react-router-dom',
    ],
  },
  plugins: [
    tailwindcss(),
  ],
})