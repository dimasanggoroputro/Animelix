"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, S } from 'lucide-react';

const AnimeRowClient = ({ animeList }) => {
  const ref = useRef(null);

  const scroll = (direction) => {
    if (!ref.current) return;

    const scrollAmount = 300;

    ref.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {/* 🔥 LEFT BUTTON */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 
        bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ArrowLeft />
      </button>

      {/* 🔥 RIGHT BUTTON */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 
        bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ArrowRight />
      </button>

      {/* 🔥 SCROLL CONTAINER */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-2"
      >
        {animeList.map((anime, index) => (
          <div key={index} className="min-w-[160px]">
            <Link href={`/anime/${anime.animeId || anime.slug}`}>
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-[240px] object-cover rounded-md transition-transform duration-300 hover:scale-105"
              />

              <p className="text-sm mt-2 font-semibold">{anime.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimeRowClient;
