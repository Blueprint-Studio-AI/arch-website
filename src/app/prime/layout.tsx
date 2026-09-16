import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: { absolute: "Prime | Arch" },
  description:
    "Just hold it. Make your Bitcoin primeBTC and it earns while it sits. Borrow against it, trade it, boost it. It stays yours.",
  alternates: { canonical: "/prime" },
  // ponytail: no dedicated OG image yet; falls back to the site card. Add /img/og-prime.png when the page is real.
};

// Same shape as /chain: one Lenis instance for the whole page so the pinned "How Prime works"
// story can route its snaps through it. Light hero → dark nav text.
export default function PrimeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      <Nav lightHero />
      {children}
      <SiteFooter variant="home" />
    </SmoothScroll>
  );
}
