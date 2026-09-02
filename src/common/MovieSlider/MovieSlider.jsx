import * as CarouselModule from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // 라이브러리 기본 스타일 (필수)
import MovieCard from "../MovieCard/MovieCard";
import Spinner from "../Spinner/Spinner";
import Notice from "../Notice/Notice";
import { resolveDefault } from "../../utils/interop";
import "./MovieSlider.style.css";

// ⚠️ react-multi-carousel 은 CommonJS 방식으로 만들어진 라이브러리입니다.
//    Vite가 브라우저용으로 바꿀 때 환경에 따라
//    ① 함수 그대로 들어오거나  ② { default: 함수 } 로 한 겹 감싸져 들어옵니다.
//    ②인데 그냥 쓰면 "Element type is invalid ... but got: object" 오류가 납니다.
//    아래 한 줄로 양쪽을 모두 처리합니다.
const Carousel = resolveDefault(CarouselModule);

// ═══════════════════════════════════════════════════════════
// 영화 슬라이더 — 공통 컴포넌트
// ═══════════════════════════════════════════════════════════
//
// ▸ 왜 common 폴더에 있나
//   · 홈 화면의 세 섹션이 모두 이 하나를 씁니다.
//   · 나중에 상세 페이지의 "관련 영화"에서도 그대로 쓸 수 있습니다.
//   · 특정 페이지에서만 쓰는 컴포넌트는 그 페이지 폴더에,
//     여러 곳에서 쓸 컴포넌트는 common 에 두는 것이 실무 관행입니다.
//
// ▸ 이 컴포넌트는 데이터를 직접 가져오지 않습니다.
//   "그리는 일"만 하고, 무엇을 그릴지는 props로 받습니다.
//   덕분에 popular든 top_rated든 상관없이 재사용됩니다.
//
// ▸ props
//   · title      … 섹션 제목 (예: "Popular Movies")
//   · desc       … 부제 (없으면 생략)
//   · movies     … 보여줄 영화 배열 (data.results)
//   · responsive … 화면 크기별 카드 수 설정
//   · isLoading / isError / error … 상태 표시용
// ─────────────────────────────────────────────────────────
function MovieSlider({ title, desc, movies = [], responsive, isLoading, isError, error }) {
  return (
    <section className="slider">
      <header className="slider__head">
        <div>
          <h2 className="slider__title">{title}</h2>
          {desc && <p className="slider__desc">{desc}</p>}
        </div>
      </header>

      {/* ── 불러오는 중 ── */}
      {isLoading && (
        <div className="slider__state">
          <Spinner label={`${title} 불러오는 중`} />
        </div>
      )}

      {/* ── 실패 ── */}
      {!isLoading && isError && (
        <div className="slider__state">
          <Notice
            tone="error"
            title={`${title} 을(를) 불러오지 못했습니다${
              error?.response?.status ? ` (${error.response.status})` : ""
            }`}
            steps={[
              error?.response?.status === 401
                ? "API 토큰을 확인해 주세요. 배포 환경이라면 Vercel 환경변수와 Redeploy를 확인하세요."
                : (error?.message ?? "네트워크 상태를 확인해 주세요."),
            ]}
          />
        </div>
      )}

      {/* ── 성공 ── */}
      {!isLoading && !isError && (
        <Carousel
          responsive={responsive}
          infinite                     /* 끝에서 처음으로 이어짐 */
          draggable                    /* 마우스로 끌어서 넘기기 */
          swipeable                    /* 터치로 넘기기 */
          partialVisible               /* 오른쪽 카드를 살짝 보여줘 "더 있음"을 알림 */
          keyBoardControl              /* 방향키로 넘기기 */
          minimumTouchDrag={60}        /* 살짝 스쳐도 넘어가지 않게 */
          containerClass="slider__track"
          itemClass="slider__item"
          // 좁은 화면에서는 화살표를 숨깁니다.
          // 손가락으로 넘기면 되고, 화살표가 카드를 가리기 때문입니다.
          removeArrowOnDeviceType={["mobile", "tablet"]}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Carousel>
      )}
    </section>
  );
}

export default MovieSlider;
