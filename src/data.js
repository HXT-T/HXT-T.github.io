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

// 「旅行」页 —— 只有文案；明信片存在访客自己的浏览器里（IndexedDB）
export const travelPage = {
  badge: 'TRAVEL · 蛙迹',
  title: '把旅途收进明信片',
  sub: '记录地点、心情与沿途的小事 —— 苔苔替你收好每一张照片',
}

// 「电子衣橱」页 —— 只有文案；衣服数据存在访客自己的浏览器里（IndexedDB）
export const wardrobePage = {
  badge: 'WARDROBE · 衣橱',
  title: '今天穿什么',
  sub: '把衣服登记一次，以后交给它替你决定',
}
