import { useParams, Link } from "react-router";
import "./MovieDetailPage.style.css";

// ═══════════════════════════════════════════════════════════
// 영화 상세 페이지
// ═══════════════════════════════════════════════════════════
//
// ▸ 주소가 /movies/:id 형태입니다. (REST 규칙)
//   · /movies      → 목록
//   · /movies/550  → 550번 영화 상세
// ▸ useParams()가 주소의 :id 부분을 객체로 돌려줍니다. { id: "550" }
// ▸ 실제 상세 정보는 다음 강의에서 API로 불러옵니다.
// ─────────────────────────────────────────────────────────
function MovieDetailPage() {
  const { id } = useParams();

  return (
    <div className="detail">
      <Link to="/movies" className="detail__back">
        ← 목록으로
      </Link>

      <div className="detail__grid">
        <div className="poster poster--empty detail__poster" />

        <div>
          <p className="detail__eyebrow">Movie Detail</p>
          <h1 className="detail__title">상세 페이지</h1>
          <p className="detail__desc">
            주소에서 읽어온 영화 번호는 <strong>{id}</strong> 입니다.
            다음 강의에서 이 번호로 API를 호출해 줄거리 · 평점 · 예고편을 채웁니다.
          </p>

          <dl className="specs">
            {["평점", "관람등급", "상영시간", "개봉일"].map((label) => (
              <div key={label} className="specs__row">
                <dt>{label}</dt>
                <dd>—</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;