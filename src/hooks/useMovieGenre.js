import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// ═══════════════════════════════════════════════════════════
// 장르 목록 가져오기
// ═══════════════════════════════════════════════════════════
//
// ▸ 왜 필요한가
//   영화 목록 API는 장르를 "이름"이 아니라 "번호"로 줍니다.
//     genre_ids: [28, 80, 18]
//   번호만 보여주면 사용자는 무슨 장르인지 알 수 없습니다.
//
// ▸ TMDB는 번호↔이름 대조표를 별도 API로 제공합니다.
//     GET /genre/movie/list
//     → { genres: [ { id: 28, name: "액션" }, ... ] }
// ─────────────────────────────────────────────────────────

// API를 실제로 부르는 함수.
// 훅 안에 바로 써도 되지만 밖으로 빼면 무엇을 부르는지 한눈에 보입니다.
const fetchMovieGenre = () => {
  return api.get("/genre/movie/list?language=ko-KR");
};

export function useMovieGenreQuery() {
  return useQuery({
    // ── queryKey ──────────────────────────────────────────
    // ▸ 이 데이터의 이름표. 캐시가 이 키로 저장됩니다.
    //
    // ▸ ⭐ 중요한 점
    //   영화 카드가 60장 렌더링되면 이 훅도 60번 호출됩니다.
    //   그런데 실제 네트워크 요청은 "딱 한 번"만 나갑니다.
    //   리액트 쿼리가 같은 키의 중복 요청을 하나로 합쳐 주기 때문입니다.
    //   (이것을 중복 제거 / deduplication 이라고 합니다)
    //
    //   리덕스였다면 "이미 불렀는지" 확인하는 코드를 직접 짜야 했습니다.
    queryKey: ["movieGenre"],

    queryFn: fetchMovieGenre,

    // ── select ────────────────────────────────────────────
    // ▸ axios 응답에는 headers·config·status 등 화면에 필요 없는 게 많습니다.
    // ▸ genres 배열만 꺼내두면 컴포넌트에서 바로 쓸 수 있습니다.
    //   select 없이 쓰면 → data.data.genres (두 단계를 더 들어가야 함)
    select: (res) => res.data.genres,

    // ── staleTime ─────────────────────────────────────────
    // ▸ 장르 목록은 거의 바뀌지 않습니다. (몇 년에 한 번)
    // ▸ 길게 잡아두면 페이지를 옮겨 다녀도 다시 부르지 않습니다.
    // ▸ 강의는 5분, 여기서는 하루로 넉넉히 잡았습니다.
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export default useMovieGenreQuery;