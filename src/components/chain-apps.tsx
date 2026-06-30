// Movement 4 of the Chain page below-fold ("What you can do" — §3.x), ported from
// public/below/index.html (static HTML + vanilla CSS) to a React + Tailwind component.
// This is the white-paper band (band--do = transparent bg) → dark text on white.
// "Use it" sub-beat: three flip-to-code app cards (Borrow/Earn/Swap) in the home
// institutions-card visual language, then the "For builders" closing CTA.
//
// Token mapping (chain.css → Tailwind theme): cream → light, purple → dark-purple,
// purple-2 → purple, orange → orange; gray ramp ink/body/muted/faint → neutral-900/600/500/400;
// hairline (--hair) → border-black/[0.08].

import type { ReactNode } from "react";
import { Reveal } from "./chain-reveal";
import { RustMark } from "./rust-mark";
import { EXTERNAL } from "@/lib/site";

// dependency-free Rust syntax highlighter for the card-back code peeks. Tokenizes into
// comments / strings / numbers / idents / punctuation and tints them for the indigo card:
// keywords + macros orange, types (PascalCase) gold, comments dimmed; everything else cream.
const RUST_KW = new Set([
  "pub", "fn", "let", "mut", "return", "use", "impl", "struct", "enum", "self", "as", "ref", "match", "if", "else", "for", "while", "loop", "move", "where", "const", "static", "in",
]);
function highlightRust(code: string): ReactNode {
  const re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*!?)|(\s+)|([^\s])/g;
  const out: ReactNode[] = [];
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code)) !== null) {
    const [, comment, str, num, ident, ws] = m;
    if (comment !== undefined) out.push(<span key={k++} className="text-light/40">{comment}</span>);
    else if (str !== undefined) out.push(<span key={k++} className="text-[#e6c98a]">{str}</span>);
    else if (num !== undefined) out.push(<span key={k++} className="text-[#f0a36a]">{num}</span>);
    else if (ident !== undefined) {
      const macro = ident.endsWith("!");
      const bare = macro ? ident.slice(0, -1) : ident;
      const cls = RUST_KW.has(bare) || macro ? "text-[#f4814a]" : /^[A-Z]/.test(bare) ? "text-[#e6c98a]" : "";
      out.push(cls ? <span key={k++} className={cls}>{ident}</span> : <span key={k++}>{ident}</span>);
    } else if (ws !== undefined) out.push(ws);
    else out.push(m[6]);
  }
  return out;
}

type App = {
  /** action label (also React key) */
  tag: string;
  /** display title — brand serif */
  title: string;
  /** one tight line of our copy */
  desc: string;
  /** live case-study name + url (opens in new tab) */
  liveName: string;
  liveUrl: string;
  /** developer docs url */
  docsUrl: string;
  /** real on-chain primitive shown on the card back */
  code: string;
};

const APPS: App[] = [
  {
    tag: "Borrow",
    title: "Borrow against it. Keep it.",
    desc: "Draw a loan against native BTC — not a wrapped IOU.",
    liveName: "Arch Prime",
    liveUrl: "https://www.arch.network/",
    docsUrl: "https://docs.arch.network/",
    code: `// loan against native-BTC collateral
pub fn borrow(
    ctx: Context<Borrow>,
    amount: u64,
    utxo: UtxoMeta,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    require!(
        validate_utxo_ownership(&utxo)?,
        ErrorCode::InvalidCollateral,
    );
    // lock the UTXO into the pool
    lock_collateral(pool, utxo)?;
    pool.total_borrows += amount;
    Ok(())
}`,
  },
  {
    tag: "Earn",
    title: "Put idle Bitcoin to work.",
    desc: "Earn yield that accrues to real Bitcoin — not a receipt.",
    liveName: "HoneyB",
    liveUrl: "https://www.honeybtc.com/",
    docsUrl: "https://docs.arch.network/",
    code: `// supply native BTC, earn supply APY
pub fn deposit(
    ctx: Context<Deposit>,
    utxo: UtxoMeta,
) -> Result<()> {
    let pool = &mut ctx.accounts.pool;
    require!(
        validate_utxo_ownership(&utxo)?,
        ErrorCode::InvalidUTXO,
    );
    // move the UTXO into the pool
    pool_deposit(pool, utxo)?;
    pool.total_deposits += utxo.amount;
    update_utilization_rate(pool)?;
    Ok(())
}`,
  },
  {
    tag: "Swap",
    title: "Swap against real liquidity.",
    desc: "Pooled, always-on liquidity at a tight, predictable spread.",
    liveName: "Arch Prime",
    liveUrl: "https://www.arch.network/",
    docsUrl: "https://docs.arch.network/",
    code: `// settle a swap on native Bitcoin
fn accept_offer(
    accts: &[AccountInfo],
    offer_id: u64,
) -> Result<(), ProgramError> {
    let mut offer = load_offer(accts)?;
    require!(offer.is_active(&offer_id));
    // both legs settle, or neither does
    transfer_runes(maker, taker, give)?;
    transfer_runes(taker, maker, want)?;
    offer.status = Completed;
    store_offer(accts, &offer)?;
    Ok(())
}`,
  },
];

