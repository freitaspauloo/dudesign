"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CaseGalleryBlock, CaseGallerySlot } from "@/src/content/types";
import { assetPath } from "@/src/lib/asset-path";

type Props = {
  blocks: CaseGalleryBlock[];
  /** Tighter strip for visuals between narrative sections. */
  inline?: boolean;
};

type LightboxState = {
  src: string;
  alt: string;
  label: string;
  caption?: string;
} | null;

function GalleryLightbox({
  state,
  onClose,
}: {
  state: LightboxState;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!state) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [state, onClose]);

  if (!state) return null;

  return (
    <div
      className="case-gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={state.label}
    >
      <button
        type="button"
        className="case-gallery-lightbox__backdrop"
        onClick={onClose}
        aria-label="Close fullscreen view"
      />
      <button
        type="button"
        className="case-gallery-lightbox__close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <figure className="case-gallery-lightbox__figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={state.src}
          alt={state.alt}
          className="case-gallery-lightbox__img"
        />
        <figcaption className="case-gallery-lightbox__caption">
          <span className="case-gallery-lightbox__label">{state.label}</span>
          {state.caption ? (
            <span className="case-gallery-lightbox__note">{state.caption}</span>
          ) : null}
        </figcaption>
      </figure>
    </div>
  );
}

function GalleryVideo({ item }: { item: CaseGallerySlot }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="case-gallery__slot case-gallery__slot--video case-gallery__slot--filled">
      <div className="case-gallery__media">
        <video
          ref={videoRef}
          className="case-gallery__video"
          src={assetPath(item.src!)}
          poster={item.poster ? assetPath(item.poster) : undefined}
          autoPlay
          playsInline
          muted
          loop
          preload="auto"
          aria-label={item.alt ?? item.label}
        />
      </div>
      <figcaption className="case-gallery__caption">
        <span className="case-gallery__label">{item.label}</span>
        {item.caption ? (
          <span className="case-gallery__note">{item.caption}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

function GallerySlot({
  item,
  layout,
  onExpand,
}: {
  item: CaseGallerySlot;
  layout: CaseGalleryBlock["layout"];
  onExpand: (state: LightboxState) => void;
}) {
  const variant = item.variant ?? "desktop";
  const isShot = (item.variant ?? "desktop") === "shot";
  const imageSizes =
    layout === "full" || layout === "video" || (layout === "duo" && isShot)
      ? "(max-width: 960px) 100vw, min(1200px, 92vw)"
      : layout === "duo"
        ? "(max-width: 720px) 100vw, 50vw"
        : "(max-width: 720px) 100vw, 42vw";

  const openLightbox = () => {
    if (!item.src || variant === "video") return;
    onExpand({
      src: assetPath(item.src),
      alt: item.alt ?? item.label,
      label: item.label,
      caption: item.caption,
    });
  };

  if (item.src && variant === "video") {
    return <GalleryVideo item={item} />;
  }

  if (item.src && variant === "shot") {
    return (
      <figure className="case-gallery__slot case-gallery__slot--shot case-gallery__slot--filled">
        <button
          type="button"
          className="case-gallery__expand"
          onClick={openLightbox}
          aria-label={`View ${item.label} fullscreen`}
        >
          <div className="case-gallery__media">
            <Image
              src={assetPath(item.src)}
              alt={item.alt ?? item.label}
              width={1920}
              height={1080}
              unoptimized
              sizes={imageSizes}
              className="case-gallery__shot-img"
            />
            <span className="case-gallery__expand-hint" aria-hidden="true">
              Full screen
            </span>
          </div>
        </button>
        <figcaption className="case-gallery__caption">
          <span className="case-gallery__label">{item.label}</span>
          {item.caption ? (
            <span className="case-gallery__note">{item.caption}</span>
          ) : null}
        </figcaption>
      </figure>
    );
  }

  if (item.src) {
    return (
      <figure
        className={`case-gallery__slot case-gallery__slot--${variant} case-gallery__slot--filled`}
      >
        <button
          type="button"
          className="case-gallery__expand"
          onClick={openLightbox}
          aria-label={`View ${item.label} fullscreen`}
        >
          <div className="case-gallery__media">
            <Image
              src={assetPath(item.src)}
              alt={item.alt ?? item.label}
              fill
              unoptimized
              sizes={
                variant === "mobile"
                  ? "(max-width: 960px) 40vw, 240px"
                  : "(max-width: 960px) 100vw, 720px"
              }
              style={{ objectFit: "cover" }}
            />
            <span className="case-gallery__expand-hint" aria-hidden="true">
              Full screen
            </span>
          </div>
        </button>
        <figcaption className="case-gallery__caption">
          <span className="case-gallery__label">{item.label}</span>
          {item.caption ? (
            <span className="case-gallery__note">{item.caption}</span>
          ) : null}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={`case-gallery__slot case-gallery__slot--${variant} case-gallery__slot--placeholder`}
    >
      <div className="case-gallery__media" aria-hidden="true">
        {variant === "video" ? (
          <span className="case-gallery__play">▶</span>
        ) : null}
        <span className="case-gallery__placeholder-label">{item.label}</span>
      </div>
      <figcaption className="case-gallery__caption">
        <span className="case-gallery__label">{item.label}</span>
        {item.caption ? (
          <span className="case-gallery__note">{item.caption}</span>
        ) : (
          <span className="case-gallery__note">Asset coming soon</span>
        )}
      </figcaption>
    </figure>
  );
}

export function CaseStudyGallery({ blocks, inline = false }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <>
      <section
        className={`case-gallery${inline ? " case-gallery--inline" : ""}`}
        aria-label={inline ? undefined : "Project visuals"}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`case-gallery__block case-gallery__block--${block.layout}`}
          >
            {block.title ? (
              <h2 className="case-gallery__title">{block.title}</h2>
            ) : null}
            <div className="case-gallery__items">
              {block.items.map((item) => (
                <GallerySlot
                  key={item.id}
                  item={item}
                  layout={block.layout}
                  onExpand={setLightbox}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
      <GalleryLightbox state={lightbox} onClose={closeLightbox} />
    </>
  );
}
