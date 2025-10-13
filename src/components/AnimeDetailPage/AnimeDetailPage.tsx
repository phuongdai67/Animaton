"use client";
import { useEffect, useState } from "react";
import { callAnilistApi } from "@/components/utils/api";
import Image from "next/image";
import Link from "next/link";
import "./AnimeDetailPage.css";
import LoadingGif from "../LoadingGif/LoadingGif";

interface AnimeDetail {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  coverImage: {
    extraLarge: string;
    large: string;
    color: string;
  };
  bannerImage: string;
  averageScore: number;
  meanScore: number;
  popularity: number;
  favourites: number;
  status: string;
  episodes: number;
  duration: number;
  season: string;
  seasonYear: number;
  format: string;
  source: string;
  genres: string[];
  studios: {
    nodes: Array<{ name: string; isAnimationStudio: boolean }>;
  };
  characters: {
    edges: Array<{
      role: string;
      node: {
        id: number;
        name: { full: string };
        image: { large: string };
      };
    }>;
  };
  relations: {
    edges: Array<{
      relationType: string;
      node: {
        id: number;
        title: { romaji: string };
        coverImage: { large: string };
        format: string;
      };
    }>;
  };
  recommendations: {
    nodes: Array<{
      mediaRecommendation: {
        id: number;
        title: { romaji: string };
        coverImage: { large: string };
        averageScore: number;
      };
    }>;
  };
  trailer: {
    id: string;
    site: string;
  };
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
}

