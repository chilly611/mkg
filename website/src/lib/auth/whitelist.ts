/**
 * Workspace email whitelist.
 *
 * Per Chilly's Cycle 003.5 decision: workspace is fully private through
 * Cycle 004. Only the three team accounts can sign in.
 *
 * Source of truth: WORKSPACE_ALLOWED_EMAILS env var (comma-separated).
 * Falls back to a hardcoded list for local development.
 *
 * To add a teammate later: update the Vercel env var, redeploy. No code change.
 *
 * NB — emails are normalized (trimmed + lowercased) so case differences in
 * Google OAuth profile data don't accidentally lock people out.
 */

const FALLBACK_ALLOWED = [
  "chillyd@gmail.com",
  "michaelbou@gmail.com",
  // John Bou's email goes here — Chilly will fill in via env var on next deploy
];

export function getAllowedEmails(): string[] {
  const fromEnv = process.env.WORKSPACE_ALLOWED_EMAILS;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }
  return FALLBACK_ALLOWED.map((s) => s.toLowerCase());
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getAllowedEmails().includes(normalized);
}
