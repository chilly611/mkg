import Link from "next/link";
import { createAccountAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function NewAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <style>{styles}</style>

      <div className="na-head">
        <Link href="/workspace/accounts" className="na-back">← All accounts</Link>
        <div className="na-eyebrow">NEW ACCOUNT</div>
        <h1>Add a company to the book.</h1>
        <p>Companies start as prospects. Move them to qualified once a real conversation is on the calendar.</p>
      </div>

      {sp.err && (
        <div className="na-err">
          {sp.err === "missing_name" ? "A company name is required." : `Error: ${decodeURIComponent(sp.err)}`}
        </div>
      )}

      <form action={createAccountAction} className="na-form">
        <div className="na-row">
          <label className="na-field">
            <span className="na-label">Company name *</span>
            <input type="text" name="name" required maxLength={200} placeholder="Aurora Credentialing" className="na-input" autoFocus />
          </label>
          <label className="na-field">
            <span className="na-label">Industry</span>
            <input type="text" name="industry" placeholder="Healthcare-tech (credentialing)" className="na-input" />
          </label>
        </div>

        <div className="na-row">
          <label className="na-field">
            <span className="na-label">Website</span>
            <input type="url" name="website_url" placeholder="https://aurora.example.com" className="na-input" />
          </label>
          <label className="na-field">
            <span className="na-label">LinkedIn URL</span>
            <input type="url" name="linkedin_url" placeholder="https://linkedin.com/company/aurora" className="na-input" />
          </label>
        </div>

        <div className="na-row">
          <label className="na-field">
            <span className="na-label">HQ city</span>
            <input type="text" name="hq_city" placeholder="Boston" className="na-input" />
          </label>
          <label className="na-field">
            <span className="na-label">Country</span>
            <input type="text" name="hq_country" defaultValue="USA" className="na-input" />
          </label>
          <label className="na-field">
            <span className="na-label">Size</span>
            <input type="text" name="size_employees" placeholder="50-200 employees" className="na-input" />
          </label>
        </div>

        <div className="na-row">
          <label className="na-field">
            <span className="na-label">Status</span>
            <select name="account_status" defaultValue="prospect" className="na-select">
              <option value="prospect">Prospect</option>
              <option value="qualified">Qualified</option>
              <option value="customer">Customer</option>
              <option value="churned">Churned</option>
              <option value="lost">Lost</option>
            </select>
          </label>
          <label className="na-field">
            <span className="na-label">Source</span>
            <select name="source" defaultValue="john_network" className="na-select">
              <option value="john_network">John&apos;s network</option>
              <option value="inbound">Inbound</option>
              <option value="event">Event</option>
              <option value="cold">Cold outbound</option>
              <option value="referral">Referral</option>
              <option value="partner">Partner</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>
          <label className="na-field">
            <span className="na-label">Owner email</span>
            <input type="email" name="owner_email" placeholder="bou@theknowledgegardens.com" className="na-input" />
          </label>
        </div>

        <label className="na-field">
          <span className="na-label">Pitch notes</span>
          <textarea
            name="pitch_notes"
            rows={4}
            placeholder="One paragraph: who they are, why they need MA, who their buyer is, where they're stuck."
            className="na-textarea"
          />
        </label>

        <div className="na-actions">
          <Link href="/workspace/accounts" className="na-cancel">Cancel</Link>
          <button type="submit" className="na-submit">Create account →</button>
        </div>
      </form>
    </>
  );
}

const styles = `
.na-head { margin-bottom: 26px; }
.na-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  margin-bottom: 12px;
  display: inline-block;
}
.na-back:hover { color: #00ffd1; }
.na-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 10px;
}
.na-head h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(26px, 4vw, 36px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0 0 10px;
}
.na-head p { color: #b5b5b5; font-size: 14.5px; line-height: 1.5; max-width: 600px; margin: 0; }

.na-err {
  background: rgba(255,80,80,0.08);
  border: 1px solid rgba(255,80,80,0.4);
  color: #ff9090;
  padding: 12px 16px;
  margin-bottom: 18px;
  font-size: 14px;
}

.na-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 880px;
}
.na-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 760px) {
  .na-row { grid-template-columns: 1fr 1fr; }
  .na-row:has(> *:nth-child(3)) { grid-template-columns: 1fr 1fr 1fr; }
}
.na-field { display: flex; flex-direction: column; gap: 6px; }
.na-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #00ffd1;
  font-weight: 700;
}
.na-input, .na-select, .na-textarea {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.18);
  color: #e8e8e8;
  font-family: 'Inter', sans-serif;
  font-size: 14.5px;
  padding: 10px 12px;
  transition: border-color .15s;
}
.na-input:focus, .na-select:focus, .na-textarea:focus {
  outline: none; border-color: #00ffd1; box-shadow: 0 0 0 3px rgba(0,255,209,0.10);
}
.na-textarea { resize: vertical; min-height: 84px; line-height: 1.5; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
.na-select { cursor: pointer; }

.na-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 8px; }
.na-submit {
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
.na-submit:hover { box-shadow: 0 0 24px rgba(0,255,209,0.45); transform: translateY(-1px); }
.na-cancel {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  padding: 13px 18px;
  border: 1px solid rgba(255,255,255,0.18);
}
.na-cancel:hover { color: #00ffd1; border-color: #00ffd1; }
`;
