import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client.
 *
 * Use this in:
 *   - Server Components
 *   - Route Handlers (app/.../route.ts)
 *   - Server Actions
 *
 * It reads/writes the auth cookie via Next's cookies() API so sessions
 * survive page navigations and round-trip server requests.
 *
 * For the browser client, see ./client.ts.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, where setting cookies is
            // not allowed. The middleware refreshes sessions, so this
            // branch is safe to ignore at runtime.
          }
        },
      },
    }
  );
}
