import SearchResultList from "@/components/SearchResultList";

const SearchPage = async ({ searchParams }) => {
  const params = await searchParams;
  const keyword = params?.keyword || "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/anime?keyword=${encodeURIComponent(keyword)}`,
    { cache: "no-store" },
  );

  const result = await response.json();

  const animeList = result?.data?.animeList || result?.data || [];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      {/* CONTENT */}
      <div className="container mx-auto px-4 py-6">
        {/* EMPTY STATE */}
        {animeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <p className="text-gray-400 text-lg">Anime tidak ditemukan 😢</p>
            <p className="text-gray-600 text-sm mt-2">Coba kata kunci lain</p>
          </div>
        ) : (
          <>
            {/* SECTION TITLE */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-300">
                Result for <span className="text-white">{keyword}</span>
              </h2>
              <div className="w-16 h-1 bg-red-600 mt-2 rounded-full"></div>
            </div>
            {/* GRID */}
            <SearchResultList animeList={animeList} />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
