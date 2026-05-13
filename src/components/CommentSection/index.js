"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { MessageSquare, Send, Trash2, Loader2, LogIn } from "lucide-react";

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
  const { isSignedIn, user } = useUser();
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

  // Submit komentar
  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (content.trim().length > 500) {
      setError("Komentar maksimal 500 karakter");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episode_id: episodeId,
          content: content.trim(),
          user_name:
            user?.fullName ||
            user?.firstName ||
            user?.emailAddresses?.[0]?.emailAddress ||
            "Anonymous",
          user_avatar: user?.imageUrl || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Gagal kirim komentar");
      }

      const json = await res.json();
      setComments((prev) => [json.data, ...prev]);
      setContent("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hapus komentar
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus");
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Gagal hapus komentar:", err);
    } finally {
      setDeletingId(null);
    }
  };

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

      {/* INPUT AREA */}
      {isSignedIn ? (
        <div className="flex gap-3 mb-8">
          {/* AVATAR */}
          <img
            src={user?.imageUrl}
            alt={user?.firstName}
            className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
          />

          {/* INPUT */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Tulis komentar... (Enter untuk kirim)"
              rows={3}
              maxLength={500}
              className="w-full bg-gray-900 border border-gray-700 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 resize-none outline-none transition-colors"
            />

            <div className="flex items-center justify-between mt-2">
              <span
                className={`text-xs ${content.length > 450 ? "text-yellow-500" : "text-gray-600"}`}
              >
                {content.length}/500
              </span>

              <div className="flex items-center gap-2">
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={loading || !content.trim()}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* BELUM LOGIN */
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 mb-8">
          <div className="flex items-center gap-3">
            <LogIn size={18} className="text-gray-400" />
            <p className="text-gray-400 text-sm">
              Login untuk menulis komentar
            </p>
          </div>
          <SignInButton mode="modal">
            <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Masuk
            </button>
          </SignInButton>
        </div>
      )}

      {/* COMMENTS LIST */}
      {fetching ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="text-gray-600 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10">
          <MessageSquare size={32} className="text-gray-700 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              {/* AVATAR */}
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

              {/* CONTENT */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">
                    {comment.user_name}
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              {/* DELETE (hanya muncul kalau komentar milik sendiri) */}
              {isSignedIn && user?.id === comment.user_id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-600 hover:text-red-500 transition-all disabled:opacity-50 mt-0.5"
                >
                  {deletingId === comment.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
