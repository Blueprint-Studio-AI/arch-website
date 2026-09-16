import Image from "next/image";
import { EXTERNAL } from "@/lib/site";
import { ArchButton } from "@/components/button";
import { Reveal, RevealClip, RevealGroup, RevealWords } from "@/components/reveal";
import { Faq } from "@/components/faq";
import { Tile } from "@/components/prime-tile";
import { Mark, type MarkKind } from "@/components/prime-marks";
import { PrimeHow } from "@/components/prime-how";
import { PrimeEarn } from "@/components/prime-earn";
import { PRIME_FAQS } from "@/data/prime-faqs";
// The Built-on-Arch card renders the /chain hero's city illustration; chain.css carries its
// (.chain-scope-namespaced) styles, which only load on /chain otherwise. Same trick as the home page.
import { ChainCity } from "@/components/chain-city";
import { CountUp } from "@/components/count-up";
import "../chain/chain.css";

// Wireframe v3 of the Prime page. Story: Hold → Prime → Earn → Keep (Borrow) → More (Boost) →
// Everything (vision) → Trust (Chain). See docs/prime-page-brief.md.
// Imagery is the real brand set: logos from Brand/Arch Prime, photography and cutouts from the
// app's public folder, token marks in vector. ponytail: "Launch Prime" points at EXTERNAL.prime
// (the X account) until the app has a URL.

const LAUNCH = EXTERNAL.prime;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[12px] uppercase tracking-[0.1em] text-grey">{children}</div>;
}

const H2 = "font-serif text-[32px] font-normal leading-[1.18] lg:text-[36px]";
const BODY = "text-[14px] leading-[150%] text-grey sm:text-[16px]";

