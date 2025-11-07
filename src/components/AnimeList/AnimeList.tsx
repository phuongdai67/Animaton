"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimeCard from "@/components/cards/AnimeCard";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import AnimeRanking from "@/components/AnimeRanking/AnimeRanking";
import PopularGenres from "@/components/PopularGenres/PopularGenres";
import Pagination from "@/components/Pagination/Pagination";
import Button from "@/components/ui/Button/Button";
import { callAnilistApi } from "@/components/utils/api";

const ANIME_QUERY = `
query ($page: Int, $perPage: Int, $sort: [MediaSort], $search: String) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(type: ANIME, sort: $sort, search: $search) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
      }
      episodes
      genres
      averageScore
    }
  }
}
`;

interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
  };
  episodes: number;
  genres: string[];
}

interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

interface AnimeListProps {
  initialPage?: number;
  perPage?: number;
  showPagination?: boolean;
  showViewAllButton?: boolean;
  title?: string;
  subtitle?: string;
  searchQuery?: string; // Thêm prop search query
}

export default function AnimeList({
  initialPage = 1,
  perPage = 20,
  showPagination = false,
  showViewAllButton = false,
  title = "Anime Hot Nhất",
  subtitle,
  searchQuery, // Nhận search query từ parent
}: AnimeListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        setError(null);

        const variables: any = {
          page: currentPage,
          perPage,
        };

        // Nếu có search query thì thêm vào variables
        if (searchQuery) {
          variables.search = searchQuery;
          variables.sort = ["SEARCH_MATCH"]; // Sort by search relevance
        } else {
          variables.sort = ["POPULARITY_DESC"]; // Default sort
        }

        const response = await callAnilistApi<{
          Page: { pageInfo: PageInfo; media: Anime[] };
        }>(ANIME_QUERY, variables);

        setAnimeList(response.Page.media);
        setPageInfo(response.Page.pageInfo);
      } catch (err) {
        setError("Không thể tải danh sách anime");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [currentPage, perPage, searchQuery]); // Thêm searchQuery vào dependencies

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (showPagination) {
      // Nếu có search query, giữ lại trong URL
      const url = searchQuery
        ? `/anime?search=${encodeURIComponent(searchQuery)}&page=${page}`
        : `/anime?page=${page}`;
      router.push(url);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dynamic title based on search
  const displayTitle = searchQuery
    ? `Kết quả tìm kiếm cho "${searchQuery}"`
    : title;

  return (
    <div className="container mx-auto px-6 max-w-6xl py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {/* Anime List Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {displayTitle}
                </h2>
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
                {/* Hiển thị số kết quả tìm kiếm */}
                {searchQuery && pageInfo && (
                  <p className="text-gray-600 mt-2">
                    Tìm thấy {pageInfo.total} kết quả
                  </p>
                )}
              </div>
              {showPagination && pageInfo && (
                <span className="text-gray-600">
                  Trang {pageInfo.currentPage} / {pageInfo.lastPage}
                </span>
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p className="font-bold">Lỗi:</p>
                <p>{error}</p>
              </div>
            )}

            {/* Show skeletons while loading */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 justify-items-center">
                {Array.from({ length: perPage }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            )}

            {/* Show anime cards */}
            {!loading && animeList.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 justify-items-center">
                {animeList.map((anime) => (
                  <AnimeCard
                    key={anime.id}
                    data={{
                      id: anime.id,
                      type: "ANIME",
                      title: {
                        english:
                          anime.title.english ||
                          anime.title.romaji ||
                          anime.title.native,
                      },
                      coverImage: {
                        large: anime.coverImage.large,
                      },
                    }}
                  />
                ))}
              </div>
            )}

            {/* No results found for search */}
            {!loading && searchQuery && animeList.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600 mb-6">
                  Không tìm thấy anime nào phù hợp với "{searchQuery}"
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  href="/anime"
                >
                  Xem tất cả anime
                </Button>
              </div>
            )}

            {/* View All Button (for homepage) */}
            {showViewAllButton &&
              !loading &&
              !searchQuery &&
              pageInfo?.hasNextPage && (
                <div className="flex justify-center py-8">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                    href="/anime?page=2"
                  >
                    Xem tất cả →
                  </Button>
                </div>
              )}

            {/* Pagination (for browse page) */}
            {showPagination && !loading && pageInfo && animeList.length > 0 && (
              <Pagination
                currentPage={pageInfo.currentPage}
                totalPages={pageInfo.lastPage}
                onPageChange={handlePageChange}
              />
            )}

            {/* No more data */}
            {!loading &&
              !searchQuery &&
              !pageInfo?.hasNextPage &&
              !showPagination && (
                <div className="text-center py-8 text-gray-500">
                  <p>Đã tải hết tất cả anime!</p>
                </div>
              )}
          </div>

          {/* Only show PopularGenres if not searching */}
          {!searchQuery && <PopularGenres animeList={animeList} />}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-[400px] shrink-0 lg:self-start lg:ml-auto lg:-mr-12 mt-6 lg:mt-16 lg:transform lg:translate-x-4">
          <AnimeRanking />
        </div>
      </div>
    </div>
  );
}
