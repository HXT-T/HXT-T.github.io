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

| 编号 | 路径 | 入口 html | 页面组件 | 内容来源 |
| --- | --- | --- | --- | --- |
| 00 | `/` | `index.html` | `src/App.jsx` | `src/data.js` + `src/data/projects.js` |
| 01 | `/projects` | `projects.html` | `src/projects/Projects.jsx` | `src/data/projects.js` |
| 02 | `/blog` | `blog.html` | `src/blog/Blog.jsx` | `src/posts/*.md` |
| 03 | `/books` | `books.html` | `src/books/Books.jsx` | `src/data.js` |
| 04 | `/moments` | `moments.html` | `src/moments/Moments.jsx` | `src/data.js` |
| 05 | `/travel` | `travel.html` | `src/travel/Travel.jsx` | 访客浏览器里的 IndexedDB |
| 06 | `/wardrobe` | `wardrobe.html` | `src/wardrobe/Wardrobe.jsx` | 访客浏览器里的 IndexedDB |

多页入口见 `vite.config.js`。

### 站点地图是唯一来源

`src/data/navigation.js` 是全站唯一的页面清单。顶栏、页脚索引、首页的生活入口、
每个页面的编号都从它推导，新增或改名页面只改这一处。

- `masthead: true` 的页面出现在顶栏，其余只出现在页脚的完整索引里。
- `group` 决定页面的归属：`work`（作品、写作）/ `garden`（书架、瞬间、旅行）/ `lab`（独立小工具）。
- `index` 是页面在站点里的编号，页脚的署名 `03 / BOOKS` 就来自这里。

### 页面外壳

除 `/travel` 外的每个页面都是同一套结构，不需要各写一遍：

```jsx
<SiteFrame current="books">          {/* 顶栏 + 页脚 + 关于弹窗 + 跳过导航 */}
  <main className="page-main" id="main-content" tabIndex="-1">
    <PageMasthead page="books" eyebrow="…" title="…" description="…" aside={…} />
    {/* 页面内容 */}
  </main>
</SiteFrame>
```

- `src/components/SiteChrome.jsx` —— 顶栏、页脚、关于弹窗、`SiteFrame` 外壳
- `src/components/PageMasthead.jsx` —— 页头（编号 + 大标题 + 说明 + 右侧小注）
- `src/components/SectionHeading.jsx` —— 页面内部的分区标题

`/travel`（蛙迹）是刻意独立的小应用，有自己的配色与外壳，不走这套骨架。

### 样式

`src/index.css` 是全站唯一的基础样式：配色变量、排版、顶栏、页头、页脚、关于弹窗。
各页面的专属样式在同目录的 css 里，只用 `index.css` 里定义的变量，不要再自己定义一套配色。

## 修改内容

站点文案（昵称、头衔、标签、瞬间、书架、各页页头）集中在 `src/data.js`；
页面清单与编号在 `src/data/navigation.js`；项目数据在 `src/data/projects.js`。

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

## 电子衣橱 `/wardrobe`

登记衣服 → 填气温、场合、天气 → 生成一套今天能穿出门的搭配，并解释为什么这么搭。

数据全部留在访客自己的浏览器里（IndexedDB，没有后端也不上传）：单品和收藏的搭配存
IndexedDB，照片压到长边 720px 的 JPEG 一起存进去；气温/场合/天气这几个默认值存
localStorage。换设备或清缓存前用页面底部的「导出备份」存一份 JSON。

| 文件 | 作用 |
| --- | --- |
| `src/wardrobe/model.js` | 类别、颜色、季节、场合等常量；气温 → 季节/保暖度的换算 |
| `src/wardrobe/outfit.js` | 搭配引擎：随机采样 + 打分（保暖度、季节、场合、配色、最近穿过），并把分数翻译成推荐理由 |
| `src/wardrobe/storage.js` | IndexedDB 读写；浏览器禁用时退回内存 |
| `src/wardrobe/image.js` | 照片压缩 |
| `src/wardrobe/sample.js` | 空衣橱时可一键导入的示例单品 |

调搭配口味改 `outfit.js` 里的打分权重；加类别或颜色改 `model.js` 的常量表即可。

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建 `dist/` 并发布到 GitHub Pages，
无需手动操作。构建产物 `dist/` 不需要提交。
