import { site, footer } from '../data.js'

// 子页面通用页脚
export default function SubFooter() {
  return (
    <footer className="p-footer">
      <p>
        {footer.copyright} · <a href="/">首页</a>
        {' · '}
        <a href={site.githubUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </footer>
  )
}
