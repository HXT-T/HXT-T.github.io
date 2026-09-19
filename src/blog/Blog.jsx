import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import SiteFrame from '../components/SiteChrome.jsx'
import PageMasthead from '../components/PageMasthead.jsx'
import { blog } from '../data.js'
import { formatDate } from '../format.js'
import { posts, topics } from './posts.js'

// 单换行也渲染为换行，写随笔更顺手
marked.use({ breaks: true })

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
      <p className="b-card-date"><time dateTime={post.date}>{formatDate(post.date)}</time></p>
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
      <span className="b-pager-dir">{dir === 'next' ? '下一篇 »' : '« 上一篇'}</span>
      <span className="b-pager-name">{post.title}</span>
    </a>
  )
}

function Article({ post, onBack, onOpen }) {
  const html = useMemo(() => marked.parse(post.body), [post])
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
      <article className="b-article">
        <button type="button" className="b-back" onClick={onBack}>
          ← 返回列表
        </button>
        <span className="b-article-cat">{post.category}</span>
        <h1 className="b-article-title">{post.title}</h1>
        <p className="b-article-date"><time dateTime={post.date}>{formatDate(post.date)}</time></p>
        <div
          className="b-article-body"
          // 内容来自仓库内自己的 Markdown，无用户输入
          dangerouslySetInnerHTML={{ __html: html }}
        />
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
