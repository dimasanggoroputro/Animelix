"use client";

import Link from "next/link";
import { Calendar, ChevronRight, Play } from "lucide-react";

const DAY_TO_JS = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
};

const TodaySchedule = ({ schedule = [] }) => {
  const jsDay = new Date().getDay();
  const todayName = Object.keys(DAY_TO_JS).find((d) => DAY_TO_JS[d] === jsDay);
  const todayData = schedule.find((s) => s.day === todayName);
  const animeList = todayData?.anime_list || [];

  if (animeList.length === 0) return null;

  return (
    <section className="mb-10 px-6 md:px-12">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-red-500" />
          <h2 className="text-lg font-bold text-white">
            Tayang Hari Ini
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({todayName})
            </span>
          </h2>
        </div>
        <Link
          href="/schedule"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Jadwal Lengkap <ChevronRight size={16} />
        </Link>
      </div>

      {/* GRID */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
        {animeList.map((anime, i) => (
          <Link
            key={i}
            href={`/anime/${anime.slug}`}
            className="group flex flex-col gap-1.5"
          >
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur rounded-full p-3">
                  <Play size={20} fill="white" className="text-white" />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2 group-hover:text-white transition-colors leading-tight">
              {anime.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TodaySchedule;
