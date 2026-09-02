import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMovieDetailQuery } from "../../hooks/useMovieDetail";
import { backdropUrl, posterUrl } from "../../utils/imageUrl";
import MovieCard from "../../common/MovieCard/MovieCard";
import Notice from "../../common/Notice/Notice";
import ReviewCard from "./components/ReviewCard";
import TrailerModal from "./components/TrailerModal";
import "./MovieDetailPage.style.css";

const money = (value) => value
  ? new Intl.NumberFormat("ko-KR", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
  : "정보 없음";

const runtime = (minutes) => minutes ? `${Math.floor(minutes / 60)}시간 ${minutes % 60}분` : "정보 없음";

function getCertification(movie) {
  const korean = movie.release_dates?.results?.find((item) => item.iso_3166_1 === "KR");
  return korean?.release_dates?.find((item) => item.certification)?.certification || "등급 정보 없음";
}

function selectTrailer(videos = []) {
  const youtube = videos.filter((video) => video.site === "YouTube");
  return youtube.find((video) => video.official && video.type === "Trailer")
    ?? youtube.find((video) => video.type === "Trailer")
    ?? youtube[0]
    ?? null;
}

function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, error } = useMovieDetailQuery(id);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [shareLabel, setShareLabel] = useState("공유");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("netflix-watchlist") || "[]");
    setIsSaved(saved.includes(Number(id)));
  }, [id]);

  const trailer = useMemo(() => selectTrailer(movie?.videos), [movie?.videos]);
  const recommendations = movie?.recommendations?.results?.slice(0, 6) ?? [];
  const closeTrailer = useCallback(() => setActiveTrailer(null), []);

  const toggleWatchlist = () => {
    const movieId = Number(id);
    const saved = JSON.parse(localStorage.getItem("netflix-watchlist") || "[]");
    const next = saved.includes(movieId) ? saved.filter((savedId) => savedId !== movieId) : [...saved, movieId];
    localStorage.setItem("netflix-watchlist", JSON.stringify(next));
    setIsSaved(next.includes(movieId));
  };

  const share = async () => {
    const shareData = { title: movie?.title, text: `${movie?.title} 영화 정보`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
      setShareLabel(navigator.share ? "공유 완료" : "링크 복사됨");
      window.setTimeout(() => setShareLabel("공유"), 1800);
    } catch (shareError) {
      if (shareError.name !== "AbortError") setShareLabel("다시 시도");
    }
  };

  if (isLoading) {
    return <div className="detail detail--loading" aria-label="영화 상세정보 불러오는 중"><div className="detail-skeleton detail-skeleton--hero" /><div className="detail-skeleton detail-skeleton--line" /></div>;
  }

  if (isError) {
    return (
      <div className="detail detail--state">
        <Notice tone="error" title="영화 정보를 불러오지 못했습니다" steps={[error?.response?.status === 404 ? "존재하지 않는 영화입니다." : error?.message]} />
        <button className="detail__action detail__action--ghost" type="button" onClick={() => navigate(-1)}>이전 화면</button>
      </div>
    );
  }

  const backdrop = backdropUrl(movie, "original");
  const poster = posterUrl(movie, "w500");

  return (
    <div className="detail">
      <section className="detail-hero" style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}>
        <div className="detail-hero__shade" />
        <Link to="/movies" className="detail__back">← 영화 목록</Link>
        <div className="detail-hero__content">
          <div className="detail__poster-wrap">
            {poster ? <img className="detail__poster" src={poster} alt={`${movie.title} 포스터`} /> : <div className="detail__poster detail__poster--empty">No poster</div>}
          </div>
          <div className="detail__summary">
            <p className="detail__eyebrow">{movie.status === "Released" ? "Now streaming" : movie.status}</p>
            <h1 className="detail__title">{movie.title}</h1>
            {movie.original_title !== movie.title && <p className="detail__original">{movie.original_title}</p>}
            <div className="detail__genres">{movie.genres?.map((genre) => <span key={genre.id}>{genre.name}</span>)}</div>
            <div className="detail__highlights">
              <span className="detail__score">★ {movie.vote_average?.toFixed(1)}</span>
              <span>{movie.release_date?.slice(0, 4) || "미정"}</span>
              <span>{runtime(movie.runtime)}</span>
              <span>{getCertification(movie)}</span>
            </div>
            {movie.tagline && <p className="detail__tagline">“{movie.tagline}”</p>}
            <p className="detail__overview">{movie.overview || "등록된 줄거리가 없습니다."}</p>
            <div className="detail__actions">
              {trailer && <button className="detail__action detail__action--play" type="button" onClick={() => setActiveTrailer(trailer)}>▶ 예고편 재생</button>}
              <button className={`detail__action detail__action--ghost ${isSaved ? "is-saved" : ""}`} type="button" onClick={toggleWatchlist} aria-pressed={isSaved}>{isSaved ? "✓ 찜 완료" : "+ 찜하기"}</button>
              <button className="detail__action detail__action--ghost" type="button" onClick={share}>{shareLabel}</button>
            </div>
          </div>
        </div>
      </section>

      <main className="detail__content">
        <section className="detail-section" aria-labelledby="facts-heading">
          <div className="detail-section__head"><p>Behind the film</p><h2 id="facts-heading">작품 정보</h2></div>
          <dl className="facts">
            <div><dt>개봉일</dt><dd>{movie.release_date || "미정"}</dd></div>
            <div><dt>인기도</dt><dd>{movie.popularity?.toLocaleString("ko-KR") || "정보 없음"}</dd></div>
            <div><dt>예산</dt><dd>{money(movie.budget)}</dd></div>
            <div><dt>수익</dt><dd>{money(movie.revenue)}</dd></div>
            <div><dt>제작국가</dt><dd>{movie.production_countries?.map((country) => country.name).join(", ") || "정보 없음"}</dd></div>
            <div><dt>제작사</dt><dd>{movie.production_companies?.slice(0, 3).map((company) => company.name).join(", ") || "정보 없음"}</dd></div>
          </dl>
        </section>

        <section className="detail-section" aria-labelledby="reviews-heading">
          <div className="detail-section__head detail-section__head--row"><div><p>Audience voices</p><h2 id="reviews-heading">리뷰</h2></div><span>{movie.reviews.length} reviews</span></div>
          {movie.reviews.length > 0 ? <div className="reviews">{movie.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div> : <div className="detail-empty">아직 등록된 리뷰가 없습니다.</div>}
        </section>

        {recommendations.length > 0 && (
          <section className="detail-section" aria-labelledby="recommend-heading">
            <div className="detail-section__head"><p>Because you watched this</p><h2 id="recommend-heading">함께 볼 만한 영화</h2></div>
            <div className="recommend-grid">{recommendations.map((item) => <MovieCard key={item.id} movie={item} />)}</div>
          </section>
        )}
      </main>
      <TrailerModal video={activeTrailer} onClose={closeTrailer} />
    </div>
  );
}

export default MovieDetailPage;
