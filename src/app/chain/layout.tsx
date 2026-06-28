import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import "./chain.css";

export const metadata: Metadata = {
  title: { absolute: "Chain | Arch" },
  description:
    "Arch is a Bitcoin-native VM, chain, and validator network. Real Bitcoin, made programmable — no wrapping, no migration.",
  alternates: { canonical: "/chain" },
  openGraph: { title: "Chain" },
  twitter: { title: "Chain" },
};

// The chain page is a self-contained immersive scroll experience that drives its own
// wheel/touch state machine. It deliberately lives outside the (main) layout so it is
// NOT wrapped in Lenis SmoothScroll (which would fight the manual scroll handling). The
// .chain-scope wrapper namespaces its global-ish CSS so it can't leak into the rest of
// the Tailwind site.
export default function ChainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Nav sits OUTSIDE .chain-scope so the namespaced CSS reset can't touch its Tailwind styles.
  // forceDark keeps it in its black-text state, since this page's background is light and its
  // scroll-based dark trigger won't fire here (scroll is driven by the immersive state machine).
  return (
    <>
      <Nav forceDark bare />
      <div className="chain-scope">{children}</div>
    </>
  );
}
