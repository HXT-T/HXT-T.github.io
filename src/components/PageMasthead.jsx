import { findPage } from '../data/navigation.js'

// 除首页外每个页面的页头，全站共用一套：
// 左边是页面在站点里的编号，中间是大标题，右边是一段说明和可选的入口。
// title 传数组时逐行排版（"Things I" / "build."）。
export default function PageMasthead({
  page,
  eyebrow,
  title,
  description,
  aside,
  children,
}) {
  const entry = findPage(page)
  const lines = Array.isArray(title) ? title : [title]

  return (
    <section className="page-masthead" aria-labelledby="page-masthead-title">
      <span className="page-masthead__index" aria-hidden="true">
        {entry?.index}
      </span>

      <div className="page-masthead__copy">
        <p className="page-masthead__eyebrow">{eyebrow}</p>
        <h1 className="page-masthead__title" id="page-masthead-title">
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        {description && <p className="page-masthead__lede">{description}</p>}
        {children}
      </div>

      {aside && <div className="page-masthead__aside">{aside}</div>}
    </section>
  )
}
