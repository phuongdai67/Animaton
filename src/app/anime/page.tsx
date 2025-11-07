"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import AnimeList from "@/components/AnimeList/AnimeList";

export default function AnimeBrowsePage() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("search") || ""; // Lấy search query từ URL

  return (
    <>
      <Header />
      <div
        className="min-h-screen header-spacing"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Hero Section - Only show when NOT searching */}
        {!searchQuery && (
          <div
            className="text-gray-900 py-16"
            style={{ backgroundColor: "var(--background)" }}
          >
            <div className="container mx-auto px-6 max-w-6xl">
              <h1 className="text-5xl font-bold mb-4">Animaton</h1>
              <p className="text-xl opacity-90">
                Khám phá hàng ngàn anime từ khắp nơi trên thế giới
              </p>
            </div>
          </div>
        )}

        {/* Reusable AnimeList Component with Pagination and Search */}
        <AnimeList
          initialPage={currentPage}
          perPage={20}
          showPagination={true}
          showViewAllButton={false}
          title="Danh sách Anime hot nhất"
          searchQuery={searchQuery} // Pass search query
        />
      </div>
    </>
  );
}
