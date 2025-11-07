import { callAnilistApi } from "./api";
import { SEARCH_QUERY } from "../queries/search";

export interface SearchResult {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  type: "ANIME" | "MANGA";
  format: string;
  status: string;
  averageScore: number;
  startDate: {
    year: number;
  };
}

export interface SearchResponse {
  Page: {
    pageInfo: {
      total: number;
      currentPage: number;
      lastPage: number;
      hasNextPage: boolean;
      perPage: number;
    };
    media: SearchResult[];
  };
}

export async function searchMedia(
  query: string,
  type?: "ANIME" | "MANGA",
  page: number = 1,
  perPage: number = 10
): Promise<SearchResponse> {
  const variables = {
    search: query,
    type: type || null,
    page,
    perPage,
  };

  return await callAnilistApi<SearchResponse>(SEARCH_QUERY, variables);
}
