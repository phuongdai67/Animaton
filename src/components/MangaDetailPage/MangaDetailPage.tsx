"use client";
import { useEffect, useState } from "react";
import { callAnilistApi } from "@/components/utils/api";
import Image from "next/image";
import Link from "next/link";
import LoadingGif from "@/components/LoadingGif/LoadingGif";
import "./MangaDetailPage.css";

interface MangaDetail {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  synonyms: string[];
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
  chapters: number;
  volumes: number;
  format: string;
  source: string;
  genres: string[];
  staff: {
    edges: Array<{
      role: string;
      node: {
        id: number;
        name: { full: string };
        image: { large: string };
      };
    }>;
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

const MANGA_DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    title {
      romaji
      english
      native
    }
    synonyms
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
    chapters
    volumes
    format
    source
    genres
    staff(page: 1, perPage: 6) {
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

interface MangaDetailPageProps {
  id: string;
}

export default function MangaDetailPage({ id }: MangaDetailPageProps) {
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        setLoading(true);
        const response = await callAnilistApi<{ Media: MangaDetail }>(
          MANGA_DETAIL_QUERY,
          { id: parseInt(id) }
        );
        setManga(response.Media);
      } catch (err) {
        setError("Không thể tải thông tin manga");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMangaDetail();
    }
  }, [id]);

  if (loading) {
    return <LoadingGif />;
  }

  if (error || !manga) {
    return (
      <div className="manga-detail-error">
        <div className="error-text">{error || "Không tìm thấy manga"}</div>
      </div>
    );
  }

  // Format date helper
  const formatDate = (date: { year: number; month: number; day: number }) => {
    if (!date.year) return "?";
    const day = date.day?.toString().padStart(2, "0") || "??";
    const month = date.month?.toString().padStart(2, "0") || "??";
    return `${day}-${month}-${date.year}`;
  };

  // Get format label from constants
  const getFormatLabel = (format: string) => {
    const formats: Record<string, string> = {
      MANGA: "Manga",
      NOVEL: "Light Novel",
      ONE_SHOT: "One Shot",
    };
    return formats[format] || format;
  };

  // Get main author/artist
  const getMainStaff = (role: string) => {
    return manga.staff.edges.find((s) => s.role === role)?.node;
  };

  const author = getMainStaff("Story & Art") || getMainStaff("Story");
  const artist = getMainStaff("Art");

