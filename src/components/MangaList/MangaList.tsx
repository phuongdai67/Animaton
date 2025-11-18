"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MangaCard from "../SkeletonCard/MangaCard";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import PopularGenres from "@/components/PopularGenres/PopularGenres";
import Pagination from "@/components/Pagination/Pagination";
import Button from "@/components/ui/Button/Button";
import { callAnilistApi } from "@/components/utils/api";

const MANGA_QUERY = `
query ($page: Int, $perPage: Int, $sort: [MediaSort], $search: String) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(type: MANGA, sort: $sort, search: $search) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
      }
      chapters
      volumes
      genres
      averageScore
      format
      status
    }
  }
}
`;

interface Manga {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
  };
  chapters: number;
  volumes: number;
  genres: string[];
  averageScore: number;
  format: string;
  status: string;
}

interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

interface MangaListProps {
  initialPage?: number;
  perPage?: number;
  showPagination?: boolean;
  showViewAllButton?: boolean;
  title?: string;
  subtitle?: string;
  searchQuery?: string;
}

export default function MangaList({
  initialPage = 1,
  perPage = 20,
  showPagination = false,
  showViewAllButton = false,
  title = "Manga Hot Nhất",
  subtitle,
  searchQuery,
}: MangaListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManga = async () => {
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
          Page: { pageInfo: PageInfo; media: Manga[] };
        }>(MANGA_QUERY, variables);

        setMangaList(response.Page.media);
        setPageInfo(response.Page.pageInfo);
      } catch (err) {
        setError("Không thể tải danh sách manga");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchManga();
  }, [currentPage, perPage, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (showPagination) {
      // Nếu có search query, giữ lại trong URL
      const url = searchQuery
        ? `/manga?search=${encodeURIComponent(searchQuery)}&page=${page}`
        : `/manga?page=${page}`;
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
          {/* Manga List Section */}
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

            {/* Show manga cards */}
            {!loading && mangaList.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 justify-items-center">
                {mangaList.map((manga) => (
                  <MangaCard
                    key={manga.id}
                    data={{
                      id: manga.id,
                      type: "MANGA",
                      title: {
                        english:
                          manga.title.english ||
                          manga.title.romaji ||
                          manga.title.native,
                      },
                      coverImage: {
                        large: manga.coverImage.large,
                      },
                    }}
                  />
                ))}
              </div>
            )}

            {/* No results found for search */}
            {!loading && searchQuery && mangaList.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600 mb-6">
                  Không tìm thấy manga nào phù hợp với "{searchQuery}"
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  href="/manga"
                >
                  Xem tất cả manga
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
                    href="/manga?page=2"
                  >
                    Xem tất cả →
                  </Button>
                </div>
              )}

            {/* Pagination (for browse page) */}
            {showPagination && !loading && pageInfo && mangaList.length > 0 && (
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
                  <p>Đã tải hết tất cả manga!</p>
                </div>
              )}
          </div>

          {/* Only show PopularGenres if not searching */}
          {!searchQuery && <PopularGenres animeList={mangaList} />}
        </div>

        {/* Right Sidebar */}
        {/* <div className="w-full lg:w-[400px] shrink-0 lg:self-start lg:ml-auto lg:-mr-12 mt-6 lg:mt-16 lg:transform lg:translate-x-4">
          <MangaRanking />
        </div> */}
      </div>
    </div>
  );
}
