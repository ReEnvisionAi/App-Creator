import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      NEXT_PUBLIC_VERCEL_ENV: JSON.stringify(process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'),
      NEXT_PUBLIC_VERCEL_URL: JSON.stringify(process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:5173'),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
})