"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RevealWords } from "@/components/reveal";

// The app's feature "beats" — the single source of truth. Each drives one phone screen. Add a
// real `screen` render later (swap the PhoneScreen placeholder) with zero layout change. `chip`
// is an optional UI fragment that floats out of the phone plane on that beat (marquee only).
type Beat = {
  screen: string;
  kicker: string;
  title: string;
  body: string;
  marquee?: boolean;
  chip?: string;
  img?: string;
};

const BEATS: Beat[] = [
  {
    screen: "Home",
    img: "/img/prime/screen-home.webp",
    kicker: "your money",
    title: "Everything, one balance",
    body: "Spend, earn, and borrow live on one screen. The chain, the gas, the addresses — all hidden.",
  },
  {
    screen: "Card",
    img: "/img/prime/screen-card.webp",
    kicker: "spend",
    title: "A card that pays you back in Bitcoin.",
    body: "Tap to pay anywhere. Fund each purchase from stablecoins, a little Bitcoin, or a loan against it — and earn a little Bitcoin back.",
    marquee: true,
  },
  {
    screen: "Earn",
    img: "/img/prime/screen-earn.webp",
    kicker: "earn",
    title: "Yield, simply",
    body: "A short list of savings options, each with its rate and risk in plain language before you commit a cent.",
  },
  {
    screen: "Deposit",
    kicker: "get paid",
    title: "Straight into Bitcoin",
    body: "Point your direct deposit here and your pay lands already converted — stacking sats every payday. Set it once.",
  },
  {
    screen: "Borrow",
    kicker: "borrow",
    title: "Cash in a tap",
    body: "Borrow against your Bitcoin and repay anytime — or lock today's price and pay it off over time. The plumbing stays hidden; your Bitcoin stays yours.",
  },
  {
    screen: "Ramp",
    kicker: "in & out",
    title: "Money in, money out",
    body: "Top up from your bank and cash back out to it, in your own currency — built to work across borders.",
  },
];

