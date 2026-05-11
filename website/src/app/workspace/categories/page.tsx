import Link from "next/link";
import { getCategories, getCategoryPostCounts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([
    getCategories(),
    getCategoryPostCounts(),
  ]);

  return (
    <>
      <style>{styles}</style>

      <div className="cat-head">
        <div className="cat-eyebrow">CATEGORIES · 8 SEEDED · EDITABLE</div>
        <h1>Where ideas live by topic.</h1>
        <p>
          Each post belongs to one category. Click in to see the running thread, or just use the chips
          above the feed. We pre-seeded eight; we&apos;ll add or rename them as the conversation reveals
          what we&apos;re actually thinking about.
        </p>
      </div>

      <div className="cat-grid">
        {categories.map((c) => {
          const count = counts[c.id] ?? 0;
          return (
            <Link key={c.id} href={`/workspace/posts?category=${c.slug}`} className="cat-card">
              <div className="cat-card-head">
                <span className="cat-emoji">{c.emoji ?? "•"}</span>
                <span className="cat-count">{count} {count === 1 ? "post" : "posts"}</span>
              </div>
              <h3>{c.name}</h3>
              {c.description && <p>{c.description}</p>}
              <span className="cat-cta">Open feed →</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

const styles = `
.cat-head { margin-bottom: 36px; max-width: 760px; }
.cat-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 12px;
}
.cat-head h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0 0 12px;
}
.cat-head p { color: #b5b5b5; font-size: 15px; line-height: 1.55; margin: 0; }

.cat-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 700px) { .cat-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1100px) { .cat-grid { grid-template-columns: 1fr 1fr 1fr; } }

.cat-card {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 20px 22px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color .15s, transform .15s, box-shadow .15s;
}
.cat-card:hover {
  border-color: rgba(0,255,209,0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 24px rgba(0,255,209,0.06);
}
.cat-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.cat-emoji { font-size: 22px; line-height: 1; }
.cat-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5a5c61;
}
.cat-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.012em;
  margin: 0;
}
.cat-card p { color: #b5b5b5; font-size: 13.5px; line-height: 1.5; margin: 0; flex: 1; }
.cat-cta {
  margin-top: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #00ffd1;
  font-weight: 700;
}
`;
