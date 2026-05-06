import Link from "next/link";
import AnimeList from "@/components/AnimeList";

const Home = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/anime?page=${page}`,
    { next: { revalidate: 120 } },
  );

  if (!response.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Data tidak ditemukan
      </div>
    );
  }

  if (response.status === 429) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Kebanyakan request 😅 coba lagi nanti
      </div>
    );
  }

  const result = await response.json();
  const pagination = result.pagination;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* 🔥 HERO SECTION */}
      <section className="relative h-[80vh] flex items-end px-6 md:px-12 pb-10">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-5 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold">Tayang Sekarang</h1>

          <p className="text-gray-300 mt-3 text-sm">
            Temukan anime terbaru, trending, dan paling populer saat ini.
          </p>
        </div>
      </section>

      {/* 🔥 CONTENT */}
      <section className="px-6 md:px-12 py-10">
        <h2 className="text-lg font-semibold mb-4">Episode Terbaru</h2>

        <AnimeList animeList={result.data.animeList} variant="horizontal" />
      </section>
    </div>
  );
};

export default Home;
