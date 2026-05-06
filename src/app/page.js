/**
 * app/page.js
 *
 * Server Component — fetch data langsung via lib/getAnime.js,
 * tanpa self-fetch ke /api/anime (anti-pattern di App Router).
 */

import AnimeList from "@/components/AnimeList";
import { getAnime } from "@/lib/getAnime";

// Metadata untuk SEO
export const metadata = {
  title: "Anime Terbaru — Tayang Sekarang",
  description: "Temukan anime terbaru, trending, dan paling populer saat ini.",
};

const Home = async ({ searchParams }) => {
  const page = Math.max(1, Number(searchParams?.page) || 1);

  let result = null;
  let errorType = null; // "not_found" | "server_error"

  try {
    result = await getAnime({ page });
  } catch (error) {
    console.error("[page.js] getAnime error:", error.message);
    errorType = error.status === 404 ? "not_found" : "server_error";
  }

  // --- Error States ---
  if (errorType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white text-center">
          {errorType === "not_found"
            ? "Data tidak ditemukan 😕"
            : "Terjadi kesalahan di server, coba lagi nanti 🙏"}
        </p>
      </div>
    );
  }

  const animeList = result?.data?.animeList || [];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO */}
      <section className="relative h-[80vh] flex items-end px-6 md:px-12 pb-10">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold">Tayang Sekarang</h1>
          <p className="text-gray-300 mt-3 text-sm">
            Temukan anime terbaru, trending, dan paling populer saat ini.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 md:px-12 py-10">
        <h2 className="text-lg font-semibold mb-4">Episode Terbaru</h2>

        {animeList.length === 0 ? (
          <p className="text-gray-400">Belum ada anime tersedia.</p>
        ) : (
          <AnimeList animeList={animeList} variant="horizontal" />
        )}
      </section>
    </div>
  );
};

export default Home;