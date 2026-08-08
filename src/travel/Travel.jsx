import { site, travel, footer } from '../data.js'

function TopBar() {
  return (
    <header className="t-nav">
      <a className="t-back" href="/">
        ← 回到首页
      </a>
      <a className="t-brand" href="/">
        <img src="/logo.jpg" alt="猫咪 logo" />
        <span>{site.nickname}</span>
      </a>
    </header>
  )
}

function Hero() {
  return (
    <section className="t-hero">
      <div className="t-hero-content">
        <span className="t-badge">{travel.badge}</span>
        <h1 className="t-title">{travel.title}</h1>
        <blockquote className="t-quote">
          <p>{travel.quote.text}</p>
          <cite>—— {travel.quote.author}</cite>
        </blockquote>
      </div>
      <div className="t-scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}

function Trips() {
  return (
    <section className="t-section">
      <h2 className="t-section-title">
        <span>足迹</span>
      </h2>
      <p className="t-section-sub">去过的每一个地方，都是世界递来的一张明信片</p>
      <div className="t-trips">
        {travel.trips.map((trip, i) => (
          <article className="t-trip-card" key={i}>
            <span className="t-trip-index">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="t-trip-date">{trip.date}</p>
            <h3 className="t-trip-place">{trip.place}</h3>
            <p className="t-trip-note">{trip.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Wishlist() {
  return (
    <section className="t-section t-section-alt">
      <h2 className="t-section-title">
        <span>心愿清单</span>
      </h2>
      <p className="t-section-sub">还没抵达的远方，先在这里发芽</p>
      <ul className="t-wishlist">
        {travel.wishlist.map((place) => (
          <li className="t-wish" key={place}>
            {place}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Footer() {
  return (
    <footer className="t-footer">
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

export default function Travel() {
  return (
    <>
      <TopBar />
      <Hero />
      <Trips />
      <Wishlist />
      <Footer />
    </>
  )
}
