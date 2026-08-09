import SubNav from '../components/SubNav.jsx'
import SubFooter from '../components/SubFooter.jsx'
import { momentsPage } from '../data.js'

export default function Moments() {
  // 按日期倒序，最新的瞬间在最上面
  const items = [...momentsPage.items].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <>
      <SubNav current="/moments" />
      <section className="p-hero">
        <span className="p-badge">{momentsPage.badge}</span>
        <h1 className="p-title">{momentsPage.title}</h1>
        <p className="p-sub">{momentsPage.sub}</p>
      </section>
      <main className="p-main">
        <div className="m-timeline">
          {items.map((m, i) => (
            <article className="m-item" key={`${m.date}-${i}`}>
              <span className="m-date">{m.date}</span>
              <div className="m-card">{m.text}</div>
            </article>
          ))}
        </div>
      </main>
      <SubFooter />
    </>
  )
}
