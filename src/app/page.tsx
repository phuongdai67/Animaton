"use client";
import { useEffect, useRef } from "react";
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import Image from "next/image";
import AnimeCard from "../components/cards/AnimeCard";
import { useAnimeData } from "../components/hooks/useAnimeData";

export default function Home() {
  const { animeList, loading, error, hasMore, loadMore } = useAnimeData(20);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: Implement search functionality
  };

  const handleSearchChange = (query: string) => {
    console.log("Search query changed:", query);
    // TODO: Implement real-time search or debounced search
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 header-spacing">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-6">
            <h1 className="text-5xl font-bold mb-4">Anime Collection</h1>
            <p className="text-xl opacity-90">
              Khám phá thế giới anime tuyệt vời
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

            {/* Loading indicator for load more */}
            {loading && animeList.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3">Đang tải thêm...</span>
              </div>
            )}

            {/* Load more trigger */}
            {hasMore && !loading && (
              <div ref={observerRef} className="h-10"></div>
            )}

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
      </div>
    </>
  );
}
