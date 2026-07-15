/**
 * Small formatters used across the CRM/workspace surfaces.
 */

export function fmtUsd(value: number | null | undefined, opts: { compact?: boolean } = {}): string {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  if (opts.compact && Math.abs(n) >= 10000) {
    return `$${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export function fmtRelative(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return "—";
  const delta = Date.now() - d;
  const min = 60 * 1000;
  const hr = 60 * min;
  const day = 24 * hr;
  if (delta < min) return "just now";
  if (delta < hr) return `${Math.floor(delta / min)}m ago`;
  if (delta < day) return `${Math.floor(delta / hr)}h ago`;
  if (delta < 7 * day) return `${Math.floor(delta / day)}d ago`;
  return fmtDate(iso);
}

export const STAGE_LABEL: Record<string, string> = {
  new: "New",
  briefed: "Briefed",
  in_progress: "In progress",
  review: "Review",
  delivered: "Delivered",
  won: "Won",
  lost: "Lost",
};

export const STAGE_ORDER = ["new", "briefed", "in_progress", "review", "delivered", "won", "lost"] as const;

export const KIND_LABEL: Record<string, string> = {
  memo: "Memo · $249",
  teardown: "Teardown · $1,499",
  audit: "Brand Audit · $1,999",
  embedded: "Embedded · $8K/qtr",
  custom: "Custom",
};

export const STATUS_LABEL: Record<string, string> = {
  prospect: "Prospect",
  qualified: "Qualified",
  customer: "Customer",
  churned: "Churned",
  lost: "Lost",
};

export const STATUS_TONE: Record<string, string> = {
  prospect: "#888",
  qualified: "#00ffd1",
  customer: "#ffd700",
  churned: "#ff9090",
  lost: "#5a5c61",
};
