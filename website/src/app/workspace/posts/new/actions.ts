"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";

/**
 * Server action — create a post (+ optional images).
 *
 * Called from /workspace/posts/new form.
 *
 * Pipeline:
 *   1. Validate signed-in user (middleware should have caught this; belt+braces).
 *   2. Insert the post row.
 *   3. For each image: upload to Supabase Storage `post-images/{post_id}/{filename}`,
 *      then insert a post_images row.
 *   4. Revalidate /workspace/posts and redirect to the new post detail page.
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

  // Upload images (if any)
  const images = formData.getAll("images") as File[];
  for (const file of images) {
    if (!file || typeof file === "string") continue;
    if (file.size === 0) continue;
    if (file.size > 100 * 1024 * 1024) continue; // skip oversized silently (>100MB)
    const safeName = (file.name || "image").replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${post.id}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage
      .from("post-images")
      .upload(storagePath, file, {
        contentType: file.type || "image/png",
        upsert: false,
      });
    if (upErr) continue; // best-effort; failed uploads don't block post
    await supabase.from("post_images").insert({
      post_id: post.id,
      storage_path: storagePath,
      filename: safeName,
      mime_type: file.type || null,
      file_size_bytes: file.size,
    });
  }

  // Capture link URLs (one textarea, one per line) into post_links.
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
