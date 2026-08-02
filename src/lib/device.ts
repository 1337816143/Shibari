export interface DeviceCapability {
  tier: 'high' | 'medium' | 'low'
  supportsWebGL: boolean
  prefersReducedMotion: boolean
  reason: string
  maxDpr: number
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl')
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(context)
  } catch {
    return false
  }
}

export function detectDeviceCapability(): DeviceCapability {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { tier: 'medium', supportsWebGL: true, prefersReducedMotion: false, reason: 'server', maxDpr: 1.25 }
  }

  const webgl = supportsWebGL()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const memory = 'deviceMemory' in navigator ? Number(navigator.deviceMemory) : 4
  const cores = navigator.hardwareConcurrency || 4

  if (!webgl || reducedMotion || memory <= 2 || cores <= 2) {
    return {
      tier: 'low',
      supportsWebGL: webgl,
      prefersReducedMotion: reducedMotion,
      reason: !webgl ? 'webgl-unavailable' : reducedMotion ? 'reduced-motion' : 'limited-device',
      maxDpr: 1,
    }
  }

  if (memory >= 8 && cores >= 8) {
    return { tier: 'high', supportsWebGL: true, prefersReducedMotion: false, reason: 'capable-device', maxDpr: 1.5 }
  }

  return { tier: 'medium', supportsWebGL: true, prefersReducedMotion: false, reason: 'balanced-device', maxDpr: 1.25 }
}
