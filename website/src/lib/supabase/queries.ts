/**
 * Server-side query helpers for the workspace.
 *
 * Each function returns plain objects (not Supabase response wrappers)
 * so server components can destructure cleanly. Errors are thrown so
 * Next's error boundaries handle them.
 *
 * All queries respect RLS — they execute as the signed-in user via the
 * session cookie in createSupabaseServerClient().
 */

import { createSupabaseServerClient } from "./server";

export type Category = {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
  description: string | null;
  sort_order: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  body_md: string;
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
  category_id: string | null;
  // Joined fields:
  author?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    email: string;
  } | null;
  category?: Category | null;
  image_count?: number;
  comment_count?: number;
};

export type PostImage = {
  id: string;
  post_id: string;
  storage_path: string;
  filename: string | null;
  caption: string | null;
  sort_order: number;
  public_url: string;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  body_md: string;
  created_at: string;
  author?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    email: string;
  } | null;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function publicImageUrl(storagePath: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/post-images/${storagePath}`;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("post_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("post_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Category | null;
}

export async function getRecentPosts(opts: {
  limit?: number;
  categorySlug?: string;
} = {}): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();
  const limit = opts.limit ?? 50;

  let query = supabase
    .from("posts")
    .select(`
      id, slug, title, body_md, is_pinned, is_archived, created_at, updated_at,
      author_id, category_id,
      author:users!posts_author_id_fkey ( id, display_name, avatar_url, email ),
      category:post_categories!posts_category_id_fkey ( id, slug, name, emoji, description, sort_order )
    `)
    .eq("is_archived", false)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (opts.categorySlug) {
    const cat = await getCategoryBySlug(opts.categorySlug);
    if (!cat) return [];
    query = query.eq("category_id", cat.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id, slug, title, body_md, is_pinned, is_archived, created_at, updated_at,
      author_id, category_id,
      author:users!posts_author_id_fkey ( id, display_name, avatar_url, email ),
      category:post_categories!posts_category_id_fkey ( id, slug, name, emoji, description, sort_order )
    `)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as Post | null;
}

export async function getPostImages(postId: string): Promise<PostImage[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("post_images")
    .select("*")
    .eq("post_id", postId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...(row as Omit<PostImage, "public_url">),
    public_url: publicImageUrl((row as { storage_path: string }).storage_path),
  }));
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("comments")
    .select(`
      id, post_id, author_id, parent_id, body_md, created_at,
      author:users!comments_author_id_fkey ( id, display_name, avatar_url, email )
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Comment[];
}

export async function getCategoryPostCounts(): Promise<Record<string, number>> {
  const supabase = await createSupabaseServerClient();
  // Group manually since postgrest doesn't expose group-by directly.
  const { data, error } = await supabase
    .from("posts")
    .select("category_id")
    .eq("is_archived", false);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const id = (row as { category_id: string | null }).category_id;
    if (!id) continue;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}
