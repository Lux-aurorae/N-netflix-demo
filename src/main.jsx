import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./common/ErrorBoundary/ErrorBoundary.jsx";

// ═══════════════════════════════════════════════════════════
// 앱 시작점 — 감싸는 순서가 중요합니다
// ═══════════════════════════════════════════════════════════
//
// ▸ <BrowserRouter>      : 주소 이동 기능을 앱 전체에 켭니다.
//                          이게 없으면 Link, useNavigate가 전부 에러입니다.
// ▸ <QueryClientProvider>: 서버 데이터를 담아둘 창고를 연결합니다.
//                          6강부터 useQuery를 쓸 때 필요합니다.
//
// ▸ 순서는 바깥쪽 → 안쪽으로, 더 넓은 범위가 바깥에 옵니다.
// ─────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // 실패 시 1번만 재시도 (기본 3번)
      refetchOnWindowFocus: false, // 다른 탭 갔다 와도 자동 재호출 안 함
      staleTime: 1000 * 60,        // 1분간은 새로 부르지 않음
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ErrorBoundary로 감싸면 화면이 죽는 대신 오류 내용이 표시됩니다.
        "검은 화면"만 보고 원인을 추측하지 않아도 됩니다. */}
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);