"use client";

/* ─────────────────────────────────────────────────────────────────────────
   PrimeEngine — "the same engine, as an API."

   A pulsing orange engine core; four connector lines draw out to four output
   cards, an endpoint node lands on each, the cards slide in, and a faint
   "signal" pulse keeps flowing hub → output (the engine, running). Plays its
   intro once on scroll-in; the flow loops quietly after.

   Self-contained (Tailwind + inline styles + a local <style> for keyframes).
   Reads --card / --line / --ink / --accent / --accent-ink / --accent-wash from
   the Prime page. Reduced motion → final frame, no motion.
   ───────────────────────────────────────────────────────────────────────── */

import { useSyncExternalStore } from "react";
import { useInView } from "@/lib/use-in-view";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

// Reduced-motion via useSyncExternalStore — SSR-safe, hydration-safe, lint-clean.
function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

type Item = { title: string; text: string };

const ITEMS: Item[] = [
  { title: "Yield", text: "Earn on stablecoins and BTC via curated vault strategies." },
  { title: "Lending & Borrowing", text: "Borrow against BTC, or supply to earn." },
  { title: "Swap", text: "Native BTC trading at fixed-spread execution." },
  { title: "Custody & Settlement", text: "Native Bitcoin settlement via threshold-signature infrastructure." },
];

// Desktop connector geometry — REAL pixels. The SVG viewBox equals the box's pixel size and the
// column is a fixed width, so preserveAspectRatio="none" scales 1:1 and the curves never distort.
const CONN_W = 156;
const ROW_H = 118;
const CONN_H = ROW_H * ITEMS.length;
const rowCenter = (i: number) => ROW_H * i + ROW_H / 2;

const lineDelay = (i: number) => 0.35 + i * 0.14;
const nodeDelay = (i: number) => lineDelay(i) + 0.4;
const cardDelay = (i: number) => lineDelay(i) + 0.28;

