"use client";
import React, { useEffect } from "react";
import { callAnilistApi } from "../../components/utils/api";

const query = `
  query {
    Page(page: 1, perPage: 5) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
      }
    }
  }
`;

export default function TestPage() {
  useEffect(() => {
    async function test() {
      const data = await callAnilistApi(query);
      console.log("AniList data:", data);
    }
    test();
  }, []);

  return <h1>Check console log để xem dữ liệu AniList</h1>;
}
