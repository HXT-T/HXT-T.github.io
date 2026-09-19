// 全站共用的小格式化函数。
// 日期统一显示成 2026.08.08：首页、写作、瞬间、旅行都走这里，
// 从前每个页面各写一份（或者干脆直接显示 2026-08-08）。
export function formatDate(date) {
  return date ? date.replaceAll('-', '.') : ''
}
