import { useEffect, useRef, useState } from 'react'
import {
  site,
  categories,
  subPages,
  quotes,
  about,
  footer,
} from './data.js'
import Sakura from './components/Sakura.jsx'

const homePaths = [
  { name: '博客', href: '/blog', mark: '写', detail: '长思考' },
  { name: '瞬间', href: '/moments', mark: '瞬', detail: '生活切片' },
  { name: '书架', href: '/books', mark: '读', detail: '阅读轨迹' },
  { name: '旅行', href: '/travel', mark: '游', detail: '在路上' },
]

function Nav({ onOpenAbout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openAbout = () => {
    setMenuOpen(false)
    onOpenAbout()
  }

  return (
    <header className="nav">
      <a className="nav-logo" href="/" aria-label={`${site.nickname} 首页`}>
        <span className="logo-circle">
          <img src="/logo.jpg" alt="猫咪 logo" />
        </span>
        <span>{site.nickname}</span>
      </a>

      <button
        type="button"
        className="nav-menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="nav-menu-lines" aria-hidden="true">
          <span />
          <span />
        </span>
        <span>{menuOpen ? '收起' : '逛逛'}</span>
      </button>

      <nav
        id="site-navigation"
        className={`nav-categories${menuOpen ? ' is-open' : ''}`}
        aria-label="站点导航"
      >
        {subPages.map((page) => (
          <a
            className="nav-chip nav-page-link"
            key={page.href}
            href={page.href}
          >
            {page.name}
          </a>
        ))}

        <details className="nav-topics">
          <summary className="nav-chip nav-topic-toggle">
            主题
            <span aria-hidden="true">⌄</span>
          </summary>
          <div className="nav-topic-panel">
            <p>按兴趣漫游</p>
            <div>
              {categories
                .filter((category) => !category.href)
                .map((category) => (
                  <a
                    className="nav-topic-link"
                    key={category.name}
                    href={`${site.blogUrl}?category=${encodeURIComponent(category.name)}`}
                  >
                    {category.name}
                  </a>
                ))}
            </div>
          </div>
        </details>

        <button
          type="button"
          className="nav-chip nav-chip-about"
          onClick={openAbout}
        >
          关于我
        </button>
      </nav>
    </header>
  )
}

function Hero() {
  const [keyword, setKeyword] = useState('')
  // 每次打开随机抽一句名言；用惰性初始化保证 StrictMode 下不变
  const [quote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)],
  )

  const handleSearch = (event) => {
    event.preventDefault()
    const q = keyword.trim()
    window.location.href = q
      ? `${site.blogUrl}?q=${encodeURIComponent(q)}`
      : site.blogUrl
  }

  return (
    <main className="hero" id="main-content" tabIndex="-1">
      <Sakura />
      <div className="hero-content">
        <div className="hero-intro">
          <p className="hero-kicker">YUYUYUU · PERSONAL SPACE</p>
          <h1 className="hero-title">{site.title}</h1>
          <p className="hero-tagline">{site.tagline}</p>
        </div>

        <blockquote className="hero-quote">
          <p className="quote-text">{quote.text}</p>
          <cite className="quote-author">—— {quote.author}</cite>
        </blockquote>

        <form className="search" role="search" onSubmit={handleSearch}>
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索美好，或随便逛逛……"
            aria-label="搜索博客"
          />
          <button type="submit">搜索</button>
        </form>

        <nav className="hero-paths" aria-label="快速前往">
          {homePaths.map((path) => (
            <a className="hero-path" href={path.href} key={path.href}>
              <span className="hero-path-mark" aria-hidden="true">
                {path.mark}
              </span>
              <span className="hero-path-copy">
                <strong>{path.name}</strong>
                <small>{path.detail}</small>
              </span>
              <span className="hero-path-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </nav>
      </div>
    </main>
  )
}

function AboutModal({ onClose }) {
  const dialogRef = useRef(null)

  // ESC 关闭、Tab 焦点环、打开时锁住背景滚动，关闭后恢复焦点
  useEffect(() => {
    const previousFocus = document.activeElement
    const dialog = dialogRef.current
    const backgroundElements = [
      ...document.querySelectorAll('#root > :not(.modal-backdrop)'),
    ]
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = [...dialog.querySelectorAll(focusableSelector)]
      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    backgroundElements.forEach((element) => element.setAttribute('inert', ''))
    dialog.querySelector('.modal-close')?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      backgroundElements.forEach((element) => element.removeAttribute('inert'))

      const mobileMenuToggle = document.querySelector('.nav-menu-toggle')
      const mobileMenuIsActive =
        mobileMenuToggle &&
        window.getComputedStyle(mobileMenuToggle).display !== 'none'
      const previousFocusWasInMenu = previousFocus?.closest?.(
        '#site-navigation',
      )
      const previousFocusIsVisible =
        previousFocus instanceof HTMLElement &&
        window.getComputedStyle(previousFocus).visibility !== 'hidden'

      if (mobileMenuIsActive && previousFocusWasInMenu) {
        mobileMenuToggle.focus()
      } else if (previousFocusIsVisible) {
        previousFocus.focus()
      } else {
        mobileMenuToggle?.focus()
      }
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="about-card modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-heading"
        tabIndex="-1"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="关闭关于我"
        >
          ×
        </button>
        <div className="about-avatar" aria-hidden="true">
          <span className="logo-circle logo-circle-lg">
            <img src="/logo.jpg" alt="" />
          </span>
        </div>
        <h2 className="about-heading" id="about-heading">
          <span className="gradient-text">{about.heading}</span>
        </h2>
        {about.paragraphs.map((paragraph, index) => (
          <p className="about-paragraph" key={index}>
            {paragraph}
          </p>
        ))}
        <ul className="about-tags">
          {about.tags.map((tag) => (
            <li className="tag" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        {footer.copyright} · 用 ❤️ 构建 · <a href={site.blogUrl}>博客</a>
        {' · '}
        <a href={site.githubUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </footer>
  )
}

export default function App() {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <Nav onOpenAbout={() => setAboutOpen(true)} />
      <Hero />
      <Footer />
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </>
  )
}
