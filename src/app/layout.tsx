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
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    images: [SITE.ogImage],
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
