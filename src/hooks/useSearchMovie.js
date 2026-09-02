import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// ══════════════════════════════════════════════════════════
// 영화 검색 훅
// ══════════════════════════════════════════════════════════
//
// ▸ Movies 페이지에 오는 길은 두 가지입니다.
//   ① 메뉴에서 클릭  → 검색어 없음 → 인기 영화 목록
//   ② 검색창에서 넘어옴 → 검색어 있음 → 검색 결과
//
// ▸ TMDB는 두 기능의 주소가 다릅니다.
//   · 인기 영화 : /movie/popular
//   · 검색     : /search/movie?query=키워드   ← query 는 필수값
//
// ▸ ⚠️ 주소를 만들 때 물음표(?)와 앰퍼샌드(&) 위치가 중요합니다.
//   첫 옵션 앞에는 ? , 두 번째부터는 & 를 씁니다.
//   순서가 틀리면 TMDB가 옵션을 못 읽어 빈 결과를 돌려줍니다.
//   그래서 URLSearchParams 로 자동 조립합니다. 실수할 여지를 없앱니다.
// ─────────────────────────────────────────────────────────

const fetchSearchMovie = async ({ keyword, page }) => {
  // 공통 옵션
  const params = new URLSearchParams({
    language: "ko-KR",
    page: String(page),
  });

  let path;
  if (keyword) {
    // 검색 — query 파라미터가 반드시 있어야 합니다.
    // URLSearchParams가 한글·공백·특수문자를 알아서 처리해 줍니다.
    params.set("query", keyword);
    path = "/search/movie";
  } else {
    // 검색어가 없으면 인기 영화 목록
    path = "/movie/popular";
  }

  const res = await api.get(`${path}?${params.toString()}`);
  return res.data;
};

export function useSearchMovieQuery(keyword, page = 1) {
  return useQuery({
    // ── queryKey ──────────────────────────────────────────
    // ▸ 검색어와 페이지를 모두 넣습니다.
    // ▸ 조합마다 캐시가 따로 생기므로
    //   · 2페이지 → 1페이지로 돌아오면 서버 호출 없이 즉시 표시
    //   · 같은 검색어를 다시 쳐도 즉시 표시
    // ▸ 키가 바뀌면 리액트 쿼리가 알아서 다시 불러옵니다.
    queryKey: ["movies-search", keyword, page],

    queryFn: () => fetchSearchMovie({ keyword, page }),

    // ── select ────────────────────────────────────────────
    // ▸ 화면이 쓰기 좋은 모양으로 다듬습니다.
    // ▸ TMDB는 500페이지까지만 조회를 허용하므로 상한을 둡니다.
    //   그 이상을 요청하면 오류가 납니다.
    select: (data) => ({
      results: Array.isArray(data?.results) ? data.results : [],
      totalPages: Math.min(data?.total_pages ?? 0, 500),
      totalResults: data?.total_results ?? 0,
    }),

    staleTime: 1000 * 60 * 5,
  });
}

export default useSearchMovieQuery;