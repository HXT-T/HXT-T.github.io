import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import SiteFrame from '../components/SiteChrome.jsx'
import { projects, projectViews, matchesProjectView, sortProjects } from '../data/projects.js'

function readView() {
  const view = new URLSearchParams(window.location.search).get('view')
  return projectViews.some((item) => item.id === view) ? view : 'all'
}

function ProjectsHero({ view }) {
  return (
    <section className="projects-hero" aria-labelledby="projects-title">
      <div className="projects-hero__copy">
        <div className="projects-hero__meta">
          <span>{view === 'mvp' ? 'PRODUCT LAB / MVP WORKBENCH' : 'PRODUCT LAB / INDEX'}</span>
          <span>ACTIVE + UNFINISHED</span>
        </div>
        <h1 id="projects-title">
          <span>{view === 'mvp' ? 'MVP' : 'Things I'}</span>
          <span>{view === 'mvp' ? 'Lab.' : 'build.'}</span>
        </h1>
        <p>
          {view === 'mvp' ? '正在构建的最小可用版本。把核心目标、当前状态和可以体验的入口放在一起。' : '产品、工具与短期实验。从构想到 MVP，再到上线，记录每件作品所处的阶段。'}
        </p>
      </div>

      <aside className="projects-hero__note" aria-label="当前构建状态">
        <span className="projects-hero__note-index">FIELD NOTE / 01</span>
        <p>Building things I want to exist.</p>
        <a className="text-link" href="/projects?view=mvp">
          MVP 工作台 <span aria-hidden="true">→</span>
        </a>
        <small>查看正在做的产品，以及它们迈向第一个可用版本的过程。</small>
      </aside>
    </section>
  )
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState(readView)
  useEffect(() => {
    const sync = () => setActiveFilter(readView())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  const selectView = (view) => {
    if (view === activeFilter) return
    const url = new URL(window.location.href)
    if (view === 'all') url.searchParams.delete('view')
    else url.searchParams.set('view', view)
    url.hash = ''
    window.history.pushState({}, '', url)
    setActiveFilter(view)
  }
  const currentView = projectViews.find((view) => view.id === activeFilter)
  useEffect(() => {
    document.title = `${currentView.label} · Product Lab · yuyuyuu`
  }, [currentView])
  const orderedProjects = sortProjects(projects)
  const visibleProjects = orderedProjects.filter((project) =>
    matchesProjectView(project, activeFilter),
  )

  return (
    <SiteFrame current="projects" footerIndex="02 / COLOPHON">
      <main className="projects-page" id="main-content" tabIndex="-1">
        <ProjectsHero view={activeFilter} />

        <section className="projects-index editorial-section" aria-labelledby="project-index-title">
          <SectionHeading
            id="project-index-title"
            index="01"
            eyebrow="PROJECT INDEX"
            title={currentView.label}
            description={currentView.description}
          />

          <div className="project-filters">
            <div className="project-filter-list" aria-label="筛选项目">
              {projectViews.map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  aria-pressed={activeFilter === filter.id}
                  aria-controls="project-grid"
                  onClick={() => selectView(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <p aria-live="polite">
              SHOWING {String(visibleProjects.length).padStart(2, '0')} /{' '}
              {String(projects.length).padStart(2, '0')}
            </p>
          </div>

          {visibleProjects.length > 0 ? (
            <div className="project-grid" id="project-grid">
              {visibleProjects.map((project) => (
                <div
                  className={`project-grid__item${project.featured ? ' project-grid__item--featured' : ''}`}
                  id={project.id}
                  key={project.id}
                >
                  <ProjectCard
                    project={project}
                    variant={project.featured ? 'featured' : 'normal'}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="projects-empty" id="project-grid" role="status">
              <span>EMPTY SHELF / FOR NOW</span>
              <p>这里暂时没有项目。新的实验会在准备好以后自然长进来。</p>
            </div>
          )}
        </section>
      </main>
    </SiteFrame>
  )
}
