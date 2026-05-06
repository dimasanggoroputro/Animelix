"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const DAYS_ORDER = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
  "Random",
];

// Mapping hari Indonesia ke index JS (0=Minggu)
const DAY_TO_JS = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
};

const getTodayName = () => {
  const jsDay = new Date().getDay();
  return Object.keys(DAY_TO_JS).find((d) => DAY_TO_JS[d] === jsDay) || "Senin";
};

const ScheduleClient = ({ schedule }) => {
  const [activeDay, setActiveDay] = useState("Senin");

  useEffect(() => {
    const today = getTodayName();
    // Cek apakah hari ini ada di data
    const exists = schedule.find((s) => s.day === today);
    if (exists) setActiveDay(today);
  }, [schedule]);

  // Sort schedule sesuai urutan hari
  const sorted = DAYS_ORDER.map((day) =>
    schedule.find((s) => s.day === day),
  ).filter(Boolean);

  const activeData = sorted.find((s) => s.day === activeDay);
  const animeList = activeData?.anime_list || [];
  const todayName = getTodayName();

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* HEADER */}
      <div className="px-6 md:px-12 pt-6 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold">Jadwal Rilis</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Anime yang tayang minggu ini · {animeList.length} anime hari ini
        </p>
      </div>

      {/* DAY TABS */}
      <div className="px-6 md:px-12 mt-2">
        <div className="flex gap-2 overflow-x-auto pb-2 py-2 scrollbar-none">
          {sorted.map((s) => {
            const isToday = s.day === todayName;
            const isActive = s.day === activeDay;

            return (
              <button
                key={s.day}
                onClick={() => setActiveDay(s.day)}
                className={`
                  relative flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }
                `}
              >
                {s.day}
                {/* Dot indikator hari ini */}
                {isToday && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-black" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ANIME GRID */}
      <div className="px-6 md:px-12 mt-6 pb-16">
        {animeList.length === 0 ? (
          <p className="text-gray-500">Tidak ada anime untuk hari ini.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
            {animeList.map((anime, i) => (
              <Link
                key={i}
                href={`/anime/${anime.slug}`}
                className="group/card flex flex-col gap-2"
              >
                {/* POSTER */}
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

                {/* TITLE */}
                <p className="text-xs text-gray-300 leading-tight line-clamp-2 group-hover:text-white transition-colors">
                  {anime.title}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleClient;
