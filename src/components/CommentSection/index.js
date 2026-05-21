"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, Loader2, LogIn } from "lucide-react";
import Link from "next/link";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CommentSection = ({ episodeId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch komentar
  const fetchComments = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/comments?episode_id=${episodeId}`);
      const json = await res.json();
      setComments(json.data || []);
    } catch (err) {
      console.error("Gagal fetch komentar:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (episodeId) fetchComments();
  }, [episodeId]);

  return (
    <div className="mt-8 px-4 md:px-12 pb-16">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={18} className="text-red-500" />
        <h2 className="text-lg font-bold">
          Komentar
          {comments.length > 0 && (
            <span className="ml-2 text-sm text-gray-500 font-normal">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* LOGIN PROMPT — sementara sampai NextAuth siap */}
      <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 mb-8">
        <div className="flex items-center gap-3">
          <LogIn size={18} className="text-gray-400" />
          <p className="text-gray-400 text-sm">Login untuk menulis komentar</p>
        </div>
        <Link
          href="/login"
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          Masuk
        </Link>
      </div>

      {/* COMMENTS LIST */}
      {fetching ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="text-gray-600 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10">
          <MessageSquare size={32} className="text-gray-700 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {comment.user_avatar ? (
                <img
                  src={comment.user_avatar}
                  alt={comment.user_name}
                  className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                  {comment.user_name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{comment.user_name}</span>
                  <span className="text-xs text-gray-600">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;