import SearchResultList from "@/components/SearchResultList";
import { getAnime } from "@/lib/getAnime";

const SearchPage = async ({ searchParams }) => {
  const params = await searchParams;
  const keyword = params?.keyword?.trim() || "";

  let animeList = [];
  let errorMessage = null;

  if (keyword) {
    try {
      const result = await getAnime({ keyword });
      animeList = result?.data?.animeList || [];
    } catch (error) {
      console.error("[SearchPage] getAnime error:", error.message);
      errorMessage = "Terjadi kesalahan saat mencari, coba lagi nanti 🙏";
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 py-6">
        {/* ERROR STATE */}
        {errorMessage && (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <p className="text-red-400 text-lg">{errorMessage}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!errorMessage && animeList.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <p className="text-gray-400 text-lg">
              {keyword
                ? "Anime tidak ditemukan 😢"
                : "Masukkan kata kunci untuk mencari"}
            </p>
            {keyword && (
              <p className="text-gray-600 text-sm mt-2">Coba kata kunci lain</p>
            )}
          </div>
        )}

        {/* RESULTS */}
        {!errorMessage && animeList.length > 0 && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-300">
                Result for <span className="text-white">{keyword}</span>
              </h2>
              <div className="w-16 h-1 bg-red-600 mt-2 rounded-full" />
            </div>

            <SearchResultList animeList={animeList} />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
