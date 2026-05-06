/**
 * app/api/server/[serverId]/route.js
 *
 * Proxy ke external API untuk ganti streaming server.
 * Dibuat supaya EpisodeClient tidak hardcode URL external di sisi client.
 */

import { ratelimit } from "@/lib/ratelimit";

export async function GET(req, { params }) {
  // Rate limiting
  const ip = (req.headers.get("x-forwarded-for") || "anonymous")
    .split(",")[0]
    .trim();

  const { success } = await ratelimit.limit(`server:${ip}`);

  if (!success) {
    return Response.json(
      { message: "Terlalu banyak request, coba lagi nanti" },
      { status: 429 }
    );
  }

  const { serverId } = await params;

  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    return Response.json({ message: "Server config error" }, { status: 500 });
  }

  try {
    const res = await fetch(`${baseUrl}/anime/server/${serverId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return Response.json(
        { message: "Gagal fetch server" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("[API /server] Error:", error.message);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}