// ============================================
// 衣橱页的小零件：缩略图、可多选的标签组
// ============================================
import { CATEGORY_MAP, COLOR_MAP } from './model.js'

/** 有照片就显示照片，没有就用颜色块 + 类别图标顶上 */
export function ItemThumb({ item, size = 'md' }) {
  const category = CATEGORY_MAP[item.category]
  const swatches = item.colors.map((id) => COLOR_MAP[id]?.hex).filter(Boolean)
  const background =
    swatches.length >= 2
      ? `linear-gradient(135deg, ${swatches[0]} 0 50%, ${swatches[1]} 50% 100%)`
      : swatches[0] || 'linear-gradient(135deg, #ffd6e7, #e5dbff)'

  return (
    <div className={`wd-thumb wd-thumb-${size}`}>
      {item.image ? (
        <img src={item.image} alt={item.name} loading="lazy" />
      ) : (
        <div className="wd-thumb-fallback" style={{ background }}>
          <span aria-hidden="true">{category?.icon || '👕'}</span>
        </div>
      )}
    </div>
  )
}

/** 一排可点选的胶囊标签；multiple=false 时是单选 */
export function ChipGroup({
  options,
  value,
  onChange,
  multiple = true,
  name,
  renderLabel,
}) {
  const selected = multiple ? value : [value]

  const toggle = (id) => {
    if (!multiple) {
      onChange(id)
      return
    }
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  // 单选也用 aria-pressed 的按钮，而不是 radiogroup：
  // 真正的 radiogroup 还要实现方向键切换和 roving tabindex，半套语义比没有更糟
  return (
    <div className="wd-chips" role="group" aria-label={name}>
      {options.map((option) => {
        const active = selected.includes(option.id)
        return (
          <button
            type="button"
            key={option.id}
            className={`wd-chip${active ? ' is-on' : ''}`}
            aria-pressed={active}
            onClick={() => toggle(option.id)}
          >
            {renderLabel ? renderLabel(option) : option.name}
          </button>
        )
      })}
    </div>
  )
}

/** 颜色选择：色块 + 名字，最多选两个主色 */
export function ColorPicker({ value, onChange, max = 2 }) {
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
      return
    }
    onChange([...value, id].slice(-max))
  }

  return (
    <div className="wd-colors" role="group" aria-label="颜色">
      {Object.values(COLOR_MAP).map((color) => {
        const active = value.includes(color.id)
        return (
          <button
            type="button"
            key={color.id}
            className={`wd-color${active ? ' is-on' : ''}`}
            aria-pressed={active}
            onClick={() => toggle(color.id)}
            title={color.name}
          >
            <span className="wd-color-dot" style={{ background: color.hex }} aria-hidden="true" />
            <span>{color.name}</span>
          </button>
        )
      })}
    </div>
  )
}
