/**
 * app/api/schedule/route.js
 */

import { ratelimit } from "@/lib/ratelimit";

export async function GET(req) {
  const ip = (req.headers.get("x-forwarded-for") || "anonymous")
    .split(",")[0]
    .trim();

  const { success } = await ratelimit.limit(`schedule:${ip}`);

  if (!success) {
    return Response.json(
      { message: "Terlalu banyak request, coba lagi nanti" },
      { status: 429 }
    );
  }

  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    return Response.json({ message: "Server config error" }, { status: 500 });
  }

  try {
    const res = await fetch(`${baseUrl}/anime/schedule`, {
      next: { revalidate: 3600 }, // cache 1 jam, jadwal jarang berubah
    });

    if (!res.ok) {
      return Response.json(
        { message: "Gagal fetch jadwal" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("[API /schedule] Error:", error.message);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}