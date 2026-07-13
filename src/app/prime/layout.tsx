import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./prime.css";

export const metadata: Metadata = {
  title: { absolute: "Prime | Arch" },
  description:
    "Put your Bitcoin to work. Earn on it, borrow against it, swap and pool it — without ever giving up the keys. A brokerage-grade terminal and a mobile app, settled in native Bitcoin.",
  alternates: { canonical: "/prime" },
  openGraph: {
    title: "Arch Prime — Put your Bitcoin to work",
    description:
      "Earn, borrow, swap, and pool — real markets, settled in native Bitcoin. On the web terminal and in your pocket.",
  },
  twitter: {
    title: "Arch Prime — Put your Bitcoin to work",
  },
};

// Prime runs on the same single Lenis instance as the rest of the site (via SmoothScroll), and
// uses a light "paper" hero so the Nav is forced into its dark-text state (lightHero). The whole
// page lives inside .prime-scope, which carries the warm tan/orange palette without leaking it.
export default function PrimeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      <Nav lightHero />
      <div className="prime-scope">{children}</div>
      <SiteFooter variant="home" />
    </SmoothScroll>
  );
}
