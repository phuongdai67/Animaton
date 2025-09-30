import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { CARD_TYPES } from "../../components/utils/constants";
import "./SkeletonCard.css";
// Import AnimeCard CSS to use its classes
import "../cards/AnimeCard.css";

interface SkeletonCardProps {
  children?: React.ReactNode;
  className?: string;
  type?: string;
  [key: string]: any; // For additional props
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  children,
  className,
  type,
  ...props
}) => {
  if (type === CARD_TYPES.HORIZONTAL) {
    return (
      <Stack className="card-horizontal" direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" style={{ width: "50%" }}>
          <Skeleton
            animation="wave"
            sx={{ bgcolor: "#c4d4e4", borderRadius: "3px" }}
            variant="rectangular"
            height={60}
            width={48}
          />
          <Skeleton
            animation="wave"
            sx={{ bgcolor: "#c4d4e4", borderRadius: "3px" }}
            style={{ marginLeft: "8px" }}
            variant="text"
            width="40%"
            height={28}
          />
        </Stack>
        <Skeleton
          animation="wave"
          sx={{ bgcolor: "#c4d4e4", borderRadius: "3px" }}
          variant="text"
          width="30%"
          height={20}
        />
      </Stack>
    );
  }

  if (type === CARD_TYPES.SQUARE) {
    return (
      <Stack className="card-square" direction="row" height={265}>
        <Skeleton
          animation="wave"
          sx={{ bgcolor: "#c4d4e4", borderRadius: "3px" }}
          variant="rectangular"
          height={265}
          width={200}
        />
        <Stack style={{ width: "100%" }}>
          <Skeleton
            animation="wave"
            sx={{ bgcolor: "#c4d4e4", borderRadius: "3px" }}
            style={{ margin: "12px" }}
            variant="text"
            width="70%"
            height={28}
          />
          <Skeleton
            animation="wave"
            sx={{ bgcolor: "#c4d4e4", borderRadius: "3px" }}
            style={{ marginLeft: "8px", marginBottom: "12px" }}
            variant="text"
            width="40%"
            height={20}
          />
          <Skeleton
            animation="wave"
            sx={{ bgcolor: "#c4d4e4", borderRadius: "3px" }}
            style={{ marginLeft: "8px", marginBottom: "12px" }}
            variant="text"
            width="40%"
            height={20}
          />
        </Stack>
      </Stack>
    );
  }

  // Default case - simplified with inline styles to ensure it renders
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          backgroundColor: "transparent",
          height: "320px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image skeleton */}
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            bgcolor: "#e5e7eb",
            width: "100%",
            height: { xs: "153px", md: "265px" }, // Responsive height
            borderRadius: "8px",
          }}
        />
        {/* Title skeleton */}
        <div
          style={{
            marginTop: "8px",
            textAlign: "center",
            padding: "0 4px",
          }}
        >
          <Skeleton
            animation="wave"
            variant="text"
            sx={{
              bgcolor: "#e5e7eb",
              width: "85%",
              margin: "0 auto 4px",
              height: "18px",
            }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            sx={{
              bgcolor: "#e5e7eb",
              width: "60%",
              margin: "0 auto",
              height: "18px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
