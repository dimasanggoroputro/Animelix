import Link from "next/link";
import { Play, Star } from "lucide-react";

const SearchResultList = ({ animeList = [] }) => {
  function limitText(text, max) {
    return text?.length > max ? text.slice(0, max) + "..." : text;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
      {animeList.map((anime, index) => (
        <Link
          key={index}
          href={`/anime/${anime.animeId || anime.slug}`}
          className="group flex flex-col gap-2"
        >
          {/* POSTER */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
            <img
              src={anime.poster || anime.thumbnail}
              alt={anime.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Score badge */}
            {anime.score && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded">
                <Star size={10} fill="currentColor" />
                {anime.score}
              </div>
            )}

            {/* Episode badge */}
            {anime.episodes && (
              <div className="absolute top-2 right-2 bg-black/70 text-gray-300 text-xs px-2 py-0.5 rounded">
                {anime.episodes} Eps
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur rounded-full p-3">
                <Play size={20} fill="white" className="text-white" />
              </div>
            </div>

            {/* Release day */}
            {anime.releaseDay && (
              <div className="absolute bottom-2 left-2 bg-red-600/90 text-white text-xs px-2 py-0.5 rounded font-semibold">
                {anime.releaseDay}
              </div>
            )}

            {/* Completed badge */}
            {anime.lastReleaseDate && (
              <div className="absolute bottom-2 left-2 bg-green-700/90 text-white text-xs px-2 py-0.5 rounded font-semibold">
                Tamat {anime.lastReleaseDate}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <p className="text-xs text-gray-300 leading-tight line-clamp-2 group-hover:text-white transition-colors">
              {limitText(anime.title, 40)}
            </p>

            {anime.latestReleaseDate ? (
              <p className="text-xs text-gray-500 mt-0.5">
                {anime.latestReleaseDate}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-0.5">
                {anime.status || "No info"}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResultList;
