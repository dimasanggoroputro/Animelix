import { ratelimit } from "@/lib/ratelimit";

export async function GET(req) {
  console.log("REQUEST MASUK");

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";

  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json(
      { message: "Terlalu banyak request" },
      { status: 429 },
    );
  }

  let url;

  if (keyword) {
    url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/anime/search/${keyword}`;
  } else {
    url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/anime/ongoing-anime?page=${page}`;
  }

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return Response.json({ message: "Error API" }, { status: 500 });
  }

  const data = await res.json();

  if (keyword) {
    return Response.json({
      data: {
        animeList: data.data?.animeList || data.data || [],
      },
      pagination: null,
    });
  }

  return Response.json(data);
}
