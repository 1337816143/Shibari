import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { PlaybackSpeed } from '../lib/playback'

export interface CourseLearningRecord {
  favorite: boolean
  completedStepIds: string[]
  needsReview: boolean
  note: string
  lastProgress: number
  lastView: string
  speed: PlaybackSpeed
  lastOpenedAt: string
}

export interface LearningSnapshot {
  format: 'shibari-learning-progress'
  version: 1
  exportedAt: string
  records: Record<string, CourseLearningRecord>
}

interface LearningState {
  records: Record<string, CourseLearningRecord>
  getRecord: (courseId: string) => CourseLearningRecord
  setFavorite: (courseId: string, value: boolean) => void
  setStepCompleted: (courseId: string, stepId: string, value: boolean) => void
  setNeedsReview: (courseId: string, value: boolean) => void
  setNote: (courseId: string, note: string) => void
  setPlayback: (courseId: string, progress: number, view: string, speed: PlaybackSpeed) => void
  exportProgress: () => string
  importProgress: (raw: string) => { ok: true; courseCount: number } | { ok: false; error: string }
  clearProgress: () => void
}

const defaultRecord = (): CourseLearningRecord => ({
  favorite: false,
  completedStepIds: [],
  needsReview: false,
  note: '',
  lastProgress: 0,
  lastView: 'front',
  speed: 1,
  lastOpenedAt: new Date(0).toISOString(),
})

const withRecord = (
  records: Record<string, CourseLearningRecord>,
  courseId: string,
  update: (record: CourseLearningRecord) => CourseLearningRecord,
) => ({ ...records, [courseId]: update(records[courseId] ?? defaultRecord()) })

function isRecord(value: unknown): value is CourseLearningRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<CourseLearningRecord>
  return (
    typeof record.favorite === 'boolean' &&
    Array.isArray(record.completedStepIds) &&
    record.completedStepIds.every((id) => typeof id === 'string') &&
    typeof record.needsReview === 'boolean' &&
    typeof record.note === 'string' &&
    typeof record.lastProgress === 'number' &&
    typeof record.lastView === 'string' &&
    [0.25, 0.5, 1, 1.5].includes(record.speed ?? 0) &&
    typeof record.lastOpenedAt === 'string'
  )
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      records: {},
      getRecord: (courseId) => get().records[courseId] ?? defaultRecord(),
      setFavorite: (courseId, value) =>
        set((state) => ({ records: withRecord(state.records, courseId, (record) => ({ ...record, favorite: value })) })),
      setStepCompleted: (courseId, stepId, value) =>
        set((state) => ({
          records: withRecord(state.records, courseId, (record) => ({
            ...record,
            completedStepIds: value
              ? Array.from(new Set([...record.completedStepIds, stepId]))
              : record.completedStepIds.filter((id) => id !== stepId),
          })),
        })),
      setNeedsReview: (courseId, value) =>
        set((state) => ({ records: withRecord(state.records, courseId, (record) => ({ ...record, needsReview: value })) })),
      setNote: (courseId, note) =>
        set((state) => ({ records: withRecord(state.records, courseId, (record) => ({ ...record, note })) })),
      setPlayback: (courseId, progress, view, speed) =>
        set((state) => ({
          records: withRecord(state.records, courseId, (record) => ({
            ...record,
            lastProgress: Math.min(1, Math.max(0, progress)),
            lastView: view,
            speed,
            lastOpenedAt: new Date().toISOString(),
          })),
        })),
      exportProgress: () =>
        JSON.stringify(
          {
            format: 'shibari-learning-progress',
            version: 1,
            exportedAt: new Date().toISOString(),
            records: get().records,
          } satisfies LearningSnapshot,
          null,
          2,
        ),
      importProgress: (raw) => {
        try {
          const parsed = JSON.parse(raw) as Partial<LearningSnapshot>
          if (parsed.format !== 'shibari-learning-progress' || parsed.version !== 1 || !parsed.records) {
            return { ok: false, error: '文件格式或版本不受支持。' }
          }
          if (!Object.values(parsed.records).every(isRecord)) {
            return { ok: false, error: '学习记录字段不完整。' }
          }
          set({ records: parsed.records })
          return { ok: true, courseCount: Object.keys(parsed.records).length }
        } catch {
          return { ok: false, error: '无法解析该 JSON 文件。' }
        }
      },
      clearProgress: () => set({ records: {} }),
    }),
    {
      name: 'shibari-learning-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ records: state.records }),
    },
  ),
)