export default function Prime() {
  return (
    <>
      {/* HERO — the promise. The app's own home hero photograph (three towers, worm's-eye) as
          the stand-in until the person-using-the-product shot exists. */}
      <header className="relative bg-white pt-[calc(5rem+24px)] pb-16 text-black md:pt-[calc(5rem+48px)] md:pb-25">
        <div className="site-container grid gap-x-2.5 gap-y-10 lg:grid-cols-2 lg:items-center">
          <div className="flex max-w-[520px] flex-col gap-8">
            <Image src="/img/prime/arch-prime-logo.svg" alt="Arch Prime" width={172} height={24} priority className="h-6 w-auto self-start" />
            <h1 className="font-serif text-[clamp(52px,10vw,92px)] font-light leading-[95%]">Just hold it.</h1>
            <p className="max-w-[44ch] text-[16px] leading-[150%] text-grey lg:text-[20px]">
              You already hold Bitcoin. Make it primeBTC and it earns while it sits. Borrow against it, trade it, boost it. It stays yours.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <ArchButton href={LAUNCH}>Launch Prime</ArchButton>
              <a href="#how" className="text-[16px] underline-offset-4 hover:underline">
                See how it works
              </a>
            </div>
          </div>
          <RevealClip className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] lg:aspect-[5/4]">
            <Image src="/img/prime/hero.webp" alt="" fill priority sizes="(max-width: 992px) 92vw, 640px" className="object-cover" />
          </RevealClip>
        </div>
      </header>

      <main>
        {/* HOW — pinned scroll story: Hold → Prime → Earn → Use */}
        <PrimeHow />

        {/* EARN — the hub, tabs mirroring the app */}
        <section id="earn" className="relative bg-white py-25 text-black">
          <div className="site-container">
            <RevealGroup as="div" className="flex max-w-[520px] flex-col gap-4">
              <Eyebrow>Earn</Eyebrow>
              <RevealWords as="h2" text={"Four ways to put it to work."} className={H2} />
              <RevealWords as="p" variant="text" text={"Choose how much of the work you want to do yourself."} className={BODY} />
            </RevealGroup>
            <div className="mt-10">
              <PrimeEarn />
            </div>
          </div>
        </section>

        {/* BORROW — keep it, use it. The app's Borrow band: the bank on racing green. */}
        <section id="borrow" className="relative bg-[#f7f6f6] py-25 text-black">
          <div className="site-container grid gap-x-2.5 gap-y-10 lg:grid-cols-2 lg:items-center">
            <RevealGroup as="div" className="flex max-w-[460px] flex-col gap-8">
              <Eyebrow>Borrow</Eyebrow>
              <RevealWords as="h2" text={"Keep it. Borrow against it."} className={H2} />
              <RevealWords
                as="p"
                variant="text"
                text={"Deposit aBTC as collateral and borrow aUSD. Two steps. Your Bitcoin stays yours, and your health is on the screen the whole time."}
                className={BODY}
              />
              <div className="grid grid-cols-2 gap-6 border-t border-black/10 pt-6">
                <div>
                  <div className="font-serif text-[36px] leading-none">80%</div>
                  <div className="mt-1.5 text-[14px] text-grey">max LTV</div>
                </div>
                <div>
                  <div className="font-serif text-[36px] leading-none">~1%</div>
                  <div className="mt-1.5 text-[14px] text-grey">indicative APR</div>
                </div>
              </div>
              <Reveal>
                <ArchButton href={LAUNCH}>Borrow in Prime</ArchButton>
              </Reveal>
            </RevealGroup>
            <RevealClip className="relative w-full">
              <Tile ground="#1F5543" label="Borrow" cutout="/img/prime/borrow-bank.webp" cutoutClassName="inset-x-[6%] top-[26%] -bottom-[3%]" className="min-h-[420px]" />
            </RevealClip>
          </div>
        </section>

        {/* BOOST — more of it. The one dark band: leverage should not look like a savings account. */}
        <section id="boost" data-nav-theme="dark" className="relative bg-[#5a170e] py-25 text-white">
          <div className="site-container grid gap-x-2.5 gap-y-10 lg:grid-cols-2 lg:items-center">
            <RevealClip className="relative order-2 w-full lg:order-none">
              <Tile ground="#6B1E0D" label="Boost" cutout="/img/prime/boost-gantry.webp" cutoutClassName="left-[26%] right-[-8%] top-[10%] -bottom-[10%]" className="min-h-[420px]" />
            </RevealClip>
            <RevealGroup as="div" className="flex max-w-[460px] flex-col gap-8 lg:ml-auto">
              <div className="flex items-center gap-3">
                <div className="text-[12px] uppercase tracking-[0.1em] text-white/60">Boost</div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-white/70">in build</span>
              </div>
              <RevealWords as="h2" text={"More of what you already hold."} className="font-serif text-[32px] font-light leading-[1.18] lg:text-[36px]" />
              <RevealWords
                as="p"
                variant="text"
                text={"Boost primeBTC for leveraged yield on the Bitcoin you’re holding. Vetted curators run the strategy. Automation runs the execution. You keep custody."}
                className="text-[14px] leading-[150%] text-white/80 sm:text-[16px]"
              />
              <p className="text-[14px] leading-[150%] text-white/60">Leverage cuts both ways. Health factor and liquidation price sit on the screen before you commit.</p>
            </RevealGroup>
          </div>
        </section>

        {/* ONE PLACE — Trade · Portfolio, on their own hero photographs from the app */}
        <section id="one-place" className="relative bg-white py-25 text-black">
          <div className="site-container">
            <RevealGroup as="div" className="flex max-w-[520px] flex-col gap-4">
              <Eyebrow>Trade · Portfolio</Eyebrow>
              <RevealWords as="h2" text={"All of it, on one screen."} className={H2} />
            </RevealGroup>
            <div className="mt-10 grid gap-2.5 md:grid-cols-2">
              {[
                { t: "Trade", b: "Swap aBTC and aUSD natively. Quote, fee, and minimum received, before you sign.", img: "/img/prime/trade.webp" },
                { t: "Portfolio", b: "Every position, one balance. Activity beside it.", img: "/img/prime/portfolio.webp" },
              ].map((c, k) => (
                <Reveal key={c.t} x={-10} y={0} skew={0} duration={0.7} delay={k * 0.08} className="overflow-hidden rounded-[20px] bg-[#f7f6f6]">
                  <div className="relative aspect-[16/7] w-full">
                    <Image src={c.img} alt="" fill sizes="(max-width: 768px) 92vw, 640px" className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-3 p-6">
                    <h3 className="font-serif text-[26px] font-normal leading-none">{c.t}</h3>
                    <p className={BODY}>{c.b}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* VISION — everything prime */}
        <section id="next" className="relative bg-[#f7f6f6] py-25 text-black">
          <div className="site-container grid gap-x-2.5 gap-y-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <RevealGroup as="div" className="flex max-w-[620px] flex-col gap-8">
              <Eyebrow>What&apos;s next</Eyebrow>
              <RevealWords as="h2" text={"Your ticket to the top."} className="font-serif text-[38px] font-light leading-[1.08] sm:text-[42px] md:text-[62px]" />
              <RevealWords
                as="p"
                variant="text"
                text={"primeBTC and primeUSD today. Every asset on Arch next, tokenised stocks included. Don’t just hold TSLA. Hold primeTSLA."}
                className="max-w-[48ch] text-[14px] leading-[150%] text-grey sm:text-[16px] lg:text-[18px]"
              />
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { n: "primeBTC", s: "now", k: "primeBTC" },
                    { n: "primeUSD", s: "now", k: "primeUSD" },
                    { n: "primeTSLA", s: "next", k: "next" },
                    { n: "prime…", s: "everything on Arch", k: "next" },
                  ] as { n: string; s: string; k: MarkKind }[]
                ).map((p) => (
                  <span key={p.n} className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white py-1.5 pr-4 pl-1.5 text-[14px]">
                    <Mark kind={p.k} size={28} />
                    <span className="font-medium">{p.n}</span>
                    <span className="text-grey">{p.s}</span>
                  </span>
                ))}
              </div>
            </RevealGroup>
            <RevealClip className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px]">
              <Image src="/img/prime/office-night.webp" alt="" fill sizes="(max-width: 992px) 92vw, 420px" className="object-cover" />
            </RevealClip>
          </div>
        </section>

        {/* BUILT ON ARCH — the home page's Arch Network card, one for one (src/app/(main)/page.tsx):
            the base-chain scene on a dark panel over the purple 2T+ stat block, beside the
            "Bitcoin should do more" copy and the chain button. Keep it in step with the home. */}
        <section id="arch" className="relative bg-white pt-8 pb-25 text-black md:pt-25">
          <div className="site-container grid gap-x-2.5 gap-y-10 lg:grid-cols-2">
            <style>{`.city-bleed{container-type:inline-size}.city-bleed .cta-city{overflow:visible}@container (max-width:560px){.city-bleed .illo{--city-left:-110px}}`}</style>
            <RevealClip className="relative w-full overflow-hidden rounded-[20px] order-2 lg:order-none lg:aspect-square lg:min-w-[480px]">
              <div className="grid h-full grid-rows-[260px_auto] lg:grid-rows-[50%_auto]">
                <div className="city-bleed relative z-10 w-full bg-[#2e2d33]">
                  <ChainCity layer={1} override={{ scale: 1.0, bottom: -300, left: -30 }} />
                </div>
                <div className="relative z-0 flex min-h-[240px] flex-col items-start justify-center gap-1.5 overflow-hidden bg-purple p-[6%] text-light md:min-h-0 md:justify-end">
                  <div className="flex items-center font-sans text-[clamp(42px,7vw,200px)] font-bold leading-[1.18]">
                    <CountUp end={2} duration={400} />
                    T+
                  </div>
                  <p className="max-w-[420px] text-[18px] leading-[120%] lg:text-[26px]">
                    Unlocking trillions in Bitcoin capital—natively.
                  </p>
                </div>
              </div>
            </RevealClip>

            <div className="flex max-w-[420px] flex-col items-start justify-center gap-10 py-8 order-1 md:max-w-none md:flex-row md:items-start md:justify-between md:gap-10 lg:order-none lg:mx-auto lg:max-w-[420px] lg:flex-col lg:items-start lg:justify-center">
              <div className="flex flex-col items-start gap-10 md:max-w-[480px]">
                <RevealWords
                  as="h2"
                  text={"Bitcoin should do more.\nNow it Can."}
                  className="font-serif text-[32px] font-normal leading-[1.18] lg:text-[36px]"
                />
                <RevealWords
                  as="p"
                  variant="text"
                  text={
                    "Bitcoin is the world’s strongest store of value—but mostly can’t be used productively without giving up custody. Arch is Bitcoin-native financial rails so it can now have native credit, yield, and trading while staying anchored to Bitcoin’s settlement and core values."
                  }
                  className="text-[14px] leading-[150%] text-grey sm:text-[16px]"
                />
              </div>
              <Reveal>
                <ArchButton href="/chain">How the Chain Works</ArchButton>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="relative py-25">
          <RevealClip as="div" className="site-container flex flex-col items-start justify-between gap-8 rounded-[20px] bg-orange p-8 text-white md:flex-row md:items-center md:p-12">
            <div className="flex flex-col gap-5">
              <Image src="/img/prime/arch-prime-logo-light.svg" alt="Arch Prime" width={144} height={20} className="h-5 w-auto self-start" />
              <h2 className="font-serif text-[clamp(40px,7vw,64px)] font-light leading-[1]">Just hold it.</h2>
              <p className="max-w-[40ch] text-[14px] leading-[150%] sm:text-[16px]">Make it prime. It earns. It stays yours.</p>
            </div>
            <a
              href={LAUNCH}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-white px-[22px] py-4 text-black transition-colors duration-400 hover:bg-light"
            >
              Launch Prime
            </a>
          </RevealClip>
        </section>

        {/* FAQ */}
        <section className="relative bg-light-grey bg-[url(/img/grey-bg.svg)] bg-[length:800px] bg-[position:0_100%] bg-no-repeat py-25 text-black">
          <div className="site-container">
            <RevealWords as="h2" text={"Have any\nquestions?"} className="font-serif text-[38px] font-light leading-[1.08] sm:text-[42px] md:text-[62px]" />
          </div>
          <div className="site-container mt-10 lg:grid lg:grid-cols-2">
            <div />
            <Faq items={PRIME_FAQS} />
          </div>
        </section>
      </main>
    </>
  );
}
