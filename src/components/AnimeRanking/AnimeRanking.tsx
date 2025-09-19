"use client";

import React from "react";
import Image from "next/image";

type AnimeItem = {
  id: number;
  title: string;
  coverImage: string; // URL or path to image
  score: number; // 0-10 scale
};

const mockRanking: AnimeItem[] = [
  {
    id: 1,
    title: "Fullmetal Alchemist: Brotherhood",
    coverImage: "/vercel.svg",
    score: 9.2,
  },
  { id: 2, title: "Steins;Gate", coverImage: "/vercel.svg", score: 9.0 },
  {
    id: 3,
    title: "Attack on Titan Season 3 Part 2",
    coverImage: "/vercel.svg",
    score: 8.9,
  },
  { id: 4, title: "Gintama°", coverImage: "/vercel.svg", score: 8.8 },
  {
    id: 5,
    title: "Hunter x Hunter (2011)",
    coverImage: "/vercel.svg",
    score: 8.8,
  },
  { id: 6, title: "Monster", coverImage: "/vercel.svg", score: 8.7 },
  { id: 7, title: "One Piece (Wano)", coverImage: "/vercel.svg", score: 8.6 },
  { id: 8, title: "Vinland Saga", coverImage: "/vercel.svg", score: 8.6 },
  { id: 9, title: "Mob Psycho 100 II", coverImage: "/vercel.svg", score: 8.5 },
  { id: 10, title: "Code Geass R2", coverImage: "/vercel.svg", score: 8.5 },
];

interface AnimeRankingProps {
  className?: string;
  title?: string;
  items?: AnimeItem[]; // allow override for real data later
}

export default function AnimeRanking({
  className = "",
  title = "Top 10 Anime",
  items = mockRanking,
}: AnimeRankingProps) {
  return (
    <aside
      className={`ranking-sidebar ${className}`}
      style={{
        width: 320,
        maxWidth: "100%",
        height: "fit-content",
        // no maxHeight and no internal scroll per request
        overflow: "visible",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(17, 24, 39, 0.85)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}> {title} </h3>
      </div>

      <ol
        style={{
          margin: 0,
          padding: 12,
          listStyle: "none",
          // no internal scroll
          overflowY: "visible",
        }}
      >
        {items.slice(0, 10).map((anime, index) => (
          <li
            key={anime.id}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 52px 1fr auto",
              alignItems: "center",
              gap: 12,
              padding: "10px 8px",
              borderRadius: 10,
              transition: "background 0.2s ease",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background:
                  index < 3
                    ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                    : "#1f2937",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              {index + 1}
            </span>

            <div
              style={{
                width: 52,
                height: 52,
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                background: "#111827",
              }}
            >
              <Image
                src={anime.coverImage}
                alt={anime.title}
                fill
                sizes="52px"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {anime.title}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Score: {anime.score.toFixed(1)}
              </div>
            </div>

            <div style={{ fontWeight: 700, fontSize: 13, opacity: 0.9 }}>
              {anime.score.toFixed(1)}
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
