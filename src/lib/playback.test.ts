import { describe, expect, it } from 'vitest'
import { singleColumnDemo } from '../data/courses/singleColumnDemo'
import {
  clampProgress,
  getReleasePhaseBounds,
  getReleasePhaseIndexAtProgress,
  getReleaseSegmentReveal,
  getSegmentReveal,
  getStepIndexAtProgress,
  getStepLocalProgress,
  progressForReleasePhase,
} from './playback'

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

  it('maps weighted release phases and removes rope segments in declared order', () => {
    const phases = singleColumnDemo.releasePlan.phases
    singleColumnDemo.ropeSegments.forEach((segment) => {
      expect(getReleaseSegmentReveal(segment.id, phases, 0)).toBe(1)
      expect(getReleaseSegmentReveal(segment.id, phases, 1)).toBe(0)
    })
    const workingEndsPhase = phases.findIndex((phase) => phase.segmentIds.includes('working-ends'))
    const [start, end] = getReleasePhaseBounds(phases, workingEndsPhase)

    expect(getReleasePhaseIndexAtProgress(phases, start)).toBe(workingEndsPhase)
    expect(progressForReleasePhase(phases, workingEndsPhase)).toBe(start)
    expect(getReleaseSegmentReveal('working-ends', phases, start)).toBe(1)
    expect(getReleaseSegmentReveal('working-ends', phases, (start + end) / 2)).toBeCloseTo(0.5)
    expect(getReleaseSegmentReveal('working-ends', phases, end)).toBe(0)

    const crossingPhase = phases.findIndex((phase) => phase.id === 'release-crossing')
    const [crossingStart, crossingEnd] = getReleasePhaseBounds(phases, crossingPhase)
    const firstQuarter = crossingStart + (crossingEnd - crossingStart) * 0.25
    const thirdQuarter = crossingStart + (crossingEnd - crossingStart) * 0.75
    expect(getReleaseSegmentReveal('return-under', phases, firstQuarter)).toBeCloseTo(0.5)
    expect(getReleaseSegmentReveal('cross-over', phases, firstQuarter)).toBe(1)
    expect(getReleaseSegmentReveal('return-under', phases, thirdQuarter)).toBe(0)
    expect(getReleaseSegmentReveal('cross-over', phases, thirdQuarter)).toBeCloseTo(0.5)
  })
})
