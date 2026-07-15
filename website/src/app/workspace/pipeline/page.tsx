import Link from "next/link";
import { getPipelineByStage, getPipelineValue, type DealStage } from "@/lib/supabase/queries";
import { fmtUsd, STAGE_LABEL, STAGE_ORDER } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const [pipeline, value] = await Promise.all([
    getPipelineByStage(),
    getPipelineValue(),
  ]);

  const total = (Object.values(pipeline) as { length: number }[]).reduce((s, a) => s + a.length, 0);

  return (
    <>
      <style>{styles}</style>

      <div className="pp-head">
        <div className="pp-eyebrow">PIPELINE · DEALS BY STAGE</div>
        <div className="pp-title-row">
          <h1>What&apos;s in flight.</h1>
          <Link href="/workspace/teardowns/new" className="pp-cta">+ New deal</Link>
        </div>
        <div className="pp-summary">
          <div><span className="pp-num">{total}</span><span className="pp-lab">deals</span></div>
          <div><span className="pp-num">{fmtUsd(value.open_usd, { compact: true })}</span><span className="pp-lab">open value</span></div>
          <div><span className="pp-num">{fmtUsd(value.won_usd, { compact: true })}</span><span className="pp-lab">won value</span></div>
        </div>
      </div>

      <div className="pp-board" role="region" aria-label="Pipeline kanban">
        {STAGE_ORDER.map((stage) => {
          const deals = pipeline[stage as DealStage] ?? [];
          const stageValue = deals.reduce((s, d) => s + Number(d.value_usd ?? 0), 0);
          return (
            <div key={stage} className={`pp-col pp-col-${stage}`}>
              <div className="pp-col-head">
                <span className="pp-col-name">{STAGE_LABEL[stage]}</span>
                <span className="pp-col-count">{deals.length}</span>
              </div>
              <div className="pp-col-value">{stageValue > 0 ? fmtUsd(stageValue, { compact: true }) : "—"}</div>
              <div className="pp-col-cards">
                {deals.length === 0 && (
                  <div className="pp-empty">—</div>
                )}
                {deals.map((d) => {
                  const href = d.kind === "teardown" && d.slug
                    ? `/workspace/teardowns/${d.slug}`
                    : `/workspace/accounts/${d.org_slug ?? ""}`;
                  return (
                    <Link key={d.id} href={href} className="pp-card">
                      <div className="pp-card-org">{d.org_name}</div>
                      <div className="pp-card-title">{d.title}</div>
                      <div className="pp-card-foot">
                        <span className="pp-card-kind">{d.kind}</span>
                        {d.value_usd ? <span className="pp-card-value">{fmtUsd(d.value_usd, { compact: true })}</span> : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="pp-note">
        Demo note: stages are read-only in v1. Drag-and-drop comes in Cycle 005 when activity-log writes get a proper UI.
        Until then, change stages via the deal detail page or directly in Supabase.
      </p>
    </>
  );
}

const styles = `
.pp-head { margin-bottom: 22px; }
.pp-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 12px;
}
.pp-title-row { display: flex; align-items: flex-end; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }
.pp-title-row h1 {
  flex: 1;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0;
}
.pp-cta {
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
}
.pp-cta:hover { box-shadow: 0 0 24px rgba(0,255,209,0.45); }

.pp-summary {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  padding: 14px 16px;
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
}
.pp-summary > div { display: flex; flex-direction: column; gap: 4px; }
.pp-num { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; color: #00ffd1; letter-spacing: -0.022em; }
.pp-lab { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #5a5c61; }

.pp-board {
  display: grid;
  grid-template-columns: repeat(7, minmax(180px, 1fr));
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 12px;
}
@media (max-width: 1400px) { .pp-board { grid-template-columns: repeat(7, 220px); } }

.pp-col {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 12px 10px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}
.pp-col-won { border-color: rgba(0,255,209,0.4); background: rgba(0,255,209,0.04); }
.pp-col-lost { border-color: rgba(255,100,100,0.25); background: rgba(255,100,100,0.03); }

.pp-col-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.pp-col-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #e8e8e8;
  font-weight: 700;
}
.pp-col-count {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #00ffd1;
}
.pp-col-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #5a5c61;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}
.pp-col-cards { display: grid; gap: 8px; }

.pp-empty {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #5a5c61;
  text-align: center;
  padding: 12px;
}

.pp-card {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 10px 12px;
  text-decoration: none;
  color: inherit;
  display: block;
  transition: border-color .15s, transform .15s;
}
.pp-card:hover { border-color: rgba(0,255,209,0.4); transform: translateY(-1px); }
.pp-card-org {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #00ffd1;
  margin-bottom: 4px;
}
.pp-card-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 13.5px;
  letter-spacing: -0.01em;
  color: #e8e8e8;
  line-height: 1.3;
  margin-bottom: 8px;
}
.pp-card-foot {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #5a5c61;
  letter-spacing: 0.08em;
}
.pp-card-value { color: #b5b5b5; font-weight: 700; }
.pp-card-kind { text-transform: uppercase; }

.pp-note {
  margin-top: 24px;
  padding: 12px 16px;
  background: rgba(0,255,209,0.04);
  border-left: 3px solid #00ffd1;
  color: #b5b5b5;
  font-size: 13px;
  line-height: 1.5;
}
`;
