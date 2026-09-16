// ============================================
// 今日穿搭 —— 填气温 / 场合 / 天气，按一下就有一套
// ============================================
import { useEffect, useRef, useState } from 'react'
import { CATEGORY_MAP, OCCASIONS, WEATHERS, climateFor } from './model.js'
import { buildOutfit, sortPieces } from './outfit.js'
import { ChipGroup, ItemThumb } from './ui.jsx'

const PREF_KEY = 'yuyu-wardrobe-prefs'

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY)
    if (!raw) return {}
    return JSON.parse(raw) || {}
  } catch {
    return {}
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs))
  } catch {
    /* 存不了就算了，只是个默认值 */
  }
}

export default function OutfitStudio({ items, onWear, onSaveOutfit, onEditItem }) {
  const prefs = useRef(loadPrefs()).current
  const [temp, setTemp] = useState(() => (Number.isFinite(prefs.temp) ? prefs.temp : 20))
  const [occasion, setOccasion] = useState(() => prefs.occasion || 'daily')
  const [weather, setWeather] = useState(() => prefs.weather || 'clear')
  const [result, setResult] = useState(null)
  const [seen, setSeen] = useState([])
  const [flash, setFlash] = useState('')

  useEffect(() => {
    savePrefs({ temp, occasion, weather })
  }, [temp, occasion, weather])

  // 条件一改，旧的那套就过期了
  useEffect(() => {
    setResult(null)
    setSeen([])
  }, [temp, occasion, weather, items.length])

  const climate = climateFor(temp)

  const generate = () => {
    const next = buildOutfit(items, { temp, occasion, weather, exclude: seen })
    setResult(next)
    if (next.signature) setSeen((prev) => [...prev.slice(-11), next.signature])
    setFlash('')
  }

  const wearIt = () => {
    onWear(result.pieces)
    setFlash('记下了，今天就穿这套')
  }

  const saveIt = () => {
    onSaveOutfit(result, { temp, occasion, weather })
    setFlash('已收藏这套搭配')
  }

  return (
    <section className="wd-studio" aria-labelledby="wd-studio-title">
      <div className="wd-studio-head">
        <h2 id="wd-studio-title">今日推荐</h2>
        <p>把天气和要去的场合告诉它，剩下的交给衣橱。</p>
      </div>

      <div className="wd-controls">
        <div className="wd-control">
          <label className="wd-label" htmlFor="wd-temp">
            气温 <strong>{temp}°C</strong> · {climate.label}
          </label>
          <input
            id="wd-temp"
            className="wd-range"
            type="range"
            min="-10"
            max="38"
            step="1"
            value={temp}
            onChange={(event) => setTemp(Number(event.target.value))}
          />
        </div>

        <div className="wd-control">
          <span className="wd-label">场合</span>
          <ChipGroup
            options={OCCASIONS}
            value={occasion}
            multiple={false}
            name="场合"
            onChange={setOccasion}
          />
        </div>

        <div className="wd-control">
          <span className="wd-label">天气</span>
          <ChipGroup
            options={WEATHERS}
            value={weather}
            multiple={false}
            name="天气"
            onChange={setWeather}
          />
        </div>
      </div>

      <div className="wd-studio-actions">
        <button type="button" className="wd-btn wd-btn-primary wd-btn-lg" onClick={generate}>
          {result ? '换一套' : '生成今天的搭配'}
        </button>
        {result?.pieces.length > 0 && (
          <>
            <button type="button" className="wd-btn wd-btn-ghost" onClick={wearIt}>
              就穿这套
            </button>
            <button type="button" className="wd-btn wd-btn-ghost" onClick={saveIt}>
              收藏
            </button>
          </>
        )}
        {flash && <span className="wd-flash">{flash}</span>}
      </div>

      {result && result.pieces.length === 0 && (
        <p className="wd-empty-line">
          衣橱里还缺{result.missing.join(' 和 ')}，先添两件再来试试。
        </p>
      )}

      {result?.pieces.length > 0 && (
        <div className="wd-outfit">
          <div className="wd-outfit-pieces">
            {sortPieces(result.pieces).map((piece) => (
              <button
                type="button"
                className="wd-piece"
                key={piece.id}
                onClick={() => onEditItem(piece)}
                title="点开看详情"
              >
                <ItemThumb item={piece} />
                <span className="wd-piece-cat">{CATEGORY_MAP[piece.category]?.name}</span>
                <span className="wd-piece-name">{piece.name}</span>
              </button>
            ))}
          </div>
          <ul className="wd-reasons">
            {result.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
