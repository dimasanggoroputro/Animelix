"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();
  const inputRef = useRef(null);

  // auto focus
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // ESC close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // fetch suggestions
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/anime?keyword=${encodeURIComponent(keyword)}`,
        );
        const data = await res.json();

        setSuggestions(data?.data?.animeList?.slice(0, 6) || []);
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword]);

  const reset = () => {
    setKeyword("");
    setSuggestions([]);
    setActiveIndex(-1);
    setOpen(false);
  };

  // 🔥 FIX IMPORTANT: encodeURIComponent
  const handleSearch = (value) => {
    if (!value.trim()) return router.push("/");

    router.push(`/search?keyword=${encodeURIComponent(value.trim())}`);

    reset();
  };

  // keyboard navigation
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((p) => (p + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((p) => (p <= 0 ? suggestions.length - 1 : p - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const selected =
        activeIndex >= 0 ? suggestions[activeIndex].title : keyword;

      handleSearch(selected);
    }
  };

  return (
    <>
      {/* ICON */}
      <button onClick={() => setOpen(true)}
        className="text-white hover:text-gray-300 hover:bg-white/20 rounded-full p-2 transition">
        <Search size={20} />
      </button>

      {/* OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/80 backdrop-blur-md">
          {" "}
          {/* close */}
          <button onClick={reset} className="absolute top-6 right-11 text-white">
            <X size={28} />
          </button>
          {/* box */}
          <div className="mt-35 w-full max-w-xl px-4">
            <div className="bg-black/70 border border-white/20 rounded-2xl overflow-hidden shadow-xl">
              {/* input */}
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search size={18} className="opacity-60" />

                <input
                  ref={inputRef}
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search anime..."
                  className="bg-transparent outline-none ml-3 w-full text-white"
                />
              </div>

              {/* suggestions */}
              <ul className="max-h-72 overflow-y-auto">
                {suggestions.map((anime, i) => (
                  <li
                    key={i}
                    onClick={() => handleSearch(anime.title)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
                      ${i === activeIndex ? "bg-white/20" : "hover:bg-white/10"}
                    `}
                  >
                    <img
                      src={anime.poster || "/no-image.png"}
                      className="w-13 h-13 rounded object-cover"
                    />

                    <span className="text-sm text-white">{anime.title}</span>
                  </li>
                ))}
              </ul>

              {/* empty */}
              {keyword && suggestions.length === 0 && (
                <p className="px-4 py-3 text-xs opacity-60">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
