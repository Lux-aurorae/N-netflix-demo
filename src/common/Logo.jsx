// ══════════════════════════════════════════════════════════
// 브랜드 로고g
// ══════════════════════════════════════════════════════════
//
// ▸ 넷플릭스 로고는 상표권이 있어 그대로 쓸 수 없습니다.
// ▸ 직접 만든 워드마크를 씁니다. (재생 삼각형 + NOVA)
// ▸ SVG라서 아무리 키워도 흐려지지 않습니다.
// ▸ currentColor를 쓰므로 CSS에서 지정한 글자색을 그대로 따릅니다.
// ─────────────────────────────────────────────────────────
function Logo({ height = 26 }) {
  return (
    <svg
      height={height}
      viewBox="0 0 152 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="NOVA"
      className="logo"
    >
      {/* 재생 버튼 모양 마크 */}
      <path d="M4 3.2 L26 18 L4 32.8 Z" fill="var(--accent)" />
      <path d="M4 3.2 L26 18 L4 32.8 Z" fill="url(#logoGrad)" opacity="0.4" />

      <defs>
        <linearGradient id="logoGrad" x1="4" y1="3" x2="26" y2="33">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 워드마크 */}
      <text
        x="38"
        y="27"
        fontFamily="Archivo, 'Arial Black', sans-serif"
        fontWeight="800"
        fontSize="27"
        letterSpacing="2.5"
        fill="currentColor"
      >
        NOVA
      </text>
    </svg>
  );
}

export default Logo;