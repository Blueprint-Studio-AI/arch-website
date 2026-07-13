export const SITE = {
  name: "Arch",
  url: "https://www.arch.network",
  ogImage: "/img/og.png",
  ogAlt: "Arch — Real Bitcoin. Finally Programmable.",
  twitter: "@ArchNtwrk",
  description:
    "Arch is Bitcoin-native financial market infrastructure enabling credit, derivatives, and capital markets.",
} as const;

// Absolute base for OG / canonical URLs. On Netlify, prefer the deploy's own primary URL so preview,
// branch, and (pre-custom-domain) production deploys are self-contained — their share cards resolve
// instead of 404-ing against a domain that isn't live yet. Netlify sets DEPLOY_PRIME_URL (this
// deploy's primary URL — becomes the custom domain on production) and URL (the site's main URL).
// Falls back to the canonical production URL for local dev / non-Netlify builds.
export const SITE_URL =
  process.env.DEPLOY_PRIME_URL || process.env.URL || SITE.url;

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
  { label: "Partners", href: "/ecosystem", external: false },
  { label: "Chain", href: "/chain", external: false },
  { label: "Prime", href: "/prime", external: false },
  { label: "Blog", href: EXTERNAL.blog, external: true },
  { label: "Documentation", href: EXTERNAL.docs, external: true },
] as const;
