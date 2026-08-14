export default function SectionHeading({ index, eyebrow, title, description, action }) {
  return (
    <header className="section-heading">
      <span className="section-index" aria-hidden="true">
        {index}
      </span>
      <div className="section-title-group">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="section-intro">
        <p>{description}</p>
        {action}
      </div>
    </header>
  )
}
