# hxt-t.github.io

个人主页，部署在 <https://hxt-t.github.io>。

## 技术栈

React 18 + Vite 6，纯 CSS（CSS 变量），无 UI 框架。

## 本地开发

```bash
npm install
npm run dev    # http://localhost:5173
```

## 修改内容

所有文案（昵称、头衔、介绍、标签、链接）集中在 `src/data.js`。

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建 `dist/` 并发布到 GitHub Pages，
无需手动操作。构建产物 `dist/` 不需要提交。
