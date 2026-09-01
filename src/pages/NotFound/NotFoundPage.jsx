import { Link } from "react-router";

// ═══════════════════════════════════════════════════════════
// 404 페이지
// ═══════════════════════════════════════════════════════════
//
// ▸ App.jsx의 라우트에서 AppLayout "바깥"에 두었습니다.
// ▸ 그래서 이 화면에는 내비게이션 바가 나오지 않습니다.
// ▸ 잘못된 주소로 들어온 사람에게는 메뉴보다 "돌아가는 길"이 필요합니다.
// ─────────────────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="notfound">
      <p className="notfound__code">404</p>
      <h1 className="notfound__title">페이지를 찾을 수 없습니다</h1>
      <p className="notfound__desc">
        주소가 바뀌었거나 삭제된 페이지일 수 있습니다.
      </p>
      <Link to="/" className="btn btn--primary">
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default NotFoundPage;