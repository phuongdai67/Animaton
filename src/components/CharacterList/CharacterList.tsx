"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import Pagination from "@/components/Pagination/Pagination";
import Button from "@/components/ui/Button/Button";
import { callAnilistApi } from "@/components/utils/api";
import CharacterCard from "../SkeletonCard/CharacterSkeletonCard";

const CHARACTER_QUERY = `
query ($page: Int, $perPage: Int, $sort: [CharacterSort]) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    characters(sort: $sort) {
      id
      name {
        first
        middle
        last
        full
        native
        userPreferred
      }
      image {
        large
        medium
      }
      gender
      dateOfBirth {
        year
        month
        day
      }
      age
      bloodType
      favourites
    }
  }
}
`;

interface Character {
  id: number;
  name: {
    first: string;
    middle: string;
    last: string;
    full: string;
    native: string;
    userPreferred: string;
  };
  image: {
    large: string;
    medium: string;
  };
  gender: string;
  dateOfBirth: {
    year: number;
    month: number;
    day: number;
  };
  age: number;
  bloodType: string;
  favourites: number;
}

interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

interface CharacterListProps {
  initialPage?: number;
  perPage?: number;
  showPagination?: boolean;
  showViewAllButton?: boolean;
  title?: string;
  subtitle?: string;
  sort?: string[];
}

export default function CharacterList({
  initialPage = 1,
  perPage = 20,
  showPagination = false,
  showViewAllButton = false,
  title = "Popular Characters",
  subtitle,
  sort = ["FAVOURITES_DESC"],
}: CharacterListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await callAnilistApi<{
          Page: { pageInfo: PageInfo; characters: Character[] };
        }>(CHARACTER_QUERY, {
          page: currentPage,
          perPage,
          sort,
        });

        setCharacterList(response.Page.characters);
        setPageInfo(response.Page.pageInfo);
      } catch (err) {
        setError("Không thể tải danh sách nhân vật");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentPage, perPage, sort]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (showPagination) {
      router.push(`/characters?page=${page}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-6 max-w-6xl py-8">
      <div className="flex flex-col gap-6">
        {/* Character List Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {showPagination && pageInfo && (
              <span className="text-gray-600">
                Page {pageInfo.currentPage} of {pageInfo.lastPage}
              </span>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">Lỗi:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Show skeletons while loading */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-5 justify-items-center">
              {Array.from({ length: perPage }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          )}

          {/* Show character cards */}
          {!loading && characterList.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-5 justify-items-center">
              {characterList.map((character) => (
                <CharacterCard
                  key={character.id}
                  data={{
                    id: character.id,
                    name: character.name,
                    image: character.image,
                  }}
                />
              ))}
            </div>
          )}

          {/* View All Button (for homepage) */}
          {showViewAllButton && !loading && pageInfo?.hasNextPage && (
            <div className="flex justify-center py-8">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                href="/characters?page=2"
              >
                Xem tất cả →
              </Button>
            </div>
          )}

          {/* Pagination (for browse page) */}
          {showPagination && !loading && pageInfo && (
            <Pagination
              currentPage={pageInfo.currentPage}
              totalPages={pageInfo.lastPage}
              onPageChange={handlePageChange}
            />
          )}

          {/* No more data */}
          {!loading && !pageInfo?.hasNextPage && !showPagination && (
            <div className="text-center py-8 text-gray-500">
              <p>Đã tải hết tất cả nhân vật!</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {showPagination ? pageInfo?.total || 0 : characterList.length}
            </div>
            <div className="text-gray-600">
              {showPagination ? "Total Characters" : "Nhân vật đã tải"}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {characterList.filter((c) => c.gender === "Male").length}
            </div>
            <div className="text-gray-600">Male Characters</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {characterList.filter((c) => c.gender === "Female").length}
            </div>
            <div className="text-gray-600">Female Characters</div>
          </div>
        </div>
      </div>
    </div>
  );
}
