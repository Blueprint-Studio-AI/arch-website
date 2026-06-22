export const SITE = {
  name: "Arch",
  url: "https://www.arch.network",
  ogImage: "/img/og.png",
  description:
    "Arch is Bitcoin-native financial market infrastructure enabling credit, derivatives, and capital markets.",
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
  { label: "Partners", href: "/ecosystem", external: false },
  { label: "Blog", href: EXTERNAL.blog, external: true },
  { label: "Documentation", href: EXTERNAL.docs, external: true },
  { label: "Chain", href: "/chain", external: false },
] as const;
