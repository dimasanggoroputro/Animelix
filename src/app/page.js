/**
 * app/page.js
 */

import HeroSlider from "@/components/HeroSlider";
import AnimeList from "@/components/AnimeList";
import { getAnime } from "@/lib/getAnime";

export const metadata = {
  title: "Anime Terbaru — Tayang Sekarang",
  description: "Temukan anime terbaru, trending, dan paling populer saat ini.",
};

async function getAnimeDetail(slug) {
  const baseUrl = process.env.API_BASE_URL;
  const res = await fetch(`${baseUrl}/anime/anime/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.data) return null;
  // ✅ inject slug sebagai animeId karena detail API tidak return animeId
  return { ...json.data, animeId: slug };
}

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const Home = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);

  let result = null;
  let errorType = null;

  try {
    result = await getAnime({ page });
  } catch (error) {
    console.error("[page.js] getAnime error:", error.message);
    errorType = error.status === 404 ? "not_found" : "server_error";
  }

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

  const heroSlugs = pickRandom(animeList, 5).map((a) => a.animeId);
  const heroDetails = await Promise.all(
    heroSlugs.map((slug) => getAnimeDetail(slug))
  );
  const slides = heroDetails.filter(Boolean);

  return (
    <div className="bg-black text-white min-h-screen">
      <HeroSlider slides={slides} />

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