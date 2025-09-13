import { useState, useEffect, useCallback } from "react";
import { callAnilistApi } from "../utils/api";

interface AnimeData {
  id: number;
  title: {
    english?: string;
    romaji?: string;
    native?: string;
  };
  coverImage: {
    large: string;
  };
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  endDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  status?: string;
  episodes?: number;
  averageScore?: number;
  popularity?: number;
  genres?: string[];
  description?: string;
}

interface UseAnimeDataReturn {
  animeList: AnimeData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

const ANIME_QUERY = `
  query GetAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
        currentPage
        lastPage
      }
      media(type: ANIME, sort: START_DATE_DESC) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          large
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        status
        episodes
        averageScore
        popularity
        genres
        description
      }
    }
  }
`;

export const useAnimeData = (perPage: number = 20): UseAnimeDataReturn => {
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAnime = useCallback(
    async (page: number, isLoadMore: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await callAnilistApi<{
          Page: {
            pageInfo: {
              hasNextPage: boolean;
              currentPage: number;
              lastPage: number;
            };
            media: AnimeData[];
          };
        }>(ANIME_QUERY, {
          page,
          perPage,
        });

        const { pageInfo, media } = response.Page;

        if (isLoadMore) {
          setAnimeList((prev) => [...prev, ...media]);
        } else {
          setAnimeList(media);
        }

        setHasMore(pageInfo.hasNextPage);
        setCurrentPage(pageInfo.currentPage);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch anime data"
        );
        console.error("Error fetching anime:", err);
      } finally {
        setLoading(false);
      }
    },
    [perPage]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchAnime(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, fetchAnime]);

  const refresh = useCallback(() => {
    setCurrentPage(1);
    setAnimeList([]);
    setHasMore(true);
    fetchAnime(1, false);
  }, [fetchAnime]);

  useEffect(() => {
    fetchAnime(1, false);
  }, [fetchAnime]);

  return {
    animeList,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
