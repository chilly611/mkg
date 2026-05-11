import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://marketing.theknowledgegardens.com"),
  title: {
    default: "The Marketing Architect — the three things to do, the seven to ignore",
    template: "%s · The Marketing Architect",
  },
  description:
    "A productized service that reads your business and tells you the three plays to run, the seven to refuse, and exactly who else is fighting for your buyer's attention — with a citation behind every claim. A product of The Knowledge Gardens.",
  keywords: [
    "The Marketing Architect",
    "Marketing Architect",
    "AI marketing strategy",
    "AI marketing landscape",
    "campaign teardown",
    "GEO",
    "AEO",
    "AI search visibility",
    "fractional CMO alternative",
    "marketing memo",
    "The Knowledge Gardens",
    "Marketing Knowledge Garden",
    "vertical B2B marketing",
    "toxin-free brand strategy",
    "consumer brand AI",
  ],
  authors: [{ name: "The Knowledge Gardens" }],
  openGraph: {
    title: "The Marketing Architect",
    description:
      "Three things to do. Seven things to ignore. Every claim cited. A product of The Knowledge Gardens.",
    url: "https://marketing.theknowledgegardens.com",
    siteName: "The Marketing Architect",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Marketing Architect",
    description:
      "Three things to do. Seven things to ignore. Every claim cited.",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Space+Mono:wght@400;700&display=swap"
        />
        {/* Umbrella org JSON-LD — sister-garden context for AI crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "The Marketing Architect",
              alternateName: "Marketing Knowledge Garden",
              url: "https://marketing.theknowledgegardens.com",
              parentOrganization: {
                "@type": "Organization",
                name: "The Knowledge Gardens",
                url: "https://theknowledgegardens.com",
              },
              description:
                "A productized service that diagnoses how a business shows up to AI search and architects the fix.",
              sameAs: [
                "https://orchids.theknowledgegardens.com",
                "https://builders.theknowledgegardens.com",
                "https://health.theknowledgegardens.com",
                "https://toxicology.theknowledgegardens.com",
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
