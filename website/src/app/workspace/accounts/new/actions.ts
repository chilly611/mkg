"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slug";

export async function createAccountAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin?err=no_session");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/workspace/accounts/new?err=missing_name");

  const website = String(formData.get("website_url") ?? "").trim() || null;
  const industry = String(formData.get("industry") ?? "").trim() || null;
  const sizeEmployees = String(formData.get("size_employees") ?? "").trim() || null;
  const hqCity = String(formData.get("hq_city") ?? "").trim() || null;
  const hqCountry = String(formData.get("hq_country") ?? "USA").trim() || "USA";
  const status = String(formData.get("account_status") ?? "prospect").trim();
  const linkedin = String(formData.get("linkedin_url") ?? "").trim() || null;
  const ownerEmail = String(formData.get("owner_email") ?? user.email ?? "").trim() || null;
  const pitchNotes = String(formData.get("pitch_notes") ?? "").trim() || null;
  const source = String(formData.get("source") ?? "unknown").trim();

  const slug = slugify(name);

  const { error, data } = await supabase
    .from("organizations")
    .insert({
      slug,
      name,
      website_url: website,
      industry,
      size_employees: sizeEmployees,
      hq_city: hqCity,
      hq_country: hqCountry,
      account_status: status,
      linkedin_url: linkedin,
      owner_email: ownerEmail,
      pitch_notes: pitchNotes,
      source,
    })
    .select("slug")
    .single();

  if (error || !data) {
    const msg = encodeURIComponent(error?.message ?? "insert_failed");
    redirect(`/workspace/accounts/new?err=${msg}`);
  }

  revalidatePath("/workspace/accounts");
  redirect(`/workspace/accounts/${data.slug}`);
}
