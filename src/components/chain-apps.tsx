// Movement 4 of the Chain page below-fold ("What you can do" — §3.x), ported from
// public/below/index.html (static HTML + vanilla CSS) to a React + Tailwind component.
// This is the white-paper band (band--do = transparent bg) → dark text on white.
// App cards (Borrow/Earn/Swap) + the ecosystem grid; no closing CTA exists in the
// source markup, so none is invented. Footer is rendered by the parent (SiteFooter).
//
// Token mapping (chain.css → Tailwind theme): cream → light, purple → dark-purple,
// purple-2 → purple, orange → orange; gray ramp ink/body/muted/faint → neutral-900/600/500/400;
// hairline (--hair) → border-black/[0.08].

import type { ReactNode } from "react";
import { Reveal } from "./chain-reveal";

type App = { tag: string; title: string; desc: string; link: string; viz: ReactNode };

const APPS: App[] = [
  {
    tag: "Borrow",
    title: "Borrow against it. Keep it.",
    desc: "Draw a loan against native BTC — real Bitcoin, not a wrapped IOU. Still yours the whole time.",
    link: "Borrow in Arch Prime",
    viz: (
      <svg
        viewBox="0 0 200 112"
        role="img"
        aria-label="Your native BTC stays in place while you draw a loan against it."
        className="block h-auto w-full"
      >
        <defs>
          <marker id="bA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L9 5 L0 10 z" fill="#ec641d" />
          </marker>
        </defs>
        <rect x="30" y="40" width="32" height="32" rx="8" fill="#E9B949" stroke="#b8860b" />
        <text x="46" y="90" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#9a8a4a">
          your BTC
        </text>
        <path d="M70 56 L116 56" stroke="#ec641d" strokeWidth="1.4" strokeDasharray="3 3" markerEnd="url(#bA)" />
        <rect x="122" y="42" width="52" height="28" rx="7" fill="#fff" stroke="#d3d3da" />
        <text x="148" y="60" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#34343a">
          loan out
        </text>
      </svg>
    ),
  },
  {
    tag: "Earn",
    title: "Put idle Bitcoin to work.",
    desc: "Earn on BTC while keeping full Bitcoin exposure — yield that accrues to real Bitcoin, not a receipt.",
    link: "Earn with HoneyB",
    viz: (
      <svg
        viewBox="0 0 200 112"
        role="img"
        aria-label="Native BTC earns yield that rises while you keep 100 percent of your Bitcoin."
        className="block h-auto w-full"
      >
        <defs>
          <marker id="eA" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
            <path d="M0 0 L9 5 L0 10 z" fill="#16a34a" />
          </marker>
        </defs>
        <rect x="30" y="56" width="32" height="32" rx="8" fill="#E9B949" stroke="#b8860b" />
        <text x="46" y="46" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#9a8a4a">
          BTC
        </text>
        <path d="M66 80 C104 78 128 60 162 40" fill="none" stroke="#16a34a" strokeWidth="2" markerEnd="url(#eA)" />
        <text x="100" y="104" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#9a9aa2">
          yield · 100% BTC kept
        </text>
      </svg>
    ),
  },
  {
    tag: "Swap",
    title: "Swap against real liquidity.",
    desc: "Pooled, always-on liquidity for native Bitcoin — move in and out at a tight, predictable spread.",
    link: "Swap in Arch Prime",
    viz: (
      <svg
        viewBox="0 0 200 112"
        role="img"
        aria-label="Swap native Bitcoin in and out against a shared liquidity pool."
        className="block h-auto w-full"
      >
        <defs>
          <marker id="sA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L9 5 L0 10 z" fill="#9a9aa2" />
          </marker>
        </defs>
        <rect x="30" y="34" width="28" height="28" rx="7" fill="#E9B949" stroke="#b8860b" />
        <rect x="30" y="68" width="28" height="28" rx="7" fill="#fff" stroke="#7c7ce0" />
        <path d="M64 48 L118 48" stroke="#9a9aa2" strokeWidth="1.3" markerEnd="url(#sA)" />
        <path d="M118 82 L64 82" stroke="#9a9aa2" strokeWidth="1.3" markerEnd="url(#sA)" />
        <rect x="124" y="42" width="46" height="46" rx="9" fill="#f6f6f8" stroke="#d3d3da" />
        <text x="147" y="68" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#7a7a82">
          pool
        </text>
      </svg>
    ),
  },
];

type Eco = { name: string; desc: string; built: ReactNode };

const ECO: Eco[] = [
  {
    name: "Arch Prime",
    desc: "Self-custodial prime-brokerage terminal: swap, borrow, earn, invest.",
    built: (
      <>
        Built on <b className="font-medium text-neutral-500">the full stack</b>
      </>
    ),
  },
  {
    name: "HoneyB",
    desc: "Institutional Bitcoin yield — idle BTC to real yield, 100% exposure kept.",
    built: (
      <>
        Built on <b className="font-medium text-neutral-500">Arch Lend · APIs</b>
      </>
    ),
  },
];

