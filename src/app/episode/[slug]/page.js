import EpisodeClient from "./EpisodeClient";

const EpisodePage = async ({ params }) => {
  // 🔥 WAJIB (Next.js terbaru)
  const { slug } = await params;

  const res = await fetch(
    `https://www.sankavollerei.com/anime/episode/${slug}`,
    {
      cache: "no-store",
    },
  );

  const result = await res.json();

  return <EpisodeClient initialData={result.data} />;
};

export default EpisodePage;
