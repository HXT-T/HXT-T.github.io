import SiteFrame from '../components/SiteChrome.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { home, site } from '../data.js'
import { pagesInGroup } from '../data/navigation.js'
import { PROJECT_STATUSES, projects, sortProjects } from '../data/projects.js'
import { posts, topics } from '../blog/posts.js'
import { formatDate } from '../format.js'

const pad = (n) => String(n).padStart(2, '0')

// 本期目录：和下面各分区的 id、编号一一对应
const CONTENTS = [
  { id: 'writing', label: '最近写下' },
  { id: 'lab', label: '实验室' },
  { id: 'now', label: '此刻' },
  { id: 'garden', label: '生活索引' },
]

function Cover() {
  const latestPost = posts[0]

  return (
    <section className="cover" aria-labelledby="cover-title">
      <div className="cover-copy">
        <p className="cover-meta">
          <span>
            <b>{home.issue}</b> · {home.issueDate}
          </span>
          <span>{home.kicker}</span>
        </p>

        <h1 className="cover-title" id="cover-title">
          {home.wordmark}
          <span className="cover-cursor" aria-hidden="true" />
        </h1>

        <p className="cover-en">
          {home.tagline[0]} <em>{home.tagline[1]}</em>
        </p>

        <div className="cover-lower">
          <div>
            <p className="cover-manifesto">{home.manifesto}</p>
            <div className="cover-actions">
              {latestPost && (
                <a className="text-link text-link-primary" href={`/blog?post=${latestPost.slug}`}>
                  读最近一篇 <span aria-hidden="true">→</span>
                </a>
              )}
              <a className="text-link" href="/projects?view=mvp">
                看看在做什么 <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <dl className="cover-status" aria-label="此刻的状态">
            <div>
              <dt>BUILDING</dt>
              <dd>
                <span className="live-dot" aria-hidden="true" />
                <a href={home.currentProject.href}>{home.currentProject.name}</a>
              </dd>
            </div>
            {latestPost && (
              <div>
                <dt>WRITING</dt>
                <dd>
                  <a href={`/blog?post=${latestPost.slug}`}>{latestPost.title}</a>
                </dd>
              </div>
            )}
            <div>
              <dt>READING</dt>
              <dd>
                <a href="/books">{home.reading}</a>
              </dd>
            </div>
            <div>
              <dt>LOCATION</dt>
              <dd>{home.location}</dd>
            </div>
          </dl>
        </div>
      </div>

      <figure className="cover-visual">
        <img src={home.cover.src} alt={home.cover.alt} fetchPriority="high" />
        <figcaption className="cover-caption">
          <span>{home.cover.index}</span>
          <span>{home.cover.caption}</span>
        </figcaption>
      </figure>
    </section>
  )
}

