import Link from "next/link";
import { getCategories } from "@/lib/supabase/queries";
import { createPostAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const categories = await getCategories();
  const preselected = sp.category;

  return (
    <>
      <style>{styles}</style>

      <div className="np-head">
        <Link href="/workspace/posts" className="np-back">← All posts</Link>
        <div className="np-eyebrow">NEW POST · IDEA · QUESTION</div>
        <h1>Write it down.</h1>
        <p>
          Markdown supported. Drag in images. Drop links one per line. The team sees it.
          No one outside the workspace does.
        </p>
      </div>

      {sp.err && (
        <div className="np-err">
          {sp.err === "missing_title"
            ? "A title is required."
            : `Error: ${decodeURIComponent(sp.err)}`}
        </div>
      )}

      <form action={createPostAction} className="np-form" encType="multipart/form-data">
        <label className="np-field">
          <span className="np-label">Title</span>
          <input
            type="text"
            name="title"
            required
            maxLength={200}
            placeholder="A short, opinionated headline"
            className="np-input"
            autoFocus
          />
        </label>

        <label className="np-field">
          <span className="np-label">Category</span>
          <select name="category_id" className="np-select" defaultValue={preselected ? categories.find(c => c.slug === preselected)?.id ?? "" : ""}>
            <option value="">— pick a category —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji ? `${c.emoji} ` : ""}{c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="np-field">
          <span className="np-label">Body</span>
          <textarea
            name="body_md"
            rows={12}
            placeholder="Markdown welcome. Think out loud. Include numbers and sources where you can — anti-fabrication discipline applies even in the workspace."
            className="np-textarea"
          />
          <span className="np-hint">Tip: paragraphs separated by blank lines, **bold**, *italic*, `code`, [links](https://…), and lists with - or 1. all work.</span>
        </label>

        <label className="np-field">
          <span className="np-label">Links (one URL per line)</span>
          <textarea
            name="links"
            rows={3}
            placeholder="https://example.com/article&#10;https://other.com/study"
            className="np-textarea np-textarea-small"
          />
        </label>

        <label className="np-field">
          <span className="np-label">Media (images + short videos, multi-select)</span>
          <input
            type="file"
            name="images"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime"
            className="np-file"
          />
          <span className="np-hint">Max 100 MB per file. PNG / JPEG / WebP / GIF / SVG · MP4 / WebM / MOV.</span>
        </label>

        <div className="np-actions">
          <Link href="/workspace/posts" className="np-cancel">Cancel</Link>
          <button type="submit" className="np-submit">Publish to workspace →</button>
        </div>
      </form>
    </>
  );
}

const styles = `
.np-head { margin-bottom: 28px; }
.np-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  margin-bottom: 14px;
  display: inline-block;
}
.np-back:hover { color: #00ffd1; }
.np-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 10px;
}
.np-head h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.025em;
  line-height: 1.05;
  margin: 0 0 12px;
}
.np-head p { color: #b5b5b5; font-size: 15px; line-height: 1.55; max-width: 640px; margin: 0; }

.np-err {
  background: rgba(255,80,80,0.08);
  border: 1px solid rgba(255,80,80,0.4);
  color: #ff9090;
  padding: 12px 16px;
  margin-bottom: 18px;
  font-size: 14px;
}

.np-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 760px;
}
.np-field { display: flex; flex-direction: column; gap: 8px; }
.np-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #00ffd1;
  font-weight: 700;
}
.np-input, .np-select, .np-textarea {
  background: #131416;
  border: 1px solid rgba(255,255,255,0.18);
  color: #e8e8e8;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  padding: 11px 14px;
  transition: border-color .15s;
}
.np-input:focus, .np-select:focus, .np-textarea:focus {
  outline: none;
  border-color: #00ffd1;
  box-shadow: 0 0 0 3px rgba(0,255,209,0.10);
}
.np-textarea { resize: vertical; min-height: 80px; line-height: 1.5; font-family: 'JetBrains Mono', monospace; font-size: 14px; }
.np-textarea-small { min-height: 64px; }
.np-select { cursor: pointer; }
.np-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: #5a5c61;
}
.np-file {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #b5b5b5;
  padding: 12px;
  background: #131416;
  border: 1px dashed rgba(255,255,255,0.25);
  cursor: pointer;
}

.np-actions {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
}
.np-submit {
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
.np-submit:hover { box-shadow: 0 0 24px rgba(0,255,209,0.45); transform: translateY(-1px); }
.np-cancel {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b5b5b5;
  text-decoration: none;
  padding: 13px 18px;
  border: 1px solid rgba(255,255,255,0.18);
}
.np-cancel:hover { color: #00ffd1; border-color: #00ffd1; }
`;
