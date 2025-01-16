import { PureComponent } from 'react'
import { RuntimeErrorHandler } from '../internal/helpers/runtime-error-handler'

type ReactDevOverlayProps = {
  children: React.ReactNode[]
  onError: (value: boolean) => void
}

type ReactDevOverlayState = {
  isReactError: boolean
}

export class ErrorBoundary extends PureComponent<
  ReactDevOverlayProps,
  ReactDevOverlayState
> {
  state = { isReactError: false }

  componentDidUpdate(
    _prevProps: ReactDevOverlayProps,
    prevState: ReactDevOverlayState
  ) {
    if (prevState.isReactError !== this.state.isReactError) {
      this.props.onError(this.state.isReactError)
    }
  }

  static getDerivedStateFromError(error: Error): ReactDevOverlayState {
    if (!error.stack) {
      return { isReactError: false }
    }

    RuntimeErrorHandler.hadRuntimeError = true

    return {
      isReactError: true,
    }
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
