import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Marketing Architect — the three things to do, the seven to ignore",
  description:
    "A productized service that reads your business and tells you the three plays to run, the seven to refuse, and who else is fighting for your buyer's attention. Built by The Knowledge Gardens.",
};

export default function Home() {
  return (
    <>
      <style>{styles}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "The Marketing Architect",
            url: "https://marketing.theknowledgegardens.com",
            description:
              "A productized service that diagnoses how a business shows up to AI search and architects the fix. Single recommendation memo from $249.",
            brand: {
              "@type": "Brand",
              name: "The Knowledge Gardens",
              url: "https://theknowledgegardens.com",
            },
            offers: [
              { "@type": "Offer", price: 249, priceCurrency: "USD", name: "Single Recommendation Memo" },
              { "@type": "Offer", price: 1499, priceCurrency: "USD", name: "The Quarterly" },
              { "@type": "Offer", price: 8000, priceCurrency: "USD", name: "The Embedded (quarterly)" },
            ],
            isPartOf: {
              "@type": "Organization",
              name: "The Knowledge Gardens",
              url: "https://theknowledgegardens.com",
            },
          }),
        }}
      />

      <main className="ma-page">
        {/* Subtle grid + glow background */}
        <div className="ma-bg" aria-hidden="true" />

        {/* Sticky section nav */}
        <nav className="ma-nav" aria-label="Section navigation">
          <a href="#brief" className="ma-nav-brand">
            <span className="ma-nav-dot" />
            The Marketing Architect
          </a>
          <div className="ma-nav-links">
            <a href="#what">What</a>
            <a href="#who">Who</a>
            <a href="#wedge">Wedge</a>
            <a href="#refusals">Refusals</a>
            <a href="#landscape">Landscape</a>
            <a href="#discipline">Discipline</a>
            <a href="#legacy">Legacy</a>
            <a href="#team">Team</a>
            <a href="#buy" className="ma-nav-cta">Get the memo →</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="ma-hero" id="brief">
          <div className="ma-eyebrow">
            <span className="ma-eyebrow-dot" />
            BRIEF · 2026.05 · CYCLE 003
          </div>
          <h1 className="ma-hero-title">
            The Marketing<br />Architect.
          </h1>
          <p className="ma-hero-tagline">
            Reads your business and tells you the <span className="ma-mark">three things to do</span>,
            the <span className="ma-mark">seven things to ignore</span>, and exactly who else is
            fighting for your buyer&apos;s attention — with a citation behind every claim.
          </p>
          <div className="ma-hero-ctas">
            <a href="#buy" className="ma-cta-primary">Get the memo · $249 →</a>
            <a href="#what" className="ma-cta-secondary">Read the brief</a>
          </div>
          <div className="ma-hero-meta">
            <div><span className="lab">From</span><span className="val">The Knowledge Gardens</span></div>
            <div><span className="lab">Wedge</span><span className="val">B2B founders + consumer brands</span></div>
            <div><span className="lab">Status</span><span className="val">Productizing · 30 customers Q2&apos;26</span></div>
            <div><span className="lab">Stack</span><span className="val">Service-led · structured graph beneath</span></div>
          </div>
        </section>

        {/* THE SINGLE SENTENCE */}
        <section className="ma-section">
          <h2 className="ma-section-h">The single sentence.</h2>
          <p className="ma-quote">
            The Marketing Architect is a senior strategist you hire by the hour, except it works in
            twelve minutes and it has read the entire 2026 AI marketing landscape so you don&apos;t
            have to. You give it a URL, a brief, or a sentence about your business. It gives you back
            a recommendation memo that names channels, names competitors, names the campaign you
            should ship next, and — most importantly — names the four things every other tool would
            tell you to do that you should refuse. It is a marketing brain that has done the
            homework, refuses to make up numbers, and has an opinion.
          </p>
          <p className="ma-quote-attr">— Product spec v1, 2026-05-10</p>
        </section>

        {/* WHAT */}
        <section className="ma-section" id="what">
          <h2 className="ma-section-h">What it actually does.</h2>
          <p className="ma-lead">
            Three inputs. Three outputs. Each pairing is real and shippable.
          </p>

          <div className="ma-io-grid">
            <div className="ma-io-col">
              <div className="ma-io-label">Inputs</div>
              <div className="ma-card">
                <span className="ma-card-tag">A · URL</span>
                <p>Paste your homepage. The Architect crawls pricing, blog, and the founder&apos;s last six months of LinkedIn. Returns a brand-voice profile and a three-sentence read of who you sell to.</p>
              </div>
              <div className="ma-card">
                <span className="ma-card-tag">B · 200 words</span>
                <p>Describe the business yourself: who you sell to, what&apos;s working, what&apos;s stuck. Architect asks four targeted follow-ups, no more.</p>
              </div>
              <div className="ma-card">
                <span className="ma-card-tag">C · PDF or deck</span>
                <p>Upload a brief or pitch deck. Architect extracts actual claims (revenue, ICP, GTM thesis), flags the unsupported ones, asks where verifiable numbers came from before using them.</p>
              </div>
            </div>
            <div className="ma-io-col">
              <div className="ma-io-label">Outputs</div>
              <div className="ma-card">
                <span className="ma-card-tag">1 · Recommendation Memo</span>
                <p>6–10 pages. Three plays to run in 90 days, ranked. Seven refusals with reasons. Two campaigns ready to ship in 30 days with exact creative brief. Every number tied to a named source.</p>
              </div>
              <div className="ma-card">
                <span className="ma-card-tag">2 · Campaign Teardown</span>
                <p>Pick a campaign — yours, a competitor&apos;s, or one we recommend. Hook, audience read, channel mix, production cost, result, what to steal vs what was brand-specific.</p>
              </div>
              <div className="ma-card">
                <span className="ma-card-tag">3 · Market Map</span>
                <p>One page mapping the 12–25 companies fighting for your buyer&apos;s attention. For each: tier, region, what they do, whether they&apos;re a competitor, a partner, or a tool you should buy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO */}
        <section className="ma-section" id="who">
          <h2 className="ma-section-h">Who buys this.</h2>
          <p className="ma-lead">
            Two parallel tracks. Same product, two buyer shapes.
          </p>

          <div className="ma-track-grid">
            <div className="ma-track">
              <div className="ma-track-eyebrow">TRACK A</div>
              <h3 className="ma-track-h">B2B founder &amp; head-of-growth.</h3>
              <p>Series A and B vertical SaaS, $3M–$15M ARR, sold to a non-tech buyer (ops, finance, HR, legal, healthcare admin, field services). 38–80 employees. Either no marketing leader or one promoted from within. Drowning in AI vendor pitches, no authority to evaluate them.</p>
              <ul className="ma-personas">
                <li><strong>Sera</strong> · Series A founder · uses the Memo to decide whether to hire a CMO or a fractional</li>
                <li><strong>Marcus</strong> · Series B head of growth · uses it to pressure-test the agency&apos;s plan</li>
                <li><strong>Priya</strong> · fractional CMO · uses it to do in two hours what used to take a week</li>
                <li><strong>Daniel</strong> · agency planner · uses it to walk into pitches with the prospect&apos;s teardown done</li>
              </ul>
            </div>
            <div className="ma-track">
              <div className="ma-track-eyebrow">TRACK B</div>
              <h3 className="ma-track-h">Consumer brand builder.</h3>
              <p>Founder-led DTC, conscious-consumer brands, toxin-free luxury &amp; fashion, plant commerce, consumer health-tech (biomarkers, longevity, supplements). Brand-as-distribution is half the strategy. Personality is the moat. The Bucket A lesson from our humor research — taste discipline, not literal humor.</p>
              <ul className="ma-personas">
                <li><strong>Toxin-free luxury</strong> · TKG&apos;s science applied to apparel + home goods</li>
                <li><strong>Conscious-consumer healthtech</strong> · biomarker tracking, longevity protocols (HKG cross)</li>
                <li><strong>Plant commerce</strong> · rare orchids, vanilla, conscious horticulture (OKG cross)</li>
                <li><strong>Anyone whose brand voice IS the marketing</strong> — Liquid Death, Fly by Jing, BrüMate</li>
              </ul>
            </div>
          </div>

          <div className="ma-freemium">
            <div className="ma-freemium-mark">+ FREE</div>
            <div>
              <h4>Ask The Marketing Architect about a brand</h4>
              <p>Anyone can run a public-data teardown of a consumer brand. Free. Seeds the citation flywheel, spreads the gardens, generates qualified leads for the paid product. Coming with the storefront launch.</p>
            </div>
          </div>

          <p className="ma-not-for">
            <span className="ma-not-tag">NOT FOR</span> Enterprise CMOs (they have teams). Small businesses under $1M revenue (they need ads, not strategy). In-house content marketers shopping for a writing tool (wrong product entirely).
          </p>
        </section>

        {/* WEDGE */}
        <section className="ma-section" id="wedge">
          <h2 className="ma-section-h">The wedge, by track.</h2>
          <div className="ma-wedge-grid">
            <div className="ma-wedge-card">
              <div className="ma-wedge-label">B2B WEDGE · FIRST 30 CUSTOMERS</div>
              <h3>Mid-market healthcare-tech.</h3>
              <p>Credentialing, RCM, clinical comms, point-of-care tools. Sales motion 60% conferences + word-of-mouth, 40% inbound. CMOs panicking about being invisible when a hospital admin asks ChatGPT for vendors.</p>
              <p className="ma-wedge-why">This is John&apos;s network. Modio&apos;s entire $300M exit was the same shape: a vertical where one customer told the next. HKG rides shotgun as the co-distribution channel — every healthcare CMO who buys the Architect becomes a candidate for HKG in the same org.</p>
            </div>
            <div className="ma-wedge-card">
              <div className="ma-wedge-label">CONSUMER WEDGE · CYCLE 005+</div>
              <h3>Toxin-free luxury &amp; conscious commerce.</h3>
              <p>Toxicology meets fashion, apparel, home goods, supplements. Brand voice and citation discipline matter more than channel optimization. The gardens already have the toxicology authority (TKG, Dr. Dahlgren&apos;s expert network) and the botanical authority (OKG, Ecuagenera). MA productizes the brand-strategy layer for founders shipping into that space.</p>
              <p className="ma-wedge-why">B2B funds the company. Consumer creates the cultural moat and the gravity well for every garden. Both need to run from Day 1 — B2B at full speed, consumer as the freemium consumer tool while we prove the paid B2B motion.</p>
            </div>
          </div>
        </section>

        {/* REFUSALS */}
        <section className="ma-section" id="refusals">
          <h2 className="ma-section-h">What we refuse.</h2>
          <p className="ma-lead">
            The product is judged half on what it leaves out. Full list in <a href="#" className="ma-inline">THE_NOT_DOING_LIST.md</a>; here are the five that matter most.
          </p>

          <ol className="ma-refusals">
            <li>
              <span className="ma-ref-num">01</span>
              <div>
                <h4>Not a content generator.</h4>
                <p>It doesn&apos;t write your blog posts. It tells you whether you should be writing blog posts at all.</p>
              </div>
            </li>
            <li>
              <span className="ma-ref-num">02</span>
              <div>
                <h4>Not a GEO/AEO dashboard.</h4>
                <p>It doesn&apos;t monitor LLM citations of your brand. Profound, AthenaHQ, Evertune already do that. We&apos;re the layer above — the strategy that decides whether you need that monitoring at all.</p>
              </div>
            </li>
            <li>
              <span className="ma-ref-num">03</span>
              <div>
                <h4>Not a marketing agency.</h4>
                <p>No retainers for execution. We write the brief; Apollo, Klaviyo, your in-house team, or whoever you hire executes it.</p>
              </div>
            </li>
            <li>
              <span className="ma-ref-num">04</span>
              <div>
                <h4>Will not fabricate a number.</h4>
                <p>Every numeric claim is tied to a named source. If we can&apos;t source it, the output says &quot;unknown&quot; and recommends how to find out. Anti-fabrication is enforced at the database schema level — no source, no row.</p>
              </div>
            </li>
            <li>
              <span className="ma-ref-num">05</span>
              <div>
                <h4>Will not present &quot;options to consider.&quot;</h4>
                <p>When two paths are defensible, we pick one and say why. The Architect is a strategist, not a search engine. If you wanted a list, you&apos;d have used Perplexity.</p>
              </div>
            </li>
          </ol>
        </section>

        {/* LANDSCAPE */}
        <section className="ma-section" id="landscape">
          <h2 className="ma-section-h">The competitive landscape.</h2>
          <p className="ma-lead">
            Every company using AI as a force multiplier for marketing &amp; advertising, globally,
            as of 2026.05. 175 verified, 21 categories, 7 regions, 46 tier-A leaders.
          </p>

          <div className="ma-landscape-stats">
            <div><span className="num">175</span><span className="lab">Companies tracked</span></div>
            <div><span className="num">21</span><span className="lab">Categories mapped</span></div>
            <div><span className="num">7</span><span className="lab">Regions covered</span></div>
            <div><span className="num">46</span><span className="lab">Tier-A leaders</span></div>
          </div>

          <p className="ma-landscape-tease">
            Profound at $1B valuation. Bluefish AI at $68M Series B. AirOps at $60M Series B. Adobe LLM Optimizer.
            HubSpot AEO. Plus the autonomous agents (Cassidy, 11x, Aomni, Clay), the AI video stack (Synthesia, HeyGen,
            Runway), the WhatsApp/LATAM commerce layer (Yellow.ai, Gupshup, Yalo), and the European pure-plays
            (Peec, Otterly, Promptwatch, ZipTie). Filter the field. Spot the gaps.
          </p>

          <Link href="/the-marketing-architect-landscape/" className="ma-cta-primary ma-cta-inline">
            Open the full landscape →
          </Link>
        </section>

        {/* DISCIPLINE */}
        <section className="ma-section" id="discipline">
          <h2 className="ma-section-h">The discipline.</h2>
          <p className="ma-lead">
            Three things make this product different from any other AI marketing tool you can buy in 2026.
          </p>

          <div className="ma-discipline-grid">
            <div className="ma-disc">
              <div className="ma-disc-num">01</div>
              <h4>Anti-fabrication, in the schema.</h4>
              <p>Every benchmark requires a <code>source_id</code>. Every metric requires a <code>source_kind</code> (platform-reported, claimed-by-brand, third-party-audited, observed-internal). No source, no row. The discipline is enforced by the database, not by human review.</p>
            </div>
            <div className="ma-disc">
              <div className="ma-disc-num">02</div>
              <h4>Taste over volume.</h4>
              <p>Our humor + word-of-mouth research found that Linear, Cursor, Lovable, Notion, and Slack all hit eight-figure ARR <em>without paid marketing</em>. Common pattern: opinionated brand voice in a register marketers haven&apos;t heard. We don&apos;t try to be funny. We try to be opinionated in a voice the buyer screenshots and DMs to a peer.</p>
            </div>
            <div className="ma-disc">
              <div className="ma-disc-num">03</div>
              <h4>The output becomes the moat.</h4>
              <p>Every paid teardown, with the customer&apos;s permission, becomes a public JSON-LD entity in the knowledge graph that AI agents retrieve and cite. The customer gets the strategy; the platform compounds. Service-led for cash, structured graph for moat.</p>
            </div>
          </div>
        </section>

        {/* LEGACY */}
        <section className="ma-section ma-legacy" id="legacy">
          <h2 className="ma-section-h">Why we&apos;re building this.</h2>
          <div className="ma-legacy-body">
            <p>
              My mother, <strong>Kathleen Dahlgren</strong>, spent her career making computational
              linguistics and natural language processing real before most people knew what they
              were. The machinery that lets you and an AI agent communicate at all — meaning,
              ambiguity, reference, intent — has her work in its lineage.
            </p>
            <p>
              My father, <strong>Dr. James Dahlgren, M.D.</strong>, spent his career as a
              toxicologist and expert witness, naming what chemical exposure does to human bodies in
              language that lawyers, juries, and clinicians could act on. Glyphosate. PCBs. Microplastics.
              The substances that quietly shape who lives well and who doesn&apos;t.
            </p>
            <p>
              The Marketing Architect, and every garden it lives next to, is what happens when you
              take both lineages seriously. Language and meaning, used at commercial scale, the
              moment machines became fluent enough to do something with it. And toxicology — the
              discipline of naming what&apos;s in the world precisely — applied to the questions
              consumers and brands ask in 2026: what&apos;s in this? Who can I trust? Where&apos;s
              the citation?
            </p>
            <p>
              The product makes money serving B2B founders. The thread that holds it all together is
              what makes it worth doing.
            </p>
          </div>
        </section>

        {/* TEAM + 30 DAY */}
        <section className="ma-section" id="team">
          <h2 className="ma-section-h">The team &amp; the 30 days.</h2>

          <div className="ma-team-grid">
            <div className="ma-member">
              <div className="ma-member-role">CTO · Design Authority</div>
              <h4>Charlie &quot;Chilly&quot; Dahlgren</h4>
              <p>Builds the product, writes the teardowns, ships the site, runs the AI ops. Founder voice on LinkedIn 4× / week.</p>
            </div>
            <div className="ma-member">
              <div className="ma-member-role">CEO · BD</div>
              <h4>John Bou</h4>
              <p>Built &amp; sold Modio Health (~$300M to CHG). KLAS #1 in credentialing two years running. Owns enterprise outbound; 5 warm conversations/week from the Modio network.</p>
            </div>
            <div className="ma-member">
              <div className="ma-member-role">DOMAIN EXPERT · TKG</div>
              <h4>Dr. James Dahlgren, M.D.</h4>
              <p>Envirotoxicology, expert-witness network. The authority layer beneath the toxin-free brand wedge.</p>
            </div>
            <div className="ma-member ma-member-new">
              <div className="ma-member-role">NEW · STARTING THIS WEEK</div>
              <h4>The new hire.</h4>
              <p>Pre-seeded with workspace access. Read this document first. <Link href="/onboarding/">Onboarding here</Link>.</p>
            </div>
          </div>

          <div className="ma-30day">
            <div className="ma-30day-eyebrow">30 DAYS · BY JUNE 10</div>
            <h3>What ships, what we measure.</h3>
            <div className="ma-30day-grid">
              <div>
                <h5>Ships</h5>
                <ul>
                  <li>Storefront with $249 / $1,499 / $8,000 SKU + Stripe</li>
                  <li>Three Campaign Teardowns produced + published</li>
                  <li>Team workspace live (auth-gated, Google OAuth)</li>
                  <li>10 outbound conversations on John&apos;s calendar</li>
                </ul>
              </div>
              <div>
                <h5>Measures</h5>
                <ul>
                  <li>$10K cumulative revenue</li>
                  <li>3 qualified enterprise conversations ($40K+ tier)</li>
                  <li>3 public teardowns indexed &amp; citable</li>
                  <li>1 signal of LLM pickup on a long-tail query</li>
                </ul>
              </div>
            </div>
            <p className="ma-30day-kill">
              <strong>Kill criterion:</strong> if we hit 0 of 4, the product is wrong, not the marketing. We rewrite the memo.
            </p>
          </div>
        </section>

        {/* BUY */}
        <section className="ma-section ma-buy-section" id="buy">
          <h2 className="ma-section-h">Get the memo.</h2>
          <p className="ma-lead">
            Three tiers. No usage metering, no seats. Storefront ships with Cycle 004 — until then, email Chilly directly and the first ten memos are hand-delivered by the founder.
          </p>

          <div className="ma-tier-grid">
            <div className="ma-tier">
              <div className="ma-tier-price">$249</div>
              <h4>Single Memo</h4>
              <p>One business, one recommendation memo, 24-hour turnaround. The wedge product.</p>
            </div>
            <div className="ma-tier ma-tier-feature">
              <div className="ma-tier-flag">Most chosen</div>
              <div className="ma-tier-price">$1,499</div>
              <h4>The Quarterly</h4>
              <p>One memo + two campaign teardowns of your choice + one market map for your audience + 45-min Loom from a human strategist. Refreshed quarterly. The fractional-CMO replacement.</p>
            </div>
            <div className="ma-tier">
              <div className="ma-tier-price">$8,000<span className="ma-tier-per">/quarter</span></div>
              <h4>The Embedded</h4>
              <p>Everything in The Quarterly + monthly memos + private Slack with a strategist (one-business-day response) + your brand becomes a published Architect entity. Capped at 30 customers, year one.</p>
            </div>
          </div>

          <div className="ma-buy-cta">
            <a href="mailto:chillyd@gmail.com?subject=The%20Marketing%20Architect%20%E2%80%94%20first%20memo" className="ma-cta-primary">
              Email Chilly to start →
            </a>
            <span className="ma-buy-aside">
              Stripe checkout ships with Cycle 004 (next week). Until then, founder-delivered.
            </span>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ma-footer">
          <div className="ma-footer-row">
            <div>
              <div className="ma-footer-brand">
                <span className="ma-nav-dot" />
                The Marketing Architect
              </div>
              <p className="ma-footer-tag">
                A product of <a href="https://theknowledgegardens.com">The Knowledge Gardens</a> · XR Workers · 2026
              </p>
            </div>
            <div className="ma-footer-links">
              <a href="#brief">The Brief</a>
              <Link href="/the-marketing-architect-landscape/">Landscape</Link>
              <Link href="/team-atlas/">Team atlas <span className="ma-archive-tag">(archive)</span></Link>
              <Link href="/competitive-landscape/">Cycle 002 atlas <span className="ma-archive-tag">(archive)</span></Link>
            </div>
            <div className="ma-footer-sister">
              <span className="ma-footer-sister-lab">Sister gardens</span>
              <div>
                <a href="https://orchids.theknowledgegardens.com">Orchid · OKG</a>
                <a href="https://builders.theknowledgegardens.com">Builders · BKG</a>
                <a href="https://health.theknowledgegardens.com">Health · HKG</a>
                <a href="https://toxicology.theknowledgegardens.com">Toxicology · TKG</a>
              </div>
            </div>
          </div>
          <div className="ma-footer-cat">
            CAT.NO MKG-2026-BRIEF-V1 · CYCLE 003 · 2026.05.10 · Pressed for Kathleen &amp; for Dr. Dahlgren
          </div>
        </footer>
      </main>
    </>
  );
}

