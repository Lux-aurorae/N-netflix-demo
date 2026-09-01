import { useState } from "react";
import { Link } from "react-router";
import { usePopularMoviesQuery } from "../../../../hooks/useMovieList";
import { backdropUrl } from "../../../../utils/imageUrl";
import { tokenStatus } from "../../../../utils/api";
import Spinner from "../../../../common/Spinner/Spinner";
import Notice from "../../../../common/Notice/Notice";
import "./Banner.style.css";

// ═══════════════════════════════════════════════════════════
// 배너 — 인기 영화 1위를 크게 보여주는 영역
// ═══════════════════════════════════════════════════════════
//
// ▸ 사진과 글을 코드에 직접 적지 않습니다. (하드코딩 금지)
//   API로 받아온 목록의 첫 번째 영화를 그대로 씁니다.
//
// ▸ 화면은 네 가지 상태를 가집니다.
//   ① 토큰 없음 → 설정 안내
//   ② 불러오는 중 → 스피너
//   ③ 실패       → 원인과 해결 방법 안내
//   ④ 성공       → 배너
// ─────────────────────────────────────────────────────────
function Banner() {
  const { data, isLoading, isError, error } = usePopularMoviesQuery();
  const [imgLoaded, setImgLoaded] = useState(false);

  // ── ① 토큰이 아예 없을 때 ──────────────────────────────
  // API를 부르기도 전에 알 수 있으므로 가장 먼저 확인합니다.
  if (tokenStatus === "missing") {
    return (
      <section className="banner banner--placeholder">
        <Notice
          title="API 토큰이 설정되지 않았습니다"
          steps={[
            "로컬: 최상단에 .env 파일을 만들고 VITE_TMDB_TOKEN=토큰 을 넣으세요.",
            "로컬: .env를 고친 뒤 개발 서버를 반드시 재시작하세요.",
            "배포: Vercel → Settings → Environment Variables 에 VITE_TMDB_TOKEN 을 추가하세요.",
            "배포: 저장 후 Deployments → ⋯ → Redeploy 를 눌러야 반영됩니다.",
          ]}
        />
      </section>
    );
  }

  // ── 토큰 형식이 잘못된 경우 ────────────────────────────
  if (tokenStatus === "wrong-type") {
    return (
      <section className="banner banner--placeholder">
        <Notice
          tone="error"
          title="토큰 형식이 올바르지 않습니다"
          steps={[
            "TMDB의 짧은 API Key(32자)가 아니라 API Read Access Token 이 필요합니다.",
            "eyJhbGci... 로 시작하는 긴 문자열을 넣으세요.",
            "themoviedb.org → Settings → API 에서 확인할 수 있습니다.",
          ]}
        />
      </section>
    );
  }

  // ── ② 불러오는 중 ──────────────────────────────────────
  if (isLoading) {
    return (
      <section className="banner banner--placeholder">
        <Spinner label="오늘의 작품을 불러오는 중" fullPage />
      </section>
    );
  }

  // ── ③ 실패 ─────────────────────────────────────────────
  if (isError) {
    const status = error?.response?.status;
    return (
      <section className="banner banner--placeholder">
        <Notice
          tone="error"
          title={
            status === 401
              ? "토큰이 거부되었습니다 (401)"
              : `영화를 불러오지 못했습니다${status ? ` (${status})` : ""}`
          }
          steps={
            status === 401
              ? [
                  "토큰이 만료되었거나 잘못 입력되었습니다.",
                  "TMDB에서 토큰을 다시 발급받아 넣어보세요.",
                  "배포 환경이라면 Vercel 환경변수를 수정한 뒤 Redeploy 하세요.",
                ]
              : [
                  error?.message ?? "네트워크 상태를 확인해 주세요.",
                  "F12 → Console 에서 자세한 오류를 볼 수 있습니다.",
                ]
          }
        />
      </section>
    );
  }

  // ── ④ 성공 ─────────────────────────────────────────────
  //
  // ⚠️ 옵셔널 체이닝(?.)이 중요합니다.
  //    data가 없을 때 data.results[0] 이라고 쓰면
  //    "Cannot read properties of undefined" 로 화면이 하얗게 됩니다.
  const movie = data?.results?.[0];

  if (!movie) {
    return (
      <section className="banner banner--placeholder">
        <p className="banner__empty">표시할 작품이 없습니다.</p>
      </section>
    );
  }

  const bg = backdropUrl(movie, "original");
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;

  return (
    <section className="banner">
      {/* 배경 사진.
          <img>로 넣는 이유
          · onLoad로 "다 받아졌다"를 알 수 있어 부드럽게 띄울 수 있음
          · alt를 줄 수 있어 접근성에 유리
          background-image 로는 두 가지 다 안 됩니다. */}
      {bg && (
        <img
          className={`banner__img ${imgLoaded ? "is-loaded" : ""}`}
          src={bg}
          alt=""
          onLoad={() => setImgLoaded(true)}
          fetchPriority="high"
        />
      )}

      {/* 글자가 사진 위에서도 읽히도록 어둡게 덮는 층 */}
      <div className="banner__shade" aria-hidden="true" />

      <div className="banner__body">
        <p className="banner__rank">
          <span className="banner__rank-dot" />
          오늘의 인기 1위
        </p>

        <h1 className="banner__title">{movie.title}</h1>

        <div className="banner__meta">
          {rating && (
            <span className="banner__score">
              <strong>{rating}</strong>
              <span className="banner__score-max">/10</span>
            </span>
          )}
          {year && <span>{year}</span>}
          {movie.adult && <span className="banner__badge">청소년 관람불가</span>}
        </div>

        {/* 줄거리는 CSS에서 줄 수를 제한합니다.
            제한하지 않으면 모바일에서 글이 화면 밖으로 넘칩니다. */}
        {movie.overview && <p className="banner__overview">{movie.overview}</p>}

        <div className="banner__actions">
          <Link to={`/movies/${movie.id}`} className="btn btn--primary">
            상세 정보
          </Link>
          <Link to="/movies" className="btn btn--ghost">
            전체 작품
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Banner;