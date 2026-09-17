import Image from "next/image";

// The real Arch Prime glyph (Brand/Arch Prime/Arch Prime Logos/arch-prime-glyph-black.svg,
// 544×393, rounded apex) as the faint band behind a tile — the deck's tile motif. Drawn in
// currentColor so a tile tints it to its own ink.
export const GLYPH_PATH =
  "M92.3048 392.347H74.1776L5.52914 392.338C1.19219 392.338 -1.44278 387.63 0.840883 383.994L226.923 24.7288C236.684 9.26366 253.494 0.000329024 271.969 0C290.444 0.00026095 307.254 9.22559 317.014 24.7288L543.094 383.994C545.379 387.63 542.746 392.338 538.408 392.338H520.203L451.238 392.347C449.34 392.347 447.556 391.39 446.549 389.782L306.285 166.172C302.566 160.277 297.492 155.568 291.606 152.314C285.68 149.061 278.979 147.301 271.931 147.301C257.833 147.301 245.011 154.343 237.575 166.172L96.993 389.782C95.9859 391.39 94.2024 392.347 92.3048 392.347Z";

export function ArchGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 544 393" aria-hidden className={className}>
      <path d={GLYPH_PATH} fill="currentColor" />
    </svg>
  );
}

// A brand "line" tile: coloured ground, faint arch, serif label top-left, and a cutout
// (transparent PNG from the app: the bank, the gantry, the tower) placed by `cutoutClassName`.
// Reproduces the Earn / Borrow / Boost cards in Brand/Arch Prime/Asset Gen Samples.
export function Tile({
  ground,
  ink = "#ffffff",
  label,
  cutout,
  cutoutClassName = "inset-x-[10%] top-[22%] bottom-0",
  className = "",
}: {
  ground: string;
  ink?: string;
  label?: string;
  cutout?: string;
  cutoutClassName?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[20px] ${className}`} style={{ backgroundColor: ground, color: ink }}>
      {/* apex near the top, legs running off the bottom edge, as on the deck tiles */}
      <ArchGlyph className="absolute top-[6%] left-1/2 h-auto w-[135%] -translate-x-1/2 opacity-[0.14]" />
      {cutout && (
        <div className={`absolute ${cutoutClassName}`}>
          <Image src={cutout} alt="" fill sizes="(max-width: 992px) 92vw, 640px" className="object-contain object-bottom" />
        </div>
      )}
      {label && <div className="absolute top-6 left-6 font-serif text-[28px] font-normal leading-none md:text-[34px]">{label}</div>}
    </div>
  );
}
