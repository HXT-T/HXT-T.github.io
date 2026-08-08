import { useEffect, useRef, useState } from 'react'
import { site, categories, quote, about, footer } from './data.js'

// Q 版猫咪 logo —— Canvas 手绘，白猫 + 粉色腮红，配樱花主题
function CatLogo({ size = 36 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    const ctx = canvas.getContext('2d')
    // 在 40x40 的设计坐标系里作画，再按实际尺寸与 dpr 缩放，保证高清屏不模糊
    ctx.scale((dpr * size) / 40, (dpr * size) / 40)
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    // 耳朵（先画，脸会盖住耳根）
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#e64980'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(9, 16)
    ctx.lineTo(11, 4)
    ctx.lineTo(19, 11)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(31, 16)
    ctx.lineTo(29, 4)
    ctx.lineTo(21, 11)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // 内耳
    ctx.fillStyle = '#f783ac'
    ctx.beginPath()
    ctx.moveTo(11.2, 13)
    ctx.lineTo(12.2, 7.2)
    ctx.lineTo(16.2, 11)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(28.8, 13)
    ctx.lineTo(27.8, 7.2)
    ctx.lineTo(23.8, 11)
    ctx.closePath()
    ctx.fill()

    // 圆脸
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#e64980'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.arc(20, 23, 12.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // 笑眼（两条弯弯的弧线）
    ctx.strokeStyle = '#432c37'
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.arc(14.5, 22.5, 2.6, Math.PI * 1.15, Math.PI * 1.85)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(25.5, 22.5, 2.6, Math.PI * 1.15, Math.PI * 1.85)
    ctx.stroke()

    // 小鼻子
    ctx.fillStyle = '#e64980'
    ctx.beginPath()
    ctx.moveTo(18.8, 24.4)
    ctx.lineTo(21.2, 24.4)
    ctx.lineTo(20, 25.8)
    ctx.closePath()
    ctx.fill()

    // ω 嘴
    ctx.strokeStyle = '#432c37'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.arc(18.4, 26, 1.5, Math.PI * 0.1, Math.PI * 0.9)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(21.6, 26, 1.5, Math.PI * 0.1, Math.PI * 0.9)
    ctx.stroke()

    // 粉色腮红
    ctx.fillStyle = 'rgba(247, 131, 172, 0.55)'
    ctx.beginPath()
    ctx.ellipse(11.5, 26.5, 2.2, 1.4, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(28.5, 26.5, 2.2, 1.4, 0, 0, Math.PI * 2)
    ctx.fill()

    // 胡须
    ctx.strokeStyle = 'rgba(230, 73, 128, 0.55)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(4.5, 22)
    ctx.lineTo(10, 23)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(4.5, 25.5)
    ctx.lineTo(10, 25)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(35.5, 22)
    ctx.lineTo(30, 23)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(35.5, 25.5)
    ctx.lineTo(30, 25)
    ctx.stroke()
  }, [size])

  return (
    <canvas
      ref={ref}
      className="cat-logo"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Q 版猫咪 logo"
    />
  )
}

function Nav() {
  return (
    <header className="nav">
      <a className="nav-logo" href="#top">
        <CatLogo size={34} />
        <span>{site.nickname}</span>
      </a>
      <nav className="nav-categories" aria-label="内容分类">
        {categories.map((name) => (
          <a
            className="nav-chip"
            key={name}
            href={`${site.blogUrl}?category=${encodeURIComponent(name)}`}
          >
            {name}
          </a>
        ))}
      </nav>
    </header>
  )
}

function Hero() {
  const [keyword, setKeyword] = useState('')

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
      <div className="scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="about">
      <div className="about-card">
        <div className="about-avatar" aria-hidden="true">
          <CatLogo size={56} />
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
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>{footer.text}</p>
      <p className="footer-links">
        <a href={site.blogUrl}>博客</a>
        <span className="dot">·</span>
        <a href={site.githubUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
      <p className="footer-tech">{footer.tech}</p>
      <p className="footer-copy">{footer.copyright}</p>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Footer />
    </>
  )
}
