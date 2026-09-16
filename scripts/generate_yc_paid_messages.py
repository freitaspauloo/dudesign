#!/usr/bin/env python3
"""Generate paid YC outreach Message + Message 2 from roster rows (JSON on stdin).

Output is for Notion **YC CEOs — master outreach** only. See docs/prospeccao-yc-master.md.
"""

from __future__ import annotations

import json
import re
import sys
from typing import Any


def first_name(full: str) -> str:
    return full.strip().split()[0] if full.strip() else "there"


def surface_hint(one_liner: str, company: str) -> str:
    text = (one_liner or "").lower()
    if any(w in text for w in ("voice", "call", "phone", "hotel")):
        return "the live call or handoff screen"
    if any(w in text for w in ("eval", "observability", "quality", "monitor")):
        return "the run or eval detail view"
    if any(w in text for w in ("doc", "documentation", "changelog")):
        return "the doc surface users actually read"
    if any(w in text for w in ("agent", "automation", "process")):
        return "the agent run timeline"
    if any(w in text for w in ("hire", "recruit", "ats", "crm")):
        return "the pipeline or review screen"
    if any(w in text for w in ("legal", "law", "compliance", "trade")):
        return "the review or approval queue"
    if any(w in text for w in ("cad", "hardware", "design software")):
        return "the primary workspace screen"
    if any(w in text for w in ("data", "training", "multilingual")):
        return "the dataset or review UI"
    if any(w in text for w in ("chat", "react", "library", "word", "editor")):
        return "the main interaction surface"
    if any(w in text for w in ("mobile", "app")):
        return "the core app flow"
    return "the main workflow screen where users decide to trust the output"


OPENERS = [
    "Paulo here. Product designer — mostly UI for AI and technical teams.",
    "I'm Paulo. Product designer working with AI and technical teams.",
    "Paulo here — product designer, mostly UI for AI startups.",
]


def product_tie(company: str, one_liner: str, hint: str) -> str:
    co = company.strip() or "your product"
    ol = (one_liner or "").strip()
    if ol:
        ol_short = ol if len(ol) <= 90 else ol[:87].rstrip() + "…"
        return (
            f"At {co}, {ol_short.rstrip('.')} — I'd probably start with {hint}."
        )
    return f"At {co}, I'd probably start with {hint}."


def message1(row: dict[str, Any], idx: int) -> str:
    name = first_name(row.get("Name", ""))
    company = row.get("Company") or "your company"
    ol = row.get("One-liner") or ""
    hint = surface_hint(ol, company)
    opener = OPENERS[idx % len(OPENERS)]
    tie = product_tie(company, ol, hint)
    return (
        f"Hi {name}, {opener}\n\n"
        "I run DUDESIGN as a design partner for AI startups: product calls, UX/UI, "
        "and we ship the interface in code.\n\n"
        f"{tie}\n\n"
        "If it's useful, I can send a short loom on one screen I'd tighten — no deck. "
        "If timing's bad, one word is enough."
    )


def message2(row: dict[str, Any]) -> str:
    name = first_name(row.get("Name", ""))
    company = row.get("Company") or "your company"
    ol = row.get("One-liner") or ""
    hint = surface_hint(ol, company)
    return (
        f"Hi {name}. Friendly bump once.\n\n"
        f"Still happy to share a quick, concrete take on {hint} at {company} if that helps. "
        "No pitch call unless you want one.\n\n"
        "If it's not on your radar, totally fine — just say so."
    )


def main() -> None:
    rows = json.load(sys.stdin)
    out = []
    for i, row in enumerate(rows):
        out.append(
            {
                **row,
                "Message": message1(row, i),
                "Message 2": message2(row),
            }
        )
    json.dump(out, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
