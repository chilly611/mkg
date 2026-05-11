"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function addCommentAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin?err=no_session");

  const slug = String(formData.get("slug") ?? "");
  const body = String(formData.get("body_md") ?? "").trim();
  const parentId = String(formData.get("parent_id") ?? "").trim() || null;
  if (!slug || !body) return;

  const { data: post } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!post) return;

  await supabase.from("comments").insert({
    post_id: (post as { id: string }).id,
    author_id: user.id,
    parent_id: parentId,
    body_md: body,
  });

  revalidatePath(`/workspace/posts/${slug}`);
}

export async function deletePostAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  // RLS will block delete if not own row — safe.
  await supabase.from("posts").delete().eq("slug", slug);
  revalidatePath("/workspace/posts");
  redirect("/workspace/posts");
}