const styles = `
.ma-page {
  --bg: #0a0a0b;
  --bg-2: #0f1011;
  --surface: #131416;
  --surface-2: #1a1c1f;
  --ink: #e8e8e8;
  --ink-soft: #b5b5b5;
  --ink-fade: #888888;
  --ink-dim: #5a5c61;
  --line: rgba(255,255,255,0.08);
  --line-strong: rgba(255,255,255,0.18);
  --accent: #00ffd1;
  --accent-soft: rgba(0,255,209,0.14);
  --accent-glow: rgba(0,255,209,0.35);

  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  line-height: 1.55;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.ma-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(900px 600px at 12% -10%, var(--accent-soft), transparent 50%),
    radial-gradient(800px 600px at 95% 18%, rgba(0,255,209,0.08), transparent 50%),
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: auto, auto, 64px 64px, 64px 64px;
  mask-image: linear-gradient(180deg, #000 0%, #000 70%, transparent 100%);
}

.ma-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 28px;
  background: rgba(10,10,11,0.75);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  flex-wrap: wrap;
}
.ma-nav-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.01em;
  color: var(--ink);
  text-decoration: none;
}
.ma-nav-dot {
  width: 9px; height: 9px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 12px var(--accent-glow);
  display: inline-block;
}
.ma-nav-links {
  display: flex;
  gap: 18px;
  margin-left: auto;
  align-items: center;
  flex-wrap: wrap;
}
.ma-nav-links a {
  font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--ink-fade);
  text-decoration: none;
  transition: color .15s;
}
.ma-nav-links a:hover { color: var(--accent); }
.ma-nav-cta {
  color: var(--accent) !important;
  border: 1px solid var(--accent);
  padding: 6px 12px;
  border-radius: 3px;
}
.ma-nav-cta:hover { background: var(--accent-soft); }
@media (max-width: 720px) {
  .ma-nav-links a:not(.ma-nav-cta) { display: none; }
}

.ma-hero, .ma-section, .ma-footer {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 28px;
}

.ma-hero { padding-top: 96px; padding-bottom: 56px; }

.ma-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-fade);
  margin-bottom: 28px;
}
.ma-eyebrow-dot {
  width: 8px; height: 8px;
  background: var(--accent);
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 10px var(--accent-glow);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.ma-hero-title {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 700;
  font-size: clamp(48px, 9vw, 104px);
  line-height: 0.95;
  letter-spacing: -0.035em;
  margin: 0 0 28px;
  color: var(--ink);
}

.ma-hero-tagline {
  font-size: clamp(18px, 2.4vw, 24px);
  line-height: 1.45;
  color: var(--ink-soft);
  max-width: 820px;
  margin: 0 0 36px;
}
.ma-mark {
  color: var(--accent);
  font-weight: 500;
}

.ma-hero-ctas {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 56px;
  flex-wrap: wrap;
}
.ma-cta-primary {
  display: inline-block;
  background: var(--accent);
  color: #001a16;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 14px 22px;
  text-decoration: none;
  border: 1px solid var(--accent);
  transition: box-shadow .2s, transform .15s;
}
.ma-cta-primary:hover {
  box-shadow: 0 0 24px var(--accent-glow);
  transform: translateY(-1px);
}
.ma-cta-primary.ma-cta-inline { margin-top: 24px; }
.ma-cta-secondary {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-decoration: none;
  border: 1px solid var(--line-strong);
  padding: 14px 22px;
  transition: border-color .15s, color .15s;
}
.ma-cta-secondary:hover { border-color: var(--accent); color: var(--accent); }

.ma-hero-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 32px;
  padding-top: 32px;
  border-top: 1px solid var(--line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}
@media (min-width: 760px) { .ma-hero-meta { grid-template-columns: repeat(4, 1fr); } }
.ma-hero-meta > div { display: flex; flex-direction: column; gap: 4px; }
.ma-hero-meta .lab { color: var(--ink-dim); letter-spacing: 0.16em; text-transform: uppercase; font-size: 10px; }
.ma-hero-meta .val { color: var(--ink); letter-spacing: 0.04em; }

.ma-section { padding: 64px 28px; border-top: 1px solid var(--line); }
.ma-section-h {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: -0.022em;
  line-height: 1.05;
  margin: 0 0 18px;
  color: var(--ink);
}
.ma-lead {
  font-size: 17px;
  line-height: 1.6;
  color: var(--ink-soft);
  max-width: 760px;
  margin: 0 0 32px;
}

.ma-quote {
  font-size: clamp(18px, 2.2vw, 22px);
  line-height: 1.55;
  color: var(--ink);
  max-width: 880px;
  margin: 0 0 14px;
  padding-left: 22px;
  border-left: 3px solid var(--accent);
}
.ma-quote-attr {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--ink-dim);
  text-transform: uppercase;
  padding-left: 22px;
}

/* IO grid */
.ma-io-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;
  margin-top: 14px;
}
@media (min-width: 900px) { .ma-io-grid { grid-template-columns: 1fr 1fr; gap: 28px; } }
.ma-io-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
}
.ma-card {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 18px 20px;
  margin-bottom: 12px;
  transition: border-color .15s, transform .15s;
}
.ma-card:hover { border-color: var(--line-strong); transform: translateY(-1px); }
.ma-card-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}
.ma-card p { font-size: 15px; color: var(--ink-soft); margin: 0; line-height: 1.55; }

/* Tracks (B2B / Consumer) */
.ma-track-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
}
@media (min-width: 900px) { .ma-track-grid { grid-template-columns: 1fr 1fr; } }
.ma-track {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 24px 26px;
  position: relative;
}
.ma-track-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}
.ma-track-h {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: -0.012em;
  margin: 0 0 12px;
  color: var(--ink);
}
.ma-track p { color: var(--ink-soft); font-size: 15px; line-height: 1.55; }
.ma-personas {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  border-top: 1px dashed var(--line);
  padding-top: 14px;
}
.ma-personas li {
  font-size: 14px;
  color: var(--ink-fade);
  padding: 5px 0;
}
.ma-personas li strong { color: var(--ink); font-weight: 600; }

.ma-freemium {
  margin-top: 22px;
  border: 1px solid var(--accent);
  background: var(--accent-soft);
  padding: 20px 22px;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  flex-wrap: wrap;
}
.ma-freemium-mark {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--accent);
  font-weight: 700;
  white-space: nowrap;
  padding-top: 2px;
}
.ma-freemium h4 { margin: 0 0 4px; font-size: 18px; color: var(--ink); font-family: 'Space Grotesk', sans-serif; }
.ma-freemium p { margin: 0; color: var(--ink-soft); font-size: 15px; }

.ma-not-for {
  margin-top: 26px;
  font-size: 14px;
  color: var(--ink-fade);
  border-top: 1px solid var(--line);
  padding-top: 16px;
}
.ma-not-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--accent);
  margin-right: 8px;
}

/* Wedge */
.ma-wedge-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
}
@media (min-width: 900px) { .ma-wedge-grid { grid-template-columns: 1fr 1fr; } }
.ma-wedge-card {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 26px 28px;
}
.ma-wedge-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}
.ma-wedge-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 22px;
  margin: 0 0 12px;
  color: var(--ink);
  letter-spacing: -0.012em;
}
.ma-wedge-card p { color: var(--ink-soft); font-size: 15px; line-height: 1.55; margin: 0 0 12px; }
.ma-wedge-why { color: var(--ink-fade) !important; font-size: 14px !important; border-left: 2px solid var(--accent); padding-left: 14px; }

/* Refusals */
.ma-refusals {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}
.ma-refusals li {
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 18px 22px;
}
.ma-ref-num {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: var(--accent);
  letter-spacing: -0.02em;
  line-height: 1;
}
.ma-refusals h4 { margin: 0 0 6px; font-size: 17px; color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
.ma-refusals p { margin: 0; color: var(--ink-soft); font-size: 14.5px; line-height: 1.55; }

/* Landscape */
.ma-landscape-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  border: 1px solid var(--line);
  margin: 14px 0 22px;
}
@media (min-width: 760px) { .ma-landscape-stats { grid-template-columns: repeat(4, 1fr); } }
.ma-landscape-stats > div {
  padding: 22px 18px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
@media (min-width: 760px) {
  .ma-landscape-stats > div { border-bottom: none; }
  .ma-landscape-stats > div:last-child { border-right: none; }
}
.ma-landscape-stats .num {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 38px;
  color: var(--accent);
  letter-spacing: -0.025em;
  line-height: 1;
}
.ma-landscape-stats .lab {
  display: block;
  margin-top: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-dim);
}
.ma-landscape-tease { color: var(--ink-soft); font-size: 15px; line-height: 1.6; margin: 0 0 8px; max-width: 880px; }

/* Discipline */
.ma-discipline-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
@media (min-width: 900px) { .ma-discipline-grid { grid-template-columns: repeat(3, 1fr); } }
.ma-disc { background: var(--surface); border: 1px solid var(--line); padding: 22px 22px; }
.ma-disc-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  color: var(--accent);
  margin-bottom: 10px;
}
.ma-disc h4 { margin: 0 0 8px; font-size: 17px; color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.01em; }
.ma-disc p { margin: 0; color: var(--ink-soft); font-size: 14.5px; line-height: 1.55; }
.ma-disc code { background: var(--bg-2); padding: 1px 6px; color: var(--accent); font-size: 13px; }

/* Legacy */
.ma-legacy { background: linear-gradient(180deg, transparent, rgba(0,255,209,0.025)); }
.ma-legacy-body { max-width: 760px; }
.ma-legacy-body p { color: var(--ink-soft); font-size: 17px; line-height: 1.7; margin: 0 0 18px; }
.ma-legacy-body strong { color: var(--ink); font-weight: 600; }

/* Team */
.ma-team-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 36px;
}
@media (min-width: 760px) { .ma-team-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .ma-team-grid { grid-template-columns: repeat(4, 1fr); } }
.ma-member { background: var(--surface); border: 1px solid var(--line); padding: 20px 20px; }
.ma-member-role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-dim);
  margin-bottom: 8px;
}
.ma-member h4 { margin: 0 0 8px; font-size: 18px; color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.012em; }
.ma-member p { margin: 0; color: var(--ink-soft); font-size: 14px; line-height: 1.5; }
.ma-member a { color: var(--accent); text-decoration: none; border-bottom: 1px dotted var(--accent); }
.ma-member-new { border-color: var(--accent); }

.ma-30day { background: var(--surface); border: 1px solid var(--line); padding: 26px 28px; }
.ma-30day-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}
.ma-30day h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 22px; margin: 0 0 16px; color: var(--ink); letter-spacing: -0.012em; }
.ma-30day-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
@media (min-width: 760px) { .ma-30day-grid { grid-template-columns: 1fr 1fr; } }
.ma-30day-grid h5 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 10px;
}
.ma-30day-grid ul { list-style: none; padding: 0; margin: 0; }
.ma-30day-grid li {
  padding: 6px 0 6px 18px;
  position: relative;
  color: var(--ink-soft);
  font-size: 14.5px;
  border-bottom: 1px dashed var(--line);
}
.ma-30day-grid li:before {
  content: "›";
  position: absolute;
  left: 0;
  color: var(--accent);
}
.ma-30day-kill {
  margin: 20px 0 0;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  color: var(--ink-fade);
  font-size: 14px;
}
.ma-30day-kill strong { color: var(--accent); }

/* Buy */
.ma-buy-section { background: linear-gradient(180deg, transparent, rgba(0,255,209,0.04)); }
.ma-tier-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  margin-bottom: 32px;
}
@media (min-width: 900px) { .ma-tier-grid { grid-template-columns: repeat(3, 1fr); } }
.ma-tier {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 26px 26px;
  position: relative;
}
.ma-tier-feature { border-color: var(--accent); box-shadow: 0 0 32px rgba(0,255,209,0.10); }
.ma-tier-flag {
  position: absolute;
  top: -10px;
  left: 22px;
  background: var(--accent);
  color: #001a16;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 4px 10px;
}
.ma-tier-price {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 44px;
  color: var(--ink);
  letter-spacing: -0.025em;
  line-height: 1;
}
.ma-tier-per { font-size: 16px; color: var(--ink-fade); font-weight: 400; margin-left: 4px; }
.ma-tier h4 { margin: 10px 0 12px; font-size: 20px; color: var(--ink); font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.012em; }
.ma-tier p { margin: 0; color: var(--ink-soft); font-size: 14.5px; line-height: 1.55; }
.ma-buy-cta { display: flex; gap: 18px; align-items: center; flex-wrap: wrap; }
.ma-buy-aside { color: var(--ink-fade); font-size: 13px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.06em; }

.ma-inline { color: var(--accent); border-bottom: 1px dotted var(--accent); text-decoration: none; }

/* Footer */
.ma-footer { padding: 56px 28px 40px; border-top: 1px solid var(--line); position: relative; z-index: 1; }
.ma-footer-row { display: grid; grid-template-columns: 1fr; gap: 24px; }
@media (min-width: 900px) { .ma-footer-row { grid-template-columns: 1.2fr 1fr 1.2fr; gap: 32px; } }
.ma-footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: var(--ink);
}
.ma-footer-tag { color: var(--ink-fade); font-size: 13px; margin: 10px 0 0; }
.ma-footer-tag a { color: var(--accent); text-decoration: none; }
.ma-footer-links { display: flex; flex-direction: column; gap: 8px; }
.ma-footer-links a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-decoration: none;
}
.ma-footer-links a:hover { color: var(--accent); }
.ma-archive-tag { color: var(--ink-dim); font-size: 9px; }
.ma-footer-sister-lab {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--ink-dim);
  margin-bottom: 8px;
}
.ma-footer-sister > div { display: flex; flex-direction: column; gap: 6px; }
.ma-footer-sister a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.10em;
  color: var(--ink-soft);
  text-decoration: none;
}
.ma-footer-sister a:hover { color: var(--accent); }
.ma-footer-cat {
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-dim);
}
`;