function Contents() {
  return (
    <nav className="contents-strip" aria-label="本期目录">
      <span>CONTENTS</span>
      <ol>
        {CONTENTS.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>
              <span>{pad(index + 1)}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function LatestWriting() {
  const recentPosts = posts.slice(0, 4)

  return (
    <section className="editorial-section" id="writing" aria-labelledby="writing-title">
      <SectionHeading
        id="writing-title"
        index="01"
        eyebrow="LATEST WRITING"
        title="最近写下的想法"
        description="完整文章、读书札记与技术笔记，记录一个想法如何慢慢变清楚。"
        action={(
          <a className="text-link" href={site.blogUrl}>
            全部 {posts.length} 篇文章 <span aria-hidden="true">→</span>
          </a>
        )}
      />

      <div className="writing-layout">
        <ol className="index-list">
          {recentPosts.map((post, index) => (
            <li className="index-row" key={post.slug} data-reveal>
              <a href={`/blog?post=${post.slug}`}>
                <span className="row-index">{pad(index + 1)}</span>
                <span className="row-body">
                  <span className="row-meta">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>{post.category}</span>
                    <span>{post.minutes} MIN</span>
                  </span>
                  <strong className="row-title">{post.title}</strong>
                  <span className="row-text">{post.excerpt}</span>
                </span>
                <span className="row-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>

        <aside className="pull-quote" aria-label="写作说明">
          <span aria-hidden="true">“</span>
          <blockquote>{home.quote.text}</blockquote>
          <p>{home.quote.note}</p>
        </aside>
      </div>
    </section>
  )
}

function Lab() {
  const active = sortProjects(projects.filter((project) => !project.archived))

  return (
    <section className="editorial-section" id="lab" aria-labelledby="lab-title">
      <SectionHeading
        id="lab-title"
        index="02"
        eyebrow="PRODUCT LAB / MVP & EXPERIMENTS"
        title="正在构建的东西"
        description="从一个明确的问题开始，做出能体验的最小版本；也允许一些怪想法只停在原型。"
        action={(
          <a className="text-link" href="/projects">
            打开 Product Lab <span aria-hidden="true">→</span>
          </a>
        )}
      />

      <ol className="index-list">
        {active.map((project, index) => {
          const status = PROJECT_STATUSES[project.status]
          return (
            <li className="index-row lab-row" key={project.id} data-reveal>
              <a href={`/projects#${project.id}`}>
                <span className="row-index">{pad(index + 1)}</span>
                <span className="row-body">
                  <span className="row-meta">
                    <span>{project.category}</span>
                    {project.tags
                      ?.filter((tag) => tag !== project.category)
                      .slice(0, 3)
                      .map((tag) => <span key={tag}>{tag}</span>)}
                  </span>
                  <strong className="row-title row-title--latin">{project.name}</strong>
                  <span className="row-text">{project.description}</span>
                  {project.stage === 'mvp' && project.mvpGoal && (
                    <span className="lab-row__goal">
                      <b>MVP</b>
                      {project.mvpGoal}
                    </span>
                  )}
                </span>
                <span className={`lab-row__status lab-row__status--${project.status}`}>
                  <i aria-hidden="true" />
                  {status?.label ?? project.status}
                </span>
                <span className="row-arrow" aria-hidden="true">→</span>
                {project.image?.src && (
                  <span className="lab-row__thumb" aria-hidden="true">
                    <img src={project.image.src} alt="" loading="lazy" decoding="async" />
                  </span>
                )}
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function NowSection() {
  return (
    <section className="editorial-section" id="now" aria-labelledby="now-title">
      <SectionHeading
        id="now-title"
        index="03"
        eyebrow={`NOW / ${home.issueDate}`}
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
          <article className="now-item" key={item.label} data-reveal>
            <div className="now-topline">
              <span>{item.label}</span>
              <span>{pad(index + 1)}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function PersonalIndex() {
  const personalPages = [...pagesInGroup('garden'), ...pagesInGroup('lab')]

  return (
    <section className="editorial-section" id="garden" aria-labelledby="garden-title">
      <SectionHeading
        id="garden-title"
        index="04"
        eyebrow="PERSONAL INDEX / GARDEN"
        title="产品之外，生活仍在继续"
        description="读过的书、路过的地方、短暂发光的瞬间，以及那些会被反复写下的主题。"
      />

      <div className="garden-layout">
        <div>
          <h3>TOPICS · 按主题读</h3>
          <ul className="index-list">
            {topics.map((topic, index) => (
              <li className="index-row" key={topic.name}>
                <a href={`${site.blogUrl}?category=${encodeURIComponent(topic.name)}`}>
                  <span className="row-index">{pad(index + 1)}</span>
                  <strong className="row-title">{topic.name}</strong>
                  <span className="row-count">{pad(topic.count)} NOTES</span>
                  <span className="row-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>ELSEWHERE · 其他角落</h3>
          <ul className="index-list">
            {personalPages.map((page) => (
              <li className="index-row" key={page.id}>
                <a href={page.href}>
                  <span className="row-index">{page.index}</span>
                  <strong className="row-title">{page.label}</strong>
                  <span className="row-count">{page.name.toUpperCase()}</span>
                  <span className="row-arrow" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <SiteFrame current="home">
      <main className="page-main" id="main-content" tabIndex="-1">
        <Cover />
        <Contents />
        <LatestWriting />
        <Lab />
        <NowSection />
        <PersonalIndex />
      </main>
    </SiteFrame>
  )
}
