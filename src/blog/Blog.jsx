import { useEffect, useMemo, useRef, useState } from 'react'
import { marked } from 'marked'
import SiteFrame from '../components/SiteChrome.jsx'
import PageMasthead from '../components/PageMasthead.jsx'
import { blog } from '../data.js'
import { formatDate } from '../format.js'
import { posts, topics } from './posts.js'

// 单换行也渲染为换行，写随笔更顺手
marked.use({ breaks: true })

// 标题锚点：用标题文字本身做 id，目录和分享链接都靠它
const headingId = (text) => `h-${text.trim().replace(/\s+/g, '-')}`
marked.use({
  renderer: {
    heading({ tokens, depth, text }) {
      const inner = this.parser.parseInline(tokens)
      if (depth !== 2) return `<h${depth}>${inner}</h${depth}>\n`
      return `<h2 id="${encodeURIComponent(headingId(text))}">${inner}</h2>\n`
    },
  },
})

function tableOfContents(body) {
  return marked
    .lexer(body)
    .filter((token) => token.type === 'heading' && token.depth === 2)
    .map((token) => ({ id: encodeURIComponent(headingId(token.text)), text: token.text }))
}

function readParams() {
  const sp = new URLSearchParams(window.location.search)
  return {
    q: sp.get('q') ?? '',
    category: sp.get('category') ?? '',
    post: sp.get('post') ?? '',
  }
}

function Hero({ total }) {
  return (
    <PageMasthead
      page="writing"
      eyebrow={blog.badge}
      title={blog.title}
      description={blog.sub}
      aside={(
        <>
          <span className="page-masthead__aside-index">
            ARCHIVE / {String(total).padStart(2, '0')} 篇
          </span>
          <p>Notes are allowed to stay unfinished.</p>
          <small>按分类筛选，或直接搜标题与正文。链接可以直接分享。</small>
        </>
      )}
    />
  )
}

function PostCard({ post, onOpen }) {
  return (
    <a
      className="b-card"
      href={`/blog?post=${encodeURIComponent(post.slug)}`}
      onClick={(e) => {
        e.preventDefault()
        onOpen(post.slug)
      }}
    >
      <p className="b-card-date">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>{post.minutes} MIN</span>
      </p>
      <h3 className="b-card-title">{post.title}</h3>
      <p className="b-card-excerpt">{post.excerpt}</p>
      <div className="b-card-meta">
        <span className="b-card-cat">{post.category}</span>
        <span className="b-card-more">阅读全文 →</span>
      </div>
    </a>
  )
}

function PagerLink({ post, dir, onOpen }) {
  if (!post) return <span className="b-pager-slot" />
  return (
    <a
      className={`b-pager-link${dir === 'next' ? ' next' : ''}`}
      href={`/blog?post=${encodeURIComponent(post.slug)}`}
      onClick={(e) => {
        e.preventDefault()
        onOpen(post.slug)
      }}
    >
      <span className="b-pager-dir">{dir === 'next' ? 'OLDER · 更早 →' : '← NEWER · 更新'}</span>
      <span className="b-pager-name">{post.title}</span>
    </a>
  )
}

// 顶部细线：读到哪里，粉色走到哪里
function ReadingProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0
      barRef.current?.style.setProperty('transform', `scaleX(${ratio})`)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="b-progress" ref={barRef} aria-hidden="true" />
}

