import type { Metadata } from "next";
import Image from "next/image";
import { EXTERNAL } from "@/lib/site";
import { RevealWords } from "@/components/reveal";
import { EcosystemGrid } from "@/components/ecosystem-grid";
import { Faq } from "@/components/faq";
import { SiteFooter } from "@/components/site-footer";
import { ECOSYSTEM_FAQS } from "@/data/ecosystem-faqs";

export const metadata: Metadata = {
  title: { absolute: "Ecosystem" },
  description: "Unlocking Trillions for RWAs & DeFi. Built on Bitcoin.",
  alternates: { canonical: "/ecosystem" },
  openGraph: { title: "Ecosystem" },
  twitter: { title: "Ecosystem" },
};

export default function Ecosystem() {
  return (
    <>
      <header className="relative z-0 flex h-screen flex-col overflow-hidden text-white">
        <Image
          src="/img/hero-ecosystem.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="z-0 bg-black object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-2/5 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-2/5 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 mx-auto w-[94%] max-w-(--container-site) pt-[clamp(150px,30vh,280px)]">
          <RevealWords
            as="h1"
            text={"Arch Network\nEcosystem"}
            className="font-serif text-[clamp(42px,6vw,62px)] font-light leading-[1.18]"
          />
          <RevealWords
            as="p"
            variant="text"
            text={"Unlocking Trillions for RWAs & DeFi. Built on Bitcoin."}
            className="mt-1.5 max-w-[360px] text-[16px] leading-[140%]"
          />
        </div>

        <div className="relative z-10 mt-auto flex w-full justify-center pb-10">
          <a
            href={EXTERNAL.typeform}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-40 items-center justify-center rounded-2xl bg-light p-[18px] text-center text-dark-purple transition-colors duration-400 hover:bg-dark-purple hover:text-light"
          >
            Add your project
          </a>
        </div>
      </header>

      <main>
        <section className="py-25">
          <EcosystemGrid />
        </section>

        <section className="relative bg-light-grey bg-[url(/img/grey-bg.svg)] bg-[length:800px] bg-[position:0_100%] bg-no-repeat py-25 text-black">
          <div className="mx-auto w-[92%] max-w-(--container-site)">
            <RevealWords
              as="h2"
              text={"Have any\nquestions?"}
              className="font-serif text-[42px] font-light leading-[1.08] lg:text-[62px]"
            />
          </div>
          <div className="mx-auto mt-10 w-[92%] max-w-(--container-site) lg:grid lg:grid-cols-2">
            <div />
            <Faq items={ECOSYSTEM_FAQS} />
          </div>
        </section>
      </main>

      <SiteFooter variant="ecosystem" />
    </>
  );
}
