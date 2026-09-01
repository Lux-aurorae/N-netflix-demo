import "./Notice.style.css";

// ═══════════════════════════════════════════════════════════
// 문제 안내 상자
// ═══════════════════════════════════════════════════════════
//
// ▸ 화면이 그냥 비어 있으면 왜 안 나오는지 알 수 없습니다.
//   무엇이 잘못됐고 무엇을 하면 되는지 화면에 직접 띄웁니다.
//
// ▸ props
//   · title  … 무엇이 잘못됐는지
//   · steps  … 무엇을 하면 되는지 (배열)
//   · tone   … "warn"(주황) | "error"(빨강)
// ─────────────────────────────────────────────────────────
function Notice({ title, steps = [], tone = "warn" }) {
  return (
    <div className={`notice notice--${tone}`} role="alert">
      <p className="notice__title">{title}</p>
      {steps.length > 0 && (
        <ol className="notice__steps">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Notice;