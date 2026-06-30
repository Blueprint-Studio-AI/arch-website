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
  /** action label (React key) */
  tag: string;
  /** upper-left line icon (24×24 stroke paths, four-rules style) */
  icon: ReactNode;
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
    icon: (
      <path
        d="M12 3v10m0 0-4-4m4 4 4-4M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    title: "Borrow without selling.",
    desc: "Draw a loan against native BTC — without a wrapped IOU.",
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
    icon: (
      <path
        d="M4 16.5 9.5 11l3.5 3.5L20 7M20 7h-4.5M20 7v4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
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
    icon: (
      <path
        d="M4 9h14m0 0-3.5-3.5M18 9l-3.5 3.5M20 15H6m0 0 3.5 3.5M6 15l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
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
            Borrow, earn, and swap against native Bitcoin.<br/>
            It stays yours the whole way through.
          </p>
        </Reveal>

        {/* app cards — the card links to the docs (its back says "More in the docs"); hover flips it
            to PEEK the real code. The "See it live" link sits BELOW the card, outside the anchor. */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {APPS.map((app, i) => (
            <Reveal key={app.tag} delay={i * 80}>
              {/* the card is NOT a link — it just flips on hover to peek the code. The only clickable
                  things are the docs comment (on the back) and the live link (below). */}
              <div className="group block h-[360px] [perspective:1400px] md:h-[380px]">
                <div className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none]">
                  {/* FRONT — typographic: icon top-left, title + body centered vertically */}
                  <div className="absolute inset-0 flex flex-col rounded-[8px] bg-white p-6 ring-1 ring-inset ring-black/[0.06] [-webkit-backface-visibility:hidden] [backface-visibility:hidden] md:p-8">
                    {/* small light-gray word mark — a quiet visual tag in the corner, not a CTA.
                        Page sans (Geist), normal case + tracking. */}
                    <span className="text-[0.82rem] font-medium text-neutral-400" aria-hidden="true">
                      {app.tag}
                    </span>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-balance text-[1.4rem] font-medium leading-[1.18] tracking-[-0.02em] text-neutral-900">
                        {app.title}
                      </h4>
                      <p className="mt-3 text-pretty text-[0.92rem] leading-[1.5] text-neutral-600">{app.desc}</p>
                    </div>
                  </div>
                  {/* BACK — deep-indigo (the WhyBand band) + cream/tan code for contrast & brand tie */}
                  <div className="absolute inset-0 flex flex-col rounded-[8px] bg-[#1f1c3e] p-5 [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-6">
                    <div className="mb-3 flex items-center">
                      <RustMark className="h-[18px] w-[18px] text-light/70" />
                    </div>
                    <pre className="min-h-0 flex-1 overflow-hidden text-[0.66rem] leading-[1.55] text-light/[0.88]">
                      <code className="font-mono">{highlightRust(app.code)}</code>
                    </pre>
                    {/* docs link disguised as the snippet's trailing comment — dimmed + underlined
                        like a clickable comment; this is the card's only docs affordance. */}
                    <a
                      href={app.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 self-start font-mono text-[0.66rem] leading-[1.55] text-light/45 underline decoration-light/25 underline-offset-2 transition-colors hover:text-light hover:decoration-light/60"
                    >
                      {"// more in the docs"}
                    </a>
                  </div>
                </div>
              </div>
              {/* live case study — separate link, centered below the card */}
              <a
                href={app.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 flex items-center justify-center gap-1.5 text-[0.82rem] font-medium text-orange transition-opacity hover:opacity-70"
              >
                See it live on {app.liveName} <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
          ))}
        </div>

        {/* closing beat: builder CTA — full-width large rounded gray card (Jaidon's band, our palette) */}
        <Reveal className="mt-20 md:mt-28">
          <div className="rounded-[20px] bg-[#2e2d33] px-6 pt-10 pb-14 text-center md:px-8 md:pt-12 md:pb-16">
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
