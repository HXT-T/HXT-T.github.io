import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 保持默认 '/'：主页部署在 hxt-t.github.io 根路径
// 每个页面一个入口 html，对应 src/<页面>/main.jsx；
// 页面清单与编号见 src/data/navigation.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        travel: resolve(__dirname, 'travel.html'),
        blog: resolve(__dirname, 'blog.html'),
        moments: resolve(__dirname, 'moments.html'),
        books: resolve(__dirname, 'books.html'),
        wardrobe: resolve(__dirname, 'wardrobe.html'),
      },
    },
  },
})
