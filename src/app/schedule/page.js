/**
 * app/schedule/page.js
 */

import { getSchedule } from "@/lib/getSchedule";
import ScheduleClient from "./ScheduleClient";

export const metadata = {
  title: "Jadwal Rilis Anime",
  description: "Jadwal rilis anime terbaru per hari dalam seminggu.",
};

const SchedulePage = async () => {
  let schedule = [];
  let error = null;

  try {
    schedule = await getSchedule();
  } catch (err) {
    console.error("[SchedulePage] error:", err.message);
    error = "Gagal memuat jadwal, coba lagi nanti 🙏";
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return <ScheduleClient schedule={schedule} />;
};

export default SchedulePage;