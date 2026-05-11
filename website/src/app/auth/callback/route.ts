import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isEmailAllowed } from "@/lib/auth/whitelist";

/**
 * OAuth callback handler.
 *
 * Supabase + Google redirect here after the user signs in. The query
 * carries an authorization code; we exchange it for a session.
 *
 * If the user's email isn't on the workspace allowlist, we sign them
 * back out immediately and bounce them to /signin?err=not_allowed.
 *
 * Otherwise we mirror them into public.users (idempotent upsert) and
 * land them on /workspace (or the ?next= param if provided).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/signin?err=missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(
      `${origin}/signin?err=${encodeURIComponent(exchangeError.message)}`
    );
  }

  // Look up the user we just signed in.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/signin?err=no_user`);
  }

  // Whitelist gate. If not allowed, sign out and reject.
  if (!isEmailAllowed(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/signin?err=not_allowed`);
  }

  // Mirror the user into public.users (idempotent — see SCHEMA.sql).
  // Note: this requires the user has insert/update permission on public.users,
  // which our RLS policies allow for the user's own row.
  await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email!,
      display_name:
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        null,
      avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    },
    { onConflict: "id" }
  );

  const safeNext =
    nextParam && nextParam.startsWith("/workspace") ? nextParam : "/workspace";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
