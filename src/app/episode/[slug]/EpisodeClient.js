"use client";

import CommentSection from "@/components/CommentSection";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Tv2,
  Server,
  Download,
  List,
  ExternalLink,
  Clock,
  Tag,
} from "lucide-react";

// Server yang relatif bersih tanpa iklan agresif
const CLEAN_SERVERS = [
  "otakuwatch5",
  "otakuwatch5hd",
  "odstream",
  "odstreamhd",
];

const EpisodeClient = ({ initialData }) => {
  const [data] = useState(initialData);
  const [streamUrl, setStreamUrl] = useState(null);
  const [activeServerId, setActiveServerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("server");

  useEffect(() => {
    if (data?.defaultStreamingUrl) {
      setStreamUrl(data.defaultStreamingUrl);
    }
  }, [data]);

  const changeServer = async (serverId) => {
    try {
      setLoading(true);
      setError(null);
      setActiveServerId(serverId);

      const res = await fetch(`/api/server/${serverId}`);
      if (!res.ok) throw new Error(`Server response: ${res.status}`);

      const result = await res.json();
      const url = result?.data?.embedUrl || result?.data?.url;

      if (url) {
        setStreamUrl(url);
      } else {
        setError("Server tidak tersedia, coba server lain 😢");
      }
    } catch (err) {
      console.error("[changeServer] error:", err.message);
      setError("Gagal load server, coba server lain 😢");
    } finally {
      setLoading(false);
    }
  };

  if (!data)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Data tidak ditemukan.</p>
      </div>
    );

  const qualities =
    data.server?.qualities?.filter((q) => q.serverList?.length > 0) || [];
  const downloadQualities =
    data.downloadUrl?.qualities?.filter((q) => q.urls?.length > 0) || [];
  const episodeList = data.info?.episodeList || [];
  const genreList = data.info?.genreList || [];

  return (
    <div className="bg-black text-white min-h-screen pt-16">
      {/* BACK + TITLE */}
      <div className="px-4 md:px-12 pt-6 pb-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-gray-500 hover:text-white transition text-sm mb-3"
        >
          <ChevronLeft size={15} /> Kembali
        </Link>

        <h1 className="text-lg md:text-2xl font-bold leading-tight">
          {data.title}
        </h1>

        {/* META INFO */}
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
          {data.info?.duration && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {data.info.duration}
            </span>
          )}
          {data.info?.type && (
            <span className="flex items-center gap-1">
              <Tv2 size={12} /> {data.info.type}
            </span>
          )}
          {data.releaseTime && <span>{data.releaseTime}</span>}
          {data.info?.credit && <span>Credit: {data.info.credit}</span>}
        </div>

        {/* GENRE CHIPS */}
        {genreList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {genreList.map((g) => (
              <Link
                key={g.genreId}
                href={`/genre/${g.genreId}`}
                className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 hover:bg-gray-700 px-2 py-0.5 rounded-full transition-colors"
              >
                <Tag size={10} /> {g.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* LAYOUT */}
      <div className="px-4 md:px-12 flex flex-col lg:flex-row gap-4">
        {/* PLAYER */}
        <div className="flex-1 min-w-0">
          <div
            className="relative w-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: "16/9", maxHeight: "520px" }}
          >
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 gap-3">
                <Loader2 size={36} className="text-red-500 animate-spin" />
                <p className="text-gray-400 text-sm">Memuat server...</p>
              </div>
            )}
            {error && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 gap-2">
                <AlertCircle size={32} className="text-red-500" />
                <p className="text-red-400 text-sm">{error}</p>
                <p className="text-gray-500 text-xs">
                  Pilih server lain di bawah
                </p>
              </div>
            )}
            {!loading && !error && !streamUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-2">
                <Tv2 size={32} className="text-gray-600" />
                <p className="text-gray-500 text-sm">
                  Pilih server untuk menonton
                </p>
              </div>
            )}
            {streamUrl && (
              <iframe
                key={streamUrl}
                src={streamUrl}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>

          {/* NAV EPISODE */}
          <div className="flex justify-between gap-3 mt-3">
            {data.hasPrevEpisode ? (
              <Link
                href={`/episode/${data.prevEpisode.episodeId}`}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition"
              >
                <ChevronLeft size={15} /> Sebelumnya
              </Link>
            ) : (
              <div />
            )}
            {data.hasNextEpisode ? (
              <Link
                href={`/episode/${data.nextEpisode.episodeId}`}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition"
              >
                Berikutnya <ChevronRight size={15} />
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* TABS */}
          <div className="mt-5">
            <div className="flex gap-1 border-b border-gray-800 mb-4">
              {[
                { id: "server", label: "Server", icon: <Server size={14} /> },
                {
                  id: "download",
                  label: "Download",
                  icon: <Download size={14} />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "border-red-500 text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* SERVER TAB */}
            {activeTab === "server" && (
              <div className="space-y-4">
                {qualities.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    Tidak ada server tersedia.
                  </p>
                )}
                {qualities.map((q, i) => (
                  <div key={i}>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                      {q.title}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {q.serverList.map((s, idx) => {
                        const isActive = activeServerId === s.serverId;
                        const serverName = s.title.trim();
                        const isClean = CLEAN_SERVERS.includes(
                          serverName.toLowerCase(),
                        );
                        return (
                          <button
                            key={idx}
                            onClick={() => changeServer(s.serverId)}
                            disabled={loading}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all disabled:opacity-50 ${
                              isActive
                                ? "bg-red-600 text-white"
                                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                            }`}
                          >
                            {serverName}
                            {isClean && (
                              <span className="text-green-400 text-xs">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DOWNLOAD TAB */}
            {activeTab === "download" && (
              <div className="space-y-4">
                {downloadQualities.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    Tidak ada link download tersedia.
                  </p>
                )}
                {downloadQualities.map((q, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">
                        {q.title}
                      </p>
                      {q.size && (
                        <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
                          {q.size}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {q.urls.map((u, idx) => (
                        <a
                          key={idx}
                          href={u.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-800 hover:bg-blue-700 text-gray-300 hover:text-white transition-all"
                        >
                          <ExternalLink size={12} /> {u.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* EPISODE LIST SIDEBAR */}
        {episodeList.length > 0 && (
          <div className="lg:w-64 xl:w-72 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <List size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-300">
                Daftar Episode
              </h2>
            </div>
            <div className="flex flex-col gap-1 max-h-[520px] overflow-y-auto pr-1">
              {episodeList.map((ep, i) => {
                const isActive = data.title?.includes(`Episode ${ep.eps}`);
                return (
                  <Link
                    key={i}
                    href={`/episode/${ep.episodeId}`}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-red-600 text-white font-semibold"
                        : "bg-gray-900 hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    <span>{ep.title}</span>
                    {ep.date && (
                      <span className="text-xs text-gray-500">{ep.date}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Comment Section */}
      <CommentSection episodeId={data.animeId} />
      <div className="pb-16" />
    </div>
  );
};

export default EpisodeClient;
