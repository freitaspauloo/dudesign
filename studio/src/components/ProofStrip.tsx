import type { CaseLink } from "@/src/content/types";
import { BtnArrow } from "./BtnArrow";

type Props = {
  links: CaseLink[];
};

export function ProofStrip({ links }: Props) {
  if (links.length === 0) return null;

  return (
    <div className="proof-strip">
      <p className="proof-strip__label">Proof</p>
      <ul>
        {links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-link"
            >
              {link.label}
              <BtnArrow size={13} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
