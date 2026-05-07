"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const AnimeList = ({ variant = "grid" }) => {
  const ref = useRef(null);

  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const maxPage = 8;
  const [loading, setLoading] = useState(false);

  function limitText(text, max) {
    return text?.length > max ? text.slice(0, max) + "..." : text;
  }

  // 🔥 FETCH DATA PER PAGE
  const fetchAnime = async (pageNumber) => {
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/anime?page=${pageNumber}`,
      );

      const data = await res.json();

      const list = data?.data?.animeList || [];

      setAnimeList((prev) => [...prev, ...list]);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    fetchAnime(page);
  }, []);

  // 🔥 LOAD NEXT PAGE
  const loadMore = () => {
    if (page >= maxPage) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnime(nextPage);
  };

  // 🔥 DETECT SCROLL END
  const handleScroll = () => {
    if (!ref.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = ref.current;

    if (scrollLeft + clientWidth >= scrollWidth - 50) {
      loadMore();
    }
  };

  // ================= CARD =================
  const Card = ({ anime }) => (
    <Link
      href={`/anime/${anime.animeId || anime.slug}`}
      className="group/card relative block min-w-[160px]"
    >
      <div className="relative overflow-hidden rounded-md shadow-lg">
        <img
          src={anime.poster || anime.thumbnail}
          alt={anime.title}
          className="w-full h-[240px] object-cover transition-transform duration-300 group-hover/card:scale-102"
        />

        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/60 group-hover/card:backdrop-blur-[2px] transition" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition">
          <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full text-white text-sm">
            <Search size={16} />
            Detail
          </div>
        </div>
      </div>

      <div className="mt-2 px-1">
        <h2 className="text-sm font-bold text-white">
          {limitText(anime.title, 18)}
        </h2>

        <p className="text-xs text-gray-400">
          {anime.episodes
            ? `Episode: ${anime.episodes}`
            : anime.status
              ? `Status: ${anime.status}`
              : "No info"}
        </p>

        <p className="text-xs text-gray-400">
          {(anime.releaseDay || anime.latestReleaseDate) &&
            `Release: ${anime.releaseDay ?? ""} ${anime.latestReleaseDate ?? ""}`}
        </p>

        {anime.score && (
          <p className="text-yellow-400 text-xs mt-1">⭐ {anime.score}</p>
        )}
      </div>
    </Link>
  );

  // ================= HORIZONTAL =================
  if (variant === "horizontal") {
    return (
      <div className="relative group/carousel">
        {/* BUTTON LEFT */}
        <button
          onClick={() =>
            ref.current.scrollBy({ left: -300, behavior: "smooth" })
          }
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 
          bg-black/60 text-white p-2 rounded-full 
          opacity-0 group-hover/carousel:opacity-100 transition"
        >
          <ChevronLeft />
        </button>

        {/* BUTTON RIGHT */}
        <button
          onClick={() =>
            ref.current.scrollBy({ left: 300, behavior: "smooth" })
          }
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 
          bg-black/60 text-white p-2 rounded-full 
          opacity-0 group-hover/carousel:opacity-100 transition"
        >
          <ChevronRight />
        </button>

        {/* SCROLL */}
        <div
          ref={ref}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-2 cursor-grab active:cursor-grabbing"
        >
          {animeList.map((anime, i) => (
            <Card key={i} anime={anime} />
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-400 mt-2">Loading...</p>
        )}
      </div>
    );
  }

  // ================= GRID =================
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 mt-4">
      {animeList.map((anime, i) => (
        <Card key={i} anime={anime} />
      ))}
    </div>
  );
};

export default AnimeList;
