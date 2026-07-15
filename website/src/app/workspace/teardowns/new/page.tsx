import Link from "next/link";
import { getAccounts } from "@/lib/supabase/queries";
import { createTeardownAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function NewTeardownPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; account?: string }>;
}) {
  const sp = await searchParams;
  const accounts = await getAccounts();
  const preselectedSlug = sp.account;

  return (
    <>
      <style>{styles}</style>

      <div className="nt-head">
        <Link href="/workspace/teardowns" className="nt-back">← All teardowns</Link>
        <div className="nt-eyebrow">NEW CAMPAIGN TEARDOWN · THE KILLER APP</div>
        <h1>Start a teardown.</h1>
        <p>
          Pick an account, name the campaign you&apos;re tearing down, capture a one-line brief.
          The teardown lands at <code>briefed</code> stage and you build it out across the four
          tabs from the detail page.
        </p>
      </div>

      {sp.err && (
        <div className="nt-err">
          {sp.err === "missing_fields" ? "Account and title are both required." :
            sp.err === "account_not_found" ? "That account couldn't be found." :
            `Error: ${decodeURIComponent(sp.err)}`}
        </div>
      )}

      <form action={createTeardownAction} className="nt-form">
        <label className="nt-field">
          <span className="nt-label">Account</span>
          <select name="account_slug" required defaultValue={preselectedSlug ?? ""} className="nt-select">
            <option value="">— pick an account —</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.slug}>{a.name}{a.industry ? ` · ${a.industry}` : ""}</option>
            ))}
          </select>
          <span className="nt-hint">
            Don&apos;t see them? <Link href="/workspace/accounts/new" className="nt-inline">Create a new account first →</Link>
          </span>
        </label>

        <label className="nt-field">
          <span className="nt-label">Title</span>
          <input
            type="text"
            name="title"
            required
            maxLength={160}
            placeholder="e.g. Q1 paid social rebrand · Spring 2026"
            className="nt-input"
          />
        </label>

        <div className="nt-row">
          <label className="nt-field">
            <span className="nt-label">SKU value (USD)</span>
            <select name="value_usd" defaultValue="1499" className="nt-select">
              <option value="249">$249 — Single Recommendation Memo</option>
              <option value="1499">$1,499 — Campaign Teardown (default)</option>
              <option value="3500">$3,500 — Brand Audit</option>
              <option value="8000">$8,000 — Embedded (quarterly)</option>
              <option value="5500">$5,500 — Custom</option>
            </select>
          </label>
          <label className="nt-field">
            <span className="nt-label">Expected close</span>
            <input type="date" name="expected_close_date" className="nt-input" />
          </label>
        </div>

        <label className="nt-field">
          <span className="nt-label">Brief summary</span>
          <textarea
            name="brief_summary"
            rows={4}
            placeholder="One paragraph: who the customer is, what they want torn down, what they're hoping to learn."
            className="nt-textarea"
          />
        </label>

        <div className="nt-actions">
          <Link href="/workspace/teardowns" className="nt-cancel">Cancel</Link>
          <button type="submit" className="nt-submit">Brief the teardown →</button>
        </div>
      </form>
    </>
  );
}

const styles = `
.nt-head { margin-bottom: 26px; }
.nt-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  margin-bottom: 12px;
  display: inline-block;
}
.nt-back:hover { color: #00ffd1; }
.nt-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 10px;
}
.nt-head h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(26px, 4vw, 36px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0 0 10px;
}
.nt-head p { color: #b5b5b5; font-size: 14.5px; line-height: 1.55; max-width: 720px; margin: 0; }
.nt-head code { background: rgba(0,255,209,0.10); color: #00ffd1; padding: 1px 6px; font-size: 13px; font-family: 'JetBrains Mono', monospace; }

.nt-err {
  background: rgba(255,80,80,0.08);
  border: 1px solid rgba(255,80,80,0.4);
  color: #ff9090;
  padding: 12px 16px;
  margin-bottom: 18px;
  font-size: 14px;
}

.nt-form { display: flex; flex-direction: column; gap: 18px; max-width: 760px; }
.nt-field { display: flex; flex-direction: column; gap: 6px; }
.nt-row { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 600px) { .nt-row { grid-template-columns: 1fr 1fr; } }
.nt-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #00ffd1;
  font-weight: 700;
}
.nt-input, .nt-select, .nt-textarea {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.18);
  color: #e8e8e8;
  font-family: 'Inter', sans-serif;
  font-size: 14.5px;
  padding: 11px 14px;
  transition: border-color .15s;
}
.nt-input:focus, .nt-select:focus, .nt-textarea:focus { outline: none; border-color: #00ffd1; box-shadow: 0 0 0 3px rgba(0,255,209,0.10); }
.nt-textarea { resize: vertical; min-height: 88px; line-height: 1.5; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
.nt-select { cursor: pointer; }
.nt-hint { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #5a5c61; letter-spacing: 0.04em; }
.nt-inline { color: #00ffd1; text-decoration: none; }
.nt-inline:hover { text-decoration: underline; }

.nt-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 8px; }
.nt-submit {
  background: #00ffd1;
  color: #001a16;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 13px 22px;
  border: 1px solid #00ffd1;
  cursor: pointer;
  transition: box-shadow .2s, transform .15s;
}
.nt-submit:hover { box-shadow: 0 0 24px rgba(0,255,209,0.45); transform: translateY(-1px); }
.nt-cancel {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  padding: 13px 18px;
  border: 1px solid rgba(255,255,255,0.18);
}
.nt-cancel:hover { color: #00ffd1; border-color: #00ffd1; }
`;
