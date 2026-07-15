import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAccountBySlug,
  getAccountContacts,
  getAccountDeals,
  getAccountActivities,
} from "@/lib/supabase/queries";
import { DealCard } from "@/components/deal-card";
import { fmtRelative, fmtDate, STATUS_LABEL, STATUS_TONE, KIND_LABEL } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const account = await getAccountBySlug(slug);
  if (!account) notFound();

  const [contacts, deals, activities] = await Promise.all([
    getAccountContacts(account.id),
    getAccountDeals(account.id),
    getAccountActivities(account.id),
  ]);

  const primaryContact = contacts.find((c) => c.is_primary_contact) ?? contacts[0] ?? null;
  const otherContacts = contacts.filter((c) => c.id !== primaryContact?.id);
  const tone = STATUS_TONE[account.account_status] ?? "#888";
  const openDeals = deals.filter((d) => !["won", "lost", "delivered"].includes(d.stage));
  const wonDeals = deals.filter((d) => d.stage === "won");
  const totalValue = deals.reduce((sum, d) => sum + Number(d.value_usd ?? 0), 0);

  return (
    <>
      <style>{styles}</style>

      <Link href="/workspace/accounts" className="ad-back">← All accounts</Link>

      <header className="ad-header">
        <div className="ad-title-row">
          <div>
            <div className="ad-eyebrow">ACCOUNT · {account.industry?.toUpperCase() ?? "—"}</div>
            <h1>{account.name}</h1>
            <p className="ad-loc">
              {[account.hq_city, account.hq_country].filter(Boolean).join(", ") || "—"}
              {account.size_employees ? ` · ${account.size_employees}` : ""}
            </p>
          </div>
          <span className="ad-status" style={{ color: tone, borderColor: `${tone}66` }}>
            {STATUS_LABEL[account.account_status] ?? account.account_status}
          </span>
        </div>

        <div className="ad-quick-row">
          {account.website_url && <a href={account.website_url} target="_blank" rel="noopener" className="ad-link">Website ↗</a>}
          {account.linkedin_url && <a href={account.linkedin_url} target="_blank" rel="noopener" className="ad-link">LinkedIn ↗</a>}
          {account.owner_email && <span className="ad-owner">Owner · {account.owner_email}</span>}
          <Link
            href={`/workspace/teardowns/new?account=${account.slug}`}
            className="ad-cta-teardown"
          >
            + Start a Campaign Teardown
          </Link>
        </div>

        {account.pitch_notes && (
          <div className="ad-pitch">
            <span className="ad-pitch-lab">Pitch notes</span>
            <p>{account.pitch_notes}</p>
          </div>
        )}

        <div className="ad-summary">
          <div><span className="ad-sum-num">{deals.length}</span><span className="ad-sum-lab">total deals</span></div>
          <div><span className="ad-sum-num">{openDeals.length}</span><span className="ad-sum-lab">open</span></div>
          <div><span className="ad-sum-num">{wonDeals.length}</span><span className="ad-sum-lab">won</span></div>
          <div><span className="ad-sum-num">${(totalValue/1000).toFixed(totalValue >= 100000 ? 0 : 1)}k</span><span className="ad-sum-lab">total value</span></div>
        </div>
      </header>

      {/* Contacts */}
      <section className="ad-section">
        <h2>People</h2>
        {contacts.length === 0 ? (
          <p className="ad-empty">No contacts yet. Add one when a real conversation happens.</p>
        ) : (
          <div className="ad-people-grid">
            {primaryContact && (
              <div className="ad-person ad-person-primary">
                <div className="ad-person-head">
                  <div className="ad-person-name">{primaryContact.name}</div>
                  <span className="ad-primary-tag">PRIMARY</span>
                </div>
                {primaryContact.role_title && <div className="ad-person-role">{primaryContact.role_title}</div>}
                {primaryContact.email && (
                  <a href={`mailto:${primaryContact.email}`} className="ad-person-email">{primaryContact.email}</a>
                )}
                {primaryContact.linkedin_url && (
                  <a href={primaryContact.linkedin_url} target="_blank" rel="noopener" className="ad-link">LinkedIn ↗</a>
                )}
                {primaryContact.notes && <p className="ad-person-notes">{primaryContact.notes}</p>}
              </div>
            )}
            {otherContacts.map((c) => (
              <div key={c.id} className="ad-person">
                <div className="ad-person-head"><div className="ad-person-name">{c.name}</div></div>
                {c.role_title && <div className="ad-person-role">{c.role_title}</div>}
                {c.email && <a href={`mailto:${c.email}`} className="ad-person-email">{c.email}</a>}
                {c.linkedin_url && <a href={c.linkedin_url} target="_blank" rel="noopener" className="ad-link">LinkedIn ↗</a>}
                {c.notes && <p className="ad-person-notes">{c.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Deals */}
      <section className="ad-section">
        <div className="ad-section-head">
          <h2>Deals · {deals.length}</h2>
          <Link href={`/workspace/teardowns/new?account=${account.slug}`} className="ad-mini-cta">+ New deal</Link>
        </div>
        {deals.length === 0 ? (
          <p className="ad-empty">No deals yet. Start a Campaign Teardown above.</p>
        ) : (
          <div className="ad-deals">
            {deals.map((d) => (
              <div key={d.id} className="ad-deal-row">
                <div className="ad-deal-stage">{d.stage}</div>
                <div className="ad-deal-title">
                  {d.kind === "teardown" && d.slug ? (
                    <Link href={`/workspace/teardowns/${d.slug}`}>{d.title}</Link>
                  ) : (
                    d.title
                  )}
                  <span className="ad-deal-kind">{KIND_LABEL[d.kind] ?? d.kind}</span>
                </div>
                <div className="ad-deal-value">
                  {d.value_usd ? `$${(Number(d.value_usd)/1000).toFixed(1)}k` : "—"}
                </div>
                <div className="ad-deal-meta">
                  {d.owner_email?.split("@")[0]} · {fmtRelative(d.updated_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Activity */}
      <section className="ad-section">
        <h2>Activity</h2>
        {activities.length === 0 ? (
          <p className="ad-empty">No activity logged yet. Log a touchpoint when one happens.</p>
        ) : (
          <ol className="ad-timeline">
            {activities.map((a) => (
              <li key={a.id}>
                <div className="ad-tl-when">{fmtDate(a.happened_at)}</div>
                <div className="ad-tl-body">
                  <div className="ad-tl-kind">{a.kind.replace(/_/g, " ")}</div>
                  <div className="ad-tl-title">{a.title}</div>
                  {a.body_md && <p className="ad-tl-md">{a.body_md.slice(0, 240)}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}

const styles = `
.ad-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 16px;
}
.ad-back:hover { color: #00ffd1; }

.ad-header {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 22px 24px;
  margin-bottom: 28px;
}
.ad-title-row { display: flex; gap: 16px; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; }
.ad-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #00ffd1;
  margin-bottom: 8px;
}
.ad-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0 0 6px;
}
.ad-loc { color: #b5b5b5; font-size: 14.5px; margin: 0 0 0; }
.ad-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 5px 10px;
  border: 1px solid currentColor;
  white-space: nowrap;
}

.ad-quick-row {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed rgba(255,255,255,0.08);
}
.ad-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #00ffd1;
  text-decoration: none;
}
.ad-link:hover { text-decoration: underline; }
.ad-owner {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.10em;
  color: #5a5c61;
  text-transform: uppercase;
}
.ad-cta-teardown {
  margin-left: auto;
  background: #00ffd1;
  color: #001a16;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 10px 16px;
  text-decoration: none;
  border: 1px solid #00ffd1;
}
.ad-cta-teardown:hover { box-shadow: 0 0 18px rgba(0,255,209,0.4); }

.ad-pitch {
  margin-top: 16px;
  padding: 14px 16px;
  background: rgba(0,255,209,0.04);
  border-left: 3px solid #00ffd1;
}
.ad-pitch-lab {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #5a5c61;
  margin-bottom: 6px;
}
.ad-pitch p { color: #e8e8e8; font-size: 15px; line-height: 1.55; margin: 0; }

.ad-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px dashed rgba(255,255,255,0.08);
  margin-top: 16px;
  padding-top: 16px;
}
.ad-summary > div { display: flex; flex-direction: column; gap: 2px; }
.ad-sum-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; color: #00ffd1; letter-spacing: -0.022em; }
.ad-sum-lab { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #5a5c61; }

.ad-section { margin-bottom: 36px; }
.ad-section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.ad-section h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.012em;
  margin: 0 0 14px;
}
.ad-mini-cta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #00ffd1;
  text-decoration: none;
  padding: 6px 10px;
  border: 1px solid rgba(0,255,209,0.4);
}
.ad-mini-cta:hover { background: rgba(0,255,209,0.08); }
.ad-empty { color: #888; font-size: 14px; }

.ad-people-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 760px) { .ad-people-grid { grid-template-columns: 1fr 1fr; } }
.ad-person {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 14px 16px;
}
.ad-person-primary { border-color: rgba(0,255,209,0.4); }
.ad-person-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.ad-person-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.012em;
}
.ad-primary-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.18em;
  color: #00ffd1;
  border: 1px solid rgba(0,255,209,0.4);
  padding: 2px 6px;
}
.ad-person-role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 6px;
}
.ad-person-email {
  display: block;
  color: #b5b5b5;
  font-size: 13px;
  text-decoration: none;
  margin-bottom: 4px;
}
.ad-person-email:hover { color: #00ffd1; }
.ad-person-notes { color: #b5b5b5; font-size: 13px; line-height: 1.5; margin: 8px 0 0; }

.ad-deals { display: grid; gap: 8px; }
.ad-deal-row {
  display: grid;
  grid-template-columns: 110px 1fr 80px 1fr;
  gap: 14px;
  align-items: center;
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 10px 14px;
  font-size: 13.5px;
}
@media (max-width: 720px) { .ad-deal-row { grid-template-columns: 100px 1fr; } .ad-deal-value, .ad-deal-meta { display: none; } }
.ad-deal-stage {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #00ffd1;
  font-weight: 700;
}
.ad-deal-title a { color: #e8e8e8; text-decoration: none; font-weight: 600; }
.ad-deal-title a:hover { color: #00ffd1; }
.ad-deal-kind {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #5a5c61;
  letter-spacing: 0.10em;
  margin-top: 2px;
}
.ad-deal-value { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: #e8e8e8; }
.ad-deal-meta { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #888; }

.ad-timeline { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.ad-timeline li {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 16px;
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 12px 14px;
}
.ad-tl-when { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #5a5c61; letter-spacing: 0.10em; text-transform: uppercase; }
.ad-tl-kind {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #00ffd1;
  margin-bottom: 4px;
}
.ad-tl-title { font-weight: 600; font-size: 14px; color: #e8e8e8; }
.ad-tl-md { font-size: 13px; color: #b5b5b5; line-height: 1.5; margin: 6px 0 0; }
`;
