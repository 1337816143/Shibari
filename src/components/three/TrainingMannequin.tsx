import type { ThreeElements } from '@react-three/fiber'

type TrainingMannequinProps = ThreeElements['group'] & { opacity: number }

function Material({ color, opacity, roughness = 0.72 }: { color: string; opacity: number; roughness?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.02}
      transparent={opacity < 1}
      opacity={opacity}
      depthWrite={opacity > 0.55}
    />
  )
}

export function TrainingMannequin({ opacity, ...props }: TrainingMannequinProps) {
  const cloth = '#35564e'
  const clothDark = '#243d38'
  const neutral = '#b7a99b'
  const shoes = '#202926'

  return (
    <group {...props} name="neutral-adult-training-mannequin">
      <mesh position={[0, 3.23, 0]} castShadow>
        <sphereGeometry args={[0.29, 22, 18]} />
        <Material color={neutral} opacity={opacity} roughness={0.86} />
      </mesh>
      <mesh position={[0, 2.93, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.2, 16]} />
        <Material color={neutral} opacity={opacity} />
      </mesh>

      <mesh position={[0, 2.32, 0]} scale={[1.14, 1, 0.72]} castShadow receiveShadow>
        <capsuleGeometry args={[0.42, 0.72, 8, 18]} />
        <Material color={cloth} opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.72, 0]} scale={[1.02, 1, 0.73]} castShadow>
        <capsuleGeometry args={[0.37, 0.26, 8, 18]} />
        <Material color={clothDark} opacity={opacity} />
      </mesh>
      <mesh position={[0, 2.72, 0.32]} rotation={[0.22, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.08, 0.04]} />
        <Material color="#e7c8a0" opacity={opacity} roughness={0.62} />
      </mesh>

      <group name="left-arm">
        <mesh position={[-0.68, 2.28, 0]} rotation={[0, 0, -0.12]} castShadow>
          <capsuleGeometry args={[0.19, 0.58, 7, 14]} />
          <Material color={cloth} opacity={opacity} />
        </mesh>
        <mesh position={[-0.84, 1.55, 0]} rotation={[0, 0, -0.035]} castShadow>
          <capsuleGeometry args={[0.145, 0.5, 7, 14]} />
          <Material color="#456a61" opacity={opacity} />
        </mesh>
        <mesh position={[-0.86, 1.02, 0]} scale={[0.82, 1.15, 0.7]} castShadow>
          <capsuleGeometry args={[0.14, 0.15, 6, 12]} />
          <Material color={neutral} opacity={opacity} />
        </mesh>
      </group>

      <group name="right-arm">
        <mesh position={[0.68, 2.28, 0]} rotation={[0, 0, 0.12]} castShadow>
          <capsuleGeometry args={[0.19, 0.58, 7, 14]} />
          <Material color={cloth} opacity={opacity} />
        </mesh>
        <mesh position={[0.84, 1.55, 0]} rotation={[0, 0, 0.035]} castShadow>
          <capsuleGeometry args={[0.145, 0.5, 7, 14]} />
          <Material color="#456a61" opacity={opacity} />
        </mesh>
        <mesh position={[0.86, 1.02, 0]} scale={[0.82, 1.15, 0.7]} castShadow>
          <capsuleGeometry args={[0.14, 0.15, 6, 12]} />
          <Material color={neutral} opacity={opacity} />
        </mesh>
      </group>

      <group name="left-leg">
        <mesh position={[-0.24, 1.02, 0]} castShadow>
          <capsuleGeometry args={[0.23, 0.72, 7, 14]} />
          <Material color="#293d3a" opacity={opacity} />
        </mesh>
        <mesh position={[-0.24, 0.31, 0]} castShadow>
          <capsuleGeometry args={[0.18, 0.55, 7, 14]} />
          <Material color="#293d3a" opacity={opacity} />
        </mesh>
        <mesh position={[-0.24, -0.05, 0.09]} scale={[1, 0.55, 1.52]} castShadow>
          <capsuleGeometry args={[0.2, 0.18, 6, 12]} />
          <Material color={shoes} opacity={opacity} />
        </mesh>
      </group>
      <group name="right-leg">
        <mesh position={[0.24, 1.02, 0]} castShadow>
          <capsuleGeometry args={[0.23, 0.72, 7, 14]} />
          <Material color="#293d3a" opacity={opacity} />
        </mesh>
        <mesh position={[0.24, 0.31, 0]} castShadow>
          <capsuleGeometry args={[0.18, 0.55, 7, 14]} />
          <Material color="#293d3a" opacity={opacity} />
        </mesh>
        <mesh position={[0.24, -0.05, 0.09]} scale={[1, 0.55, 1.52]} castShadow>
          <capsuleGeometry args={[0.2, 0.18, 6, 12]} />
          <Material color={shoes} opacity={opacity} />
        </mesh>
      </group>
    </group>
  )
}
