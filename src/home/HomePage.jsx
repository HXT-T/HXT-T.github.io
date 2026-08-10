import { categories, home, site, subPages } from '../data.js'
import { posts } from '../blog/posts.js'

function formatDate(date) {
  return date ? date.replaceAll('-', '.') : ''
}

function SectionHeading({ index, eyebrow, title, description, action }) {
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

function Cover() {
  const latestPost = posts[0]

  return (
    <section className="cover" aria-labelledby="cover-title">
      <div className="cover-copy">
        <div className="cover-meta">
          <span>{home.kicker}</span>
          <span>
            {home.issue} · {home.issueDate}
          </span>
        </div>

        <h1 className="cover-title" id="cover-title">
          {home.wordmark.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>

        <div className="cover-bottom">
          <div>
            <p className="cover-manifesto">{home.manifesto}</p>
            <div className="cover-actions" aria-label="首页推荐入口">
              {latestPost && (
                <a className="text-link text-link-primary" href={`/blog?post=${latestPost.slug}`}>
                  读最近一篇文章 <span aria-hidden="true">→</span>
                </a>
              )}
              <a className="text-link" href="#work">
                查看精选作品 <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className="cover-identity" aria-label="身份与所在地">
            {home.roles.map((role) => (
              <span key={role}>{role}</span>
            ))}
            <span>{home.location}</span>
          </div>
        </div>
      </div>

      <figure className="cover-visual">
        <div className="cover-image-wrap">
          <img
            className="cover-image"
            src={home.cover.src}
            alt={home.cover.alt}
            fetchPriority="high"
          />
          <span className="cover-registration" aria-hidden="true">
            +
          </span>
        </div>
        <figcaption className="cover-caption">
          <span>{home.cover.index}</span>
          <span>{home.cover.caption}</span>
        </figcaption>
        <div className="cover-seal" aria-label={`${site.nickname} 的猫咪签章`}>
          <img src="/logo.jpg" alt="" />
          <span>KEEP TENDING</span>
        </div>
      </figure>
    </section>
  )
}

function WorkPreview({ work }) {
  if (work.visual.type === 'network') {
    return (
      <div className="work-preview work-preview-network" role="img" aria-label={work.visual.alt}>
        <span className="network-node network-node-main">SECOND<br />BRAIN</span>
        <span className="network-node network-node-a">NOTES</span>
        <span className="network-node network-node-b">BOOKS</span>
        <span className="network-node network-node-c">IDEAS</span>
        <span className="network-line network-line-a" aria-hidden="true" />
        <span className="network-line network-line-b" aria-hidden="true" />
        <span className="network-line network-line-c" aria-hidden="true" />
      </div>
    )
  }

  if (work.visual.type === 'publication') {
    return (
      <div className="work-preview work-preview-publication" role="img" aria-label={work.visual.alt}>
        <small>PERSONAL INTERNET</small>
        <strong>ISSUE<br />01</strong>
        <span>2026 / KEEP TENDING</span>
      </div>
    )
  }

  return (
    <div className={`work-preview work-preview-${work.title.toLowerCase()}`}>
      <img src={work.visual.src} alt={work.visual.alt} loading="lazy" />
    </div>
  )
}

function SelectedWorks() {
  return (
    <section className="editorial-section works-section" id="work">
      <SectionHeading
        index="01"
        eyebrow="SELECTED WORKS"
        title="正在做的东西"
        description="不是一张技能清单，而是三件仍在生长的作品：陪伴、知识与更安静的技术。"
        action={(
          <a className="text-link" href={site.githubUrl} target="_blank" rel="noreferrer">
            查看 GitHub <span aria-hidden="true">↗</span>
          </a>
        )}
      />

      <div className="work-list">
        {home.works.map((work) => (
          <article className="work-row" key={work.index}>
            <span className="work-index">{work.index}</span>
            <div className="work-name">
              <h3>{work.title}</h3>
              <p>{work.description}</p>
            </div>
            <div className="work-meta">
              <span>{work.discipline}</span>
              <span>{work.stack}</span>
            </div>
            <span className="work-status">{work.status}</span>
            <WorkPreview work={work} />
          </article>
        ))}
      </div>
    </section>
  )
}

function RecentThoughts() {
  const recentPosts = posts.slice(0, 3)

  return (
    <section className="editorial-section thoughts-section" id="thoughts">
      <SectionHeading
        index="02"
        eyebrow="RECENT THOUGHTS"
        title="最近写下的想法"
        description="完整文章、读书札记与技术笔记，共同记录一个想法如何慢慢变清楚。"
        action={(
          <a className="text-link" href={site.blogUrl}>
            进入全部文章 <span aria-hidden="true">→</span>
          </a>
        )}
      />

      <div className="thoughts-layout">
        <div className="thought-list">
          {recentPosts.map((post, index) => (
            <article className="thought-row" key={post.slug}>
              <div className="thought-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>{post.category}</span>
              </div>
              <a href={`/blog?post=${post.slug}`}>
                <span className="thought-order">0{index + 1}</span>
                <span className="thought-copy">
                  <strong>{post.title}</strong>
                  <small>{post.excerpt}</small>
                </span>
                <span className="thought-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </article>
          ))}
        </div>

        <aside className="thought-note" aria-label="写作说明">
          <span className="thought-note-mark" aria-hidden="true">
            ※
          </span>
          <blockquote>有些答案写在文章里，另一些仍散落在书页、代码与路途中。</blockquote>
          <p>NOTES ARE ALLOWED TO STAY UNFINISHED.</p>
        </aside>
      </div>
    </section>
  )
}

function NowSection() {
  return (
    <section className="editorial-section now-section" id="now">
      <SectionHeading
        index="03"
        eyebrow="NOW / AUGUST 2026"
        title="此刻正在发生"
        description="一张会不断改写的状态页：正在做、正在读、正在想，也正在耐心照料。"
        action={(
          <a className="text-link" href="/moments">
            查看所有瞬间 <span aria-hidden="true">→</span>
          </a>
        )}
      />

      <div className="now-grid">
        {home.now.map((item, index) => (
          <article className="now-item" key={item.label}>
            <div className="now-topline">
              <span>{item.label}</span>
              <span>0{index + 1}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function GardenIndex() {
  const topicCounts = posts.reduce((counts, post) => {
    counts[post.category] = (counts[post.category] || 0) + 1
    return counts
  }, {})
  const activeTopics = categories.filter(
    (category) => !category.href && topicCounts[category.name],
  )

  return (
    <section className="editorial-section garden-section" id="garden">
      <SectionHeading
        index="04"
        eyebrow="GARDEN INDEX"
        title="反复回到的主题"
        description="它们不是固定栏目，而是一组会彼此引用、修订并缓慢生长的关系。"
      />

      <div className="garden-layout">
        <div className="topic-list" aria-label="有内容的主题">
          {activeTopics.map((topic, index) => (
            <a
              className="topic-row"
              href={`${site.blogUrl}?category=${encodeURIComponent(topic.name)}`}
              key={topic.name}
            >
              <span className="topic-order">0{index + 1}</span>
              <strong>{topic.name}</strong>
              <span>{String(topicCounts[topic.name]).padStart(2, '0')} NOTES</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

        <aside className="garden-aside">
          <p className="garden-statement">知识不是文件夹。它更像一条河，在不同时间经过同一个人。</p>
          <div className="garden-paths" aria-label="更多内容入口">
            {subPages.map((page, index) => (
              <a href={page.href} key={page.href}>
                <span>0{index + 1}</span>
                <strong>{page.name}</strong>
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main id="main-content" tabIndex="-1">
      <Cover />
      <SelectedWorks />
      <RecentThoughts />
      <NowSection />
      <GardenIndex />
    </main>
  )
}