export function ChainApps() {
  return (
    <section className="bg-white font-sans text-black antialiased">
      <div className="mx-auto max-w-[64rem] px-6 pb-24 pt-16 md:pb-32 md:pt-20">
        {/* sub-beat: use it (continues the WHAT YOU CAN DO macro beat) */}
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-neutral-400">Use it</span>
            <span className="h-px flex-1 bg-black/[0.08]" />
          </div>
          <h3 className="mt-5 max-w-[24ch] text-balance text-[1.5rem] font-medium leading-[1.18] tracking-[-0.018em] text-neutral-900 md:text-[1.8rem]">
            Your Bitcoin, finally doing more — and still yours.
          </h3>
        </Reveal>

        {/* flat app units — soft-gray viz panel + type, no card chrome */}
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
          {APPS.map((app, i) => (
            <Reveal key={app.tag} delay={i * 80} className="flex flex-col">
              <div className="flex items-center justify-center rounded-[12px] bg-neutral-100 px-6 py-5">
                <div className="w-full max-w-[220px]">{app.viz}</div>
              </div>
              <div className="mt-4">
                <div className="font-mono text-[0.64rem] uppercase tracking-[0.06em] text-orange">{app.tag}</div>
                <h4 className="mt-2 text-balance text-[1.05rem] font-semibold tracking-[-0.01em] text-neutral-900">
                  {app.title}
                </h4>
                <p className="mt-1.5 text-pretty text-[0.88rem] leading-[1.5] text-neutral-600">{app.desc}</p>
                <a
                  href="#app"
                  className="group mt-3 inline-flex items-center gap-[5px] font-mono text-[0.66rem] tracking-[0.02em] text-orange"
                >
                  {app.link}{" "}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:translate-x-[3px]"
                  >
                    ↗
                  </span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* sub-beat: the ecosystem */}
        <Reveal className="mt-20 md:mt-24">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-neutral-400">The ecosystem</span>
            <span className="h-px flex-1 bg-black/[0.08]" />
          </div>
          <h3 className="mt-5 max-w-[24ch] text-balance text-[1.5rem] font-medium leading-[1.18] tracking-[-0.018em] text-neutral-900 md:text-[1.8rem]">
            The whole stack, settling as one.
          </h3>
          <p className="mt-3 max-w-[58ch] text-pretty text-[1.02rem] leading-[1.55] text-neutral-600">
            Built on once — by <em className="font-serif font-normal not-italic">Arch</em>, by partners, and by the
            surfaces that reach real users.
          </p>
        </Reveal>

        {/* flat eco tiles — hairline-ruled, no card chrome */}
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 min-[520px]:grid-cols-2">
          {ECO.map((e, i) => (
            <Reveal key={e.name} y={0} delay={i * 80} className="border-t border-black/[0.08] pt-5">
              <h4 className="text-[1.05rem] font-semibold tracking-[-0.01em] text-neutral-900">{e.name}</h4>
              <p className="mt-1.5 text-pretty text-[0.88rem] leading-[1.5] text-neutral-600">{e.desc}</p>
              <div className="mt-3 font-mono text-[0.6rem] leading-[1.5] text-neutral-400">{e.built}</div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-pretty font-mono text-[0.68rem] leading-[1.6] text-neutral-400">
          + a mobile neobank, virtual debit card, on/off-ramp, get-paid-in-Bitcoin, and a Bitcoin-backed mortgage — all
          on the same rails.
        </p>

        {/* closing beat: builder CTA — flat, centered, no card */}
        <Reveal className="mt-20 border-t border-black/[0.08] pt-16 text-center md:mt-24 md:pt-20">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-neutral-500">For builders</div>
          <h3 className="mx-auto mt-4 max-w-[20ch] text-balance text-[1.7rem] font-medium leading-[1.15] tracking-[-0.02em] text-neutral-900 md:text-[2rem]">
            These primitives are <em className="font-serif not-italic font-normal">yours</em> to build on.
          </h3>
          <div className="mx-auto mt-7 inline-flex items-center overflow-hidden rounded-[10px] border border-black/[0.08]">
            <code className="px-[14px] py-[10px] font-mono text-[0.84rem] text-neutral-900">
              <span className="text-orange">$</span> npx create-arch-app
            </code>
            <span className="border-l border-black/[0.08] bg-neutral-50 px-[13px] py-[10px] font-mono text-[0.7rem] text-neutral-500">
              copy
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-[10px]">
            <a
              href="#build"
              className="group inline-flex items-center gap-[7px] rounded-[11px] bg-orange px-[18px] py-[11px] text-[0.94rem] font-medium text-white no-underline ring-1 ring-inset ring-black/[0.06] transition-transform duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] active:scale-[0.96]"
            >
              Start building{" "}
              <span className="transition-transform duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:translate-x-[2px]">
                ↗
              </span>
            </a>
            <a
              href="#docs"
              className="inline-flex items-center gap-[7px] rounded-[11px] border border-black/[0.08] px-[18px] py-[11px] text-[0.94rem] font-medium text-neutral-900 no-underline transition-transform duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] active:scale-[0.96]"
            >
              Read the docs
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
