import { useEffect, useMemo, useRef, useState } from 'react'
import { pages } from '../data/navigation.js'
import { projects } from '../data/projects.js'
import { posts } from '../blog/posts.js'
import { formatDate } from '../format.js'

// 全站索引：页面 + 文章 + 项目。⌘K / Ctrl+K / "/" 打开。
const ENTRIES = [
  ...pages.map((page) => ({
    group: 'PAGES',
    id: `page-${page.id}`,
    index: page.index,
    label: `${page.name} · ${page.label}`,
    hint: page.href,
    href: page.href,
    haystack: `${page.name} ${page.label} ${page.href}`,
  })),
  ...posts.map((post, i) => ({
    group: 'WRITING',
    id: `post-${post.slug}`,
    index: String(i + 1).padStart(2, '0'),
    label: post.title,
    hint: formatDate(post.date),
    href: `/blog?post=${encodeURIComponent(post.slug)}`,
    haystack: `${post.title} ${post.category} ${post.excerpt}`,
  })),
  ...projects
    .filter((project) => !project.archived)
    .map((project, i) => ({
      group: 'LAB',
      id: `project-${project.id}`,
      index: String(i + 1).padStart(2, '0'),
      label: project.name,
      hint: project.status,
      href: `/projects#${project.id}`,
      haystack: `${project.name} ${project.category} ${project.description} ${project.tags?.join(' ')}`,
    })),
]

export default function CommandPalette({ open, onClose }) {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ENTRIES
    return ENTRIES.filter((entry) => entry.haystack.toLowerCase().includes(q))
  }, [query])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery('')
      setActive(0)
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    dialogRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter' && results[active]) {
      event.preventDefault()
      window.location.href = results[active].href
    }
  }

  let lastGroup = null

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="站内索引"
      onClose={onClose}
      onMouseDown={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className="palette-search">
        <span aria-hidden="true">›</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="搜索页面、文章、项目……"
          aria-label="搜索全站"
          aria-controls="palette-results"
          aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
          role="combobox"
          aria-expanded="true"
          autoComplete="off"
        />
        <kbd>ESC</kbd>
      </div>

      {results.length > 0 ? (
        <ul className="palette-list" id="palette-results" role="listbox">
          {results.map((entry, i) => {
            const heading = entry.group !== lastGroup ? entry.group : null
            lastGroup = entry.group
            return (
              <li
                key={entry.id}
                id={`palette-${entry.id}`}
                className="palette-item"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
              >
                {heading && <div className="palette-group" aria-hidden="true">{heading}</div>}
                <a href={entry.href} tabIndex="-1">
                  <span className="palette-item__index">{entry.index}</span>
                  <span className="palette-item__label">{entry.label}</span>
                  <span className="palette-item__hint">{entry.hint}</span>
                </a>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="palette-empty">没有找到「{query}」，换个词试试。</p>
      )}

      <div className="palette-foot" aria-hidden="true">
        <span><kbd>↑</kbd> <kbd>↓</kbd> 选择</span>
        <span><kbd>↵</kbd> 打开</span>
      </div>
    </dialog>
  )
}
