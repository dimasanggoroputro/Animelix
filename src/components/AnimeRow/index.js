"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { useRef } from "react";

const AnimeCard = ({ anime }) => {
  return (
    <Link
      href={`/anime/${anime.animeId || anime.slug}`}
      className="group flex-shrink-0 w-36 md:w-44"
    >
      {/* POSTER */}
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
        <img
          src={anime.poster || anime.thumbnail}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

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
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur rounded-full p-3">
            <Play size={20} fill="white" className="text-white" />
          </div>
        </div>

        {/* Release day badge (ongoing) */}
        {anime.releaseDay && (
          <div className="absolute bottom-2 left-2 bg-red-600/90 text-white text-xs px-2 py-0.5 rounded font-semibold">
            {anime.releaseDay}
          </div>
        )}

        {/* Last release date (completed) */}
        {anime.lastReleaseDate && (
          <div className="absolute bottom-2 left-2 bg-green-700/90 text-white text-xs px-2 py-0.5 rounded font-semibold">
            Tamat {anime.lastReleaseDate}
          </div>
        )}
      </div>

      {/* TITLE */}
      <p className="mt-2 text-xs text-gray-300 leading-tight line-clamp-2 group-hover:text-white transition-colors">
        {anime.title}
      </p>

      {/* Latest release date (ongoing) */}
      {anime.latestReleaseDate && (
        <p className="text-xs text-gray-500 mt-0.5">{anime.latestReleaseDate}</p>
      )}
    </Link>
  );
};

const AnimeRow = ({ title, animeList = [], viewAllHref }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  if (animeList.length === 0) return null;

  return (
    <section className="mb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 px-6 md:px-12">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Lihat Semua <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {/* SCROLL WRAPPER */}
      <div className="relative group/row">
        {/* LEFT ARROW */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/3 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white w-9 h-9 rounded-full items-center justify-center hidden group-hover/row:flex transition-all backdrop-blur shadow-lg"
        >
          <ChevronLeft size={18} />
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 px-6 md:px-12 scrollbar-none scroll-smooth"
        >
          {animeList.map((anime, i) => (
            <AnimeCard key={i} anime={anime} />
          ))}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/3 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white w-9 h-9 rounded-full items-center justify-center hidden group-hover/row:flex transition-all backdrop-blur shadow-lg"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default AnimeRow;