"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/lib/use-in-view";

export function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress * (2 - progress);
      setValue(Math.floor(eased * end));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setValue(end);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, end, duration]);

  return <span ref={ref}>{value}</span>;
}
