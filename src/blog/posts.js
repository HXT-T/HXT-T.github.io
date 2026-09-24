// 博客文章加载器 —— 构建时把 src/posts/*.md 全部读进来，
// 解析开头的 frontmatter，按日期倒序排列。
// 新增文章只需在 src/posts/ 里放 Markdown 文件，无需注册。
const modules = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// 阅读时间：中文按每分钟 400 字、英文按每分钟 220 词估算，至少 1 分钟
export function readingMinutes(text) {
  const cjk = (text.match(/[\u3400-\u9fff]/g) || []).length
  const words = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length
  return Math.max(1, Math.round(cjk / 400 + words / 220))
}

function parsePost(raw, slug) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return {
      slug,
      title: slug,
      date: '',
      category: '未分类',
      excerpt: '',
      body: raw.trim(),
    }
  }
  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || '',
    category: meta.category || '未分类',
    excerpt: meta.excerpt || '',
    body: match[2].trim(),
  }
}

export const posts = Object.entries(modules)
  .map(([path, raw]) =>
    parsePost(raw, path.split('/').pop().replace(/\.md$/, '')),
  )
  .map((post) => ({ ...post, minutes: readingMinutes(post.body) }))
  .sort((a, b) => (a.date < b.date ? 1 : -1))

// 分类直接从文章里数出来：有文章才会出现，数量也永远是对的。
// 从前 src/data.js 里另外手写了一份分类表，和实际文章对不上，
// 点进去就是空列表 —— 那份表已经删掉了。
export const topics = [...posts.reduce((counts, post) => {
  counts.set(post.category, (counts.get(post.category) || 0) + 1)
  return counts
}, new Map())]
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'))
