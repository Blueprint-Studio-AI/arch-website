"use client";

import { useEffect, useRef, useState } from "react";

type Item = { c: string; b: string; lite?: string };
type Section = { h2: string; body: string; list?: Item[] };

const SECTIONS: Section[] = [
  {
    h2: "How does it work?",
    body: "Arch is a Bitcoin-native VM, chain, and validator network. Together they execute on Bitcoin UTXOs, and settle assets back to Bitcoin’s ledger.",
  },
  {
    h2: "Native tech",
    body: "What’s built on Arch lives on Bitcoin — same coins, same wallets, same ledger. Making that true took new technology at almost every layer:",
    list: [
      { c: "settle", b: "Direct Bitcoin settlement", lite: "assets are never wrapped" },
      { c: "utxo", b: "UTXO-native execution", lite: "programs run on real UTXOs" },
      { c: "addr", b: "Per-account addresses", lite: "verifiable on any explorer" },
      { c: "perutxo", b: "Per-account UTXOs", lite: "funds are never pooled" },
      { c: "taproot", b: "Taproot account model", lite: "works with existing wallets" },
      { c: "schnorr", b: "Threshold Schnorr (FROST + ROAST)", lite: "no single key ever exists" },
      { c: "syscall", b: "Native Bitcoin syscalls", lite: "no oracle in between" },
      { c: "vm", b: "Bitcoin-native VM", lite: "Solana’s eBPF, rebuilt on UTXOs" },
      { c: "dpos", b: "Fast dPoS consensus", lite: "180ms blocks, 1,500 TPS" },
    ],
  },
  {
    h2: "Financial primitives",
    body: "Speed, reliability, and general programmability become financial infrastructure on Bitcoin. Pooling on real UTXOs enables AMMs, oracle feeds enable collateral enforcement, and safe lending carries credit, perps, and structured products.",
    list: [
      { c: "pools", b: "Pooled liquidity" },
      { c: "oracle", b: "Oracle price feeds" },
      { c: "collateral", b: "Collateral enforcement" },
      { c: "liquidation", b: "Liquidation engine" },
      { c: "issuance", b: "Token issuance" },
      { c: "risk", b: "Risk & margin" },
    ],
  },
  {
    h2: "Finance unlocks",
    body: "Those primitives compose into real markets — trading, lending, prime brokerage, and more. Swap, Lend, and Prime aren’t bolted together; they’re co-located on one chain so they reinforce each other.",
    list: [
      { c: "dexs", b: "DEXs" },
      { c: "lend", b: "Lending & credit" },
      { c: "prime", b: "Prime brokerage" },
      { c: "vaults", b: "Vaults" },
      { c: "stables", b: "Stablecoins" },
      { c: "rwas", b: "RWAs" },
      { c: "looping", b: "Looping" },
    ],
  },
];

const STEP_LABELS = ["Hero", "Layer 1", "Layer 2", "Layer 3", "Layer 4", "Placeholder"];
// Per snap point: ty = text top (vh), gap = vh from text to artwork, is = illustration scale.
const DEFAULT_STEPS = [
  { ty: 12, gap: 2, is: 1.25 },
  { ty: 15, gap: 4, is: 1.6 },
  { ty: 10, gap: 3, is: 1.38 },
  { ty: 12, gap: 3, is: 1.34 },
  { ty: 12, gap: 6, is: 1.34 },
  { ty: 12, gap: 4, is: 1.0 },
];
// Mobile keeps its own keyframes (smaller art, tighter top) — tuned via the same levers.
const DEFAULT_STEPS_M = [
  { ty: 9, gap: 7, is: 1.15 },
  { ty: 18, gap: 8, is: 1.15 },
  { ty: 5, gap: 0, is: 1.15 },
  { ty: 6, gap: 5, is: 1.15 },
  { ty: 6, gap: 9, is: 1.15 },
  { ty: 6, gap: 4, is: 1.15 },
];
const DEFAULT_X = -45; // horizontal cheat (px), negative = left
const DEFAULT_X_M = -40; // mobile horizontal cheat
const SNAP_POINTS = 5; // hero + 4 layers snap; placeholder (index 5) scrolls free

