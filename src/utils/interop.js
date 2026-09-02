// ═══════════════════════════════════════════════════════════
// 라이브러리 import 껍질 벗기기
// ═══════════════════════════════════════════════════════════
//
// ▸ 왜 필요한가
//   오래된 라이브러리는 CommonJS/UMD 방식으로 만들어져 있습니다.
//   Vite가 이를 브라우저용으로 바꿀 때, 환경에 따라
//     ① 함수 그대로 들어오거나
//     ② { default: 함수 } 로 한 겹 감싸져 들어옵니다.
//
//   ②인데 그냥 쓰면 React가 이런 오류를 냅니다.
//     "Element type is invalid: ... but got: object"
//     (배포 빌드에서는 짧게 "Minified React error #130" 으로 나옵니다)
//   그리고 화면이 통째로 비어 버립니다.
//
// ▸ 이 함수는 껍질을 최대 두 겹까지 벗겨 진짜 컴포넌트를 꺼냅니다.
//   ({ default: { default: 함수 } } 로 두 번 감싸지는 경우도 있습니다)
//
// ▸ 쓰는 법
//     import Mod from "react-paginate";
//     const ReactPaginate = resolveDefault(Mod);
// ─────────────────────────────────────────────────────────
export function resolveDefault(mod) {
  let c = mod;

  // 함수가 나올 때까지 default 를 따라 들어갑니다. (최대 3번)
  for (let i = 0; i < 3; i++) {
    if (typeof c === "function") return c;
    if (c && typeof c === "object" && "default" in c) {
      c = c.default;
      continue;
    }
    break;
  }

  return c;
}

export default resolveDefault;