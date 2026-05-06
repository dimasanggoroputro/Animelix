"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const EpisodeClient = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.defaultStreamingUrl) {
      setStreamUrl(data.defaultStreamingUrl);
    }
  }, [data]);

  const changeServer = async (serverId) => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://www.sankavollerei.com/anime/server/${serverId}`,
      );

      const result = await res.json();
      const url = result?.data?.embedUrl || result?.data?.url;

      if (url) {
        setStreamUrl(url);
      } else {
        alert("Server tidak tersedia 😢");
      }
    } catch (err) {
      alert("Gagal load server 😢");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="text-white">Loading...</div>;

  return (
    <div className="bg-black text-white min-h-screen pt-20">
      {/* HEADER */}
      <div className="px-6 md:px-16 pt-6">
        <Link
          href="/"
          className="text-gray-400 hover:text-white transition bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded "
        >
          ← Back
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mt-4">{data.title}</h1>
      </div>

      {/* PLAYER SECTION */}
      <div className="px-6 md:px-16 mt-6">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <p className="text-gray-400">Loading server...</p>
            </div>
          )}

          {!loading && streamUrl && (
            <iframe src={streamUrl} className="w-full h-full" allowFullScreen />
          )}
        </div>
      </div>

      {/* NAV EPISODE */}
      <div className="px-6 md:px-16 mt-6 flex justify-between">
        {data.hasPrevEpisode ? (
          <Link
            href={`/episode/${data.prevEpisode.episodeId}`}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
          >
            ← Previous
          </Link>
        ) : (
          <div />
        )}

        {data.hasNextEpisode ? (
          <Link
            href={`/episode/${data.nextEpisode.episodeId}`}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Next →
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* SERVER SECTION (NETFLIX STYLE CHIPS) */}
      <div className="px-6 md:px-16 mt-10 pb-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">
          Choose Server
        </h2>

        {data.server?.qualities?.map((q, i) => (
          <div key={i} className="mb-6">
            <h3 className="text-sm text-gray-400 mb-2">{q.title}</h3>

            <div className="flex gap-2 flex-wrap">
              {q.serverList.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => changeServer(s.serverId)}
                  className="px-4 py-1 rounded-full bg-gray-800 hover:bg-red-600 transition text-sm"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeClient;
