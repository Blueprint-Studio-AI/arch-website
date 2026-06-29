// Movement 3 of the Chain page below-fold — "Financial primitives Arch unlocks"
// (§2.1 pools → §2.2 enforceable collateral → §2.3 real liquidations → §2.4 the unlock + builder CTA).
// Ported faithfully from public/below/index.html (the .band--unlock section). White paper / dark text.
//
// Token mapping (chain.css → Tailwind theme): cream → light, purple → dark-purple,
// purple-2 → purple, orange → orange; gray ramp ink/body/muted/faint → neutral-900/600/500/400;
// hairline (--hair) → border-black/[0.08]. Mirrors the WhyBand reference in chain-below.tsx.

import type { ReactNode } from "react";
import { Reveal } from "./chain-reveal";

type Section = {
  n: string;
  label: string;
  title: ReactNode;
  body: ReactNode;
  figure: ReactNode;
};

const SECTIONS: Section[] = [
  {
    n: "2.1",
    label: "The missing primitive",
    title: <>Bitcoin could always send value. It just couldn&apos;t pool it.</>,
    body: (
      <>
        A pool is shared capital many people can use at once — most markets are built on them. Bitcoin can&apos;t support
        them on its own; Arch can, while your Bitcoin stays native. Pooling real UTXO states unlocks AMMs and more
        efficient markets — the line between{" "}
        <em className="font-serif not-italic font-normal">&quot;two people can trade&quot;</em> and{" "}
        <em className="font-serif not-italic font-normal">&quot;a market anyone can trade against.&quot;</em>
      </>
    ),
    figure: (
      <svg
        viewBox="0 0 680 228"
        role="img"
        aria-label="Peer-to-peer is one coin to one coin; a pool is many coins sharing one reserve — only possible on Arch."
        className="block h-auto w-full"
      >
        <defs>
          <marker id="a5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L9 5 L0 10 z" fill="#b6b6be" />
          </marker>
        </defs>
        {/* P2P */}
        <text x="40" y="34" className="font-mono tracking-[0.06em]" fontSize="9.5" fill="#8a8a92">
          BITCOIN · peer-to-peer
        </text>
        <rect x="40" y="50" width="280" height="130" rx="12" fill="#fff" stroke="#ededf0" />
        <rect x="78" y="100" width="26" height="26" rx="6" fill="#E9B949" stroke="#b8860b" />
        <path d="M118 113 L236 113" stroke="#c4c4cc" markerEnd="url(#a5)" />
        <rect x="252" y="100" width="26" height="26" rx="6" fill="#E9B949" stroke="#b8860b" />
        <text x="180" y="206" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="9" fill="#9a9aa2">
          one coin → one coin
        </text>
        {/* pool */}
        <text x="360" y="34" className="font-mono tracking-[0.06em]" fontSize="9.5" fill="#ec641d">
          ARCH · a pool
        </text>
        <rect x="360" y="50" width="280" height="130" rx="12" fill="#fff" stroke="#ec641d" strokeOpacity=".35" />
        <g fill="#E9B949" stroke="#b8860b">
          <rect x="384" y="70" width="18" height="18" rx="4" />
          <rect x="384" y="96" width="18" height="18" rx="4" />
          <rect x="384" y="122" width="18" height="18" rx="4" />
          <rect x="384" y="148" width="18" height="18" rx="4" opacity=".7" />
        </g>
        <g stroke="#dcdce2" fill="none">
          <path d="M404 79 L470 110" markerEnd="url(#a5)" />
          <path d="M404 105 L470 113" markerEnd="url(#a5)" />
          <path d="M404 131 L470 116" markerEnd="url(#a5)" />
          <path d="M404 157 L470 120" markerEnd="url(#a5)" />
        </g>
        <rect x="472" y="84" width="148" height="62" rx="12" fill="#fdf6e3" stroke="#e6d28a" />
        <text x="546" y="111" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="10" fill="#9a7a1a">
          shared reserve
        </text>
        <text x="546" y="126" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#b59a4a">
          pooled · native UTXOs
        </text>
        <text x="500" y="206" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="9" fill="#9a9aa2">
          a market anyone can trade against
        </text>
      </svg>
    ),
  },
  {
    n: "2.2",
    label: "Enforceable collateral",
    title: <>Collateral you can actually enforce — on Bitcoin.</>,
    body: (
      <>
        A loan market only works if the lender can seize the collateral without the borrower&apos;s consent. Bitcoin
        can&apos;t do it alone, and wrapping it adds another layer of uncertainty. Arch enforces mechanically and settles
        to Bitcoin, so the borrower can&apos;t yank it. Moving that coin takes the validators&apos; signature, not theirs.
      </>
    ),
    figure: (
      <svg
        viewBox="0 0 680 216"
        role="img"
        aria-label="A price line crosses the liquidation threshold; the VM assembles a Bitcoin transaction that moves the collateral."
        className="block h-auto w-full"
      >
        <defs>
          <marker id="a6" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L9 5 L0 10 z" fill="#ec641d" />
          </marker>
        </defs>
        {/* price chart */}
        <text x="40" y="26" className="font-mono tracking-[0.06em]" fontSize="9.5" fill="#8a8a92">
          COLLATERAL PRICE
        </text>
        <line x1="44" y1="40" x2="44" y2="150" stroke="#e4e4e8" />
        <line x1="44" y1="150" x2="344" y2="150" stroke="#e4e4e8" />
        <line x1="44" y1="106" x2="344" y2="106" stroke="#ec641d" strokeDasharray="4 3" strokeOpacity=".5" />
        <text x="344" y="100" textAnchor="end" className="font-mono tracking-[0.06em]" fontSize="8" fill="#ec641d">
          liquidation threshold
        </text>
        {/* price falls and crosses the threshold exactly at the breach */}
        <path
          d="M52 60 C108 56 156 80 196 92 C214 98 224 102 232 106 C268 118 296 128 320 138"
          fill="none"
          stroke="#34343a"
          strokeWidth="1.6"
        />
        <line x1="232" y1="110" x2="232" y2="150" stroke="#ec641d" strokeOpacity=".3" strokeDasharray="2 3" />
        <circle cx="232" cy="106" r="4.5" fill="#ec641d" />
        <text x="232" y="167" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#ec641d">
          breach
        </text>
        {/* the breach fires the VM */}
        <path d="M344 124 C386 124 380 112 414 112" fill="none" stroke="#ec641d" strokeWidth="1.4" markerEnd="url(#a6)" />
        <rect x="416" y="88" width="92" height="48" rx="9" fill="#fff" stroke="#ec641d" strokeWidth="1.3" />
        <text x="462" y="110" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="11" fill="#ec641d">
          ArchVM
        </text>
        <text x="462" y="124" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8" fill="#b6b6be">
          assembles tx
        </text>
        <path d="M508 112 L544 112" stroke="#c4c4cc" markerEnd="url(#a6)" />
        {/* collateral moved and settled */}
        <rect x="548" y="84" width="116" height="56" rx="9" fill="#faf1d8" stroke="#b8860b" />
        <rect x="598" y="92" width="16" height="16" rx="4" fill="#E9B949" stroke="#b8860b" />
        <text x="606" y="122" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#9a7a1a">
          collateral
        </text>
        <text x="606" y="133" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#9a7a1a">
          moved · settled
        </text>
        <text x="352" y="194" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="9" fill="#9a9aa2">
          the moment a rule fires — settled to Bitcoin, the borrower can&apos;t intercept
        </text>
      </svg>
    ),
  },
  {
    n: "2.3",
    label: "Real liquidations",
    title: <>A liquidation that&apos;s both on time and final.</>,
    body: (
      <>
        A late liquidation isn&apos;t slow — it&apos;s a loss. On a ten-minute chain you can&apos;t promise you&apos;ll be
        on time. Arch detects a breach,{" "}
        <b className="font-medium text-neutral-900">
          locks the price at signing, and broadcasts the closeout in under three seconds
        </b>{" "}
        — then settles it on Bitcoin.
      </>
    ),
    figure: (
      <svg
        viewBox="0 0 680 184"
        role="img"
        aria-label="Under three seconds from breach to broadcast on Arch, then about ten minutes for Bitcoin settlement — two timescales."
        className="block h-auto w-full"
      >
        {/* arch bracket */}
        <rect x="40" y="56" width="320" height="62" rx="10" fill="#fff" stroke="#ec641d" strokeOpacity=".4" />
        <text x="52" y="46" className="font-mono tracking-[0.06em]" fontSize="9" fill="#ec641d">
          ON ARCH · &lt; 3 SECONDS
        </text>
        <g className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#7a7a82">
          <circle cx="78" cy="87" r="4" fill="#ec641d" />
          <text x="78" y="107" textAnchor="middle">
            breach
          </text>
          <circle cx="158" cy="87" r="4" fill="#ec641d" opacity=".7" />
          <text x="158" y="107" textAnchor="middle">
            detect
          </text>
          <circle cx="238" cy="87" r="4" fill="#ec641d" opacity=".7" />
          <text x="238" y="107" textAnchor="middle">
            price locked
          </text>
          <circle cx="322" cy="87" r="4" fill="#ec641d" />
          <text x="322" y="107" textAnchor="middle">
            broadcast
          </text>
        </g>
        <line x1="82" y1="87" x2="318" y2="87" stroke="#f0c9b0" />
        {/* gap arrow */}
        <path d="M364 87 L408 87" stroke="#c4c4cc" strokeDasharray="3 3" />
        {/* bitcoin */}
        <rect x="412" y="56" width="228" height="62" rx="10" fill="#faf1d8" stroke="#e6d28a" />
        <text x="424" y="46" className="font-mono tracking-[0.06em]" fontSize="9" fill="#9a7a1a">
          ON BITCOIN · ~10 MIN
        </text>
        <rect x="430" y="70" width="34" height="34" rx="6" fill="#fff" stroke="#b8860b" />
        <text x="478" y="84" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#9a7a1a">
          settled with
        </text>
        <text x="478" y="96" className="font-mono tracking-[0.06em]" fontSize="8.5" fill="#9a7a1a">
          Bitcoin finality
        </text>
        <text x="340" y="152" textAnchor="middle" className="font-mono tracking-[0.06em]" fontSize="9" fill="#9a9aa2">
          fast enough to stay solvent · final enough to trust
        </text>
      </svg>
    ),
  },
  {
    n: "2.4",
    label: "The unlock",
    title: <>Lending on Bitcoin — for the first time, natively.</>,
    body: (
      <>
        Native settlement made the collateral enforceable. Speed made the liquidations real. Together they make pooled
        lending possible on Bitcoin itself — with no single party able to move your collateral. That wasn&apos;t possible before.{" "}
        <b className="font-medium text-neutral-900">It is now.</b>
      </>
    ),
    figure: (
      <svg
        viewBox="0 0 680 220"
        role="img"
        aria-label="A ladder: pools plus enforceable collateral plus fast liquidation combine into pool-based lending on native Bitcoin."
        className="block h-auto w-full"
      >
        <g fontFamily="AzeretMono,monospace">
          <rect x="60" y="150" width="560" height="42" rx="8" fill="#fff" stroke="#d3d3da" />
          <text x="80" y="176" fontSize="11" fill="#34343a">
            Pools — shared, native liquidity
          </text>
          <text x="600" y="176" textAnchor="end" fontSize="9" fill="#b6b6be">
            §2.1
          </text>
          <rect x="80" y="100" width="520" height="42" rx="8" fill="#fff" stroke="#d3d3da" />
          <text x="100" y="126" fontSize="11" fill="#34343a">
            + Enforceable collateral
          </text>
          <text x="580" y="126" textAnchor="end" fontSize="9" fill="#b6b6be">
            §2.2
          </text>
          <rect x="100" y="50" width="480" height="42" rx="8" fill="#fff" stroke="#d3d3da" />
          <text x="120" y="76" fontSize="11" fill="#34343a">
            + Fast, final liquidation
          </text>
          <text x="560" y="76" textAnchor="end" fontSize="9" fill="#b6b6be">
            §2.3
          </text>
          <rect x="120" y="8" width="440" height="34" rx="8" fill="#ec641d" />
          <text x="340" y="30" textAnchor="middle" fontSize="11.5" letterSpacing="1px" fill="#fff">
            = POOL-BASED LENDING ON NATIVE BITCOIN
          </text>
        </g>
      </svg>
    ),
  },
];

