import "./Spinner.style.css";

// ═══════════════════════════════════════════════════════════
// 로딩 스피너
// ═══════════════════════════════════════════════════════════
//
// ▸ react-bootstrap의 <Spinner />를 써도 되지만,
//   기본 모양이라 다른 과제물과 똑같아집니다.
//   여기서는 필름 릴이 도는 모양을 직접 만들었습니다.
//
// ▸ props
//   · label    … 아래에 띄울 안내 문구
//   · fullPage … true면 화면 전체를 채웁니다 (배너 자리 등)
//
// ▸ 접근성
//   · role="status" 는 "지금 상태를 알리는 영역"이라는 표시입니다.
//   · 화면을 못 보는 사용자에게 스크린리더가 label을 읽어 줍니다.
// ─────────────────────────────────────────────────────────
function Spinner({ label = "불러오는 중", fullPage = false }) {
  return (
    <div className={`spinner ${fullPage ? "spinner--full" : ""}`} role="status">
      <span className="spinner__reel" aria-hidden="true">
        <span className="spinner__hole" />
        <span className="spinner__hole" />
        <span className="spinner__hole" />
      </span>
      <p className="spinner__label">{label}</p>
    </div>
  );
}

export default Spinner;