import { useEffect, useMemo, useRef, useState } from 'react'

const SEED_POSTCARDS = [
  {
    id: 'seed-watertown',
    photo: '/travel-postcards/watertown.png',
    date: '2026-04-18',
    location: '苏州 · 平江路',
    mood: 'calm',
    title: '雨停后的河埠',
    note: '雨落得很轻，柳枝把河面拨出一圈圈小小的涟漪。',
    userCreated: false,
  },
  {
    id: 'seed-seaside',
    photo: '/travel-postcards/seaside-train.png',
    date: '2026-06-02',
    location: '湘南 · 海边车站',
    mood: 'miss',
    title: '沿海电车慢慢开',
    note: '没有赶时间。坐在长椅上，看一班车把傍晚带走。',
    userCreated: false,
  },
  {
    id: 'seed-mountain',
    photo: '/travel-postcards/mountain-camp.png',
    date: '2026-07-21',
    location: '川西 · 山间营地',
    mood: 'surprise',
    title: '住进清晨的雾里',
    note: '醒来时云正从山谷里升起，杯子里的热气也一样。',
    userCreated: false,
  },
]

const MOODS = [
  { key: 'happy', label: '开心', symbol: '☀' },
  { key: 'calm', label: '平静', symbol: '◌' },
  { key: 'surprise', label: '惊喜', symbol: '✦' },
  { key: 'miss', label: '想念', symbol: '☾' },
  { key: 'tired', label: '疲惫', symbol: '≈' },
]

const DB_NAME = 'waji-photo-journal'
const STORE_NAME = 'postcards'

function openJournalDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('当前浏览器不支持本地照片存储'))
      return
    }

    const request = window.indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function readStoredPostcards() {
  const database = await openJournalDb()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
  })
}

async function persistPostcard(postcard) {
  const database = await openJournalDb()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(postcard)
    transaction.oncomplete = () => {
      database.close()
      resolve()
    }
    transaction.onerror = () => reject(transaction.error)
  })
}

async function removePostcard(id) {
  const database = await openJournalDb()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).delete(id)
    transaction.oncomplete = () => {
      database.close()
      resolve()
    }
    transaction.onerror = () => reject(transaction.error)
  })
}

function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) {
      reject(new Error('请选择一张照片'))
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      reject(new Error('照片有点大，请选择 15MB 以内的图片'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('照片读取失败，请重试'))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('这张照片暂时无法识别'))
      image.onload = () => {
        const maxEdge = 1800
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.84))
      }
      image.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

function todayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function moodFor(key) {
  return MOODS.find((mood) => mood.key === key) || MOODS[1]
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5h3l1.2-2h7.6l1.2 2h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3.5 11 8.5-7 8.5 7v8.5h-6v-5h-5v5h-6z" />
    </svg>
  )
}

function AlbumIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M8 3.5v17M11 16l2.5-3 2 2 1.5-2 2.7 3.5" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  )
}

function LeafMark() {
  return (
    <svg className="leaf-mark" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M39 7C22 8 10 16 9 30c8 4 19 1 25-7 4-5 5-10 5-16Z" />
      <path d="M10 39c5-10 13-17 24-23" />
    </svg>
  )
}

function FrogCompanion() {
  return (
    <svg className="frog-companion" viewBox="0 0 330 290" role="img" aria-label="戴着围巾、背着邮差包的原创青蛙旅伴">
      <ellipse className="frog-shadow" cx="168" cy="261" rx="94" ry="17" />
      <path className="frog-leg" d="M94 218c-28 8-43 24-39 35 5 14 57 8 77-10Z" />
      <path className="frog-leg" d="M229 218c29 8 44 24 39 35-5 14-57 8-77-10Z" />
      <ellipse className="frog-body" cx="163" cy="174" rx="76" ry="83" />
      <circle className="frog-eye-bump" cx="114" cy="93" r="35" />
      <circle className="frog-eye-bump" cx="212" cy="93" r="35" />
      <ellipse className="frog-face" cx="163" cy="123" rx="91" ry="70" />
      <circle className="frog-eye" cx="115" cy="91" r="12" />
      <circle className="frog-eye" cx="211" cy="91" r="12" />
      <circle className="frog-glint" cx="119" cy="87" r="4" />
      <circle className="frog-glint" cx="215" cy="87" r="4" />
      <path className="frog-mouth" d="M142 137c11 9 31 9 42 0" />
      <path className="frog-scarf" d="M91 159c42 18 99 18 143-2l-10 29c-42 15-82 15-123 1Z" />
      <path className="frog-scarf-tail" d="m211 178 37 22-25 42-25-55Z" />
      <path className="frog-strap" d="M102 164c52 18 85 41 105 81" />
      <rect className="frog-bag" x="159" y="202" width="73" height="50" rx="12" transform="rotate(-5 159 202)" />
      <path className="frog-bag-line" d="m164 218 34 14 31-18" />
      <circle className="frog-bag-button" cx="198" cy="231" r="4" />
      <path className="frog-arm" d="M105 178c-17 14-20 34-9 44 9 8 24-2 34-16" />
    </svg>
  )
}

