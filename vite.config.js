import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ⚠️ 이 파일은 설정 파일입니다. JSX(<div> 같은 태그)를 절대 넣지 마세요.
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    // react-multi-carousel 은 CommonJS 방식이라
    // Vite가 미리 변환해 두지 않으면 브라우저에서 오류가 납니다.
    // 여기에 적어두면 개발 서버 시작 시 함께 변환합니다.
    include: ["react-multi-carousel"],
  },

  build: {
    // 기본 CSS 압축기(lightningcss)가 배포 환경에서 빠지는 경우가 있어
    // 압축을 꺼서 "로컬은 되는데 Vercel만 실패"하는 문제를 막습니다.
    cssMinify: false,

    commonjsOptions: {
      // 빌드할 때도 CommonJS 라이브러리를 제대로 변환하게 합니다.
      transformMixedEsModules: true,
    },
  },
});