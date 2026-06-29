"use client";

// HOW — an Apple-style PINNED SCROLL-STORY. The four parallel technical advances ("beats")
// share one viewport-filling sticky frame: pinned title + 3 stat boxes on top, a big
// crossfading diagram in the middle, the beat copy below, and a dot-nav on the side. As
// you scroll, the active beat advances, the diagram crossfades, and the stat boxes re-roll.
// Principles are MANY-TO-MANY — each beat carries every principle it embodies (Native is on
// all four; Programmable only on execution); clicking a principle highlights every beat/dot
// it belongs to. Falls back to a plain stacked layout for prefers-reduced-motion, inside an
// iframe, or on mobile (<768px). Diagrams sit in a light "media" panel on the off-black band.
//
// Token mapping (chain.css → Tailwind theme): off-black #181818 = bg-black; cream = light.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "./chain-reveal";

// ease-in-out for the on-screen "window" slide between beats (craft bar)
const SLIDE = "cubic-bezier(0.65, 0, 0.35, 1)";

// SVG diagram label — sans (no monospace anywhere in this section), light letter-spacing
const lmono = "tracking-[0.01em]";

// The four principle axes. Icons reuse the WhyBand "rules" vocabulary so the "Four rules"
// band and this filter speak one language. Native ₿ / Fast ⚡ / Decentralized mesh / Programmable </>
type Principle = "native" | "fast" | "decentralized" | "programmable";
type PrincipleDef = { id: Principle; label: string; icon: ReactNode };
const PRINCIPLES: PrincipleDef[] = [
  {
    id: "native",
    label: "Native",
    icon: (
      <>
        <path d="M8.5 5.5v13M11 3.5v2.5M14 3.5v2.5M11 18.5v2.5M14 18.5v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 5.5h6a3.25 3.25 0 0 1 0 6.5h-6m0 0h6.6a3.25 3.25 0 0 1 0 6.5h-6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: "fast",
    label: "Fast",
    icon: <path d="M13 2.5 5 13.2h5.4L11 21.5 19 10.8h-5.4L13 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />,
  },
  {
    id: "decentralized",
    label: "Decentralized",
    icon: (
      <>
        <circle cx="12" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="18" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19" cy="18" r="2.6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.6 7.2 6.4 15.8M13.4 7.2l4.2 8.6M7.6 18h8.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: "programmable",
    label: "Programmable",
    icon: <path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 5l-3 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

const figExecution = (
  <svg viewBox="0 0 680 140" role="img" aria-label="Floating app transactions enter ArchVM, which sequences them into a fast chain of Arch blocks." className="h-auto w-full">
    <defs>
      <marker id="a2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L9 5 L0 10 z" fill="#c4c4cc" />
      </marker>
    </defs>
    <text x="40" y="34" className={lmono} fontSize="9.5" fill="#8a8a92">FLOATING TXNS</text>
    <g fill="#fff" stroke="#b6b6be">
      <rect x="44" y="48" width="12" height="12" rx="2.5" />
      <rect x="78" y="42" width="12" height="12" rx="2.5" />
      <rect x="60" y="74" width="12" height="12" rx="2.5" />
      <rect x="96" y="70" width="12" height="12" rx="2.5" />
    </g>
    <g stroke="#dcdce2" fill="none">
      <path d="M58 60 L150 96" markerEnd="url(#a2)" />
      <path d="M90 54 L150 92" markerEnd="url(#a2)" />
      <path d="M104 82 L150 100" markerEnd="url(#a2)" />
    </g>
    <rect x="150" y="74" width="96" height="52" rx="9" fill="#fff" stroke="#ec641d" strokeWidth="1.4" />
    <text x="198" y="98" textAnchor="middle" className={lmono} fontSize="12" letterSpacing="1.5px" fill="#ec641d">ArchVM</text>
    <text x="198" y="113" textAnchor="middle" className={lmono} fontSize="8" fill="#b6b6be">UTXO-aware</text>
    <path d="M246 100 L286 100" stroke="#c4c4cc" markerEnd="url(#a2)" />
    <text x="468" y="56" textAnchor="middle" className={lmono} fontSize="9.5" fill="#8a8a92">ARCH CHAIN · one block / 180ms</text>
    <line x1="290" y1="100" x2="650" y2="100" stroke="#d3d3da" />
    <g fill="#fff" stroke="#c4c4cc">
      <rect x="296" y="93" width="14" height="14" rx="3" /><rect x="330" y="93" width="14" height="14" rx="3" fill="#f2f2f4" />
      <rect x="364" y="93" width="14" height="14" rx="3" /><rect x="398" y="93" width="14" height="14" rx="3" fill="#f2f2f4" />
      <rect x="432" y="93" width="14" height="14" rx="3" /><rect x="466" y="93" width="14" height="14" rx="3" fill="#f2f2f4" />
      <rect x="500" y="93" width="14" height="14" rx="3" /><rect x="534" y="93" width="14" height="14" rx="3" fill="#f2f2f4" />
      <rect x="568" y="93" width="14" height="14" rx="3" /><rect x="602" y="93" width="14" height="14" rx="3" fill="#f2f2f4" />
      <rect x="636" y="93" width="14" height="14" rx="3" />
    </g>
  </svg>
);

const figCrypto = (
  <svg viewBox="0 0 680 232" role="img" aria-label="Validator key-shares combine via threshold signing into one ordinary Bitcoin signature; no single key exists." className="h-auto w-full">
    <defs>
      <marker id="a3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L9 5 L0 10 z" fill="#c4c4cc" />
      </marker>
    </defs>
    <text x="40" y="34" className={lmono} fontSize="9.5" fill="#8a8a92">VALIDATOR SET · key-shares</text>
    <g>
      <g transform="translate(60,62)"><circle r="20" fill="#fff" stroke="#d3d3da" /><g fill="none" stroke="#ec641d" strokeWidth="1.5" strokeLinecap="round"><circle cx="-6" cy="0" r="4" /><path d="M-2 0 H8" /><path d="M5 0 V3.5 M8 0 V3" /></g></g>
      <g transform="translate(60,118)"><circle r="20" fill="#fff" stroke="#d3d3da" /><g fill="none" stroke="#ec641d" strokeWidth="1.5" strokeLinecap="round"><circle cx="-6" cy="0" r="4" /><path d="M-2 0 H8" /><path d="M5 0 V3.5 M8 0 V3" /></g></g>
      <g transform="translate(60,174)"><circle r="20" fill="#fff" stroke="#d3d3da" /><g fill="none" stroke="#ec641d" strokeWidth="1.5" strokeLinecap="round"><circle cx="-6" cy="0" r="4" /><path d="M-2 0 H8" /><path d="M5 0 V3.5 M8 0 V3" /></g></g>
      <g transform="translate(118,90)"><circle r="20" fill="#fff" stroke="#d3d3da" /><g fill="none" stroke="#ec641d" strokeWidth="1.5" strokeLinecap="round"><circle cx="-6" cy="0" r="4" /><path d="M-2 0 H8" /><path d="M5 0 V3.5 M8 0 V3" /></g></g>
      <g transform="translate(118,146)"><circle r="20" fill="#fff" stroke="#d3d3da" /><g fill="none" stroke="#ec641d" strokeWidth="1.5" strokeLinecap="round"><circle cx="-6" cy="0" r="4" /><path d="M-2 0 H8" /><path d="M5 0 V3.5 M8 0 V3" /></g></g>
    </g>
    <g stroke="#dcdce2" fill="none">
      <path d="M84 66 C200 72 230 102 300 114" markerEnd="url(#a3)" />
      <path d="M84 118 C210 118 240 117 300 118" markerEnd="url(#a3)" />
      <path d="M84 170 C200 164 230 134 300 123" markerEnd="url(#a3)" />
      <path d="M142 93 C220 100 250 110 300 116" markerEnd="url(#a3)" />
      <path d="M142 149 C220 142 250 128 300 121" markerEnd="url(#a3)" />
    </g>
    <rect x="312" y="92" width="150" height="52" rx="10" fill="#fff" stroke="#ec641d" strokeWidth="1.4" />
    <text x="387" y="116" textAnchor="middle" className={lmono} fontSize="11" fill="#ec641d">1 signature</text>
    <text x="387" y="131" textAnchor="middle" className={lmono} fontSize="8.5" fill="#b6b6be">no single key exists</text>
    <path d="M462 118 L502 118" stroke="#c4c4cc" markerEnd="url(#a3)" />
    <rect x="506" y="86" width="148" height="64" rx="10" fill="#faf1d8" stroke="#b8860b" />
    <text x="580" y="112" textAnchor="middle" className={lmono} fontSize="10" fill="#9a7a1a">Bitcoin spend</text>
    <text x="580" y="128" textAnchor="middle" className={lmono} fontSize="8" fill="#b59a4a">an ordinary Taproot tx</text>
  </svg>
);

// Jaidon's foundation graphic — your BTC is one real UTXO in Bitcoin's own ledger.
// Ported verbatim from public/below/index.html (§1.1).
const figFoundation = (
  <svg viewBox="0 0 440 188" role="img" aria-label="Your Bitcoin is one real UTXO living inside Bitcoin's own ledger — not a receipt for one." className="h-auto w-full">
    <text x="220" y="30" textAnchor="middle" className={lmono} fontSize="10" fill="#8a8a92">BITCOIN · THE LEDGER</text>
    <g stroke="#d3d3da" strokeWidth="1.3">
      <line x1="117" y1="105" x2="131" y2="105" />
      <line x1="165" y1="105" x2="179" y2="105" />
      <line x1="213" y1="105" x2="227" y2="105" />
      <line x1="261" y1="105" x2="275" y2="105" />
      <line x1="309" y1="105" x2="323" y2="105" />
    </g>
    <g fill="#fff" stroke="#c4c4cc">
      <rect x="83" y="88" width="34" height="34" rx="7" />
      <rect x="131" y="88" width="34" height="34" rx="7" />
      <rect x="227" y="88" width="34" height="34" rx="7" />
      <rect x="275" y="88" width="34" height="34" rx="7" />
      <rect x="323" y="88" width="34" height="34" rx="7" />
    </g>
    <rect x="179" y="88" width="34" height="34" rx="7" fill="#fff" stroke="#ec641d" strokeWidth="1.6" />
    <rect x="189" y="98" width="14" height="14" rx="3" fill="#34343a" />
    <line x1="196" y1="88" x2="196" y2="68" stroke="#ec641d" strokeWidth="1.2" strokeDasharray="2 2" />
    <rect x="144" y="48" width="104" height="20" rx="10" fill="#fff" stroke="#ec641d" />
    <text x="196" y="61.5" textAnchor="middle" className={lmono} fontSize="8.5" fill="#ec641d">your BTC · UTXO</text>
    <text x="220" y="158" textAnchor="middle" className={lmono} fontSize="10" fill="#8a8a92">a real coin in the chain — not a receipt for one</text>
  </svg>
);

// Settlement graphic — many fast Arch blocks above, one slow Bitcoin block below.
// Ported verbatim from public/below/index.html (§1.4).
const figSettlement = (
  <svg viewBox="0 0 680 220" role="img" aria-label="Many fast Arch blocks above versus one slow ten-minute Bitcoin block below; single-movement settlements drop down." className="h-auto w-full">
    <defs>
      <marker id="a4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0 0 L9 5 L0 10 z" fill="#34343a" />
      </marker>
    </defs>
    <text x="40" y="36" className={lmono} fontSize="9.5" fill="#ec641d">ARCH · executes · 180ms</text>
    <line x1="40" y1="58" x2="640" y2="58" stroke="#d3d3da" />
    <g fill="#fff" stroke="#c4c4cc">
      <rect x="44" y="52" width="11" height="11" rx="2" />
      <rect x="70" y="52" width="11" height="11" rx="2" fill="#f2f2f4" />
      <rect x="96" y="52" width="11" height="11" rx="2" />
      <rect x="122" y="52" width="11" height="11" rx="2" />
      <rect x="148" y="52" width="11" height="11" rx="2" fill="#f2f2f4" />
      <rect x="174" y="52" width="11" height="11" rx="2" />
      <rect x="200" y="52" width="11" height="11" rx="2" fill="#f2f2f4" />
      <rect x="226" y="52" width="11" height="11" rx="2" />
      <rect x="252" y="52" width="11" height="11" rx="2" />
      <rect x="278" y="52" width="11" height="11" rx="2" fill="#f2f2f4" />
      <rect x="304" y="52" width="11" height="11" rx="2" />
      <rect x="330" y="52" width="11" height="11" rx="2" fill="#f2f2f4" />
      <rect x="356" y="52" width="11" height="11" rx="2" />
      <rect x="382" y="52" width="11" height="11" rx="2" />
      <rect x="408" y="52" width="11" height="11" rx="2" fill="#f2f2f4" />
      <rect x="434" y="52" width="11" height="11" rx="2" />
      <rect x="460" y="52" width="11" height="11" rx="2" fill="#f2f2f4" />
      <rect x="486" y="52" width="11" height="11" rx="2" />
      <rect x="512" y="52" width="11" height="11" rx="2" />
      <rect x="538" y="52" width="11" height="11" rx="2" fill="#f2f2f4" />
      <rect x="564" y="52" width="11" height="11" rx="2" />
      <rect x="590" y="52" width="11" height="11" rx="2" fill="#f2f2f4" />
      <rect x="616" y="52" width="11" height="11" rx="2" />
    </g>
    <g stroke="#d3d3da" strokeDasharray="3 3" fill="none">
      <path d="M310 66 L330 150" markerEnd="url(#a4)" />
      <path d="M360 66 L344 150" markerEnd="url(#a4)" />
      <path d="M412 66 L362 150" markerEnd="url(#a4)" />
    </g>
    <text x="40" y="130" className={lmono} fontSize="9.5" fill="#8a8a92">BITCOIN · settles · ~10 min</text>
    <line x1="40" y1="172" x2="640" y2="172" stroke="#d3d3da" />
    <g fill="#fff" stroke="#c4c4cc">
      <rect x="120" y="152" width="40" height="40" rx="6" />
      <rect x="520" y="152" width="40" height="40" rx="6" />
    </g>
    <rect x="298" y="152" width="84" height="40" rx="6" fill="#ededed" stroke="#34343a" />
    <text x="340" y="176" textAnchor="middle" className={lmono} fontSize="8.5" fill="#8a8a92">1 block</text>
    <text x="640" y="130" textAnchor="end" className={lmono} fontSize="8.5" fill="#b6b6be">not batched · one user → one user</text>
  </svg>
);

// ---- beats ----------------------------------------------------------------
type Stat = { v: string; u?: string; l: string };
type Beat = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  fig: ReactNode;
  figClass?: string;
  // every principle this beat genuinely embodies — MANY-TO-MANY (primary first)
  principles: Principle[];
  stats: [Stat, Stat, Stat];
};

const BEATS: Beat[] = [
  {
    id: "foundation",
    eyebrow: "The foundation",
    title: "It never stops being Bitcoin.",
    body: (
      <>
        What you hold is the coin itself — <b className="font-medium text-neutral-900">one real UTXO</b> on Bitcoin&apos;s own ledger, not a wrapped token or a receipt for coins held elsewhere. Every move settles straight into a Bitcoin block.
      </>
    ),
    fig: figFoundation,
    figClass: "max-w-[62%]",
    principles: ["native", "decentralized"],
    stats: [
      { v: "1", u: "UTXO", l: "your coin is one real output" },
      { v: "0", u: "IOUs", l: "no wrapper, no synthetic" },
      { v: "100%", l: "real, native Bitcoin" },
    ],
  },
  {
    id: "execution",
    eyebrow: "The execution layer",
    title: "A chain that speaks Bitcoin natively.",
    body: (
      <>
        Apps fire transactions; Arch sequences them into blocks every <b className="font-medium text-neutral-900">180&nbsp;ms</b> and executes them against real Bitcoin UTXOs — reorg-safe, so its record stays consistent with Bitcoin itself.
      </>
    ),
    fig: figExecution,
    principles: ["native", "fast", "programmable", "decentralized"],
    stats: [
      { v: "180", u: "ms", l: "one block, every" },
      { v: "1,500", u: "TPS", l: "throughput" },
      { v: "eBPF", u: "VM", l: "Solana’s VM, on UTXOs" },
    ],
  },
  {
    id: "cryptography",
    eyebrow: "The cryptography",
    title: <>There&apos;s no single key to hold.</>,
    body: (
      <>
        The authority to move a coin lives only as shares split across the validators. <b className="font-medium text-neutral-900">No single party</b>, Arch included, can move anything alone.
      </>
    ),
    fig: figCrypto,
    principles: ["decentralized", "native"],
    stats: [
      { v: "1", u: "signature", l: "on-chain: an ordinary Bitcoin spend" },
      { v: "0", u: "single keys", l: "no party can sign alone" },
      { v: "FROST", u: "·ROAST", l: "threshold signing" },
    ],
  },
  {
    id: "settlement",
    eyebrow: "Settlement",
    title: "Fast where it needs to be. Final where it counts.",
    body: (
      <>
        Move faster than Bitcoin alone ever could, then settle with <b className="font-medium text-neutral-900">Bitcoin&apos;s own finality</b>.
      </>
    ),
    fig: figSettlement,
    principles: ["fast", "native"],
    stats: [
      { v: "180", u: "ms", l: "Arch executes (fast)" },
      { v: "~10", u: "min", l: "Bitcoin settles (final)" },
      { v: "1", u: "block", l: "one settlement = one block" },
    ],
  },
];

// ---- shared pieces --------------------------------------------------------
// renders text with a per-character "decode" glitch — each char resolves through
// black/white/orange blocks, staggered. Used on the stat numbers during a beat change.
function GlitchText({ text, delayBase = 0 }: { text: string; delayBase?: number }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="chain-char" style={{ animationDelay: `${delayBase + i * 35}ms` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

function StatRow({ beat, reKey }: { beat: Beat; reKey?: number }) {
  const anim = reKey !== undefined; // pinned story → glitch the numbers on each beat change
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {beat.stats.map((s, i) => {
        const base = i * 55;
        return (
          <div
            key={i}
            className="flex flex-col justify-center overflow-hidden rounded-[18px] border border-black/[0.06] bg-white px-4 py-5 shadow-[0_1px_2px_rgba(24,24,24,0.04),0_10px_30px_-16px_rgba(24,24,24,0.12)] md:px-5"
          >
            <div key={reKey}>
              <div className="text-[1.9rem] font-medium leading-none tracking-[-0.03em] tabular-nums text-neutral-900 md:text-[2.4rem]">
                {anim ? <GlitchText text={s.v} delayBase={base} /> : s.v}
                {s.u && (
                  <span
                    className={`ml-0.5 text-[1.1rem] text-neutral-400 md:text-[1.3rem] ${anim ? "chain-reroll" : ""}`}
                    style={anim ? { animationDelay: `${base + Array.from(s.v).length * 35}ms` } : undefined}
                  >
                    {s.u}
                  </span>
                )}
              </div>
              <div
                className={`mt-1.5 text-[0.72rem] leading-[1.35] text-neutral-500 ${anim ? "chain-reroll" : ""}`}
                style={anim ? { animationDelay: `${base + 120}ms` } : undefined}
              >
                {s.l}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// a small principle pill — "dark" tone on the black band (header legend), "light" tone
// inside the white beat cards (per-beat tags).
function PrinciplePill({
  def,
  on,
  onClick,
  tone = "dark",
  iconOnly = false,
}: {
  def: PrincipleDef;
  on: boolean;
  onClick: () => void;
  tone?: "dark" | "light";
  iconOnly?: boolean;
}) {
  const surface = on
    ? "bg-orange/15 text-orange"
    : tone === "light"
      ? "bg-black/[0.04] text-neutral-600 hover:bg-black/[0.07] hover:text-neutral-900"
      : "bg-white/[0.06] text-white/55 hover:bg-white/[0.1] hover:text-white";
  const iconColor = on
    ? "text-orange"
    : tone === "light"
      ? "text-neutral-400 group-hover:text-orange"
      : "text-white/40 group-hover:text-orange";

  if (iconOnly) {
    return (
      <button
        type="button"
        aria-pressed={on}
        aria-label={def.label}
        title={def.label}
        onClick={onClick}
        className={`group grid h-7 w-7 place-items-center rounded-full transition-colors duration-200 ${surface}`}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`h-3.5 w-3.5 transition-colors duration-200 ${iconColor}`}>
          {def.icon}
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-[0.62rem] uppercase tracking-[0.1em] transition-colors duration-200 ${surface}`}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`h-3 w-3 transition-colors duration-200 ${iconColor}`}>
        {def.icon}
      </svg>
      {def.label}
    </button>
  );
}

function PrincipleLegend({ hl, onToggle }: { hl: Principle[]; onToggle: (p: Principle) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
      {PRINCIPLES.map((p) => (
        <PrinciplePill key={p.id} def={p} on={hl.includes(p.id)} onClick={() => onToggle(p.id)} />
      ))}
    </div>
  );
}

function PrincipleTags({
  beat,
  hl,
  onToggle,
  iconOnly = false,
}: {
  beat: Beat;
  hl: Principle[];
  onToggle: (p: Principle) => void;
  iconOnly?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {beat.principles.map((pid) => {
        const def = PRINCIPLES.find((p) => p.id === pid)!;
        return <PrinciplePill key={pid} def={def} on={hl.includes(pid)} onClick={() => onToggle(pid)} tone="light" iconOnly={iconOnly} />;
      })}
    </div>
  );
}

function BeatCopy({ beat, hl, onToggle }: { beat: Beat; hl: Principle[]; onToggle: (p: Principle) => void }) {
  return (
    <>
      {/* eyebrow on the left, icon-only principle tags aligned opposite on the right */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-[0.7rem] uppercase tracking-[0.1em] text-neutral-500">{beat.eyebrow}</div>
        <PrincipleTags beat={beat} hl={hl} onToggle={onToggle} iconOnly />
      </div>
      <h3 className="mt-3 text-balance text-[1.35rem] font-medium leading-[1.18] tracking-[-0.018em] text-neutral-900 md:text-[1.5rem]">
        {beat.title}
      </h3>
      <p className="mt-2.5 max-w-[62ch] text-pretty text-[0.95rem] leading-[1.55] text-neutral-600">{beat.body}</p>
    </>
  );
}

// the light diagram panel that lives inside a beat card
function BeatDiagram({ beat, className = "" }: { beat: Beat; className?: string }) {
  return (
    <div
      className={`flex min-w-0 items-center justify-center overflow-hidden rounded-[14px] bg-neutral-100 p-5 lg:p-6 [&_text]:[font-variant-numeric:tabular-nums] ${className}`}
    >
      <div className={`mx-auto w-full ${beat.figClass ?? ""}`}>{beat.fig}</div>
    </div>
  );
}

// the beat layout variants:
//   center → text left (vertically centered) · diagram right
//   fill   → text left (justified top↔bottom to fill the height) · diagram right
//   below  → diagram on top (fills) · text below
type CardVariant = "center" | "fill" | "below";

// the inner layout of a beat (text + diagram), WITHOUT the card frame. `fill` makes it
// fill a fixed-height parent — used by the pinned "window" slide; otherwise it sizes naturally.
function BeatContent({
  beat,
  hl,
  onToggle,
  variant,
  fill = false,
}: {
  beat: Beat;
  hl: Principle[];
  onToggle: (p: Principle) => void;
  variant: CardVariant;
  fill?: boolean;
}) {
  const copy = <BeatCopy beat={beat} hl={hl} onToggle={onToggle} />;

  if (variant === "below") {
    return (
      <div className={`flex flex-col gap-6 ${fill ? "h-full" : ""}`}>
        <BeatDiagram beat={beat} className={fill ? "min-h-0 flex-1" : ""} />
        <div>{copy}</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-7 md:flex-row md:gap-10 ${fill ? "h-full" : ""}`}>
      <div className={`flex flex-col md:w-[40%] md:shrink-0 ${variant === "fill" ? "md:justify-between" : "md:justify-center"}`}>
        {copy}
      </div>
      <BeatDiagram beat={beat} className={fill ? "flex-1" : "flex-1 md:h-[15rem]"} />
    </div>
  );
}

// a complete beat card (frame + content) — used by the stacked fallback
function BeatCard({
  beat,
  hl,
  onToggle,
  variant = "center",
  className = "",
}: {
  beat: Beat;
  hl: Principle[];
  onToggle: (p: Principle) => void;
  variant?: CardVariant;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] border border-black/[0.06] bg-white p-7 shadow-[0_1px_2px_rgba(24,24,24,0.04),0_10px_30px_-16px_rgba(24,24,24,0.12)] md:p-9 ${className}`}
    >
      <BeatContent beat={beat} hl={hl} onToggle={onToggle} variant={variant} />
    </div>
  );
}

function DotNav({
  beats,
  active,
  onJump,
}: {
  beats: Beat[];
  active: number;
  onJump: (i: number) => void;
}) {
  // One dot per VISIBLE beat — the list is already filtered, so dots simply appear/disappear
  // as the filter changes; the active dot tracks the beat in view.
  return (
    <nav
      aria-label="How it works — sections"
      className="absolute left-full top-1/2 ml-4 hidden -translate-y-1/2 flex-col items-center lg:flex xl:ml-6"
    >
      {beats.map((b, i) => {
        const isActive = i === active;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onJump(i)}
            aria-current={isActive ? "true" : undefined}
            aria-label={b.eyebrow}
            title={b.eyebrow}
            className="group my-[3px] grid h-5 w-5 shrink-0 place-items-center"
          >
            <span
              className={`h-2 w-2 rounded-full transition-[transform,background-color] duration-200 ${
                isActive ? "scale-125 bg-orange" : "bg-white/30 group-hover:bg-white/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

// ---- stacked fallback (reduced-motion / iframe / mobile) -------------------
function ChainHowStacked({
  hl,
  onToggle,
  variant,
}: {
  hl: Principle[];
  onToggle: (p: Principle) => void;
  variant: CardVariant;
}) {
  return (
    <section className="bg-[#2e2d33] font-sans text-white antialiased">
      <div className="mx-auto max-w-[64rem] px-6 py-24 md:py-28">
        <Reveal>
          <header className="flex flex-col gap-y-5 md:flex-row md:items-baseline md:justify-between md:gap-x-10">
            <h2 className="text-[1.7rem] font-medium tracking-[-0.02em] text-white md:text-[2rem]">How it works.</h2>
            <PrincipleLegend hl={hl} onToggle={onToggle} />
          </header>
          <p className="mt-5 max-w-[52ch] text-[1.02rem] leading-[1.55] text-neutral-400">
            The advances that make all four true at the same time — native, fast, decentralized, and programmable, on one chain.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-12">
          {(() => {
            const filtered = hl.length === 0 ? BEATS : BEATS.filter((b) => b.principles.some((p) => hl.includes(p)));
            const list = filtered.length ? filtered : BEATS;
            return list.map((b, i) => (
              <Reveal key={b.id} y={0} delay={i * 60}>
                <div>
                  <StatRow beat={b} />
                  <div className="mt-4">
                    <BeatCard beat={b} hl={hl} onToggle={onToggle} variant={variant} />
                  </div>
                </div>
              </Reveal>
            ));
          })()}
        </div>
      </div>
    </section>
  );
}

// ---- pinned scroll-story ---------------------------------------------------
export function ChainHow() {
  const sectionRef = useRef<HTMLElement>(null);
  const sentinels = useRef<(HTMLDivElement | null)[]>([]);
  // active beat tracked by ID (not index) so it stays stable as the filter reshapes the list
  const [activeId, setActiveId] = useState(BEATS[0].id);
  const [hl, setHl] = useState<Principle[]>([]);
  // SSR + first paint = stacked (safe everywhere, no hydration mismatch); a mount
  // effect upgrades to the pinned story only on a real desktop browser.
  const [pinned, setPinned] = useState(false);
  // card layout variant — default is "below" (diagram on top, text below); flip with
  // ?v=center or ?v=fill for review
  const [variant, setVariant] = useState<CardVariant>("below");
  // skip the re-anchor effect's first run (mount / pinned flip) so we never auto-scroll on load
  const didAnchor = useRef(false);

  // FILTERED VIEW — when principles are selected, only the beats that embody one of them remain.
  // M drives the section height AND the sentinel count, so the scroll runs through ONLY the matching
  // beats. activeId is the cursor; activeIndex is its slot within the current (filtered) list.
  const hlKey = hl.join(",");
  const filtered = hl.length === 0 ? BEATS : BEATS.filter((b) => b.principles.some((p) => hl.includes(p)));
  const visible = filtered.length ? filtered : BEATS;
  const M = visible.length;
  const activeIndex = Math.max(0, visible.findIndex((b) => b.id === activeId));
  const beat = visible[activeIndex] ?? visible[0];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const framed = window.frameElement !== null || window.self !== window.top;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    setPinned(!reduce && !framed && desktop);
    const v = new URLSearchParams(window.location.search).get("v");
    if (v === "below" || v === "fill" || v === "center") setVariant(v);
  }, []);

  // active beat = whichever VISIBLE sentinel straddles the viewport center line. Re-runs when the
  // filter changes so it observes the current (filtered) sentinel set with a fresh `visible`.
  useEffect(() => {
    if (!pinned) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = sentinels.current.indexOf(e.target as HTMLDivElement);
            if (i !== -1 && i < visible.length) setActiveId(visible[i].id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sentinels.current.slice(0, M).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned, hlKey]);

  // RE-FILTER → re-anchor: the section height changes with the filter, so scroll onto the beat we
  // want to show. If the current beat survived the filter, keep it (small scroll adjust); if it was
  // filtered out, jump to the first match — that slides the window + re-rolls the stats (the
  // "animation" on a re-filter). Skipped on the first run so load never auto-scrolls.
  useEffect(() => {
    if (!pinned) return;
    if (!didAnchor.current) {
      didAnchor.current = true;
      return;
    }
    const idx = visible.findIndex((b) => b.id === activeId);
    const target = idx === -1 ? 0 : idx;
    if (idx === -1) setActiveId(visible[0].id);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      // two frames: let the new height + sentinels lay out before measuring the scroll target
      raf2 = requestAnimationFrame(() => {
        const el = sentinels.current[target];
        if (!el) return;
        const lenis = (window as Window & { __lenis?: { scrollTo: (t: HTMLElement, o?: Record<string, unknown>) => void } }).__lenis;
        if (lenis) lenis.scrollTo(el, { duration: 0.55 });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hlKey, pinned]);

  // dot-nav jump — route through the shared Lenis instance so it eases smoothly. The pinned story
  // needs NO wheel machine: Lenis owns the page scroll, the sticky frame pins the card, and the
  // IntersectionObserver advances the active beat from scroll position.
  const jump = (i: number) => {
    const el = sentinels.current[i];
    if (!el) return;
    const lenis = (window as Window & { __lenis?: { scrollTo: (t: HTMLElement, o?: Record<string, unknown>) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 0.8 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // multi-select: clicking a principle toggles it in/out of the active set
  const toggle = (p: Principle) => setHl((h) => (h.includes(p) ? h.filter((x) => x !== p) : [...h, p]));

  if (!pinned) return <ChainHowStacked hl={hl} onToggle={toggle} variant={variant} />;

  return (
    <section ref={sectionRef} className="relative bg-[#2e2d33] font-sans text-white antialiased" style={{ height: `calc(${M} * 100svh)` }}>
      {/* pinned frame — fills the viewport while the story advances */}
      {/* pt clears the fixed 80px nav so the title + filter legend aren't tucked under it (the
          legend is the filter control — it must be visible and clickable). */}
      <div className="sticky top-0 flex h-svh flex-col overflow-clip px-6 pb-[clamp(1.75rem,5vh,3.25rem)] pt-[5.5rem]">
        <div className="mx-auto flex w-full max-w-[64rem] flex-1 flex-col">
          {/* header: title + clickable principle legend (the filter) */}
          <header className="flex flex-col gap-y-4 md:flex-row md:items-baseline md:justify-between md:gap-x-10">
            <h2 className="text-[1.7rem] font-medium tracking-[-0.02em] md:text-[2rem]">How it works.</h2>
            <PrincipleLegend hl={hl} onToggle={toggle} />
          </header>

          {/* three stat boxes — re-roll on beat change (keyed by the beat's own index) */}
          <div className="mt-7">
            <StatRow beat={beat} reKey={BEATS.findIndex((b) => b.id === beat.id)} />
          </div>

          {/* beat "window" — the white frame stays put; each visible beat's content slides up & out
              while the next slides in from below (overflow-clipped by the frame). */}
          <div className="relative mt-4 min-h-0 flex-1">
            <div className="relative h-full overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(24,24,24,0.04),0_10px_30px_-16px_rgba(24,24,24,0.12)]">
              {visible.map((b, i) => (
                <div
                  key={b.id}
                  aria-hidden={i !== activeIndex}
                  className="absolute inset-0 p-7 transition-transform duration-[600ms] will-change-transform md:p-9"
                  style={{
                    transitionTimingFunction: SLIDE,
                    transform: `translateY(${(i - activeIndex) * 100}%)`,
                    pointerEvents: i === activeIndex ? "auto" : "none",
                  }}
                >
                  <BeatContent beat={b} hl={hl} onToggle={toggle} variant={variant} fill />
                </div>
              ))}
            </div>
            <DotNav beats={visible} active={activeIndex} onJump={jump} />
          </div>
        </div>
      </div>

      {/* sentinels — M equal bands the IO center line passes through (one per visible beat) */}
      <div className="pointer-events-none absolute inset-0 grid" aria-hidden style={{ gridTemplateRows: `repeat(${M}, 1fr)` }}>
        {visible.map((b, i) => (
          <div
            key={b.id}
            ref={(el) => {
              sentinels.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
