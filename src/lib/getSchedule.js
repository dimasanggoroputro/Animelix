/**
 * lib/getSchedule.js
 */

export async function getSchedule() {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL belum di-set");
  }

  const res = await fetch(`${baseUrl}/anime/schedule`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const error = new Error(`Gagal fetch jadwal: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  const json = await res.json();
  return json.data || [];
}