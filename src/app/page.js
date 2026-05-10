/**
 * app/page.js
 */

import HeroSlider from "@/components/HeroSlider";
import AnimeRow from "@/components/AnimeRow";
import TodaySchedule from "@/components/TodaySchedule";
import { getHome } from "@/lib/getHome";
import { getSchedule } from "@/lib/getSchedule";

export const metadata = {
  title: "Anime Sub Indo — Terbaru & Terlengkap",
  description: "Nonton anime sub indo terbaru, ongoing, dan lengkap.",
};

async function getAnimeDetail(slug) {
  const baseUrl = process.env.API_BASE_URL;
  const res = await fetch(`${baseUrl}/anime/anime/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.data) return null;
  return { ...json.data, animeId: slug };
}

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

const Home = async () => {
  // Fetch semua data parallel
  const [homeData, schedule] = await Promise.allSettled([
    getHome(),
    getSchedule(),
  ]);

  const home = homeData.status === "fulfilled" ? homeData.value : {};
  const scheduleData = schedule.status === "fulfilled" ? schedule.value : [];

  const ongoingList = home.ongoing?.animeList || [];
  const completedList = home.completed?.animeList || [];

  // Fetch 5 detail anime untuk hero (parallel)
  const heroSlugs = pickRandom(ongoingList, 5).map((a) => a.animeId);
  const heroDetails = await Promise.all(
    heroSlugs.map((slug) => getAnimeDetail(slug))
  );
  const slides = heroDetails.filter(Boolean);

  return (
    <div className="bg-black text-white min-h-screen">

      {/* HERO SLIDER */}
      <HeroSlider slides={slides} />

      {/* SECTIONS */}
      <div className="pt-10">

        {/* TAYANG HARI INI */}
        <TodaySchedule schedule={scheduleData} />

        {/* EPISODE TERBARU */}
        <AnimeRow
          title="🔴 Episode Terbaru"
          animeList={ongoingList}
          viewAllHref="/ongoing"
        />

        {/* ANIME TAMAT */}
        <AnimeRow
          title="✅ Baru Tamat"
          animeList={completedList}
          viewAllHref="/completed"
        />

      </div>
    </div>
  );
};

export default Home;