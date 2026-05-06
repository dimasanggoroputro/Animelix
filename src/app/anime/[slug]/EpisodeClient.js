"use client";

import { useState } from "react";
import Link from "next/link";

const EpisodeClient = ({ episodes }) => {
  const [page, setPage] = useState(1);
  const limit = 50;

  const start = (page - 1) * limit;
  const end = page * limit;

  const currentEpisodes = episodes.slice(start, end);
  const totalPages = Math.ceil(episodes.length / limit);

  return (
    <div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
        {currentEpisodes.map((ep, index) => (
          <Link
            key={index}
            href={`/episode/${ep.episodeId}`}
            className="bg-gray-900 hover:bg-gray-800 text-center px-2 py-2 rounded-md text-sm"
          >
            Episode {ep.eps}
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-800 rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-4 py-2 bg-gray-900 rounded">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-800 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EpisodeClient;
