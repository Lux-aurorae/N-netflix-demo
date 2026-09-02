아래처럼 작성하면 강사님의 피드백에 재치 있게 답하면서도, 문제 원인과 해결 과정을 논리적으로 전달할 수 있습니다.

---

## 【제목】 ⚖️ 이의 있습니다! 검색하면 화면이 사라지는 React #130 오류 해결 과정

### ■ 1. 이의 제기

강사님께서 말씀하셨습니다.

> “오늘 과제는 Fail이 많습니다! 테스트를 몇 번 해봤으면 찾을 수 있는 에러들입니다!”

⚖️ **이의 있습니다!**

테스트를 하지 않은 것이 아니라, 로컬 개발 환경에서는 정상적으로 보였지만 Vercel 배포 환경에서만 발생하는 **모듈 import 방식의 차이**로 인해 뒤늦게 발견된 오류였습니다.

물론 최종 배포 환경까지 충분히 확인하지 못한 점은 인정합니다. 이후에는 로컬 실행만 확인하지 않고, 프로덕션 빌드와 실제 배포 화면까지 점검하겠습니다.

---

### ■ 2. 프로젝트 환경

* React 19
* Vite 8
* TanStack React Query
* React Router
* React Paginate
* TMDB API
* Vercel 배포

※ 현재 GitHub 저장소의 `package.json`을 기준으로 확인했습니다. 기존에 작성한 React 18·Vite 5가 아니라 **React 19·Vite 8**입니다.

---

### ■ 3. 발생한 문제

Movies 메뉴에서 인기 영화 목록은 표시됐지만, 검색하거나 페이지를 이동하면 화면 전체가 비어 버렸습니다.

콘솔에는 다음 오류가 발생했습니다.

```text
Uncaught Error: Minified React error #130
Element type is invalid:
expected a string or a class/function but got: object.
```

