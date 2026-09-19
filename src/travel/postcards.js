// 旅行明信片的数据层：示例数据、心情表、本地存储与照片压缩。
// 页面只负责展示，读写都走这里。
export const SEED_POSTCARDS = [
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

export const MOODS = [
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

export async function readStoredPostcards() {
  const database = await openJournalDb()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
  })
}

export async function persistPostcard(postcard) {
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

export async function removePostcard(id) {
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

export function resizePhoto(file) {
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

export function todayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function moodFor(key) {
  return MOODS.find((mood) => mood.key === key) || MOODS[1]
}
