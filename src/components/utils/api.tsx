import { ANIME_BASE_URL, SERVER_BASE_URL, ANILIST_BASE_URL } from "./constants";
import axios from "axios";

// Generic REST API caller
const callApi = (base_url: string) => {
  return async ({
    endpoint,
    method = "GET",
    payload = {},
    accessToken = null,
  }: {
    endpoint: string;
    method?: string;
    payload?: any;
    accessToken?: string | null;
  }) =>
    await axios({
      method,
      url: `${base_url}/${endpoint}`,
      data: payload,
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    });
};

// AniList GraphQL API caller
export async function callAnilistApi<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  try {
    console.log("Making request to:", ANILIST_BASE_URL);
    console.log("Query:", query);

    const response = await fetch(ANILIST_BASE_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response error text:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    console.log("Response data:", json);

    if (json.errors) {
      throw new Error(JSON.stringify(json.errors));
    }

    return json.data as T;
  } catch (err) {
    console.error("AniList API error:", err);
    throw err;
  }
}

// REST APIs
export const callAnimeApi = callApi(ANIME_BASE_URL!);
export const callServerApi = callApi(SERVER_BASE_URL!);
