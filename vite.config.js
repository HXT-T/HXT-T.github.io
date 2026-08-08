import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 保持默认 '/'：主页部署在 hxt-t.github.io 根路径，博客在 /blog 子路径
// 多页入口：index.html → /，travel.html → /travel
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        travel: resolve(__dirname, 'travel.html'),
      },
    },
  },
})
