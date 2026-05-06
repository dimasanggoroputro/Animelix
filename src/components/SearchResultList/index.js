import Link from "next/link";

const SearchResultList = ({ animeList = [] }) => {
  function limitText(text, max) {
    return text?.length > max ? text.slice(0, max) + "..." : text;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
      {animeList.map((anime, index) => (
        <Link
          key={index}
          href={`/anime/${anime.animeId || anime.slug}`}
          className="group bg-zinc-900 rounded-md overflow-hidden hover:scale-[1.03] transition"
        >
          {/* IMAGE */}
          <div className="relative">
            <img
              src={anime.poster || anime.thumbnail}
              alt={anime.title}
              className="w-full h-[300px] object-cover"
            />

            {/* overlay hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition" />
          </div>

          {/* INFO */}
          <div className="p-2">
            <h2 className="text-sm font-bold text-white">
              {limitText(anime.title, 18)}
            </h2>

            <p className="text-xs text-gray-400">
              {anime.episodes
                ? `Episode: ${anime.episodes}`
                : anime.status
                  ? anime.status
                  : "No info"}
            </p>

            {anime.score && (
              <p className="text-yellow-400 text-xs mt-1">⭐ {anime.score}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResultList;
