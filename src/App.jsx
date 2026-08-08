import { useEffect, useState } from 'react'
import { site, categories, quotes, about, footer } from './data.js'

function Nav({ onOpenAbout }) {
  return (
    <header className="nav">
      <a className="nav-logo" href="#top">
        <span className="logo-circle">
          <img src="/logo.jpg" alt="猫咪 logo" />
        </span>
        <span>{site.nickname}</span>
      </a>
      <nav className="nav-categories" aria-label="内容分类">
        {categories.map((c) => (
          <a
            className="nav-chip"
            key={c.name}
            href={
              c.href ?? `${site.blogUrl}?category=${encodeURIComponent(c.name)}`
            }
          >
            {c.name}
          </a>
        ))}
        <button
          type="button"
          className="nav-chip nav-chip-about"
          onClick={onOpenAbout}
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
    <section className="hero" id="top">
      <div className="hero-content">
        <blockquote className="hero-quote">
          <p className="quote-text">{quote.text}</p>
          <cite className="quote-author">—— {quote.author}</cite>
        </blockquote>
        <p className="hero-tagline">
          {site.nickname} · {site.tagline}
        </p>
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
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索美好，或随便逛逛……"
            aria-label="搜索博客"
          />
          <button type="submit">搜索</button>
        </form>
      </div>
    </section>
  )
}

function AboutModal({ onClose }) {
  // ESC 关闭 + 打开时锁住背景滚动
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="about-card modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="关于我"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="关闭">
          ×
        </button>
        <div className="about-avatar" aria-hidden="true">
          <span className="logo-circle logo-circle-lg">
            <img src="/logo.jpg" alt="" />
          </span>
        </div>
        <h2 className="about-heading">
          <span className="gradient-text">{about.heading}</span>
        </h2>
        {about.paragraphs.map((p, i) => (
          <p className="about-paragraph" key={i}>
            {p}
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
      <Nav onOpenAbout={() => setAboutOpen(true)} />
      <Hero />
      <Footer />
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </>
  )
}
