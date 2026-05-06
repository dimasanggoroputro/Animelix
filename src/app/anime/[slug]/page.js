import Link from "next/link";
import EpisodeClient from "./EpisodeClient";
import AnimeList from "@/components/AnimeList";

const DetailAnime = async ({ params }) => {
  const { slug } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/anime/anime/${slug}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    return <h1 className="text-white">Anime tidak ditemukan</h1>;
  }

  const result = await response.json();
  const anime = result.data;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO */}
      <div className="relative h-[90vh] w-full">
        <img
          src={anime.poster}
          alt={anime.title}
          className="absolute w-full h-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16 pb-10">
          <h1 className="text-4xl md:text-6xl font-bold">{anime.title}</h1>

          <p className="text-gray-300 mt-2">{anime.japanese}</p>

          <div className="flex gap-3 mt-3 text-sm text-gray-300">
            <span>Status: {anime.status}</span>
            <span>• Score: {anime.score}</span>
            <span>• Episode: {anime.episodes}</span>
          </div>

          <div className="flex gap-3 mt-5">
            <Link
              href="#episodes"
              className="bg-white text-black px-5 py-2 rounded font-semibold hover:bg-gray-300"
            >
              ▶ Play
            </Link>

            <Link
              href="/"
              className="bg-gray-700 px-5 py-2 rounded hover:bg-gray-600"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 md:px-16 py-10">
        {/* GENRE */}
        <div className="flex gap-2 flex-wrap">
          {anime.genreList?.map((genre, index) => (
            <span
              key={index}
              className="bg-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {genre.title}
            </span>
          ))}
        </div>

        {/* SINOPSIS */}
        <h2 className="mt-8 text-xl font-bold">Synopsis</h2>
        <div className="mt-3 text-gray-300 space-y-3 leading-relaxed">
          {anime.synopsis?.paragraphs?.length > 0 ? (
            anime.synopsis.paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>No synopsis available.</p>
          )}
        </div>

        {/* EPISODE SECTION (CLIENT COMPONENT) */}
        <h2 id="episodes" className="mt-10 text-xl font-bold">
          Episodes
        </h2>

        <EpisodeClient episodes={anime.episodeList} />

        {/* RECOMMENDED */}
        <h2 className="mt-12 text-xl font-bold">Recommended Anime</h2>
        <AnimeList animeList={result.data.animeList} variant="horizontal" />
      </div>
    </div>
  );
};

export default DetailAnime;
