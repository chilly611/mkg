import type { NextConfig } from "next";

/**
 * Marketing Knowledge Garden — Next.js config
 *
 * SACRED: `output: "export"` is never removed.
 * See umbrella `09_LESSONS.md` § L-006.
 *
 * Removing this flag has previously broken every garden site. Any change
 * to this file requires a deploy verification before commit (L-006).
 */
const nextConfig: NextConfig = {
  output: "export",
  // Trailing slashes ensure /competitive-landscape resolves to
  // /competitive-landscape/index.html on static hosting.
  trailingSlash: true,
  // images.unoptimized required for static export.
  images: { unoptimized: true },
  // Per L-031 — env vars must be set in Vercel dashboard BEFORE first
  // deploy. This block is intentionally lean.
};

export default nextConfig;