export function ChainUnlock() {
  const rows = SECTIONS.slice(0, 3); // §2.1–2.3 as alternating rows
  const unlock = SECTIONS[3]; // §2.4 — the payoff

  return (
    <section className="border-t border-black/[0.08] bg-white font-sans text-black antialiased">
      <div className="mx-auto max-w-[64rem] px-6 pt-24 md:pt-32">
        {/* macro intro — opens the WHAT YOU CAN DO beat */}
        <Reveal>
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 flex-none rounded-full bg-orange" />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-neutral-500">What you can do</span>
          </div>

          <h2 className="mt-5 max-w-[22ch] text-balance text-[2rem] font-medium leading-[1.08] tracking-[-0.022em] text-neutral-900 md:text-[2.5rem]">
            What native Bitcoin can finally do.
          </h2>

          <p className="mt-5 max-w-[58ch] text-pretty text-[1.05rem] leading-[1.6] text-neutral-600">
            The foundations unlock real financial primitives — pools, enforceable collateral, and on-time
            liquidations — and the apps that finally put them in your hands.
          </p>
        </Reveal>

        {/* sub-beat: the primitives */}
        <div className="mt-16 flex items-center gap-3">
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-neutral-400">The primitives</span>
          <span className="h-px flex-1 bg-black/[0.08]" />
        </div>

        {/* §2.1–2.3 — flat alternating rows, no card chrome, whitespace as the divider */}
        {rows.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal
              key={s.n}
              delay={i * 80}
              className="grid items-center gap-9 py-14 md:grid-cols-2 md:gap-14 md:py-16"
            >
              <div className={flip ? "md:order-2" : "md:order-1"}>
                <div className="inline-flex items-center gap-[9px] font-mono text-[0.72rem] uppercase tracking-[0.04em] text-neutral-500">
                  <span className="font-medium tabular-nums text-orange">{s.n}</span> {s.label}
                </div>
                <h3 className="mt-3 text-balance text-[1.4rem] font-medium leading-[1.18] tracking-[-0.018em] text-neutral-900 md:text-[1.6rem]">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[46ch] text-pretty text-[0.98rem] leading-[1.6] text-neutral-600">{s.body}</p>
              </div>
              <div
                className={`flex items-center justify-center rounded-[14px] bg-neutral-100 p-7 lg:p-10 ${
                  flip ? "md:order-1" : "md:order-2"
                }`}
              >
                <div className="w-full max-w-[520px] [&_text]:[font-variant-numeric:tabular-nums]">{s.figure}</div>
              </div>
            </Reveal>
          );
        })}

        {/* §2.4 — the unlock, as a centered payoff */}
        <Reveal className="mt-10 text-center" delay={80}>
          <div className="inline-flex items-center gap-[9px] font-mono text-[0.72rem] uppercase tracking-[0.04em] text-neutral-500">
            <span className="font-medium tabular-nums text-orange">{unlock.n}</span> {unlock.label}
          </div>
          <h3 className="mx-auto mt-3 max-w-[26ch] text-balance text-[1.5rem] font-medium leading-[1.18] tracking-[-0.018em] text-neutral-900 md:text-[1.7rem]">
            {unlock.title}
          </h3>
          <p className="mx-auto mt-3 max-w-[54ch] text-pretty text-[0.98rem] leading-[1.6] text-neutral-600">
            {unlock.body}
          </p>
          <div className="mx-auto mt-8 flex max-w-[680px] items-center justify-center rounded-[14px] bg-neutral-100 p-7 lg:p-10">
            <div className="w-full max-w-[600px] [&_text]:[font-variant-numeric:tabular-nums]">{unlock.figure}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
