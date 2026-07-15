import Link from "next/link";
import { getAccounts, getAccountSummaryCounts, type AccountStatus } from "@/lib/supabase/queries";
import { AccountCard } from "@/components/account-card";
import { STATUS_LABEL } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

const STATUSES: (AccountStatus | "all")[] = ["all", "prospect", "qualified", "customer", "churned", "lost"];

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const activeStatus = (sp.status as AccountStatus | undefined);

  const [accounts, counts] = await Promise.all([
    getAccounts({ status: activeStatus }),
    getAccountSummaryCounts(),
  ]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <style>{styles}</style>

      <div className="ap-head">
        <div className="ap-eyebrow">ACCOUNTS · CRM</div>
        <div className="ap-title-row">
          <h1>Who we&apos;re talking to.</h1>
          <Link href="/workspace/accounts/new" className="ap-cta-new">+ New account</Link>
        </div>
        <p className="ap-sub">
          {total} accounts in the book. Healthcare-tech wedge first — John&apos;s network.
          Each card shows status, industry, location, owner, and a one-line pitch read.
        </p>
      </div>

      <div className="ap-stats">
        {(["prospect","qualified","customer","churned","lost"] as AccountStatus[]).map((s) => (
          <div key={s} className="ap-stat">
            <span className="ap-stat-num">{counts[s] ?? 0}</span>
            <span className="ap-stat-lab">{STATUS_LABEL[s]}</span>
          </div>
        ))}
      </div>

      <nav className="ap-chips" aria-label="Filter by status">
        {STATUSES.map((s) => {
          const isAll = s === "all";
          const isActive = isAll ? !activeStatus : activeStatus === s;
          const href = isAll ? "/workspace/accounts" : `/workspace/accounts?status=${s}`;
          return (
            <Link key={s} href={href} className={`ap-chip ${isActive ? "ap-chip-active" : ""}`}>
              {isAll ? `All · ${total}` : `${STATUS_LABEL[s]} · ${counts[s as AccountStatus] ?? 0}`}
            </Link>
          );
        })}
      </nav>

      {accounts.length === 0 ? (
        <div className="ap-empty">
          <h3>No accounts yet in this view.</h3>
          <p>Add one or seed the demo data via the SQL migration.</p>
          <Link href="/workspace/accounts/new" className="ap-cta-new">+ Add the first account</Link>
        </div>
      ) : (
        <div className="ap-grid">
          {accounts.map((a) => <AccountCard key={a.id} account={a} />)}
        </div>
      )}
    </>
  );
}

const styles = `
.ap-head { margin-bottom: 22px; }
.ap-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 12px;
}
.ap-title-row { display: flex; align-items: flex-end; gap: 14px; flex-wrap: wrap; }
.ap-title-row h1 {
  flex: 1;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0;
}
.ap-sub { color: #b5b5b5; font-size: 15px; line-height: 1.55; margin: 12px 0 0; max-width: 720px; }
.ap-cta-new {
  background: #00ffd1;
  color: #001a16;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 12px 18px;
  text-decoration: none;
  border: 1px solid #00ffd1;
  white-space: nowrap;
  transition: box-shadow .2s, transform .15s;
}
.ap-cta-new:hover { box-shadow: 0 0 24px rgba(0,255,209,0.45); transform: translateY(-1px); }

.ap-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  border: 1px solid rgba(255,255,255,0.08);
  margin: 24px 0;
  background: #131416;
}
@media (max-width: 760px) { .ap-stats { grid-template-columns: repeat(3, 1fr); } }
.ap-stat { padding: 14px 12px; border-right: 1px solid rgba(255,255,255,0.08); }
.ap-stat:last-child { border-right: none; }
.ap-stat-num {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: -0.022em;
  color: #00ffd1;
  line-height: 1;
}
.ap-stat-lab {
  display: block;
  margin-top: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #888;
}

.ap-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 22px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.ap-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  padding: 6px 12px;
  border: 1px solid rgba(255,255,255,0.18);
  transition: color .15s, border-color .15s, background .15s;
}
.ap-chip:hover { color: #00ffd1; border-color: rgba(0,255,209,0.4); }
.ap-chip-active { color: #001a16; background: #00ffd1; border-color: #00ffd1; }
.ap-chip-active:hover { color: #001a16; }

.ap-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 760px) { .ap-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1200px) { .ap-grid { grid-template-columns: 1fr 1fr 1fr; } }

.ap-empty {
  border: 1px dashed rgba(255,255,255,0.18);
  padding: 32px 24px;
  text-align: center;
  background: rgba(0,255,209,0.02);
}
.ap-empty h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.012em;
  margin: 0 0 10px;
}
.ap-empty p { color: #888; margin: 0 0 18px; }
`;
