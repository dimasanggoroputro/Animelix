/**
 * app/genre/page.js
 * Halaman daftar semua genre (Netflix Style)
 */

import Link from "next/link";
import { getGenreList } from "@/lib/getGenre";

export const metadata = {
  title: "Genre Anime",
  description: "Jelajahi anime berdasarkan genre favoritmu.",
};

export default async function GenrePage() {
  let genreList = [];
  let error = null;

  try {
    genreList = await getGenreList();
  } catch (err) {
    console.error("[GenrePage] error:", err.message);
    error = true;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400">Gagal memuat genre, coba lagi nanti 🙏</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* HEADER */}
      <div className="px-6 md:px-12 pt-8 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide">Genre</h1>
        <p className="text-gray-400 mt-1 text-sm">
          {genreList.length} genre tersedia — pilih favoritmu
        </p>
      </div>

      {/* GENRE GRID */}
      <div className="px-6 md:px-12 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {genreList.map((genre) => (
            <Link
              key={genre.genreId}
              href={`/genre/${genre.genreId}`}
              className="group relative overflow-hidden rounded-lg bg-zinc-900 px-4 py-3 border border-white/5 transition-all duration-300 hover:scale-105 hover:border-red-500/30"
            >
              {/* BACKGROUND GRADIENT (HOVER EFFECT) */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-black/0 group-hover:from-red-600/40 group-hover:to-black/80 transition-all duration-300" />

              {/* CONTENT */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <h2 className="text-sm md:text-base font-semibold text-gray-300 tracking-wide group-hover:text-white transition-colors">
                  {genre.title}
                </h2>

                <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-gray-200 transition-all duration-300">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
