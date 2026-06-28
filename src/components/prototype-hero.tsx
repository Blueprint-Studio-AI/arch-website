"use client";

import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/nav";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

type Item = { c: string; b: string; lite?: string };
type Section = { h2: string; body: string; list?: Item[] };

// Copied letter-for-letter from the /chain page (chain-hero.tsx). Mapped to illustration layers 1..4.
const SECTIONS: Section[] = [
  {
    h2: "How does it work?",
    body: "Arch is a Bitcoin-native VM, chain, and validator network. Together they execute on Bitcoin UTXOs, and settle assets back to Bitcoin’s ledger.",
  },
  {
    h2: "Native tech",
    body: "What’s built on Arch lives on Bitcoin: same coins, same wallets, same ledger. Making that true took new technology at almost every layer:",
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
    body: "Those primitives compose into real markets. From trading and lending to prime brokerage and more, Arch unlocks a DeFi ecosystem on native Bitcoin. It’s fast, easy to build on, and native all the way down.",
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

export default function PrototypeHero() {
  const [p, setP] = useState(0);
  const [vw, setVw] = useState(1280);
  const [vh, setVh] = useState(800);
  const [heroH, setHeroH] = useState(360);
  const [sel, setSel] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const callIllo = (fn: string, ...args: unknown[]) => {
    try {
      const w = iframeRef.current?.contentWindow as unknown as Record<string, (...a: unknown[]) => void>;
      w?.[fn]?.(...args);
    } catch { /* iframe not ready */ }
  };

  useEffect(() => {
    const onScroll = () => setP(window.scrollY / window.innerHeight);
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    onScroll(); onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // the illustration posts back which element is hovered (via its own dots) — mirror it on the list
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { arch?: string; id?: string };
      if (!d || typeof d !== "object" || !d.arch) return;
      if (d.arch === "sel" && d.id) setSel(d.id);
      else if (d.arch === "clear") setSel(null);
    };
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("message", onMsg);
    };
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => setHeroH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- scroll model ----
  // [0 .. 0.8]   rect grows from a centred band to full-bleed, rising over the hero (z-index)
  // [0.8 .. ]    rect stays full; scrolling advances the illustration through layers 1→4 with copy
  const grow = clamp(p / 0.8, 0, 1);
  const entered = grow > 0.7;
  const layer = clamp(1 + Math.floor(Math.max(0, p - 0.8) / 0.7), 1, SECTIONS.length);
  const active = SECTIONS[layer - 1];

  useEffect(() => { callIllo("__archSetState", layer); }, [layer]);

  const containerW = Math.min(vw * 0.92, 1300);
  const startH = Math.min(vh * 0.62, 600);
  const NAV = 140, GAP = 40, TOP_BIAS = 36;
  const groupH = heroH + GAP + startH;
  const heroTop0 = Math.max(NAV, (vh - groupH) / 2 + TOP_BIAS);
  const stageC0 = heroTop0 + heroH + GAP + startH / 2;

  const stageW = lerp(containerW, vw, grow);
  const stageH = lerp(startH, vh, grow);
  const stageCY = lerp(stageC0, vh / 2, grow);

  const stageStyle = {
    top: `${stageCY.toFixed(0)}px`,
    width: `${stageW.toFixed(0)}px`,
    height: `${stageH.toFixed(0)}px`,
    borderRadius: `${lerp(22, 0, grow).toFixed(1)}px`,
  };

  return (
    <>
      <Nav forceDark bare />
      <div className={`proto-scope ${entered ? "entered" : ""}`}>
        <div className="proto-center">
          <div className="proto-pin">
            <section className="proto-hero" style={{ top: `${heroTop0.toFixed(0)}px` }} ref={heroRef}>
              <span className="chip"><i />Testnet live · mainnet 2026</span>
              <h1>The financial network<br />for Native Bitcoin</h1>
              <p className="sub">Real Bitcoin, made programmable.<br />No wrapping. No migration.</p>
              <div className="btns">
                <a className="btn btn--primary" href="#">See how it works ↓</a>
                <a className="btn btn--ghost" href="#">Read the docs</a>
              </div>
            </section>

            <div className="proto-stage" style={stageStyle}>
              <div className="proto-rect" />
              <div className="proto-illo">
                <iframe ref={iframeRef} src="/illustration/index.html?s=1" title="Arch illustration" scrolling="no" />
              </div>
            </div>

            <div className="proto-layer-copy" style={{ opacity: entered ? 1 : 0 }}>
              <div className="inner" key={layer}>
                <h2>{active.h2}</h2>
                <p>{active.body}</p>
                {active.list && (
                  <ul className="flist">
                    {active.list.map((it) => (
                      <li
                        key={it.c}
                        className={sel === it.c ? "on" : ""}
                        onMouseEnter={() => { setSel(it.c); callIllo("__archSelect", it.c); }}
                        onMouseLeave={() => { setSel(null); callIllo("__archClearSel"); }}
                      >
                        <b>{it.b}</b>
                        {it.lite && <span className="lite">{it.lite}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
