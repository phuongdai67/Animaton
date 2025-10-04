import React from "react";
import Skeleton from "@mui/material/Skeleton";
import "./AnimeRankingSkeleton.css";

const AnimeRankingSkeleton: React.FC = () => {
  return (
    <aside className="ranking-sidebar">
      <div className="ranking-header">
        <h3 className="ranking-title">Top 10 Anime</h3>
        {/* Period tabs - keep original tabs, no skeleton */}
        <div className="period-tabs">
          {["Ngày", "Tuần", "Tháng", "Mùa", "Năm"].map((label, index) => (
            <button
              key={index}
              className={`period-tab ${index === 0 ? "period-tab-active" : ""}`}
              disabled
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ol className="ranking-list">
        {Array.from({ length: 10 }).map((_, index) => (
          <li key={index} className="ranking-item-skeleton">
            {/* Rank number skeleton */}
            <Skeleton
              animation="wave"
              variant="circular"
              width={28}
              height={28}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}
            />

            {/* Cover image skeleton */}
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={52}
              height={52}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
              }}
            />

            {/* Title skeleton */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <Skeleton
                animation="wave"
                variant="text"
                width="85%"
                height={18}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}
              />
            </div>

            {/* Score skeleton */}
            <Skeleton
              animation="wave"
              variant="text"
              width={32}
              height={18}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}
            />
          </li>
        ))}
      </ol>
    </aside>
  );
};

export default AnimeRankingSkeleton;
