"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function SignInInner() {
  const searchParams = useSearchParams();
  const errParam = searchParams.get("err");
  const nextParam = searchParams.get("next");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(
    errParam === "not_allowed"
      ? "That Google account isn't on the workspace allowlist. Ask Chilly to add you."
      : null
  );

  async function signInWithGoogle() {
    setLoading(true);
    setErr(null);
    const supabase = createSupabaseBrowserClient();
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://marketing.theknowledgegardens.com";
    const redirectTo = `${origin}/auth/callback${
      nextParam ? `?next=${encodeURIComponent(nextParam)}` : ""
    }`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) {
      setErr(error.message);
      setLoading(false);
    }
    // On success, Supabase navigates the browser away — no further work.
  }

  return (
    <>
      <style>{styles}</style>
      <main className="signin-page">
        <div className="signin-bg" aria-hidden="true" />
        <div className="signin-card">
          <div className="signin-eyebrow">
            <span className="signin-dot" />
            WORKSPACE · TEAM ONLY
          </div>
          <h1>The Marketing Architect</h1>
          <p className="signin-sub">
            Sign in with your Google account. Workspace access is currently
            limited to the team allowlist.
          </p>

          <button
            className="signin-btn"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            <span className="signin-g">G</span>
            {loading ? "Redirecting…" : "Continue with Google"}
          </button>

          {err && <div className="signin-err">{err}</div>}

          <div className="signin-foot">
            Not on the team?{" "}
            <a href="/">Read the public brief instead →</a>
          </div>
        </div>
      </main>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}

const styles = `
.signin-page {
  min-height: 100vh;
  background: #0a0a0b;
  color: #e8e8e8;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 22px;
  position: relative;
  overflow: hidden;
}
.signin-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(700px 500px at 50% -10%, rgba(0,255,209,0.14), transparent 60%),
    radial-gradient(500px 400px at 50% 110%, rgba(0,255,209,0.08), transparent 60%),
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: auto, auto, 64px 64px, 64px 64px;
  pointer-events: none;
  z-index: 0;
}
.signin-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: #131416;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 36px 32px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6);
}
.signin-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #888;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
}
.signin-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #00ffd1;
  box-shadow: 0 0 12px rgba(0,255,209,0.55);
}
.signin-card h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 32px;
  letter-spacing: -0.025em;
  margin: 0 0 12px;
  line-height: 1.1;
}
.signin-sub { color: #b5b5b5; font-size: 14.5px; line-height: 1.55; margin: 0 0 28px; }
.signin-btn {
  width: 100%;
  background: #00ffd1;
  color: #001a16;
  border: 1px solid #00ffd1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 14px 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: box-shadow .2s, transform .15s;
}
.signin-btn:hover:not(:disabled) {
  box-shadow: 0 0 24px rgba(0,255,209,0.45);
  transform: translateY(-1px);
}
.signin-btn:disabled { opacity: 0.6; cursor: wait; }
.signin-g {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px; height: 22px;
  background: #fff;
  color: #4285f4;
  border-radius: 50%;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 14px;
}
.signin-err {
  margin-top: 16px;
  padding: 10px 14px;
  border: 1px solid rgba(255,80,80,0.5);
  background: rgba(255,80,80,0.08);
  color: #ff9090;
  font-size: 13.5px;
  line-height: 1.45;
}
.signin-foot {
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 13px;
  color: #888;
}
.signin-foot a {
  color: #00ffd1;
  text-decoration: none;
}
.signin-foot a:hover { text-decoration: underline; }
`;
