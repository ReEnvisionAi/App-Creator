```ts
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
      TOGETHER_API_KEY: JSON.stringify(process.env.TOGETHER_API_KEY),
      HELICONE_API_KEY: JSON.stringify(process.env.HELICONE_API_KEY),
      DATABASE_URL: JSON.stringify(process.env.DATABASE_URL),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
})
```