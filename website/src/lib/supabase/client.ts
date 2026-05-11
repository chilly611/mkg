"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 *
 * Use this in client components for:
 *   - signInWithOAuth (Google sign-in button)
 *   - real-time subscriptions
 *   - direct queries from the browser
 *
 * For server-side calls (Route Handlers, Server Components, middleware),
 * use ./server.ts and ./middleware.ts.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
