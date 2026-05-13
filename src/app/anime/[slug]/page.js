import Link from "next/link";
import EpisodeClient from "./EpisodeClient";
import AnimeRow from "@/components/AnimeRow";
import { notFound } from "next/navigation";
import { Play, ArrowLeft, Star, Tv2, Clock, CalendarDays } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const baseUrl = process.env.API_BASE_URL;
  const res = await fetch(`${baseUrl}/anime/anime/${slug}`, { cache: "no-store" });
  if (!res.ok) return { title: "Anime tidak ditemukan" };
  const json = await res.json();
  return {
    title: json.data?.title || "Detail Anime",
    description: json.data?.synopsis?.paragraphs?.[0] || "",
  };
}

// Shuffle array Fisher-Yates
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DetailAnime = async ({ params }) => {
  const { slug } = await params;
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) throw new Error("API_BASE_URL belum di-set");

  const response = await fetch(`${baseUrl}/anime/anime/${slug}`, {
    cache: "no-store",
  });

  if (response.status === 404) notFound();

  if (!response.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <h1 className="text-white">Anime tidak ditemukan</h1>
      </div>
    );
  }

  const result = await response.json();
  const anime = result.data;

  // Ambil genre pertama anime ini untuk fetch rekomendasi
  const firstGenre = anime.genreList?.[0]?.genreId;

  // Fetch dari 2 halaman random genre yang sama secara parallel
  // biar pool data lebih besar dan makin random
  let recommendedList = [];
  if (firstGenre) {
    const randomPage1 = Math.floor(Math.random() * 5) + 1;
    const randomPage2 = Math.floor(Math.random() * 5) + 1;

    const [res1, res2] = await Promise.allSettled([
      fetch(`${baseUrl}/anime/genre/${firstGenre}?page=${randomPage1}`, {
        next: { revalidate: 0 }, // no cache biar selalu random
      }),
      fetch(`${baseUrl}/anime/genre/${firstGenre}?page=${randomPage2}`, {
        next: { revalidate: 0 },
      }),
    ]);

    const lists = await Promise.all(
      [res1, res2].map(async (r) => {
        if (r.status !== "fulfilled" || !r.value.ok) return [];
        const json = await r.value.json();
        return json.data?.animeList || [];
      })
    );

    // Gabung, hapus duplikat & anime yang lagi ditonton, lalu shuffle
    const combined = [...lists[0], ...lists[1]];
    const unique = combined.filter(
      (a, i, self) =>
        a.animeId !== slug &&
        self.findIndex((b) => b.animeId === a.animeId) === i
    );

    recommendedList = shuffle(unique).slice(0, 16);
  }

  return (
    <div className="bg-black text-white min-h-screen">

      {/* HERO */}
      <div className="relative h-[90vh] w-full">
        <img
          src={anime.poster}
          alt={anime.title}
          className="absolute w-full h-full object-cover"
          style={{ filter: "brightness(0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16 pb-12 max-w-3xl">

          {/* BADGES */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
              <Tv2 size={11} /> ANIME
            </span>
            {anime.status && (
              <span className="text-xs border border-gray-500 text-gray-300 px-2 py-1 rounded">
                {anime.status}
              </span>
            )}
            {anime.score && (
              <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                <Star size={13} fill="currentColor" /> {anime.score}
              </span>
            )}
          </div>

          {/* TITLE */}
          <h1 className={`font-black leading-none tracking-tight text-white drop-shadow-2xl mb-2 ${
            anime.title?.length > 30 ? "text-3xl md:text-5xl" :
            anime.title?.length > 20 ? "text-4xl md:text-6xl" :
            "text-5xl md:text-7xl"
          }`}>
            {anime.title}
          </h1>

          {anime.japanese && (
            <p className="text-gray-400 italic mb-4">{anime.japanese}</p>
          )}

          {/* META */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
            {anime.episodes && (
              <span className="flex items-center gap-1">
                <Tv2 size={13} /> {anime.episodes} Episode
              </span>
            )}
            {anime.duration && (
              <span className="flex items-center gap-1">
                <Clock size={13} /> {anime.duration}
              </span>
            )}
            {anime.aired && (
              <span className="flex items-center gap-1">
                <CalendarDays size={13} /> {anime.aired}
              </span>
            )}
            {anime.studios && (
              <span className="text-gray-400">• {anime.studios}</span>
            )}
          </div>

          {/* GENRE CHIPS */}
          {anime.genreList?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genreList.map((genre) => (
                <Link
                  key={genre.genreId}
                  href={`/genre/${genre.genreId}`}
                  className="text-xs text-gray-300 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                >
                  {genre.title}
                </Link>
              ))}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-3">
            <Link
              href="#episodes"
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors text-sm"
            >
              <Play size={15} fill="black" /> Tonton Sekarang
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white px-6 py-3 rounded-full font-semibold transition-colors text-sm border border-white/20"
            >
              <ArrowLeft size={15} /> Kembali
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="py-10">

        {/* SINOPSIS */}
        <div className="px-6 md:px-16 mb-10">
          <h2 className="text-xl font-bold mb-3">Sinopsis</h2>
          <div className="text-gray-300 space-y-3 leading-relaxed max-w-3xl">
            {anime.synopsis?.paragraphs?.length > 0 ? (
              anime.synopsis.paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="text-gray-500">Sinopsis tidak tersedia.</p>
            )}
          </div>
        </div>

        {/* EPISODE SECTION */}
        <div className="px-6 md:px-16 mb-10" id="episodes">
          <h2 className="text-xl font-bold mb-4">Episodes</h2>
          <EpisodeClient episodes={anime.episodeList} />
        </div>

        {/* RECOMMENDED */}
        {recommendedList.length > 0 && (
          <AnimeRow
            title={`Rekomendasi Genre ${anime.genreList?.[0]?.title || ""}`}
            animeList={recommendedList}
          />
        )}
      </div>
    </div>
  );
};

export default DetailAnime;