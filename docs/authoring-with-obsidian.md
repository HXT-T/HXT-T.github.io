# 使用 Obsidian 写作并发布博客

## 打开 Vault

在 Obsidian 中选择“打开本地仓库”，目录为 `D:\Az\HXT-T.github.io`。

## 插件

先启用核心插件“模板”。按需安装 Templater、Linter 和 Obsidian Git。初期关闭自动提交和自动推送，只使用手动 Pull、Commit 和 Push。插件配置文件可能包含本地状态，提交前必须查看 Git 差异。

## 写作

1. 先执行 Git Pull。
2. 在 `_drafts` 新建 Markdown 文件。
3. 插入 `_templates/blog-post.md`。
4. 保持 `published: false`，记录内容并选择 `room`、`status` 和 `topics`。
5. 使用标准 Markdown 链接；图片放在 `assets/img/posts`。

## 发布

1. 将文件改名为 `YYYY-MM-DD-lowercase-slug.md` 并移入 `_posts`。
2. 填写非空 `description`，确认日期包含 `+0800`，设置 `published: true`。
3. 运行：

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/Test-BlogPost.ps1 -Path _posts/YYYY-MM-DD-lowercase-slug.md
   bundle exec jekyll build
   ```

4. 检查 `git status` 和 `git diff`，确认没有私人笔记、密钥、工作区状态或未脱敏截图。
5. 提交并推送：

   ```powershell
   git pull --ff-only
   git add _posts/YYYY-MM-DD-lowercase-slug.md assets/img/posts
   git commit -m "post: 发布文章标题"
   git push origin main
   ```

6. 在 GitHub Actions 检查 `Pages Deploy`，再检查线上页面。

## 失败处理

如果 Pull 出现冲突，停止推送，在 Git 中解决冲突并重新预览。如果校验或 Jekyll 构建失败，先修复第一条具体错误；不要通过空提交反复触发部署。
