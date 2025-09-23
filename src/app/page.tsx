"use client";
import { useEffect, useRef } from "react";
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import Image from "next/image";
import AnimeCard from "../components/cards/AnimeCard";
import { useAnimeData } from "../components/hooks/useAnimeData";
import Button from "../components/ui/Button/Button";
import AnimeRanking from "../components/AnimeRanking/AnimeRanking";

export default function Home() {
  const { animeList, loading, error, hasMore, loadMore } = useAnimeData(20);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: Implement search functionality
  };

  const handleSearchChange = (query: string) => {
    console.log("Search query changed:", query);
    // TODO: Implement real-time search or debounced search
  };

  // Removed infinite scroll; using manual "Xem thêm" button instead

  return (
    <>
      <Header />
      <div
        className="min-h-screen header-spacing"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Hero Section */}
        <div
          className="text-gray-900 py-16"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <h1 className="text-5xl font-bold mb-4">Anime Collection</h1>
            <p className="text-xl opacity-90">
              Khám phá thế giới anime tuyệt vời
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-6xl py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              {/* Anime List */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                  Anime Mới Nhất
                </h2>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p className="font-bold">Lỗi tải dữ liệu:</p>
                    <p>{error}</p>
                  </div>
                )}

                {loading && animeList.length === 0 && (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-lg">Đang tải anime...</span>
                  </div>
                )}

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

                {/* Load more button */}
                <div className="flex justify-center py-8">
                  {animeList.length > 0 && (
                    <>
                      {loading ? (
                        <Button
                          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-70"
                          disabled
                        >
                          Đang tải...
                        </Button>
                      ) : (
                        hasMore && (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                            onClick={() => loadMore()}
                          >
                            Xem thêm
                          </Button>
                        )
                      )}
                    </>
                  )}
                </div>

                {/* No more data */}
                {!hasMore && animeList.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Đã tải hết tất cả anime!</p>
                  </div>
                )}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {animeList.length > 0 ? `${animeList.length}+` : "0"}
                  </div>
                  <div className="text-gray-600">Anime Đã Tải</div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {animeList.reduce(
                      (total, anime) => total + (anime.episodes || 0),
                      0
                    )}
                    +
                  </div>
                  <div className="text-gray-600">Tổng Episodes</div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {loading ? "..." : hasMore ? "∞" : "✓"}
                  </div>
                  <div className="text-gray-600">
                    {loading
                      ? "Đang tải..."
                      : hasMore
                      ? "Còn nhiều hơn"
                      : "Hoàn thành"}
                  </div>
                </div>
              </div>

              {/* Popular Genres */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Thể Loại Phổ Biến
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    // Count genre frequency from loaded anime
                    const genreCount: { [key: string]: number } = {};
                    animeList.forEach((anime) => {
                      anime.genres?.forEach((genre) => {
                        genreCount[genre] = (genreCount[genre] || 0) + 1;
                      });
                    });

                    // Get top 8 most popular genres
                    const topGenres = Object.entries(genreCount)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 8)
                      .map(([genre]) => genre);

                    // Fallback to default genres if no data yet
                    const displayGenres =
                      topGenres.length > 0
                        ? topGenres
                        : [
                            "Action",
                            "Romance",
                            "Comedy",
                            "Drama",
                            "Fantasy",
                            "Sci-Fi",
                            "Horror",
                            "Slice of Life",
                          ];

                    return displayGenres.map((genre) => (
                      <div
                        key={genre}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg text-center hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer"
                      >
                        <div className="font-semibold">{genre}</div>
                        {genreCount[genre] && (
                          <div className="text-xs opacity-75 mt-1">
                            {genreCount[genre]} anime
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* Right Sidebar (non-sticky, pushed right) */}
            <div className="w-full lg:w-[400px] shrink-0 lg:self-start lg:ml-auto lg:-mr-12 mt-6 lg:mt-16 lg:transform lg:translate-x-4">
              <AnimeRanking />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
