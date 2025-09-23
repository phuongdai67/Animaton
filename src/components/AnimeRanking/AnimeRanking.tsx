"use client";

import React from "react";
import Image from "next/image";
import { fetchTopByPeriod } from "../utils/rankingService";

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
      });

    return () => {
      isCancelled = true;
    };
  }, [activePeriod, itemsByPeriod, remoteData]);

  const displayedItems: AnimeItem[] =
    itemsByPeriod?.[activePeriod] ?? remoteData[activePeriod] ?? [];

  return (
    <aside
      className={`ranking-sidebar ${className}`}
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "fit-content",
        // no maxHeight and no internal scroll per request
        overflow: "visible",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#80a6f2",
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
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Bộ lọc thời gian"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 6,
            marginTop: 12,
          }}
        >
          {periods.map((p) => {
            const isActive = p.key === activePeriod;
            return (
              <button
                key={p.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActivePeriod(p.key)}
                style={{
                  width: "100%",
                  padding: "5px 8px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  border: isActive
                    ? "1px solid rgba(255,255,255,0.6)"
                    : "1px solid rgba(255,255,255,0.12)",
                  background: isActive
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && <div style={{ padding: 12, color: "#fca5a5" }}>{error}</div>}

      <ol
        style={{
          margin: 0,
          padding: 12,
          listStyle: "none",
          // no internal scroll
          overflowY: "visible",
        }}
      >
        {loading && !(itemsByPeriod && itemsByPeriod[activePeriod]) && (
          <li style={{ padding: 12, opacity: 0.8 }}>Đang tải...</li>
        )}
        {displayedItems.slice(0, 10).map((anime, index) => (
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
