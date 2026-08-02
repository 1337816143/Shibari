import { beforeEach, describe, expect, it } from 'vitest'
import { useLearningStore } from './learningStore'

describe('learning store', () => {
  beforeEach(() => {
    localStorage.clear()
    useLearningStore.getState().clearProgress()
  })

  it('tracks completion without duplicate steps', () => {
    const state = useLearningStore.getState()
    state.setStepCompleted('demo', 'step-1', true)
    useLearningStore.getState().setStepCompleted('demo', 'step-1', true)
    expect(useLearningStore.getState().records.demo.completedStepIds).toEqual(['step-1'])
  })

  it('round-trips exported records', () => {
    useLearningStore.getState().setFavorite('demo', true)
    const exported = useLearningStore.getState().exportProgress()
    useLearningStore.getState().clearProgress()
    const result = useLearningStore.getState().importProgress(exported)
    expect(result).toEqual({ ok: true, courseCount: 1 })
    expect(useLearningStore.getState().records.demo.favorite).toBe(true)
  })

  it('rejects unknown data', () => {
    expect(useLearningStore.getState().importProgress('{"hello":"world"}')).toEqual({
      ok: false,
      error: '文件格式或版本不受支持。',
    })
  })
})

