import ReactPaginate from "react-paginate";
import "./Pager.style.css";

// ═══════════════════════════════════════════════════════════
// 페이지네이션
// ═══════════════════════════════════════════════════════════
//
// ▸ react-paginate 는 0부터 세고, 우리는 1부터 셉니다.
//   그래서 넘겨줄 때 -1, 받을 때 +1 을 합니다.
//   · forcePage={page - 1}
//   · onPageChange 의 selected + 1
//   이 보정을 빠뜨리면 한 페이지씩 어긋납니다.
//
// ▸ props
//   · page       … 현재 페이지 (1부터)
//   · totalPages … 전체 페이지 수
//   · onChange   … 페이지가 바뀌었을 때 부를 함수
// ─────────────────────────────────────────────────────────
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
        // 라이브러리가 만드는 태그에 클래스를 붙여 CSS로 꾸밉니다.
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