import { singleColumnDemo } from './courses/singleColumnDemo'
import type { CatalogEntry } from '../types/course'

const demoEntry: CatalogEntry = {
  id: singleColumnDemo.id,
  slug: singleColumnDemo.slug,
  title: singleColumnDemo.title,
  summary: singleColumnDemo.summary,
  stage: singleColumnDemo.learningStage,
  riskLevel: singleColumnDemo.riskLevel,
  bodyParts: singleColumnDemo.bodyParts,
  techniqueTypes: singleColumnDemo.techniqueTypes,
  prerequisites: singleColumnDemo.prerequisites,
  ropeLength: singleColumnDemo.rope.length,
  estimatedMinutes: singleColumnDemo.estimatedMinutes,
  needsPartner: singleColumnDemo.needsPartner,
  reviewStatus: singleColumnDemo.review.status,
  availability: 'available',
  stepCount: singleColumnDemo.steps.length,
}

export const catalog: readonly CatalogEntry[] = [
  demoEntry,
  {
    id: 'consent-and-signals',
    slug: 'consent-and-signals',
    title: '同意、沟通与停止信号',
    summary: '建立练习前、过程中和结束后的沟通框架。',
    stage: 'preparation',
    riskLevel: 'low',
    bodyParts: ['全身'],
    techniqueTypes: ['安全准备'],
    prerequisites: [],
    ropeLength: '无需绳索',
    estimatedMinutes: 10,
    needsPartner: true,
    reviewStatus: 'draft',
    availability: 'planned',
    stepCount: 0,
  },
  {
    id: 'rapid-release',
    slug: 'rapid-release',
    title: '安全剪与快速解除',
    summary: '在无压力情境下建立停止、稳定、剪切和复查的肌肉记忆。',
    stage: 'preparation',
    riskLevel: 'low',
    bodyParts: ['全身'],
    techniqueTypes: ['安全准备', '快速解除'],
    prerequisites: ['同意与沟通'],
    ropeLength: '2–4 m 练习绳',
    estimatedMinutes: 12,
    needsPartner: true,
    reviewStatus: 'draft',
    availability: 'planned',
    stepCount: 0,
  },
  {
    id: 'rope-handling',
    slug: 'rope-handling',
    title: '绳索整理与基础操作',
    summary: '练习绳中、工作端、送绳和避免摩擦拖拽。',
    stage: 'foundation',
    riskLevel: 'low',
    bodyParts: ['手部'],
    techniqueTypes: ['绳索操作'],
    prerequisites: ['安全剪与快速解除'],
    ropeLength: '4–6 m',
    estimatedMinutes: 15,
    needsPartner: false,
    reviewStatus: 'draft',
    availability: 'planned',
    stepCount: 0,
  },
  {
    id: 'double-column-ground',
    slug: 'double-column-ground',
    title: '双柱缚 · 地面练习',
    summary: '在固定姿势下理解两柱间距、回穿与状态检查。',
    stage: 'foundation',
    riskLevel: 'moderate',
    bodyParts: ['手腕'],
    techniqueTypes: ['双柱缚'],
    prerequisites: ['单柱缚', '快速解除'],
    ropeLength: '4–6 m',
    estimatedMinutes: 18,
    needsPartner: true,
    reviewStatus: 'draft',
    availability: 'locked',
    stepCount: 0,
  },
]

export const availableCourses = [singleColumnDemo] as const

export function getCourseBySlug(slug: string) {
  return availableCourses.find((course) => course.slug === slug)
}

