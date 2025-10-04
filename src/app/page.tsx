"use client";
import { useEffect, useRef } from "react";
import Header from "../components/Header/Header";
import SearchBar from "../components/SearchBar/SearchBar";
import Image from "next/image";
import AnimeCard from "../components/cards/AnimeCard";

import { useAnimeData } from "../components/hooks/useAnimeData";
import Button from "../components/ui/Button/Button";
import AnimeRanking from "../components/AnimeRanking/AnimeRanking";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import PopularGenres from "@/components/PopularGenres/PopularGenres";

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

                {/* Show skeletons on initial load */}
                {loading && animeList.length === 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 justify-items-center">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                )}

                {/* Show actual anime cards */}
                {animeList.length > 0 && (
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

                {/* Load more button */}
                {animeList.length > 0 && hasMore && !loading && (
                  <div className="flex justify-center py-8">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                      onClick={() => loadMore()}
                    >
                      Xem thêm
                    </Button>
                  </div>
                )}

                {/* Show skeletons when loading more */}
                {loading && animeList.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 justify-items-center mt-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <SkeletonCard key={`loading-${index}`} />
                    ))}
                  </div>
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

              <PopularGenres animeList={animeList} />
            </div>

            <div className="w-full lg:w-[400px] shrink-0 lg:self-start lg:ml-auto lg:-mr-12 mt-6 lg:mt-16 lg:transform lg:translate-x-4">
              <AnimeRanking />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
