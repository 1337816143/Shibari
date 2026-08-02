import { useMemo } from 'react'
import * as THREE from 'three'
import type { CourseStep, DirectionMarker, RiskZone } from '../../types/course'

function DirectionArrow({ marker }: { marker: DirectionMarker }) {
  const helper = useMemo(() => {
    const from = new THREE.Vector3(...marker.from)
    const to = new THREE.Vector3(...marker.to)
    const direction = to.clone().sub(from)
    const length = direction.length()
    return new THREE.ArrowHelper(
      direction.normalize(),
      from,
      length,
      marker.kind === 'release' ? 0x58d6c7 : 0xffb15f,
      0.13,
      0.08,
    )
  }, [marker])
  return <primitive object={helper} />
}

export function SafetyOverlays({
  riskZones,
  markers,
  step,
  showRisks,
  showContact,
}: {
  riskZones: readonly RiskZone[]
  markers: readonly DirectionMarker[]
  step: CourseStep
  showRisks: boolean
  showContact: boolean
}) {
  return (
    <group name="safety-overlays">
      {showRisks &&
        riskZones.map((zone) => (
          <mesh key={zone.id} position={zone.position} scale={zone.scale}>
            <sphereGeometry args={[1, 20, 16]} />
            <meshBasicMaterial
              color={zone.severity === 'stop' ? '#ef6c5a' : '#f1b761'}
              wireframe
              transparent
              opacity={zone.severity === 'stop' ? 0.52 : 0.34}
              depthWrite={false}
            />
          </mesh>
        ))}
      {showContact && (
        <group>
          {[
            [-0.66, 1.28, 0.09],
            [-0.86, 1.28, 0.23],
            [-1.05, 1.28, 0.06],
          ].map((position, index) => (
            <mesh key={index} position={position as [number, number, number]}>
              <sphereGeometry args={[0.045, 12, 10]} />
              <meshBasicMaterial color="#5ed7c8" transparent opacity={0.9} depthWrite={false} />
            </mesh>
          ))}
        </group>
      )}
      {markers.filter((marker) => marker.visibleInSteps.includes(step.id)).map((marker) => <DirectionArrow marker={marker} key={marker.id} />)}
      {step.handHint !== 'none' && (
        <group>
          {(step.handHint === 'left' || step.handHint === 'both') && (
            <mesh position={[-1.12, 1.05, 0.26]}>
              <sphereGeometry args={[0.09, 16, 12]} />
              <meshBasicMaterial color="#8fd5ff" transparent opacity={0.58} depthWrite={false} />
            </mesh>
          )}
          {(step.handHint === 'right' || step.handHint === 'both') && (
            <mesh position={[-0.45, 1.38, 0.44]}>
              <sphereGeometry args={[0.09, 16, 12]} />
              <meshBasicMaterial color="#ffd89a" transparent opacity={0.66} depthWrite={false} />
            </mesh>
          )}
        </group>
      )}
    </group>
  )
}

