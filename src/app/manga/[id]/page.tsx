"use client";
import { useParams } from "next/navigation";
import Header from "@/components/Header/Header";
import MangaDetailPage from "@/components/MangaDetailPage/MangaDetailPage";

export default function MangaDetail() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <>
      <Header />
      <MangaDetailPage id={id} />
    </>
  );
}
