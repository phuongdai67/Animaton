"use client";

import React from "react";
import Link from "next/link";
import "./MangaCard.css";

type MangaCardProps = {
  data: {
    id: number;
    type?: string;
    title: {
      english?: string;
      romaji?: string;
      native?: string;
    };
    coverImage: {
      large?: string;
      medium?: string;
    };
  };
};

const MangaCard: React.FC<MangaCardProps> = ({ data }) => {
  const displayTitle =
    data.title.english || data.title.romaji || data.title.native || "Unknown";
  const imageSrc =
    data.coverImage.large || data.coverImage.medium || "/placeholder-manga.jpg";

  return (
    <div className="manga-card-container">
      <Link href={`/manga/${data.id}`} className="manga-card-link">
        <div className="manga-card">
          <img
            className="manga-card-image"
            src={imageSrc}
            alt={displayTitle}
          />
          <div className="manga-card-title">{displayTitle}</div>
        </div>
      </Link>
    </div>
  );
};

export default MangaCard;