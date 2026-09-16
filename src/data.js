// ============================================
// 站点内容配置 —— 以后替换文案只改这里即可
// ============================================
export const site = {
  nickname: 'yuyuyuu',
  title: '美好事物的追寻者',
  tagline: '不断寻求美好事物，并让自己成为美好本身。',
  blogUrl: '/blog',
  githubUrl: 'https://github.com/hxt-t',
}

// 首页 —— Rose Index / 樱色刊物
// 这里保存首页专用内容，不影响博客、瞬间、书架与旅行页的数据结构。
export const home = {
  issue: 'ISSUE 01',
  issueDate: 'AUGUST 2026',
  kicker: 'PERSONAL INTERNET · PRODUCT LAB',
  wordmark: ['YUYU', 'YUU'],
  manifesto: '我在这里做想存在的东西，也写下它们长成之前的念头。',
  roles: ['BUILDING PRODUCTS', 'RUNNING EXPERIMENTS', 'WRITING'],
  location: 'SOMEWHERE ON THE INTERNET · 2026',
  currentProject: {
    name: 'AI Idol Trainer',
    href: '/projects#ai-idol',
  },
  cover: {
    src: '/hero-bg.jpg',
    alt: '樱花树下停着一辆白色汽车的春日照片',
    index: 'ARCHIVE 01',
    caption: 'BLOOM STUDY · SPRING LIGHT',
  },
  now: [
    {
      label: 'BUILDING',
      title: 'KimiPet 与这座网站',
      text: '一边打磨桌面陪伴，一边整理属于自己的长期互联网。',
    },
    {
      label: 'READING',
      title: '《悉达多》与《重构》',
      text: '一本谈智慧，一本谈如何把复杂慢慢整理清楚。',
    },
    {
      label: 'THINKING',
      title: '技术如何不打扰人',
      text: '好的工具应该在需要时出现，其余时间退回背景。',
    },
    {
      label: 'TENDING',
      title: '个人互联网与第二大脑',
      text: '持续整理、连接，也允许一些念头暂时没有结论。',
    },
  ],
}

// 首页顶部的分类导航；href 可覆盖默认跳转（默认跳博客对应分类）
export const categories = [
  { name: '哲学思考' },
  { name: '技术探索' },
  { name: '阅读' },
  { name: '旅行', href: '/travel' },
  { name: '美食' },
  { name: '摄影' },
]

// 旅行页内容 —— trips 里是示例，换成你自己的旅行故事
export const travel = {
  badge: 'TRAVEL · 在路上',
  title: '把世界走成一首长诗',
  quote: {
    text: '世界是一本书，不旅行的人只读了一页。',
    author: '奥古斯丁',
  },
  trips: [
    {
      date: '示例 · 某年春',
      place: '京都',
      note: '樱花落在哲学之道上，走着走着，就想明白了一些事。',
    },
    {
      date: '示例 · 某年夏',
      place: '青海湖',
      note: '湖面是天空的镜子，列车从画里缓缓开过。',
    },
    {
      date: '示例 · 某年秋',
      place: '重庆',
      note: '在洪崖洞的灯火里吃火锅，辣出了眼泪，也笑出了声。',
    },
  ],
  wishlist: ['冰岛', '摩洛哥', '北海道', '新西兰', '大理', '喀什'],
}

// 首页名言库 —— 每次打开随机显示一句，想增删改这里
export const quotes = [
  {
    text: '世界上有两样东西能深深震撼人们的心灵：一件是我们头顶灿烂的星空，另一件是我们内心崇高的道德律。',
    author: '康德',
  },
  {
    text: '美是到处都有的。对于我们的眼睛，不是缺少美，而是缺少发现。',
    author: '罗丹',
  },
  {
    text: '有一个早晨我扔掉了所有的昨天，从此我的脚步就轻盈了。',
    author: '泰戈尔',
  },
  {
    text: '凡是过往，皆为序章。',
    author: '莎士比亚',
  },
  {
    text: '且视他人之疑目如盏盏鬼火，大胆地去走你的夜路。',
    author: '史铁生',
  },
]

