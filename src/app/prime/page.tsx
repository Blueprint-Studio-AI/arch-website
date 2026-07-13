import type { ReactNode, CSSProperties } from "react";
import Image from "next/image";
import { EXTERNAL } from "@/lib/site";
import { ArchButton } from "@/components/button";
import { RevealWords, Reveal, RevealGroup } from "@/components/reveal";
import { PrimePocket } from "@/components/prime-pocket";
import { PrimeEngine } from "@/components/prime-engine";
import { PrimePasskey } from "@/components/prime-passkey";

// "Link out" targets. Prime is one page today with two sections (web terminal + mobile app); each
// points at the real product. These two are placeholders until confirmed:
//   TODO(tyler): the live testnet Prime web app URL (app.arch.network?) — not in site.ts yet.
//   TODO(tyler): App Store / early-access link — the consumer app isn't shipped, so this is a
//   waitlist for now, not a live "download".
const PRIME_WEB_APP = "#";
const GET_THE_APP = "#";

export default function Prime() {
  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <header className="relative isolate overflow-hidden">
        {/* Hero lifestyle photo AS the section background — a placeholder for now, blurred + faded
            so the headline stays legible and the image melts into the page. Drop a warm, sunlit
            shot (a person using Prime) in here as the background layer. */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(158deg, #efe1ca 0%, #f5ebdb 34%, #faf7ef 72%)" }}
          />
          <div
            className="prime-bloom prime-bloom-a absolute top-[-12%] right-[-6%] h-[64vh] w-[64vh] rounded-full blur-[110px]"
            style={{ background: "radial-gradient(circle, rgba(236,100,29,0.24), transparent 70%)" }}
          />
          <div
            className="prime-bloom prime-bloom-b absolute top-[34%] left-[4%] h-[48vh] w-[48vh] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(214,158,90,0.20), transparent 70%)" }}
          />
          {/* fade into the page at the bottom */}
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-b from-transparent to-[var(--paper)]" />
        </div>

        <div className="relative mx-auto flex min-h-[86vh] w-[92%] max-w-(--container-site) flex-col justify-center pt-32 pb-24 lg:pt-36">
          <div className="flex max-w-[680px] flex-col items-start gap-7">
            <div className="flex items-center gap-3">
              <span className="prime-eyebrow">00</span>
              <span className="h-px w-8 bg-[var(--line)]" />
              <span className="prime-eyebrow">Arch Prime</span>
            </div>
            <RevealWords
              as="h1"
              text={"Put your Bitcoin\nto work."}
              className="font-serif text-[clamp(48px,9vw,84px)] font-light leading-[0.98] tracking-[-0.01em] text-[var(--ink)]"
            />
            <RevealWords
              as="p"
              variant="text"
              text={
                "Earn on your Bitcoin, borrow against it, swap and pool it — without ever giving up the keys. Real markets, settled in native Bitcoin."
              }
              className="max-w-[540px] text-[16px] leading-[1.55] text-[var(--ink-2)] sm:text-[18px]"
            />
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <ArchButton href={PRIME_WEB_APP}>Launch on web →</ArchButton>
              <a
                href={GET_THE_APP}
                className="inline-flex items-center rounded-xl border border-[var(--line)] bg-[var(--card)] px-[22px] py-4 text-[var(--ink)] transition-colors duration-300 hover:border-[var(--ink)]"
              >
                Get the app
              </a>
            </div>
          </div>
        </div>

        {/* discreet note that the backdrop is a stand-in */}
        <span className="pointer-events-none absolute right-5 bottom-4 z-10 text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase opacity-70">
          Background — lifestyle photo (placeholder)
        </span>
      </header>

      <main>
        {/* ─────────────────── 01 · THE TERMINAL ─────────────────── */}
        <section id="terminal" className="relative py-20 lg:py-28">
          <div className="mx-auto w-[92%] max-w-(--container-site)">
            <SectionHead
              index="01"
              eyebrow="The Terminal"
              title={"Everything your Bitcoin\ncan do, on one screen."}
              intro={
                "Prime opens on a dashboard built to manage Bitcoin capital: balance, net yield, borrowing power, and every holding next to its best rate. Rates, collateral, and transaction status are clear before you act — not after."
              }
            />
            {/* Product render on a contrasting warm-dark "stage" so the light dashboard pops off the
                page instead of blending into the paper. Orange glow bleeds up behind it. */}
            <div className="relative mt-10 lg:mt-14">
              <Reveal y={20} skew={0} duration={1} className="relative w-full">
                <div
                  className="prime-render relative overflow-hidden rounded-[22px] p-2.5 shadow-[0_50px_110px_-55px_rgba(27,26,23,0.5)] sm:p-4 lg:p-6"
                  style={{ background: "radial-gradient(135% 130% at 50% -10%, #352619 0%, #241a12 100%)" }}
                >
                  {/* warm ember glow rising behind the top edge */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(52% 38% at 50% 10%, rgba(236,100,29,0.14), transparent 72%)" }}
                  />
                  <div className="relative overflow-hidden rounded-[12px] border border-white/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.75)]">
                    <Image
                      src="/img/prime/terminal-dashboard.webp"
                      width={1915}
                      height={925}
                      alt="The Arch Prime dashboard — net balance, net yield, borrowing power, and holdings on one screen"
                      className="h-auto w-full"
                      sizes="(max-width: 992px) 90vw, 1000px"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
            <RevealGroup as="div" className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                delay={0}
                kicker="swap"
                title="Native BTC trades"
                text="Sell BTC, get USDC — routed through Arch's own AMM, with the rate, fee, and slippage-protected minimum shown before you sign. Settles to native Bitcoin, no wrapped token in between."
              />
              <FeatureCard
                delay={0.08}
                kicker="lend"
                title="Earn on idle BTC"
                text="Supply BTC or stablecoins into Arch Core markets and earn on assets that would otherwise sit still — with curator, depth, and withdrawable liquidity in view up front."
              />
              <FeatureCard
                delay={0.16}
                kicker="pools"
                title="Provide liquidity"
                text="A real liquidity venue: a concentrated-liquidity AMM with the precision controls a serious LP expects — set your range and see your distribution before you commit capital."
              />
            </RevealGroup>
          </div>
        </section>

        {/* ─────────────── BORROW · MULTI-COLLATERAL ─────────────── */}
        <section className="relative bg-[var(--paper-well)] py-20 lg:py-28">
          <div className="mx-auto w-[92%] max-w-(--container-site)">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:items-end lg:gap-16">
              <RevealWords
                as="h2"
                text={"Borrow against\nmore than Bitcoin."}
                className="font-serif text-[32px] font-normal leading-[1.12] text-[var(--ink)] lg:text-[44px]"
              />
              <RevealWords
                as="p"
                variant="text"
                text={
                  "Post collateral and draw stablecoins without selling. It isn't only Bitcoin — borrow against tokenized gold, a T12 Treasury fund, or STRC, with your LTV, rate, and ceiling clear before you open a position."
                }
                className="max-w-[520px] text-[15px] leading-[1.55] text-[var(--ink-2)] sm:text-[16px]"
              />
            </div>
            <RevealGroup as="div" className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CollateralCard order={0} delay={0} name="BTC" text="Your Bitcoin, kept native." ltv="80%" />
              <CollateralCard order={1} delay={0.06} name="Gold" text="Tokenized gold." ltv="70%" />
              <CollateralCard order={2} delay={0.12} name="T12 Fund" text="Short-duration U.S. Treasuries." ltv="76%" />
              <CollateralCard order={3} delay={0.18} name="STRC" text="Yield-bearing collateral." ltv="66%" />
            </RevealGroup>
          </div>
        </section>

        {/* ─────────── 02 · THE APP — pinned phone that swaps per feature ─────────── */}
        <PrimePocket />

        {/* ───────────────── ONBOARDING · DOWNLOAD ───────────────── */}
        <section className="relative bg-[var(--paper-well)] py-20 lg:py-24">
          <div className="mx-auto grid w-[92%] max-w-(--container-site) gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
            <div className="flex flex-col gap-7">
              <RevealWords
                as="h2"
                text={"Take Prime with you."}
                className="font-serif text-[30px] font-normal leading-[1.12] text-[var(--ink)] lg:text-[40px]"
              />
              <RevealGroup as="div" className="flex flex-col gap-4">
                <OnboardRow
                  title="Sign in with Face ID"
                  text="No seed phrase, no twelve words to lose. Your wallet is created and secured with passkeys — nothing to write down."
                />
                <OnboardRow
                  title="Connect your wallet"
                  text="Prefer your own wallet? Connect it. Either way, your assets stay native Bitcoin, and moving them takes a validator threshold — not one company."
                />
              </RevealGroup>
            </div>
            <Reveal
              y={16}
              skew={0}
              className="flex w-full flex-col items-start gap-5 rounded-[24px] border border-[var(--line)] bg-[var(--card)] p-7 lg:w-[320px]"
            >
              <PrimePasskey />
              <div className="flex flex-col gap-1">
                <p className="font-serif text-[22px] leading-[1.15] text-[var(--ink)]">Easy to use. Still yours.</p>
                <p className="text-[14px] leading-[1.5] text-[var(--ink-2)]">
                  iOS · early access. Join the list and we&rsquo;ll send an invite.
                </p>
              </div>
              <a
                href={GET_THE_APP}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-[22px] py-3.5 text-white transition-opacity duration-300 hover:opacity-90"
              >
                Get the app
              </a>
            </Reveal>
          </div>
        </section>

        {/* ───────────────── THE SAME ENGINE, AS AN API ───────────────── */}
        <section className="relative py-20 lg:py-28">
          <div className="mx-auto w-[92%] max-w-(--container-site)">
            <SectionHead
              index="03"
              eyebrow="For builders"
              title={"The same engine,\nas an API."}
              intro={
                "Every primitive in Prime is also an embeddable API. Fintechs, neobanks, and wallets can offer Bitcoin yield, lending, swaps, and native settlement to their own users — without building Bitcoin infrastructure themselves."
              }
            />
            <PrimeEngine className="mt-12" />
            <Reveal y={12} skew={0} className="mt-8">
              <a
                href={EXTERNAL.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[15px] text-[var(--accent-ink)] transition-opacity duration-300 hover:opacity-80"
              >
                Explore the APIs →
              </a>
            </Reveal>
          </div>
        </section>

        {/* ───────────────────── CLOSING CTA BAND ───────────────────── */}
        <section className="relative pt-16 pb-28 lg:pt-20 lg:pb-36">
          <div className="mx-auto flex w-[92%] max-w-(--container-site) flex-col items-center gap-8 text-center">
            <RevealWords
              as="h2"
              text={"Your money. On Bitcoin."}
              className="font-serif text-[clamp(36px,6vw,64px)] font-light leading-[1.02] text-[var(--ink)]"
            />
            <RevealWords
              as="p"
              variant="text"
              text={"Real Bitcoin. Real markets. Settled back on Bitcoin, every time."}
              className="max-w-[560px] text-[16px] leading-[1.5] text-[var(--ink-2)] sm:text-[18px]"
            />
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
              <ArchButton href={PRIME_WEB_APP}>Launch on web →</ArchButton>
              <a
                href={GET_THE_APP}
                className="inline-flex items-center rounded-xl border border-[var(--line)] bg-[var(--card)] px-[22px] py-4 text-[var(--ink)] transition-colors duration-300 hover:border-[var(--ink)]"
              >
                Get the app
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ───────────────────────── building blocks ───────────────────────── */

function SectionHead({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="prime-eyebrow">{index}</span>
        <span className="h-px w-8 bg-[var(--line)]" />
        <span className="prime-eyebrow">{eyebrow}</span>
      </div>
      <RevealWords
        as="h2"
        text={title}
        className="font-serif text-[32px] font-normal leading-[1.12] text-[var(--ink)] lg:text-[44px]"
      />
      {intro ? (
        <RevealWords
          as="p"
          variant="text"
          text={intro}
          className="max-w-[560px] text-[15px] leading-[1.55] text-[var(--ink-2)] sm:text-[16px]"
        />
      ) : null}
    </div>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      <span className="prime-eyebrow">{children}</span>
    </div>
  );
}

function FeatureCard({
  kicker,
  title,
  text,
  delay = 0,
}: {
  kicker: string;
  title: string;
  text: string;
  delay?: number;
}) {
  return (
    <Reveal
      y={16}
      skew={0}
      delay={delay}
      className="flex flex-col gap-4 rounded-[20px] border border-[var(--line)] bg-[var(--card)] p-6 transition-colors duration-300 hover:border-[var(--accent)]/40 md:p-7"
    >
      <Kicker>{kicker}</Kicker>
      <h3 className="font-serif text-[22px] font-normal leading-[1.15] text-[var(--ink)]">{title}</h3>
      <p className="text-[14px] leading-[1.55] text-[var(--ink-2)]">{text}</p>
    </Reveal>
  );
}

function CollateralCard({
  name,
  text,
  delay = 0,
  order = 0,
  ltv = "74%",
}: {
  name: string;
  text: string;
  delay?: number;
  order?: number;
  ltv?: string;
}) {
  // Reveal (outer) carries the staggered rise + fade; the inner .prime-card carries the
  // "dealt from a deck" rotate-settle (scroll-driven) and the hover lift — kept on a separate
  // element so its transitions aren't clobbered by Reveal's inline transform/transition.
  return (
    <Reveal y={16} skew={0} delay={delay} className="prime-card-wrap">
      <div
        className="prime-card relative flex flex-col gap-3 rounded-[20px] border border-[var(--line)] bg-[var(--card)] p-6"
        style={{ "--deal": order } as CSSProperties}
      >
        <span className="prime-eyebrow">collateral</span>
        <h3 className="font-serif text-[26px] font-normal leading-none text-[var(--ink)]">{name}</h3>
        <p className="text-[14px] leading-[1.45] text-[var(--ink-2)]">{text}</p>
        {/* max-LTV micro-bar — a quiet hairline that comes alive on hover. Ornamental, not a real
            figure: the label appears and the accent fill sweeps to a qualitative width. */}
        <div className="prime-ltv" aria-hidden>
          <span className="prime-ltv-label prime-eyebrow">max LTV</span>
          <span className="prime-ltv-track">
            <span className="prime-ltv-fill" style={{ width: ltv }} />
          </span>
        </div>
      </div>
    </Reveal>
  );
}

function OnboardRow({ title, text }: { title: string; text: string }) {
  return (
    <Reveal y={14} skew={0} className="flex gap-4 border-t border-[var(--line)] pt-4">
      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
      <div className="flex flex-col gap-1">
        <p className="text-[16px] font-medium text-[var(--ink)]">{title}</p>
        <p className="max-w-[440px] text-[14px] leading-[1.5] text-[var(--ink-2)]">{text}</p>
      </div>
    </Reveal>
  );
}

