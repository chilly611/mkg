"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createPostAction } from "./actions";
import type { Category } from "@/lib/supabase/queries";

type UploadedMedia = {
  storage_path: string;
  filename: string;
  mime_type: string;
  file_size_bytes: number;
};

type Props = {
  categories: Category[];
  preselectedCategorySlug?: string;
};

/**
 * Client-side post creation form with direct-to-storage media upload.
 *
 * Why client-side upload (not server action multipart):
 *   Server actions inherit Vercel's request body cap (~4.5 MB on Hobby plan).
 *   Anything bigger than a small image fails the action before it runs.
 *   Uploading directly from the browser to Supabase Storage bypasses this
 *   entirely — the server action only handles small metadata.
 *
 * Pipeline:
 *   1. User picks files + fills the form.
 *   2. Submit → for each file, browser uploads to Supabase Storage at
 *      `{user_id}/{timestamp}-{safe_name}`. Bucket RLS allows writes for
 *      authenticated whitelisted users.
 *   3. After all uploads succeed (or fail individually), we serialize the
 *      metadata into a hidden JSON field and submit the rest of the form
 *      to the server action.
 *   4. Server action inserts post + post_images rows + redirects.
 */
export function PostForm({ categories, preselectedCategorySlug }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  const preselectedId = preselectedCategorySlug
    ? categories.find((c) => c.slug === preselectedCategorySlug)?.id ?? ""
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setErr(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = String(formData.get("title") ?? "").trim();
    if (!title) {
      setErr("A title is required.");
      setSubmitting(false);
      return;
    }

    // Pull files out of the form before passing to the server action.
    const files = formData.getAll("media_files") as File[];
    formData.delete("media_files");

    // Direct upload to Supabase Storage.
    const uploaded: UploadedMedia[] = [];
    if (files.length > 0) {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setErr("Session expired. Refresh and sign in again.");
        setSubmitting(false);
        return;
      }

      let idx = 0;
      for (const file of files) {
        idx += 1;
        if (!file || typeof file === "string") continue;
        if (file.size === 0) continue;
        if (file.size > 100 * 1024 * 1024) {
          setErr(`"${file.name}" is over 100 MB. Trim it or split into a follow-up.`);
          setSubmitting(false);
          return;
        }
        setProgress(`Uploading ${idx} of ${files.length}: ${file.name}…`);
        const safeName = (file.name || "media").replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${user.id}/${Date.now()}-${idx}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("post-images")
          .upload(path, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });
        if (upErr) {
          setErr(`Upload failed for "${file.name}": ${upErr.message}`);
          setSubmitting(false);
          return;
        }
        uploaded.push({
          storage_path: path,
          filename: safeName,
          mime_type: file.type || "application/octet-stream",
          file_size_bytes: file.size,
        });
      }
    }

    setProgress("Publishing post…");
    formData.set("media_json", JSON.stringify(uploaded));

    try {
      // Invoke the server action with the metadata-only form data.
      await createPostAction(formData);
      // createPostAction calls redirect() at the end — on success, the
      // browser navigates away before we reach this point. If we DO get
      // here, it returned without redirecting → something failed silently.
      router.refresh();
    } catch (e: unknown) {
      // NEXT_REDIRECT is a thrown signal — the navigation will follow.
      // Anything else is a real error.
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("NEXT_REDIRECT")) return; // expected
      setErr(`Submit failed: ${msg}`);
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="np-head">
        <Link href="/workspace/posts" className="np-back">← All posts</Link>
        <div className="np-eyebrow">NEW POST · IDEA · QUESTION</div>
        <h1>Write it down.</h1>
        <p>
          Markdown supported. Drop in images or short videos (MP4 / WebM / MOV).
          Links one per line. The team sees it. No one outside the workspace does.
        </p>
      </div>

      {err && <div className="np-err">{err}</div>}

      <form onSubmit={handleSubmit} className="np-form">
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
          <select name="category_id" className="np-select" defaultValue={preselectedId}>
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
            name="media_files"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime"
            className="np-file"
            disabled={submitting}
          />
          <span className="np-hint">Max 100 MB per file. PNG / JPEG / WebP / GIF / SVG · MP4 / WebM / MOV. Files upload directly to storage; the post submits when uploads finish.</span>
        </label>

        {submitting && (
          <div className="np-progress">
            <span className="np-progress-dot" />
            {progress || "Working…"}
          </div>
        )}

        <div className="np-actions">
          <Link href="/workspace/posts" className="np-cancel">Cancel</Link>
          <button type="submit" disabled={submitting} className="np-submit">
            {submitting ? "Publishing…" : "Publish to workspace →"}
          </button>
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
  white-space: pre-wrap;
}

.np-form { display: flex; flex-direction: column; gap: 22px; max-width: 760px; }
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
  line-height: 1.5;
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
.np-file:disabled { opacity: 0.5; cursor: not-allowed; }

.np-progress {
  background: rgba(0,255,209,0.06);
  border: 1px solid rgba(0,255,209,0.25);
  color: #b5b5b5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 12px 14px;
  display: flex; align-items: center; gap: 10px;
}
.np-progress-dot {
  width: 8px; height: 8px;
  background: #00ffd1; border-radius: 50%;
  animation: np-pulse 1.4s ease-in-out infinite;
  box-shadow: 0 0 12px rgba(0,255,209,0.55);
}
@keyframes np-pulse { 0%,100%{opacity:1;}50%{opacity:0.35;} }

.np-actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-top: 8px; }
.np-submit {
  background: #00ffd1; color: #001a16;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700;
  padding: 13px 22px; border: 1px solid #00ffd1; cursor: pointer;
  transition: box-shadow .2s, transform .15s;
}
.np-submit:disabled { opacity: 0.6; cursor: wait; }
.np-submit:hover:not(:disabled) { box-shadow: 0 0 24px rgba(0,255,209,0.45); transform: translateY(-1px); }
.np-cancel {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
  color: #b5b5b5; text-decoration: none;
  padding: 13px 18px; border: 1px solid rgba(255,255,255,0.18);
}
.np-cancel:hover { color: #00ffd1; border-color: #00ffd1; }
`;
