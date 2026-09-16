// ============================================
// 搭配引擎 —— 从衣橱里挑出一套「今天能穿出门」的衣服
//
// 思路：随机采样若干套候选，逐套打分，取分最高的一套。
// 打分维度：保暖度贴合气温、季节、场合、配色、最近穿过的降权、收藏加成。
// 随机采样让「换一套」每次都有新鲜感，打分保证结果不会离谱。
// ============================================
import {
  COLOR_MAP,
  OCCASION_AFFINITY,
  OCCASION_MAP,
  SEASON_NEIGHBORS,
  SEASON_OPPOSITE,
  climateFor,
  daysSince,
  idleRank,
} from './model.js'

const SAMPLE_COUNT = 240

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function byCategory(items, category) {
  return items.filter((item) => item.category === category)
}

// ---------- 单品打分 ----------

function seasonScore(item, season) {
  if (!item.seasons.length) return 0.5 // 没标季节 = 四季可穿，给一点点分
  if (item.seasons.includes(season)) return 3
  if (item.seasons.some((s) => SEASON_NEIGHBORS[season]?.includes(s))) return 0.5
  if (item.seasons.includes(SEASON_OPPOSITE[season])) return -6
  return -2
}

function occasionScore(item, occasion) {
  if (!item.occasions.length) return 0.5
  const affinity = Math.max(
    ...item.occasions.map((o) => OCCASION_AFFINITY[occasion]?.[o] ?? 0.3),
  )
  return affinity * 4 - 1.5 // 完全相容 +2.5，完全不搭 -1.5
}

function freshnessScore(item) {
  const idle = daysSince(item.lastWornAt)
  if (idle < 2) return -8 // 昨天刚穿过
  if (idle < 5) return -3
  if (idle === Infinity) return 1.2 // 从没穿过，推一把
  if (idle > 30) return 1.5 // 压箱底的，翻出来穿
  return 0
}

function itemScore(item, ctx) {
  // 外套是挡风的那层，季节标错是直接挨冻，所以季节分加倍
  const seasonWeight = item.category === 'outerwear' ? 2 : 1
  return (
    seasonScore(item, ctx.season) * seasonWeight +
    occasionScore(item, ctx.occasion) +
    freshnessScore(item) +
    (item.favorite ? 1.5 : 0) -
    Math.min(item.wearCount * 0.15, 2)
  )
}

// ---------- 配色打分 ----------

