import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// ═══════════════════════════════════════════════════════════
// 영화 목록 훅 3종 — popular / top_rated / upcoming
// ═══════════════════════════════════════════════════════════
//
// ▸ 세 API는 주소만 다르고 나머지가 완전히 같습니다.
//   그래서 공통 부분을 함수 하나로 묶고, 훅 3개가 그것을 부릅니다.
//
// ▸ 이렇게 하면
//   · 옵션을 바꿀 때 한 곳만 고치면 됩니다
//   · 훅 이름은 그대로라 쓰는 쪽 코드는 안 바뀝니다
//   · 나중에 API가 늘어나도 한 줄이면 추가됩니다
// ─────────────────────────────────────────────────────────

// 공통 부분. 주소만 받아서 useQuery 설정을 돌려줍니다.
function movieListOptions(path, key) {
  return {
    // queryKey — 캐시의 이름표. 종류마다 다르게 해야 서로 섞이지 않습니다.
    queryKey: ["movie", key],

    // baseURL은 utils/api.js 의 axios 인스턴스에 이미 들어 있습니다.
    queryFn: () => api.get(`${path}?language=ko-KR`),

    // axios 응답에서 필요한 부분만 꺼냅니다.
    // 없으면 컴포넌트에서 data.data.results 처럼 한 단계 더 들어가야 합니다.
    select: (res) => res.data,

    // 영화 목록은 자주 바뀌지 않으므로 5분간 재호출하지 않습니다.
    staleTime: 1000 * 60 * 5,
  };
}

// 인기 영화
export function usePopularMoviesQuery() {
  return useQuery(movieListOptions("/movie/popular", "popular"));
}

// 평점 높은 영화
export function useTopRatedMoviesQuery() {
  return useQuery(movieListOptions("/movie/top_rated", "top_rated"));
}

// 개봉 예정 영화
export function useUpcomingMoviesQuery() {
  return useQuery(movieListOptions("/movie/upcoming", "upcoming"));
}