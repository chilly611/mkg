import Link from "next/link";
import { getRecentDeals } from "@/lib/supabase/queries";
import { DealCard } from "@/components/deal-card";

export const dynamic = "force-dynamic";

export default async function TeardownsPage() {
  const teardowns = await getRecentDeals({ kind: "teardown", limit: 60 });

  return (
    <>
      <style>{styles}</style>

      <div className="td-head">
        <div className="td-eyebrow">CAMPAIGN TEARDOWNS · KILLER APP</div>
        <div className="td-title-row">
          <h1>The teardowns in flight.</h1>
          <Link href="/workspace/teardowns/new" className="td-cta">+ Start a teardown</Link>
        </div>
        <p>
          A teardown is the core deliverable of The Marketing Architect — Creative / Anatomy /
          Intelligence / Compare, every claim cited. Each teardown links to an Account; when
          delivered, it becomes the customer&apos;s artifact and (with permission) a public entity.
        </p>
      </div>

      {teardowns.length === 0 ? (
        <div className="td-empty">
          <h3>No teardowns yet.</h3>
          <p>Start the BKG sliver-launch teardown as Campaign #001.</p>
          <Link href="/workspace/teardowns/new" className="td-cta">+ Start a teardown</Link>
        </div>
      ) : (
        <div className="td-grid">
          {teardowns.map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      )}
    </>
  );
}

const styles = `
.td-head { margin-bottom: 26px; }
.td-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 12px;
}
.td-title-row { display: flex; align-items: flex-end; gap: 14px; flex-wrap: wrap; margin-bottom: 12px; }
.td-title-row h1 {
  flex: 1;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0;
}
.td-head p { color: #b5b5b5; font-size: 15px; line-height: 1.55; max-width: 760px; margin: 0; }
.td-cta {
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
.td-cta:hover { box-shadow: 0 0 24px rgba(0,255,209,0.45); }

.td-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 760px) { .td-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1200px) { .td-grid { grid-template-columns: 1fr 1fr 1fr; } }

.td-empty {
  border: 1px dashed rgba(255,255,255,0.18);
  padding: 36px 28px;
  text-align: center;
  background: rgba(0,255,209,0.02);
}
.td-empty h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; margin: 0 0 10px; }
.td-empty p { color: #b5b5b5; margin: 0 auto 20px; max-width: 540px; }
`;
