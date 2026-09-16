// ============================================
// 衣橱的本地存储 —— IndexedDB
// 照片压缩后以 dataURL 存在单品里，体积可能上兆，
// 所以不用 localStorage（5MB 上限）而用 IndexedDB。
// 浏览器禁用 IndexedDB（隐私模式等）时退回内存，页面仍可用，只是刷新即丢。
// ============================================
const DB_NAME = 'yuyu-wardrobe'
const DB_VERSION = 1
export const STORE_ITEMS = 'items'
export const STORE_OUTFITS = 'outfits'

let dbPromise = null
let memoryMode = false
const memory = { [STORE_ITEMS]: new Map(), [STORE_OUTFITS]: new Map() }

function openDB() {
  if (memoryMode) return Promise.reject(new Error('memory mode'))
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    let request
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION)
    } catch (error) {
      reject(error)
      return
    }
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_ITEMS)) {
        db.createObjectStore(STORE_ITEMS, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(STORE_OUTFITS)) {
        db.createObjectStore(STORE_OUTFITS, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('indexedDB blocked'))
  }).catch((error) => {
    dbPromise = null
    memoryMode = true
    throw error
  })

  return dbPromise
}

function run(storeName, mode, action) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode)
        const result = action(tx.objectStore(storeName))
        tx.oncomplete = () => resolve(result?.result ?? result)
        tx.onerror = () => reject(tx.error)
        tx.onabort = () => reject(tx.error)
      }),
  )
}

/** 存储是否降级成了内存模式（用于给用户一句提示） */
export function isMemoryMode() {
  return memoryMode
}

export async function readAll(storeName) {
  try {
    return (await run(storeName, 'readonly', (store) => store.getAll())) || []
  } catch {
    return [...memory[storeName].values()]
  }
}

// 内存模式下写不进数据库是预期内的（已经写进 memory），其它错误要抛出去：
// 照片攒多了可能把浏览器配额撑爆，这种失败必须让用户看见
async function guardedRun(storeName, action) {
  try {
    await run(storeName, 'readwrite', action)
  } catch (error) {
    if (memoryMode) return
    throw error
  }
}

export async function writeOne(storeName, value) {
  memory[storeName].set(value.id, value)
  await guardedRun(storeName, (store) => store.put(value))
  return value
}

export async function writeMany(storeName, values) {
  if (!values.length) return values
  values.forEach((value) => memory[storeName].set(value.id, value))
  await guardedRun(storeName, (store) => {
    values.forEach((value) => store.put(value))
  })
  return values
}

export async function removeOne(storeName, id) {
  memory[storeName].delete(id)
  await guardedRun(storeName, (store) => store.delete(id))
}

export async function clearStore(storeName) {
  memory[storeName].clear()
  await guardedRun(storeName, (store) => store.clear())
}
