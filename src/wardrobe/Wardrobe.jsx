// ============================================
// 「电子衣橱」页 —— 登记衣服 + 生成穿搭 + 看看自己到底在穿什么
// 数据全在本地浏览器（IndexedDB），没有后端，也不上传
// ============================================
import { useEffect, useMemo, useRef, useState } from 'react'
import SubNav from '../components/SubNav.jsx'
import SubFooter from '../components/SubFooter.jsx'
import { wardrobePage } from '../data.js'
import {
  CATEGORIES,
  CATEGORY_MAP,
  COLOR_MAP,
  OCCASION_MAP,
  SEASONS,
  TODAY,
  WARMTH_LABELS,
  createId,
  daysSince,
  idleRank,
  normalizeItem,
} from './model.js'
import {
  STORE_ITEMS,
  STORE_OUTFITS,
  clearStore,
  isMemoryMode,
  readAll,
  removeOne,
  writeMany,
  writeOne,
} from './storage.js'
import { SAMPLE_ITEMS } from './sample.js'
import { sortPieces } from './outfit.js'
import ItemForm from './ItemForm.jsx'
import OutfitStudio from './OutfitStudio.jsx'
import { ItemThumb } from './ui.jsx'

const SORTS = [
  { id: 'new', name: '最新添加' },
  { id: 'often', name: '最常穿' },
  { id: 'idle', name: '最久没穿' },
]

function idleText(item) {
  const idle = daysSince(item.lastWornAt)
  if (idle === Infinity) return '还没穿过'
  if (idle === 0) return '今天穿过'
  if (idle === 1) return '昨天穿过'
  return `${idle} 天没穿`
}

