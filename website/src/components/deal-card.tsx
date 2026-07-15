import Link from "next/link";
import type { Deal } from "@/lib/supabase/queries";
import { fmtUsd, fmtRelative, KIND_LABEL } from "@/lib/utils/format";

export function DealCard({ deal, dense = false }: { deal: Deal; dense?: boolean }) {
  const href = deal.kind === "teardown" && deal.slug
    ? `/workspace/teardowns/${deal.slug}`
    : `/workspace/accounts/${deal.org_slug ?? ""}`;
  return (
    <Link href={href} className={`dc-card ${dense ? "dc-dense" : ""}`}>
      <div className="dc-head">
        <span className="dc-kind">{KIND_LABEL[deal.kind] ?? deal.kind}</span>
        {deal.value_usd ? (
          <span className="dc-value">{fmtUsd(deal.value_usd, { compact: true })}</span>
        ) : null}
      </div>
      <div className="dc-title">{deal.title}</div>
      <div className="dc-org">{deal.org_name ?? "—"}</div>
      <div className="dc-foot">
        <span className="dc-when">{fmtRelative(deal.updated_at)}</span>
        {deal.owner_email && (
          <span className="dc-owner">· {deal.owner_email.split("@")[0]}</span>
        )}
      </div>

      <style>{styles}</style>
    </Link>
  );
}

const styles = `
.dc-card {
  display: block;
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 12px 14px;
  text-decoration: none;
  color: inherit;
  transition: border-color .15s, transform .15s;
}
.dc-card:hover { border-color: rgba(0,255,209,0.4); transform: translateY(-1px); }
.dc-dense { padding: 10px 12px; }

.dc-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}
.dc-kind {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #00ffd1;
  font-weight: 700;
}
.dc-value {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: #e8e8e8;
  letter-spacing: -0.012em;
}
.dc-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: -0.01em;
  color: #e8e8e8;
  margin-bottom: 4px;
  line-height: 1.3;
}
.dc-org { font-size: 12.5px; color: #b5b5b5; margin-bottom: 8px; }
.dc-foot {
  display: flex;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.10em;
  color: #5a5c61;
}
`;
