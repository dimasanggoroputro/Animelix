"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Play, Info, Star, ChevronLeft, ChevronRight, Tv2 } from "lucide-react";

const ACCENT_COLORS = [
  "from-red-900/80",
  "from-purple-900/80",
  "from-blue-900/80",
  "from-emerald-900/80",
  "from-orange-900/80",
  "from-pink-900/80",
  "from-cyan-900/80",
  "from-yellow-900/80",
];
const BUTTON_COLORS = [
  "bg-red-600 hover:bg-red-500",
  "bg-purple-600 hover:bg-purple-500",
  "bg-blue-600 hover:bg-blue-500",
  "bg-emerald-600 hover:bg-emerald-500",
  "bg-orange-600 hover:bg-orange-500",
  "bg-pink-600 hover:bg-pink-500",
  "bg-cyan-600 hover:bg-cyan-500",
  "bg-yellow-600 hover:bg-yellow-500",
];
const DOT_COLORS = [
  "bg-red-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-yellow-500",
];

const HeroSlider = ({ slides = [] }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((index) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(index);
      setFade(true);
    }, 300);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next, slides.length]);

  if (slides.length === 0) return null;

  const anime = slides[current];
  const accent = ACCENT_COLORS[current % ACCENT_COLORS.length];
  const btnColor = BUTTON_COLORS[current % BUTTON_COLORS.length];
  const dotColor = DOT_COLORS[current % DOT_COLORS.length];
  const synopsis = anime.synopsis?.paragraphs?.[0] || "";

  return (
    <section
      className="relative h-[95vh] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* BACKGROUND */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
      >
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover object-top scale-105"
          style={{ filter: "brightness(0.5)" }}
        />
      </div>

      {/* GRADIENT */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${accent} via-black/40 to-transparent`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* CONTENT */}
      <div
        className={`relative z-10 flex flex-col justify-end h-full px-8 md:px-16 pb-20 max-w-2xl transition-all duration-300 ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {/* BADGE + SCORE */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`flex items-center gap-1 ${btnColor.split(" ")[0]} text-white text-xs font-bold px-3 py-1 rounded`}
          >
            <Tv2 size={12} />
            ANIME
          </span>
          {anime.score && (
            <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
              <Star size={13} fill="currentColor" />
              {anime.score}
            </span>
          )}
          {anime.status && (
            <span className="text-gray-400 text-xs border border-gray-600 px-2 py-0.5 rounded">
              {anime.status}
            </span>
          )}
        </div>

        {/* TITLE */}
        <h1
          className={`font-black leading-none tracking-tight text-white drop-shadow-2xl mb-3 line-clamp-2 ${
            anime.title.length > 28
              ? "text-3xl md:text-5xl"
              : anime.title.length > 20
                ? "text-4xl md:text-6xl"
                : "text-5xl md:text-7xl"
          }`}
          style={{
            textShadow: "0 4px 24px rgba(0,0,0,0.8)",
            WebkitTextStroke: "1px rgba(255,255,255,0.1)",
          }}
        >
          {anime.title}
        </h1>

        {/* META */}
        <div className="flex flex-wrap items-center gap-2 text-gray-300 text-sm mb-3">
          {anime.japanese && (
            <span className="text-gray-400 italic">{anime.japanese}</span>
          )}
          {anime.season && (
            <>
              <span className="text-gray-500">•</span>
              <span>{anime.season}</span>
            </>
          )}
          {anime.episodes && (
            <>
              <span className="text-gray-500">•</span>
              <span>{anime.episodes} Eps</span>
            </>
          )}
          {anime.studios && (
            <>
              <span className="text-gray-500">•</span>
              <span>{anime.studios}</span>
            </>
          )}
        </div>

        {/* GENRE CHIPS */}
        {anime.genreList?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {anime.genreList.slice(0, 4).map((g) => (
              <Link
                key={g.genreId}
                href={`/genre/${g.genreId}`}
                className="text-xs text-gray-300 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full transition-colors"
              >
                {g.title}
              </Link>
            ))}
          </div>
        )}

        {/* SYNOPSIS */}
        {synopsis && (
          <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-2 max-w-lg">
            {synopsis}
          </p>
        )}

        {/* BUTTONS */}
        <div className="flex items-center gap-3">
          <Link
            href={`/anime/${anime.animeId}`}
            className={`flex items-center gap-2 ${btnColor} text-white font-bold px-7 py-3 rounded-full transition-all duration-200 shadow-lg text-sm`}
          >
            <Play size={15} fill="white" />
            Tonton Sekarang
          </Link>
          <Link
            href={`/anime/${anime.animeId}`}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 text-sm border border-white/20"
          >
            <Info size={15} />
            Info
          </Link>
        </div>
      </div>

      {/* PREV ARROW */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur"
      >
        <ChevronLeft size={22} />
      </button>

      {/* NEXT ARROW */}
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur"
      >
        <ChevronRight size={22} />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-8 left-8 md:left-16 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? `w-8 h-2 ${dotColor}`
                : "w-2 h-2 bg-gray-500 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* PROGRESS BAR */}
      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div
            key={current}
            className={`h-full ${dotColor}`}
            style={{ animation: "progressBar 6s linear forwards" }}
          />
        </div>
      )}

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
