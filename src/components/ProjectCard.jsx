import { PROJECT_STATUSES } from '../data/projects.js'

const CARD_VARIANTS = new Set(['featured', 'normal', 'compact'])

function humanizeStatus(status) {
  if (!status) return 'Status pending'

  return status
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function getStatusMeta(status) {
  return PROJECT_STATUSES[status] ?? {
    label: humanizeStatus(status),
    symbol: '○',
  }
}

function ProjectAction({ available, href, children, unavailableLabel, external = false }) {
  if (!available || !href) {
    return (
      <span className="project-card__action project-card__action--disabled" aria-disabled="true">
        {unavailableLabel}
      </span>
    )
  }

  return (
    <a
      className="project-card__action text-link"
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  )
}

export function ProjectVisual({ project }) {
  if (project.image?.src) {
    return (
      <div className="project-card__visual">
        <img
          src={project.image.src}
          alt={project.image.alt || `${project.name} 项目预览`}
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  return (
    <div className="project-card__visual project-card__visual--type" aria-hidden="true">
      <span>{project.category}</span>
      <strong>{project.name}</strong>
    </div>
  )
}

export default function ProjectCard({ project, variant }) {
  if (!project) return null

  const fallbackVariant = project.featured ? 'featured' : 'normal'
  const cardVariant = CARD_VARIANTS.has(variant) ? variant : fallbackVariant
  const status = getStatusMeta(project.status)
  const titleId = `project-${project.id}-title`

  return (
    <article
      className={`project-card project-card--${cardVariant}`}
      data-project-type={project.type}
      data-project-status={project.status}
      aria-labelledby={titleId}
    >
      {cardVariant !== 'compact' && <ProjectVisual project={project} />}

      <div className="project-card__body">
        <div className="project-card__meta">
          <span>{project.category}</span>
          <span
            className={`project-card__status work-status project-card__status--${project.status}`}
            aria-label={`项目状态：${status.label}`}
          >
            <span aria-hidden="true">{status.symbol}</span>
            {status.label}
          </span>
        </div>

        <h3 className="project-card__title" id={titleId}>{project.name}</h3>
        <p className="project-card__description">{project.description}</p>

        {project.stage === 'mvp' && (project.mvpGoal || project.nextStep) && (
          <dl className="project-card__mvp">
            {project.mvpGoal && <div><dt>MVP 目标</dt><dd>{project.mvpGoal}</dd></div>}
            {project.nextStep && <div><dt>下一步</dt><dd>{project.nextStep}</dd></div>}
          </dl>
        )}

        {project.tags?.length > 0 && (
          <ul className="project-card__tags" aria-label="项目关键词">
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        )}

        {project.updatedAt && (
          <p className="project-card__updated">
            Updated <time dateTime={project.updatedAt}>{project.updatedAt}</time>
          </p>
        )}

        <div className="project-card__actions" aria-label={`${project.name} 项目链接`}>
          <ProjectAction
            available={project.demoAvailable}
            href={project.demoUrl}
            unavailableLabel="Demo 尚未开放"
          >
            Live demo
          </ProjectAction>
          <ProjectAction
            available={project.githubAvailable}
            href={project.githubUrl}
            unavailableLabel="GitHub 尚未公开"
            external
          >
            GitHub
          </ProjectAction>
        </div>

        <details className="project-card__details">
          <summary>
            <span>项目详情</span>
            <span aria-hidden="true">+</span>
          </summary>
          <div className="project-card__details-copy">
            <p>{project.details || project.description}</p>
          </div>
        </details>
      </div>
    </article>
  )
}
