import { useEffect, useState } from 'react'
import ProjectCard from '../components/ProjectCard.jsx'
import PageMasthead from '../components/PageMasthead.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import SiteFrame from '../components/SiteChrome.jsx'
import { projects, projectViews, matchesProjectView, sortProjects } from '../data/projects.js'

function readView() {
  const view = new URLSearchParams(window.location.search).get('view')
  return projectViews.some((item) => item.id === view) ? view : 'all'
}

function ProjectsHero({ view }) {
  const isMvp = view === 'mvp'

  return (
    <PageMasthead
      page="projects"
      eyebrow={isMvp ? 'PRODUCT LAB / MVP WORKBENCH' : 'PRODUCT LAB / INDEX'}
      title={isMvp ? ['MVP', 'Lab.'] : ['Things I', 'build.']}
      description={
        isMvp
          ? '正在构建的最小可用版本。把核心目标、当前状态和可以体验的入口放在一起。'
          : '产品、工具与短期实验。从构想到 MVP，再到上线，记录每件作品所处的阶段。'
      }
      aside={(
        <>
          <span className="page-masthead__aside-index">FIELD NOTE / 01</span>
          <p>Building things I want to exist.</p>
          {isMvp ? (
            <small>每个 MVP 只回答一个问题：它要为谁解决什么，下一步做什么。</small>
          ) : (
            <a className="text-link" href="/projects?view=mvp">
              MVP 工作台 <span aria-hidden="true">→</span>
            </a>
          )}
          {!isMvp && <small>查看正在做的产品，以及它们迈向第一个可用版本的过程。</small>}
        </>
      )}
    />
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
    <SiteFrame current="projects">
      <main className="projects-page page-main" id="main-content" tabIndex="-1">
        <ProjectsHero view={activeFilter} />

        <section className="projects-index editorial-section" aria-labelledby="project-index-title">
          <SectionHeading
            id="project-index-title"
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
