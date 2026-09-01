// ═══════════════════════════════════════════════════════════
// TMDB 이미지 주소 만들기
// ═══════════════════════════════════════════════════════════
//
// ▸ API는 이미지의 "경로 조각"만 줍니다.  예) "/abc123.jpg"
// ▸ 앞에 이미지 서버 주소와 크기를 붙여야 실제로 보입니다.
//
//   받은 값  : "/abc123.jpg"
//   완성 주소: "https://image.tmdb.org/t/p/original/abc123.jpg"
//
// ▸ 크기 옵션 (자주 쓰는 것만)
//   · w500     … 가로 500px   → 포스터 카드용
//   · w1280    … 가로 1280px  → 배너용 (모바일에서 충분)
//   · original … 원본         → 큰 화면 배너용
//
//   무조건 original을 쓰면 용량이 커서 로딩이 느려집니다.
//   화면에서 실제로 보이는 크기에 맞춰 고르는 것이 좋습니다.
// ─────────────────────────────────────────────────────────

const IMAGE_BASE = "https://image.tmdb.org/t/p";

export function imageUrl(path, size = "w500") {
  // 경로가 없는 영화도 있습니다. 그때는 null을 돌려주고
  // 화면에서 대체 배경을 보여줍니다. (깨진 이미지 아이콘 방지)
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

// 배너용 — 가로로 긴 사진
//
// ⚠️ poster_path 와 backdrop_path 는 다릅니다.
//    · poster_path   … 세로 2:3 포스터  → 카드용
//    · backdrop_path … 가로 16:9 스틸컷 → 배너용
//    배너에 포스터를 쓰면 위아래가 잘려 어색해집니다.
export function backdropUrl(movie, size = "original") {
  return imageUrl(movie?.backdrop_path ?? movie?.poster_path, size);
}

// 카드용 — 세로 포스터
export function posterUrl(movie, size = "w500") {
  return imageUrl(movie?.poster_path ?? movie?.backdrop_path, size);
}