const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const illoRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastLayer = useRef(0);
  const lastActive = useRef(-1);
  const updateRef = useRef<() => void>(() => {});
  const onLoadRef = useRef<() => void>(() => {});

  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [stepsM, setStepsM] = useState(DEFAULT_STEPS_M);
  const [isMobile, setIsMobile] = useState(false);
  const activeSteps = isMobile ? stepsM : steps;
  const stepsRef = useRef(activeSteps);
  stepsRef.current = activeSteps;
  const [illoX, setIlloX] = useState(DEFAULT_X);
  const [illoXM, setIlloXM] = useState(DEFAULT_X_M);
  const activeX = isMobile ? illoXM : illoX;
  const illoXRef = useRef(activeX);
  illoXRef.current = activeX;
  const [active, setActive] = useState(0);
  const [showLevers, setShowLevers] = useState(true);
  const [ready, setReady] = useState(false);

  const callIllo = (fn: string, ...args: unknown[]) => {
    try {
      const w = iframeRef.current?.contentWindow as unknown as Record<string, (...a: unknown[]) => void>;
      w?.[fn]?.(...args);
    } catch {
      /* iframe not ready */
    }
  };
  const clearHighlights = () => document.querySelectorAll(".flist li.on").forEach((l) => l.classList.remove("on"));

  useEffect(() => {
    const mq = window.matchMedia("(max-width:480px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    // The iframe's #world camera (WS) keeps whichever layer is active vertically centered, so the
    // artwork sits at a constant place inside the iframe. But at load #world has no transform yet,
    // and setState slides it to WS(1) = -150px over a 1s transition — measuring before that lands
    // ~150px too high. So force the camera to its settled spot with the transition off, read the
    // top once, restore the transition, and lock it. One stable value for every layer kills the
    // per-layer jump and the mid-pan "shoot down"; `gap` reads as text-to-top-of-artwork.
    let atTop = 240;
    let atLocked = false;
    const measureTop = () => {
      if (atLocked) return true;
      try {
        const doc = iframeRef.current?.contentDocument;
        const win = iframeRef.current?.contentWindow as unknown as { __archSetState?: (n: number) => void } | null;
        const world = doc?.getElementById("world") as HTMLElement | null;
        const l1 = doc?.getElementById("L1");
        if (!doc || !world || !l1 || !win?.__archSetState) return false;
        const prev = world.style.transition;
        world.style.transition = "none"; // apply WS(1) instantly so we read the settled top
        win.__archSetState(1);
        lastLayer.current = 1;
        void world.getBoundingClientRect(); // force reflow
        const r = l1.getBoundingClientRect();
        world.style.transition = prev;
        if (r.height > 40) { atTop = r.top; atLocked = true; return true; }
      } catch { /* not ready */ }
      return false;
    };
    const setLayer = (n: number) => {
      if (n === lastLayer.current) return;
      const w = iframeRef.current?.contentWindow as unknown as { __archSetState?: (n: number) => void } | null;
      if (w?.__archSetState) {
        w.__archSetState(n);
        lastLayer.current = n;
      }
    };

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let raf = 0;
    // ---- immersive state machine ----
    // The illustration + typography form a self-contained animated space. JS drives the
    // animation STATE (prog), not the page scroll: a gesture past the threshold advances
    // prog with a snap, and the real scrollbar is nudged silently underneath so leaving
    // into the placeholder feels natural — the user never sees the page itself scroll.
    const lastIdx = SNAP_POINTS - 1;
    let idx = 0; // target state 0..lastIdx
    let prog = 0; // animated progress that actually drives the visuals
    let mode: "snap" | "free" = "snap";
    let animating = false;
    let acc = 0; // delta accumulated during the current accelerating gesture
    let canFire = true; // gate: re-armed after the snap finishes or a real pause
    let scrollings: number[] = []; // recent |deltaY| history for momentum / acceleration detection
    let prevWheel = 0;
    let touchY = 0;
    let touchFired = false;
    let progRaf = 0;
    let iwin: Window | null = null; // illustration iframe swallows wheel/touch — attach there too
    let feedback = 0; // -1..1 live sub-threshold gesture nudge
    let intro = 1; // load intro: illustration starts a touch low and drifts up into place
    let introRaf = 0;
    let revealed = false;
    const update = () => {
      raf = 0;
      const root = rootRef.current;
      if (!root) return;
      const vh = window.innerHeight / 100;
      const N = SECTIONS.length;
      const t = mode === "snap" ? prog : Math.min(N + 1, Math.max(0, window.scrollY / window.innerHeight));
      const s = stepsRef.current;

      const fb = feedback;
      const base: Record<number, number> = {};
      root.querySelectorAll<HTMLElement>(".panel").forEach((el) => {
        const i = Number(el.dataset.i);
        const d = t - i;
        const o = Math.max(0, 1 - Math.abs(d) * 1.9) * (1 - 0.22 * Math.abs(fb));
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateX(-50%) translateY(${(d * 16 - fb * 14).toFixed(1)}px)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        base[i] = el.offsetTop + el.offsetHeight; // stable bottom (ignores the push)
      });

      const i0 = Math.min(N, Math.floor(t));
      const i1 = Math.min(N, i0 + 1);
      const f = Math.min(1, t - Math.floor(t));
      const ci = Math.min(N - 1, i0);
      const ci1 = Math.min(N - 1, i1);
      const textBottom = lerp(base[ci] ?? 0, base[ci1] ?? 0, f);
      const at = atTop;
      const gap = lerp(s[i0].gap, s[i1].gap, f) * vh;
      const scale = lerp(s[i0].is, s[i1].is, f) * Math.min(1, window.innerHeight / 880);
      const y = textBottom + gap - at * scale - fb * 8 + intro * 42;
      if (illoRef.current) {
        illoRef.current.style.transform = `translate(${illoXRef.current}px, ${y.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        illoRef.current.style.opacity = Math.max(0, Math.min(1, 1 - (t - N))).toFixed(3); // fade out into the placeholder
      }

      const cue = root.querySelector<HTMLElement>(".scrollcue");
      if (cue) cue.style.opacity = Math.max(0, 1 - t * 3).toFixed(3);

      const a = Math.round(t);
      if (a !== lastActive.current) {
        lastActive.current = a;
        setActive(a);
        clearHighlights();
        callIllo("__archClearSel");
      }
      setLayer(Math.min(N, Math.max(1, a)));
    };
    updateRef.current = update;

    // ---- gesture → animation state ----
    const THRESH = 55; // accelerating wheel units to trip a snap (lower = more sensitive)
    const TOUCH_THRESH = 50;
    const PROG_DUR = 460;
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
    const avg = (arr: number[], n: number) => {
      const len = arr.length;
      if (!len) return 0;
      const k = Math.min(n, len);
      let s = 0;
      for (let i = len - k; i < len; i++) s += arr[i];
      return s / k;
    };

    // Keep the real scrollbar in step with the animation state, silently — there's no
    // visible page scroll because every on-screen layer is fixed and driven by prog.
    const syncScroll = () => {
      const target = Math.round(prog * window.innerHeight);
      if (Math.abs(window.scrollY - target) > 1) window.scrollTo(0, target);
    };

    const animateTo = (n: number) => {
      idx = n;
      feedback = 0;
      const from = prog;
      if (Math.abs(n - from) < 0.001) { update(); return; }
      animating = true;
      const t0 = performance.now();
      if (progRaf) cancelAnimationFrame(progRaf);
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / PROG_DUR);
        prog = from + (n - from) * easeOut(p);
        syncScroll();
        update();
        if (p < 1) progRaf = requestAnimationFrame(step);
        else { prog = n; syncScroll(); update(); window.setTimeout(() => { animating = false; acc = 0; canFire = true; }, 60); }
      };
      progRaf = requestAnimationFrame(step);
    };

    const advance = (dir: number) => {
      acc = 0;
      feedback = 0;
      if (dir > 0 && idx >= lastIdx) { // exit the immersive space → hand off to free scroll
        mode = "free";
        canFire = true;
        prog = lastIdx;
        window.scrollTo(0, lastIdx * window.innerHeight);
        update();
        window.scrollBy(0, Math.round(window.innerHeight * 0.16));
        return;
      }
      const n = idx + dir;
      if (n < 0) { canFire = true; update(); return; }
      animateTo(n);
    };

    const enterFromPlaceholder = () => {
      mode = "snap";
      canFire = true;
      scrollings = [];
      idx = lastIdx;
      prog = lastIdx;
      syncScroll();
      update();
    };

    const overLevers = (e: Event) => !!(e.target as Element | null)?.closest?.(".levers");

    const onWheel = (e: WheelEvent) => {
      if (overLevers(e)) return;
      if (mode === "free") {
        if (e.deltaY < 0 && window.scrollY <= lastIdx * window.innerHeight + 4) { e.preventDefault(); enterFromPlaceholder(); }
        return;
      }
      e.preventDefault();
      const now = performance.now();
      if (now - prevWheel > 200) { scrollings = []; acc = 0; canFire = true; } // a real pause = a fresh gesture
      prevWheel = now;
      scrollings.push(Math.abs(e.deltaY));
      if (scrollings.length > 80) scrollings.shift();
      if (animating || !canFire) return;
      // accelerating (or steady) = an intentional push; decelerating = leftover momentum to ignore.
      const accel = avg(scrollings, 10) >= avg(scrollings, 40);
      if (!accel) { acc = 0; feedback = 0; update(); return; }
      acc += e.deltaY;
      feedback = Math.max(-1, Math.min(1, acc / THRESH));
      update();
      if (Math.abs(acc) >= THRESH) {
        canFire = false; // re-armed when the snap finishes or after a pause
        const dir = acc > 0 ? 1 : -1;
        acc = 0;
        feedback = 0;
        advance(dir);
      }
    };

    const onTouchStart = (e: TouchEvent) => { if (overLevers(e)) return; touchY = e.touches[0].clientY; touchFired = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (overLevers(e)) return;
      if (mode === "free") {
        if (e.touches[0].clientY - touchY > 0 && window.scrollY <= lastIdx * window.innerHeight + 4) {
          e.preventDefault();
          enterFromPlaceholder();
          touchY = e.touches[0].clientY; // reset origin + lock so this same swipe can't also step a layer
          touchFired = true;
        }
        return;
      }
      e.preventDefault();
      if (animating || touchFired) return; // one swipe = one step
      const dy = touchY - e.touches[0].clientY;
      feedback = Math.max(-1, Math.min(1, dy / TOUCH_THRESH));
      update();
      if (dy >= TOUCH_THRESH) { touchFired = true; feedback = 0; advance(1); }
      else if (dy <= -TOUCH_THRESH) { touchFired = true; feedback = 0; advance(-1); }
    };
    const onTouchEnd = () => { touchFired = false; feedback = 0; if (mode === "snap" && !animating) update(); };

    const onScroll = () => {
      // iOS momentum safety net: a flick up out of the placeholder coasts with no touch/wheel
      // events firing, so the gesture re-entry never runs and the page free-scrolls un-snapped
      // back through a layer. Catch the overshoot past the boundary and re-engage the snap space.
      if (mode === "free" && window.scrollY < lastIdx * window.innerHeight) { enterFromPlaceholder(); return; }
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => { if (mode === "snap") syncScroll(); update(); };
    // The iframe captures wheel/touch over its area, so the window listeners never see
    // them — attach the same handlers inside the iframe (it's same-origin).
    const attachIframe = () => {
      try {
        const w = iframeRef.current?.contentWindow;
        if (!w || w === iwin) return;
        iwin = w;
        w.addEventListener("wheel", onWheel, { passive: false });
        w.addEventListener("touchstart", onTouchStart, { passive: true });
        w.addEventListener("touchmove", onTouchMove, { passive: false });
        w.addEventListener("touchend", onTouchEnd, { passive: true });
      } catch { /* not ready */ }
    };
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { arch?: string; id?: string };
      if (!d || typeof d !== "object" || !d.arch) return;
      clearHighlights();
      if (d.arch === "sel" && d.id) document.querySelector(`.flist li[data-c="${d.id}"]`)?.classList.add("on");
    };

    // ---- load sequence: measure layer 1, settle layout, then fade in (hides the drift) ----
    const runIntro = () => {
      const t0 = performance.now();
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / 700);
        intro = 1 - easeOut(p);
        update();
        if (p < 1) introRaf = requestAnimationFrame(step);
      };
      introRaf = requestAnimationFrame(step);
    };
    onLoadRef.current = () => {
      lastLayer.current = 0;
      attachIframe();
      measureTop();
      requestAnimationFrame(() => updateRef.current());
    };
    // Fade in only once fonts are ready AND the artwork top is measured, so the first visible
    // frame is already correct — then drift up into place once (no load-time jerk, no double).
    let fontsDone = false;
    let finishPoll = 0;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      if (finishPoll) clearInterval(finishPoll);
      setReady(true);
      runIntro();
    };
    const tryFinish = () => {
      const ok = measureTop();
      updateRef.current();
      if (fontsDone && ok) reveal();
    };
    if (document.fonts?.ready) document.fonts.ready.then(() => { fontsDone = true; tryFinish(); }).catch(() => { fontsDone = true; });
    finishPoll = window.setInterval(tryFinish, 120);
    const loadFallback = window.setTimeout(() => { fontsDone = true; reveal(); }, 1800);

    update();
    attachIframe();
    const attachT = window.setTimeout(attachIframe, 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("message", onMessage);
      if (iwin) {
        iwin.removeEventListener("wheel", onWheel);
        iwin.removeEventListener("touchstart", onTouchStart);
        iwin.removeEventListener("touchmove", onTouchMove);
        iwin.removeEventListener("touchend", onTouchEnd);
      }
      if (raf) cancelAnimationFrame(raf);
      if (progRaf) cancelAnimationFrame(progRaf);
      if (introRaf) cancelAnimationFrame(introRaf);
      if (finishPoll) clearInterval(finishPoll);
      clearTimeout(loadFallback);
      clearTimeout(attachT);
    };
  }, []);

  useEffect(() => {
    updateRef.current();
  }, [steps, stepsM, isMobile, illoX, illoXM]);

  const setLever = (key: "ty" | "gap" | "is", val: number) =>
    (isMobile ? setStepsM : setSteps)((prev) => prev.map((st, i) => (i === active ? { ...st, [key]: val } : st)));

  return (
    <main className={`root${ready ? " ready" : ""}`} ref={rootRef}>
      <div className="illo-stage" aria-hidden>
        <div className="glow" />
        <div className="illo" ref={illoRef}>
          <iframe
            ref={iframeRef}
            src="/illustration/index.html"
            title="Arch chain illustration"
            scrolling="no"
            onLoad={() => onLoadRef.current()}
          />
        </div>
      </div>

      <div className="copyover">
        <div className="panel" data-i="0" style={{ top: `${activeSteps[0].ty}vh` }}>
          <span className="chip"><i className="dot" />Testnet live · mainnet 2026</span>
          <h1>
            <span className="h1-pre">The financial network for</span>
            <span className="h1-serif">Native Bitcoin</span>
          </h1>
          <p className="sub">Real Bitcoin, made programmable.<br />No wrapping. No migration.</p>
          <div className="btns">
            <a className="btn btn--primary" href="#">See how it works <span className="ar">↓</span></a>
            <a className="btn btn--ghost" href="#">Read the docs</a>
          </div>
        </div>

        {SECTIONS.map((sec, idx) => (
          <div className="panel panel--sec" data-i={idx + 1} key={idx} style={{ top: `${activeSteps[idx + 1].ty}vh` }}>
            <h2>{sec.h2}</h2>
            <p className="body">{sec.body}</p>
            {sec.list && (
              <ul className="flist">
                {sec.list.map((it) => (
                  <li
                    key={it.c}
                    data-c={it.c}
                    onMouseEnter={() => {
                      clearHighlights();
                      (document.querySelector(`.flist li[data-c="${it.c}"]`) as HTMLElement)?.classList.add("on");
                      callIllo("__archSelect", it.c);
                    }}
                    onMouseLeave={() => {
                      clearHighlights();
                      callIllo("__archClearSel");
                    }}
                  >
                    <b>{it.b}</b>
                    {it.lite && <span className="lite">{it.lite}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <span className="scrollcue" aria-hidden>scroll ↓</span>

      <div className="snaps" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="snap-pt" data-i={i} key={i} />
        ))}
      </div>
      <section className="pt--end" data-i="5">
        <div className="ph">Placeholder</div>
      </section>

      {/* levers tuning panel — hidden for demo; uncomment this block to re-enable
      {showLevers ? (
        <div className="levers">
          <div className="lev-head">
            <span>{isMobile ? "mobile" : "desktop"} · {STEP_LABELS[active]}</span>
            <button onClick={() => setShowLevers(false)}>×</button>
          </div>
          <label>
            <span>text top · {activeSteps[active].ty}vh</span>
            <input type="range" min={2} max={40} value={activeSteps[active].ty} onChange={(e) => setLever("ty", Number(e.target.value))} />
          </label>
          <label>
            <span>gap to illustration · {activeSteps[active].gap}vh</span>
            <input type="range" min={0} max={24} value={activeSteps[active].gap} onChange={(e) => setLever("gap", Number(e.target.value))} />
          </label>
          <label>
            <span>illustration size · {activeSteps[active].is.toFixed(2)}×</span>
            <input type="range" min={0.5} max={1.8} step={0.01} value={activeSteps[active].is} onChange={(e) => setLever("is", Number(e.target.value))} />
          </label>
          <label>
            <span>illustration X · {activeX}px</span>
            <input type="range" min={-200} max={200} value={activeX} onChange={(e) => (isMobile ? setIlloXM : setIlloX)(Number(e.target.value))} />
          </label>
          <pre>{`${isMobile ? "mobile" : "desktop"} · X ${activeX}px\n` + activeSteps.map((st, i) => `${STEP_LABELS[i]}: ty ${st.ty} · gap ${st.gap} · ${st.is.toFixed(2)}×`).join("\n")}</pre>
        </div>
      ) : (
        <button className="levers-open" onClick={() => setShowLevers(true)}>levers</button>
      )}
      */}
    </main>
  );
}
