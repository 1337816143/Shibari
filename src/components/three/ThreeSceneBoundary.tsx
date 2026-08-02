import { Component, type ReactNode } from 'react'

interface ThreeSceneBoundaryProps {
  children: ReactNode
  onError: (error: Error) => void
}

interface ThreeSceneBoundaryState {
  failed: boolean
}

export class ThreeSceneBoundary extends Component<ThreeSceneBoundaryProps, ThreeSceneBoundaryState> {
  state: ThreeSceneBoundaryState = { failed: false }

  static getDerivedStateFromError(): ThreeSceneBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
