import Link from "next/link";
import { notFound } from "next/navigation";
import { getDealBySlug } from "@/lib/supabase/queries";
import { fmtUsd, fmtDate, STAGE_LABEL, KIND_LABEL } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

const TABS = [
  { id: "creative", label: "Creative" },
  { id: "anatomy", label: "Anatomy" },
  { id: "intelligence", label: "Intelligence" },
  { id: "compare", label: "Compare" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default async function TeardownDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const activeTab: TabId = (TABS.find((t) => t.id === sp.tab)?.id ?? "creative") as TabId;

  const teardown = await getDealBySlug(slug);
  if (!teardown) notFound();

  return (
    <>
      <style>{styles}</style>

      <Link href="/workspace/teardowns" className="tt-back">← All teardowns</Link>

      <header className="tt-header">
        <div className="tt-eyebrow">CAMPAIGN TEARDOWN · {STAGE_LABEL[teardown.stage]}</div>
        <h1>{teardown.title}</h1>
        <div className="tt-meta-row">
          {teardown.org_slug && teardown.org_name && (
            <Link href={`/workspace/accounts/${teardown.org_slug}`} className="tt-org">
              {teardown.org_name}{teardown.org_industry ? ` · ${teardown.org_industry}` : ""}
            </Link>
          )}
          <span className="tt-kind">{KIND_LABEL[teardown.kind] ?? teardown.kind}</span>
          {teardown.value_usd ? <span className="tt-value">{fmtUsd(teardown.value_usd)}</span> : null}
          {teardown.expected_close_date && (
            <span className="tt-eta">Target close · {fmtDate(teardown.expected_close_date)}</span>
          )}
          {teardown.owner_email && <span className="tt-owner">Owner · {teardown.owner_email.split("@")[0]}</span>}
        </div>
        {teardown.brief_summary && (
          <div className="tt-brief">
            <span className="tt-brief-lab">BRIEF</span>
            <p>{teardown.brief_summary}</p>
          </div>
        )}
      </header>

      <nav className="tt-tabs" role="tablist" aria-label="Teardown tabs">
        {TABS.map((t, i) => (
          <Link
            key={t.id}
            href={`/workspace/teardowns/${slug}?tab=${t.id}`}
            className={`tt-tab ${activeTab === t.id ? "tt-tab-active" : ""}`}
            scroll={false}
          >
            <span className="tt-tab-num">0{i + 1}</span>
            {t.label}
          </Link>
        ))}
      </nav>

      <section className="tt-tab-body">
        {activeTab === "creative" && <CreativeTab title={teardown.title} />}
        {activeTab === "anatomy" && <AnatomyTab />}
        {activeTab === "intelligence" && <IntelligenceTab />}
        {activeTab === "compare" && <CompareTab />}
      </section>

      <footer className="tt-foot">
        <span>CAT.NO MKG-2026-TEARDOWN · {teardown.slug?.toUpperCase()}</span>
        <span>Stage · {STAGE_LABEL[teardown.stage]}</span>
      </footer>
    </>
  );
}

// ----- Tab content -----

function CreativeTab({ title }: { title: string }) {
  return (
    <div className="tab-card">
      <div className="tab-eyebrow">TAB 01 · CREATIVE</div>
      <h2>The raw asset.</h2>
      <p className="tab-lead">
        Upload the campaign asset itself: image, video, copy, landing page screenshot, podcast embed.
        No annotations on this tab — annotation lives on the Anatomy tab. If we don&apos;t have
        rights to show the creative publicly, we use a placeholder plate; the structured anatomy
        still works.
      </p>
      <div className="tab-placeholder">
        <div className="tab-placeholder-grid">
          <div className="tab-ph-card">
            <div className="tab-ph-lab">PRIMARY CREATIVE</div>
            <div className="tab-ph-box">Drag an image, video, or paste a URL here</div>
          </div>
          <div className="tab-ph-card">
            <div className="tab-ph-lab">SUPPORTING ASSETS</div>
            <div className="tab-ph-box">Variants, channels, retargeting, follow-ups</div>
          </div>
        </div>
        <p className="tab-note">Cycle 005 wires up Storage uploads for teardowns. For now, this tab shows the placeholder structure for <em>{title}</em>.</p>
      </div>
    </div>
  );
}

function AnatomyTab() {
  return (
    <div className="tab-card">
      <div className="tab-eyebrow">TAB 02 · ANATOMY</div>
      <h2>The structured breakdown.</h2>
      <p className="tab-lead">
        Engineering-style annotations on the creative. Dimension lines on copy length, callouts on the
        CTA, brackets on the audience cue, copper underlines on framework references. Stored as
        structured JSON in <code>deals.metadata.anatomy</code>.
      </p>
      <dl className="tab-dl">
        <div><dt>Objective</dt><dd className="muted">— add objective —</dd></div>
        <div><dt>Target audience</dt><dd className="muted">— link to audience record —</dd></div>
        <div><dt>Hook (max 280 chars)</dt><dd className="muted">— the opening attention move —</dd></div>
        <div><dt>Single CTA</dt><dd className="muted">— the one thing the asset asks for —</dd></div>
        <div><dt>Channel fit</dt><dd className="muted">— why the format suits the channel —</dd></div>
        <div><dt>Framework links</dt><dd className="muted">— Ehrenberg-Bass / MSI / IPA effectiveness laws —</dd></div>
        <div><dt>Tradeoffs</dt><dd className="muted">— what&apos;s left out and why —</dd></div>
        <div><dt>Risks</dt><dd className="muted">— what would break this campaign —</dd></div>
      </dl>
      <p className="tab-note">Inline edit ships Cycle 005. For now, edit via the Anatomy JSON in Supabase.</p>
    </div>
  );
}

function IntelligenceTab() {
  return (
    <div className="tab-card">
      <div className="tab-eyebrow">TAB 03 · INTELLIGENCE</div>
      <h2>Benchmarks + measured performance + frameworks cited.</h2>
      <p className="tab-lead">
        Three rows: benchmarks (source URL + retrieved_at + sample size required), actual measured
        performance (every metric carries a <code>source_kind</code> — platform-reported / inferred /
        claimed-by-brand / third-party-audited / observed-internal), and frameworks cited (links to
        authority sources).
      </p>
      <div className="tab-three-rows">
        <div>
          <div className="tab-row-lab">BENCHMARKS</div>
          <p className="muted">— no benchmarks linked yet —</p>
        </div>
        <div>
          <div className="tab-row-lab">MEASURED PERFORMANCE</div>
          <p className="muted">— no metrics recorded yet —</p>
        </div>
        <div>
          <div className="tab-row-lab">FRAMEWORKS CITED</div>
          <p className="muted">— no frameworks tagged yet —</p>
        </div>
      </div>
      <p className="tab-note">
        Anti-fabrication discipline enforced at the schema level: every benchmark row requires a
        <code> source_id</code>; every metric row requires a <code>source_kind</code>. No source,
        no row. (Per <code>L-MKG-003</code>.)
      </p>
    </div>
  );
}

function CompareTab() {
  return (
    <div className="tab-card">
      <div className="tab-eyebrow">TAB 04 · COMPARE</div>
      <h2>Side-by-side, draggable slider.</h2>
      <p className="tab-lead">
        The signature device of the umbrella brand system. Default mode: <em>Creative ↔ Anatomy</em> —
        the raw asset on the left, the annotated anatomy on the right, dragged via a vertical handle.
        Secondary mode: <em>Campaign × Campaign</em> — pick two teardowns and compare their anatomies
        + intelligence rows.
      </p>
      <div className="tab-compare-mock">
        <div className="tab-compare-side tab-compare-left">
          <div className="tab-compare-lab">CREATIVE</div>
          <div className="tab-compare-fill">raw asset</div>
        </div>
        <div className="tab-compare-handle">⟷</div>
        <div className="tab-compare-side tab-compare-right">
          <div className="tab-compare-lab">ANATOMY</div>
          <div className="tab-compare-fill">annotated overlay</div>
        </div>
      </div>
      <p className="tab-note">
        Interactive slider ships Cycle 005 alongside the OKG-style photo↔blueprint pattern. The
        mock above shows the layout intent.
      </p>
    </div>
  );
}

const styles = `
.tt-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 16px;
}
.tt-back:hover { color: #00ffd1; }

.tt-header {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 22px 24px;
  margin-bottom: 24px;
}
.tt-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #00ffd1;
  margin-bottom: 10px;
}
.tt-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(26px, 4vw, 36px);
  letter-spacing: -0.025em;
  line-height: 1.08;
  margin: 0 0 14px;
}
.tt-meta-row {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #888;
  letter-spacing: 0.10em;
}
.tt-org { color: #00ffd1; text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 11px; }
.tt-org:hover { text-decoration: underline; }
.tt-value { color: #e8e8e8; font-weight: 700; }
.tt-brief {
  margin-top: 18px;
  padding: 14px 16px;
  background: rgba(0,255,209,0.04);
  border-left: 3px solid #00ffd1;
}
.tt-brief-lab {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: #5a5c61;
  margin-bottom: 6px;
}
.tt-brief p { color: #e8e8e8; font-size: 14.5px; line-height: 1.55; margin: 0; }

.tt-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(255,255,255,0.18);
  margin-bottom: 0;
  flex-wrap: wrap;
}
.tt-tab {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding: 14px 22px;
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
  color: #888;
  border: 1px solid rgba(255,255,255,0.18);
  border-bottom: none;
  border-right: none;
  background: transparent;
}
.tt-tab:last-child { border-right: 1px solid rgba(255,255,255,0.18); }
.tt-tab-num { color: #00ffd1; }
.tt-tab-active { color: #001a16; background: #00ffd1; border-color: #00ffd1; }
.tt-tab-active .tt-tab-num { color: #001a16; }

.tt-tab-body { margin-bottom: 32px; }
.tab-card {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.18);
  border-top: none;
  padding: 24px 26px;
}
.tab-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #00ffd1;
  margin-bottom: 8px;
}
.tab-card h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: -0.018em;
  line-height: 1.1;
  margin: 0 0 12px;
}
.tab-lead {
  font-size: 15.5px;
  line-height: 1.6;
  color: #b5b5b5;
  margin: 0 0 24px;
  max-width: 760px;
}
.tab-lead code { background: rgba(0,255,209,0.10); color: #00ffd1; padding: 1px 6px; font-size: 13px; font-family: 'JetBrains Mono', monospace; }

.tab-placeholder {}
.tab-placeholder-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
}
@media (min-width: 700px) { .tab-placeholder-grid { grid-template-columns: 2fr 1fr; } }
.tab-ph-card { background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.20); padding: 18px; }
.tab-ph-lab {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #5a5c61;
  margin-bottom: 10px;
}
.tab-ph-box {
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #5a5c61;
  letter-spacing: 0.10em;
}
.tab-note {
  font-size: 13px;
  color: #888;
  line-height: 1.5;
  margin: 16px 0 0;
  padding: 12px 14px;
  background: rgba(0,255,209,0.04);
  border-left: 3px solid #00ffd1;
}
.tab-note em { color: #00ffd1; font-style: normal; font-weight: 600; }

.tab-dl { display: grid; grid-template-columns: 1fr; gap: 12px; margin: 16px 0; }
@media (min-width: 760px) { .tab-dl { grid-template-columns: 1fr 1fr; } }
.tab-dl > div { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 12px 14px; }
.tab-dl dt {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #00ffd1;
  font-weight: 700;
  margin-bottom: 6px;
}
.tab-dl dd { margin: 0; color: #e8e8e8; font-size: 14px; }
.muted { color: #5a5c61; font-style: italic; }

.tab-three-rows { display: grid; gap: 14px; margin: 16px 0; }
.tab-three-rows > div { padding: 14px 16px; background: rgba(255,255,255,0.02); border-left: 3px solid #00ffd1; }
.tab-row-lab {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #00ffd1;
  margin-bottom: 6px;
  font-weight: 700;
}

.tab-compare-mock {
  display: grid;
  grid-template-columns: 1fr 32px 1fr;
  gap: 0;
  margin: 18px 0;
  border: 1px solid rgba(255,255,255,0.18);
}
.tab-compare-side { padding: 22px; }
.tab-compare-left { background: rgba(255,255,255,0.02); }
.tab-compare-right { background: rgba(0,255,209,0.04); border-left: 1px dashed rgba(0,255,209,0.4); }
.tab-compare-lab {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #00ffd1;
  margin-bottom: 12px;
}
.tab-compare-fill {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  color: #5a5c61;
  font-size: 12px;
  letter-spacing: 0.10em;
}
.tab-compare-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #00ffd1;
  color: #001a16;
  font-weight: 700;
  font-size: 16px;
  cursor: ew-resize;
}

.tt-foot {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5a5c61;
}
`;
