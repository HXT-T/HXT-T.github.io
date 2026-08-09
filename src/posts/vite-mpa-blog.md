---
title: 用 Vite 多页应用搭一个纯静态博客
date: 2026-08-08
category: 技术探索
excerpt: 没有后端、没有数据库，Markdown + import.meta.glob 就够了。
---

这个网站没有后端，也没有数据库。博客的实现朴素得可爱：

1. 文章是 `src/posts/` 下的 Markdown 文件，开头写几行 frontmatter
2. 构建时用 `import.meta.glob` 把它们全部读进来
3. 浏览器里用 `marked` 渲染成 HTML

## 多页入口

Vite 天然支持多页应用，只要在 `rollupOptions.input` 里登记每一个 html：

```js
input: {
  main: resolve(__dirname, 'index.html'),
  blog: resolve(__dirname, 'blog.html'),
}
```

每个页面一个入口、一份样式，互不影响。GitHub Pages 会把 `/blog` 映射到 `blog.html`，连路由都省了。

有时候，最简单的方案就是最好的方案。
