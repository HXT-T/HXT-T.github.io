---
title: "使用 Jekyll + Chirpy 搭建个人博客"
date: 2026-07-03 18:30:00 +0800
categories: [技术]
tags: [jekyll, chirpy, 博客]
---

Chirpy 是一个简洁、优雅的 Jekyll 主题，非常适合用作个人博客。本文记录我搭建本博客的过程。

## 为什么选择 Chirpy？

1. **GitHub Pages 原生支持** — 无需额外服务器
2. **响应式设计** — 在手机和桌面都有良好的阅读体验
3. **内置功能丰富** — 搜索、标签、分类、时间线、深色模式
4. **配置简单** — 改几行 YAML 即可上线

## 快速部署

最简单的方式是直接 Fork [chirpy-starter](https://github.com/cotes2020/chirpy-starter) 仓库，然后修改 `_config.yml` 即可。

## 写作流程

在 `_posts` 目录下新建 Markdown 文件，命名格式为 `YYYY-MM-DD-title.md`，头部添加 YAML front matter：

```yaml
---
title: "文章标题"
date: 2026-07-03 12:00:00 +0800
categories: [技术]
tags: [jekyll, 教程]
---
```

然后直接写 Markdown 内容即可。

## 参考链接

- [Chirpy 官方文档](https://chirpy.cotes.page/)
- [Jekyll 文档](https://jekyllrb.com/)
