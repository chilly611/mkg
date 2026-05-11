/**
 * Slug helpers — for converting post titles to URL-safe identifiers.
 *
 * Pattern: lowercase, ASCII-letters/numbers/hyphens only, max 64 chars,
 * with a short random suffix to prevent collisions.
 */

export function slugify(input: string): string {
  const base = (input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 56);
  const suffix = Math.random().toString(36).slice(2, 8);
  return base ? `${base}-${suffix}` : `post-${suffix}`;
}

export function shortId(length = 8): string {
  return Math.random().toString(36).slice(2, 2 + length);
}
