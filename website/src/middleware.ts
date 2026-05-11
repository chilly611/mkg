import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isEmailAllowed } from "@/lib/auth/whitelist";

/**
 * Auth middleware.
 *
 * - Refreshes the Supabase session on every request so server components
 *   can read the user reliably.
 * - Gates /workspace/* behind a signed-in user whose email is on the
 *   whitelist (see ../lib/auth/whitelist.ts).
 *
 * Public pages (/, /the-marketing-architect-landscape/, /archive/*) are
 * untouched — anyone can read them.
 */
export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session (Supabase recommends this on every request)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  // Gate /workspace/*
  if (pathname.startsWith("/workspace")) {
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (!isEmailAllowed(user.email)) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("err", "not_allowed");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Run on everything except static assets and Next internals.
    "/((?!_next/static|_next/image|favicon.ico|emblems/|archive/|the-marketing-architect-landscape/|.*\\.(?:png|jpg|jpeg|webp|svg|gif|mp4|webm|ico)$).*)",
  ],
};
