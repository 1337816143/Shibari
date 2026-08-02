export type Vec3 = readonly [number, number, number]

export type LearningStage = 'preparation' | 'foundation' | 'ground-technique'
export type RiskLevel = 'low' | 'moderate' | 'high'
export type ReviewStatus = 'draft' | 'technical-review' | 'expert-review' | 'published'
export type CourseAvailability = 'available' | 'planned' | 'locked'

export interface CameraPreset {
  id: string
  label: string
  position: Vec3
  target: Vec3
  fov?: number
  isCloseup?: boolean
}

export interface RopeSegment {
  id: string
  label: string
  points: readonly Vec3[]
  startProgress: number
  endProgress: number
  contactArea?: string
}

export interface RiskZone {
  id: string
  label: string
  detail: string
  position: Vec3
  scale: Vec3
  severity: 'attention' | 'stop'
}

export interface DirectionMarker {
  id: string
  label: string
  from: Vec3
  to: Vec3
  kind: 'rope-head' | 'release'
  visibleInSteps: readonly string[]
}

export interface CourseStep {
  id: string
  order: number
  title: string
  shortLabel: string
  timeline: readonly [number, number]
  objective: string
  startFrom: string
  route: string
  direction: string
  tension: string
  checkpoints: readonly string[]
  commonErrors: readonly string[]
  risks: readonly string[]
  communication: string
  recommendedView: string
  closeupView?: string
  activeSegmentIds: readonly string[]
  handHint?: 'left' | 'right' | 'both' | 'none'
}

export interface ReleasePhase {
  id: string
  order: number
  title: string
  shortLabel: string
  durationSeconds: number
  segmentIds: readonly string[]
  instruction: string
  direction: string
  tension: string
  checkpoint: string
  warning: string
  communication: string
  recommendedView: string
}

export interface ReleasePlan {
  title: string
  disclaimer: string
  emergencyInstruction: string
  phases: readonly ReleasePhase[]
}

export interface CourseSource {
  label: string
  url?: string
  note: string
  license: string
}

export interface TrainingModelDefinition {
  id: string
  implementation: 'procedural' | 'gltf'
  poseId: string
  adultOnly: true
  fullyClothed: true
  assetPath?: string
  texturePath?: string
  position?: Vec3
  scale?: number
  sourceLabel?: string
  sourceUrl?: string
  license?: string
}

export interface Course {
  id: string
  slug: string
  title: string
  subtitle: string
  summary: string
  learningStage: LearningStage
  bodyParts: readonly string[]
  techniqueTypes: readonly string[]
  prerequisites: readonly string[]
  rope: {
    material: string
    diameter: string
    length: string
    quantity: number
  }
  estimatedMinutes: number
  riskLevel: RiskLevel
  needsPartner: boolean
  learningObjectives: readonly string[]
  scope: string
  contraindications: readonly string[]
  prohibitedAreas: readonly string[]
  stopSymptoms: readonly string[]
  quickRelease: readonly string[]
  releasePlan: ReleasePlan
  safetyShearsPlacement: string
  review: {
    status: ReviewStatus
    reviewers: readonly string[]
    note: string
  }
  version: string
  updatedAt: string
  sources: readonly CourseSource[]
  model: TrainingModelDefinition
  cameraPresets: readonly CameraPreset[]
  ropeSegments: readonly RopeSegment[]
  riskZones: readonly RiskZone[]
  directionMarkers: readonly DirectionMarker[]
  steps: readonly CourseStep[]
}

export interface CatalogEntry {
  id: string
  slug: string
  title: string
  summary: string
  stage: LearningStage
  riskLevel: RiskLevel
  bodyParts: readonly string[]
  techniqueTypes: readonly string[]
  prerequisites: readonly string[]
  ropeLength: string
  estimatedMinutes: number
  needsPartner: boolean
  reviewStatus: ReviewStatus
  availability: CourseAvailability
  stepCount: number
}
