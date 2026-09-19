import SiteFrame from '../components/SiteChrome.jsx'
import PageMasthead from '../components/PageMasthead.jsx'
import { momentsPage } from '../data.js'
import { formatDate } from '../format.js'

export default function Moments() {
  // 按日期倒序，最新的瞬间在最上面
  const items = [...momentsPage.items].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <SiteFrame current="moments">
      <main className="page-main" id="main-content" tabIndex="-1">
        <PageMasthead
          page="moments"
          eyebrow={momentsPage.badge}
          title={momentsPage.title}
          description={momentsPage.sub}
          aside={(
            <>
              <span className="page-masthead__aside-index">FIELD NOTE / 04</span>
              <p>一句话也算数。</p>
              <small>写不成文章的念头留在这里，按时间倒序，最新的在最上面。</small>
            </>
          )}
        />

        <div className="m-timeline">
          {items.map((m, i) => (
            <article className="m-item" key={`${m.date}-${i}`}>
              <time className="m-date" dateTime={m.date}>{formatDate(m.date)}</time>
              <div className="m-card">{m.text}</div>
            </article>
          ))}
        </div>
      </main>
    </SiteFrame>
  )
}
