import Link from "next/link";
import type { Post } from "@/lib/supabase/queries";

/**
 * PostCard — used in the feed and in category-filtered lists.
 * Shows title, category, author, timestamp, body preview.
 */
export function PostCard({ post }: { post: Post }) {
  const author = post.author;
  const authorName =
    author?.display_name ?? author?.email?.split("@")[0] ?? "Anonymous";
  const created = new Date(post.created_at);
  const dateLabel = created.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: created.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
  const timeLabel = created.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const body = (post.body_md ?? "").trim();
  const preview =
    body.length > 280 ? body.slice(0, 280).trimEnd() + "…" : body;

  return (
    <Link href={`/workspace/posts/${post.slug}`} className="pc-card">
      <div className="pc-head">
        {post.category && (
          <span className="pc-cat">
            {post.category.emoji ? `${post.category.emoji} ` : ""}
            {post.category.name}
          </span>
        )}
        {post.is_pinned && <span className="pc-pin">★ PINNED</span>}
        <span className="pc-meta">{dateLabel} · {timeLabel}</span>
      </div>
      <h3 className="pc-title">{post.title}</h3>
      {preview && <p className="pc-preview">{preview}</p>}
      <div className="pc-foot">
        {author?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={author.avatar_url} alt="" className="pc-avatar" />
        ) : (
          <span className="pc-avatar pc-avatar-fallback">
            {authorName.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="pc-author">{authorName}</span>
      </div>

      <style>{styles}</style>
    </Link>
  );
}

const styles = `
.pc-card {
  display: block;
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 18px 20px 14px;
  text-decoration: none;
  color: inherit;
  transition: border-color .15s, transform .15s, box-shadow .15s;
}
.pc-card:hover {
  border-color: rgba(0,255,209,0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 24px rgba(0,255,209,0.06);
}
.pc-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.pc-cat {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #00ffd1;
  font-weight: 700;
  padding: 3px 8px;
  background: rgba(0,255,209,0.10);
  border: 1px solid rgba(0,255,209,0.25);
}
.pc-pin {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  color: #ffd700;
  font-weight: 700;
}
.pc-meta {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: #5a5c61;
  letter-spacing: 0.06em;
}
.pc-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.015em;
  margin: 0 0 8px;
  color: #e8e8e8;
  line-height: 1.2;
}
.pc-preview {
  font-size: 14px;
  line-height: 1.5;
  color: #b5b5b5;
  margin: 0 0 12px;
}
.pc-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed rgba(255,255,255,0.08);
}
.pc-avatar { width: 22px; height: 22px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.18); }
.pc-avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,255,209,0.10);
  color: #00ffd1;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 11px;
  font-weight: 700;
}
.pc-author { font-size: 12.5px; color: #b5b5b5; }
`;
