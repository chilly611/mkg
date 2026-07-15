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
  mime_type: string | null;
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

// ============================================================================
// CRM types + queries (Cycle 004)
// ============================================================================

export type AccountStatus = "prospect" | "qualified" | "customer" | "churned" | "lost";
export type AccountSource = "john_network" | "inbound" | "event" | "cold" | "referral" | "partner" | "unknown";
export type DealKind = "memo" | "teardown" | "audit" | "embedded" | "custom";
export type DealStage = "new" | "briefed" | "in_progress" | "review" | "delivered" | "won" | "lost";
export type ActivityKind = "call" | "email_sent" | "email_received" | "meeting" | "linkedin_dm" | "note" | "event" | "demo" | "intro" | "other";

export type Account = {
  id: string;
  slug: string;
  name: string;
  website_url: string | null;
  logo_url: string | null;
  plan_tier: string;
  stripe_customer_id: string | null;
  billing_email: string | null;
  industry: string | null;
  size_employees: string | null;
  hq_city: string | null;
  hq_country: string | null;
  account_status: AccountStatus;
  linkedin_url: string | null;
  owner_email: string | null;
  pitch_notes: string | null;
  source: AccountSource;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Contact = {
  id: string;
  organization_id: string;
  name: string;
  email: string | null;
  role_title: string | null;
  linkedin_url: string | null;
  is_primary_contact: boolean;
  notes: string | null;
  created_at: string;
};

export type Deal = {
  id: string;
  slug: string | null;
  organization_id: string;
  primary_contact_id: string | null;
  title: string;
  kind: DealKind;
  stage: DealStage;
  value_usd: number | null;
  owner_email: string | null;
  expected_close_date: string | null;
  closed_at: string | null;
  brief_summary: string | null;
  delivered_output_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields from deals_enriched
  org_slug?: string;
  org_name?: string;
  org_industry?: string | null;
  org_account_status?: AccountStatus;
  primary_contact_name?: string | null;
  primary_contact_email?: string | null;
  primary_contact_role?: string | null;
};

export type Activity = {
  id: string;
  organization_id: string;
  deal_id: string | null;
  contact_id: string | null;
  kind: ActivityKind;
  title: string;
  body_md: string | null;
  happened_at: string;
  logged_by: string | null;
  created_at: string;
};

// ---------- Accounts ----------

export async function getAccounts(opts: { status?: AccountStatus; limit?: number } = {}): Promise<Account[]> {
  const supabase = await createSupabaseServerClient();
  let q = supabase.from("organizations").select("*").order("updated_at", { ascending: false });
  if (opts.status) q = q.eq("account_status", opts.status);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Account[];
}

export async function getAccountBySlug(slug: string): Promise<Account | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as Account | null;
}

export async function getAccountContacts(orgId: string): Promise<Contact[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("organization_id", orgId)
    .order("is_primary_contact", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Contact[];
}

export async function getAccountDeals(orgId: string): Promise<Deal[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("deals_enriched")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Deal[];
}

export async function getAccountActivities(orgId: string, limit = 30): Promise<Activity[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("account_activities")
    .select("*")
    .eq("organization_id", orgId)
    .order("happened_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Activity[];
}

export async function getAccountSummaryCounts(): Promise<Record<AccountStatus, number>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("organizations").select("account_status");
  if (error) throw error;
  const counts: Record<string, number> = {
    prospect: 0, qualified: 0, customer: 0, churned: 0, lost: 0,
  };
  for (const row of data ?? []) {
    const s = (row as { account_status: AccountStatus }).account_status;
    counts[s] = (counts[s] ?? 0) + 1;
  }
  return counts as Record<AccountStatus, number>;
}

// ---------- Deals + Pipeline ----------

export async function getRecentDeals(opts: { kind?: DealKind; stage?: DealStage; limit?: number } = {}): Promise<Deal[]> {
  const supabase = await createSupabaseServerClient();
  let q = supabase.from("deals_enriched").select("*").order("updated_at", { ascending: false });
  if (opts.kind) q = q.eq("kind", opts.kind);
  if (opts.stage) q = q.eq("stage", opts.stage);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Deal[];
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("deals_enriched")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as Deal | null;
}

export async function getPipelineByStage(): Promise<Record<DealStage, Deal[]>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("deals_enriched")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  const grouped: Record<DealStage, Deal[]> = {
    new: [], briefed: [], in_progress: [], review: [], delivered: [], won: [], lost: [],
  };
  for (const d of (data ?? []) as Deal[]) {
    grouped[d.stage].push(d);
  }
  return grouped;
}

export async function getPipelineValue(): Promise<{ open_usd: number; won_usd: number }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("deals")
    .select("stage, value_usd");
  if (error) throw error;
  let open = 0;
  let won = 0;
  for (const row of (data ?? []) as { stage: DealStage; value_usd: number | null }[]) {
    const v = Number(row.value_usd ?? 0);
    if (!Number.isFinite(v)) continue;
    if (row.stage === "won") won += v;
    else if (row.stage !== "lost" && row.stage !== "delivered") open += v;
  }
  return { open_usd: open, won_usd: won };
}
