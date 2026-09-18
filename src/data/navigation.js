// ============================================
// 站点地图 —— 全站唯一的页面清单
// 顶栏、页脚、首页的生活索引、各页刊号都从这里推导，
// 新增或改名页面只改这一处。
// ============================================
//
// group    work   —— 正在做的事（作品、写作）
//          garden —— 生活的记录（书架、瞬间、旅行）
//          lab    —— 独立运行的小工具
// masthead 是否出现在顶栏。顶栏只放固定栏目，
//          其余页面在页脚的完整索引里。
export const pages = [
  {
    id: 'home',
    index: '00',
    name: 'Home',
    label: '封面',
    href: '/',
    group: 'root',
    masthead: false,
  },
  {
    id: 'projects',
    index: '01',
    name: 'Product Lab',
    label: '作品',
    href: '/projects',
    group: 'work',
    masthead: true,
    priority: true,
  },
  {
    id: 'writing',
    index: '02',
    name: 'Writing',
    label: '写作',
    href: '/blog',
    group: 'work',
    masthead: true,
  },
  {
    id: 'books',
    index: '03',
    name: 'Books',
    label: '书架',
    href: '/books',
    group: 'garden',
    masthead: true,
  },
  {
    id: 'moments',
    index: '04',
    name: 'Moments',
    label: '瞬间',
    href: '/moments',
    group: 'garden',
    masthead: true,
  },
  {
    id: 'travel',
    index: '05',
    name: 'Travel',
    label: '旅行',
    href: '/travel',
    group: 'garden',
    masthead: false,
  },
  {
    id: 'wardrobe',
    index: '06',
    name: 'Wardrobe',
    label: '衣橱',
    href: '/wardrobe',
    group: 'lab',
    masthead: false,
  },
]

export const mastheadPages = pages.filter((page) => page.masthead)

export const indexPages = pages.filter((page) => page.id !== 'home')

export const pagesInGroup = (group) => pages.filter((page) => page.group === group)

export function findPage(id) {
  return pages.find((page) => page.id === id)
}

// 页脚署名：始终显示当前页在站点里的编号与名字，
// 代替从前每个页面手写一个互不相干的数字。
export function pageSignature(id) {
  const page = findPage(id) ?? pages[0]
  return `${page.index} / ${page.name.toUpperCase()}`
}
