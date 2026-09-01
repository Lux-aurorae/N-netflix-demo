import Banner from "./components/Banner/Banner";
import MovieSlider from "../../common/MovieSlider/MovieSlider";
import {
  usePopularMoviesQuery,
  useTopRatedMoviesQuery,
  useUpcomingMoviesQuery,
} from "../../hooks/useMovieList";
import { CAROUSEL_RESPONSIVE } from "../../constants/responsive";
import "./Homepage.style.css";

// ═══════════════════════════════════════════════════════════
// 홈 화면
// ═══════════════════════════════════════════════════════════
//
// ▸ 이 파일에는 "로직"만 남아 있습니다.
//   · 어떤 데이터를 가져올지 (훅 3개)
//   · 어떤 순서로 배치할지
//   화면을 그리는 일은 전부 common 의 컴포넌트가 맡습니다.
//
// ▸ 세 섹션이 MovieSlider 하나를 돌려 씁니다.
//   같은 코드를 세 번 복사했다면
//   · 디자인을 고칠 때 세 곳을 고쳐야 하고
//   · 한 곳만 고치면 화면이 서로 어긋납니다
//
// ▸ 훅은 여기서 부릅니다.
//   훅은 조건문·반복문 안에서 부를 수 없다는 규칙이 있어,
//   컴포넌트 맨 위에서 나란히 부르고 결과만 넘깁니다.
//
// ▸ 배너와 Popular 슬라이더는 같은 API를 씁니다.
//   그런데 실제 호출은 한 번만 일어납니다.
//   리액트 쿼리가 같은 queryKey를 캐시에서 꺼내 쓰기 때문입니다.
// ─────────────────────────────────────────────────────────
function Homepage() {
  const popular = usePopularMoviesQuery();
  const topRated = useTopRatedMoviesQuery();
  const upcoming = useUpcomingMoviesQuery();

  return (
    <div className="home">
      <Banner />

      <MovieSlider
        title="Popular Movies"
        desc="지금 가장 많이 보는 작품"
        movies={popular.data?.results ?? []}
        responsive={CAROUSEL_RESPONSIVE}
        isLoading={popular.isLoading}
        isError={popular.isError}
        error={popular.error}
      />

      <MovieSlider
        title="Top Rated Movies"
        desc="평점이 가장 높은 작품"
        movies={topRated.data?.results ?? []}
        responsive={CAROUSEL_RESPONSIVE}
        isLoading={topRated.isLoading}
        isError={topRated.isError}
        error={topRated.error}
      />

      <MovieSlider
        title="Upcoming Movies"
        desc="곧 개봉하는 작품"
        movies={upcoming.data?.results ?? []}
        responsive={CAROUSEL_RESPONSIVE}
        isLoading={upcoming.isLoading}
        isError={upcoming.isError}
        error={upcoming.error}
      />
    </div>
  );
}

export default Homepage;