const ANIME_DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    description
    coverImage {
      extraLarge
      large
      color
    }
    bannerImage
    averageScore
    meanScore
    popularity
    favourites
    status
    episodes
    duration
    season
    seasonYear
    format
    source
    genres
    studios {
      nodes {
        name
        isAnimationStudio
      }
    }
    characters(page: 1, perPage: 12, sort: ROLE) {
      edges {
        role
        node {
          id
          name {
            full
          }
          image {
            large
          }
        }
      }
    }
    relations {
      edges {
        relationType
        node {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          format
        }
      }
    }
    recommendations(page: 1, perPage: 6, sort: RATING_DESC) {
      nodes {
        mediaRecommendation {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          averageScore
        }
      }
    }
    trailer {
      id
      site
    }
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
  }
}
`;

interface AnimeDetailPageProps {
  id: string;
}

export default function AnimeDetailPage({ id }: AnimeDetailPageProps) {
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setLoading(true);
        const response = await callAnilistApi<{ Media: AnimeDetail }>(
          ANIME_DETAIL_QUERY,
          { id: parseInt(id) }
        );
        setAnime(response.Media);
      } catch (err) {
        setError("Không thể tải thông tin anime");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimeDetail();
    }
  }, [id]);

  if (loading) {
    return <LoadingGif />;
  }

  if (error || !anime) {
    return (
      <div className="anime-detail-error">
        <div className="error-text">{error || "Không tìm thấy anime"}</div>
      </div>
    );
  }

  const mainStudio = anime.studios.nodes.find((s) => s.isAnimationStudio);

  return (
    <div className="anime-detail-page">
      {/* Banner Section */}
      {anime.bannerImage && (
        <div className="anime-banner">
          <Image
            src={anime.bannerImage}
            alt={anime.title.romaji}
            fill
            className="banner-image"
            priority
          />
          <div className="banner-overlay" />
        </div>
      )}

      <div className="anime-detail-container">
        <div className="anime-detail-header">
          {/* Cover Image */}
          <div className="anime-cover">
            <div className="cover-image-wrapper">
              <Image
                src={anime.coverImage.extraLarge}
                alt={anime.title.romaji}
                fill
                className="cover-image"
                priority
              />
            </div>
          </div>

          {/* Main Info */}
          <div className="anime-main-info">
            <h1 className="anime-title">
              {anime.title.english || anime.title.romaji}
            </h1>
            <p className="anime-subtitle">{anime.title.romaji}</p>

            <div className="anime-stats">
              {anime.averageScore && (
                <div className="stat-card stat-score">
                  <span className="stat-value">{anime.averageScore}%</span>
                  <span className="stat-label">Score</span>
                </div>
              )}
              <div className="stat-card stat-popularity">
                <span className="stat-value">#{anime.popularity}</span>
                <span className="stat-label">Popularity</span>
              </div>
              <div className="stat-card stat-favorites">
                <span className="stat-value">{anime.favourites}</span>
                <span className="stat-label">Favorites</span>
              </div>
            </div>

            <div className="anime-info-grid">
              <div className="info-item">
                <span className="info-label">Format:</span>
                <span className="info-value">{anime.format}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Episodes:</span>
                <span className="info-value">{anime.episodes || "?"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="info-value">{anime.status}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Duration:</span>
                <span className="info-value">{anime.duration} mins</span>
              </div>
              <div className="info-item">
                <span className="info-label">Season:</span>
                <span className="info-value">
                  {anime.season} {anime.seasonYear}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Studio:</span>
                <span className="info-value">
                  {mainStudio?.name || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="anime-section">
          <h2 className="section-title">Synopsis</h2>
          <div
            className="anime-description"
            dangerouslySetInnerHTML={{
              __html:
                anime.description?.replace(/<br>/g, "<br/>") ||
                "No description available",
            }}
          />
        </div>

        {/* Genres */}
        <div className="anime-section">
          <h2 className="section-title">Genres</h2>
          <div className="genres-container">
            {anime.genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Trailer */}
        {anime.trailer && anime.trailer.site === "youtube" && (
          <div className="anime-section">
            <h2 className="section-title">Trailer</h2>
            <div className="trailer-container">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                title="Anime Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="trailer-iframe"
              />
            </div>
          </div>
        )}

        {/* Characters */}
        {anime.characters.edges.length > 0 && (
          <div className="anime-section">
            <h2 className="section-title">Characters</h2>
            <div className="characters-grid">
              {anime.characters.edges.slice(0, 12).map((char) => (
                <div key={char.node.id} className="character-card">
                  <div className="character-image-wrapper">
                    <Image
                      src={char.node.image.large}
                      alt={char.node.name.full}
                      fill
                      className="character-image"
                    />
                  </div>
                  <p className="character-name">{char.node.name.full}</p>
                  <p className="character-role">{char.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relations */}
        {anime.relations.edges.length > 0 && (
          <div className="anime-section">
            <h2 className="section-title">Relations</h2>
            <div className="relations-grid">
              {anime.relations.edges.map((rel, idx) => (
                <Link
                  key={idx}
                  href={`/anime/${rel.node.id}`}
                  className="relation-card"
                >
                  <div className="relation-image-wrapper">
                    <Image
                      src={rel.node.coverImage.large}
                      alt={rel.node.title.romaji}
                      fill
                      className="relation-image"
                    />
                  </div>
                  <p className="relation-type">{rel.relationType}</p>
                  <p className="relation-title">{rel.node.title.romaji}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {anime.recommendations.nodes.length > 0 && (
          <div className="anime-section">
            <h2 className="section-title">Recommendations</h2>
            <div className="recommendations-grid">
              {anime.recommendations.nodes
                .filter((rec) => rec.mediaRecommendation)
                .map((rec) => (
                  <Link
                    key={rec.mediaRecommendation.id}
                    href={`/anime/${rec.mediaRecommendation.id}`}
                    className="recommendation-card"
                  >
                    <div className="recommendation-image-wrapper">
                      <Image
                        src={rec.mediaRecommendation.coverImage.large}
                        alt={rec.mediaRecommendation.title.romaji}
                        fill
                        className="recommendation-image"
                      />
                    </div>
                    <p className="recommendation-title">
                      {rec.mediaRecommendation.title.romaji}
                    </p>
                    {rec.mediaRecommendation.averageScore && (
                      <p className="recommendation-score">
                        {rec.mediaRecommendation.averageScore}%
                      </p>
                    )}
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
