"use client";

import { useEffect, useState } from "react";
import { assetPath } from "@/src/lib/asset-path";
import { BonsaiThumb } from "./BonsaiThumb";

const STILL_MS = 3000;
const SITE_MS = 7000;

const stills = [
  "/work/cases/conifer/product-captain.png",
  "/work/cases/conifer/product-drift.png",
  "/work/cases/conifer/product-review.png",
  "/work/cases/conifer/product-plans.png",
];

export function ConiferThumb() {
  const [beat, setBeat] = useState(0);
  const site = beat === stills.length;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setTimeout(
      () => setBeat((current) => (current + 1) % (stills.length + 1)),
      site ? SITE_MS : STILL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [site, beat]);

  return (
    <div className="conifer-thumb" aria-hidden="true">
      {stills.map((still, index) => (
        <img
          key={still}
          src={assetPath(still)}
          alt=""
          className={index === beat ? "is-on" : undefined}
        />
      ))}
      {site ? <BonsaiThumb /> : null}
    </div>
  );
}
