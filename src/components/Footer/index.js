import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 px-6 md:px-12 py-8 border-t border-gray-800">
      {/* LOGO / BRAND */}
      <Link
        href="/"
        className="text-3xl font-bold text-red-600 hover:text-red-500 transition"
      >
        ANIMELIX
      </Link>

      {/* MENU SIMPLE */}
      <div className="flex flex-wrap gap-4 text-sm mb-4">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <Link href="#" className="hover:text-white">
          Anime
        </Link>
        <Link href="#" className="hover:text-white">
          Genre
        </Link>
        <Link href="#" className="hover:text-white">
          About
        </Link>
      </div>

      {/* COPYRIGHT */}
      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} AnimeKu. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
