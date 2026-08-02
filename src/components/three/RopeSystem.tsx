import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { getSegmentReveal } from '../../lib/playback'
import type { RopeSegment } from '../../types/course'

interface RopeSegmentMeshProps {
  segment: RopeSegment
  progress: number
  active: boolean
  showCompleted: boolean
  focusCurrent: boolean
  quality: 'high' | 'medium' | 'low'
}

function RopeSegmentMesh({ segment, progress, active, showCompleted, focusCurrent, quality }: RopeSegmentMeshProps) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(segment.points.map((point) => new THREE.Vector3(...point)), false, 'centripetal', 0.45),
    [segment.points],
  )
  const geometry = useMemo(() => {
    const tubularSegments = quality === 'high' ? 96 : quality === 'medium' ? 64 : 36
    const radialSegments = quality === 'low' ? 6 : 8
    return new THREE.TubeGeometry(curve, tubularSegments, 0.032, radialSegments, false)
  }, [curve, quality])
  const reveal = getSegmentReveal(segment, progress)
  const isCompleted = reveal >= 0.999
  const visible = reveal > 0.002 && (!isCompleted || showCompleted || active)

  useEffect(() => () => geometry.dispose(), [geometry])

  const indexCount = geometry.index?.count ?? 0
  const drawCount = Math.floor((indexCount * reveal) / 3) * 3
  geometry.setDrawRange(0, drawCount)
  const tip = curve.getPointAt(Math.min(1, Math.max(0, reveal)))

  return (
    <group visible={visible}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color={active ? '#ff7257' : '#b58b62'}
          roughness={0.78}
          metalness={0.01}
          transparent={!active}
          opacity={active ? 1 : focusCurrent ? 0.28 : 0.62}
          depthWrite={active || !focusCurrent}
        />
      </mesh>
      {active && reveal > 0.02 && reveal < 0.995 && (
        <mesh position={tip}>
          <sphereGeometry args={[0.062, 14, 12]} />
          <meshStandardMaterial color="#ffd5a8" emissive="#ff7257" emissiveIntensity={1.4} />
        </mesh>
      )}
    </group>
  )
}

export function RopeSystem({
  segments,
  progress,
  activeSegmentIds,
  showCompleted,
  focusCurrent,
  quality,
}: {
  segments: readonly RopeSegment[]
  progress: number
  activeSegmentIds: readonly string[]
  showCompleted: boolean
  focusCurrent: boolean
  quality: 'high' | 'medium' | 'low'
}) {
  return (
    <group name="course-rope">
      {segments.map((segment) => (
        <RopeSegmentMesh
          key={segment.id}
          segment={segment}
          progress={progress}
          active={activeSegmentIds.includes(segment.id)}
          showCompleted={showCompleted}
          focusCurrent={focusCurrent}
          quality={quality}
        />
      ))}
    </group>
  )
}

