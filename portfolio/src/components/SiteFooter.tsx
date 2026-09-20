import { site } from "@/src/content/site";
import { SwapLabel } from "@/src/components/SwapLabel";

const links = [
  { href: site.linkedin, label: "linkedin" },
  { href: `mailto:${site.email}`, label: "email" },
  { href: site.x, label: "x" },
  { href: site.github, label: "github" },
];

export function SiteFooter() {
  return (
    <footer className="frame-bar frame-bar--footer">
      <div className="frame-bar__inner">
        <p className="frame-bar__credit">designed and coded by paulo</p>
        <nav className="frame-bar__social" aria-label="Footer">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="frame-bar__link"
            >
              <SwapLabel>{item.label}</SwapLabel>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
