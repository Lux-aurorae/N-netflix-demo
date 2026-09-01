import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// ═══════════════════════════════════════════════════════════
// 영화 검색 훅
// ═══════════════════════════════════════════════════════════
//
// ▸ Movies 페이지에 오는 길은 두 가지입니다.
//   ① 메뉴에서 클릭  → 검색어 없음 → 인기 영화 목록을 보여줌
//   ② 검색창에서 넘어옴 → 검색어 있음 → 검색 결과를 보여줌
//
// ▸ 원래는 백엔드가 이 분기를 처리하지만,
//   TMDB API를 직접 쓰는 구조라 프론트에서 나눕니다.
//
// ▸ TMDB는 두 기능의 주소가 다릅니다.
//   · 인기 영화 : /movie/popular
//   · 검색     : /search/movie?query=키워드   ← query 는 필수값
// ─────────────────────────────────────────────────────────

const fetchSearchMovie = ({ keyword, page }) => {
  // 검색어가 없으면 인기 영화 목록
  if (!keyword) {
    return api.get(`/movie/popular?language=ko-KR&page=${page}`);
  }

  // 검색어가 있으면 검색 API
  // encodeURIComponent 로 감싸야 한글·공백·특수문자가 깨지지 않습니다.
  return api.get(
    `/search/movie?query=${encodeURIComponent(keyword)}&language=ko-KR&page=${page}`
  );
};

export function useSearchMovieQuery(keyword, page = 1) {
  return useQuery({
    // ── queryKey ──────────────────────────────────────────
    // ▸ 검색어와 페이지를 모두 넣습니다.
    // ▸ 조합마다 캐시가 따로 생기므로
    //   · 2페이지 → 1페이지로 돌아오면 서버 호출 없이 즉시 표시
    //   · 같은 검색어를 다시 쳐도 즉시 표시
    // ▸ 키가 바뀌면 리액트 쿼리가 알아서 다시 불러옵니다.
    //   (useEffect 의존성 배열을 직접 관리할 필요가 없습니다)
    queryKey: ["movies-search", keyword, page],

    queryFn: () => fetchSearchMovie({ keyword, page }),

    // ── select ────────────────────────────────────────────
    // ▸ 화면에 필요한 것만 꺼냅니다.
    // ▸ results 뿐 아니라 total_pages 도 필요합니다. (페이지네이션용)
    // ▸ TMDB는 500페이지까지만 조회를 허용하므로 상한을 둡니다.
    //   그 이상을 요청하면 오류가 납니다.
    select: (res) => ({
      results: res.data.results ?? [],
      totalPages: Math.min(res.data.total_pages ?? 0, 500),
      totalResults: res.data.total_results ?? 0,
    }),

    // ── placeholderData ───────────────────────────────────
    // ▸ 페이지를 넘길 때 이전 데이터를 그대로 두고 새 데이터를 받아옵니다.
    // ▸ 없으면 넘길 때마다 화면이 비었다가 다시 채워져 깜빡입니다.
    //   (v4의 keepPreviousData 가 v5에서 이 방식으로 바뀌었습니다)
    placeholderData: (prev) => prev,

    staleTime: 1000 * 60 * 5,
  });
}

export default useSearchMovieQuery;