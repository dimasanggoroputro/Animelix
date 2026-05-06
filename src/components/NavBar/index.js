import Link from "next/link";
import Search from "@/components/Search";

const NavBar = () => {
  return (
    <nav className="bg-black/90 text-white shadow-lg fixed w-full z-50 px-6 md:px-12 py-4 ">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-3xl font-bold text-red-600 hover:text-red-500 transition"
          >
            ANIMELIX
          </Link>

          <Link href="/"> Home</Link>
          <Link href="/anime">Anime</Link>
          <Link href="/genre">Genre</Link>
          <Link href="/schedule">Jadwal</Link>
        </div>

        <Search />
      </div>
    </nav>
  );
};

export default NavBar;
