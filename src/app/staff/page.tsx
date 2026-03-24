"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header/Header";
import CharacterList from "@/components/CharacterList/CharacterList";

function StaffBrowseContent() {
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
          <h1 className="text-5xl font-bold mb-4">Browse Staff</h1>
          <p className="text-xl opacity-90">
            Khám phá các tác giả và họa sĩ nổi tiếng
          </p>
        </div>
      </div>

      <CharacterList
        initialPage={currentPage}
        perPage={24}
        showPagination={true}
        showViewAllButton={false}
        title="Popular Staff"
        sort={["FAVOURITES_DESC"]}
      />
    </div>
  );
}

export default function StaffBrowsePage() {
  return (
    <>
      <Header />
      <Suspense>
        <StaffBrowseContent />
      </Suspense>
    </>
  );
}
