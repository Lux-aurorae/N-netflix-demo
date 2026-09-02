import PaginateModule from "react-paginate";
import "./Pager.style.css";

// 기존 resolveDefault 함수가 환경에 따라 실패하여 Error #130을 유발하고 있습니다.
// interop.js 의존성을 제거하고 직접 안전하게 default 컴포넌트를 추출합니다.
const ReactPaginate = PaginateModule.default || PaginateModule;

// ═══════════════════════════════════════════════════════════
// 페이지네이션
// ═══════════════════════════════════════════════════════════
function Pager({ page, totalPages, onChange }) {
  // 페이지가 하나뿐이면 굳이 보여줄 필요가 없습니다.
  if (!totalPages || totalPages <= 1) return null;

  return (
    <nav className="pager" aria-label="페이지 이동">
      <ReactPaginate
        // ── 화면에 보이는 글자 ──
        previousLabel="‹"
        nextLabel="›"
        breakLabel="…"

        // ── 동작 ──
        pageCount={totalPages}
        forcePage={page - 1}                    /* 0부터 세므로 -1 */
        onPageChange={(e) => onChange(e.selected + 1)}  /* 받을 때 +1 */
        marginPagesDisplayed={1}                /* 양 끝에 보여줄 페이지 수 */
        pageRangeDisplayed={2}                  /* 현재 페이지 좌우로 보여줄 수 */
        disableInitialCallback                  /* 처음 렌더될 때 콜백 안 부름 */

        // ── 스타일용 클래스 ──
        containerClassName="pager__list"
        pageClassName="pager__item"
        pageLinkClassName="pager__link"
        previousClassName="pager__item"
        previousLinkClassName="pager__link pager__link--arrow"
        nextClassName="pager__item"
        nextLinkClassName="pager__link pager__link--arrow"
        breakClassName="pager__item"
        breakLinkClassName="pager__link pager__link--break"
        activeClassName="is-active"
        disabledClassName="is-disabled"
      />

      <p className="pager__info">
        {page} / {totalPages} 페이지
      </p>
    </nav>
  );
}

export default Pager;