export function PrimeEngine({ className }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const shown = reduced || inView;
  const animate = !reduced;

  return (
    <div ref={ref} className={className}>
      <style>{`
        @keyframes pe-pulse  { 0% { transform: scale(1); opacity: .4 } 70%,100% { transform: scale(2); opacity: 0 } }
        @keyframes pe-breathe{ 0%,100% { transform: scale(1) } 50% { transform: scale(1.04) } }
        /* a single highlight dash travelling hub -> output along the path (pathLength=1 → units are
           fractions of the line, so it's identical on every line regardless of length/scale) */
        @keyframes pe-flow   { from { stroke-dashoffset: 0 } to { stroke-dashoffset: -1 } }
      `}</style>

      {/* ───────────────── desktop / tablet: hub → fan → cards ───────────────── */}
      {/* capped width + centered so the cards read as a tidy diagram, not empty edge-to-edge bars */}
      <div
        className="relative mx-auto hidden max-w-[940px] lg:grid"
        style={{
          gridTemplateColumns: `176px ${CONN_W}px minmax(0, 1fr)`,
          gridTemplateRows: `repeat(${ITEMS.length}, ${ROW_H}px)`,
        }}
      >
        {/* engine core */}
        <div style={{ gridColumn: 1, gridRow: `1 / span ${ITEMS.length}` }} className="flex items-center justify-center">
          <Hub shown={shown} animate={animate} />
        </div>

        {/* connector fan — one SVG sized to its real pixel box (no distortion) */}
        <div style={{ gridColumn: 2, gridRow: `1 / span ${ITEMS.length}` }} className="relative">
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${CONN_W} ${CONN_H}`}
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            {ITEMS.map((_, i) => {
              const yc = rowCenter(i);
              const d = `M0 ${CONN_H / 2} C ${CONN_W * 0.55} ${CONN_H / 2}, ${CONN_W * 0.45} ${yc}, ${CONN_W} ${yc}`;
              return (
                <g key={i}>
                  {/* base line, draws in */}
                  <path
                    d={d}
                    stroke="var(--accent)"
                    strokeOpacity={0.85}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={shown ? 0 : 1}
                    style={{ transition: animate ? `stroke-dashoffset 0.6s ${EASE} ${lineDelay(i)}s` : "none" }}
                  />
                  {/* travelling "signal" dash (only once shown + motion allowed) */}
                  {shown && animate ? (
                    <path
                      d={d}
                      stroke="var(--accent)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      pathLength={1}
                      strokeDasharray="0.05 0.95"
                      style={{ animation: `pe-flow 2.4s linear ${nodeDelay(i)}s infinite` }}
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {/* endpoint node where each line meets its card */}
          {ITEMS.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--accent)] bg-[var(--paper)]"
              style={{
                top: `${(rowCenter(i) / CONN_H) * 100}%`,
                opacity: shown ? 1 : 0,
                transform: shown ? "translate(50%, -50%) scale(1)" : "translate(50%, -50%) scale(0)",
                transition: animate
                  ? `opacity 0.3s ${EASE} ${nodeDelay(i)}s, transform 0.4s ${EASE} ${nodeDelay(i)}s`
                  : "none",
              }}
            />
          ))}
        </div>

        {/* output cards */}
        {ITEMS.map((item, i) => (
          <div
            key={item.title}
            style={{
              gridColumn: 3,
              gridRow: i + 1,
              opacity: shown ? 1 : 0,
              transform: shown ? "none" : "translateX(-16px)",
              transition: animate
                ? `opacity 0.6s ${EASE} ${cardDelay(i)}s, transform 0.6s ${EASE} ${cardDelay(i)}s`
                : "none",
            }}
            className="flex items-center py-2 pl-7"
          >
            <OutputCard {...item} />
          </div>
        ))}
      </div>

      {/* ───────────────── mobile: core, then a stacked grid ───────────────── */}
      <div className="flex flex-col items-center lg:hidden">
        <Hub shown={shown} animate={animate} />
        <svg className="my-5 h-10 w-3 overflow-visible" viewBox="0 0 12 40" preserveAspectRatio="none" fill="none" aria-hidden>
          <path
            d="M6 0 V40"
            stroke="var(--accent)"
            strokeOpacity={0.6}
            strokeWidth={1.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={shown ? 0 : 1}
            style={{ transition: animate ? `stroke-dashoffset 0.5s ${EASE} 0.4s` : "none" }}
          />
        </svg>
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "none" : "translateY(14px)",
                transition: animate
                  ? `opacity 0.5s ${EASE} ${cardDelay(i)}s, transform 0.5s ${EASE} ${cardDelay(i)}s`
                  : "none",
              }}
            >
              <OutputCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── engine core ─────────────────────────── */

function Hub({ shown, animate }: { shown: boolean; animate: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex h-[132px] w-[132px] items-center justify-center"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "scale(1)" : "scale(0.82)",
          transition: animate ? `opacity 0.7s ${EASE}, transform 0.7s ${EASE}` : "none",
        }}
      >
        <span
          className="absolute h-[132px] w-[132px] rounded-full"
          style={{ background: "radial-gradient(circle, var(--accent-wash) 0%, transparent 68%)" }}
        />
        {[0, 1].map((k) => (
          <span
            key={k}
            className="absolute h-[84px] w-[84px] rounded-full"
            style={{
              background: "var(--accent)",
              opacity: 0,
              animation: animate && shown ? `pe-pulse 3s ${EASE} ${k * 1.5}s infinite` : "none",
            }}
          />
        ))}
        <div
          className="relative flex h-[84px] w-[84px] items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(155deg, var(--accent) 0%, var(--accent-ink) 100%)",
            boxShadow:
              "0 12px 28px -10px color-mix(in srgb, var(--accent-ink) 60%, transparent), inset 0 1px 1px rgba(255,255,255,0.3)",
            animation: animate && shown ? "pe-breathe 5s ease-in-out infinite" : "none",
          }}
        >
          <EngineGlyph />
        </div>
      </div>
      <span className="prime-eyebrow">The engine</span>
    </div>
  );
}

function EngineGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
      <circle cx="17" cy="17" r="3.2" fill="#fff" />
      <path
        d="M17 8.5a8.5 8.5 0 0 1 8.5 8.5M17 4.2a12.8 12.8 0 0 1 12.8 12.8"
        stroke="#fff"
        strokeOpacity="0.9"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M17 25.5A8.5 8.5 0 0 1 8.5 17M17 29.8A12.8 12.8 0 0 1 4.2 17"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────────────────── output card ─────────────────────────── */

function OutputCard({ title, text }: Item) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-[18px] border border-[var(--line)] bg-[var(--card)] px-5 py-4 shadow-[0_16px_40px_-30px_rgba(27,26,23,0.5)] transition-colors duration-300 hover:border-[var(--accent-ink)]">
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        <h3 className="font-serif text-[19px] font-normal leading-[1.15] text-[var(--ink)]">{title}</h3>
      </div>
      <p className="text-[13px] leading-[1.45] text-[var(--ink-2)]">{text}</p>
    </div>
  );
}
