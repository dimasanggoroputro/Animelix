/**
 * app/genre/[slug]/page.js
 * Halaman daftar anime berdasarkan genre tertentu
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnimeByGenre } from "@/lib/getGenre";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Anime ${title}`,
    description: `Daftar anime genre ${title} sub indo terlengkap.`,
  };
}

export default async function GenreDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page) || 1);

  let animeList = [];
  let pagination = null;
  let error = null;

  try {
    const result = await getAnimeByGenre({ slug, page });
    animeList = result.animeList;
    pagination = result.pagination;
  } catch (err) {
    console.error("[GenreDetailPage] error:", err.message);
    if (err.status === 404) notFound();
    error = true;
  }

  const genreTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400">Gagal memuat anime, coba lagi nanti 🙏</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* HEADER */}
      <div className="px-6 md:px-12 pt-8 pb-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/genre" className="hover:text-white transition-colors">
            Genre
          </Link>
          <span>/</span>
          <span className="text-gray-300">{genreTitle}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{genreTitle}</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {pagination
                ? `Halaman ${pagination.currentPage} dari ${pagination.totalPages}`
                : `${animeList.length} anime`}
            </p>
          </div>
        </div>

        <div className="w-16 h-1 bg-red-600 mt-4 rounded-full" />
      </div>

      {/* ANIME GRID */}
      <div className="px-6 md:px-12 py-8">
        {animeList.length === 0 ? (
          <p className="text-gray-500">Tidak ada anime untuk genre ini.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {animeList.map((anime, i) => (
              <Link
                key={i}
                href={`/anime/${anime.animeId}`}
                className="group flex flex-col gap-2"
              >
                {/* POSTER */}
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={anime.poster}
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

                  {/* Release day badge */}
                  {anime.releaseDay && (
                    <div className="absolute bottom-2 left-2 bg-red-600/90 text-white text-xs px-2 py-0.5 rounded font-semibold">
                      {anime.releaseDay}
                    </div>
                  )}

                  {/* Tamat badge */}
                  {anime.lastReleaseDate && (
                    <div className="absolute bottom-2 left-2 bg-green-700/90 text-white text-xs px-2 py-0.5 rounded font-semibold">
                      Tamat {anime.lastReleaseDate}
                    </div>
                  )}
                </div>

                {/* TITLE */}
                <div>
                  <p className="text-xs text-gray-300 leading-tight line-clamp-2 group-hover:text-white transition-colors">
                    {anime.title}
                  </p>

                  {/* Latest release */}
                  {anime.latestReleaseDate && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {anime.latestReleaseDate}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* PAGINATION */}
      {pagination && (pagination.hasPrevPage || pagination.hasNextPage) && (
        <div className="px-6 md:px-12 pb-16 flex items-center justify-center gap-3">
          {pagination.hasPrevPage ? (
            <Link
              href={`/genre/${slug}?page=${pagination.prevPage}`}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
            </Link>
          ) : (
            <div />
          )}

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                // Tampilkan 5 page di sekitar current page
                const half = 2;
                let start = Math.max(1, pagination.currentPage - half);
                let end = Math.min(pagination.totalPages, start + 4);
                start = Math.max(1, end - 4);
                const pageNum = start + i;
                if (pageNum > pagination.totalPages) return null;

                return (
                  <Link
                    key={pageNum}
                    href={`/genre/${slug}?page=${pageNum}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      pageNum === pagination.currentPage
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              },
            )}
          </div>

          {pagination.hasNextPage ? (
            <Link
              href={`/genre/${slug}?page=${pagination.nextPage}`}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
