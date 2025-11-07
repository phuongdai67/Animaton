export const SEARCH_QUERY = `
  query SearchMedia($search: String!, $type: MediaType, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(search: $search, type: $type, sort: SEARCH_MATCH) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        type
        format
        status
        averageScore
        startDate {
          year
        }
      }
    }
  }
`;
