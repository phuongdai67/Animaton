"use client";
import { useParams } from "next/navigation";
import Header from "@/components/Header/Header";
import AnimeDetailPage from "@/components/AnimeDetailPage/AnimeDetailPage";

export default function AnimeDetail() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <>
      <Header />
      <AnimeDetailPage id={id} />
    </>
  );
}
