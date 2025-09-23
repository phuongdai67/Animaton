import { callAnilistApi } from "./api";

export type RankingPeriod = "day" | "week" | "month" | "season" | "year";

type AniListMedia = {
  id: number;
  title?: { romaji?: string; english?: string; native?: string };
  coverImage?: { large?: string; medium?: string };
  averageScore?: number | null;
  popularity?: number | null;
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  seasonYear?: number;
  startDate?: { year?: number; month?: number; day?: number };
};

export type RankedAnimeItem = {
  id: number;
  title: string;
  coverImage: string;
  score: number; // using averageScore if available
};

function toFuzzyDateInt(d: Date): number {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return Number(`${y}${m}${day}`);
}

function getMonthRange(date = new Date()): {
  startDate_greater: number;
  startDate_lesser: number;
} {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    startDate_greater: toFuzzyDateInt(start),
    startDate_lesser: toFuzzyDateInt(end),
  };
}

function getCurrentSeasonAndYear(date = new Date()): {
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  seasonYear: number;
} {
  const m = date.getMonth() + 1;
  const season =
    m <= 3 ? "WINTER" : m <= 6 ? "SPRING" : m <= 9 ? "SUMMER" : "FALL";
  return { season, seasonYear: date.getFullYear() };
}

function mapMedia(items: AniListMedia[]): RankedAnimeItem[] {
  return (items || []).map((m) => ({
    id: m.id,
    title: m.title?.english || m.title?.romaji || m.title?.native || "Unknown",
    coverImage: m.coverImage?.large || m.coverImage?.medium || "/vercel.svg",
    score: typeof m.averageScore === "number" ? m.averageScore : 0,
  }));
}

export async function fetchTrendingTop(
  perPage = 10
): Promise<RankedAnimeItem[]> {
  const query = `
    query TopTrending($page: Int!, $perPage: Int!) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: [TRENDING_DESC]) {
          id
          title { romaji english native }
          coverImage { large medium }
          averageScore
          popularity
        }
      }
    }
  `;
  const data = await callAnilistApi<{ Page: { media: AniListMedia[] } }>(
    query,
    {
      page: 1,
      perPage,
    }
  );
  return mapMedia(data?.Page?.media || []);
}

export async function fetchMonthTop(
  date = new Date(),
  perPage = 10
): Promise<RankedAnimeItem[]> {
  const range = getMonthRange(date);
  const query = `
    query TopMonth($page: Int!, $perPage: Int!, $gt: FuzzyDateInt, $lt: FuzzyDateInt) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME
          startDate_greater: $gt
          startDate_lesser: $lt
          sort: [POPULARITY_DESC]
        ) {
          id
          title { romaji english native }
          coverImage { large medium }
          averageScore
          popularity
          startDate { year month day }
        }
      }
    }
  `;
  const data = await callAnilistApi<{ Page: { media: AniListMedia[] } }>(
    query,
    {
      page: 1,
      perPage,
      gt: range.startDate_greater,
      lt: range.startDate_lesser,
    }
  );
  return mapMedia(data?.Page?.media || []);
}

export async function fetchSeasonTop(
  date = new Date(),
  perPage = 10
): Promise<RankedAnimeItem[]> {
  const { season, seasonYear } = getCurrentSeasonAndYear(date);
  const query = `
    query TopSeason($page: Int!, $perPage: Int!, $season: MediaSeason!, $seasonYear: Int!) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: [POPULARITY_DESC]) {
          id
          title { romaji english native }
          coverImage { large medium }
          averageScore
          popularity
          season
          seasonYear
        }
      }
    }
  `;
  const data = await callAnilistApi<{ Page: { media: AniListMedia[] } }>(
    query,
    {
      page: 1,
      perPage,
      season,
      seasonYear,
    }
  );
  return mapMedia(data?.Page?.media || []);
}

export async function fetchYearTop(
  year = new Date().getFullYear(),
  perPage = 10
): Promise<RankedAnimeItem[]> {
  const query = `
    query TopYear($page: Int!, $perPage: Int!, $seasonYear: Int!) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, seasonYear: $seasonYear, sort: [POPULARITY_DESC]) {
          id
          title { romaji english native }
          coverImage { large medium }
          averageScore
          popularity
          seasonYear
        }
      }
    }
  `;
  const data = await callAnilistApi<{ Page: { media: AniListMedia[] } }>(
    query,
    {
      page: 1,
      perPage,
      seasonYear: year,
    }
  );
  return mapMedia(data?.Page?.media || []);
}

export async function fetchTopByPeriod(
  period: RankingPeriod,
  perPage = 10
): Promise<RankedAnimeItem[]> {
  switch (period) {
    case "day":
    case "week":
      return fetchTrendingTop(perPage);
    case "month":
      return fetchMonthTop(new Date(), perPage);
    case "season":
      return fetchSeasonTop(new Date(), perPage);
    case "year":
      return fetchYearTop(new Date().getFullYear(), perPage);
    default:
      return fetchTrendingTop(perPage);
  }
}