export function ChainApps() {
  return (
    <section className="bg-light font-sans text-black antialiased">
      <div className="mx-auto max-w-[64rem] px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        {/* sub-beat: use it — flat serif title, no eyebrow */}
        <Reveal>
          <h3 className="font-serif text-[2.25rem] font-light leading-[1.05] tracking-[-0.01em] text-neutral-900 md:text-[2.75rem]">
            Now, use them.
          </h3>
          <p className="mt-4 max-w-[44ch] text-pretty text-[1rem] leading-[1.55] text-neutral-600">
            Borrow, earn, and swap against native Bitcoin — and it stays{" "}
            <span className="text-neutral-900">yours</span> the whole way through.
          </p>
        </Reveal>

        {/* app cards — the card itself flips on hover to PEEK the real code (purely visual);
            the Live + docs CTAs live BELOW the card, outside the hover zone, so they stay clickable. */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {APPS.map((app, i) => (
            <Reveal key={app.tag} delay={i * 80}>
              {/* the whole card links to the live product (Arch Prime / HoneyB); hover flips it to
                  peek the real code. No more floating links underneath. */}
              <a
                href={app.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-[360px] [perspective:1400px] md:h-[380px]"
              >
                <div className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none]">
                  {/* FRONT */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-[12px] bg-white p-6 ring-1 ring-inset ring-black/[0.06] [-webkit-backface-visibility:hidden] [backface-visibility:hidden] md:p-8">
                    <div>
                      <div className="text-[0.8rem] font-medium tracking-[0.01em] text-orange">{app.tag}</div>
                      <h4 className="mt-3 text-balance font-serif text-[1.4rem] font-light leading-[1.18] tracking-[-0.01em] text-neutral-900">
                        {app.title}
                      </h4>
                      <p className="mt-2.5 text-pretty text-[0.9rem] leading-[1.5] text-neutral-600">{app.desc}</p>
                    </div>
                    {/* footer — names the live product this card opens */}
                    <div className="flex items-center gap-1.5 text-[0.82rem] font-medium text-orange">
                      See it live on {app.liveName} <span aria-hidden="true">↗</span>
                    </div>
                  </div>
                  {/* BACK — deep-indigo (the WhyBand band) + cream/tan code for contrast & brand tie */}
                  <div className="absolute inset-0 flex flex-col rounded-[12px] bg-[#1f1c3e] p-5 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-6">
                    <div className="mb-3 flex items-center">
                      <RustMark className="h-[18px] w-[18px] text-light/70" />
                    </div>
                    <pre className="min-h-0 flex-1 overflow-hidden text-[0.66rem] leading-[1.55] text-light/[0.88]">
                      <code className="font-mono">{highlightRust(app.code)}</code>
                    </pre>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* closing beat: builder CTA — full-width large rounded gray card (Jaidon's band, our palette) */}
        <Reveal className="mt-20 md:mt-28">
          <div className="rounded-[44px] bg-[#2e2d33] px-6 py-14 text-center md:px-8 md:py-16">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-light/55">For builders</div>
            <h3 className="mx-auto mt-4 max-w-[20ch] text-balance text-[1.7rem] font-medium leading-[1.15] tracking-[-0.02em] text-light md:text-[2rem]">
              These primitives are <em className="font-serif not-italic font-normal text-orange">yours</em> to build on.
            </h3>
            <div className="mx-auto mt-7 inline-flex items-center overflow-hidden rounded-[10px] border border-black/[0.08] bg-white">
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
                className="group inline-flex items-center gap-[7px] rounded-[11px] bg-[linear-gradient(180deg,#f4814a,#ec641d)] px-[18px] py-[11px] text-[0.94rem] font-medium text-white no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_1.5px_2px_rgba(0,0,0,0.13),0_0_0_1px_#c9520f] transition-[transform,filter] duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:brightness-[1.04] active:scale-[0.96]"
              >
                Add to Claude Code{" "}
                <span aria-hidden="true" className="transition-transform duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:translate-x-[2px]">
                  ↗
                </span>
              </a>
              <a
                href={EXTERNAL.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[7px] rounded-[11px] border border-light/25 px-[18px] py-[11px] text-[0.94rem] font-medium text-light no-underline transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-light/10 active:scale-[0.96]"
              >
                Read the docs
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
