#!/usr/bin/env python3
"""Generate human YC outreach: Message = invite note, Message 2 = reply after connect.

Output for Notion **YC CEOs — master outreach** only. See docs/prospeccao-yc-master.md.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from typing import Any


def first_name(full: str) -> str:
    return full.strip().split()[0] if full.strip() else "there"


def stable_index(key: str, modulo: int) -> int:
    h = hashlib.sha256(key.encode()).hexdigest()
    return int(h[:8], 16) % modulo


def surface_hint(one_liner: str) -> tuple[str, str]:
    """Return (short noun phrase, casual clause) for copy."""
    text = (one_liner or "").lower()
    if any(w in text for w in ("voice", "call", "phone", "hotel")):
        return (
            "the call handoff",
            "where someone hands off from the bot to a person",
        )
    if any(w in text for w in ("eval", "observability", "quality", "monitor")):
        return (
            "the run detail view",
            "where you actually trust what the model did",
        )
    if any(w in text for w in ("doc", "documentation", "changelog")):
        return (
            "in-app docs",
            "where users decide if the product is legit",
        )
    if any(w in text for w in ("agent", "automation", "process")):
        return (
            "the agent timeline",
            "where people sanity-check what ran",
        )
    if any(w in text for w in ("hire", "recruit", "ats", "crm")):
        return (
            "the review queue",
            "where a recruiter says yes or no fast",
        )
    if any(w in text for w in ("legal", "law", "compliance", "trade")):
        return (
            "the approval step",
            "where someone signs off without reading everything",
        )
    if any(w in text for w in ("cad", "hardware", "design software")):
        return (
            "the main workspace",
            "where the messy config actually lives",
        )
    if any(w in text for w in ("data", "training", "multilingual")):
        return (
            "the labeling/review UI",
            "where quality shows up or doesn't",
        )
    if any(w in text for w in ("chat", "react", "library", "word", "editor")):
        return (
            "the chat surface",
            "where the product stops feeling like a demo",
        )
    if any(w in text for w in ("mobile", "app")):
        return (
            "the core flow",
            "where people bounce if it feels rough",
        )
    return (
        "the main workflow",
        "where users decide to trust the output",
    )


def company_short(company: str) -> str:
    c = (company or "").strip()
    return c if c else "your team"


INVITE_TEMPLATES = [
    "Hi {name}, Paulo here. I design product UI for AI teams and ship the front end. {company} stood out on YC. Would be good to connect.",
    "Hi {name}. Product designer, mostly AI/SaaS. I saw {company} and thought it'd be worth connecting. Paulo.",
    "Hey {name}, Paulo. I help AI founders tighten the UI (and build it in code). Happy to connect if you're open.",
    "Hi {name}, I'm Paulo. Product design for technical teams. {company} looks interesting. Would love to connect.",
    "Hi {name}. Paulo here, designer who codes. Working with AI startups on the interface layer. Connect?",
]


def message_invite(row: dict[str, Any]) -> str:
    name = first_name(row.get("Name", ""))
    company = company_short(row.get("Company") or "")
    key = row.get("url") or row.get("Name") or name
    tpl = INVITE_TEMPLATES[stable_index(key, len(INVITE_TEMPLATES))]
    msg = tpl.format(name=name, company=company)
    # LinkedIn connection notes cap ~300 chars; trim softly if needed
    if len(msg) > 300:
        msg = (
            f"Hi {name}, Paulo here. Product designer for AI teams (I ship UI in code). "
            f"Would be good to connect."
        )
    return msg


REPLY_TEMPLATES = [
    (
        "Thanks for connecting, {name}.\n\n"
        "I'm Paulo. I run DUDESIGN, a small product design partner for AI startups. "
        "Product calls, UX/UI, and we implement the interface in React/Next, not just Figma.\n\n"
        "On {company}, I'd probably poke at {hint_short} first. {hint_clause}.\n\n"
        "If it's ever useful, I can record a quick loom on one screen. No call unless you want one. "
        "If not, totally fine."
    ),
    (
        "Appreciate the connect, {name}.\n\n"
        "Quick intro: product designer, mostly AI. My studio (DUDESIGN) helps teams ship one surface end to end, "
        "design through production UI.\n\n"
        "Random guess on {company}: {hint_short} is where friction shows up. {hint_clause}.\n\n"
        "Happy to send a short video walkthrough if that saves you time. If you're slammed, just ignore this."
    ),
    (
        "Hey {name}, thanks for accepting.\n\n"
        "Paulo here. I work with AI founders on the part users actually touch. "
        "Partner setup, not a generic agency handoff.\n\n"
        "For {company}, I keep thinking about {hint_short}. {hint_clause}.\n\n"
        "Want me to send a 2-min loom on one idea? Or say pass and I won't bug you."
    ),
    (
        "Thanks for connecting.\n\n"
        "I'm Paulo, product designer. I partner with AI teams on UX and ship the UI in code.\n\n"
        "Looking at {company}, {hint_short} feels like the hinge. {hint_clause}.\n\n"
        "I can share a concrete take async if helpful. One word is enough if it's a bad time."
    ),
]

def message_reply(row: dict[str, Any]) -> str:
    name = first_name(row.get("Name", ""))
    company = company_short(row.get("Company") or "")
    hint_short, hint_clause = surface_hint(row.get("One-liner") or "")
    key = (row.get("url") or "") + "reply"
    tpl = REPLY_TEMPLATES[stable_index(key, len(REPLY_TEMPLATES))]
    return tpl.format(
        name=name,
        company=company,
        hint_short=hint_short,
        hint_clause=hint_clause.capitalize(),
    )


def main() -> None:
    rows = json.load(sys.stdin)
    out = []
    for row in rows:
        name = row.get("Name") or ""
        if "DUP DELETE" in name or "FAKE DELETE" in name:
            continue
        if row.get("Status") == "Skip":
            continue
        out.append(
            {
                **row,
                "Message": message_invite(row),
                "Message 2": message_reply(row),
            }
        )
    json.dump(out, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
