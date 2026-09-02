import * as PaginateModule from "react-paginate";
import { resolveDefault } from "../../../../utils/interop";
import "./Pager.style.css";

// ⚠️ react-paginate 는 UMD(CommonJS 겸용) 방식으로 만들어진 라이브러리입니다.
//    Vite가 브라우저용으로 바꿀 때 환경에 따라
//    ① 함수 그대로 들어오거나  ② { default: 함수 } 로 한 겹 감싸져 들어옵니다.
//
//    ②인데 그냥 쓰면 이런 오류가 나고 화면이 통째로 비어 버립니다.
//      "Element type is invalid: ... but got: object"
//
//    아래 한 줄로 양쪽 경우를 모두 처리합니다.
//    (?? 는 앞이 없을 때만 뒤를 쓰는 연산자입니다)
//    react-multi-carousel 도 같은 이유로 같은 처리를 해 두었습니다.
const ReactPaginate = resolveDefault(PaginateModule, ["ReactPaginate"]);

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

  // 잘못된 라이브러리 import가 다시 생겨도 React #130의 검은 화면 대신
  // 개발자가 원인을 바로 알 수 있는 오류를 남깁니다.
  if (!ReactPaginate) {
    throw new Error("react-paginate 컴포넌트를 불러오지 못했습니다.");
  }

  return (
    <nav className="pager" aria-label="페이지 이동">
      <ReactPaginate
        // ── 화면에 보이는 글자 ──
        previousLabel="‹"
        nextLabel="›"
        previousAriaLabel="이전 페이지"
        nextAriaLabel="다음 페이지"
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