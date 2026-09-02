import { Component } from "react";

// ═══════════════════════════════════════════════════════════
// 오류 경계 (Error Boundary)
// ═══════════════════════════════════════════════════════════
//
// ▸ React는 화면을 그리다가 오류가 나면 앱 전체를 지웁니다.
//   그래서 "검은 화면"만 남고 이유를 알 수 없습니다.
//
// ▸ 이 컴포넌트로 감싸두면, 오류가 나도 앱이 죽지 않고
//   무슨 오류인지 화면에 그대로 보여줍니다.
//
// ▸ ⚠️ 오류 경계는 반드시 "클래스 컴포넌트"여야 합니다.
//   함수형 컴포넌트로는 만들 수 없습니다. (React의 규칙)
//   그래서 이 파일만 옛날 방식인 class 문법을 씁니다.
//
// ▸ 두 가지 메서드가 짝을 이룹니다.
//   · getDerivedStateFromError … 오류가 나면 state를 바꿔 대체 화면을 그림
//   · componentDidCatch        … 오류를 기록 (콘솔·서버 전송 등)
// ─────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // 오류가 발생했다는 사실을 state에 담아 대체 화면을 그리게 합니다.
    return { error };
  }

  componentDidCatch(error, info) {
    // 어느 컴포넌트에서 났는지까지 기록합니다.
    console.error("[화면 오류]", error);
    console.error("[발생 위치]", info?.componentStack);
    this.setState({ info });
  }

  render() {
    const { error, info } = this.state;

    if (!error) return this.props.children;

    // 어느 컴포넌트에서 났는지 앞부분만 추려냅니다.
    const where = (info?.componentStack ?? "")
      .split("\n")
      .filter(Boolean)
      .slice(0, 6)
      .join("\n");

    return (
      <div style={box}>
        <p style={badge}>화면 오류</p>
        <h1 style={title}>{error.name}</h1>
        <p style={msg}>{error.message}</p>

        {where && (
          <>
            <p style={label}>발생 위치</p>
            <pre style={pre}>{where}</pre>
          </>
        )}

        {error.stack && (
          <>
            <p style={label}>자세한 내용</p>
            <pre style={pre}>{error.stack.split("\n").slice(0, 8).join("\n")}</pre>
          </>
        )}

        <button style={btn} onClick={() => window.location.assign("/")}>
          홈으로 돌아가기
        </button>
      </div>
    );
  }
}

// 이 화면은 CSS 파일이 안 불러와졌을 때도 보여야 하므로
// 스타일을 코드 안에 직접 넣었습니다.
const box = {
  minHeight: "100dvh",
  padding: "48px 20px",
  background: "#09090b",
  color: "#f5f5f7",
  fontFamily: "ui-monospace, Menlo, Consolas, monospace",
  fontSize: 13,
  lineHeight: 1.7,
};

const badge = {
  display: "inline-block",
  margin: "0 0 14px",
  padding: "4px 12px",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.16em",
  color: "#fff",
  background: "#e11d2e",
  borderRadius: 999,
};

const title = { margin: "0 0 8px", fontSize: 20, fontWeight: 700 };
const msg = { margin: "0 0 26px", color: "#ffb4bc", wordBreak: "break-word" };

const label = {
  margin: "0 0 6px",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#8a8a92",
};

const pre = {
  margin: "0 0 22px",
  padding: 14,
  background: "#141417",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  color: "#c9c9d1",
};

const btn = {
  padding: "11px 24px",
  fontFamily: "inherit",
  fontSize: 13,
  color: "#fff",
  background: "#e11d2e",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

export default ErrorBoundary;