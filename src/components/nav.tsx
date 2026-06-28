"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArchLogo, XIcon } from "@/components/icons";
import { NAV_LINKS, EXTERNAL } from "@/lib/site";

const navIn = (i: number) => ({
  animation: `nav-in 0.6s ease-out ${0.15 + i * 0.12}s both`,
});

export function Nav({ forceDark = false, bare = false }: { forceDark?: boolean; bare?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isEcosystem = pathname === "/ecosystem";
  const cta = isEcosystem
    ? { label: "Start Building", href: "#" }
    : { label: "Become a partner", href: EXTERNAL.typeform };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= window.innerHeight - 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = forceDark || scrolled || menuOpen;
  const linkColor = dark ? "text-black" : "text-white";

  function NavLink({ link, onClick, big }: { link: (typeof NAV_LINKS)[number]; onClick?: () => void; big?: boolean }) {
    const cls = `whitespace-nowrap ${big ? "text-[20px]" : "text-xs"} transition-colors duration-200 ${linkColor}`;
    return link.external ? (
      <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>
        {link.label}
      </a>
    ) : (
      <Link
        href={link.href}
        aria-current={pathname === link.href ? "page" : undefined}
        onClick={onClick}
        className={cls}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-100 flex h-20 items-center">
      {!bare && (
        <div
          className={`pointer-events-none absolute inset-0 bg-white/30 backdrop-blur-[12px] transition-opacity duration-400 ${
            dark ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <div className="relative z-10 mx-auto flex w-[94%] max-w-(--container-site) items-center justify-between">
        <Link href="/" aria-label="Arch Network home" className={`relative z-10 ${linkColor}`} style={navIn(0)}>
          <ArchLogo className="h-8 w-auto" />
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link, i) => (
            <span key={link.label} style={navIn(i + 1)}>
              <NavLink link={link} />
            </span>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex" style={navIn(NAV_LINKS.length + 1)}>
          <a
            href={EXTERNAL.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Arch on X"
            className={linkColor}
          >
            <XIcon className="h-4 w-4" />
          </a>
          <a
            href={cta.href}
            target={cta.href.startsWith("http") ? "_blank" : undefined}
            rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`rounded-xl border px-5 py-2 text-xs transition-colors duration-400 hover:border-dark-purple hover:bg-dark-purple hover:text-white ${
              dark ? "border-black text-black" : "border-white text-white"
            }`}
          >
            {cta.label}
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-10 flex h-8 w-8 flex-col items-center justify-center gap-1 md:hidden"
        >
          <span className={`block h-0.5 w-5 transition-all duration-300 ${dark ? "bg-black" : "bg-white"} ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 transition-all duration-300 ${dark ? "bg-black" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 transition-all duration-300 ${dark ? "bg-black" : "bg-white"} ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </button>
      </div>

      <div
        className={`fixed inset-x-0 top-0 flex flex-col items-start gap-7 rounded-b-[28px] bg-white px-[3%] pt-[90px] pb-6 transition-transform duration-400 md:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-[120%]"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <NavLink key={link.label} link={link} big onClick={() => setMenuOpen(false)} />
        ))}
        <a
          href={EXTERNAL.typeform}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full rounded-2xl bg-orange px-6 py-3 text-center text-base text-white transition-colors duration-400 hover:bg-dark-purple"
        >
          Join the Ecosystem
        </a>
      </div>
    </nav>
  );
}
