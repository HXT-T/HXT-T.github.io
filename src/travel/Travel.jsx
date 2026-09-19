import { useEffect, useMemo, useRef, useState } from 'react'
import SiteFrame from '../components/SiteChrome.jsx'
import PageMasthead from '../components/PageMasthead.jsx'
import { travelPage } from '../data.js'
import { formatDate } from '../format.js'
import {
  MOODS,
  SEED_POSTCARDS,
  moodFor,
  persistPostcard,
  readStoredPostcards,
  removePostcard,
  resizePhoto,
  todayString,
} from './postcards.js'

function CameraIcon() {
  return (
    <svg className="tv-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5h3l1.2-2h7.6l1.2 2h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className="tv-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  )
}

// 苔苔 —— 这一页留下的旅伴，缩成页头一枚小小的签章
function FrogMark() {
  return (
    <svg className="tv-frog" viewBox="0 0 330 290" role="img" aria-label="戴着围巾、背着邮差包的青蛙旅伴苔苔">
      <path className="tv-frog-leg" d="M94 218c-28 8-43 24-39 35 5 14 57 8 77-10Z" />
      <path className="tv-frog-leg" d="M229 218c29 8 44 24 39 35-5 14-57 8-77-10Z" />
      <ellipse className="tv-frog-body" cx="163" cy="174" rx="76" ry="83" />
      <circle className="tv-frog-bump" cx="114" cy="93" r="35" />
      <circle className="tv-frog-bump" cx="212" cy="93" r="35" />
      <ellipse className="tv-frog-face" cx="163" cy="123" rx="91" ry="70" />
      <circle className="tv-frog-eye" cx="115" cy="91" r="12" />
      <circle className="tv-frog-eye" cx="211" cy="91" r="12" />
      <circle className="tv-frog-glint" cx="119" cy="87" r="4" />
      <circle className="tv-frog-glint" cx="215" cy="87" r="4" />
      <path className="tv-frog-mouth" d="M142 137c11 9 31 9 42 0" />
      <path className="tv-frog-scarf" d="M91 159c42 18 99 18 143-2l-10 29c-42 15-82 15-123 1Z" />
      <path className="tv-frog-scarf" d="m211 178 37 22-25 42-25-55Z" />
      <rect className="tv-frog-bag" x="159" y="202" width="73" height="50" rx="12" transform="rotate(-5 159 202)" />
    </svg>
  )
}

