import { site, subPages } from '../data.js'

// 子页面通用顶栏：回首页 + 兄弟页面互跳 + 品牌
// current 传当前页面的路径（如 '/blog'），对应链接会被隐藏
export default function SubNav({ current }) {
  return (
    <header className="p-nav">
      <a className="p-back" href="/">
        ← 回到首页
      </a>
      <nav className="p-links" aria-label="站点页面">
        {subPages
          .filter((p) => p.href !== current)
          .map((p) => (
            <a className="p-link" key={p.href} href={p.href}>
              {p.name}
            </a>
          ))}
      </nav>
      <a className="p-brand" href="/">
        <img src="/logo.jpg" alt="猫咪 logo" />
        <span>{site.nickname}</span>
      </a>
    </header>
  )
}
