"use client";

// A SECOND, static instance of the hero illustration ([chain-illustration.ts]) showing only the
// top "city" layer (L4), cropped at the bottom of the builders CTA. It reuses the same factory the
// hero uses, so edits to the city geometry land in both places. None of the hero's scroll/snap
// machinery is involved — this instance just builds, shows layer 4, and hides the lower layers.
//
// The CTA lives OUTSIDE the page's .chain-scope, but the illustration's CSS is namespaced under it,
// so we re-establish a local .chain-scope with display:contents (gives the scoped styles + CSS vars,
// no layout box of its own).

import { useEffect, useRef } from "react";
import { createIllustration, type IllustrationApi } from "./chain-illustration";

// ───────────────────────── CITY PLACEMENT LEVERS ─────────────────────────
// Tweak these three numbers to dial in the crop. The city is anchored to the
// card's BOTTOM-RIGHT corner (transform-origin: bottom right) and clipped by
// the card edges.
//   x     — horizontal offset, px. MORE NEGATIVE = pushed further RIGHT (more
//           of the city runs off the right edge).
//   y     — vertical offset, px.  MORE NEGATIVE = pushed further DOWN (more of
//           the city runs off the bottom edge).
//   scale — overall size multiplier. Bigger = larger / juicier.
const CITY = { x: -218, y: -492, scale: 1.5 };
// ──────────────────────────────────────────────────────────────────────────

export function ChainCity() {
  const stageRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<IllustrationApi | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || apiRef.current) return;
    const api = createIllustration(stage);
    apiRef.current = api;
    api.setState(4); // city = top layer
    // city only: drop the (dimmed) layers beneath it
    stage.querySelectorAll<HTMLElement>("#L1, #L2, #L3").forEach((l) => (l.style.display = "none"));
    // drop the tooltip marker dots — this is a decorative, non-interactive instance
    stage.querySelectorAll(".dots").forEach((d) => d.remove());
    return () => {
      api.destroy();
      apiRef.current = null;
    };
  }, []);

  return (
    <div className="chain-scope" style={{ display: "contents" }}>
      <div className="cta-city" aria-hidden>
        <div
          className="illo"
          ref={stageRef}
          style={{ right: `${CITY.x}px`, bottom: `${CITY.y}px`, transform: `scale(${CITY.scale})` }}
        >
          <svg id="iso" viewBox="-320 -360 680 790" />
        </div>
      </div>
    </div>
  );
}
