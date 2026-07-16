# HXT Blog

基于 [Jekyll](https://jekyllrb.com/) + [Chirpy](https://chirpy.cotes.page/) 主题的个人博客。

风格参考：[blog.oksanye.com](https://blog.oksanye.com/)

在线访问：[https://hxt-t.github.io](https://hxt-t.github.io)

## 快速开始

使用 Obsidian 写作与发布：[完整教程](docs/authoring-with-obsidian.md)

### 本地预览（可选）

```bash
# 安装依赖
bundle install

# 启动本地服务器
bundle exec jekyll s
```

### 发布新文章

在 `_posts` 目录下创建 `YYYY-MM-DD-title.md` 文件，参考现有文章格式。

### 推送到 GitHub 自动部署

```bash
git add .
git commit -m "更新博客"
git push origin main
```

GitHub Actions 会自动构建并部署到 GitHub Pages。

## 配置说明

修改 `_config.yml` 中的以下内容：

| 字段 | 说明 |
|------|------|
| `title` | 博客标题 |
| `tagline` | 副标题 |
| `description` | SEO 描述 |
| `author.name` | 作者名 |
| `author.email` | 邮箱 |
| `avatar` | 头像路径（建议放在 `assets/img/`） |
| `bio` | 侧边栏简介 |
| `url` | 网站地址 |
| `github.username` | GitHub 用户名 |

## 导航菜单

在 `_tabs/` 目录下添加 Markdown 文件即可创建新导航项。每个文件需要包含：

```yaml
---
title: 显示名称
icon: Font Awesome 图标类名
order: 排序数字（越小越靠前）
---
```

当前导航：主页、标签、时间线、分类、系列、动态、相遇、赞助、关于我

## 评论系统配置（可选）

本模板已配置 Giscus 评论系统，需要：

1. 在博客仓库中开启 Discussions（Settings → Features → Discussions）
2. 访问 [giscus.app](https://giscus.app/) 获取 repo_id 和 category_id
3. 填入 `_config.yml` 对应字段

## 头像设置

将你的头像图片放到 `assets/img/avatar.png`，然后在 `_config.yml` 中确认 `avatar` 路径正确。

如果没有头像，可以先用 GitHub 默认头像：`https://github.com/hxt-t.png`

## 参考

- [Chirpy 主题文档](https://chirpy.cotes.page/)
- [Jekyll 官方文档](https://jekyllrb.com/docs/)
- [Font Awesome 图标](https://fontawesome.com/icons)
