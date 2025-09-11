"use client";

import React, { useState } from "react";
import "./AnimeCard.css";

type AnimeCardProps = {
  data: any;
  noDialog?: boolean;
  linkTo?: string;
};

const AnimeCard: React.FC<AnimeCardProps> = ({ data, noDialog, linkTo }) => {
  const [showDialog, setShowDialog] = useState(false);

  const hasDialog =
    !noDialog && (data?.type === "ANIME" || data?.type === "MANGA");

  const computedLink =
    linkTo || `/${String(data?.type || "anime").toLowerCase()}/${data?.id}`;

  const titleText = data?.title
    ? data?.title?.romaji || data?.title?.english || data?.title?.native
    : data?.name?.full;

  const imageSrc = data?.coverImage?.large || data?.image?.large || data?.image;

  const handleMouseEnter = () => {
    if (hasDialog) setShowDialog(true);
  };

  const handleMouseLeave = () => {
    if (hasDialog) setShowDialog(false);
  };

  return (
    <div className="cardContainer">
      <div
        className="card"
        onMouseEnter={hasDialog ? handleMouseEnter : undefined}
        onMouseLeave={hasDialog ? handleMouseLeave : undefined}
      >
        <a href={computedLink}>
          <img className="cardImage" src={imageSrc} alt={titleText} />
        </a>
        <a className="cardTitle" href={computedLink}>
          {titleText}
        </a>
      </div>
      {/* Intentionally leaving out hover dialog integration as requested */}
    </div>
  );
};

export default AnimeCard;
