import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (req.url === '/api/get-next-completion-stream-promise') {
              import('./api/get-next-completion-stream-promise.ts')
                .then(module => module.handler(req))
                .then(response => {
                  res.writeHead(response.status, response.headers)
                  response.body?.pipeTo(res)
                })
                .catch(error => {
                  console.error('API Error:', error)
                  res.writeHead(500)
                  res.end('Internal Server Error')
                })
            }
          })
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './')
    }
  },
  publicDir: 'public',
  define: {
    'process.env': {
      VITE_TOGETHER_API_KEY: JSON.stringify(process.env.VITE_TOGETHER_API_KEY || ''),
      VITE_OPENAI_API_KEY: JSON.stringify(process.env.VITE_OPENAI_API_KEY || ''),
      VITE_HELICONE_API_KEY: JSON.stringify(process.env.VITE_HELICONE_API_KEY || ''),
      DATABASE_URL: JSON.stringify(process.env.DATABASE_URL || ''),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
})