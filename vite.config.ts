import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './')
    }
  },
  publicDir: 'public',
  define: {
    'process.env': {
      OPENAI_API_KEY: JSON.stringify(process.env.OPENAI_API_KEY || ''),
      OPENAI_API_URL: JSON.stringify(process.env.OPENAI_API_URL || 'https://api.openai.com/v1'),
      OPENAI_MODEL: JSON.stringify(process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'),
      HELICONE_API_KEY: JSON.stringify(process.env.HELICONE_API_KEY || ''),
      DATABASE_URL: JSON.stringify(process.env.DATABASE_URL || ''),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
})