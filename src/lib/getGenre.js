/**
 * lib/getGenre.js
 */

export async function getGenreList() {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("API_BASE_URL belum di-set");

  const res = await fetch(`${baseUrl}/anime/genre`, {
    next: { revalidate: 86400 }, // cache 24 jam, genre jarang berubah
  });

  if (!res.ok) {
    const error = new Error(`Gagal fetch genre list: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  const json = await res.json();
  return json.data?.genreList || [];
}

export async function getAnimeByGenre({ slug, page = 1 }) {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("API_BASE_URL belum di-set");

  const res = await fetch(
    `${baseUrl}/anime/genre/${encodeURIComponent(slug)}?page=${page}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    const error = new Error(`Gagal fetch genre: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  const json = await res.json();
  return {
    animeList: json.data?.animeList || [],
    pagination: json.pagination || null,
  };
}