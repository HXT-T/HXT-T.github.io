import { site, about, footer } from './data.js'

function Blob({ className }) {
  return <div className={`blob ${className}`} aria-hidden="true" />
}

function Hero() {
  return (
    <section className="hero">
      <Blob className="blob-1" />
      <Blob className="blob-2" />
      <Blob className="blob-3" />
      <div className="hero-content">
        <span className="hero-badge">👋 你好，欢迎来到我的小站</span>
        <h1 className="hero-name">
          我是 <span className="gradient-text">{site.nickname}</span>
        </h1>
        <p className="hero-title">{site.title}</p>
        <p className="hero-tagline">{site.tagline}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={site.blogUrl}>
            访问博客 <span className="btn-arrow">→</span>
          </a>
          <a className="btn btn-ghost" href="#about">
            了解更多
          </a>
        </div>
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
          {site.nickname.slice(0, 1).toUpperCase()}
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
      <p className="footer-copy">{footer.copyright}</p>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Hero />
      <About />
      <Footer />
    </>
  )
}
