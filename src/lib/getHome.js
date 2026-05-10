/**
 * lib/getHome.js
 */

export async function getHome() {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("API_BASE_URL belum di-set");

  const res = await fetch(`${baseUrl}/anime/home`, {
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    const error = new Error(`Gagal fetch home: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  const json = await res.json();
  return json.data || {};
}