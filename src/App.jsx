import { useState } from 'react'
import { site, categories, quote, about, footer } from './data.js'


function Nav() {
  return (
    <header className="nav">
      <a className="nav-logo" href="#top">
        <span className="logo-circle">
          <img src="/logo.jpg" alt="猫咪 logo" />
        </span>
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
