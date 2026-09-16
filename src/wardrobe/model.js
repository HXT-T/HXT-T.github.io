// ============================================
// 电子衣橱 —— 数据模型与常量
// 单品（item）结构：
// {
//   id, name, category, colors: [colorId], seasons: [seasonId],
//   occasions: [occasionId], warmth: 1-5, tags: [string], note,
//   image: dataURL | '', favorite: bool,
//   wearCount, lastWornAt: 'YYYY-MM-DD' | '', createdAt
// }
// ============================================

// slot 决定单品在一套搭配里占的位置，同一 slot 只会出现一件
export const CATEGORIES = [
  { id: 'top', name: '上衣', slot: 'top', icon: '👕' },
  { id: 'bottom', name: '下装', slot: 'bottom', icon: '👖' },
  { id: 'dress', name: '连衣裙', slot: 'whole', icon: '👗' },
  { id: 'outerwear', name: '外套', slot: 'outerwear', icon: '🧥' },
  { id: 'shoes', name: '鞋', slot: 'shoes', icon: '👟' },
  { id: 'bag', name: '包', slot: 'bag', icon: '👜' },
  { id: 'accessory', name: '配饰', slot: 'accessory', icon: '🧣' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

// neutral 的颜色和谁都好搭，不参与撞色判定；hue 用于近似色/互补色计算
export const COLORS = [
  { id: 'white', name: '白', hex: '#f6f2ef', neutral: true },
  { id: 'beige', name: '米杏', hex: '#e2d0b4', neutral: true },
  { id: 'gray', name: '灰', hex: '#9b9ba3', neutral: true },
  { id: 'black', name: '黑', hex: '#332f35', neutral: true },
  { id: 'brown', name: '棕', hex: '#8a5a38', neutral: true },
  { id: 'denim', name: '牛仔蓝', hex: '#4a6fa5', neutral: true },
  { id: 'red', name: '红', hex: '#d2384a', hue: 355 },
  { id: 'orange', name: '橘', hex: '#e0813c', hue: 28 },
  { id: 'yellow', name: '黄', hex: '#e5c25c', hue: 45 },
  { id: 'green', name: '绿', hex: '#5d8c5b', hue: 115 },
  { id: 'blue', name: '蓝', hex: '#4a7fc1', hue: 212 },
  { id: 'purple', name: '紫', hex: '#8a6bc1', hue: 265 },
  { id: 'pink', name: '粉', hex: '#e39ab6', hue: 335 },
]

export const COLOR_MAP = Object.fromEntries(COLORS.map((c) => [c.id, c]))

export const SEASONS = [
  { id: 'spring', name: '春' },
  { id: 'summer', name: '夏' },
  { id: 'autumn', name: '秋' },
  { id: 'winter', name: '冬' },
]

// 相邻季节算「勉强能穿」，对季的要扣分
export const SEASON_NEIGHBORS = {
  spring: ['autumn'],
  summer: ['spring'],
  autumn: ['spring'],
  winter: ['autumn'],
}

export const SEASON_OPPOSITE = {
  spring: 'winter',
  summer: 'winter',
  autumn: 'summer',
  winter: 'summer',
}

export const OCCASIONS = [
  { id: 'daily', name: '日常' },
  { id: 'work', name: '通勤' },
  { id: 'date', name: '约会' },
  { id: 'sport', name: '运动' },
  { id: 'formal', name: '正式' },
]

export const OCCASION_MAP = Object.fromEntries(OCCASIONS.map((o) => [o.id, o]))

// 场合之间的相容度：通勤和正式互相能借，运动和正式完全不搭
export const OCCASION_AFFINITY = {
  daily: { daily: 1, work: 0.5, date: 0.6, sport: 0.5, formal: 0 },
  work: { work: 1, daily: 0.5, formal: 0.7, date: 0.4, sport: 0 },
  date: { date: 1, daily: 0.6, work: 0.4, formal: 0.5, sport: 0 },
  sport: { sport: 1, daily: 0.5, work: 0, date: 0, formal: 0 },
  formal: { formal: 1, work: 0.7, date: 0.5, daily: 0, sport: 0 },
}

export const WARMTH_LABELS = ['清凉', '轻薄', '适中', '保暖', '厚实']

export const WEATHERS = [
  { id: 'clear', name: '晴' },
  { id: 'rain', name: '雨' },
  { id: 'wind', name: '大风' },
]

// 气温 → 当天的季节归属、目标保暖度总分、是否需要外套
export function climateFor(temp) {
  if (temp >= 28) return { label: '炎热', season: 'summer', warmth: 2, outerwear: 'none' }
  if (temp >= 23) return { label: '温暖', season: 'summer', warmth: 4, outerwear: 'optional' }
  if (temp >= 18) return { label: '舒适', season: 'spring', warmth: 5, outerwear: 'optional' }
  if (temp >= 12) return { label: '微凉', season: 'autumn', warmth: 7, outerwear: 'recommended' }
  if (temp >= 6) return { label: '转冷', season: 'autumn', warmth: 9, outerwear: 'required' }
  if (temp >= 0) return { label: '寒冷', season: 'winter', warmth: 11, outerwear: 'required' }
  return { label: '严寒', season: 'winter', warmth: 13, outerwear: 'required' }
}

export const TODAY = () => new Date().toISOString().slice(0, 10)

export function daysSince(dateStr) {
  if (!dateStr) return Infinity
  const then = Date.parse(`${dateStr}T00:00:00`)
  if (Number.isNaN(then)) return Infinity
  return Math.max(0, Math.floor((Date.now() - then) / 86400000))
}

// 排序用：没穿过的记成一个很大的有限值，免得 Infinity - Infinity 变成 NaN
export function idleRank(item) {
  const idle = daysSince(item.lastWornAt)
  return Number.isFinite(idle) ? idle : 9999
}

export function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// 新单品的默认值，表单和导入都走这里，保证字段齐全
export function normalizeItem(raw = {}) {
  return {
    id: raw.id || createId(),
    name: (raw.name || '').trim() || '未命名单品',
    category: CATEGORY_MAP[raw.category] ? raw.category : 'top',
    colors: Array.isArray(raw.colors) ? raw.colors.filter((c) => COLOR_MAP[c]).slice(0, 2) : [],
    seasons: Array.isArray(raw.seasons) ? raw.seasons.filter((s) => SEASON_OPPOSITE[s]) : [],
    occasions: Array.isArray(raw.occasions)
      ? raw.occasions.filter((o) => OCCASION_MAP[o])
      : [],
    warmth: Math.min(5, Math.max(1, Number(raw.warmth) || 3)),
    tags: Array.isArray(raw.tags) ? raw.tags.filter(Boolean).slice(0, 8) : [],
    note: (raw.note || '').slice(0, 200),
    image: typeof raw.image === 'string' ? raw.image : '',
    favorite: Boolean(raw.favorite),
    wearCount: Math.max(0, Number(raw.wearCount) || 0),
    lastWornAt: typeof raw.lastWornAt === 'string' ? raw.lastWornAt : '',
    createdAt: raw.createdAt || new Date().toISOString(),
  }
}