function Composer({ onClose, onSave }) {
  const [form, setForm] = useState({
    photo: '',
    date: todayString(),
    location: '',
    mood: 'calm',
    note: '',
  })
  const [photoBusy, setPhotoBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const acceptPhoto = async (file) => {
    if (!file) return
    setPhotoBusy(true)
    setError('')
    try {
      const photo = await resizePhoto(file)
      setForm((current) => ({ ...current, photo }))
    } catch (photoError) {
      setError(photoError.message)
    } finally {
      setPhotoBusy(false)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!form.photo) {
      setError('先放入一张想收藏的照片吧')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave(form)
    } catch (saveError) {
      setError(saveError.message)
      setSaving(false)
    }
  }

  return (
    <div
      className="tv-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="tv-dialog" role="dialog" aria-modal="true" aria-labelledby="composer-title">
        <div className="tv-dialog-topline">
          <span>PACK A MEMORY</span>
          <button className="tv-close" type="button" onClick={onClose} autoFocus>
            <span>Close</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form className="tv-form" onSubmit={submit}>
          <h2 id="composer-title">装进一段今天</h2>

          <div
            className={`tv-dropzone${form.photo ? ' has-photo' : ''}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              acceptPhoto(event.dataTransfer.files?.[0])
            }}
          >
            {form.photo ? (
              <>
                <img src={form.photo} alt="待保存照片预览" />
                <button type="button" onClick={() => fileRef.current?.click()}>
                  换一张照片
                </button>
              </>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy}>
                <CameraIcon />
                <strong>{photoBusy ? '正在整理照片…' : '放入一张今天的照片'}</strong>
                <small>点击选择，或把照片拖到这里</small>
              </button>
            )}
            <input
              ref={fileRef}
              className="tv-sr-only"
              type="file"
              accept="image/*"
              onChange={(event) => acceptPhoto(event.target.files?.[0])}
            />
          </div>

          <div className="tv-fields">
            <label>
              <span>日期</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                required
              />
            </label>
            <label>
              <span>地点</span>
              <input
                type="text"
                value={form.location}
                placeholder="比如：杭州 · 北山街"
                maxLength="36"
                onChange={(event) => setForm({ ...form, location: event.target.value })}
              />
            </label>
          </div>

          <fieldset className="tv-moods">
            <legend>这一刻的心情</legend>
            <div>
              {MOODS.map((mood) => (
                <button
                  className={form.mood === mood.key ? 'is-on' : undefined}
                  type="button"
                  key={mood.key}
                  onClick={() => setForm({ ...form, mood: mood.key })}
                  aria-pressed={form.mood === mood.key}
                >
                  <i aria-hidden="true">{mood.symbol}</i>
                  {mood.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="tv-note-field">
            <span>
              随手写 <small>可不写</small>
            </span>
            <textarea
              value={form.note}
              rows="3"
              maxLength="120"
              placeholder="风很轻，路边的花刚好开着……"
              onChange={(event) => setForm({ ...form, note: event.target.value })}
            />
            <i>{form.note.length}/120</i>
          </label>

          {error && (
            <p className="tv-error" role="alert">
              {error}
            </p>
          )}

          <div className="tv-form-actions">
            <p>照片不会离开你的浏览器</p>
            <button className="tv-primary" type="submit" disabled={saving || photoBusy}>
              {saving ? '正在制作明信片…' : '装进旅行包'} <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function PostcardDetail({ postcard, onClose, onDelete }) {
  const mood = moodFor(postcard.mood)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="tv-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="tv-dialog tv-detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className="tv-dialog-topline">
          <span>
            POSTCARD · {mood.label} {mood.symbol}
          </span>
          <button className="tv-close" type="button" onClick={onClose} autoFocus>
            <span>Close</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="tv-detail-layout">
          <figure className="tv-detail-photo">
            <img src={postcard.photo} alt={postcard.title} />
            <figcaption>{formatDate(postcard.date)}</figcaption>
          </figure>

          <div className="tv-detail-copy">
            <h2 id="detail-title">{postcard.title}</h2>
            <p className="tv-detail-place">
              <PinIcon />
              {postcard.location}
            </p>
            <p className="tv-detail-note">
              {postcard.note || '这一刻没有留下文字，照片已经替你记住了。'}
            </p>
            <p className="tv-detail-sign">替你收好啦 · 你的旅伴 苔苔</p>

            {postcard.userCreated && (
              <div className="tv-detail-actions">
                {confirmDelete ? (
                  <>
                    <p>确定让这张明信片离开旅行包吗？</p>
                    <button type="button" onClick={() => setConfirmDelete(false)}>
                      再想想
                    </button>
                    <button className="tv-danger" type="button" onClick={() => onDelete(postcard.id)}>
                      确定删除
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setConfirmDelete(true)}>
                    删除这张记录
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function Travel() {
  const [userPostcards, setUserPostcards] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [composerOpen, setComposerOpen] = useState(false)
  const [detailPostcard, setDetailPostcard] = useState(null)

  useEffect(() => {
    let active = true
    readStoredPostcards()
      .then((postcards) => {
        if (active) setUserPostcards(postcards)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const records = useMemo(
    () => [...userPostcards, ...SEED_POSTCARDS].sort((a, b) => b.date.localeCompare(a.date)),
    [userPostcards],
  )

  const places = new Set(records.map((record) => record.location.split('·')[0].trim())).size
  const visible = filter === 'all' ? records : records.filter((record) => record.mood === filter)

  const savePostcard = async (form) => {
    const location = form.location.trim()
    const postcard = {
      id: window.crypto?.randomUUID?.() || `postcard-${Date.now()}`,
      photo: form.photo,
      date: form.date,
      location: location || '未命名的远方',
      mood: form.mood,
      title: location ? `${location.split('·')[0].trim()}的一刻` : '路上捡到的一刻',
      note: form.note.trim(),
      userCreated: true,
      createdAt: Date.now(),
    }
    await persistPostcard(postcard)
    setUserPostcards((current) => [postcard, ...current])
    setComposerOpen(false)
    setDetailPostcard(postcard)
  }

  const deletePostcard = async (id) => {
    await removePostcard(id)
    setUserPostcards((current) => current.filter((postcard) => postcard.id !== id))
    setDetailPostcard(null)
  }

  return (
    <SiteFrame current="travel">
      <main className="page-main" id="main-content" tabIndex="-1">
        <PageMasthead
          page="travel"
          eyebrow={travelPage.badge}
          title={travelPage.title}
          description={travelPage.sub}
          aside={(
            <>
              <span className="page-masthead__aside-index">
                {String(records.length).padStart(2, '0')} 张 · {places} 个地方
              </span>
              <FrogMark />
              <p>照片只存在这台设备里。</p>
              <small>明信片存在浏览器的 IndexedDB，不会上传，也不会跟着你换设备。</small>
            </>
          )}
        >
          <button className="tv-add" type="button" onClick={() => setComposerOpen(true)}>
            <CameraIcon />
            记录这一刻
          </button>
        </PageMasthead>

        <div className="tv-toolbar">
          <div className="tv-filters" role="group" aria-label="按心情筛选">
            <button
              className={filter === 'all' ? 'is-on' : undefined}
              type="button"
              onClick={() => setFilter('all')}
            >
              全部
            </button>
            {MOODS.map((mood) => (
              <button
                className={filter === mood.key ? 'is-on' : undefined}
                type="button"
                key={mood.key}
                onClick={() => setFilter(mood.key)}
              >
                <i aria-hidden="true">{mood.symbol}</i>
                {mood.label}
              </button>
            ))}
          </div>
          <p aria-live="polite">
            SHOWING {String(visible.length).padStart(2, '0')} /{' '}
            {String(records.length).padStart(2, '0')}
          </p>
        </div>

        {loading ? (
          <p className="tv-status" role="status">
            正在翻开旅行册…
          </p>
        ) : visible.length > 0 ? (
          <div className="tv-grid">
            {visible.map((postcard) => {
              const mood = moodFor(postcard.mood)
              return (
                <button
                  className="tv-card"
                  type="button"
                  key={postcard.id}
                  onClick={() => setDetailPostcard(postcard)}
                >
                  <span className="tv-card-photo">
                    <img src={postcard.photo} alt="" loading="lazy" />
                  </span>
                  <span className="tv-card-meta">
                    <time dateTime={postcard.date}>{formatDate(postcard.date)}</time>
                    <span aria-label={`心情：${mood.label}`}>{mood.symbol}</span>
                  </span>
                  <strong className="tv-card-title">{postcard.title}</strong>
                  <span className="tv-card-place">
                    <PinIcon />
                    {postcard.location}
                  </span>
                  <span className="tv-card-note">
                    {postcard.note || '这一刻没有文字，照片已经记住了。'}
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="tv-status" role="status">
            <span>EMPTY SHELF / FOR NOW</span>
            <p>这一格还是空的。换一种心情看看，或者收藏一个新瞬间。</p>
          </div>
        )}
      </main>

      {composerOpen && <Composer onClose={() => setComposerOpen(false)} onSave={savePostcard} />}
      {detailPostcard && (
        <PostcardDetail
          postcard={detailPostcard}
          onClose={() => setDetailPostcard(null)}
          onDelete={deletePostcard}
        />
      )}
    </SiteFrame>
  )
}
