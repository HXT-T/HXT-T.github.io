// 博客文章加载器 —— 构建时把 src/posts/*.md 全部读进来，
// 解析开头的 frontmatter，按日期倒序排列。
// 新增文章只需在 src/posts/ 里放 Markdown 文件，无需注册。
const modules = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

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
  .sort((a, b) => (a.date < b.date ? 1 : -1))