function Article({ post, onBack, onOpen }) {
  const html = useMemo(() => marked.parse(post.body), [post])
  const toc = useMemo(() => tableOfContents(post.body), [post])
  const index = posts.findIndex((p) => p.slug === post.slug)
  const newer = posts[index - 1]
  const older = posts[index + 1]

  // 文章页把浏览器标签标题换成文章名
  useEffect(() => {
    document.title = `${post.title} · yuyuyuu`
    return () => {
      document.title = '博客 · yuyuyuu'
    }
  }, [post])

  return (
    <main className="page-main" id="main-content" tabIndex="-1">
      <ReadingProgress />
      <article className="b-article">
        <header className="b-article-head">
          <button type="button" className="b-back" onClick={onBack}>
            <span aria-hidden="true">←</span> 全部文章
          </button>
          <p className="b-article-meta">
            <span className="b-article-cat">{post.category}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>约 {post.minutes} 分钟</span>
          </p>
          <h1 className="b-article-title">{post.title}</h1>
          {post.excerpt && <p className="b-article-dek">{post.excerpt}</p>}
        </header>

        <div className="b-article-layout">
          {toc.length > 1 && (
            <nav className="b-toc" aria-label="文章目录">
              <p>CONTENTS</p>
              <ol>
                {toc.map((item, i) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div
            className="b-article-body"
            // 内容来自仓库内自己的 Markdown，无用户输入
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <p className="b-article-end" aria-hidden="true">
          <span>❀</span> END
        </p>
      </article>
      <nav className="b-pager" aria-label="上一篇 / 下一篇">
        <PagerLink post={newer} dir="prev" onOpen={onOpen} />
        <PagerLink post={older} dir="next" onOpen={onOpen} />
      </nav>
    </main>
  )
}

export default function Blog() {
  const [params, setParams] = useState(readParams)

  // 浏览器前进/后退时同步 URL 状态
  useEffect(() => {
    const onPop = () => setParams(readParams())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (next, { replace = false } = {}) => {
    const merged = { q: '', category: '', post: '', ...next }
    const sp = new URLSearchParams()
    if (merged.q) sp.set('q', merged.q)
    if (merged.category) sp.set('category', merged.category)
    if (merged.post) sp.set('post', merged.post)
    const url = sp.size ? `/blog?${sp.toString()}` : '/blog'
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url)
    setParams(merged)
    if (!replace) window.scrollTo({ top: 0 })
  }

  const post = params.post ? posts.find((p) => p.slug === params.post) : null

  const q = params.q.trim().toLowerCase()
  const visible = posts.filter((p) => {
    if (params.category && p.category !== params.category) return false
    if (!q) return true
    return [p.title, p.excerpt, p.category, p.body]
      .join('\n')
      .toLowerCase()
      .includes(q)
  })

  return (
    <SiteFrame current="writing">
      {post ? (
        <Article
          post={post}
          onBack={() => navigate({ q: params.q, category: params.category })}
          onOpen={(slug) => navigate({ ...params, post: slug })}
        />
      ) : (
        <main className="page-main" id="main-content" tabIndex="-1">
          <Hero total={posts.length} />
          <div className="b-controls">
            <div className="b-search">
              <input
                type="search"
                value={params.q}
                onChange={(e) =>
                  navigate({ ...params, q: e.target.value }, { replace: true })
                }
                placeholder="搜索标题、正文或分类……"
                aria-label="搜索文章"
              />
            </div>
            <div className="b-chips">
              <button
                type="button"
                className={`b-chip${params.category === '' ? ' active' : ''}`}
                onClick={() =>
                  navigate({ ...params, category: '' }, { replace: true })
                }
              >
                全部
              </button>
              {topics.map(({ name }) => (
                <button
                  key={name}
                  type="button"
                  className={`b-chip${params.category === name ? ' active' : ''}`}
                  onClick={() =>
                    navigate(
                      {
                        ...params,
                        category: params.category === name ? '' : name,
                      },
                      { replace: true },
                    )
                  }
                >
                  {name}
                </button>
              ))}
            </div>
            <p className="b-count">共 {visible.length} 篇</p>
          </div>
          {visible.length > 0 ? (
            <div className="b-grid">
              {visible.map((p) => (
                <PostCard
                  key={p.slug}
                  post={p}
                  onOpen={(slug) => navigate({ ...params, post: slug })}
                />
              ))}
            </div>
          ) : (
            <div className="b-empty">
              <p>{blog.emptyText}</p>
              <button
                type="button"
                className="b-empty-clear"
                onClick={() => navigate({}, { replace: true })}
              >
                清除筛选
              </button>
            </div>
          )}
        </main>
      )}
    </SiteFrame>
  )
}
