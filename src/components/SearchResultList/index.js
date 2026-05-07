import Link from "next/link";
import { Search } from "lucide-react";

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
          className="group/card flex flex-col gap-2"
        >
          {/* POSTER */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-800">
            <img
              src={anime.poster || anime.thumbnail}
              alt={anime.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
              loading="lazy"
            />

            {/* SCORE */}
            {anime.score && (
              <div className="absolute top-2 left-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded">
                ★ {anime.score}
              </div>
            )}

            {/* OVERLAY HOVER (FIXED) */}
            <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-2 opacity-0 group-hover/card:opacity-100">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-white text-xs">
                <Search size={14} />
                Detail
              </div>

              {anime.episodes && (
                <span className="text-gray-300 text-xs">
                  {anime.episodes} eps
                </span>
              )}
            </div>
          </div>

          {/* INFO */}
          <div>
            <p className="text-xs text-gray-300 leading-tight line-clamp-2 group-hover:text-white transition-colors">
              {limitText(anime.title, 40)}
            </p>

            <p className="text-xs text-gray-500 mt-0.5">
              {anime.episodes
                ? `${anime.episodes} eps`
                : anime.status || "No info"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResultList;