export default function Wardrobe() {
  const [items, setItems] = useState([])
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // 正在编辑的单品，'new' 表示新建
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [season, setSeason] = useState('all')
  const [sort, setSort] = useState('new')
  const [notice, setNotice] = useState('')
  const importRef = useRef(null)

  useEffect(() => {
    let alive = true
    Promise.all([readAll(STORE_ITEMS), readAll(STORE_OUTFITS)]).then(([savedItems, savedOutfits]) => {
      if (!alive) return
      setItems(savedItems.map(normalizeItem))
      setOutfits(savedOutfits)
      setLoading(false)
      if (isMemoryMode()) {
        setNotice('这个浏览器不让用本地数据库，这次的改动刷新后会丢失。')
      }
    })
    return () => {
      alive = false
    }
  }, [])

  // ---------- 单品增删改 ----------

  const saveItem = async (item) => {
    const saved = normalizeItem(item)
    const before = items
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === saved.id)
      if (index === -1) return [saved, ...prev]
      const next = [...prev]
      next[index] = saved
      return next
    })
    setEditing(null)
    try {
      await writeOne(STORE_ITEMS, saved)
    } catch {
      setItems(before)
      setNotice('没能存进浏览器，多半是照片占的空间到顶了。删掉几张照片再试试。')
    }
  }

  const deleteItem = async (item) => {
    if (!window.confirm(`把「${item.name}」从衣橱里删掉？`)) return
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setEditing(null)
    await removeOne(STORE_ITEMS, item.id)
  }

  const toggleFavorite = async (item) => {
    const next = { ...item, favorite: !item.favorite }
    setItems((prev) => prev.map((i) => (i.id === item.id ? next : i)))
    await writeOne(STORE_ITEMS, next)
  }

  /** 记一笔「今天穿了」：次数 +1，刷新最后穿着日期 */
  const wearPieces = async (pieces) => {
    const today = TODAY()
    const ids = new Set(pieces.map((p) => p.id))
    const updated = items
      .filter((item) => ids.has(item.id))
      .map((item) => ({ ...item, wearCount: item.wearCount + 1, lastWornAt: today }))
    if (!updated.length) return
    const patch = new Map(updated.map((item) => [item.id, item]))
    setItems((prev) => prev.map((item) => patch.get(item.id) || item))
    try {
      await writeMany(STORE_ITEMS, updated)
    } catch {
      setNotice('穿着记录没能存下来，刷新后可能还是原样。')
    }
  }

  // ---------- 收藏的搭配 ----------

  const saveOutfit = async (result, meta) => {
    const outfit = {
      id: createId(),
      itemIds: result.pieces.map((p) => p.id),
      reasons: result.reasons,
      ...meta,
      createdAt: new Date().toISOString(),
    }
    setOutfits((prev) => [outfit, ...prev])
    await writeOne(STORE_OUTFITS, outfit)
  }

  const deleteOutfit = async (id) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id))
    await removeOne(STORE_OUTFITS, id)
  }

  // ---------- 示例 / 导入导出 ----------

  const seedSample = async () => {
    const seeded = SAMPLE_ITEMS.map((raw) => normalizeItem(raw))
    setItems((prev) => [...seeded, ...prev])
    try {
      await writeMany(STORE_ITEMS, seeded)
      setNotice(`放了 ${seeded.length} 件示例衣服进来，先拿它们试试搭配。`)
    } catch {
      setNotice('示例衣服没能存下来，刷新后会消失。')
    }
  }

  const exportData = () => {
    const payload = { version: 1, exportedAt: new Date().toISOString(), items, outfits }
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `wardrobe-${TODAY()}.json`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const importData = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const payload = JSON.parse(await file.text())
      const incoming = (payload.items || []).map(normalizeItem)
      if (!incoming.length) {
        setNotice('这个文件里没有找到单品。')
        return
      }
      const known = new Set(items.map((i) => i.id))
      const fresh = incoming.filter((item) => !known.has(item.id))
      setItems((prev) => [...fresh, ...prev])
      await writeMany(STORE_ITEMS, fresh)
      const incomingOutfits = (payload.outfits || []).filter(
        (o) => o?.id && !outfits.some((existing) => existing.id === o.id),
      )
      if (incomingOutfits.length) {
        setOutfits((prev) => [...incomingOutfits, ...prev])
        await writeMany(STORE_OUTFITS, incomingOutfits)
      }
      setNotice(`导入了 ${fresh.length} 件单品${incomingOutfits.length ? `、${incomingOutfits.length} 套搭配` : ''}。`)
    } catch (error) {
      setNotice(
        error instanceof SyntaxError
          ? '这个文件读不出来，确认是之前导出的 JSON 吗？'
          : '导入时没能写进浏览器，可能是空间不够了。',
      )
    }
  }

  const clearAll = async () => {
    if (!window.confirm('清空整个衣橱？照片和记录都会没有。')) return
    if (!window.confirm('真的确定吗？这一步撤不回来。')) return
    setItems([])
    setOutfits([])
    await Promise.all([clearStore(STORE_ITEMS), clearStore(STORE_OUTFITS)])
    setNotice('衣橱已经清空。')
  }

  // ---------- 筛选与统计 ----------

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    const filtered = items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (season !== 'all') {
        // 没标季节的当作四季可穿，任何季节都留下
        if (item.seasons.length && !item.seasons.includes(season)) return false
      }
      if (!keyword) return true
      return [item.name, item.note, ...item.tags].join(' ').toLowerCase().includes(keyword)
    })

    const sorted = [...filtered]
    if (sort === 'often') sorted.sort((a, b) => b.wearCount - a.wearCount)
    else if (sort === 'idle') sorted.sort((a, b) => idleRank(b) - idleRank(a))
    else sorted.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    return sorted
  }, [items, query, category, season, sort])

  const stats = useMemo(() => {
    const byCategory = CATEGORIES.map((c) => ({
      ...c,
      count: items.filter((item) => item.category === c.id).length,
    })).filter((c) => c.count > 0)

    const byColor = Object.values(COLOR_MAP)
      .map((color) => ({
        ...color,
        count: items.filter((item) => item.colors.includes(color.id)).length,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const sleepers = [...items]
      .filter((item) => daysSince(item.lastWornAt) > 60)
      .sort((a, b) => idleRank(b) - idleRank(a))
      .slice(0, 3)

    const favorites = [...items]
      .filter((item) => item.wearCount > 0)
      .sort((a, b) => b.wearCount - a.wearCount)
      .slice(0, 3)

    const wornTotal = items.reduce((sum, item) => sum + item.wearCount, 0)
    const neverWorn = items.filter((item) => !item.lastWornAt).length

    return { byCategory, byColor, sleepers, favorites, wornTotal, neverWorn }
  }, [items])

  const maxCategoryCount = Math.max(1, ...stats.byCategory.map((c) => c.count))

  return (
    <>
      <SubNav current="/wardrobe" />
      <section className="p-hero">
        <span className="p-badge">{wardrobePage.badge}</span>
        <h1 className="p-title">{wardrobePage.title}</h1>
        <p className="p-sub">{wardrobePage.sub}</p>
      </section>

      <main className="p-main wd-main">
        {notice && (
          <p className="wd-notice" role="status">
            {notice}
            <button type="button" className="wd-icon-btn" onClick={() => setNotice('')} aria-label="关闭提示">
              ×
            </button>
          </p>
        )}

        {loading ? (
          <p className="wd-loading">正在打开衣橱…</p>
        ) : items.length === 0 ? (
          <section className="wd-onboard">
            <h2>衣橱还是空的</h2>
            <p>
              把常穿的衣服登记进来 —— 一件只要几秒钟，照片可有可无。
              登记到十几件之后，它就能替你决定今天穿什么了。
            </p>
            <div className="wd-onboard-actions">
              <button type="button" className="wd-btn wd-btn-primary wd-btn-lg" onClick={() => setEditing('new')}>
                添加第一件
              </button>
              <button type="button" className="wd-btn wd-btn-ghost" onClick={seedSample}>
                先放一柜示例衣服
              </button>
            </div>
          </section>
        ) : (
          <>
            <OutfitStudio
              items={items}
              onWear={wearPieces}
              onSaveOutfit={saveOutfit}
              onEditItem={setEditing}
            />

            <section className="wd-section" aria-labelledby="wd-closet-title">
              <div className="wd-section-head">
                <h2 id="wd-closet-title">我的衣橱</h2>
                <span className="wd-count">{items.length} 件</span>
                <button type="button" className="wd-btn wd-btn-primary" onClick={() => setEditing('new')}>
                  + 添加单品
                </button>
              </div>

              <div className="wd-filters">
                <input
                  className="wd-input wd-search"
                  type="search"
                  value={query}
                  placeholder="搜名字、标签或备注"
                  aria-label="搜索单品"
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="wd-filter-row">
                  <div className="wd-chips" role="group" aria-label="按类别筛选">
                    <button
                      type="button"
                      className={`wd-chip${category === 'all' ? ' is-on' : ''}`}
                      onClick={() => setCategory('all')}
                    >
                      全部
                    </button>
                    {CATEGORIES.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        className={`wd-chip${category === c.id ? ' is-on' : ''}`}
                        onClick={() => setCategory(c.id)}
                      >
                        {c.icon} {c.name}
                      </button>
                    ))}
                  </div>
                  <div className="wd-chips" role="group" aria-label="按季节筛选">
                    <button
                      type="button"
                      className={`wd-chip${season === 'all' ? ' is-on' : ''}`}
                      onClick={() => setSeason('all')}
                    >
                      四季
                    </button>
                    {SEASONS.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        className={`wd-chip${season === s.id ? ' is-on' : ''}`}
                        onClick={() => setSeason(s.id)}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <label className="wd-sort">
                    <span className="wd-sr-only">排序</span>
                    <select value={sort} onChange={(event) => setSort(event.target.value)}>
                      {SORTS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {visible.length === 0 ? (
                <p className="wd-empty-line">没有符合条件的单品，换个筛选试试。</p>
              ) : (
                <div className="wd-grid">
                  {visible.map((item) => (
                    <article className="wd-card" key={item.id}>
                      <button
                        type="button"
                        className="wd-card-main"
                        onClick={() => setEditing(item)}
                        aria-label={`编辑 ${item.name}`}
                      >
                        <ItemThumb item={item} size="lg" />
                        <div className="wd-card-body">
                          <h3>{item.name}</h3>
                          <p className="wd-card-meta">
                            {CATEGORY_MAP[item.category]?.name} ·{' '}
                            {WARMTH_LABELS[item.warmth - 1]} · {idleText(item)}
                          </p>
                          <p className="wd-card-tags">
                            {[
                              item.seasons
                                .map((s) => SEASONS.find((x) => x.id === s)?.name)
                                .join(''),
                              item.occasions.map((o) => OCCASION_MAP[o]?.name).join(' '),
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        </div>
                      </button>
                      <div className="wd-card-actions">
                        <button
                          type="button"
                          className={`wd-icon-btn${item.favorite ? ' is-on' : ''}`}
                          onClick={() => toggleFavorite(item)}
                          aria-pressed={item.favorite}
                          aria-label={item.favorite ? '取消收藏' : '收藏'}
                        >
                          {item.favorite ? '♥' : '♡'}
                        </button>
                        <button
                          type="button"
                          className="wd-icon-btn"
                          onClick={() => wearPieces([item])}
                          aria-label={`记录今天穿了 ${item.name}`}
                          title="今天穿了"
                        >
                          ✓
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {outfits.length > 0 && (
              <section className="wd-section" aria-labelledby="wd-saved-title">
                <div className="wd-section-head">
                  <h2 id="wd-saved-title">收藏的搭配</h2>
                  <span className="wd-count">{outfits.length} 套</span>
                </div>
                <div className="wd-outfit-list">
                  {outfits.map((outfit) => {
                    const pieces = outfit.itemIds
                      .map((id) => items.find((item) => item.id === id))
                      .filter(Boolean)
                    if (!pieces.length) return null
                    return (
                      <article className="wd-saved" key={outfit.id}>
                        <div className="wd-saved-pieces">
                          {sortPieces(pieces).map((piece) => (
                            <span className="wd-saved-piece" key={piece.id}>
                              <ItemThumb item={piece} size="sm" />
                              <span>{piece.name}</span>
                            </span>
                          ))}
                        </div>
                        <div className="wd-saved-foot">
                          <span>
                            {outfit.temp}°C · {OCCASION_MAP[outfit.occasion]?.name || '日常'}
                            {pieces.length < outfit.itemIds.length && ' · 有单品已删除'}
                          </span>
                          <button type="button" className="wd-btn wd-btn-plain" onClick={() => wearPieces(pieces)}>
                            今天穿这套
                          </button>
                          <button
                            type="button"
                            className="wd-btn wd-btn-plain wd-danger"
                            onClick={() => deleteOutfit(outfit.id)}
                          >
                            删除
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            )}

            <section className="wd-section" aria-labelledby="wd-insight-title">
              <div className="wd-section-head">
                <h2 id="wd-insight-title">衣橱洞察</h2>
              </div>
              <div className="wd-insights">
                <div className="wd-insight">
                  <h3>类别分布</h3>
                  <ul className="wd-bars">
                    {stats.byCategory.map((c) => (
                      <li key={c.id}>
                        <span className="wd-bar-label">
                          {c.icon} {c.name}
                        </span>
                        <span className="wd-bar-track">
                          <span
                            className="wd-bar-fill"
                            style={{ width: `${(c.count / maxCategoryCount) * 100}%` }}
                          />
                        </span>
                        <span className="wd-bar-value">{c.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="wd-insight">
                  <h3>常穿的颜色</h3>
                  <ul className="wd-color-stats">
                    {stats.byColor.map((color) => (
                      <li key={color.id}>
                        <span className="wd-color-dot" style={{ background: color.hex }} aria-hidden="true" />
                        {color.name} × {color.count}
                      </li>
                    ))}
                  </ul>
                  <p className="wd-hint">
                    一共穿出去 {stats.wornTotal} 次
                    {stats.neverWorn > 0 && `，还有 ${stats.neverWorn} 件没上过身`}
                  </p>
                </div>

                <div className="wd-insight">
                  <h3>压箱底的</h3>
                  {stats.sleepers.length ? (
                    <ul className="wd-plain-list">
                      {stats.sleepers.map((item) => (
                        <li key={item.id}>
                          <button type="button" className="wd-link" onClick={() => setEditing(item)}>
                            {item.name}
                          </button>
                          <span>{idleText(item)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="wd-hint">还没有超过两个月没碰的衣服，挺好。</p>
                  )}
                  {stats.favorites.length > 0 && (
                    <>
                      <h3 className="wd-insight-sub">最常穿</h3>
                      <ul className="wd-plain-list">
                        {stats.favorites.map((item) => (
                          <li key={item.id}>
                            <button type="button" className="wd-link" onClick={() => setEditing(item)}>
                              {item.name}
                            </button>
                            <span>{item.wearCount} 次</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="wd-section wd-data" aria-labelledby="wd-data-title">
              <div className="wd-section-head">
                <h2 id="wd-data-title">数据</h2>
              </div>
              <p className="wd-hint">
                衣橱只存在这台设备的浏览器里。换设备或清缓存之前，记得导出一份备份。
              </p>
              <div className="wd-data-actions">
                <button type="button" className="wd-btn wd-btn-ghost" onClick={exportData}>
                  导出备份
                </button>
                <button type="button" className="wd-btn wd-btn-ghost" onClick={() => importRef.current?.click()}>
                  导入备份
                </button>
                <input ref={importRef} type="file" accept="application/json" hidden onChange={importData} />
                <button type="button" className="wd-btn wd-btn-plain wd-danger" onClick={clearAll}>
                  清空衣橱
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {editing && (
        <ItemForm
          item={editing === 'new' ? null : editing}
          onSave={saveItem}
          onClose={() => setEditing(null)}
          onDelete={deleteItem}
        />
      )}

      <SubFooter />
    </>
  )
}
