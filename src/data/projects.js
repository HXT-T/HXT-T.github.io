// Product Lab 的单一数据源。
// 未确认可访问性的链接必须同时保留对应的 *Available: false。
export const PROJECT_STATUSES = Object.freeze({
  live: { label: 'Live', symbol: '●' },
  building: { label: 'Building', symbol: '◐' },
  concept: { label: 'Concept', symbol: '○' },
  experiment: { label: 'Experiment', symbol: '◇' },
  archived: { label: 'Archived', symbol: '—' },
})

export const projects = [
  {
    id: 'ai-idol',
    stage: 'mvp',
    mvpGoal: '把个人训练方向整理成可执行的日常训练计划。',
    nextStep: '',
    name: 'AI Idol Trainer',
    description: 'AI-powered personal idol development system.',
    details: '围绕外形、体能、舞蹈、声乐、镜头表现、个人品牌与日常训练持续构建。',
    type: 'product',
    category: 'AI Product',
    status: 'building',
    activityRank: 100,
    featured: true,
    archived: false,
    updatedAt: '',
    tags: ['AI', 'Training', 'Lifestyle'],
    image: null,
    demoAvailable: false,
    demoUrl: 'https://hxt-t.github.io/ai-idol/',
    githubAvailable: false,
    githubUrl: '',
  },
  {
    id: 'kimipet',
    stage: 'mvp',
    mvpGoal: '让桌面宠物承载对话、记忆与日常提醒。',
    nextStep: '',
    name: 'KimiPet',
    description: '把对话、记忆、专注与提醒，收进一只常驻桌面的 AI 宠物。',
    details: '一个围绕桌面陪伴、个人助理与长期记忆持续打磨的 AI companion。',
    type: 'product',
    category: 'AI Product',
    status: 'building',
    activityRank: 90,
    featured: false,
    archived: false,
    updatedAt: '',
    tags: ['AI Companion', 'Desktop', 'PySide6'],
    image: {
      src: '/work/kimipet-contact-sheet.png',
      alt: 'KimiPet 在真实 Windows 桌面中的六格运行画面',
    },
    demoAvailable: false,
    demoUrl: '',
    githubAvailable: false,
    githubUrl: '',
  },
  {
    id: 'second-brain',
    name: 'Second Brain',
    description: 'Exploring a personal AI-native knowledge and life operating system.',
    details: '为个人知识库设计安全审计、迁移、收集与周期整理流程。',
    type: 'tool',
    category: 'Knowledge Tool',
    status: 'concept',
    activityRank: 60,
    featured: false,
    archived: false,
    updatedAt: '',
    tags: ['AI-native', 'Knowledge System', 'Automation'],
    image: null,
    demoAvailable: false,
    demoUrl: 'https://hxt-t.github.io/second-brain/',
    githubAvailable: false,
    githubUrl: '',
  },
  {
    id: 'ai-wiki',
    name: 'AI Wiki',
    description: 'A self-evolving personal knowledge wiki organized with AI.',
    details: '探索如何借助 AI 组织、连接并持续维护个人知识。',
    type: 'experiment',
    category: 'Experiment',
    status: 'experiment',
    activityRank: 50,
    featured: false,
    archived: false,
    updatedAt: '',
    tags: ['AI', 'Wiki', 'Knowledge'],
    image: null,
    demoAvailable: false,
    demoUrl: 'https://hxt-t.github.io/ai-wiki/',
    githubAvailable: false,
    githubUrl: '',
  },
  {
    id: 'personal-internet',
    name: 'Personal Internet',
    description: '把作品、写作、阅读与片刻，重新编成一份长期生长的个人刊物。',
    details: '一处持续收纳作品、文章、阅读、瞬间与个人思考的长期互联网空间。',
    type: 'product',
    category: 'Editorial Web',
    status: 'live',
    activityRank: 80,
    featured: false,
    archived: false,
    updatedAt: '',
    tags: ['Editorial Web', 'Digital Garden', 'React'],
    image: null,
    demoAvailable: true,
    demoUrl: 'https://hxt-t.github.io/',
    githubAvailable: true,
    githubUrl: 'https://github.com/HXT-T/HXT-T.github.io',
  },
]

export default projects

export const isBuildingMvp = (project) =>
  !project.archived && project.stage === 'mvp' && project.status === 'building'

export const projectViews = [
  { id: 'all', label: '全部项目', description: '产品、工具与实验的完整目录。' },
  { id: 'mvp', label: 'MVP 工作台', description: '集中放置正在构建的最小可用版本，记录核心目标与下一步。' },
  { id: 'live', label: '已上线', description: '已经开放体验、仍在持续维护的作品。' },
  { id: 'experiments', label: '实验', description: '小型原型与短期尝试，允许想法保持轻盈。' },
  { id: 'concepts', label: '构想', description: '还在梳理问题与方向、尚未进入 MVP 构建的想法。' },
  { id: 'archived', label: '归档', description: '暂时告一段落的项目，保留记录供以后回看。' },
]

export function matchesProjectView(project, view) {
  if (view === 'archived') return Boolean(project.archived)
  if (project.archived) return false
  if (view === 'mvp') return isBuildingMvp(project)
  if (view === 'live') return project.status === 'live'
  if (view === 'experiments') return project.type === 'experiment'
  if (view === 'concepts') return project.status === 'concept'
  return true
}

export const sortProjects = (items) => [...items].sort((a, b) =>
  (b.activityRank ?? 0) - (a.activityRank ?? 0) ||
  (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''),
)
