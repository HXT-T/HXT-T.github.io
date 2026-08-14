import { useMemo, useState } from 'react'
import ProjectCard from '../components/ProjectCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import SiteFrame from '../components/SiteChrome.jsx'
import { projects } from '../data/projects.js'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'products', label: 'Products' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'ai', label: 'AI' },
  { id: 'tools', label: 'Tools' },
  { id: 'archived', label: 'Archived' },
]

function matchesFilter(project, filter) {
  if (filter === 'all') return !project.archived
  if (filter === 'products') return project.type === 'product' && !project.archived
  if (filter === 'experiments') return project.type === 'experiment' && !project.archived
  if (filter === 'tools') return project.type === 'tool' && !project.archived
  if (filter === 'archived') return project.archived
  if (filter === 'ai') {
    return (
      !project.archived &&
      [project.category, ...(project.tags ?? [])].some((value) =>
        value.toLowerCase().includes('ai'),
      )
    )
  }
  return true
}

function ProjectsHero() {
  return (
    <section className="projects-hero" aria-labelledby="projects-title">
      <div className="projects-hero__copy">
        <div className="projects-hero__meta">
          <span>PRODUCT LAB / INDEX</span>
          <span>ACTIVE + UNFINISHED</span>
        </div>
        <h1 id="projects-title">
          <span>Things I</span>
          <span>build.</span>
        </h1>
        <p>
          产品、工具与短期实验。这里不展示一份完成清单，而是记录想法如何慢慢获得形状。
        </p>
      </div>

      <aside className="projects-hero__note" aria-label="当前构建状态">
        <span className="projects-hero__note-index">FIELD NOTE / 01</span>
        <p>Building things I want to exist.</p>
        <a className="text-link" href="#ai-idol">
          Currently building · AI Idol Trainer <span aria-hidden="true">↓</span>
        </a>
        <small>尚未开放的 Demo 会安静地留在工作台上，不把访客送进 404。</small>
      </aside>
    </section>
  )
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all')
  const orderedProjects = useMemo(
    () =>
      [...projects].sort(
        (a, b) => (b.activityRank ?? 0) - (a.activityRank ?? 0),
      ),
    [],
  )
  const visibleProjects = orderedProjects.filter((project) =>
    matchesFilter(project, activeFilter),
  )

  return (
    <SiteFrame current="projects" footerIndex="02 / COLOPHON">
      <main className="projects-page" id="main-content" tabIndex="-1">
        <ProjectsHero />

        <section className="projects-index editorial-section" aria-labelledby="project-index-title">
          <SectionHeading
            index="01"
            eyebrow="PROJECT INDEX"
            title="工作台上的项目"
            description="按当前活跃程度排列。筛选只改变视图，项目本身始终来自同一份数据。"
          />

          <div className="project-filters">
            <div className="project-filter-list" aria-label="筛选项目">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  aria-pressed={activeFilter === filter.id}
                  aria-controls="project-grid"
                  onClick={() => setActiveFilter(filter.id)}
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
