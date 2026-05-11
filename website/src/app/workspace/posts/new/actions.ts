"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";

type UploadedMedia = {
  storage_path: string;
  filename: string;
  mime_type: string;
  file_size_bytes: number;
};

/**
 * Server action — create a post + record uploaded media.
 *
 * v0.3.5b — client uploads files directly to Supabase Storage first, then
 * passes the resulting metadata to this action as a JSON string in
 * `media_json`. We never receive the file binaries here, so Vercel's request
 * body cap is irrelevant.
 */
export async function createPostAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin?err=no_session");

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body_md") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;

  if (!title) {
    redirect("/workspace/posts/new?err=missing_title");
  }

  const slug = slugify(title);

  // Insert post
  const { data: post, error: insertError } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      category_id: categoryId,
      slug,
      title,
      body_md: body,
    })
    .select("id, slug")
    .single();

  if (insertError || !post) {
    const msg = encodeURIComponent(insertError?.message ?? "insert_failed");
    redirect(`/workspace/posts/new?err=${msg}`);
  }

  // Record uploaded media (uploaded client-side directly to Storage).
  let media: UploadedMedia[] = [];
  const mediaJson = formData.get("media_json");
  if (typeof mediaJson === "string" && mediaJson.length > 0) {
    try {
      const parsed = JSON.parse(mediaJson);
      if (Array.isArray(parsed)) media = parsed as UploadedMedia[];
    } catch {
      // Bad JSON → ignore; post still ships without media.
    }
  }

  if (media.length > 0) {
    await supabase.from("post_images").insert(
      media.map((m, i) => ({
        post_id: post.id,
        storage_path: m.storage_path,
        filename: m.filename,
        mime_type: m.mime_type,
        file_size_bytes: m.file_size_bytes,
        sort_order: i,
      }))
    );
  }

  // Capture link URLs (one per line) into post_links.
  const links = String(formData.get("links") ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s))
    .slice(0, 20);
  if (links.length > 0) {
    await supabase.from("post_links").insert(
      links.map((url) => ({
        post_id: post.id,
        url,
        source_kind: "manual" as const,
      }))
    );
  }

  revalidatePath("/workspace/posts");
  revalidatePath(`/workspace/posts/${post.slug}`);
  redirect(`/workspace/posts/${post.slug}`);
}
