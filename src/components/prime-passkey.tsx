"use client";

import { useInView } from "@/lib/use-in-view";

// Faux BIP39 words — blurred to read as "seed phrase", exact words never legible.
const WORDS = [
  "ripple",
  "cabin",
  "ember",
  "north",
  "violet",
  "anchor",
  "meadow",
  "cobalt",
  "saffron",
  "timber",
  "harbor",
  "lyric",
];

/**
 * PrimePasskey — a once-on-scroll micro-moment for the Prime onboarding card.
 *
 * A "12-word seed phrase" card tumbles in, then crumples away (fade + shrink +
 * blur) as a Face-ID / passkey mark resolves in its place and a checkmark ticks
 * in. The feeling: "we took the paper away." ~1.6s, plays once.
 *
 * Reduced motion: renders only the final passkey ✓, static.
 */
export function PrimePasskey({ className }: { className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ aspectRatio: "1 / 1" }}
      className={[
        "pp-root relative isolate w-full max-w-[200px] overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--paper-well)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <style>{`
        .pp-stage { position: absolute; inset: 0; display: grid; place-items: center; }
        .pp-cell { grid-area: 1 / 1; }

        /* pre-play resting states (hidden) */
        .pp-seed { opacity: 0; }
        .pp-passkey { opacity: 0; transform: scale(0.7); }
        .pp-wash { opacity: 0; }
        .pp-frame, .pp-check { stroke-dasharray: 1; stroke-dashoffset: 1; }

        /* the sequence, gated behind .pp-play so it fires once on scroll-in */
        .pp-play .pp-seed { animation: pp-seed 1.2s both; }
        .pp-play .pp-passkey { animation: pp-pop 0.5s cubic-bezier(0.16,1,0.3,1) 0.82s both; }
        .pp-play .pp-wash { animation: pp-fade 0.5s ease-out 0.82s both; }
        .pp-play .pp-frame { animation: pp-draw 0.55s cubic-bezier(0.33,1,0.68,1) 0.9s both; }
        .pp-play .pp-check { animation: pp-draw 0.42s cubic-bezier(0.33,1,0.68,1) 1.2s both; }

        @keyframes pp-seed {
          0%   { opacity: 0; transform: translateY(-16px) rotate(-9deg) scale(0.92); filter: blur(2px); animation-timing-function: cubic-bezier(0.16,1,0.3,1); }
          18%  { opacity: 1; transform: translateY(0) rotate(-3deg) scale(1); filter: blur(0); }
          55%  { opacity: 1; transform: translateY(0) rotate(-3deg) scale(1); filter: blur(0); animation-timing-function: cubic-bezier(0.55,0,0.9,0.35); }
          100% { opacity: 0; transform: translateY(10px) rotate(4deg) scale(0.82); filter: blur(7px); }
        }
        @keyframes pp-pop {
          0%   { opacity: 0; transform: scale(0.7); }
          60%  { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pp-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

        /* reduced motion: no seed card, no sequence — just the resolved mark */
        @media (prefers-reduced-motion: reduce) {
          .pp-seed { display: none !important; }
          .pp-passkey { opacity: 1 !important; transform: none !important; animation: none !important; }
          .pp-wash { opacity: 1 !important; animation: none !important; }
          .pp-frame, .pp-check { stroke-dashoffset: 0 !important; animation: none !important; }
        }
      `}</style>

      <div className={inView ? "pp-stage pp-play" : "pp-stage"}>
        {/* 1 · the seed-phrase card that gets taken away */}
        <div
          className="pp-seed pp-cell w-[78%] rounded-[13px] border border-[var(--line)] bg-[var(--card)] p-[7%] shadow-[0_10px_24px_-14px_rgba(27,26,23,0.45)]"
        >
          <div className="mb-[9%] flex items-center gap-[5px]">
            <span className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--muted)]" />
            <span className="text-[8px] font-medium uppercase tracking-[0.13em] text-[var(--muted)]">
              12-word seed phrase
            </span>
          </div>
          <div className="grid grid-cols-3 gap-x-[6px] gap-y-[5px]">
            {WORDS.map((word, i) => (
              <div key={i} className="flex items-baseline gap-[3px] overflow-hidden leading-none">
                <span className="text-[7px] tabular-nums text-[var(--muted)]">{i + 1}</span>
                <span
                  className="select-none whitespace-nowrap text-[8px] text-[var(--ink-2)]"
                  style={{ filter: "blur(2.4px)" }}
                >
                  {word}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2 · the passkey / Face-ID mark that resolves in its place */}
        <svg className="pp-passkey pp-cell h-[54%] w-[54%]" viewBox="0 0 72 72" fill="none">
          <rect className="pp-wash" x="14" y="14" width="44" height="44" rx="14" fill="var(--accent-wash)" />
          <g stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path className="pp-frame" pathLength={1} d="M16 28 L16 21 Q16 16 21 16 L28 16" />
            <path className="pp-frame" pathLength={1} d="M56 28 L56 21 Q56 16 51 16 L44 16" />
            <path className="pp-frame" pathLength={1} d="M56 44 L56 51 Q56 56 51 56 L44 56" />
            <path className="pp-frame" pathLength={1} d="M16 44 L16 51 Q16 56 21 56 L28 56" />
          </g>
          <path
            className="pp-check"
            pathLength={1}
            d="M27 37 L33 43 L46 29"
            fill="none"
            stroke="var(--accent-ink)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
