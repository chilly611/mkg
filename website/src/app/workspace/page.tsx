import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function WorkspaceHome() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email ??
    "Friend";

  // Welcome name = first word of display name
  const firstName = displayName.split(/\s+/)[0];

  return (
    <>
      <style>{styles}</style>

      <header className="wh-header">
        <div className="wh-eyebrow">
          <span className="wh-dot" />
          PRIVATE · TEAM WORKSPACE
        </div>
        <h1>Welcome, {firstName}.</h1>
        <p className="wh-sub">
          This is the team&apos;s working room. Post ideas, save research, brainstorm by
          category, ask Claude. Auth-gated; only the three of us see anything here.
        </p>
      </header>

      <section className="wh-grid">
        <div className="wh-card wh-card-feature">
          <div className="wh-card-eyebrow">START HERE</div>
          <h3>Read the brief before doing anything else.</h3>
          <p>
            The public brief is the strategy. Twelve minutes top to bottom. If you haven&apos;t
            read it yet, that&apos;s the first task. Then come back and start posting.
          </p>
          <Link href="/" className="wh-cta">
            Open the Brief →
          </Link>
        </div>

        <div className="wh-card">
          <div className="wh-card-eyebrow">SHIPPING NEXT</div>
          <h3>Posts &amp; ideas feed.</h3>
          <p>
            Title, body, images, links, category tag. Like Slack channels meets Notion pages.
            <strong className="wh-soon">Cycle 003.5 · this week</strong>
          </p>
          <Link href="/workspace/posts" className="wh-cta-soft">
            Preview →
          </Link>
        </div>

        <div className="wh-card">
          <div className="wh-card-eyebrow">SHIPPING NEXT</div>
          <h3>Categories.</h3>
          <p>
            Eight predefined topics — B2B founder, consumer healthtech, plant commerce,
            toxin-free luxury, toxicology consumer ed, MA product, open strategy, competitive intel.
            Editable; categories aren&apos;t precious.
          </p>
          <Link href="/workspace/categories" className="wh-cta-soft">
            See categories →
          </Link>
        </div>

        <div className="wh-card">
          <div className="wh-card-eyebrow">SHIPPING CYCLE 004</div>
          <h3>Research · Claude.</h3>
          <p>
            Pick a category. Type a question. Get a researched answer with sources.
            Save to a post. Anti-fabrication still enforced — Claude either cites it or
            tells you it doesn&apos;t know.
          </p>
          <Link href="/workspace/research" className="wh-cta-soft">
            Preview →
          </Link>
        </div>
      </section>

      <section className="wh-section">
        <h2>What&apos;s here so far</h2>
        <ul className="wh-list">
          <li>
            <span className="wh-tag">✓</span>
            <div>
              <strong>Auth wired.</strong> Google OAuth via Supabase. You&apos;re signed in
              right now. Sign-out button is in the sidebar.
            </div>
          </li>
          <li>
            <span className="wh-tag">✓</span>
            <div>
              <strong>Email whitelist.</strong> Only Chilly, John, Michael can sign in.
              Anyone else gets a polite redirect.
            </div>
          </li>
          <li>
            <span className="wh-tag">✓</span>
            <div>
              <strong>Database schema for posts.</strong> Tables exist; UI is next.
            </div>
          </li>
          <li>
            <span className="wh-tag wh-tag-soon">↻</span>
            <div>
              <strong>Posts feed UI.</strong> In progress, ships this week.
            </div>
          </li>
          <li>
            <span className="wh-tag wh-tag-soon">↻</span>
            <div>
              <strong>Claude research panel.</strong> Ships Cycle 004 (next weekend).
            </div>
          </li>
        </ul>
      </section>

      <footer className="wh-foot">
        <span>CAT.NO MKG-2026-WORKSPACE-V0.1 · CYCLE 003.5 · {new Date().toISOString().slice(0, 10)}</span>
      </footer>
    </>
  );
}

const styles = `
.wh-header { margin-bottom: 36px; }
.wh-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 18px;
}
.wh-dot { width: 8px; height: 8px; border-radius: 50%; background: #00ffd1; box-shadow: 0 0 12px rgba(0,255,209,0.55); }
.wh-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(36px, 5vw, 56px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0 0 14px;
}
.wh-sub { color: #b5b5b5; font-size: 16px; line-height: 1.55; max-width: 680px; margin: 0; }

.wh-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  margin-bottom: 48px;
}
@media (min-width: 760px) { .wh-grid { grid-template-columns: 1fr 1fr; } }

.wh-card {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
}
.wh-card-feature { border-color: rgba(0,255,209,0.4); box-shadow: 0 0 24px rgba(0,255,209,0.06); }
.wh-card-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #00ffd1;
  margin-bottom: 10px;
}
.wh-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.012em;
  margin: 0 0 10px;
}
.wh-card p { color: #b5b5b5; font-size: 14.5px; line-height: 1.55; margin: 0 0 14px; flex: 1; }
.wh-soon { display: block; margin-top: 8px; color: #888; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; }
.wh-cta {
  display: inline-block;
  background: #00ffd1;
  color: #001a16;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 10px 16px;
  text-decoration: none;
  border: 1px solid #00ffd1;
  align-self: flex-start;
  transition: box-shadow .2s, transform .15s;
}
.wh-cta:hover { box-shadow: 0 0 24px rgba(0,255,209,0.45); transform: translateY(-1px); }
.wh-cta-soft {
  display: inline-block;
  color: #00ffd1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 8px 0;
  text-decoration: none;
  border-bottom: 1px solid rgba(0,255,209,0.3);
  align-self: flex-start;
  transition: border-color .15s;
}
.wh-cta-soft:hover { border-color: #00ffd1; }

.wh-section { margin-bottom: 48px; }
.wh-section h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: -0.012em;
  margin: 0 0 18px;
}
.wh-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.wh-list li {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 14px;
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 14px 18px;
  font-size: 14.5px;
  color: #b5b5b5;
}
.wh-list li strong { color: #e8e8e8; font-weight: 600; }
.wh-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(0,255,209,0.14);
  color: #00ffd1;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  border-radius: 4px;
}
.wh-tag-soon { color: #b5b5b5; background: rgba(255,255,255,0.06); }

.wh-foot {
  margin-top: 56px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #5a5c61;
}
`;
