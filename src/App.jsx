import { Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css"; // ⚠️ 이 줄이 없으면 부트스트랩 스타일이 하나도 안 먹습니다
import "./App.css";
import AppLayout from "./Layout/AppLayout";
import Homepage from "./pages/Homepage/Homepage";
import MoviePage from "./pages/Movies/MoviePage";
import MovieDetailPage from "./pages/MovieDetail/MovieDetailPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

// ══════════════════════════════════════════════════════════
// 라우터 구성 — Nested Route(중첩 라우트)
// ══════════════════════════════════════════════════════════
//
// ▸ 부모 Route의 element에 AppLayout을 두고, 그 안에 자식 Route를 넣습니다.
// ▸ AppLayout의 <Outlet /> 자리에 자식 페이지가 그려집니다.
//   → 내비게이션 바는 그대로, 아래 내용만 바뀝니다.
//
// ▸ index 속성
//   · "부모 경로와 똑같은 주소"라는 뜻입니다.
//   · <Route index element={<Homepage />} /> → 주소 "/" 일 때
//   · path="" 라고 쓰는 것과 같지만, index가 의도가 더 분명합니다.
//
// ▸ 주소 대응표
//   /             → AppLayout + Homepage
//   /movies       → AppLayout + MoviePage
//   /movies/550   → AppLayout + MovieDetailPage (id = "550")
//   /어쩌고저쩌고   → NotFoundPage (내비게이션 바 없음)
//
// ▸ NotFoundPage를 AppLayout 바깥에 둔 이유
//   · 잘못된 주소에서는 메뉴가 오히려 방해가 됩니다.
//   · "*" 는 위의 어느 것에도 안 맞을 때 걸리는 그물입니다. 맨 아래에 둡니다.
// ─────────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Homepage />} />

        {/* movies 아래로 계속 확장할 수 있습니다.
            나중에 reviews, recommendations 같은 하위 주소를 여기에 추가합니다. */}
        <Route path="movies">
          <Route index element={<MoviePage />} />
          <Route path=":id" element={<MovieDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;