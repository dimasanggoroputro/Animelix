import Link from "next/link";
import Search from "@/components/Search";

const NavBar = () => {
  return (
    <nav className="bg-gradient-to-b from-gray-800 to-black/50 text-white shadow-lg border-b border-white/10 fixed w-full z-10 px-6 md:px-12 py-4 ">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-red-600 hover:text-red-500 transition">
          ANIMELIX
        </Link>

        <Search />
      </div>
    </nav>
  );
};

export default NavBar;
