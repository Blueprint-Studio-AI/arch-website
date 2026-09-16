"use client";

// EARN — tabs that mirror the app's four Earn categories (labels, thumbs and one-liners from
// arch-prime's "Different Ways to Earn"). Each product card carries its real imagery: the
// primeBTC / primeUSD landscapes and the Auto Earn tower from the app, and the token marks.

import { useState } from "react";
import Image from "next/image";
import { EXTERNAL } from "@/lib/site";
import { Mark, type MarkKind } from "./prime-marks";
import { Tile } from "./prime-tile";

type Station = {
  name: string;
  tag: string;
  blurb: string;
  mark?: MarkKind;
  img?: string; // photographic header (landscape)
  cutout?: string; // transparent cutout on a coloured tile
  ground?: string;
  soon?: boolean;
};
type Tab = { id: string; label: string; thumb: string; blurb: string; stations: Station[] };

const TABS: Tab[] = [
  {
    id: "products",
    label: "Products",
    thumb: "/img/prime/thumb-products.webp",
    blurb: "Pick a vault and deposit. A curator handles the rest.",
    stations: [
      { name: "primeBTC", tag: "aBTC · curated by Velox", blurb: "Hold it. It earns daily. Never locked.", mark: "primeBTC", img: "/img/prime/prime-btc.webp" },
      { name: "primeUSD", tag: "aUSD · curated by Velox", blurb: "Dollars that earn while they sit.", mark: "primeUSD", img: "/img/prime/prime-usd.webp" },
      {
        name: "Auto Earn",
        tag: "aUSD · run by Arch",
        blurb: "You deposit, we handle the rest. Automatic allocation across the best rates.",
        mark: "autoEarn",
        cutout: "/img/prime/auto-earn.webp",
        ground: "#14284b",
      },
    ],
  },
  {
    id: "pools",
    label: "Liquidity Pools",
    thumb: "/img/prime/thumb-pools.webp",
    blurb: "Supply a trading pair and collect a share of every swap.",
    stations: [{ name: "aBTC / aUSD", tag: "0.1% fee tier", blurb: "Concentrated liquidity. Set your range, earn from every trade through it." }],
  },
  {
    id: "lending",
    label: "Lending",
    thumb: "/img/prime/thumb-lending.webp",
    blurb: "Lend one asset to borrowers. Rates move with demand.",
    stations: [{ name: "Arch USD Prime Yield", tag: "Supply aUSD · Collateral aBTC · Curated by Arch", blurb: "Lend dollars into Bitcoin-backed credit. Withdrawable liquidity shown up front." }],
  },
  {
    id: "strategies",
    label: "Strategies",
    thumb: "/img/prime/thumb-strategies.webp",
    blurb: "The individual positions vaults draw from. Go direct.",
    stations: [{ name: "External vaults", tag: "Curated by partners", blurb: "Curated strategies from partners, run on the same rails.", soon: true }],
  },
];

function StationCard({ s, thumb }: { s: Station; thumb: string }) {
  const header = s.img ? (
    <div className="relative aspect-[3/1] w-full overflow-hidden">
      <Image src={s.img} alt="" fill sizes="(max-width: 768px) 92vw, 420px" className="object-cover" />
    </div>
  ) : s.cutout ? (
    <Tile ground={s.ground ?? "#14284b"} cutout={s.cutout} cutoutClassName="left-[28%] right-[-6%] top-[14%] bottom-0" className="aspect-[3/1] w-full rounded-none" />
  ) : null;

  return (
    <a
      href={EXTERNAL.prime}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-[20px] bg-[#f7f6f6] transition-colors duration-200 hover:bg-[#f0eeee]"
    >
      {header}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          {s.mark ? <Mark kind={s.mark} size={36} /> : <Image src={thumb} alt="" width={36} height={36} className="rounded-full" />}
          <span className="text-[20px] font-medium">{s.name}</span>
          {s.soon && <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-grey">soon</span>}
        </div>
        <div className="text-[12px] uppercase tracking-[0.08em] text-grey">{s.tag}</div>
        <p className="max-w-[48ch] text-[14px] leading-[150%] text-black/70 sm:text-[16px]">{s.blurb}</p>
        <span className="mt-auto pt-2 text-[14px] text-black/60 transition-colors group-hover:text-orange">Open in Prime →</span>
      </div>
    </a>
  );
}

export function PrimeEarn() {
  const [i, setI] = useState(0);
  const tab = TABS[i];
  return (
    <div>
      <div role="tablist" aria-label="Ways to earn" className="flex flex-wrap gap-2">
        {TABS.map((t, k) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`earn-tab-${t.id}`}
            aria-selected={k === i}
            aria-controls={`earn-panel-${t.id}`}
            onClick={() => setI(k)}
            className={`flex items-center gap-3 rounded-full py-1.5 pr-5 pl-1.5 text-[14px] transition-colors duration-200 sm:text-[16px] ${
              k === i ? "bg-black text-white" : "bg-black/5 text-black hover:bg-black/10"
            }`}
          >
            <Image src={t.thumb} alt="" width={36} height={36} className="rounded-full" />
            {t.label}
          </button>
        ))}
      </div>

      <div key={tab.id} id={`earn-panel-${tab.id}`} role="tabpanel" aria-labelledby={`earn-tab-${tab.id}`} className="mt-8">
        <p className="mb-5 text-[16px] leading-[150%] text-grey lg:text-[18px]">{tab.blurb}</p>
        <div className={`grid gap-2.5 ${tab.stations.length > 1 ? "md:grid-cols-3" : "max-w-[620px]"}`}>
          {tab.stations.map((s) => (
            <StationCard key={s.name} s={s} thumb={tab.thumb} />
          ))}
        </div>
      </div>
    </div>
  );
}
