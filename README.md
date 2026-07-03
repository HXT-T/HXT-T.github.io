# HXT Blog

基于 Jekyll + Chirpy 主题的个人博客。

在线访问：[https://hxt-t.github.io](https://hxt-t.github.io)

## 快速开始

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

- `title`：博客标题
- `tagline`：副标题
- `description`：描述
- `author`：作者信息
- `url`：网站地址
- `github.username`：GitHub 用户名

## 评论系统配置（可选）

本模板已配置 Giscus 评论系统，需要：

1. 在博客仓库中开启 Discussions
2. 访问 [giscus.app](https://giscus.app/) 获取 repo_id 和 category_id
3. 填入 `_config.yml` 对应字段

## 参考

- [Chirpy 主题文档](https://chirpy.cotes.page/)
- [Jekyll 官方文档](https://jekyllrb.com/docs/)