export const about = {
  heading: '关于我',
  paragraphs: [
    '你好！我是 yuyuyuu。一个不断寻求美好事物，并让自己成为美好本身的人。',
    '我收集生活里那些发光的瞬间：一本好书的某个段落、旅途中偶遇的黄昏、深夜里关于存在的哲学追问，还有代码世界中一次优雅的抽象。感性让我向往美，理性让我理解美。',
    '这个角落用来安放我遇见的美好、零碎的思考与技术探索，欢迎随便逛逛，也欢迎来我的博客坐坐。',
  ],
  tags: ['哲学思考', '技术探索', '阅读', '旅行', '美食', '摄影', '生活中的小确幸'],
}

export const footer = {
  copyright: `© ${new Date().getFullYear()} yuyuyuu`,
}

// 首页导航里的页面入口（接在分类导航后面）
export const navExtras = [
  { name: '博客', href: '/blog' },
  { name: '瞬间', href: '/moments' },
  { name: '书架', href: '/books' },
]

// 子页面顶栏的互跳链接
export const subPages = [
  { name: '项目', href: '/projects' },
  { name: '博客', href: '/blog' },
  { name: '瞬间', href: '/moments' },
  { name: '书架', href: '/books' },
  { name: '旅行', href: '/travel' },
  { name: '衣橱', href: '/wardrobe' },
]

// 博客页文案；文章本身在 src/posts/ 里，用 Markdown 写
export const blog = {
  badge: 'BLOG · 长思考',
  title: '把想法写成光',
  sub: '哲学、技术、阅读与生活 —— 零碎的思考在这里沉淀',
  emptyText: '没有找到匹配的文章，换个关键词试试～',
}

// 「瞬间」页 —— 微博式的短记，items 里是示例，换成你自己的发光时刻
export const momentsPage = {
  badge: 'MOMENTS · 瞬间',
  title: '收集发光的瞬间',
  sub: '生活不是缺少美，而是缺少记录',
  items: [
    {
      date: '2026-08-08',
      text: '把网站改造成了 React + Vite 的多页应用，/travel 上线。原来折腾工具本身也是一种快乐。',
    },
    {
      date: '2026-06-21',
      text: '夜里读《悉达多》，读到「智慧无法言传」，合上书，对着天花板发了很久的呆。',
    },
    {
      date: '2026-04-02',
      text: '清晨发现楼下的樱花开了第一树，花瓣落进自行车篮，像世界偷偷塞进来的礼物。',
    },
    {
      date: '2026-02-14',
      text: '街角新开的面包店，可颂的层次像一本装订整齐的书。美食果然是最小单位的幸福。',
    },
  ],
}

// 「书架」页 —— status 只能是 在读 / 读过 / 想读；rating 满分 5，仅「读过」需要
export const booksPage = {
  badge: 'BOOKS · 书架',
  title: '与伟大的灵魂对话',
  sub: '读过的书会忘，但它塑造你的部分不会',
  items: [
    {
      title: '悉达多',
      author: '赫尔曼·黑塞',
      status: '在读',
      note: '河流教会他倾听，也教会我慢下来。',
    },
    {
      title: '重构',
      author: 'Martin Fowler',
      status: '在读',
      note: '好代码不是写出来的，是打磨出来的。',
    },
    {
      title: '西西弗神话',
      author: '阿尔贝·加缪',
      status: '读过',
      rating: 5,
      note: '登上顶峰的斗争本身，足以充实一颗人心。',
    },
    {
      title: '人类群星闪耀时',
      author: '斯蒂芬·茨威格',
      status: '读过',
      rating: 4,
      note: '历史的高光时刻，往往诞生于最平凡的犹豫之后。',
    },
    {
      title: '追忆似水年华',
      author: '马塞尔·普鲁斯特',
      status: '想读',
      note: '据说读它需要一生，那就从下一页开始。',
    },
    {
      title: '哥德尔、艾舍尔、巴赫',
      author: '侯世达',
      status: '想读',
      note: '想看看数学、艺术与音乐如何在「怪圈」里相遇。',
    },
  ],
}

// 「电子衣橱」页 —— 只有文案；衣服数据存在访客自己的浏览器里（IndexedDB）
export const wardrobePage = {
  badge: 'WARDROBE · 衣橱',
  title: '今天穿什么',
  sub: '把衣服登记一次，以后交给它替你决定',
}
