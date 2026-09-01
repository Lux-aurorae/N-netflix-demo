// ═══════════════════════════════════════════════════════════
// 캐러셀 반응형 설정
// ═══════════════════════════════════════════════════════════
//
// ▸ 화면 폭에 따라 카드를 몇 장씩 보여줄지 정합니다.
// ▸ breakpoint 는 { max, min } 픽셀 범위입니다.
// ▸ 별도 파일로 빼두면 세 슬라이드가 같은 설정을 공유하고,
//   숫자를 바꿀 때 한 곳만 고치면 됩니다.
//
// ▸ 카드 수를 정한 기준
//   · 너무 많으면 카드가 작아져 포스터가 안 보입니다
//   · 너무 적으면 여백이 남고 "더 있다"는 느낌이 안 납니다
//   · partialVisibilityGutter 로 오른쪽 카드를 살짝 잘리게 두면
//     "옆으로 더 있구나" 하고 자연스럽게 알게 됩니다
// ─────────────────────────────────────────────────────────
export const CAROUSEL_RESPONSIVE = {
  wide:    { breakpoint: { max: 4000, min: 1600 }, items: 7, partialVisibilityGutter: 30 },
  desktop: { breakpoint: { max: 1600, min: 1200 }, items: 6, partialVisibilityGutter: 28 },
  laptop:  { breakpoint: { max: 1200, min: 900 },  items: 4, partialVisibilityGutter: 26 },
  tablet:  { breakpoint: { max: 900,  min: 600 },  items: 3, partialVisibilityGutter: 22 },
  mobile:  { breakpoint: { max: 600,  min: 0 },    items: 2, partialVisibilityGutter: 18 },
};