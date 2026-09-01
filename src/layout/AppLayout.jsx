import { useState, useEffect } from "react";
import { Outlet, Link, NavLink, useNavigate, useSearchParams } from "react-router";
import { Container, Nav, Navbar, Form } from "react-bootstrap";
import Logo from "../common/Logo";
import "./AppLayout.style.css";

// ══════════════════════════════════════════════════════════
// 공통 레이아웃 — 모든 페이지에 함께 보이는 껍데기
// ══════════════════════════════════════════════════════════
//
// ▸ 내비게이션 바 + <Outlet /> 구조입니다.
// ▸ <Outlet />은 "자식 라우트가 그려질 자리"를 표시하는 표식입니다.
//   · 주소가 /        → Outlet 자리에 Homepage
//   · 주소가 /movies  → Outlet 자리에 MoviePage
//   · 내비게이션 바는 그대로 남습니다.
// ▸ 페이지마다 <NavBar />를 넣으면 코드가 중복되고,
//   화면을 옮길 때마다 새로 그려져 깜빡입니다.
// ─────────────────────────────────────────────────────────
function AppLayout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 주소의 ?q=검색어를 읽어 입력칸 초기값으로 씁니다.
  // 새로고침해도 검색어가 유지됩니다.
  const [keyword, setKeyword] = useState(searchParams.get("query") ?? "");

  // 스크롤을 내리면 내비게이션 바에 배경을 깝니다.
  // 맨 위에서는 투명해 배너가 시원하게 보이고,
  // 내려가면 글자가 콘텐츠와 겹쳐 안 읽히는 것을 막습니다.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); // 새로고침 시 이미 내려가 있을 수 있으므로 한 번 실행
    window.addEventListener("scroll", onScroll, { passive: true });
    // 컴포넌트가 사라질 때 이벤트를 반드시 정리합니다.
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 검색: 엔터를 누르면 /movies?query=검색어 로 이동합니다.
  // ▸ 검색 결과를 주소에 남기면 새로고침·뒤로가기·링크 공유가 모두 됩니다.
  // ▸ useState에만 담아두면 새로고침하는 순간 사라집니다.
  const search = (event) => {
    event.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/movies?query=${encodeURIComponent(q)}` : "/movies");
  };

  return (
    <div className="app">
      {/* variant="dark" 를 주지 않으면 부트스트랩이 밝은 테마용 글자색을 넣어
          검은 배경에서 메뉴가 안 보입니다. */}
      <Navbar expand="lg" variant="dark" className={`nav ${scrolled ? "nav--solid" : ""}`}>
        <Container fluid className="nav__inner">
          {/* ── 로고 ── 클릭하면 홈으로 ── */}
          <Navbar.Brand as={Link} to="/" className="nav__brand">
            <Logo height={26} />
          </Navbar.Brand>

          {/* 모바일 햄버거 버튼 */}
          <Navbar.Toggle aria-controls="main-nav" className="nav__toggle" />

          <Navbar.Collapse id="main-nav">
            {/* ── 메뉴 ── NavLink는 현재 주소와 같으면 active 클래스를 붙여줍니다 ── */}
            <Nav className="nav__menu">
              <Nav.Link
                as={NavLink}
                to="/"
                end          /* end가 없으면 /movies에서도 Home이 활성화됩니다 */
                className="nav__link"
              >
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/movies" className="nav__link">
                Movies
              </Nav.Link>
            </Nav>

            {/* ── 검색창 ── */}
            <Form className="search" onSubmit={search} role="search">
              <svg
                className="search__icon"
                width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>

              <input
                className="search__input"
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="제목, 배우, 장르 검색"
                aria-label="영화 검색"
              />
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 자식 라우트가 그려지는 자리 */}
      <main className="main">
        <Outlet />
      </main>

      <footer className="foot">
        <Logo height={20} />
        <p className="foot__text">
          이 사이트는 학습용 클론 프로젝트입니다. 영화 정보는 TMDB에서 제공합니다.
        </p>
      </footer>
    </div>
  );
}

export default AppLayout;