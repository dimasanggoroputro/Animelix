import EpisodeClient from "./EpisodeClient";
import { notFound } from "next/navigation";

const EpisodePage = async ({ params }) => {
  const { slug } = await params;

  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL belum di-set");
  }

  const res = await fetch(`${baseUrl}/anime/episode/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) notFound();

  if (!res.ok) {
    throw new Error(`Gagal fetch episode: ${res.status}`);
  }

  const result = await res.json();

  return <EpisodeClient initialData={result.data} />;
};

export default EpisodePage;
