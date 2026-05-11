import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getPostImages,
  getPostComments,
} from "@/lib/supabase/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addCommentAction, deletePostAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [images, comments] = await Promise.all([
    getPostImages(post.id),
    getPostComments(post.id),
  ]);

  // Get viewer
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const viewerId = user?.id ?? null;
  const isOwner = viewerId === post.author_id;

  const author = post.author;
  const authorName =
    author?.display_name ?? author?.email?.split("@")[0] ?? "Anonymous";
  const created = new Date(post.created_at);
  const dateLabel = created.toLocaleDateString(undefined, {
    month: "long", day: "numeric", year: "numeric",
  });
  const timeLabel = created.toLocaleTimeString(undefined, {
    hour: "numeric", minute: "2-digit",
  });

  return (
    <>
      <style>{styles}</style>

      <Link href="/workspace/posts" className="pd-back">← All posts</Link>

      <article className="pd-article">
        <div className="pd-head">
          {post.category && (
            <Link href={`/workspace/posts?category=${post.category.slug}`} className="pd-cat">
              {post.category.emoji ? `${post.category.emoji} ` : ""}{post.category.name}
            </Link>
          )}
          {post.is_pinned && <span className="pd-pin">★ PINNED</span>}
          <span className="pd-meta">{dateLabel} · {timeLabel}</span>
        </div>

        <h1 className="pd-title">{post.title}</h1>

        <div className="pd-byline">
          {author?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={author.avatar_url} alt="" className="pd-avatar" />
          ) : (
            <span className="pd-avatar pd-avatar-fallback">
              {authorName.charAt(0).toUpperCase()}
            </span>
          )}
          <span>{authorName}</span>
          {isOwner && (
            <form action={deletePostAction} className="pd-owner-actions">
              <input type="hidden" name="slug" value={post.slug} />
              <button type="submit" className="pd-delete">Delete</button>
            </form>
          )}
        </div>

        {post.body_md && (
          <div className="pd-body">
            {/* Plain markdown rendering — paragraphs only for now */}
            {post.body_md.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="pd-images">
            {images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={img.id} src={img.public_url} alt={img.caption ?? ""} className="pd-image" />
            ))}
          </div>
        )}
      </article>

      <section className="pd-comments">
        <h2>Discussion {comments.length > 0 ? `· ${comments.length}` : ""}</h2>

        {comments.length === 0 ? (
          <p className="pd-empty">No comments yet. Add the first thought.</p>
        ) : (
          <ul className="pd-comment-list">
            {comments.map((c) => {
              const cAuthor = c.author;
              const cName = cAuthor?.display_name ?? cAuthor?.email?.split("@")[0] ?? "Anonymous";
              const ts = new Date(c.created_at);
              return (
                <li key={c.id} className="pd-comment">
                  <div className="pd-comment-head">
                    {cAuthor?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cAuthor.avatar_url} alt="" className="pd-comment-avatar" />
                    ) : (
                      <span className="pd-comment-avatar pd-avatar-fallback">{cName.charAt(0).toUpperCase()}</span>
                    )}
                    <strong>{cName}</strong>
                    <span className="pd-comment-time">
                      {ts.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="pd-comment-body">
                    {c.body_md.split(/\n\n+/).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <form action={addCommentAction} className="pd-comment-form">
          <input type="hidden" name="slug" value={post.slug} />
          <textarea
            name="body_md"
            rows={4}
            required
            placeholder="Add to the thread. Disagree, sharpen, add a source."
            className="pd-comment-textarea"
          />
          <div className="pd-comment-actions">
            <button type="submit" className="pd-comment-submit">Post comment</button>
          </div>
        </form>
      </section>
    </>
  );
}

const styles = `
.pd-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 18px;
}
.pd-back:hover { color: #00ffd1; }

.pd-article { max-width: 760px; }
.pd-head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.pd-cat {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #00ffd1;
  font-weight: 700;
  padding: 3px 8px;
  background: rgba(0,255,209,0.10);
  border: 1px solid rgba(0,255,209,0.25);
  text-decoration: none;
}
.pd-cat:hover { background: rgba(0,255,209,0.18); }
.pd-pin {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  color: #ffd700;
  font-weight: 700;
}
.pd-meta {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #5a5c61;
  letter-spacing: 0.06em;
}
.pd-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 5vw, 44px);
  letter-spacing: -0.025em;
  line-height: 1.08;
  margin: 0 0 22px;
  color: #e8e8e8;
}
.pd-byline {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 26px;
  padding-bottom: 18px;
  border-bottom: 1px dashed rgba(255,255,255,0.08);
  font-size: 14px;
  color: #b5b5b5;
}
.pd-byline strong { color: #e8e8e8; }
.pd-avatar { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.18); }
.pd-avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,255,209,0.10);
  color: #00ffd1;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12px;
  font-weight: 700;
}
.pd-owner-actions { margin-left: auto; }
.pd-delete {
  background: transparent;
  border: 1px solid rgba(255,80,80,0.4);
  color: #ff9090;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 6px 10px;
  cursor: pointer;
}
.pd-delete:hover { background: rgba(255,80,80,0.10); }

.pd-body p { font-size: 16.5px; line-height: 1.7; color: #d8d8d8; margin: 0 0 16px; }

.pd-images { margin-top: 24px; display: grid; gap: 14px; }
.pd-image { width: 100%; border: 1px solid rgba(255,255,255,0.08); }

.pd-comments { max-width: 760px; margin-top: 56px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); }
.pd-comments h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.012em;
  margin: 0 0 18px;
}
.pd-empty { color: #888; font-size: 14px; margin: 0 0 18px; }
.pd-comment-list { list-style: none; padding: 0; margin: 0 0 24px; display: grid; gap: 14px; }
.pd-comment { background: #131416; border: 1px solid rgba(255,255,255,0.08); padding: 14px 16px; }
.pd-comment-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 13px; color: #b5b5b5; }
.pd-comment-avatar { width: 22px; height: 22px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.18); }
.pd-comment-time { color: #5a5c61; font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-left: auto; }
.pd-comment-body p { color: #d8d8d8; font-size: 14.5px; line-height: 1.55; margin: 0 0 8px; }
.pd-comment-body p:last-child { margin-bottom: 0; }

.pd-comment-form { display: flex; flex-direction: column; gap: 12px; }
.pd-comment-textarea {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.18);
  color: #e8e8e8;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13.5px;
  padding: 12px 14px;
  resize: vertical;
  line-height: 1.5;
  min-height: 88px;
}
.pd-comment-textarea:focus { outline: none; border-color: #00ffd1; }
.pd-comment-actions { display: flex; justify-content: flex-end; }
.pd-comment-submit {
  background: #00ffd1;
  color: #001a16;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 10px 16px;
  border: 1px solid #00ffd1;
  cursor: pointer;
  transition: box-shadow .2s, transform .15s;
}
.pd-comment-submit:hover { box-shadow: 0 0 24px rgba(0,255,209,0.45); transform: translateY(-1px); }
`;
