import { performance } from 'node:perf_hooks'
import * as THREE from 'three'
import { singleColumnDemo } from '../src/data/courses/singleColumnDemo.ts'

const qualitySettings = {
  low: { tubular: 36, radial: 6 },
  medium: { tubular: 64, radial: 8 },
  high: { tubular: 96, radial: 8 },
} as const

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]

function buildGeometries(settings: { tubular: number; radial: number }) {
  return singleColumnDemo.ropeSegments.map((segment) => {
    const curve = new THREE.CatmullRomCurve3(
      segment.points.map((point) => new THREE.Vector3(...point)),
      false,
      'centripetal',
      0.45,
    )
    return new THREE.TubeGeometry(curve, settings.tubular, 0.032, settings.radial, false)
  })
}

for (const [quality, settings] of Object.entries(qualitySettings)) {
  buildGeometries(settings).forEach((geometry) => geometry.dispose())
  const buildSamples = Array.from({ length: 20 }, () => {
    const started = performance.now()
    const sample = buildGeometries(settings)
    const elapsed = performance.now() - started
    sample.forEach((geometry) => geometry.dispose())
    return elapsed
  })
  const geometries = buildGeometries(settings)
  const vertices = geometries.reduce((sum, geometry) => sum + (geometry.attributes.position?.count ?? 0), 0)
  const triangles = geometries.reduce((sum, geometry) => sum + (geometry.index?.count ?? 0) / 3, 0)
  const approximateBytes = geometries.reduce((sum, geometry) => {
    const attributes = Object.values(geometry.attributes).reduce((attributeSum, attribute) => attributeSum + attribute.array.byteLength, 0)
    return sum + attributes + (geometry.index?.array.byteLength ?? 0)
  }, 0)

  const updateStarted = performance.now()
  for (let frame = 0; frame < 10_000; frame += 1) {
    const progress = (frame % 1000) / 999
    geometries.forEach((geometry) => {
      const total = geometry.index?.count ?? 0
      geometry.setDrawRange(0, Math.floor((total * progress) / 3) * 3)
    })
  }
  const drawRangeUpdatesMs = performance.now() - updateStarted

  console.log(
    JSON.stringify({
      quality,
      segments: geometries.length,
      vertices,
      triangles,
      approximateKiB: Math.round(approximateBytes / 1024),
      medianBuildMs: Number(median(buildSamples).toFixed(2)),
      drawRangeUpdatesMs: Number(drawRangeUpdatesMs.toFixed(2)),
    }),
  )
  geometries.forEach((geometry) => geometry.dispose())
}