function hueDistance(a, b) {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

function pairColorScore(a, b) {
  const distance = hueDistance(a, b)
  if (distance <= 35) return 2 // 邻近色，同色系过渡自然
  if (distance >= 150) return 1.2 // 互补撞色，有对比但成立
  if (distance >= 100) return -1 // 半生不熟的距离，容易乱
  return -2.5
}

export function colorScore(pieces) {
  const colors = pieces
    .flatMap((item) => item.colors)
    .map((id) => COLOR_MAP[id])
    .filter(Boolean)
  if (!colors.length) return 0

  const vivid = colors.filter((c) => !c.neutral)
  if (!vivid.length) return 2 // 全中性色，最安全的一套

  let score = 0
  for (let i = 0; i < vivid.length; i += 1) {
    for (let j = i + 1; j < vivid.length; j += 1) {
      score += pairColorScore(vivid[i].hue, vivid[j].hue)
    }
  }
  const distinctVivid = new Set(vivid.map((c) => c.id)).size
  if (distinctVivid >= 3) score -= (distinctVivid - 2) * 2.5 // 超过两个亮色就太花了
  if (distinctVivid === 1) score += 1.5 // 一个主色 + 中性色，经典结构
  return score
}

// ---------- 整套打分 ----------

// 鞋和包不影响冷暖，算厚度时排除，否则「背个包」会被当成穿暖了
const WARMTH_CATEGORIES = new Set(['top', 'bottom', 'dress', 'outerwear', 'accessory'])

function warmthOf(pieces) {
  return pieces
    .filter((item) => WARMTH_CATEGORIES.has(item.category))
    .reduce((sum, item) => sum + item.warmth, 0)
}

export function scoreOutfit(pieces, ctx) {
  if (!pieces.length) return -Infinity
  // 穿少了挨冻比穿多了难受，所以不足的一侧罚得更重
  const warmthGap = warmthOf(pieces) - ctx.climate.warmth
  let score = pieces.reduce((sum, item) => sum + itemScore(item, ctx), 0)
  score -= warmthGap < 0 ? -warmthGap * 2.4 : warmthGap * 1.2
  score += colorScore(pieces)

  if (ctx.weather === 'rain') {
    // 下雨天：避开浅色和娇气的材质标签
    pieces.forEach((item) => {
      if (item.colors.includes('white') || item.colors.includes('beige')) score -= 1
      if (item.tags.some((tag) => /麂皮|雪地|帆布|绒面/.test(tag))) score -= 2
      if (item.tags.some((tag) => /防水|雨|皮/.test(tag))) score += 1.5
    })
  }
  if (ctx.weather === 'wind' && !pieces.some((item) => item.category === 'outerwear')) {
    score -= 2
  }
  return score
}

// ---------- 采样一套 ----------

function sampleOutfit(pool, ctx) {
  const pieces = []
  const hasDress = pool.dress.length > 0
  const hasSeparates = pool.top.length > 0 && pool.bottom.length > 0

  if (!hasDress && !hasSeparates) return null
  // 有裙子也有上下装时，三分之一的概率走裙子路线
  const useDress = hasDress && (!hasSeparates || Math.random() < 0.34)

  if (useDress) {
    pieces.push(pickRandom(pool.dress))
  } else {
    pieces.push(pickRandom(pool.top), pickRandom(pool.bottom))
  }

  const need = ctx.climate.outerwear
  if (pool.outerwear.length && need !== 'none') {
    const chance = need === 'required' ? 1 : need === 'recommended' ? 0.8 : 0.35
    if (Math.random() < chance) pieces.push(pickRandom(pool.outerwear))
  }
  if (pool.shoes.length) pieces.push(pickRandom(pool.shoes))
  if (pool.bag.length && Math.random() < 0.6) pieces.push(pickRandom(pool.bag))

  // 围巾这类保暖配饰只在够冷的时候才出场，天暖时只考虑轻的
  const accessories = pool.accessory.filter(
    (item) => item.warmth <= 1 || ctx.climate.warmth >= 7,
  )
  if (accessories.length && Math.random() < 0.5) pieces.push(pickRandom(accessories))

  return pieces
}

function signatureOf(pieces) {
  return pieces
    .map((item) => item.id)
    .sort()
    .join('|')
}

/**
 * 生成一套搭配。
 * @param items 全部单品
 * @param options { temp, occasion, weather, exclude: string[] 上几套的签名 }
 * @returns { pieces, score, reasons, climate } 或 { pieces: [], missing: [...] }
 */
export function buildOutfit(items, options = {}) {
  const { temp = 20, occasion = 'daily', weather = 'clear', exclude = [] } = options
  const climate = climateFor(temp)
  const ctx = { climate, season: climate.season, occasion, weather, temp }

  const pool = {
    top: byCategory(items, 'top'),
    bottom: byCategory(items, 'bottom'),
    dress: byCategory(items, 'dress'),
    outerwear: byCategory(items, 'outerwear'),
    shoes: byCategory(items, 'shoes'),
    bag: byCategory(items, 'bag'),
    accessory: byCategory(items, 'accessory'),
  }

  const missing = []
  if (!pool.dress.length && !pool.top.length) missing.push('上衣或连衣裙')
  if (!pool.dress.length && !pool.bottom.length) missing.push('下装')
  if (missing.length) return { pieces: [], missing, climate }

  const skip = new Set(exclude)
  let best = null
  let fallback = null

  for (let i = 0; i < SAMPLE_COUNT; i += 1) {
    const pieces = sampleOutfit(pool, ctx)
    if (!pieces) continue
    const score = scoreOutfit(pieces, ctx)
    const signature = signatureOf(pieces)
    if (!fallback || score > fallback.score) fallback = { pieces, score, signature }
    if (skip.has(signature)) continue
    if (!best || score > best.score) best = { pieces, score, signature }
  }

  const chosen = best || fallback
  if (!chosen) return { pieces: [], missing: ['可搭配的单品'], climate }

  return {
    ...chosen,
    climate,
    ctx,
    reasons: explain(chosen.pieces, ctx),
  }
}

// ---------- 把打分翻译成人话 ----------

function explain(pieces, ctx) {
  const reasons = []
  const { climate } = ctx
  const warmth = warmthOf(pieces)
  const outer = pieces.find((item) => item.category === 'outerwear')

  if (outer) {
    reasons.push(`${ctx.temp}°C ${climate.label}，加了「${outer.name}」挡一下`)
  } else if (climate.outerwear === 'none') {
    reasons.push(`${ctx.temp}°C ${climate.label}，越轻越好，不用外套`)
  } else {
    reasons.push(`${ctx.temp}°C ${climate.label}，这套的厚度刚好，不用再叠一层`)
  }

  if (warmth > climate.warmth + 2) reasons.push('整体偏厚，怕热的话可以减一件')
  if (warmth < climate.warmth - 2) reasons.push('整体偏薄，出门前摸一下风')

  const vivid = pieces
    .flatMap((item) => item.colors)
    .map((id) => COLOR_MAP[id])
    .filter((c) => c && !c.neutral)
  const distinct = [...new Set(vivid.map((c) => c.name))]
  if (!distinct.length) {
    reasons.push('全是中性色，怎么穿都不会错')
  } else if (distinct.length === 1) {
    reasons.push(`${distinct[0]}色做主角，其余交给中性色压住`)
  } else {
    reasons.push(`${distinct.slice(0, 2).join(' + ')} 撞一下，出挑但不乱`)
  }

  const occasionName = OCCASION_MAP[ctx.occasion]?.name
  const fitted = pieces.filter(
    (item) => item.occasions.length && item.occasions.includes(ctx.occasion),
  )
  if (occasionName && fitted.length >= 2) {
    reasons.push(`${fitted.length} 件是你标过「${occasionName}」的单品`)
  }

  const sleeper = pieces
    .filter((item) => daysSince(item.lastWornAt) > 30)
    .sort((a, b) => idleRank(b) - idleRank(a))[0]
  if (sleeper) {
    const idle = daysSince(sleeper.lastWornAt)
    reasons.push(
      idle === Infinity
        ? `「${sleeper.name}」还没穿过，今天开张`
        : `「${sleeper.name}」躺了 ${idle} 天了，翻出来穿`,
    )
  }

  if (ctx.weather === 'rain') reasons.push('雨天，尽量避开了浅色')
  if (ctx.weather === 'wind') reasons.push('大风天，外层挑了能挡风的')

  return reasons.slice(0, 4)
}

/** 搭配里按 slot 排序，展示时顺序稳定 */
export function sortPieces(pieces) {
  const order = ['outerwear', 'dress', 'top', 'bottom', 'shoes', 'bag', 'accessory']
  return [...pieces].sort(
    (a, b) => order.indexOf(a.category) - order.indexOf(b.category),
  )
}

export { signatureOf }
