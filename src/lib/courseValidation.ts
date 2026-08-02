import type { Course } from '../types/course'

const inUnitRange = (value: number) => Number.isFinite(value) && value >= 0 && value <= 1

export function validateCourse(course: Course): string[] {
  const errors: string[] = []
  const stepIds = new Set<string>()
  const releasePhaseIds = new Set<string>()
  const releasedSegmentIds = new Set<string>()
  const segmentIds = new Set(course.ropeSegments.map((segment) => segment.id))
  const viewIds = new Set(course.cameraPresets.map((preset) => preset.id))

  if (!course.id || !course.slug || !course.title) errors.push('Course identity is incomplete.')
  if (course.model.implementation === 'gltf') {
    const assetPaths = [course.model.assetPath, course.model.texturePath]
    if (assetPaths.some((path) => !path || path.includes('..') || /^https?:\/\//.test(path))) {
      errors.push('GLTF models require safe repository-local asset and texture paths.')
    }
    if (!course.model.sourceLabel || !course.model.sourceUrl || !course.model.license) {
      errors.push('GLTF models require source and license metadata.')
    }
    if (!Number.isFinite(course.model.scale) || (course.model.scale ?? 0) <= 0) {
      errors.push('GLTF models require a positive display scale.')
    }
  }
  if (course.review.status === 'published' && course.review.reviewers.length === 0) {
    errors.push('Published courses require at least one named reviewer.')
  }
  if (course.steps.length === 0) errors.push('Course must contain at least one step.')
  if (course.releasePlan.phases.length === 0) errors.push('Course must contain at least one release phase.')

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
    if (![step.objective, step.startFrom, step.route, step.direction, step.tension, step.communication].every((value) => value.trim().length > 0)) {
      errors.push(`Step ${step.id} is missing required instructional text.`)
    }
    if (step.checkpoints.length === 0 || step.commonErrors.length === 0 || step.risks.length === 0) {
      errors.push(`Step ${step.id} is missing checks, errors, or risks.`)
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

  course.releasePlan.phases.forEach((phase, index) => {
    if (releasePhaseIds.has(phase.id)) errors.push(`Duplicate release phase id: ${phase.id}`)
    releasePhaseIds.add(phase.id)
    if (phase.order !== index + 1) errors.push(`Release phase ${phase.id} has a non-sequential order.`)
    if (!Number.isFinite(phase.durationSeconds) || phase.durationSeconds <= 0) {
      errors.push(`Release phase ${phase.id} has an invalid duration.`)
    }
    if (!viewIds.has(phase.recommendedView)) {
      errors.push(`Release phase ${phase.id} references an unknown recommended view.`)
    }
    if (![phase.instruction, phase.direction, phase.tension, phase.checkpoint, phase.warning, phase.communication].every((value) => value.trim().length > 0)) {
      errors.push(`Release phase ${phase.id} is missing required safety text.`)
    }
    phase.segmentIds.forEach((id) => {
      if (!segmentIds.has(id)) errors.push(`Release phase ${phase.id} references unknown segment ${id}.`)
      if (releasedSegmentIds.has(id)) errors.push(`Release segment ${id} is assigned more than once.`)
      releasedSegmentIds.add(id)
    })
  })

  course.ropeSegments.forEach((segment) => {
    if (!releasedSegmentIds.has(segment.id)) errors.push(`Release plan does not remove segment ${segment.id}.`)
  })

  if (!course.directionMarkers.some((marker) => marker.kind === 'release')) {
    errors.push('Course requires at least one release direction marker.')
  }
  if (!course.releasePlan.disclaimer.trim() || !course.releasePlan.emergencyInstruction.trim()) {
    errors.push('Release plan requires a disclaimer and emergency instruction.')
  }

  return errors
}
