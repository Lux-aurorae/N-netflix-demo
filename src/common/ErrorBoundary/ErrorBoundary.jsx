import { Component } from "react";
import "./ErrorBoundary.style.css";

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[화면 렌더링 오류]", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="fatal" role="alert">
        <p className="fatal__eyebrow">Something went wrong</p>
        <h1 className="fatal__title">화면을 표시하지 못했습니다</h1>
        <p className="fatal__desc">
          일시적인 오류일 수 있습니다. 페이지를 새로고침해 주세요.
        </p>
        <button className="fatal__button" type="button" onClick={() => window.location.reload()}>
          새로고침
        </button>
        {import.meta.env.DEV && <pre className="fatal__detail">{this.state.error.message}</pre>}
      </main>
    );
  }
}

export default ErrorBoundary;