"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { slides, type Slide } from "@/content/slides";

type ViewMode = "desktop" | "mobile";

const VIEW_KEY = "dudesign-view";

const ViewContext = createContext<{
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
} | null>(null);

function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("ViewContext missing");
  return ctx;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`brand-chevron${open ? " is-open" : ""}`}
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 1.25 5 4.75 9 1.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrandMenu() {
  const { mode, setMode } = useView();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="brand-menu" ref={rootRef}>
      <button
        type="button"
        className="brand-mark"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="brand-word">
          <span className="du">DU</span><span className="design">DESIGN</span>
        </span>
        <Chevron open={open} />
      </button>
      {open ? (
        <div className="brand-pop" role="menu" aria-label="View settings">
          <p className="brand-pop-label">View</p>
          <button
            type="button"
            role="menuitemradio"
            aria-checked={mode === "desktop"}
            className={mode === "desktop" ? "is-active" : undefined}
            onClick={() => {
              setMode("desktop");
              setOpen(false);
            }}
          >
            Desktop
          </button>
          <button
            type="button"
            role="menuitemradio"
            aria-checked={mode === "mobile"}
            className={mode === "mobile" ? "is-active" : undefined}
            onClick={() => {
              setMode("mobile");
              setOpen(false);
            }}
          >
            Mobile
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SlideShell({
  children,
  showBrand = true,
  showFooter = true,
}: {
  children: React.ReactNode;
  showBrand?: boolean;
  showFooter?: boolean;
}) {
  return (
    <>
      {showBrand ? (
        <header className="slide-top">
          <BrandMenu />
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

function ToneHeadline({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(/(?<=\.)\s+/);
  return (
    <h2 className={className}>
      {parts.map((part, i) => (
        <span
          key={part}
          className={i === parts.length - 1 && parts.length > 1 ? "is-soft" : undefined}
        >
          {i > 0 ? " " : ""}
          {part}
        </span>
      ))}
    </h2>
  );
}

function SlideView({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "title":
      return (
        <>
          <header className="slide-top is-ghost">
            <BrandMenu />
          </header>
          <div className="title-slide slide-main">
            <h1 className="title-brand">
              <span className="du">DU</span><span className="design">DESIGN</span>
            </h1>
          </div>
        </>
      );
    case "claim":
      return (
        <>
          <header className="slide-top is-ghost">
            <BrandMenu />
          </header>
          <div className="claim-slide slide-main">
            <p className="claim-copy">
              {slide.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
        </>
      );
    case "about":
      return (
        <SlideShell>
          <div className="about-grid">
            <div className="about-copy">
              <h2 className="about-headline">
                {slide.headline.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <div className="about-body">
                {slide.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <div className="work-grid" aria-hidden>
              <Image
                src={slide.work}
                alt=""
                fill
                unoptimized
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </SlideShell>
      );
    case "featured":
      return (
        <SlideShell>
          <div className="featured">
            <div className="featured-copy">
              <div className="featured-main">
                <div className="featured-logos">
                  {slide.logos.map((logo) => (
                    <img key={logo.src} src={logo.src} alt={logo.alt} />
                  ))}
                </div>
                <div className="featured-text">
                  <h2 className="featured-title">{slide.title}</h2>
                  <p className="featured-lead">
                    {slide.lead}
                    <strong>{slide.leadEm}</strong>
                  </p>
                  <p className="featured-body">{slide.body}</p>
                </div>
                <div className="featured-tags-block">
                  <p className="micro-label">Deliverables</p>
                  <ul className="tag-list">
                    {slide.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <dl className="featured-meta">
                {slide.meta.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="featured-media">
              {slide.images.map((image) => (
                <span key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </span>
              ))}
            </div>
          </div>
        </SlideShell>
      );
    case "workgrid":
      return (
        <SlideShell>
          <div className="workgrid">
            <div className="workgrid-head">
              <h2 className="workgrid-headline">{slide.headline}</h2>
            </div>
            <div className="work-cards">
              {slide.items.map((item) => (
                <article className="work-card" key={item.title}>
                  <div className="work-card-media">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="work-card-meta">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.detail}</p>
                    </div>
                    {item.logos.length > 0 ? (
                      <div className="work-card-logos">
                        {item.logos.map((logo) => (
                          <img key={logo.src} src={logo.src} alt={logo.alt} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </SlideShell>
      );
    case "stack":
      return (
        <SlideShell>
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
        <SlideShell>
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
        <SlideShell>
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
    case "included":
      return (
        <SlideShell>
          <h2 className="included-headline">{slide.headline}</h2>
          <ul className="included-grid">
            {slide.items.map((item) => (
              <li key={item.title}>
                <span aria-hidden>✓</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </SlideShell>
      );
    case "upside":
      return (
        <SlideShell>
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
    case "tiers": {
      const footnote = slide.tiers.find((tier) => tier.note)?.note;
      return (
        <SlideShell>
          <h2 className="tiers-headline">{slide.headline}</h2>
          <div className="price-grid">
            {slide.tiers.map((tier) => (
              <article
                className={`price-card${tier.tag ? " is-featured" : ""}`}
                key={tier.name}
              >
                {tier.tag ? <div className="tier-tag">{tier.tag}</div> : null}
                <h3>{tier.name}</h3>
                <p className="price-blurb">{tier.blurb}</p>
                <p className="price-figure">{tier.price}</p>
                <p className="price-meta">{tier.duration}</p>
                <ul className="price-list checks">
                  {tier.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="price-foot">
                  <span className="micro-label">Best for</span>
                  <p>{tier.bestFor}</p>
                </div>
              </article>
            ))}
          </div>
          {footnote ? <p className="section-note">{footnote}</p> : null}
        </SlideShell>
      );
    }
    case "payment":
      return (
        <SlideShell>
          <ToneHeadline text={slide.headline} className="tiers-headline" />
          <p className="section-lead">{slide.body}</p>
          <div className="price-grid">
            {slide.plans.map((plan) => (
              <article
                className={`price-card${plan.tag ? " is-featured" : ""}`}
                key={plan.name}
              >
                {plan.tag ? <div className="tier-tag">{plan.tag}</div> : null}
                <h3>{plan.name}</h3>
                <p className="price-blurb">{plan.blurb}</p>
                <p className="price-figure">{plan.price}</p>
                <p className="price-meta">{plan.duration}</p>
                <p className="micro-label">Payment schedule</p>
                <ul className="price-rows">
                  {plan.schedule.map((row) => (
                    <li key={`${row.pct}-${row.when}`}>
                      <div>
                        <strong>{row.pct}</strong>
                        <span>{row.when}</span>
                      </div>
                      <em>{row.amount}</em>
                    </li>
                  ))}
                </ul>
                <p className="price-foot-note">{plan.foot}</p>
              </article>
            ))}
          </div>
          <p className="section-note">{slide.note}</p>
        </SlideShell>
      );
    case "bonuses":
      return (
        <SlideShell>
          <h2 className="tiers-headline">{slide.headline}</h2>
          <p className="section-lead">{slide.body}</p>
          <div className="price-grid">
            {slide.plans.map((plan) => (
              <article
                className={`price-card${plan.tag ? " is-featured" : ""}`}
                key={plan.name}
              >
                {plan.tag ? <div className="tier-tag">{plan.tag}</div> : null}
                <h3>{plan.name}</h3>
                <p className="price-blurb">{plan.blurb}</p>
                <p className="price-figure">{plan.count}</p>
                <p className="price-meta">bonuses included</p>
                <p className="micro-label">What&apos;s added</p>
                <ul className="price-stack">
                  {plan.items.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong>
                      {item.detail ? <p>{item.detail}</p> : null}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </SlideShell>
      );
    case "faq":
      return (
        <SlideShell>
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

function DeckNav({
  index,
  total,
  onPrev,
  onNext,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="deck-nav" aria-label="Slides">
      <button
        type="button"
        className="deck-nav-btn"
        onClick={onPrev}
        disabled={index === 0}
        aria-label="Previous slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M10 3 5 8l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="deck-nav-btn"
        onClick={onNext}
        disabled={index === total - 1}
        aria-label="Next slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function readStoredMode(): ViewMode | null {
  try {
    const value = localStorage.getItem(VIEW_KEY);
    if (value === "desktop" || value === "mobile") return value;
  } catch {
    /* ignore */
  }
  return null;
}

export function Deck() {
  const [mode, setModeState] = useState<ViewMode>("desktop");
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const swipeRef = useRef<{ x: number; y: number; id: number } | null>(null);

  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stored = readStoredMode();
    if (stored) {
      setModeState(stored);
      return;
    }
    if (window.matchMedia("(max-width: 720px)").matches) {
      setModeState("mobile");
    }
  }, []);

  const go = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(total - 1, next)));
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea")) {
        return;
      }
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

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && mode === "desktop") return;
    const target = e.target as HTMLElement;
    if (target.closest("a, button, .brand-pop")) return;
    swipeRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    if (dx < 0) go(index + 1);
    else go(index - 1);
  };

  const progress = ((index + 1) / total) * 100;

  return (
    <ViewContext.Provider value={{ mode, setMode }}>
      <div className="deck-viewport" data-mode={mode}>
        <div
          className="deck"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            swipeRef.current = null;
          }}
        >
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
          {mode === "mobile" ? (
            <DeckNav
              index={index}
              total={total}
              onPrev={() => go(index - 1)}
              onNext={() => go(index + 1)}
            />
          ) : null}
        </div>
      </div>
    </ViewContext.Provider>
  );
}
