"use client";
import Header from "../components/Header/Header";
import AnimeList from "@/components/AnimeList/AnimeList";

export default function Home() {
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

        {/* Reusable AnimeList Component */}
        <AnimeList
          initialPage={1}
          perPage={20}
          showPagination={false}
          showViewAllButton={true}
          title="Anime Hot Nhất"
        />
      </div>
    </>
  );
}
