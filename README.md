# hxt-t.github.io

个人主页，部署在 <https://hxt-t.github.io>。

## 技术栈

React 18 + Vite 6，纯 CSS（CSS 变量），无 UI 框架；博客用 Markdown + `marked` 渲染。

## 本地开发

```bash
npm install
npm run dev    # http://localhost:5173
```

## 页面结构

| 路径 | 入口 html | 页面组件 | 内容来源 |
| --- | --- | --- | --- |
| `/` | `index.html` | `src/App.jsx` | `src/data.js` |
| `/travel` | `travel.html` | `src/travel/Travel.jsx` | `src/data.js` |
| `/blog` | `blog.html` | `src/blog/Blog.jsx` | `src/posts/*.md` |
| `/moments` | `moments.html` | `src/moments/Moments.jsx` | `src/data.js` |
| `/books` | `books.html` | `src/books/Books.jsx` | `src/data.js` |

多页入口见 `vite.config.js`。子页面共享顶栏/页脚（`src/components/`）与骨架样式（`src/pages.css`），各页面的专属样式在同目录 css 里。

## 修改内容

站点文案（昵称、头衔、标签、名言库、旅行足迹、瞬间、书架）集中在 `src/data.js`。

## 写博客

在 `src/posts/` 新建 Markdown 文件，开头写 frontmatter：

```markdown
---
title: 文章标题
date: 2026-08-09
category: 哲学思考
excerpt: 一句话摘要
---

正文用 Markdown 书写。
```

- 文件名即文章的 slug，例如 `hello.md` → `/blog?post=hello`
- `category` 建议与 `src/data.js` 里 `categories` 的名称保持一致，列表页才能按分类筛选
- 构建时自动收录，无需注册

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建 `dist/` 并发布到 GitHub Pages，
无需手动操作。构建产物 `dist/` 不需要提交。
