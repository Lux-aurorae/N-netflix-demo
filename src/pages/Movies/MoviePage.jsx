import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSearchMovieQuery } from "../../hooks/useSearchMovie";
import MovieCard from "../../common/MovieCard/MovieCard";
import Spinner from "../../common/Spinner/Spinner";
import Notice from "../../common/Notice/Notice";
import MovieFilter from "./components/MovieFilters/MovieFilter";
import Pager from "./components/Pager/Pager";
import "./MoviePage.style.css";

// ═══════════════════════════════════════════════════════════
// 영화 목록 페이지
// ═══════════════════════════════════════════════════════════
//
// ▸ 검색어와 페이지 번호를 "주소"에 담습니다.
//     /movies?query=마블&page=3
//
//   useState 대신 주소를 쓰는 이유
//   · 새로고침해도 그대로 유지됩니다
//   · 뒤로가기가 자연스럽게 동작합니다
//   · 링크를 복사해 보내면 같은 화면이 열립니다
//   강의는 page를 useState로 관리하지만, 주소에 두는 편이 더 낫습니다.
//
// ▸ 검색어가 바뀌면 페이지가 1로 돌아가야 합니다. (채점 기준)
//   주소를 쓰면 자연스럽게 해결됩니다.
//   새 검색은 page 없이 이동하고, page가 없으면 기본값이 1이기 때문입니다.
// ─────────────────────────────────────────────────────────
function MoviePage() {
  const [query, setQuery] = useSearchParams();

  const keyword = query.get("query") ?? "";
  const page = Number(query.get("page")) || 1;

  // 장르·정렬은 주소에 넣지 않았습니다.
  // 화면에서만 잠깐 쓰는 값이라 링크로 공유할 필요가 적기 때문입니다.
  const [genreId, setGenreId] = useState(null);
  const [sort, setSort] = useState("default");

  const { data, isLoading, isError, error, isFetching } = useSearchMovieQuery(keyword, page);

  const movies = data?.results ?? [];
  const totalPages = data?.totalPages ?? 0;

  // 검색어가 바뀌면 필터를 초기화합니다.
  // 이전 검색의 장르가 남아 있으면 결과가 0건으로 보여 혼란스럽습니다.
  useEffect(() => {
    setGenreId(null);
    setSort("default");
  }, [keyword]);

  // 페이지를 옮기면 목록 맨 위로 올려줍니다.
  // 스크롤을 내린 상태에서 페이지를 넘기면 중간부터 보여 당황스럽습니다.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // 이번 페이지 결과에 장르가 몇 개씩 있는지 세어 둡니다. (필터 버튼의 숫자)
  const genreCounts = useMemo(() => {
    const counts = {};
    for (const m of movies) {
      for (const id of m.genre_ids ?? []) {
        counts[id] = (counts[id] ?? 0) + 1;
      }
    }
    return counts;
  }, [movies]);

  // 화면에 실제로 보여줄 목록 — 장르로 거르고 정렬합니다.
  const shown = useMemo(() => {
    let list = genreId ? movies.filter((m) => (m.genre_ids ?? []).includes(genreId)) : movies;

    if (sort === "rating") {
      list = [...list].sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
    } else if (sort === "newest") {
      list = [...list].sort((a, b) =>
        (b.release_date ?? "").localeCompare(a.release_date ?? "")
      );
    } else if (sort === "title") {
      list = [...list].sort((a, b) => (a.title ?? "").localeCompare(b.title ?? "", "ko"));
    }
    return list;
  }, [movies, genreId, sort]);

  // 페이지 이동. 주소만 바꾸면 훅이 알아서 새 데이터를 불러옵니다.
  const goPage = (next) => {
    const params = {};
    if (keyword) params.query = keyword;
    if (next > 1) params.page = String(next);
    setQuery(params);
  };

  // 검색어 지우기 → 원래 목록(인기 영화)으로 (채점 기준)
  const clearKeyword = () => setQuery({});

  return (
    <div className="movies">
      {/* ── 머리말 ── */}
      <header className="movies__head">
        <p className="movies__eyebrow">{keyword ? "Search" : "Browse"}</p>
        <h1 className="movies__title">
          {keyword ? <>&ldquo;{keyword}&rdquo; 검색 결과</> : "전체 작품"}
        </h1>

        <div className="movies__sub">
          {isLoading ? (
            <span>불러오는 중…</span>
          ) : isError ? null : (
            <>
              <span>
                총 <strong>{(data?.totalResults ?? 0).toLocaleString()}</strong>편
              </span>
              {genreId && <span className="movies__dot">필터 적용됨 {shown.length}편</span>}
              {isFetching && <span className="movies__dot">갱신 중…</span>}
            </>
          )}
        </div>

        {keyword && (
          <button className="movies__clear" onClick={clearKeyword}>
            검색어 지우기 · 전체 작품 보기
          </button>
        )}
      </header>

      {/* ── 본문: 필터 + 목록 ── */}
      <div className="movies__body">
        <div className="movies__side">
          <MovieFilter
            genreId={genreId}
            sort={sort}
            onGenre={setGenreId}
            onSort={setSort}
            counts={genreCounts}
          />
        </div>

        <div className="movies__main">
          {/* 불러오는 중 */}
          {isLoading && (
            <div className="grid">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="skeleton" />
              ))}
            </div>
          )}

          {/* 실패 */}
          {!isLoading && isError && (
            <Notice
              tone="error"
              title={`목록을 불러오지 못했습니다${
                error?.response?.status ? ` (${error.response.status})` : ""
              }`}
              steps={[
                error?.response?.status === 401
                  ? "API 토큰을 확인해 주세요."
                  : (error?.message ?? "네트워크 상태를 확인해 주세요."),
              ]}
            />
          )}

          {/* 검색 결과 없음 — 채점 기준 */}
          {!isLoading && !isError && movies.length === 0 && (
            <div className="empty">
              <p className="empty__title">
                {keyword ? <>&ldquo;{keyword}&rdquo; 검색 결과가 없습니다</> : "표시할 작품이 없습니다"}
              </p>
              <p className="empty__desc">
                철자를 확인하거나 더 짧은 단어로 찾아보세요.
                <br />
                영어 제목으로 검색하면 더 많이 나옵니다.
              </p>
              {keyword && (
                <button className="btn btn--primary" onClick={clearKeyword}>
                  전체 작품 보기
                </button>
              )}
            </div>
          )}

          {/* 필터 때문에 0건이 된 경우 — 위와 구분해서 안내합니다 */}
          {!isLoading && !isError && movies.length > 0 && shown.length === 0 && (
            <div className="empty">
              <p className="empty__title">선택한 장르에 맞는 작품이 없습니다</p>
              <p className="empty__desc">이 페이지에는 해당 장르 작품이 없습니다.</p>
              <button className="btn" onClick={() => setGenreId(null)}>
                장르 해제
              </button>
            </div>
          )}

          {/* 목록 */}
          {!isLoading && !isError && shown.length > 0 && (
            <>
              <div className={`grid ${isFetching ? "is-fetching" : ""}`}>
                {shown.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              <Pager page={page} totalPages={totalPages} onChange={goPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoviePage;