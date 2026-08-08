// ============================================
// 站点内容配置 —— 以后替换文案只改这里即可
// ============================================
export const site = {
  nickname: 'hxt-t',
  title: '美好事物的追寻者',
  tagline: '不断寻求美好事物，并让自己成为美好本身。',
  blogUrl: '/blog',
  githubUrl: 'https://github.com/hxt-t',
}

// 首页顶部的分类导航，点击跳转到博客对应分类
export const categories = [
  '哲学思考',
  '技术探索',
  '阅读',
  '旅行',
  '美食',
  '摄影',
]

// 首页名言 —— 想换一句话，改这里
export const quote = {
  text: '世界上有两样东西能深深震撼人们的心灵：一件是我们头顶灿烂的星空，另一件是我们内心崇高的道德律。',
  author: '康德',
}

export const about = {
  heading: '关于我',
  paragraphs: [
    '你好！我是 hxt-t。一个不断寻求美好事物，并让自己成为美好本身的人。',
    '我收集生活里那些发光的瞬间：一本好书的某个段落、旅途中偶遇的黄昏、深夜里关于存在的哲学追问，还有代码世界中一次优雅的抽象。感性让我向往美，理性让我理解美。',
    '这个角落用来安放我遇见的美好、零碎的思考与技术探索，欢迎随便逛逛，也欢迎来我的博客坐坐。',
  ],
  tags: ['哲学思考', '技术探索', '阅读', '旅行', '美食', '摄影', '生活中的小确幸'],
}

export const footer = {
  text: '用 ❤️ 与 React 构建',
  tech: 'React 18 · Vite 6 · GitHub Actions 自动部署',
  copyright: `© ${new Date().getFullYear()} hxt-t`,
}
