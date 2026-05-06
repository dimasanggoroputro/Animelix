/**
 * app/api/anime/route.js
 *
 * API Route — dipakai kalau butuh rate limiting di client-side fetch
 * (misalnya search dari SearchBar component).
 * Untuk SSR/page.js, pakai lib/getAnime.js langsung.
 */

import { ratelimit } from "@/lib/ratelimit";
import { getAnime } from "@/lib/getAnime";

export async function GET(req) {
  // --- Rate Limiting ---
  const ip = (req.headers.get("x-forwarded-for") || "anonymous")
    .split(",")[0]
    .trim();

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json(
      { message: "Terlalu banyak request, coba lagi nanti" },
      {
        status: 429,
        headers: {
          // Bantu client tahu kapan bisa retry
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      },
    );
  }

  // --- Parse Params ---
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1); // minimal page 1
  const keyword = searchParams.get("keyword")?.trim() || "";

  // --- Fetch Data ---
  try {
    const result = await getAnime({ page, keyword });
    return Response.json(result);
  } catch (error) {
    console.error("[API /anime] Error:", error.message);

    // Teruskan status dari external API kalau ada
    const status = error.status && error.status >= 400 ? error.status : 500;

    return Response.json(
      {
        message:
          status === 500 ? "Internal server error" : "Error fetching data",
      },
      { status },
    );
  }
}
