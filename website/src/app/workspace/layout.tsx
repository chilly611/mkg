import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware should already have redirected if no user, but belt + braces.
  const email = user?.email ?? null;
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    email ??
    "Friend";
  const avatar = (user?.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <>
      <style>{styles}</style>
      <div className="ws-root">
        <aside className="ws-sidebar">
          <Link href="/workspace" className="ws-brand">
            <span className="ws-dot" />
            <div>
              <div className="ws-brand-name">The Marketing Architect</div>
              <div className="ws-brand-sub">Workspace · private</div>
            </div>
          </Link>

          <nav className="ws-nav" aria-label="Workspace navigation">
            <Link href="/workspace">Overview</Link>
            <div className="ws-nav-group">CRM</div>
            <Link href="/workspace/accounts">Accounts</Link>
            <Link href="/workspace/pipeline">Pipeline</Link>
            <Link href="/workspace/teardowns">Teardowns</Link>
            <div className="ws-nav-group">Thinking</div>
            <Link href="/workspace/posts">Posts &amp; ideas</Link>
            <Link href="/workspace/categories">Categories</Link>
            <Link href="/workspace/research">Research · Claude</Link>
          </nav>

          <div className="ws-footer">
            <div className="ws-user">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="ws-avatar" />
              ) : (
                <span className="ws-avatar ws-avatar-fallback">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="ws-user-meta">
                <div className="ws-user-name">{displayName}</div>
                <div className="ws-user-email">{email}</div>
              </div>
            </div>
            <form action="/auth/signout" method="POST">
              <button type="submit" className="ws-signout">
                Sign out
              </button>
            </form>
            <div className="ws-public-link">
              <Link href="/">← Public brief</Link>
            </div>
          </div>
        </aside>

        <main className="ws-main">{children}</main>
      </div>
    </>
  );
}

const styles = `
.ws-root {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  background: #0a0a0b;
  color: #e8e8e8;
  font-family: 'Inter', sans-serif;
}
@media (min-width: 860px) {
  .ws-root { grid-template-columns: 260px 1fr; }
}
.ws-sidebar {
  border-right: 1px solid rgba(255,255,255,0.08);
  background: #0d0e10;
  display: flex;
  flex-direction: column;
  padding: 20px 18px;
}
.ws-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.ws-dot {
  width: 11px; height: 11px; border-radius: 50%; background: #00ffd1;
  box-shadow: 0 0 14px rgba(0,255,209,0.55);
  flex: 0 0 11px;
}
.ws-brand-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 14.5px;
  letter-spacing: -0.012em;
  line-height: 1.1;
}
.ws-brand-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5a5c61;
  margin-top: 4px;
}
.ws-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.ws-nav a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  text-decoration: none;
  color: #b5b5b5;
  padding: 9px 12px;
  border-left: 2px solid transparent;
  transition: color .15s, border-color .15s, background .15s;
}
.ws-nav a:hover {
  color: #00ffd1;
  border-left-color: #00ffd1;
  background: rgba(0,255,209,0.04);
}
.ws-nav-group {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5a5c61;
  padding: 14px 12px 4px;
  font-weight: 700;
}
.ws-footer {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.ws-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.ws-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.18);
}
.ws-avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #131416;
  color: #00ffd1;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
}
.ws-user-meta { min-width: 0; }
.ws-user-name {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 160px;
}
.ws-user-email {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  color: #5a5c61;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 160px;
}
.ws-signout {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.18);
  color: #b5b5b5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 8px 12px;
  cursor: pointer;
  width: 100%;
  transition: border-color .15s, color .15s;
}
.ws-signout:hover { border-color: #00ffd1; color: #00ffd1; }
.ws-public-link {
  margin-top: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.ws-public-link a { color: #5a5c61; text-decoration: none; }
.ws-public-link a:hover { color: #00ffd1; }

.ws-main {
  padding: 36px clamp(20px, 4vw, 56px);
  min-width: 0;
}
`;
