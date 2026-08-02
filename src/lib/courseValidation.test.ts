import { describe, expect, it } from 'vitest'
import { singleColumnDemo } from '../data/courses/singleColumnDemo'
import { validateCourse } from './courseValidation'

describe('validateCourse', () => {
  it('accepts the phase-one demo course', () => {
    expect(validateCourse(singleColumnDemo)).toEqual([])
  })

  it('requires a reviewer before a course can be published', () => {
    const invalid = {
      ...singleColumnDemo,
      review: { ...singleColumnDemo.review, status: 'published' as const },
    }
    expect(validateCourse(invalid)).toContain('Published courses require at least one named reviewer.')
  })

  it('rejects release plans with unknown or duplicated rope segments', () => {
    const phases = singleColumnDemo.releasePlan.phases.map((phase, index) => {
      if (index === 0) return { ...phase, segmentIds: ['missing-segment'] }
      if (index === 1) return { ...phase, segmentIds: [...phase.segmentIds, 'lock-through'] }
      return phase
    })
    const invalid = {
      ...singleColumnDemo,
      releasePlan: { ...singleColumnDemo.releasePlan, phases },
    }
    const errors = validateCourse(invalid)

    expect(errors).toContain('Release phase release-stabilize references unknown segment missing-segment.')
    expect(errors).toContain('Release segment lock-through is assigned more than once.')
  })

  it('requires safety text in both teaching and release phases', () => {
    const invalid = {
      ...singleColumnDemo,
      steps: singleColumnDemo.steps.map((step, index) => index === 0 ? { ...step, communication: '' } : step),
      releasePlan: {
        ...singleColumnDemo.releasePlan,
        phases: singleColumnDemo.releasePlan.phases.map((phase, index) => index === 0 ? { ...phase, warning: '' } : phase),
      },
    }
    const errors = validateCourse(invalid)

    expect(errors).toContain('Step safety-check is missing required instructional text.')
    expect(errors).toContain('Release phase release-stabilize is missing required safety text.')
  })
})
