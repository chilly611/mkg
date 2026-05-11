import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "80px 48px 96px",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        style={{
          height: 3,
          background:
            "linear-gradient(90deg, var(--teal) 0%, var(--copper) 60%, transparent 100%)",
          marginBottom: 24,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <span
          style={{
            width: 38,
            height: 38,
            border: "1px solid var(--ink)",
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display-italic)",
            fontStyle: "italic",
            fontSize: 22,
            color: "var(--teal)",
            fontWeight: 600,
          }}
        >
          M
        </span>
        <span className="tech tech-label">
          The Knowledge Gardens · Marketing Vertical
        </span>
      </div>

      <h1
        style={{
          fontSize: 64,
          lineHeight: 1.02,
          letterSpacing: "-0.025em",
          margin: 0,
          color: "var(--ink)",
        }}
      >
        Marketing &amp; the{" "}
        <span className="emphasis-italic" style={{ fontSize: "1em", color: "var(--teal)" }}>
          agentic era
        </span>
        .
      </h1>

      <p
        style={{
          marginTop: 18,
          maxWidth: 760,
          fontSize: 19,
          lineHeight: 1.5,
          color: "var(--ink-light)",
        }}
      >
        The canonical, AI-citable knowledge graph of how marketing actually
        works in the agentic era. A new vertical of{" "}
        <a href="https://theknowledgegardens.com">The Knowledge Gardens</a>.
      </p>

      <div
        style={{
          marginTop: 32,
          padding: "20px 22px",
          border: "1px solid var(--ink)",
          background: "var(--cream)",
          maxWidth: 720,
        }}
      >
        <span className="tech tech-label" style={{ color: "var(--copper)" }}>
          Cycle 001 · Specimen Atlas
        </span>
        <h2
          style={{
            fontSize: 28,
            margin: "8px 0 8px",
            letterSpacing: "-0.012em",
          }}
        >
          The GEO/AEO competitive landscape.
        </h2>
        <p style={{ margin: "0 0 16px", color: "var(--ink-light)" }}>
          40 verified platforms across the Generative Engine Optimization and
          Answer Engine Optimization wedge. Funding, pricing, primary buyer,
          primary citation. JSON-LD on every entity for AI agents.
        </p>
        <Link
          href="/competitive-landscape/"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            background: "var(--teal)",
            color: "var(--cream)",
            border: "1px solid var(--teal-dark)",
            fontFamily: "var(--font-tech)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Open the landscape →
        </Link>
      </div>

      <p
        className="tech tech-label"
        style={{ marginTop: 64, color: "var(--steel)" }}
      >
        Pressed at The Knowledge Gardens · Cycle 001 · 2026-05-09
      </p>
    </main>
  );
}
