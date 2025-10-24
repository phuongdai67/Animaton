"use client";

import React from "react";
import Link from "next/link";
import "./CharacterSkeletonCard.css";

type CharacterCardProps = {
  data: {
    id: number;
    name: {
      full?: string;
      userPreferred?: string;
      native?: string;
    };
    image: {
      large?: string;
      medium?: string;
    };
  };
};

const CharacterCard: React.FC<CharacterCardProps> = ({ data }) => {
  const displayName =
    data.name.userPreferred || data.name.full || data.name.native || "Unknown";
  const imageSrc =
    data.image.large || data.image.medium || "/placeholder-character.jpg";

  return (
    <div className="character-card-container">
      <Link href={`/character/${data.id}`} className="character-card-link">
        <div className="character-card">
          <img
            className="character-card-image"
            src={imageSrc}
            alt={displayName}
          />
          <div className="character-card-title">{displayName}</div>
        </div>
      </Link>
    </div>
  );
};

export default CharacterCard;