export function PrimePocket() {
  const [active, setActive] = useState(0);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  // One IntersectionObserver, a sentinel per beat. rootMargin -50%/-50% collapses the root to a
  // line at the viewport's vertical center; whichever beat crosses it becomes active. This is the
  // ONLY scroll-driven state — it changes a handful of times across the whole section, not per frame.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.beat);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    beatRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Snap feel: after you stop scrolling *inside* the rail, gently settle the nearest beat to
  // center — routed through the one Lenis instance (native CSS scroll-snap can't work while Lenis
  // owns the scroll). Bounded to the rail's span so the rest of the page scrolls freely, desktop +
  // fine-pointer only, and skipped entirely when Lenis is off (reduced motion / touch).
  useEffect(() => {
    const lenis = (window as Window & { __lenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void; scrollTo: (t: number, o?: Record<string, unknown>) => void } }).__lenis;
    if (!lenis) return;
    if (!window.matchMedia("(min-width: 992px)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let settle: number | undefined;
    let locked = false;

    const snap = () => {
      if (locked) return;
      const beats = beatRefs.current.filter(Boolean) as HTMLElement[];
      if (beats.length < 2) return;
      const centerY = window.scrollY + window.innerHeight / 2;
      const first = beats[0].getBoundingClientRect();
      const last = beats[beats.length - 1].getBoundingClientRect();
      const railTop = window.scrollY + first.top;
      const railBottom = window.scrollY + last.top + last.height;
      // only snap while the viewport center is genuinely within the rail
      if (centerY < railTop || centerY > railBottom) return;

      let target = 0;
      let bestDist = Infinity;
      for (const el of beats) {
        const r = el.getBoundingClientRect();
        const elCenter = window.scrollY + r.top + r.height / 2;
        const d = Math.abs(elCenter - centerY);
        if (d < bestDist) {
          bestDist = d;
          target = elCenter - window.innerHeight / 2;
        }
      }
      if (bestDist < 6) return; // already centered
      locked = true;
      lenis.scrollTo(target, {
        duration: 0.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          locked = false;
        },
      });
      window.setTimeout(() => {
        locked = false;
      }, 750);
    };

    const onScroll = () => {
      if (locked) return;
      window.clearTimeout(settle);
      settle = window.setTimeout(snap, 150);
    };

    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
      window.clearTimeout(settle);
    };
  }, []);

  // Scroll-linked parallax tilt on the pinned phone. Gently sweeps rotateY -5deg -> +5deg with a
  // small lift as the stage passes through the viewport, adding depth. Desktop + fine-pointer +
  // motion-allowed only, and ONLY when Lenis is present — Lenis is disabled under reduced motion in
  // this app, so a missing __lenis means no parallax at all (no native fallback). All work happens
  // in a single rAF batch that writes CSS custom properties (never setState), so the beats never
  // re-render on scroll. The transform lives on a wrapper INSIDE the sticky container: putting it on
  // the sticky element or any ancestor would establish a containing block and break position: sticky.
  useEffect(() => {
    const lenis = (window as Window & { __lenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void } }).__lenis;
    if (!lenis) return; // reduced motion / touch: Lenis off => no parallax
    if (!window.matchMedia("(min-width: 992px)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const phone = phoneRef.current;
    const stage = stageRef.current;
    if (!phone || !stage) return;

    // Cache the stage's document-space top/height. Measured once on mount and only on resize —
    // never inside the scroll callback — so no layout is read per frame.
    let stageTop = 0;
    let stageHeight = 1;
    const measure = () => {
      const r = stage.getBoundingClientRect();
      stageTop = r.top + window.scrollY;
      stageHeight = r.height || 1;
    };
    measure();

    let raf = 0;
    const render = () => {
      raf = 0;
      const centerY = window.scrollY + window.innerHeight / 2;
      let p = (centerY - stageTop) / stageHeight; // 0 as the stage enters center, 1 as it leaves
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      const rot = (p * 2 - 1) * 5; // -5deg -> +5deg
      const lift = (0.5 - Math.abs(p - 0.5)) * -24; // subtle lift, peaks ~ -12px at mid-stage
      phone.style.setProperty("--phone-rot", `${rot.toFixed(2)}deg`);
      phone.style.setProperty("--phone-lift", `${lift.toFixed(2)}px`);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    lenis.on("scroll", onScroll);
    window.addEventListener("resize", onResize, { passive: true });
    render(); // set initial values before the first scroll

    return () => {
      lenis.off("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="app" className="relative py-20 lg:py-28">
      <div className="mx-auto w-[92%] max-w-(--container-site)">
        {/* head */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="prime-eyebrow">02</span>
            <span className="h-px w-8 bg-[var(--line)]" />
            <span className="prime-eyebrow">The App</span>
          </div>
          <RevealWords
            as="h2"
            text={"Prime,\nin your pocket."}
            className="font-serif text-[32px] font-normal leading-[1.12] text-[var(--ink)] lg:text-[44px]"
          />
          <RevealWords
            as="p"
            variant="text"
            text={"Feels like the bank app on your home screen. But no company holds your money — and there's no seed phrase."}
            className="max-w-[560px] text-[15px] leading-[1.55] text-[var(--ink-2)] sm:text-[16px]"
          />
        </div>

        {/* stage: pinned phone (left) + scrolling rail (right) */}
        <div
          ref={stageRef}
          className="mt-10 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:gap-14"
        >
          {/* sticky phone — desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="relative">
                {/* spotlight bloom carving the device out of its own light */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[90px]"
                  style={{ background: "radial-gradient(circle, rgba(236,100,29,0.16), transparent 70%)" }}
                />
                {/* parallax wrapper — INSIDE `sticky top-24`, so its transform never becomes a
                    containing block for the sticky ancestor. Vars default to identity (0deg/0px)
                    when the effect is gated off (reduced motion / touch / no Lenis). */}
                <div
                  ref={phoneRef}
                  style={{
                    transform:
                      "perspective(1200px) rotateY(var(--phone-rot,0deg)) translateY(var(--phone-lift,0px))",
                    willChange: "transform",
                  }}
                >
                  <PhoneStage active={active} />
                </div>
              </div>
            </div>
          </div>

          {/* rail */}
          <div className="lg:flex lg:gap-8">
            {/* progress spine — desktop only */}
            <div className="relative hidden w-px shrink-0 bg-[var(--line)] lg:block">
              <div
                className="absolute top-0 left-0 w-px bg-[var(--accent)] transition-[height] duration-500 ease-out"
                style={{ height: `${(active / (BEATS.length - 1)) * 100}%` }}
              />
            </div>

            <div className="flex flex-col gap-14 lg:min-w-0 lg:gap-0">
              {BEATS.map((beat, i) => (
                <div
                  key={beat.screen}
                  data-beat={i}
                  ref={(el) => {
                    beatRefs.current[i] = el;
                  }}
                  className={`pocket-beat flex flex-col justify-center lg:min-h-[58vh] ${
                    i === active ? "is-active" : ""
                  }`}
                >
                  {/* inline screen on mobile (no pinning below lg) */}
                  <div className="mb-6 flex justify-center lg:hidden">
                    <PhoneStage active={i} single />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span className="prime-eyebrow">{beat.kicker}</span>
                  </div>
                  <h3
                    className={`mt-4 font-serif font-normal leading-[1.12] text-[var(--ink)] ${
                      beat.marquee ? "text-[28px] lg:text-[40px]" : "text-[24px] lg:text-[30px]"
                    }`}
                  >
                    {beat.title}
                  </h3>
                  <p className="mt-3 max-w-[460px] text-[15px] leading-[1.55] text-[var(--ink-2)]">
                    {beat.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* mortgage — quiet aspirational close */}
        <div className="mt-14 flex flex-col gap-3 rounded-[20px] border border-dashed border-[var(--line)] px-6 py-6 sm:flex-row sm:items-center sm:gap-5 lg:mt-10">
          <span className="w-fit rounded-full bg-[var(--accent-wash)] px-3 py-1 text-[11px] tracking-[0.14em] text-[var(--accent-ink)] uppercase">
            Coming soon
          </span>
          <span className="font-serif text-[20px] leading-[1.2] text-[var(--ink)]">
            A mortgage backed by your Bitcoin.
          </span>
        </div>
      </div>
    </section>
  );
}

// The device. `single` renders one screen (mobile filmstrip); otherwise all screens are stacked
// and crossfade to the active one.
function PhoneStage({ active, single = false }: { active: number; single?: boolean }) {
  return (
    <div className="relative mx-auto aspect-[9/19] w-full max-w-[300px]">
      <div className="relative h-full w-full rounded-[42px] border border-[var(--line)] bg-[var(--card)] p-2.5 shadow-[0_40px_90px_-45px_rgba(27,26,23,0.5)]">
        {/* speaker pill */}
        <div className="absolute top-3.5 left-1/2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-[var(--line)]" />
        <div className="relative h-full w-full overflow-hidden rounded-[34px]">
          {single ? (
            <PhoneScreen label={BEATS[active].screen} img={BEATS[active].img} />
          ) : (
            BEATS.map((beat, i) => (
              <div
                key={beat.screen}
                className={`pocket-screen absolute inset-0 ${i === active ? "is-active" : ""}`}
              >
                <PhoneScreen label={beat.screen} img={beat.img} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* floating UI chip that lifts out of the phone plane on its beat (marquee only) */}
      {!single && (
        <div aria-hidden className="pointer-events-none absolute top-[28%] -right-5 z-20">
          {BEATS.map((beat, i) =>
            beat.chip ? (
              <div
                key={beat.screen}
                className={`pocket-chip absolute top-0 right-0 ${i === active ? "is-active" : ""}`}
              >
                <div className="prime-screen flex h-16 w-24 items-center justify-center rounded-[12px] border border-[var(--line)] shadow-[0_18px_44px_-22px_rgba(27,26,23,0.55)]">
                  <span className="text-[9px] tracking-[0.16em] text-[var(--ink)] uppercase">
                    [ {beat.chip} ]
                  </span>
                </div>
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

function PhoneScreen({ label, img }: { label: string; img?: string }) {
  if (img) {
    return <Image src={img} alt="" fill sizes="300px" className="object-cover" />;
  }
  return (
    <div className="prime-screen flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
      <span className="text-[11px] tracking-[0.2em] text-[var(--ink)] uppercase">[ {label} ]</span>
      <span className="text-[10px] text-[var(--muted)]">app screen · placeholder</span>
    </div>
  );
}
