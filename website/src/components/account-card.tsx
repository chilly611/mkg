import Link from "next/link";
import type { Account } from "@/lib/supabase/queries";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/utils/format";

export function AccountCard({ account }: { account: Account }) {
  const tone = STATUS_TONE[account.account_status] ?? "#888";
  const location = [account.hq_city, account.hq_country].filter(Boolean).join(", ");
  return (
    <Link href={`/workspace/accounts/${account.slug}`} className="ac-card">
      <div className="ac-head">
        <div className="ac-name">{account.name}</div>
        <span className="ac-status" style={{ color: tone, borderColor: `${tone}66` }}>
          {STATUS_LABEL[account.account_status] ?? account.account_status}
        </span>
      </div>
      {account.industry && <div className="ac-industry">{account.industry}</div>}
      <div className="ac-meta">
        {location && <span>{location}</span>}
        {account.size_employees && <span>· {account.size_employees}</span>}
      </div>
      {account.pitch_notes && (
        <p className="ac-pitch">{account.pitch_notes.slice(0, 160)}{account.pitch_notes.length > 160 ? "…" : ""}</p>
      )}
      <div className="ac-foot">
        {account.owner_email && (
          <span className="ac-owner">Owner · {account.owner_email.split("@")[0]}</span>
        )}
        <span className="ac-go">→</span>
      </div>

      <style>{styles}</style>
    </Link>
  );
}

const styles = `
.ac-card {
  display: block;
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 16px 18px;
  text-decoration: none;
  color: inherit;
  transition: border-color .15s, transform .15s, box-shadow .15s;
}
.ac-card:hover {
  border-color: rgba(0,255,209,0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(0,255,209,0.06);
}
.ac-head { display: flex; align-items: center; gap: 10px; justify-content: space-between; margin-bottom: 4px; }
.ac-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.012em;
  color: #e8e8e8;
}
.ac-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 3px 7px;
  border: 1px solid currentColor;
  white-space: nowrap;
}
.ac-industry {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #00ffd1;
  margin-bottom: 8px;
}
.ac-meta {
  font-size: 12.5px;
  color: #888;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.ac-pitch { font-size: 13.5px; line-height: 1.5; color: #b5b5b5; margin: 0 0 10px; }
.ac-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 10px;
  border-top: 1px dashed rgba(255,255,255,0.08);
}
.ac-owner {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5a5c61;
}
.ac-go { color: #00ffd1; font-size: 14px; font-weight: 700; }
`;
