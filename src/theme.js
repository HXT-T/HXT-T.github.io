// 主题：默认深色（夜樱档案），访客切到浅色后记在 localStorage。
// 首屏闪烁由每个入口 html <head> 里的一行内联脚本避免，这里只负责切换。
const STORAGE_KEY = 'theme'
const THEME_COLORS = { dark: '#0e0b0d', light: '#f8f4f1' }

export function currentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[theme])
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // 隐私模式下存不了，本次访问仍然生效
  }
}
