import React from "react";
import "./PopularGenres.css";

interface Anime {
  genres?: string[];
}

interface PopularGenresProps {
  animeList: Anime[];
}

const PopularGenres: React.FC<PopularGenresProps> = ({ animeList }) => {
  // Count genre frequency from loaded anime
  const genreCount: { [key: string]: number } = {};
  animeList.forEach((anime) => {
    anime.genres?.forEach((genre) => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  // Get top 8 most popular genres
  const topGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([genre]) => genre);

  // Fallback to default genres if no data yet
  const displayGenres =
    topGenres.length > 0
      ? topGenres
      : [
          "Action",
          "Romance",
          "Comedy",
          "Drama",
          "Fantasy",
          "Sci-Fi",
          "Horror",
          "Slice of Life",
        ];

  return (
    <div className="popular-genres-container">
      <h3 className="popular-genres-title">Thể Loại Phổ Biến</h3>
      <div className="popular-genres-grid">
        {displayGenres.map((genre) => (
          <div key={genre} className="genre-card">
            <div className="genre-name">{genre}</div>
            {genreCount[genre] && (
              <div className="genre-count">{genreCount[genre]} anime</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularGenres;
