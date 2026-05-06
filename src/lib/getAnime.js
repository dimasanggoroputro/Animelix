/**
 * lib/getAnime.js
 *
 * Helper shared antara API route dan page server component.
 * Menghindari self-fetch anti-pattern di Next.js App Router.
 */

/**
 * Fetch data anime langsung dari external API (server-only).
 *
 * @param {{ page?: number, keyword?: string }} options
 * @returns {Promise<{ data: { animeList: any[] }, pagination: any | null }>}
 */
export async function getAnime({ page = 1, keyword = "" } = {}) {
  const baseUrl = process.env.API_BASE_URL;

  console.log("API_BASE_URL:", baseUrl); // ←

  if (!baseUrl) {
    throw new Error("API_BASE_URL belum di-set di environment variables");
  }

  const url = keyword
    ? `${baseUrl}/anime/search/${encodeURIComponent(keyword)}`
    : `${baseUrl}/anime/ongoing-anime?page=${page}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const error = new Error(`External API error: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  const data = await res.json();

  // Normalize response
  return {
    data: {
      animeList: data.data?.animeList || data.data || [],
    },
    pagination: keyword ? null : data.pagination || null,
  };
}
