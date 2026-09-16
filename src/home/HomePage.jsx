import ProjectCard from '../components/ProjectCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { categories, home, site, subPages } from '../data.js'
import { projects, isBuildingMvp, sortProjects } from '../data/projects.js'
import { posts } from '../blog/posts.js'

function formatDate(date) {
  return date ? date.replaceAll('-', '.') : ''
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
            <div className="cover-current">
              <span>CURRENTLY BUILDING</span>
              <a href={home.currentProject.href}>
                {home.currentProject.name} <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="cover-actions" aria-label="首页推荐入口">
              <a className="text-link text-link-primary" href="/projects?view=mvp">
                进入 MVP 工作台 <span aria-hidden="true">→</span>
              </a>
              {latestPost && (
                <a className="text-link" href={`/blog?post=${latestPost.slug}`}>
                  读最近一篇文章 <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
          <div className="cover-identity" aria-label="正在做的事情">
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

function BuildingSection() {
  const buildingProjects = sortProjects(projects.filter(isBuildingMvp)).slice(0, 3)

  return (
    <section className="editorial-section building-section" id="building">
      <SectionHeading
        index="01"
        eyebrow="MVP WORKBENCH / CURRENTLY BUILDING"
        title="正在构建的 MVP"
        description="这里放正在动手做的最小可用版本。从一个明确的问题开始，逐步做出可以体验的产品。"
        action={(
          <a className="text-link" href="/projects?view=mvp">
            打开 MVP 工作台 <span aria-hidden="true">→</span>
          </a>
        )}
      />

      <div className="home-project-grid">
        {buildingProjects.map((project) => (
          <div
            className={`home-project-grid__item${project.featured ? ' home-project-grid__item--featured' : ''}`}
            key={project.id}
          >
            <ProjectCard
              project={project}
              variant={project.featured ? 'featured' : 'normal'}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function ExperimentsSection() {
  const experiments = projects
    .filter((project) => project.type === 'experiment' && !project.archived)
    .sort((a, b) => (b.activityRank ?? 0) - (a.activityRank ?? 0))

  return (
    <section className="editorial-section experiments-section" id="experiments">
      <SectionHeading
        index="02"
        eyebrow="EXPERIMENTS / PLAYGROUND"
        title="小东西，怪想法，原型"
        description="不要求每个念头都成为正式产品。做出来、放上网、记在这里，就已经足够。"
        action={(
          <a className="text-link" href="/projects?view=experiments">
            打开实验索引 <span aria-hidden="true">→</span>
          </a>
        )}
      />

      <div className="experiment-list">
        {experiments.map((project, index) => (
          <div className="experiment-list__item" key={project.id}>
            <span className="experiment-list__index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <ProjectCard project={project} variant="compact" />
          </div>
        ))}
      </div>
    </section>
  )
}

function LatestWriting() {
  const recentPosts = posts.slice(0, 3)

  return (
    <section className="editorial-section thoughts-section" id="writing">
      <SectionHeading
        index="03"
        eyebrow="LATEST WRITING"
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
        index="04"
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

function PersonalIndex() {
  const topicCounts = posts.reduce((counts, post) => {
    counts[post.category] = (counts[post.category] || 0) + 1
    return counts
  }, {})
  const activeTopics = categories.filter(
    (category) => !category.href && topicCounts[category.name],
  )
  const personalPages = subPages.filter((page) =>
    ['/books', '/moments', '/travel'].includes(page.href),
  )

  return (
    <section className="editorial-section garden-section" id="garden">
      <SectionHeading
        index="05"
        eyebrow="PERSONAL INDEX / GARDEN"
        title="产品之外，生活仍在继续"
        description="读过的书、路过的地方、短暂发光的瞬间，以及那些会被反复写下的主题。"
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
          <p className="garden-statement">个人互联网不只收纳成果，也收纳一个人如何生活、阅读与改变。</p>
          <div className="garden-paths" aria-label="个人内容入口">
            {personalPages.map((page, index) => (
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
      <BuildingSection />
      <ExperimentsSection />
      <LatestWriting />
      <NowSection />
      <PersonalIndex />
    </main>
  )
}
