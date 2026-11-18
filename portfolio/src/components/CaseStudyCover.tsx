"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { CaseStudy } from "@/src/content/types";
import { assetPath } from "@/src/lib/asset-path";

type Cover = CaseStudy["cover"];

export function CaseStudyCover({ cover }: { cover: Cover }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React's muted attribute does not set the DOM property, so autoplay is blocked.
    video.muted = true;
    video.defaultMuted = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }

    const play = () => {
      void video.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.15 },
    );

    observer.observe(video);
    play();
    return () => observer.disconnect();
  }, []);

  if (!cover.video) {
    return (
      <Image
        src={assetPath(cover.src)}
        alt={cover.alt}
        width={1200}
        height={675}
        className="case-study__cover"
        style={{ width: "100%", height: "auto", aspectRatio: "auto" }}
        priority
        unoptimized
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="case-study__cover"
      src={assetPath(cover.video)}
      poster={assetPath(cover.src)}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={cover.alt}
    />
  );
}
