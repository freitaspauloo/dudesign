"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BtnArrow } from "@/src/components/BtnArrow";
import { site } from "@/src/content/site";
import { sprintClose } from "@/src/content/sprint";

export function BookSprintCta() {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname === "/") return null;

  return (
    <section className="frame-sprint-cta" aria-labelledby="book-sprint-heading">
      <h2 id="book-sprint-heading">{sprintClose.title}</h2>
      <p>{sprintClose.line}</p>
      <Link href={site.bookHref} className="btn btn--solid">
        Book a sprint
        <BtnArrow />
      </Link>
    </section>
  );
}
