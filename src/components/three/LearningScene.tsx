/* eslint-disable react-hooks/immutability */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CameraPreset, Course, CourseStep } from '../../types/course'
import { RopeSystem } from './RopeSystem'
import { SafetyOverlays } from './SafetyOverlays'
import { TrainingMannequin } from './TrainingMannequin'

interface SceneOptions {
  modelVisible: boolean
  modelOpacity: number
  showCompleted: boolean
  focusCurrent: boolean
  showRisks: boolean
  showContact: boolean
  mirrored: boolean
  viewLocked: boolean
  quality: 'high' | 'medium' | 'low'
  maxDpr: number
}

function CameraRig({ preset }: { preset: CameraPreset }) {
  const { camera, invalidate } = useThree()
  const targetPosition = useRef(new THREE.Vector3(...preset.position))
  const targetFov = useRef(preset.fov ?? 42)
  const animating = useRef(true)

  useEffect(() => {
    targetPosition.current.set(...preset.position)
    targetFov.current = preset.fov ?? 42
    animating.current = true
    invalidate()
  }, [invalidate, preset])

  useFrame(() => {
    if (!animating.current) return
    camera.position.lerp(targetPosition.current, 0.14)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov.current, 0.14)
      camera.updateProjectionMatrix()
    }
    const remaining = camera.position.distanceTo(targetPosition.current)
    if (remaining < 0.012) {
      camera.position.copy(targetPosition.current)
      animating.current = false
    } else {
      invalidate()
    }
  })
  return null
}

function SceneContent({
  course,
  step,
  progress,
  preset,
  options,
}: {
  course: Course
  step: CourseStep
  progress: number
  preset: CameraPreset
  options: SceneOptions
}) {
  return (
    <>
      <CameraRig preset={preset} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[3, 6, 4]} intensity={2.3} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -3]} intensity={0.72} color="#bce7df" />
      <group scale={[options.mirrored ? -1 : 1, 1, 1]}>
        <TrainingMannequin visible={options.modelVisible} opacity={options.modelOpacity} />
        <RopeSystem
          segments={course.ropeSegments}
          progress={progress}
          activeSegmentIds={step.activeSegmentIds}
          showCompleted={options.showCompleted}
          focusCurrent={options.focusCurrent}
          quality={options.quality}
        />
        <SafetyOverlays
          riskZones={course.riskZones}
          markers={course.directionMarkers}
          step={step}
          showRisks={options.showRisks}
          showContact={options.showContact}
        />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.27, 0]} receiveShadow>
        <circleGeometry args={[5.5, 64]} />
        <meshStandardMaterial color="#d9ded8" roughness={0.9} />
      </mesh>
      {options.quality !== 'low' && <ContactShadows position={[0, -0.25, 0]} opacity={0.28} scale={5} blur={2.6} far={4} frames={1} />}
      {options.quality === 'high' && <Environment preset="studio" environmentIntensity={0.22} />}
      <OrbitControls
        key={preset.id}
        makeDefault
        target={preset.target as [number, number, number]}
        enabled={!options.viewLocked}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={0.75}
        maxDistance={8}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.18}
      />
    </>
  )
}

export function LearningScene({
  course,
  step,
  progress,
  preset,
  playing,
  options,
}: {
  course: Course
  step: CourseStep
  progress: number
  preset: CameraPreset
  playing: boolean
  options: SceneOptions
}) {
  return (
    <Canvas
      className="learning-canvas"
      camera={{ position: [...preset.position], fov: preset.fov ?? 42, near: 0.05, far: 40 }}
      dpr={[1, options.maxDpr]}
      frameloop={playing ? 'always' : 'demand'}
      shadows={options.quality !== 'low'}
      gl={{ antialias: options.quality !== 'low', powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.02
      }}
    >
      <color attach="background" args={['#e8ece7']} />
      <fog attach="fog" args={['#e8ece7', 7, 13]} />
      <SceneContent course={course} step={step} progress={progress} preset={preset} options={options} />
    </Canvas>
  )
}
