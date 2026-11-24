"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { assetPath } from "@/src/lib/asset-path";
import { BonsaiThumb } from "@/src/components/BonsaiThumb";

type Props = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  video?: string;
  bonsai?: boolean;
};

export function ProjectThumb({ src, alt, fit = "cover", video, bonsai }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      el.pause();
      el.removeAttribute("autoplay");
      return;
    }

    const play = () => {
      void el.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else el.pause();
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    play();
    return () => observer.disconnect();
  }, [video]);

  if (bonsai) return <BonsaiThumb />;

  if (!video) {
    return (
      <Image
        src={assetPath(src)}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 960px) 100vw, 612px"
        style={{ objectFit: fit }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="frame-work__video"
      src={assetPath(video)}
      poster={assetPath(src)}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={alt}
      style={{ objectFit: fit }}
    />
  );
}
