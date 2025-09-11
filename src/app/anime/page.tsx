"use client";

import Header from "../../components/Header/Header";
import SearchBar from "../../components/SearchBar/SearchBar";
import Image from "next/image";
import AnimeCard from "../../components/cards/AnimeCard";

export default function AnimePage() {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: Implement search functionality
  };

  const handleSearchChange = (query: string) => {
    console.log("Search query changed:", query);
    // TODO: Implement real-time search or debounced search
  };

  const featuredAnime = [
    {
      id: 1,
      title: "Attack on Titan",
      image: "/api/placeholder/300/400",
      rating: 9.5,
      episodes: 75,
      status: "Completed",
      genre: ["Action", "Drama", "Fantasy"],
      description:
        "Eren Yeager lives in a world where humanity is on the brink of extinction due to the Titans.",
    },
    {
      id: 2,
      title: "Demon Slayer",
      image: "/api/placeholder/300/400",
      rating: 9.2,
      episodes: 44,
      status: "Completed",
      genre: ["Action", "Supernatural", "Historical"],
      description:
        "Tanjiro Kamado becomes a demon slayer after his family is killed by demons.",
    },
    {
      id: 3,
      title: "One Piece",
      image: "/api/placeholder/300/400",
      rating: 9.8,
      episodes: "1000+",
      status: "Ongoing",
      genre: ["Adventure", "Comedy", "Fantasy"],
      description:
        "Monkey D. Luffy sets out to become the Pirate King in this epic adventure.",
    },
    {
      id: 4,
      title: "Naruto",
      image: "/api/placeholder/300/400",
      rating: 9.0,
      episodes: 720,
      status: "Completed",
      genre: ["Action", "Adventure", "Martial Arts"],
      description:
        "Naruto Uzumaki dreams of becoming the Hokage of his village.",
    },
  ];

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
          {/* Demo AnimeCard grid */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Demo AnimeCard
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                {
                  id: 1,
                  type: "ANIME",
                  title: { romaji: "One Piece" },
                  coverImage: {
                    large:
                      "https://wibu.com.vn/wp-content/uploads/2024/09/one-piece.jpg",
                  },
                },
                {
                  id: 2,
                  type: "ANIME",
                  title: { english: "One Piece" },
                  coverImage: {
                    large:
                      "https://wibu.com.vn/wp-content/uploads/2024/09/one-piece.jpg",
                  },
                },
                {
                  id: 3,
                  type: "ANIME",
                  title: { native: "ワンピース" },
                  coverImage: {
                    large:
                      "https://wibu.com.vn/wp-content/uploads/2024/09/one-piece.jpg",
                  },
                },
                {
                  id: 4,
                  type: "ANIME",
                  name: { full: "One Piece (Alt)" },
                  image: {
                    large:
                      "https://wibu.com.vn/wp-content/uploads/2024/09/one-piece.jpg",
                  },
                },
                {
                  id: 5,
                  type: "ANIME",
                  title: { romaji: "One Piece" },
                  coverImage: {
                    large:
                      "https://wibu.com.vn/wp-content/uploads/2024/09/one-piece.jpg",
                  },
                },
              ].map((item) => (
                <AnimeCard key={item.id} data={item} />
              ))}
            </div>
          </div>
          {/* <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  placeholder="Tìm kiếm anime..."
                  onSearch={handleSearch}
                  onChange={handleSearchChange}
                  variant="outlined"
                  fullWidth={true}
                />
              </div>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tất cả thể loại</option>
                <option value="action">Action</option>
                <option value="drama">Drama</option>
                <option value="fantasy">Fantasy</option>
                <option value="comedy">Comedy</option>
              </select>
            </div>
          </div> */}

          {/*Grid */}
          {/* <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Anime Nổi Bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAnime.map((anime) => (
                <div
                  key={anime.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        {anime.title}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold">
                      ⭐ {anime.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{anime.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {anime.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {anime.genre.map((g, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{anime.episodes} tập</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          anime.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {anime.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                1,000+
              </div>
              <div className="text-gray-600">Anime Series</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                50,000+
              </div>
              <div className="text-gray-600">Episodes</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                100+
              </div>
              <div className="text-gray-600">Genres</div>
            </div>
          </div>

          {/* Popular Genres */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Thể Loại Phổ Biến
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Action",
                "Romance",
                "Comedy",
                "Drama",
                "Fantasy",
                "Sci-Fi",
                "Horror",
                "Slice of Life",
              ].map((genre) => (
                <div
                  key={genre}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg text-center hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer"
                >
                  <div className="font-semibold">{genre}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
