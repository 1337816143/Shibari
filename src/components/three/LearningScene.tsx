/* eslint-disable react-hooks/immutability */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CameraPreset, Course, CourseStep } from '../../types/course'
import { RopeSystem, type ReleasePlaybackState } from './RopeSystem'
import { SafetyOverlays } from './SafetyOverlays'
import { RealisticTrainingModel } from './RealisticTrainingModel'
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
  release,
}: {
  course: Course
  step: CourseStep
  progress: number
  preset: CameraPreset
  options: SceneOptions
  release?: ReleasePlaybackState
}) {
  const useRealisticModel = course.model.implementation === 'gltf' && options.quality !== 'low'
  const realisticQuality = options.quality === 'high' ? 'high' : 'medium'

  return (
    <>
      <CameraRig preset={preset} />
      <hemisphereLight args={['#fbfdf9', '#7f8c85', 1.18]} />
      <ambientLight intensity={0.34} />
      <directionalLight
        position={[3.8, 6.5, 4.6]}
        intensity={3.05}
        castShadow
        shadow-mapSize={[options.quality === 'high' ? 2048 : 1024, options.quality === 'high' ? 2048 : 1024]}
        shadow-bias={-0.00018}
        shadow-normalBias={0.035}
        shadow-camera-far={12}
      />
      <directionalLight position={[-4.5, 3, -3.5]} intensity={1.05} color="#b8ddd6" />
      <directionalLight position={[1, 3.6, -4.5]} intensity={0.78} color="#f3d6bd" />
      <group scale={[options.mirrored ? -1 : 1, 1, 1]}>
        <group visible={options.modelVisible}>
          {useRealisticModel ? (
            <Suspense fallback={<TrainingMannequin opacity={options.modelOpacity} />}>
              <RealisticTrainingModel
                model={course.model}
                opacity={options.modelOpacity}
                quality={realisticQuality}
              />
            </Suspense>
          ) : (
            <TrainingMannequin opacity={options.modelOpacity} />
          )}
        </group>
        <RopeSystem
          segments={course.ropeSegments}
          progress={progress}
          activeSegmentIds={step.activeSegmentIds}
          showCompleted={options.showCompleted}
          focusCurrent={options.focusCurrent}
          quality={options.quality}
          release={release}
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
        <meshStandardMaterial color="#d9dfda" roughness={0.94} />
      </mesh>
      {options.quality !== 'low' && <ContactShadows position={[-0.48, -0.255, 0]} opacity={0.34} scale={4.5} blur={2.1} far={3.5} frames={1} />}
      {options.quality === 'high' && (
        <Environment resolution={96} environmentIntensity={0.42}>
          <Lightformer intensity={2.1} color="#f8fbf7" position={[0, 4, 4]} scale={[5, 5, 1]} />
          <Lightformer intensity={1.2} color="#b7ded7" position={[-4, 2, -2]} rotation={[0, Math.PI / 2, 0]} scale={[4, 3, 1]} />
          <Lightformer intensity={0.8} color="#f1d3bb" position={[4, 3, -1]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 3, 1]} />
        </Environment>
      )}
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
  release,
}: {
  course: Course
  step: CourseStep
  progress: number
  preset: CameraPreset
  playing: boolean
  options: SceneOptions
  release?: ReleasePlaybackState
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
        gl.toneMappingExposure = 1.08
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <color attach="background" args={['#e7ebe8']} />
      <fog attach="fog" args={['#e7ebe8', 7, 13]} />
      <SceneContent course={course} step={step} progress={progress} preset={preset} options={options} release={release} />
    </Canvas>
  )
}
