"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { slides, type Slide } from "@/content/slides";

function BrandMark() {
  return (
    <div className="brand-mark">
      <span className="du">DU</span>
      <span className="design">DESIGN</span>
    </div>
  );
}

function SlideShell({
  children,
  label,
  showBrand = true,
  showFooter = true,
}: {
  children: React.ReactNode;
  label?: string;
  showBrand?: boolean;
  showFooter?: boolean;
}) {
  return (
    <>
      {showBrand || label ? (
        <header className="slide-top">
          {showBrand ? <BrandMark /> : <span />}
          {label ? <div className="slide-label">{label}</div> : null}
        </header>
      ) : null}
      <div className="slide-main">{children}</div>
      {showFooter ? (
        <footer className="slide-footer">
          <span>dudesign.us</span>
          <span>hello@dudesign.us</span>
        </footer>
      ) : null}
    </>
  );
}

function SlideView({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "title":
      return (
        <div className="title-slide slide-main">
          <h1 className="title-brand">
            <span className="du">DU</span>
            <span className="design">DESIGN</span>
          </h1>
        </div>
      );
    case "claim":
      return (
        <div className="claim-slide slide-main">
          <p className="claim-copy">
            <span>{slide.category}</span>
            <span>{slide.line}</span>
          </p>
        </div>
      );
    case "about":
      return (
        <SlideShell>
          <div className="about-grid">
            <div className="about-copy">
              <h2 className="about-headline">{slide.headline}</h2>
              <div className="about-body">
                {slide.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <div className="work-grid" aria-hidden>
              {slide.work.map((n, i) => (
                <span key={`${n}-${i}`}>
                  <Image
                    src={`/work/${n}.png`}
                    alt=""
                    fill
                    sizes="(max-width: 960px) 30vw, 180px"
                    style={{ objectFit: "cover" }}
                    priority={i < 3}
                  />
                </span>
              ))}
            </div>
          </div>
        </SlideShell>
      );
    case "stack":
      return (
        <SlideShell label={slide.label}>
          <h2 className="stack-headline">{slide.headline}</h2>
          <ul className="stack-list">
            {slide.layers.map((layer) => (
              <li key={layer.name}>
                <strong>{layer.name}</strong>
                <span>{layer.detail}</span>
              </li>
            ))}
          </ul>
        </SlideShell>
      );
    case "method":
      return (
        <SlideShell label={slide.label}>
          <ol className="method-steps">
            {slide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="method-body">{slide.body}</p>
        </SlideShell>
      );
    case "process":
      return (
        <SlideShell label={slide.label}>
          <h2 className="process-headline">{slide.headline}</h2>
          <div className="phase-grid">
            {slide.phases.map((phase) => (
              <article className="phase" key={phase.title}>
                <span className="phase-when">{phase.when}</span>
                <h3>{phase.title}</h3>
                <p>{phase.detail}</p>
              </article>
            ))}
          </div>
        </SlideShell>
      );
    case "upside":
      return (
        <SlideShell label={slide.label}>
          <h2 className="upside-headline">{slide.headline}</h2>
          <div className="upside-wrap">
            <table className="upside-table">
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Typical cost</th>
                  <th>With DUDESIGN</th>
                </tr>
              </thead>
              <tbody>
                {slide.rows.map((row) => (
                  <tr key={row.buy}>
                    <td>{row.buy}</td>
                    <td className="cost">{row.cost}</td>
                    <td>{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SlideShell>
      );
    case "tiers":
      return (
        <SlideShell label={slide.label}>
          <h2 className="tiers-headline">{slide.headline}</h2>
          <div className="tier-grid">
            {slide.tiers.map((tier) => (
              <article
                className={`tier${tier.tag ? " is-featured" : ""}`}
                key={tier.name}
              >
                {tier.tag ? <div className="tier-tag">{tier.tag}</div> : null}
                <div className="tier-head">
                  <h3>{tier.name}</h3>
                  <p className="tier-blurb">{tier.blurb}</p>
                </div>
                <div className="tier-price-block">
                  <p className="tier-price">{tier.price}</p>
                  <p className="tier-duration">{tier.duration}</p>
                </div>
                <ul className="tier-includes">
                  {tier.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {tier.note ? <p className="tier-note">{tier.note}</p> : null}
                <div className="tier-best">
                  <span>Best for</span>
                  <p>{tier.bestFor}</p>
                </div>
              </article>
            ))}
          </div>
        </SlideShell>
      );
    case "faq":
      return (
        <SlideShell label={slide.label}>
          <h2 className="faq-headline">{slide.headline}</h2>
          <ul className="faq-list">
            {slide.items.map((item) => (
              <li key={item.q}>
                <strong>{item.q}</strong>
                <p>{item.a}</p>
              </li>
            ))}
          </ul>
        </SlideShell>
      );
    case "cta":
      return (
        <SlideShell>
          <h2 className="cta-headline">{slide.headline}</h2>
          <div className="cta-links">
            <a href={`mailto:${slide.email}`}>{slide.email}</a>
            <a href={`https://${slide.web}`} target="_blank" rel="noreferrer">
              {slide.web}
            </a>
          </div>
        </SlideShell>
      );
    default:
      return null;
  }
}

export function Deck() {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const go = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(total - 1, next)));
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "PageDown" ||
        e.key === "Enter"
      ) {
        e.preventDefault();
        go(index + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "Backspace") {
        e.preventDefault();
        go(index - 1);
      }
      if (e.key === "Home") go(0);
      if (e.key === "End") go(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, total]);

  const progress = ((index + 1) / total) * 100;
  const chromeHidden =
    slides[index]?.kind === "title" || slides[index]?.kind === "claim";

  return (
    <div className="deck-viewport">
      <div className="deck">
        <div className="progress" style={{ width: `${progress}%` }} />
        {slides.map((slide, i) => (
          <section
            key={slide.id}
            className={`slide${i === index ? " is-active" : ""}`}
            aria-hidden={i !== index}
          >
            <SlideView slide={slide} />
          </section>
        ))}
        <div className={`deck-chrome${chromeHidden ? " is-minimal" : ""}`}>
          <div className="dots" role="tablist" aria-label="Slides">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                className={`dot${i === index ? " is-active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className="counter" aria-hidden>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <div className="nav-btns">
            <button
              type="button"
              aria-label="Previous slide"
              disabled={index === 0}
              onClick={() => go(index - 1)}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next slide"
              disabled={index === total - 1}
              onClick={() => go(index + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
