"use client";

import Link from "next/link";
import Search from "@/components/Search";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  return (
    <nav className="bg-black/90 text-white shadow-lg fixed top-0 left-0 w-full z-50 border-b border-white/5">
      <div className="px-6 md:px-12 h-16 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          {/* LOGO */}
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold text-red-600 hover:text-red-500 transition"
          >
            ANIMELIX
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/genre" className="hover:text-white transition-colors">
              Genre
            </Link>
            <Link href="/schedule" className="hover:text-white transition-colors">
              Jadwal
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <Search />

          {/* AUTH BUTTONS */}
          {isSignedIn ? (
            // Udah login — tampilkan avatar + dropdown dari Clerk
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          ) : (
            // Belum login — tampilkan tombol login & register
            <div className="hidden md:flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5">
                  Masuk
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-full transition-colors font-medium">
                  Daftar
                </button>
              </SignUpButton>
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5 pt-4 flex flex-col gap-4 text-sm text-gray-300 bg-black/95 border-t border-white/5">
          <Link href="/" onClick={() => setOpen(false)} className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/genre" onClick={() => setOpen(false)} className="hover:text-white transition-colors">
            Genre
          </Link>
          <Link href="/schedule" onClick={() => setOpen(false)} className="hover:text-white transition-colors">
            Jadwal
          </Link>

          {/* AUTH MOBILE */}
          {isSignedIn ? (
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
              <span className="text-gray-400 text-xs">{user?.firstName || user?.emailAddresses?.[0]?.emailAddress}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <SignInButton mode="modal">
                <button className="text-left text-gray-300 hover:text-white transition-colors">
                  Masuk
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-left text-red-500 hover:text-red-400 transition-colors font-medium">
                  Daftar Sekarang
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;