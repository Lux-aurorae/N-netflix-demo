import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

async function fetchMovieDetail(id) {
  const [detailResponse, reviewsResponse, koVideosResponse] = await Promise.all([
    api.get(`/movie/${id}?language=ko-KR&append_to_response=release_dates,recommendations`),
    api.get(`/movie/${id}/reviews?language=en-US&page=1`),
    api.get(`/movie/${id}/videos?language=ko-KR`),
  ]);

  let videos = koVideosResponse.data?.results ?? [];
  if (videos.length === 0) {
    const enVideosResponse = await api.get(`/movie/${id}/videos?language=en-US`);
    videos = enVideosResponse.data?.results ?? [];
  }

  return {
    ...detailResponse.data,
    reviews: reviewsResponse.data?.results ?? [],
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
