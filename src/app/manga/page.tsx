"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import MangaList from "@/components/MangaList/MangaList";

function MangaBrowseContent() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const searchQuery = searchParams.get("search") || "";

  return (
    <div
      className="min-h-screen header-spacing"
      style={{ backgroundColor: "var(--background)" }}
    >
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

      <MangaList
        initialPage={currentPage}
        perPage={20}
        showPagination={true}
        showViewAllButton={false}
        title="Danh sách Manga hot nhất"
        searchQuery={searchQuery}
      />
    </div>
  );
}

export default function MangaBrowsePage() {
  return (
    <>
      <Header />
      <Suspense>
        <MangaBrowseContent />
      </Suspense>
    </>
  );
}
