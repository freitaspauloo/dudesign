import Link from "next/link";
import { site } from "@/src/content/site";
import { SwapLabel } from "@/src/components/SwapLabel";

const nav = [
  { href: "/work", label: "work" },
  { href: "/fun", label: "fun" },
  { href: "/about", label: "about" },
  { href: "/resume", label: "resume" },
];

export function SiteHeader() {
  return (
    <header className="frame-bar frame-bar--header">
      <div className="frame-bar__inner">
        <Link href="/" className="frame-bar__brand">
          <span className="frame-bar__brand-name">{site.name.toUpperCase()}</span>
          <span className="frame-bar__brand-role">{site.title}</span>
        </Link>

        <nav className="frame-bar__nav" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="frame-bar__link">
              <SwapLabel>{item.label}</SwapLabel>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
