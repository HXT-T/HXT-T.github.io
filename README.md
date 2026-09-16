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
| `/` | `index.html` | `src/App.jsx` | `src/data.js` + `src/data/projects.js` |
| `/projects` | `projects.html` | `src/projects/Projects.jsx` | `src/data/projects.js` |
| `/travel` | `travel.html` | `src/travel/Travel.jsx` | `src/data.js` |
| `/blog` | `blog.html` | `src/blog/Blog.jsx` | `src/posts/*.md` |
| `/moments` | `moments.html` | `src/moments/Moments.jsx` | `src/data.js` |
| `/books` | `books.html` | `src/books/Books.jsx` | `src/data.js` |

多页入口见 `vite.config.js`。子页面共享顶栏/页脚（`src/components/`）与骨架样式（`src/pages.css`），各页面的专属样式在同目录 css 里。

## 修改内容

站点文案（昵称、头衔、标签、名言库、旅行足迹、瞬间、书架）集中在 `src/data.js`。

## 添加项目 / Demo

### 页面分工

- 首页：个人介绍、重点 MVP、实验摘要、最近文章与生活入口。
- Product Lab `/projects`：全部作品的目录。
- MVP 工作台 `/projects?view=mvp`：正在构建的最小可用版本。
- 已上线、实验、构想、归档：通过 `?view=live|experiments|concepts|archived` 直接访问。
- Writing：长文与笔记；Books：阅读；Moments：短记；Travel：旅行记录；About：个人介绍。

### 将项目放入 MVP 工作台

在项目数据中设置 `stage: 'mvp'`、`status: 'building'`、`archived: false`。
填写 `mvpGoal`（核心目标），按实际进展填写 `nextStep` 和 `updatedAt`。
首页自动展示优先级最高的三个 MVP，工作台展示全部 MVP。
上线后将 `status` 改为 `live`，确认 Demo 可访问后启用 `demoAvailable`。
项目会自动离开正在构建区，进入已上线视图。

产品代码保持在独立仓库，主站只负责展示与链接。新增项目时：

1. 在 `src/data/projects.js` 增加一条项目数据。
2. 如果已有真实截图，放进 `public/work/` 并填写 `image`；没有截图可先留空。
3. 独立 Demo 部署成功后填写 `demoUrl`，并将 `demoAvailable` 改为 `true`。

`activityRank` 控制当前活跃项目的展示顺序。未开放的 Demo 即使保留了预定 URL，也不会渲染成可点击链接。

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
