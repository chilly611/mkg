"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createTeardownAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin?err=no_session");

  const accountSlug = String(formData.get("account_slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const briefSummary = String(formData.get("brief_summary") ?? "").trim() || null;
  const valueUsdRaw = String(formData.get("value_usd") ?? "1499");
  const expectedCloseDate = String(formData.get("expected_close_date") ?? "").trim() || null;

  if (!accountSlug || !title) {
    redirect(`/workspace/teardowns/new?err=missing_fields`);
  }

  // Look up the account
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", accountSlug)
    .maybeSingle();

  if (!org) redirect(`/workspace/teardowns/new?err=account_not_found`);

  const valueUsd = Number.parseFloat(valueUsdRaw);

  const { data, error } = await supabase
    .from("deals")
    .insert({
      organization_id: (org as { id: string }).id,
      title,
      kind: "teardown",
      stage: "briefed",
      value_usd: Number.isFinite(valueUsd) ? valueUsd : 1499,
      owner_email: user.email,
      expected_close_date: expectedCloseDate,
      brief_summary: briefSummary,
    })
    .select("slug")
    .single();

  if (error || !data?.slug) {
    const msg = encodeURIComponent(error?.message ?? "insert_failed");
    redirect(`/workspace/teardowns/new?err=${msg}`);
  }

  revalidatePath("/workspace/teardowns");
  revalidatePath("/workspace/pipeline");
  revalidatePath(`/workspace/accounts/${accountSlug}`);
  redirect(`/workspace/teardowns/${data.slug}`);
}
