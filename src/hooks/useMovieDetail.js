import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

async function fetchMovieDetail(id) {
  // 영화 상세정보는 필수 데이터입니다.
  const detailResponse = await api.get(
    `/movie/${id}?language=ko-KR&append_to_response=release_dates,recommendations`
  );

  // 리뷰와 영상은 실패해도 상세페이지를 유지합니다.
  const [reviewsResult, videosResult] = await Promise.allSettled([
    api.get(`/movie/${id}/reviews?language=en-US&page=1`),
    api.get(`/movie/${id}/videos?language=ko-KR`),
  ]);

  const reviews =
    reviewsResult.status === "fulfilled"
      ? reviewsResult.value.data?.results ?? []
      : [];

  let videos =
    videosResult.status === "fulfilled"
      ? videosResult.value.data?.results ?? []
      : [];

  // 한국어 영상이 없으면 영어 영상을 검색합니다.
  if (videos.length === 0) {
    try {
      const englishVideosResponse = await api.get(
        `/movie/${id}/videos?language=en-US`
      );

      videos = englishVideosResponse.data?.results ?? [];
    } catch {
      videos = [];
    }
  }

  return {
    ...detailResponse.data,
    reviews,
    videos,
  };
}

export function useMovieDetailQuery(id) {
  return useQuery({
    queryKey: ["movie-detail", id],
    queryFn: () => fetchMovieDetail(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10,
  });
}

export default useMovieDetailQuery;