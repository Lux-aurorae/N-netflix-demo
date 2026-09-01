import { useMovieGenreQuery } from "../../../../hooks/useMovieGenre";
import "./MovieFilter.style.css";

// ═══════════════════════════════════════════════════════════
// 필터 — 장르 · 정렬
// ═══════════════════════════════════════════════════════════
//
// ▸ 강의의 최종 과제(장르 필터 · 정렬)를 미리 구현했습니다.
//
// ▸ ⚠️ 알아둘 점
//   TMDB의 검색 API(/search/movie)는 장르·정렬 옵션을 지원하지 않습니다.
//   그래서 서버가 보내준 "현재 페이지 결과" 안에서 걸러내고 정렬합니다.
//   전체 결과를 대상으로 하려면 /discover/movie 를 써야 하는데,
//   그쪽은 반대로 키워드 검색이 안 됩니다.
//   → 화면에도 이 점을 안내해 사용자가 오해하지 않게 했습니다.
//
// ▸ props
//   · genreId / sort   … 현재 선택값
//   · onGenre / onSort … 바뀌었을 때 부를 함수
//   · counts           … 장르별 개수 { 28: 3, 18: 5 }
// ─────────────────────────────────────────────────────────

export const SORT_OPTIONS = [
  { key: "default", label: "기본순" },
  { key: "rating", label: "평점 높은순" },
  { key: "newest", label: "최신순" },
  { key: "title", label: "가나다순" },
];

function MovieFilter({ genreId, sort, onGenre, onSort, counts = {} }) {
  const { data: genreList } = useMovieGenreQuery();

  // 이번 페이지 결과에 실제로 들어 있는 장르만 보여줍니다.
  // 결과가 0건인 장르 버튼을 눌러 빈 화면을 보게 하지 않기 위해서입니다.
  const shown = (genreList ?? []).filter((g) => counts[g.id] > 0);

  return (
    <aside className="filter">
      {/* ── 정렬 ── */}
      <section className="filter__block">
        <h2 className="filter__label">정렬</h2>
        <div className="filter__chips">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`chip ${sort === opt.key ? "chip--on" : ""}`}
              onClick={() => onSort(opt.key)}
              aria-pressed={sort === opt.key}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 장르 ── */}
      <section className="filter__block">
        <h2 className="filter__label">
          장르
          {genreId && (
            <button type="button" className="filter__reset" onClick={() => onGenre(null)}>
              해제
            </button>
          )}
        </h2>

        {shown.length === 0 ? (
          <p className="filter__empty">표시할 장르가 없습니다</p>
        ) : (
          <div className="filter__chips">
            {shown.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`chip ${genreId === g.id ? "chip--on" : ""}`}
                onClick={() => onGenre(genreId === g.id ? null : g.id)}
                aria-pressed={genreId === g.id}
              >
                {g.name}
                <span className="chip__count">{counts[g.id]}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <p className="filter__note">
        정렬과 장르는 현재 페이지 안에서 적용됩니다.
      </p>
    </aside>
  );
}

export default MovieFilter;