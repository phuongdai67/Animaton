"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import MangaList from "@/components/MangaList/MangaList";

export default function MangaBrowsePage() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("search") || "";

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
              <h1 className="text-5xl font-bold mb-4">Manga Library</h1>
              <p className="text-xl opacity-90">
                Khám phá hàng ngàn manga từ khắp nơi trên thế giới
              </p>
            </div>
          </div>
        )}

        {/* Reusable MangaList Component with Pagination and Search */}
        <MangaList
          initialPage={currentPage}
          perPage={20}
          showPagination={true}
          showViewAllButton={false}
          title="Danh sách Manga hot nhất"
          searchQuery={searchQuery}
        />
      </div>
    </>
  );
}
