import SubNav from '../components/SubNav.jsx'
import SubFooter from '../components/SubFooter.jsx'
import { booksPage } from '../data.js'

// 三栏固定顺序：在读 → 读过 → 想读
const COLUMNS = [
  { status: '在读', className: 'reading' },
  { status: '读过', className: 'read' },
  { status: '想读', className: 'wish' },
]

function BookCard({ book }) {
  return (
    <article className="bk-card">
      <div className="bk-cover" aria-hidden="true">
        {book.title.charAt(0)}
      </div>
      <div className="bk-info">
        <h3 className="bk-title">{book.title}</h3>
        <p className="bk-author">{book.author}</p>
        {book.rating && (
          <p className="bk-rating" aria-label={`评分 ${book.rating} / 5`}>
            {'♥'.repeat(book.rating)}
            {'♡'.repeat(5 - book.rating)}
          </p>
        )}
        <p className="bk-note">{book.note}</p>
      </div>
    </article>
  )
}

export default function Books() {
  return (
    <>
      <SubNav current="/books" />
      <section className="p-hero">
        <span className="p-badge">{booksPage.badge}</span>
        <h1 className="p-title">{booksPage.title}</h1>
        <p className="p-sub">{booksPage.sub}</p>
      </section>
      <main className="p-main">
        <div className="bk-columns">
          {COLUMNS.map((col) => {
            const items = booksPage.items.filter((b) => b.status === col.status)
            return (
              <section className={`bk-col ${col.className}`} key={col.status}>
                <h2 className="bk-col-title">
                  <span>{col.status}</span>
                  <span className="bk-col-count">{items.length} 本</span>
                </h2>
                {items.map((b) => (
                  <BookCard key={b.title} book={b} />
                ))}
              </section>
            )
          })}
        </div>
      </main>
      <SubFooter />
    </>
  )
}
