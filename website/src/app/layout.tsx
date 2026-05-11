import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://marketing.theknowledgegardens.com"),
  title: {
    default: "Marketing Knowledge Garden — The ground truth marketing AI cites",
    template: "%s · Marketing Knowledge Garden",
  },
  description:
    "The canonical, AI-citable knowledge graph of marketing in the agentic era. A vertical of The Knowledge Gardens.",
  keywords: [
    "GEO",
    "AEO",
    "AI search",
    "AI marketing",
    "brand visibility",
    "ChatGPT citations",
    "Perplexity",
    "Gemini",
    "answer engine optimization",
    "generative engine optimization",
    "Marketing Knowledge Garden",
    "The Knowledge Gardens",
  ],
  authors: [{ name: "The Knowledge Gardens" }],
  openGraph: {
    title: "Marketing Knowledge Garden",
    description:
      "The canonical, AI-citable knowledge graph of marketing in the agentic era.",
    url: "https://marketing.theknowledgegardens.com",
    siteName: "Marketing Knowledge Garden",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketing Knowledge Garden",
    description:
      "The canonical, AI-citable knowledge graph of marketing in the agentic era.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Space+Mono:wght@400;700&display=swap"
        />
        {/* JSON-LD: umbrella organization (per L-MKG-001) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Marketing Knowledge Garden",
              url: "https://marketing.theknowledgegardens.com",
              parentOrganization: {
                "@type": "Organization",
                name: "The Knowledge Gardens",
                url: "https://theknowledgegardens.com",
              },
              description:
                "The canonical, AI-citable knowledge graph of marketing in the agentic era.",
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
