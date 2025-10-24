"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import CharacterList from "@/components/CharacterList/CharacterList";

export default function CharactersBrowsePage() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

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
            <h1 className="text-5xl font-bold mb-4">Browse Characters</h1>
            <p className="text-xl opacity-90">
              Khám phá hàng ngàn nhân vật anime yêu thích
            </p>
          </div>
        </div>

        {/* Character List with Pagination */}
        <CharacterList
          initialPage={currentPage}
          perPage={24}
          showPagination={true}
          showViewAllButton={false}
          title="Popular Characters"
          sort={["FAVOURITES_DESC"]}
        />
      </div>
    </>
  );
}
