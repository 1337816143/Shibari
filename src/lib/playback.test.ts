import { describe, expect, it } from 'vitest'
import { singleColumnDemo } from '../data/courses/singleColumnDemo'
import { clampProgress, getSegmentReveal, getStepIndexAtProgress, getStepLocalProgress } from './playback'

describe('playback helpers', () => {
  it('clamps invalid progress', () => {
    expect(clampProgress(-2)).toBe(0)
    expect(clampProgress(4)).toBe(1)
    expect(clampProgress(Number.NaN)).toBe(0)
  })

  it('maps progress to course steps', () => {
    expect(getStepIndexAtProgress(singleColumnDemo.steps, 0)).toBe(0)
    expect(getStepIndexAtProgress(singleColumnDemo.steps, 0.5)).toBe(3)
    expect(getStepIndexAtProgress(singleColumnDemo.steps, 1)).toBe(singleColumnDemo.steps.length - 1)
  })

  it('calculates local and segment reveal progress', () => {
    const step = singleColumnDemo.steps[2]
    expect(getStepLocalProgress(step, step.timeline[0])).toBe(0)
    expect(getStepLocalProgress(step, step.timeline[1])).toBe(1)
    const segment = singleColumnDemo.ropeSegments[0]
    expect(getSegmentReveal(segment, segment.startProgress)).toBe(0)
    expect(getSegmentReveal(segment, segment.endProgress)).toBe(1)
  })
})