[React 공식 오류 문서](https://react.dev/errors/130)에 따르면 React #130은 JSX에서 렌더링하려는 대상이 정상적인 컴포넌트가 아니라 객체일 때 발생합니다.

따라서 처음에는 검색 API 문제로 보였지만, 실제 원인은 CORS나 TMDB API 호출이 아니라 **페이지네이션 컴포넌트를 불러오는 방식**에 있었습니다.

---

### ■ 4. 주요 원인

#### 원인 ① `react-paginate` import 결과가 객체로 전달됨

개발 환경과 Vercel 프로덕션 번들에서 CommonJS·UMD 모듈을 처리하는 방식에 차이가 생기면서 `ReactPaginate`가 함수형 컴포넌트가 아닌 다음과 같은 객체 형태로 전달될 수 있었습니다.

```js
{
  default: ReactPaginate
}
```

이 객체를 다음과 같이 JSX에서 바로 렌더링하면서 React #130 오류가 발생했습니다.

```jsx
<ReactPaginate />
```

즉, 검색 버튼이 직접 문제를 일으킨 것이 아니라 검색 결과가 표시된 뒤 함께 렌더링되는 **페이지네이션 컴포넌트에서 화면이 중단된 것**이었습니다.

#### 수정 방법

`react-paginate` 모듈에서 실제 컴포넌트 함수를 꺼내도록 수정했습니다.

```jsx
import * as PaginateModule from "react-paginate";
import { resolveDefault } from "../../../../utils/interop";

const ReactPaginate = resolveDefault(
  PaginateModule,
  ["ReactPaginate"]
);
```

`resolveDefault()`에서는 모듈 자체와 `default` 속성을 확인해 실제 함수형 컴포넌트를 반환하도록 처리했습니다.

```js
export function resolveDefault(mod, exportNames = []) {
  const queue = [mod];
  const seen = new Set();

  while (queue.length > 0) {
    const candidate = queue.shift();

    if (typeof candidate === "function") {
      return candidate;
    }

    if (
      !candidate ||
      typeof candidate !== "object" ||
      seen.has(candidate)
    ) {
      continue;
    }

    seen.add(candidate);

    for (const key of [
      ...exportNames,
      "default",
      "module.exports",
    ]) {
      if (key in candidate) {
        queue.push(candidate[key]);
      }
    }
  }

  return null;
}
```

---

### ■ 5. 검색 API 수정

검색어가 없을 때와 있을 때 서로 다른 TMDB API를 호출하도록 분리했습니다.

```js
const fetchSearchMovie = async ({ keyword, page }) => {
  const params = new URLSearchParams({
    language: "ko-KR",
    page: String(page),
  });

  let path;

  if (keyword) {
    params.set("query", keyword);
    path = "/search/movie";
  } else {
    path = "/movie/popular";
  }

  const res = await api.get(
    `${path}?${params.toString()}`
  );

  return res.data;
};
```

호출 결과는 다음과 같습니다.

```text
검색어 없음
→ /movie/popular?language=ko-KR&page=1

검색어 있음
→ /search/movie?language=ko-KR&page=1&query=검색어
```

문자열을 직접 이어 붙이지 않고 `URLSearchParams`를 사용해 한글, 공백, 특수문자가 자동으로 인코딩되도록 했습니다. [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)에 따르면 이 객체는 URL 쿼리 문자열을 안전하게 생성하고 수정하는 메서드를 제공합니다.

---

### ■ 6. 페이지네이션 수정

#### 문제점

`react-paginate`는 페이지 번호를 `0`부터 계산하지만 TMDB API는 `1`부터 계산합니다.

이 차이를 보정하지 않으면 선택한 페이지와 실제 요청 페이지가 한 칸씩 어긋납니다.

#### 수정 방법

```jsx
<ReactPaginate
  pageCount={totalPages}
  forcePage={page - 1}
  onPageChange={(event) =>
    onChange(event.selected + 1)
  }
  disableInitialCallback
/>
```

* 화면 상태 `page`를 전달할 때: `page - 1`
* 클릭 결과를 API에 전달할 때: `selected + 1`
* 최초 렌더링의 불필요한 페이지 변경 방지: `disableInitialCallback`

또한 TMDB에서 조회 가능한 페이지 범위를 고려하여 최대 500페이지로 제한했습니다.

```js
totalPages: Math.min(
  data?.total_pages ?? 0,
  500
)
```

---

### ■ 7. 검색어와 페이지를 주소에 저장

기존에는 페이지 번호를 단순한 `useState`로 관리할 수 있었지만, 수정 후에는 `useSearchParams`를 사용했습니다.

```text
/movies?query=마블&page=3
```

```js
const [query, setQuery] = useSearchParams();

const keyword =
  (query.get("query") ?? "").trim();

const requestedPage =
  Number(query.get("page"));

const page =
  Number.isInteger(requestedPage) &&
  requestedPage > 0
    ? requestedPage
    : 1;
```

이렇게 수정한 결과:

* 새로고침해도 검색어와 페이지 유지
* 뒤로가기·앞으로가기 정상 작동
* 현재 검색 결과 URL 공유 가능
* 새로운 검색 시 1페이지부터 시작
* 잘못된 페이지 번호 입력 시 정상 범위로 보정

---

### ■ 8. React Query 캐시 기준 수정

검색어만 `queryKey`에 넣으면 페이지가 변경되어도 새로운 데이터를 요청하지 않을 수 있습니다. 따라서 검색어와 페이지 번호를 모두 포함했습니다.

```js
useQuery({
  queryKey: [
    "movies-search",
    keyword,
    page,
  ],
  queryFn: () =>
    fetchSearchMovie({ keyword, page }),
});
```

TanStack Query 공식 문서에서도 데이터 요청에 영향을 주는 변수를 `queryKey`에 포함하도록 안내합니다. 이를 통해 검색어·페이지 조합별로 데이터를 구분하고 캐시할 수 있습니다. [TanStack Query 공식 문서](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)

---

### ■ 9. 수정 및 검증 결과

수정 후 다음 항목을 확인했습니다.

* 인기 영화 목록 출력
* 영화 검색 결과 출력
* 검색 결과가 없을 때 안내 문구 출력
* 이전·다음 페이지 이동
* 페이지 번호와 API 요청 번호 일치
* 검색어 변경 시 1페이지 초기화
* 새로고침 후 검색 상태 유지
* 프로덕션 빌드 성공
* React #130으로 인한 전체 화면 중단 방지

실제로 다음 명령으로 프로덕션 빌드도 확인했습니다.

```bash
npm run build
```

```text
✓ 547 modules transformed
✓ built successfully
```

린트 검사도 오류 없이 완료됐으며, 일부 개선 권고 수준의 경고만 남아 있는 상태입니다.

---

### ■ 10. 이번 오류를 통해 배운 점

이번 문제를 해결하면서 다음 내용을 배웠습니다.

1. 로컬 개발 서버에서 정상 작동한다고 해서 배포 환경에서도 반드시 정상인 것은 아니다.
2. React #130은 API 오류가 아니라 렌더링하려는 컴포넌트의 타입부터 확인해야 한다.
3. 검색 동작 직후 화면이 사라져도 검색 API 자체가 원인이라고 단정하면 안 된다.
4. 페이지네이션 라이브러리와 API의 페이지 시작 번호가 다를 수 있다.
5. React Query의 `queryKey`에는 요청 결과에 영향을 주는 검색어와 페이지를 모두 포함해야 한다.
6. 쿼리 문자열은 직접 연결하기보다 `URLSearchParams`로 안전하게 생성하는 것이 좋다.
7. 과제 제출 전에는 개발 서버뿐 아니라 `npm run build`와 실제 배포 사이트까지 테스트해야 한다.

---

### ■ 11. 최종 변론

⚖️ **이의 있습니다!**

이번 Fail은 단순히 테스트를 하지 않아서 발생한 문제라기보다, 개발 환경과 프로덕션 환경의 모듈 해석 차이까지 확인해야 발견할 수 있었던 오류였습니다.

다만 배포 후 최종 테스트가 부족했다는 강사님의 지적은 인정합니다. 이번 수정을 통해 단순히 오류를 없애는 데 그치지 않고, 오류 메시지에서 원인을 추적하고 검색·페이지네이션·URL 상태·캐시 구조를 함께 개선할 수 있었습니다.

**따라서 이번 Fail은 판결이 아니라, 배포 환경까지 검증하는 개발자로 성장하기 위한 증거로 제출합니다!**
