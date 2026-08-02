import type { Course } from '../types/course'

const inUnitRange = (value: number) => Number.isFinite(value) && value >= 0 && value <= 1

export function validateCourse(course: Course): string[] {
  const errors: string[] = []
  const stepIds = new Set<string>()
  const segmentIds = new Set(course.ropeSegments.map((segment) => segment.id))
  const viewIds = new Set(course.cameraPresets.map((preset) => preset.id))

  if (!course.id || !course.slug || !course.title) errors.push('Course identity is incomplete.')
  if (course.review.status === 'published' && course.review.reviewers.length === 0) {
    errors.push('Published courses require at least one named reviewer.')
  }
  if (course.steps.length === 0) errors.push('Course must contain at least one step.')

  course.steps.forEach((step, index) => {
    const [start, end] = step.timeline
    if (stepIds.has(step.id)) errors.push(`Duplicate step id: ${step.id}`)
    stepIds.add(step.id)
    if (step.order !== index + 1) errors.push(`Step ${step.id} has a non-sequential order.`)
    if (!inUnitRange(start) || !inUnitRange(end) || start >= end) {
      errors.push(`Step ${step.id} has an invalid timeline.`)
    }
    if (index === 0 && start !== 0) errors.push('The first step must start at 0.')
    if (index > 0 && Math.abs(start - course.steps[index - 1].timeline[1]) > 0.0001) {
      errors.push(`Step ${step.id} does not continue from the previous step.`)
    }
    if (!viewIds.has(step.recommendedView)) {
      errors.push(`Step ${step.id} references an unknown recommended view.`)
    }
    if (step.closeupView && !viewIds.has(step.closeupView)) {
      errors.push(`Step ${step.id} references an unknown close-up view.`)
    }
    step.activeSegmentIds.forEach((id) => {
      if (!segmentIds.has(id)) errors.push(`Step ${step.id} references unknown segment ${id}.`)
    })
  })

  if (course.steps.length > 0 && course.steps.at(-1)?.timeline[1] !== 1) {
    errors.push('The final step must end at 1.')
  }

  course.ropeSegments.forEach((segment) => {
    if (segment.points.length < 2) errors.push(`Segment ${segment.id} needs at least two points.`)
    if (
      !inUnitRange(segment.startProgress) ||
      !inUnitRange(segment.endProgress) ||
      segment.startProgress >= segment.endProgress
    ) {
      errors.push(`Segment ${segment.id} has an invalid reveal range.`)
    }
  })

  return errors
}

