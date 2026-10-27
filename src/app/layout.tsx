import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WordLens — Contextual Lexicon & Capybara Library Catalog",
  description:
    "WordLens is a contextual English–Indonesian lexicon and library index-card catalog. Explore how words change meaning, archive vocabulary cards, and test your recall with Kapi the Librarian.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F2EB" },
    { media: "(prefers-color-scheme: dark)", color: "#151311" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-linen dark:bg-nightDesk text-espresso dark:text-[#EAE4DC] antialiased transition-colors duration-300 min-h-screen selection:bg-sage selection:text-white">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <noscript>
          <p className="noscript-message">
            WordLens is an interactive lexical archive and needs JavaScript
            enabled. Please enable JavaScript in your browser to browse the
            catalog.
          </p>
        </noscript>
      </body>
    </html>
  );
}
