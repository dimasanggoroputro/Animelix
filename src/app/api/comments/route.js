/**
 * app/api/comments/route.js
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // pakai service role di server
);

// GET — ambil komentar per episode
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const episodeId = searchParams.get("episode_id");

  if (!episodeId) {
    return Response.json({ message: "episode_id diperlukan" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("episode_id", episodeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/comments]", error);
    return Response.json({ message: "Gagal ambil komentar" }, { status: 500 });
  }

  return Response.json({ data });
}

// POST — tambah komentar baru
export async function POST(req) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { message: "Harus login untuk berkomentar" },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { episode_id, content, user_name, user_avatar } = body;

  if (!episode_id || !content?.trim()) {
    return Response.json({ message: "Data tidak lengkap" }, { status: 400 });
  }

  if (content.trim().length > 500) {
    return Response.json(
      { message: "Komentar maksimal 500 karakter" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      episode_id,
      user_id: userId,
      user_name: user_name || "Anonymous",
      user_avatar: user_avatar || null,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("[POST /api/comments]", error);
    return Response.json({ message: "Gagal simpan komentar" }, { status: 500 });
  }

  return Response.json({ data }, { status: 201 });
}

// DELETE — hapus komentar milik sendiri
export async function DELETE(req) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ message: "Harus login" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json(
      { message: "id komentar diperlukan" },
      { status: 400 },
    );
  }

  // Pastikan komentar milik user yang request
  const { data: comment } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!comment || comment.user_id !== userId) {
    return Response.json({ message: "Tidak diizinkan" }, { status: 403 });
  }

  const { error } = await supabase.from("comments").delete().eq("id", id);

  if (error) {
    return Response.json({ message: "Gagal hapus komentar" }, { status: 500 });
  }

  return Response.json({ message: "Komentar dihapus" });
}
