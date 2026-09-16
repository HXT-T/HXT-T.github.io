// ============================================
// 添加 / 编辑单品的弹层
// ============================================
import { useEffect, useRef, useState } from 'react'
import {
  CATEGORIES,
  OCCASIONS,
  SEASONS,
  WARMTH_LABELS,
  normalizeItem,
} from './model.js'
import { compressImage } from './image.js'
import { ChipGroup, ColorPicker } from './ui.jsx'

const EMPTY = {
  name: '',
  category: 'top',
  colors: [],
  seasons: [],
  occasions: [],
  warmth: 3,
  tags: [],
  note: '',
  image: '',
}

export default function ItemForm({ item, onSave, onClose, onDelete }) {
  const [draft, setDraft] = useState(() => ({ ...EMPTY, ...(item || {}) }))
  const [tagText, setTagText] = useState((item?.tags || []).join(' '))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const patch = (changes) => setDraft((prev) => ({ ...prev, ...changes }))

  const onPickPhoto = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // 允许连续选同一张
    if (!file) return
    setBusy(true)
    setError('')
    try {
      patch({ image: await compressImage(file) })
    } catch (err) {
      setError(err.message || '图片处理失败，换一张试试')
    } finally {
      setBusy(false)
    }
  }

  const submit = (event) => {
    event.preventDefault()
    if (!draft.name.trim()) {
      setError('给它起个名字吧，比如「米色风衣」')
      nameRef.current?.focus()
      return
    }
    const tags = tagText
      .split(/[\s,，、]+/)
      .map((t) => t.trim())
      .filter(Boolean)
    onSave(normalizeItem({ ...draft, tags }))
  }

  return (
    <div className="wd-backdrop" onMouseDown={onClose}>
      <form
        className="wd-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-label={item ? '编辑单品' : '添加单品'}
      >
        <header className="wd-dialog-top">
          <h2>{item ? '编辑单品' : '添加单品'}</h2>
          <button type="button" className="wd-icon-btn" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </header>

        <div className="wd-dialog-body">
          <div className="wd-field wd-photo-field">
            <span className="wd-label">照片</span>
            <div className="wd-photo-row">
              <div className="wd-photo-preview">
                {draft.image ? (
                  <img src={draft.image} alt="" />
                ) : (
                  <span className="wd-photo-empty">还没有照片</span>
                )}
              </div>
              <div className="wd-photo-actions">
                <label className="wd-btn wd-btn-ghost">
                  {busy ? '处理中…' : draft.image ? '换一张' : '选择照片'}
                  <input type="file" accept="image/*" onChange={onPickPhoto} hidden />
                </label>
                {draft.image && (
                  <button
                    type="button"
                    className="wd-btn wd-btn-plain"
                    onClick={() => patch({ image: '' })}
                  >
                    移除照片
                  </button>
                )}
                <p className="wd-hint">照片只存在这台设备的浏览器里，不会上传</p>
              </div>
            </div>
          </div>

          <div className="wd-field">
            <label className="wd-label" htmlFor="wd-name">
              名字
            </label>
            <input
              id="wd-name"
              ref={nameRef}
              className="wd-input"
              value={draft.name}
              placeholder="米色风衣"
              maxLength={40}
              onChange={(event) => patch({ name: event.target.value })}
            />
          </div>

          <div className="wd-field">
            <span className="wd-label">类别</span>
            <ChipGroup
              options={CATEGORIES}
              value={draft.category}
              multiple={false}
              name="类别"
              onChange={(category) => patch({ category })}
              renderLabel={(option) => `${option.icon} ${option.name}`}
            />
          </div>

          <div className="wd-field">
            <span className="wd-label">颜色（最多两个主色）</span>
            <ColorPicker value={draft.colors} onChange={(colors) => patch({ colors })} />
          </div>

          <div className="wd-field">
            <span className="wd-label">季节（不选 = 四季可穿）</span>
            <ChipGroup
              options={SEASONS}
              value={draft.seasons}
              name="季节"
              onChange={(seasons) => patch({ seasons })}
            />
          </div>

          <div className="wd-field">
            <span className="wd-label">场合</span>
            <ChipGroup
              options={OCCASIONS}
              value={draft.occasions}
              name="场合"
              onChange={(occasions) => patch({ occasions })}
            />
          </div>

          <div className="wd-field">
            <label className="wd-label" htmlFor="wd-warmth">
              厚度 · {WARMTH_LABELS[draft.warmth - 1]}
            </label>
            <input
              id="wd-warmth"
              className="wd-range"
              type="range"
              min="1"
              max="5"
              step="1"
              value={draft.warmth}
              onChange={(event) => patch({ warmth: Number(event.target.value) })}
            />
          </div>

          <div className="wd-field">
            <label className="wd-label" htmlFor="wd-tags">
              标签（空格分隔）
            </label>
            <input
              id="wd-tags"
              className="wd-input"
              value={tagText}
              placeholder="羊毛 防水 显瘦"
              onChange={(event) => setTagText(event.target.value)}
            />
          </div>

          <div className="wd-field">
            <label className="wd-label" htmlFor="wd-note">
              备注
            </label>
            <input
              id="wd-note"
              className="wd-input"
              value={draft.note}
              placeholder="去年冬天买的，配黑裤子最好看"
              maxLength={200}
              onChange={(event) => patch({ note: event.target.value })}
            />
          </div>

          {error && <p className="wd-error">{error}</p>}
        </div>

        <footer className="wd-dialog-foot">
          {item && onDelete && (
            <button
              type="button"
              className="wd-btn wd-btn-plain wd-danger"
              onClick={() => onDelete(item)}
            >
              删除
            </button>
          )}
          <span className="wd-spacer" />
          <button type="button" className="wd-btn wd-btn-ghost" onClick={onClose}>
            取消
          </button>
          <button type="submit" className="wd-btn wd-btn-primary" disabled={busy}>
            保存
          </button>
        </footer>
      </form>
    </div>
  )
}
