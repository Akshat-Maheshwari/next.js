import { PureComponent } from 'react'
import { RuntimeErrorHandler } from '../internal/helpers/runtime-error-handler'

type ReactDevOverlayProps = {
  children: React.ReactNode[]
  onError: (value: boolean) => void
}

type ReactDevOverlayState = {
  isReactError: boolean
}

export class DevToolsErrorBoundary extends PureComponent<
  ReactDevOverlayProps,
  ReactDevOverlayState
> {
  state = { isReactError: false }

  static getDerivedStateFromError(error: Error) {
    if (!error.stack) {
      return { isReactError: false }
    }

    RuntimeErrorHandler.hadRuntimeError = true

    return {
      isReactError: true,
    }
  }

  componentDidCatch() {
    this.props.onError(this.state.isReactError)
  }

  render() {
    const { children } = this.props
    const [content, devtools] = children

    const fallback = (
      <html>
        <head></head>
        <body></body>
      </html>
    )

    return (
      <>
        {this.state.isReactError ? fallback : content}
        {devtools}
      </>
    )
  }
}
