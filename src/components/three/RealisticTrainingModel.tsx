/* eslint-disable react-hooks/immutability */
import { useGLTF, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import type { TrainingModelDefinition } from '../../types/course'

type ModelQuality = 'high' | 'medium'

interface RealisticTrainingModelProps {
  model: TrainingModelDefinition
  opacity: number
  quality: ModelQuality
}

const resolvePublicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

function alignBoneToDirection(root: THREE.Object3D, boneName: string, direction: THREE.Vector3) {
  const bone = root.getObjectByName(boneName)
  if (!(bone instanceof THREE.Bone) || !bone.parent) return

  root.updateMatrixWorld(true)
  const worldRotation = bone.getWorldQuaternion(new THREE.Quaternion())
  const currentDirection = new THREE.Vector3(1, 0, 0).applyQuaternion(worldRotation).normalize()
  const correction = new THREE.Quaternion().setFromUnitVectors(currentDirection, direction.clone().normalize())
  const targetWorldRotation = correction.multiply(worldRotation)
  const parentWorldRotation = bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert()

  bone.quaternion.copy(parentWorldRotation.multiply(targetWorldRotation).normalize())
  root.updateMatrixWorld(true)
}

function applyStandingTrainingPose(root: THREE.Object3D) {
  alignBoneToDirection(root, 'Bip01 L UpperArm', new THREE.Vector3(0.03, -1, 0.01))
  alignBoneToDirection(root, 'Bip01 L Forearm', new THREE.Vector3(0.03, -1, 0.01))
  alignBoneToDirection(root, 'Bip01 R UpperArm', new THREE.Vector3(-0.03, -1, 0.01))
  alignBoneToDirection(root, 'Bip01 R Forearm', new THREE.Vector3(-0.03, -1, 0.01))
}

export function RealisticTrainingModel({ model, opacity, quality }: RealisticTrainingModelProps) {
  if (!model.assetPath || !model.texturePath) {
    throw new Error(`GLTF training model ${model.id} is missing asset paths.`)
  }

  const renderer = useThree((state) => state.gl)
  const modelUrl = resolvePublicAsset(model.assetPath)
  const textureRoot = resolvePublicAsset(`${model.texturePath}/${quality}`)
  const gltf = useGLTF(modelUrl)
  const [bodyColor, bodyNormal, headColor, headNormal, opacityColor] = useTexture([
    `${textureRoot}/body-color.webp`,
    `${textureRoot}/body-normal.webp`,
    `${textureRoot}/head-color.webp`,
    `${textureRoot}/head-normal.webp`,
    `${textureRoot}/opacity-color.webp`,
  ])
  const clone = useMemo(() => cloneSkeleton(gltf.scene), [gltf.scene])
  const materialSet = useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      name: 'training-body-pbr',
      map: bodyColor,
      normalMap: bodyNormal,
      normalScale: new THREE.Vector2(0.62, 0.62),
      roughness: 0.7,
      metalness: 0,
    })
    const head = new THREE.MeshStandardMaterial({
      name: 'training-head-pbr',
      map: headColor,
      normalMap: headNormal,
      normalScale: new THREE.Vector2(0.52, 0.52),
      roughness: 0.62,
      metalness: 0,
    })
    const cutout = new THREE.MeshStandardMaterial({
      name: 'training-cutout-pbr',
      map: opacityColor,
      alphaTest: 0.34,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.66,
      metalness: 0,
    })

    return { body, head, cutout }
  }, [bodyColor, bodyNormal, headColor, headNormal, opacityColor])

  useLayoutEffect(() => {
    const anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), quality === 'high' ? 8 : 4)
    bodyColor.colorSpace = THREE.SRGBColorSpace
    headColor.colorSpace = THREE.SRGBColorSpace
    opacityColor.colorSpace = THREE.SRGBColorSpace
    ;[bodyColor, bodyNormal, headColor, headNormal, opacityColor].forEach((texture) => {
      texture.flipY = false
      texture.anisotropy = anisotropy
      texture.needsUpdate = true
    })
  }, [bodyColor, bodyNormal, headColor, headNormal, opacityColor, quality, renderer])

  useLayoutEffect(() => {
    applyStandingTrainingPose(clone)
    const replacements = new Map<string, THREE.Material>([
      ['m014_body', materialSet.body],
      ['m014_head', materialSet.head],
      ['m014_opacity', materialSet.cutout],
    ])

    clone.traverse((object) => {
      if (!(object instanceof THREE.SkinnedMesh)) return
      object.castShadow = true
      object.receiveShadow = true
      const originalMaterials = Array.isArray(object.material) ? object.material : [object.material]
      const resolvedMaterials = originalMaterials.map((material) => replacements.get(material.name) ?? material)
      object.material = Array.isArray(object.material) ? resolvedMaterials : resolvedMaterials[0]
    })
  }, [clone, materialSet])

  useEffect(() => {
    const translucent = opacity < 0.999
    ;[materialSet.body, materialSet.head].forEach((material) => {
      material.opacity = opacity
      material.transparent = translucent
      material.depthWrite = opacity > 0.55
      material.needsUpdate = true
    })
    materialSet.cutout.opacity = opacity
    materialSet.cutout.depthWrite = opacity > 0.72
    materialSet.cutout.needsUpdate = true
  }, [materialSet, opacity])

  useEffect(() => () => {
    materialSet.body.dispose()
    materialSet.head.dispose()
    materialSet.cutout.dispose()
  }, [materialSet])

  return (
    <primitive
      object={clone}
      name={model.id}
      position={model.position ? [...model.position] : [0, 0, 0]}
      scale={model.scale ?? 1}
    />
  )
}
