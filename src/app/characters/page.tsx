"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import CharacterList from "@/components/CharacterList/CharacterList";

function CharactersBrowseContent() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  return (
    <div
      className="min-h-screen header-spacing"
      style={{ backgroundColor: "var(--background)" }}
    >
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

      <CharacterList
        initialPage={currentPage}
        perPage={24}
        showPagination={true}
        showViewAllButton={false}
        title="Popular Characters"
        sort={["FAVOURITES_DESC"]}
      />
    </div>
  );
}

export default function CharactersBrowsePage() {
  return (
    <>
      <Header />
      <Suspense>
        <CharactersBrowseContent />
      </Suspense>
    </>
  );
}