function AppHeader({ view, setView, onCompose }) {
  return (
    <header className="waji-header">
      <a className="waji-brand" href="/" aria-label="返回 yuyuyuu 首页">
        <span className="waji-brand-mark"><LeafMark /></span>
        <span>
          <strong>蛙迹</strong>
          <small>WANDER NOTE</small>
        </span>
      </a>

      <nav className="waji-nav" aria-label="旅行照片日记">
        <button className={view === 'home' ? 'is-active' : ''} type="button" onClick={() => setView('home')}>
          <HomeIcon />
          <span>小窝</span>
        </button>
        <button className={view === 'album' ? 'is-active' : ''} type="button" onClick={() => setView('album')}>
          <AlbumIcon />
          <span>足迹</span>
        </button>
      </nav>

      <button className="header-compose" type="button" onClick={onCompose} aria-label="记录这一刻">
        <CameraIcon />
        <span>记录这一刻</span>
      </button>
    </header>
  )
}

function HomeView({ records, onCompose, onOpenPostcard }) {
  const latest = records[0]
  const places = new Set(records.map((record) => record.location.split('·')[0].trim())).size

  return (
    <main className="waji-main home-view">
      <section className="home-intro" aria-labelledby="home-title">
        <p className="eyebrow">{greeting()} · 旅伴正在小窝</p>
        <h1 id="home-title">今天也有值得<br />收藏的小事。</h1>
        <p className="home-lead">把照片交给苔苔，它会替你做成一张明信片。</p>
      </section>

      <section className="home-layout">
        <div className="room-card">
          <div className="room-sun" aria-hidden="true" />
          <div className="room-window" aria-hidden="true">
            <img src="/travel-postcards/mountain-camp.png" alt="" />
            <span className="window-frame window-frame-v" />
            <span className="window-frame window-frame-h" />
          </div>
          <div className="room-shelf" aria-hidden="true">
            <span className="shelf-book shelf-book-one" />
            <span className="shelf-book shelf-book-two" />
            <span className="shelf-pot" />
            <span className="shelf-leaf shelf-leaf-one" />
            <span className="shelf-leaf shelf-leaf-two" />
          </div>
          <div className="room-rug" aria-hidden="true" />
          <div className="frog-wrap"><FrogCompanion /></div>
          <div className="speech-card">
            <span className="status-dot" />
            <p>苔苔在家</p>
            <strong>“旅行包还装得下一张照片。”</strong>
          </div>
          <button className="room-compose" type="button" onClick={onCompose}>
            <span className="room-compose-icon"><CameraIcon /></span>
            <span>
              <strong>记录这一刻</strong>
              <small>照片只保存在这台设备</small>
            </span>
            <span className="button-arrow">↗</span>
          </button>
        </div>

        <aside className="home-sidebar" aria-label="旅行记录概览">
          <div className="postcard-preview-wrap">
            <div className="postcard-label-row">
              <span>最新明信片</span>
              <span>{String(records.length).padStart(2, '0')} / COLLECTION</span>
            </div>
            <button className="latest-postcard" type="button" onClick={() => onOpenPostcard(latest)}>
              <img src={latest.photo} alt={latest.title} />
              <span className="postcard-stamp">蛙迹<br /><b>2026</b></span>
              <span className="postcard-copy">
                <small>{formatDate(latest.date)}</small>
                <strong>{latest.title}</strong>
                <span><PinIcon />{latest.location}</span>
              </span>
            </button>
            <p className="postcard-nudge">点击明信片，看看苔苔写在背面的话。</p>
          </div>

          <div className="journey-stats">
            <div>
              <strong>{records.length}</strong>
              <span>收藏瞬间</span>
            </div>
            <i />
            <div>
              <strong>{places}</strong>
              <span>走过地方</span>
            </div>
            <i />
            <div>
              <strong>{MOODS.filter((mood) => records.some((record) => record.mood === mood.key)).length}</strong>
              <span>不同心情</span>
            </div>
          </div>

          <div className="quiet-note">
            <span className="quiet-note-mark">✦</span>
            <div>
              <small>今日小签</small>
              <p>慢一点，才听得见风景在说什么。</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

function AlbumView({ records, filter, setFilter, loading, onOpenPostcard, onCompose }) {
  const filteredRecords = filter === 'all'
    ? records
    : records.filter((record) => record.mood === filter)

  return (
    <main className="waji-main album-view">
      <section className="album-heading">
        <div>
          <p className="eyebrow">POSTCARDS FROM THE ROAD</p>
          <h1>苔苔带回的足迹</h1>
          <p>每一张照片，都是时间寄给你的明信片。</p>
        </div>
        <button className="album-compose" type="button" onClick={onCompose}>
          <CameraIcon /> 放入新照片
        </button>
      </section>

      <div className="album-toolbar">
        <div className="filter-list" role="group" aria-label="按心情筛选">
          <button className={filter === 'all' ? 'is-active' : ''} type="button" onClick={() => setFilter('all')}>
            全部 <span>{records.length}</span>
          </button>
          {MOODS.map((mood) => (
            <button
              className={filter === mood.key ? 'is-active' : ''}
              type="button"
              key={mood.key}
              onClick={() => setFilter(mood.key)}
            >
              <i>{mood.symbol}</i>{mood.label}
            </button>
          ))}
        </div>
        <span className="storage-note"><i /> 本地私人相册</span>
      </div>

      {loading ? (
        <div className="album-loading" aria-live="polite">正在翻开旅行册…</div>
      ) : filteredRecords.length ? (
        <section className="postcard-grid" aria-label="旅行明信片">
          {filteredRecords.map((postcard, index) => {
            const mood = moodFor(postcard.mood)
            return (
              <button
                className={`album-card card-${(index % 3) + 1}`}
                type="button"
                key={postcard.id}
                onClick={() => onOpenPostcard(postcard)}
              >
                <span className="album-photo-wrap">
                  <img src={postcard.photo} alt={postcard.title} />
                  <span className="album-mood" aria-label={`心情：${mood.label}`}>{mood.symbol}</span>
                </span>
                <span className="album-card-copy">
                  <small>{formatDate(postcard.date)}</small>
                  <strong>{postcard.title}</strong>
                  <span className="album-location"><PinIcon />{postcard.location}</span>
                  <span className="album-note">{postcard.note || '这一刻没有文字，照片已经记住了。'}</span>
                </span>
              </button>
            )
          })}
        </section>
      ) : (
        <section className="album-empty">
          <LeafMark />
          <h2>这一格还是空的</h2>
          <p>换一种心情看看，或者收藏一个新瞬间。</p>
          <button type="button" onClick={onCompose}>记录这一刻</button>
        </section>
      )}
    </main>
  )
}

function Composer({ onClose, onSave }) {
  const today = todayString()
  const [form, setForm] = useState({
    photo: '',
    date: today,
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
    <div className="modal-backdrop composer-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title">
        <div className="composer-head">
          <div>
            <p className="eyebrow">PACK A MEMORY</p>
            <h2 id="composer-title">装进一段今天</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="关闭" autoFocus>×</button>
        </div>

        <form onSubmit={submit}>
          <div
            className={`photo-dropzone ${form.photo ? 'has-photo' : ''}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              acceptPhoto(event.dataTransfer.files?.[0])
            }}
          >
            {form.photo ? (
              <>
                <img src={form.photo} alt="待保存照片预览" />
                <button type="button" onClick={() => fileRef.current?.click()}>换一张照片</button>
              </>
            ) : (
              <button className="dropzone-button" type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy}>
                <span><CameraIcon /></span>
                <strong>{photoBusy ? '正在整理照片…' : '放入一张今天的照片'}</strong>
                <small>点击选择，或把照片拖到这里</small>
              </button>
            )}
            <input
              ref={fileRef}
              className="visually-hidden"
              type="file"
              accept="image/*"
              onChange={(event) => acceptPhoto(event.target.files?.[0])}
            />
          </div>

          <div className="composer-fields">
            <label>
              <span>日期</span>
              <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
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

          <fieldset className="mood-picker">
            <legend>这一刻的心情</legend>
            <div>
              {MOODS.map((mood) => (
                <button
                  className={form.mood === mood.key ? 'is-active' : ''}
                  type="button"
                  key={mood.key}
                  onClick={() => setForm({ ...form, mood: mood.key })}
                  aria-pressed={form.mood === mood.key}
                >
                  <i>{mood.symbol}</i>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="note-field">
            <span>随手写 <small>可不写</small></span>
            <textarea
              value={form.note}
              rows="3"
              maxLength="120"
              placeholder="风很轻，路边的花刚好开着……"
              onChange={(event) => setForm({ ...form, note: event.target.value })}
            />
            <i>{form.note.length}/120</i>
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="composer-actions">
            <p><span>●</span> 照片不会离开你的浏览器</p>
            <button type="submit" disabled={saving || photoBusy}>
              {saving ? '正在制作明信片…' : '装进旅行包'} <span>→</span>
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
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="postcard-detail" role="dialog" aria-modal="true" aria-labelledby="postcard-detail-title">
        <button className="modal-close detail-close" type="button" onClick={onClose} aria-label="关闭" autoFocus>×</button>
        <div className="detail-photo">
          <img src={postcard.photo} alt={postcard.title} />
          <span className="detail-photo-label">{formatDate(postcard.date)}</span>
        </div>
        <div className="detail-copy">
          <div className="detail-kicker">
            <span>POSTCARD · {mood.label}</span>
            <i>{mood.symbol}</i>
          </div>
          <h2 id="postcard-detail-title">{postcard.title}</h2>
          <p className="detail-location"><PinIcon />{postcard.location}</p>
          <p className="detail-note">{postcard.note || '这一刻没有留下文字，照片已经替你记住了。'}</p>
          <div className="detail-signature">
            <span><LeafMark /></span>
            <p>替你收好啦<br /><strong>你的旅伴 · 苔苔</strong></p>
          </div>
          {postcard.userCreated && (
            <div className="detail-actions">
              {confirmDelete ? (
                <div className="delete-confirm">
                  <p>确定让这张明信片离开旅行包吗？</p>
                  <button type="button" onClick={() => setConfirmDelete(false)}>再想想</button>
                  <button className="danger-button" type="button" onClick={() => onDelete(postcard.id)}>确定删除</button>
                </div>
              ) : (
                <button className="delete-link" type="button" onClick={() => setConfirmDelete(true)}>删除这张记录</button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function Arrival({ postcard, onOpen, onClose }) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="arrival-layer" role="dialog" aria-modal="true" aria-labelledby="arrival-title">
      <div className="arrival-glow" />
      <div className="arrival-envelope">
        <span className="envelope-flap" />
        <img src={postcard.photo} alt="新明信片预览" />
      </div>
      <div className="arrival-copy">
        <span>✦ NEW POSTCARD</span>
        <h2 id="arrival-title">新明信片到了</h2>
        <p>苔苔已经替你把这一刻收好。</p>
        <div>
          <button type="button" onClick={onClose}>晚点再看</button>
          <button className="arrival-primary" type="button" onClick={onOpen} autoFocus>拆开看看</button>
        </div>
      </div>
    </div>
  )
}

export default function Travel() {
  const [view, setView] = useState('home')
  const [userPostcards, setUserPostcards] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [composerOpen, setComposerOpen] = useState(false)
  const [detailPostcard, setDetailPostcard] = useState(null)
  const [arrival, setArrival] = useState(null)

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
    return () => { active = false }
  }, [])

  useEffect(() => {
    const modalOpen = composerOpen || detailPostcard || arrival
    document.body.classList.toggle('has-modal', Boolean(modalOpen))
    return () => document.body.classList.remove('has-modal')
  }, [composerOpen, detailPostcard, arrival])

  const records = useMemo(
    () => [...userPostcards, ...SEED_POSTCARDS].sort((a, b) => b.date.localeCompare(a.date)),
    [userPostcards],
  )

  const savePostcard = async (form) => {
    const postcard = {
      id: window.crypto?.randomUUID?.() || `postcard-${Date.now()}`,
      photo: form.photo,
      date: form.date,
      location: form.location.trim() || '未命名的远方',
      mood: form.mood,
      title: form.location.trim() ? `${form.location.trim().split('·')[0].trim()}的一刻` : '路上捡到的一刻',
      note: form.note.trim(),
      userCreated: true,
      createdAt: Date.now(),
    }
    await persistPostcard(postcard)
    setUserPostcards((current) => [postcard, ...current])
    setComposerOpen(false)
    setArrival(postcard)
  }

  const deletePostcard = async (id) => {
    await removePostcard(id)
    setUserPostcards((current) => current.filter((postcard) => postcard.id !== id))
    setDetailPostcard(null)
  }

  return (
    <div className="waji-app">
      <AppHeader view={view} setView={setView} onCompose={() => setComposerOpen(true)} />

      {view === 'home' ? (
        <HomeView records={records} onCompose={() => setComposerOpen(true)} onOpenPostcard={setDetailPostcard} />
      ) : (
        <AlbumView
          records={records}
          filter={filter}
          setFilter={setFilter}
          loading={loading}
          onOpenPostcard={setDetailPostcard}
          onCompose={() => setComposerOpen(true)}
        />
      )}

      <footer className="waji-footer">
        <span><LeafMark /> 蛙迹</span>
        <p>把世界走成一本慢慢变厚的相册。</p>
        <a href="/">返回 yuyuyuu 的首页 ↗</a>
      </footer>

      {composerOpen && <Composer onClose={() => setComposerOpen(false)} onSave={savePostcard} />}
      {detailPostcard && (
        <PostcardDetail postcard={detailPostcard} onClose={() => setDetailPostcard(null)} onDelete={deletePostcard} />
      )}
      {arrival && (
        <Arrival
          postcard={arrival}
          onClose={() => setArrival(null)}
          onOpen={() => {
            setArrival(null)
            setDetailPostcard(arrival)
          }}
        />
      )}
    </div>
  )
}
