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
})

