import type { NextConfig } from "next";

/**
 * The Marketing Architect — Next.js config
 *
 * v0.3 (Cycle 003.5) — output:"export" REMOVED.
 *
 * Why this differs from the umbrella sister gardens (OKG/BKG/TKG/HKG):
 *   The other gardens are pure citation surfaces — every page is static,
 *   pre-rendered, AI-crawlable, no writes. Static export (L-006) was the
 *   right choice there.
 *
 *   MKG / The Marketing Architect is a PRODUCT with auth, writes,
 *   Stripe checkout, and a Claude API research panel. The OAuth callback
 *   must exchange an authorization code on the server. Stripe webhooks
 *   must verify signatures on the server. Static export cannot do either.
 *
 *   New lesson logged: L-MKG-010 — Products with server-side auth/payments
 *   override the static-export rule. Public marketing pages still ship as
 *   ISR/edge-cached so we lose nothing on the citation surface.
 *
 * If a future engineer wonders whether to re-add output:"export":
 *   - Read L-MKG-010 first.
 *   - The umbrella rule is right for citation gardens; this is a product.
 *   - Re-adding it will break /signin, /auth/callback, /api/* — entirely.
 */
const nextConfig: NextConfig = {
  // Default deployment: Vercel serverless + edge cache.
  // (No output:"export" — see header.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "rojpjtyjiapqpsxdeovk.supabase.co" },
      { protocol: "https", hostname: "vlezoyalutexenbnzzui.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatar
    ],
  },
};

export default nextConfig;
