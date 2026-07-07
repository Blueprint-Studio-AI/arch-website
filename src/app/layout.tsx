import type { Metadata } from "next";
import { geist, gascogne } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "Bitcoin Capital Markets Infrastructure | Native Bitcoin Settlement | Arch",
    template: "%s | Arch",
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    locale: "en_US",
    // Explicit dimensions + alt so scrapers that don't fetch the image (and a11y) still get a valid,
    // correctly-sized card. 1200×630 is the image's real size.
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    creator: SITE.twitter,
    images: [{ url: SITE.ogImage, alt: SITE.ogAlt }],
  },
  verification: {
    google: "hJoxXI7B6p1Fh7hX2RkNGPfYHPGYZONidbOv8o9ONYI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${gascogne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
