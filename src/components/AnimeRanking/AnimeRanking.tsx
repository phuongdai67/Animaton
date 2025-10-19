"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchTopByPeriod } from "../utils/rankingService";
import AnimeRankingSkeleton from "../SkeletonCard/AnimeRankingSkeleton";
import "./AnimeRanking.css";

type AnimeItem = {
  id: number;
  title: string;
  coverImage: string; // URL or path to image
  score: number; // 0-10 scale
};

interface AnimeRankingProps {
  className?: string;
  title?: string;
  // Optional datasets by period; if not provided, falls back to items/mockRanking
  itemsByPeriod?: Partial<
    Record<"day" | "week" | "month" | "season" | "year", AnimeItem[]>
  >;
}

export default function AnimeRanking({
  className = "",
  title = "Top 10 Anime",
  itemsByPeriod,
}: AnimeRankingProps) {
  const [activePeriod, setActivePeriod] = React.useState<
    "day" | "week" | "month" | "season" | "year"
  >("day");

  const periods: {
    key: "day" | "week" | "month" | "season" | "year";
    label: string;
  }[] = [
    { key: "day", label: "Ngày" },
    { key: "week", label: "Tuần" },
    { key: "month", label: "Tháng" },
    { key: "season", label: "Mùa" },
    { key: "year", label: "Năm" },
  ];

  const [remoteData, setRemoteData] = React.useState<
    Partial<Record<"day" | "week" | "month" | "season" | "year", AnimeItem[]>>
  >({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [initialLoad, setInitialLoad] = React.useState(true);

  React.useEffect(() => {
    let isCancelled = false;
    const key = activePeriod;
    if (itemsByPeriod?.[key]) return; // prefer external data if provided
    if (remoteData[key]) return; // cached

    setLoading(true);
    setError(null);
    fetchTopByPeriod(key, 10)
      .then((data) => {
        if (isCancelled) return;
        const mapped: AnimeItem[] = (data || []).map((d: any) => ({
          id: d.id,
          title: d.title,
          coverImage: d.coverImage,
          score: typeof d.score === "number" ? d.score : 0,
        }));
        setRemoteData((prev) => ({ ...prev, [key]: mapped }));
      })
      .catch((e) => {
        if (isCancelled) return;
        setError(e?.message || "Lỗi tải bảng xếp hạng");
      })
      .finally(() => {
        if (isCancelled) return;
        setLoading(false);
        setInitialLoad(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [activePeriod, itemsByPeriod, remoteData]);

  const displayedItems: AnimeItem[] =
    itemsByPeriod?.[activePeriod] ?? remoteData[activePeriod] ?? [];

  // Show skeleton when loading and no data
  if (loading && displayedItems.length === 0) {
    return <AnimeRankingSkeleton />;
  }

  return (
    <aside className={`ranking-sidebar ${className}`}>
      <div className="ranking-header">
        <h3 className="ranking-title">{title}</h3>
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Bộ lọc thời gian"
          className="period-tabs"
        >
          {periods.map((p) => {
            const isActive = p.key === activePeriod;
            return (
              <button
                key={p.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActivePeriod(p.key)}
                className={`period-tab ${isActive ? "period-tab-active" : ""}`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <ol className="ranking-list">
        {displayedItems.slice(0, 10).map((anime, index) => {
          const getRankClass = () => {
            if (index === 0) return "rank-1st";
            if (index === 1) return "rank-2nd";
            if (index === 2) return "rank-3rd";
            if (index === 3) return "rank-4th";
            return "";
          };

          return (
            <li key={anime.id} className="ranking-item">
              <Link href={`/anime/${anime.id}`} className="ranking-item-link">
                <span className={`rank-number ${getRankClass()}`}>
                  {index + 1}
                </span>

                <div className="ranking-cover">
                  <Image
                    src={anime.coverImage}
                    alt={anime.title}
                    fill
                    sizes="52px"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className="anime-info">
                  <div className="anime-title">{anime.title}</div>
                </div>

                <div className="anime-score">{anime.score.toFixed(1)}</div>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
