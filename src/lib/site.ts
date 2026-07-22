export const SITE = {
  name: "Arch",
  url: "https://www.arch.network",
  ogImage: "/img/og.png",
  ogAlt: "Arch — Real Bitcoin. Finally Programmable.",
  twitter: "@ArchNtwrk",
  description:
    "Arch is Bitcoin-native financial market infrastructure enabling credit, derivatives, and capital markets.",
} as const;

// Absolute base for OG / canonical URLs. Non-production deploys prefer their own
// deploy URL so preview/branch share cards resolve instead of 404-ing against a
// domain that isn't live yet. Netlify sets DEPLOY_PRIME_URL (this deploy's primary
// URL — becomes the custom domain on production) and URL (the site's main URL);
// Vercel sets VERCEL_ENV + VERCEL_URL (bare host, no protocol). Production on
// Vercel and local dev fall back to the canonical domain.
export const SITE_URL =
  process.env.DEPLOY_PRIME_URL ||
  process.env.URL ||
  (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : SITE.url);

// Carried over from the previous (Webflow) site so marketing data and any
// tags in the GTM container continue uninterrupted across the relaunch.
export const ANALYTICS = {
  gaId: "G-EDHYRW0Q7Z",
  gtmId: "GTM-5Z8L2F4T",
} as const;

export const EXTERNAL = {
  blog: "https://www.blog.arch.network/",
  docs: "https://docs.arch.network/",
  book: "https://book.arch.network/docs",
  typeform: "https://form.typeform.com/to/YUZ7T5jy",
  manifesto: "https://manifesto.arch.network",
  x: "https://x.com/ArchNtwrk",
  discord: "https://discord.gg/archnetwork",
  youtube: "https://www.youtube.com/@ArchNtwrk",
  linkedin: "https://www.linkedin.com/company/archntwrk/",
} as const;

export const NAV_LINKS = [
  { label: "Chain", href: "/chain", external: false },
  { label: "Partners", href: "/ecosystem", external: false },
  { label: "Blog", href: EXTERNAL.blog, external: true },
  { label: "Documentation", href: EXTERNAL.docs, external: true },
] as const;
