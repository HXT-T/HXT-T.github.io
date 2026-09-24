import { useEffect, useRef, useState } from 'react'
import { about, footer, home, site } from '../data.js'
import { indexPages, mastheadPages, pageSignature } from '../data/navigation.js'
import { applyTheme, currentTheme } from '../theme.js'
import CommandPalette from './CommandPalette.jsx'

function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme)
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="tool-button"
      aria-label={next === 'light' ? '切换到浅色' : '切换到深色'}
      title={next === 'light' ? '日间版' : '夜樱版'}
      onClick={() => {
        applyTheme(next)
        setTheme(next)
      }}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M20 14.6A8 8 0 1 1 9.4 4a6.4 6.4 0 0 0 10.6 10.6Z" />
        </svg>
      )}
    </button>
  )
}

export function SiteHeader({ current, onOpenAbout, onOpenPalette }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const openAbout = () => {
    closeMenu()
    onOpenAbout()
  }

  return (
    <header className="site-header">
      <a
        className="site-wordmark"
        href={current === 'home' ? '#main-content' : '/'}
        aria-label={`${site.nickname} 首页`}
      >
        <span>{site.nickname}</span>
        <i aria-hidden="true" />
        <small aria-hidden="true">hxt</small>
      </a>

      <nav
        className={`primary-nav${menuOpen ? ' is-open' : ''}`}
        id="primary-navigation"
        aria-label="站点导航"
      >
        <a
          href={current === 'home' ? '#main-content' : '/'}
          aria-current={current === 'home' ? 'page' : undefined}
          onClick={closeMenu}
        >
          Home
        </a>
        {mastheadPages.map((item) => (
          <a
            className={item.priority ? 'nav-priority' : undefined}
            href={item.href}
            key={item.id}
            aria-current={item.id === current ? 'page' : undefined}
            onClick={closeMenu}
          >
            {item.name}
          </a>
        ))}
        <button type="button" onClick={openAbout}>
          About
        </button>
        <a
          className="nav-github"
          href={site.githubUrl}
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
        >
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <div className="header-tools">
        <button
          type="button"
          className="tool-button tool-button--search"
          onClick={onOpenPalette}
          aria-label="搜索全站（快捷键 Ctrl K）"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <span>Index</span>
          <kbd>⌘K</kbd>
        </button>
        <ThemeToggle />
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          <span className="menu-glyph" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>
    </header>
  )
}

export function AboutModal({ onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    const dialog = dialogRef.current
    const backgroundElements = [
      ...document.querySelectorAll('#root > :not(.modal-backdrop)'),
    ]
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = [...dialog.querySelectorAll(focusableSelector)]
      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    backgroundElements.forEach((element) => element.setAttribute('inert', ''))
    dialog.querySelector('.modal-close')?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      backgroundElements.forEach((element) => element.removeAttribute('inert'))

      const menuToggle = document.querySelector('.menu-toggle')
      const previousFocusWasInMenu = previousFocus?.closest?.('#primary-navigation')
      const previousFocusIsVisible =
        previousFocus instanceof HTMLElement &&
        window.getComputedStyle(previousFocus).visibility !== 'hidden'

      if (previousFocusWasInMenu && menuToggle) {
        menuToggle.focus()
      } else if (previousFocusIsVisible) {
        previousFocus.focus()
      } else {
        menuToggle?.focus()
      }
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="about-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-heading"
        aria-describedby="about-description"
        tabIndex="-1"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="about-dialog-topline">
          <span>ABOUT / COLOPHON</span>
          <button type="button" className="modal-close" onClick={onClose}>
            <span>Close</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="about-dialog-layout">
          <div className="about-mark" aria-hidden="true">
            <img src="/logo.jpg" alt="" />
            <span>YUYUYUU</span>
          </div>
          <div className="about-copy">
            <h2 id="about-heading">{about.heading}</h2>
            <div id="about-description">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="about-tags" aria-label="关注的主题">
              {about.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export function SiteFooter({ current }) {
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <p>
          继续写，继续做，<br />
          也继续成为<em>美好本身</em>。
        </p>
        <span className="footer-signature">— {site.nickname}, {pageSignature(current).toLowerCase()}</span>
      </div>

      {/* 页脚是全站的完整索引：顶栏只放固定栏目，这里放每一个页面 */}
      <nav className="footer-links" aria-label="全部页面">
        {indexPages.map((page) => (
          <a
            href={page.href}
            key={page.id}
            aria-current={page.id === current ? 'page' : undefined}
          >
            <span className="footer-link-index" aria-hidden="true">
              {page.index}
            </span>
            {page.name}
          </a>
        ))}
        <a href={site.githubUrl} target="_blank" rel="noreferrer">
          <span className="footer-link-index" aria-hidden="true">
            ↗
          </span>
          GitHub
        </a>
      </nav>

      <div className="footer-bottom">
        <div className="footer-seal" aria-hidden="true">
          <img src="/logo.jpg" alt="" />
        </div>
        <p>{footer.copyright} · HAND-TENDED WITH REACT + VITE</p>
        <p>{home.issue} · {home.issueDate}</p>
      </div>
    </footer>
  )
}

// 全站唯一的页面外壳：跳转链接 + 顶栏 + 内容 + 页脚 + 关于弹窗。
// current 是 src/data/navigation.js 里的页面 id。
export default function SiteFrame({ current, children }) {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // ⌘K / Ctrl+K 随时打开索引；不在输入框里时 "/" 也可以
  useEffect(() => {
    const onKey = (event) => {
      const typing = event.target.closest?.('input, textarea, select, [contenteditable="true"]')
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      } else if (event.key === '/' && !typing) {
        event.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <SiteHeader
        current={current}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      {children}
      <SiteFooter current={current} />
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
