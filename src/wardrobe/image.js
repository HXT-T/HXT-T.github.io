// ============================================
// 照片处理 —— 原图动辄几 MB，存进浏览器之前先压一压
// 长边压到 720px 的 JPEG，一件大约 60~120KB
// ============================================
const MAX_SIDE = 720
const QUALITY = 0.82

async function loadBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      // from-image 让手机竖拍的照片不会躺倒
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      /* 老浏览器不认这个选项，走下面的 Image 兜底 */
    }
  }
  const url = URL.createObjectURL(file)
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('图片读取失败'))
      image.src = url
    })
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }
}

export async function compressImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('请选择图片文件')
  }
  const source = await loadBitmap(file)
  const width = source.width || source.naturalWidth
  const height = source.height || source.naturalHeight
  const scale = Math.min(1, MAX_SIDE / Math.max(width, height))

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  const ctx = canvas.getContext('2d')
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  source.close?.()

  return canvas.toDataURL('image/jpeg', QUALITY)
}
