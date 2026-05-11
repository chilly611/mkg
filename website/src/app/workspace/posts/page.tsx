import Link from "next/link";
import { getRecentPosts, getCategories } from "@/lib/supabase/queries";
import { PostCard } from "@/components/post-card";

export const dynamic = "force-dynamic";

export default async function PostsFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const categorySlug = sp.category;

  const [posts, categories] = await Promise.all([
    getRecentPosts({ categorySlug, limit: 60 }),
    getCategories(),
  ]);
  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug) ?? null
    : null;

  return (
    <>
      <style>{styles}</style>

      <div className="pf-head">
        <div className="pf-eyebrow">
          POSTS &amp; IDEAS {activeCategory ? `· ${activeCategory.name.toUpperCase()}` : ""}
        </div>
        <div className="pf-title-row">
          <h1>{activeCategory ? activeCategory.name : "Everything the team is thinking about."}</h1>
          <Link href="/workspace/posts/new" className="pf-cta-new">+ New post</Link>
        </div>
        {activeCategory?.description && (
          <p className="pf-sub">{activeCategory.description}</p>
        )}
        {!activeCategory && (
          <p className="pf-sub">
            Chronological. Newest at top. Pinned posts surface above. Click any card to read,
            comment, or argue.
          </p>
        )}
      </div>

      <nav className="pf-chips" aria-label="Filter by category">
        <Link
          href="/workspace/posts"
          className={`pf-chip ${!activeCategory ? "pf-chip-active" : ""}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/workspace/posts?category=${c.slug}`}
            className={`pf-chip ${activeCategory?.id === c.id ? "pf-chip-active" : ""}`}
          >
            {c.emoji ? `${c.emoji} ` : ""}{c.name}
          </Link>
        ))}
      </nav>

      {posts.length === 0 ? (
        <div className="pf-empty">
          <div className="pf-empty-eyebrow">NO POSTS YET</div>
          <h3>
            {activeCategory
              ? `Nothing in "${activeCategory.name}" yet. You could be first.`
              : "Empty room. Write the first post."}
          </h3>
          <p>The workspace is private — only the team sees this. Be honest. No need to perform.</p>
          <Link href="/workspace/posts/new" className="pf-cta-new">+ Start a post</Link>
        </div>
      ) : (
        <div className="pf-grid">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </>
  );
}

const styles = `
.pf-head { margin-bottom: 26px; }
.pf-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 12px;
}
.pf-title-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}
.pf-title-row h1 {
  flex: 1;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0;
}
.pf-sub { color: #b5b5b5; font-size: 15px; line-height: 1.55; margin: 12px 0 0; max-width: 700px; }
.pf-cta-new {
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
  transition: box-shadow .2s, transform .15s;
  white-space: nowrap;
}
.pf-cta-new:hover { box-shadow: 0 0 24px rgba(0,255,209,0.45); transform: translateY(-1px); }

.pf-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 28px 0 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.pf-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  padding: 6px 12px;
  border: 1px solid rgba(255,255,255,0.18);
  background: transparent;
  transition: color .15s, border-color .15s, background .15s;
}
.pf-chip:hover { color: #00ffd1; border-color: rgba(0,255,209,0.4); }
.pf-chip-active {
  color: #001a16;
  background: #00ffd1;
  border-color: #00ffd1;
}
.pf-chip-active:hover { color: #001a16; }

.pf-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 760px) { .pf-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1200px) { .pf-grid { grid-template-columns: 1fr 1fr 1fr; } }

.pf-empty {
  border: 1px dashed rgba(255,255,255,0.18);
  padding: 36px 28px;
  text-align: center;
  background: rgba(0,255,209,0.02);
}
.pf-empty-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.20em;
  color: #5a5c61;
  margin-bottom: 12px;
}
.pf-empty h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.015em;
  margin: 0 0 10px;
  color: #e8e8e8;
}
.pf-empty p { color: #b5b5b5; font-size: 14.5px; margin: 0 auto 20px; max-width: 540px; }
`;
