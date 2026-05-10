import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Ensure bucket exists
  const { data: buckets } = await admin.storage.listBuckets();
  if (!buckets?.find(b => b.name === "avatars")) {
    await admin.storage.createBucket("avatars", { public: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Detect type from magic bytes — never trust client-supplied extension or MIME
  type ImageType = { ext: string; mime: string };
  function detectImageType(buf: Buffer): ImageType | null {
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return { ext: "png", mime: "image/png" };
    if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return { ext: "webp", mime: "image/webp" };
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return { ext: "gif", mime: "image/gif" };
    return null;
  }

  const imageType = detectImageType(buffer);
  if (!imageType) {
    return NextResponse.json({ error: "Kun JPG, PNG, WebP og GIF er tillatt" }, { status: 400 });
  }

  if (buffer.length > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Bildet er for stort (maks 5 MB)" }, { status: 400 });
  }

  const path = `${user.id}/avatar.${imageType.ext}`;

  const { error: uploadError } = await admin.storage
    .from("avatars")
    .upload(path, buffer, { contentType: imageType.mime, upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = admin.storage.from("avatars").getPublicUrl(path);
  const avatar_url = urlData.publicUrl;

  await admin.from("profiles").upsert(
    { id: user.id, avatar_url },
    { onConflict: "id" }
  );

  return NextResponse.json({ avatar_url });
}