  return (
    <div className="manga-detail-page">
      {/* Banner Section */}
      {manga.bannerImage ? (
        <div className="manga-banner">
          <Image
            src={manga.bannerImage}
            alt={manga.title.romaji}
            fill
            sizes="100vw"
            className="banner-image"
            priority
          />
          <div className="banner-overlay" />
        </div>
      ) : (
        <div className="manga-banner manga-banner-placeholder">
          <div className="banner-overlay" />
        </div>
      )}

      <div className="manga-detail-container">
        <div className="manga-detail-header">
          {/* Cover Image */}
          <div className="manga-cover">
            <div className="cover-image-wrapper">
              <Image
                src={manga.coverImage.extraLarge}
                alt={manga.title.romaji}
                fill
                sizes="(max-width: 768px) 150px, 250px"
                className="cover-image"
                priority
              />
            </div>
          </div>

          {/* Main Info */}
          <div className="manga-main-info">
            <h1 className="manga-title">
              {manga.title.english || manga.title.romaji}
            </h1>
            <p className="manga-subtitle">{manga.title.romaji}</p>

            <div className="manga-stats">
              {manga.averageScore && (
                <div className="stat-card stat-score">
                  <span className="stat-value">{manga.averageScore}%</span>
                  <span className="stat-label">Score</span>
                </div>
              )}
              <div className="stat-card stat-popularity">
                <span className="stat-value">#{manga.popularity}</span>
                <span className="stat-label">Popularity</span>
              </div>
              <div className="stat-card stat-favorites">
                <span className="stat-value">{manga.favourites}</span>
                <span className="stat-label">Favorites</span>
              </div>
            </div>

            <div className="manga-info-grid">
              <div className="info-item">
                <span className="info-label">Format:</span>
                <span className="info-value">
                  {getFormatLabel(manga.format)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Chapters:</span>
                <span className="info-value">{manga.chapters || "?"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Volumes:</span>
                <span className="info-value">{manga.volumes || "?"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="info-value">{manga.status}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Start Date:</span>
                <span className="info-value">
                  {formatDate(manga.startDate)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">End Date:</span>
                <span className="info-value">{formatDate(manga.endDate)}</span>
              </div>
              {author && (
                <div className="info-item">
                  <span className="info-label">Author:</span>
                  <span className="info-value">{author.name.full}</span>
                </div>
              )}
              {artist && artist.id !== author?.id && (
                <div className="info-item">
                  <span className="info-label">Artist:</span>
                  <span className="info-value">{artist.name.full}</span>
                </div>
              )}
              {manga.synonyms && manga.synonyms.length > 0 && (
                <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                  <span className="info-label">Synonyms:</span>
                  <span className="info-value">
                    {manga.synonyms.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="manga-section">
          <h2 className="section-title">Synopsis</h2>
          <div
            className="manga-description"
            dangerouslySetInnerHTML={{
              __html:
                manga.description?.replace(/<br>/g, "<br/>") ||
                "No description available",
            }}
          />
        </div>

        {/* Genres */}
        <div className="manga-section">
          <h2 className="section-title">Genres</h2>
          <div className="genres-container">
            {manga.genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Staff */}
        {manga.staff.edges.length > 0 && (
          <div className="manga-section">
            <h2 className="section-title">Staff</h2>
            <div className="staff-grid">
              {manga.staff.edges.slice(0, 6).map((staff, idx) => (
                <div key={idx} className="staff-card">
                  <div className="staff-image-wrapper">
                    <Image
                      src={staff.node.image.large}
                      alt={staff.node.name.full}
                      fill
                      sizes="(max-width: 768px) 100px, 150px"
                      className="staff-image"
                    />
                  </div>
                  <p className="staff-name">{staff.node.name.full}</p>
                  <p className="staff-role">{staff.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Characters */}
        {manga.characters.edges.length > 0 && (
          <div className="manga-section">
            <h2 className="section-title">Characters</h2>
            <div className="characters-grid">
              {manga.characters.edges.slice(0, 12).map((char) => (
                <div key={char.node.id} className="character-card">
                  <div className="character-image-wrapper">
                    <Image
                      src={char.node.image.large}
                      alt={char.node.name.full}
                      fill
                      sizes="(max-width: 768px) 100px, 150px"
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
        {manga.relations.edges.length > 0 && (
          <div className="manga-section">
            <h2 className="section-title">Relations</h2>
            <div className="relations-grid">
              {manga.relations.edges.map((rel, idx) => (
                <Link
                  key={idx}
                  href={`/manga/${rel.node.id}`}
                  className="relation-card"
                >
                  <div className="relation-image-wrapper">
                    <Image
                      src={rel.node.coverImage.large}
                      alt={rel.node.title.romaji}
                      fill
                      sizes="(max-width: 768px) 120px, 180px"
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
        {manga.recommendations.nodes.length > 0 && (
          <div className="manga-section">
            <h2 className="section-title">Recommendations</h2>
            <div className="recommendations-grid">
              {manga.recommendations.nodes
                .filter((rec) => rec.mediaRecommendation)
                .map((rec) => (
                  <Link
                    key={rec.mediaRecommendation.id}
                    href={`/manga/${rec.mediaRecommendation.id}`}
                    className="recommendation-card"
                  >
                    <div className="recommendation-image-wrapper">
                      <Image
                        src={rec.mediaRecommendation.coverImage.large}
                        alt={rec.mediaRecommendation.title.romaji}
                        fill
                        sizes="(max-width: 768px) 120px, 180px"
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
