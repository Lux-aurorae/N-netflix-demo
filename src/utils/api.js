import axios from "axios";

// ═══════════════════════════════════════════════════════════
// TMDB API 연결 설정
// ═══════════════════════════════════════════════════════════
//
// ▸ axios.create()로 "설정을 마친 axios"를 만들어 둡니다.
//   설정 전 : axios.get("https://api.themoviedb.org/3/movie/popular", { headers: {...} })
//   설정 후 : api.get("/movie/popular")
//
// ▸ TMDB V3는 인증 정보를 URL이 아닌 헤더에 넣습니다.
//   · Authorization: Bearer {토큰}  ← OAuth 방식의 약속
//   · 주소에 키를 붙이면 방문기록·서버로그에 남아 위험합니다.
// ─────────────────────────────────────────────────────────

// ⚠️ 환경변수 이름은 도구마다 다릅니다.
//    · Vite             → VITE_ 로 시작, import.meta.env 로 읽음
//    · create-react-app → REACT_APP_ 로 시작, process.env 로 읽음
//
// ⚠️ Vite는 빌드할 때 이 값을 "실제 문자열로 바꿔서" 파일에 박습니다.
//    즉 빌드 시점에 값이 없으면 영원히 없습니다.
//    Vercel에 환경변수를 넣은 뒤 반드시 Redeploy를 해야 하는 이유입니다.
const RAW_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

// 앞뒤 공백·따옴표를 제거합니다.
// .env에 실수로 따옴표를 넣거나 줄 끝에 공백이 붙는 일이 잦은데,
// 그대로 두면 헤더가 망가져 401이 납니다.
const TOKEN = (RAW_TOKEN ?? "").trim().replace(/^["']|["']$/g, "");

// ── 토큰 상태 진단 ────────────────────────────────────────
// 화면에서 "왜 안 나오는지" 안내하는 데 씁니다.
export const tokenStatus = (() => {
  if (!TOKEN) return "missing"; // 아예 없음 → 환경변수 미설정
  if (!TOKEN.startsWith("eyJ")) return "wrong-type"; // API Key를 넣은 경우
  return "ok";
})();

export const hasToken = tokenStatus === "ok";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

// ── Interceptor (요청·응답 가로채기) ──────────────────────
// ▸ then / catch 로 넘어가기 "전"에 중간에서 낚아챕니다.
// ▸ 개발 중 요청·응답을 확인하거나 공통 에러를 처리할 때 씁니다.
if (import.meta.env.DEV) {
  api.interceptors.request.use((req) => {
    console.log("[요청]", req.method?.toUpperCase(), req.url);
    return req;
  });
}

// 오류는 개발·배포 모두에서 콘솔에 남깁니다.
// 배포 후 문제가 생겼을 때 F12로 원인을 볼 수 있어야 하기 때문입니다.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error(
      "[TMDB 오류]",
      error.response?.status,
      error.response?.data?.status_message ?? error.message
    );
    return Promise.reject(error);
  }
);

export default api;