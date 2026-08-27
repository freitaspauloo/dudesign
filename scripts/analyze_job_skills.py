import json
import re
import html
import urllib.request
from collections import defaultdict
from pathlib import Path

# Full-text sources only (API + saved page extracts). No placeholder stubs.
API_JOBS = [
    ("GitLab", "https://boards-api.greenhouse.io/v1/boards/gitlab/jobs/8464608002"),
    ("Stripe", "https://boards-api.greenhouse.io/v1/boards/stripe/jobs/8128499"),
    ("VSCO", "https://boards-api.greenhouse.io/v1/boards/vsco39/jobs/8563099002"),
    ("Durable", "https://boards-api.greenhouse.io/v1/boards/durable/jobs/5156296008"),
    ("AiDASH", "https://boards-api.greenhouse.io/v1/boards/aidashinc/jobs/4377978009"),
    ("Intercom", "https://boards-api.greenhouse.io/v1/boards/intercom/jobs/7862050"),
]

ASHBY_JOBS = [
    ("Runpod", "runpod", "94029301-60be-479d-963f-c97c2ba31906"),
    ("Owner.com", "owner", "0ab7a1e4-0164-499e-9b2f-b10d8b2fae41"),
    ("Render", "render", "0f0ccf3e-4caf-4586-9a66-411dbf49fcc5"),
    ("Tessera Labs", "tessera-labs", "742eb648-a305-4da8-90fa-6d3af8e16f8d"),
    ("Check", "check-technologies", "f027e599-17b7-49c1-8665-db4df03146a0"),
    ("FutureFit AI", "futurefitai", "a60ba7fe-27e8-4a42-b661-954d3ef67202"),
]

# Saved from live postings (Aug 2026 research)
STATIC_JOBS = {
    "Vercel": Path(__file__).parent / "job-text" / "vercel.txt",
    "Linear": Path(__file__).parent / "job-text" / "linear.txt",
    "Harvey": Path(__file__).parent / "job-text" / "harvey.txt",
    "OpenAI": Path(__file__).parent / "job-text" / "openai.txt",
}

SKILL_PATTERNS = [
    (
        "End-to-end product design (0 to 1 through ship)",
        [
            r"end[- ]to[- ]end",
            r"0 to 1",
            r"zero to one",
            r"ideation to launch",
            r"initial concept through",
            r"from problem framing through launch",
            r"beginning to end",
            r"own the design process",
            r"no hand-offs",
        ],
    ),
    (
        "Systems thinking and design systems",
        [
            r"systems thinking",
            r"design systems?",
            r"component librar",
            r"shared systems",
            r"cohesive and scalable",
            r"visual language",
            r"platform design",
        ],
    ),
    (
        "AI and agent UX design",
        [
            r"AI[- ]native",
            r"AI[- ]powered",
            r"agentic",
            r"generative AI",
            r"designing with AI",
            r"AI agents?",
            r"AI experiences",
            r"AI-augmented",
            r"AI workflow",
            r"AI-first",
            r"AI Customer Agent",
            r"AI suite",
            r"prompt interface",
            r"multi-modal",
        ],
    ),
    (
        "Prototyping in code (beyond static mocks)",
        [
            r"prototyp",
            r"ship(ping)? in code",
            r"production code",
            r"working near code",
            r"producing in code",
            r"build prototypes to communicate",
            r"HTML/CSS",
            r"Framer",
            r"Lovable",
            r"Loveable",
            r"Windsurf",
            r"not a role where you.*Figma",
        ],
    ),
    (
        "Cursor, Claude Code, or v0",
        [r"Cursor", r"Claude Code", r"\bv0\b", r"AI-assisted coding"],
    ),
    (
        "Cross-functional leadership with PM and Eng",
        [
            r"cross-functional",
            r"product managers?",
            r"\bPM\b",
            r"engineers?",
            r"engineering",
            r"paired tightly with",
            r"partnership with product",
            r"influencing cross-functional",
        ],
    ),
    (
        "User research and validation",
        [
            r"user research",
            r"customer research",
            r"conduct user research",
            r"research synthesis",
            r"uncover pain points",
            r"qualitative and quantitative",
            r"leveraging insights",
            r"validated user evidence",
        ],
    ),
    (
        "Interaction and visual craft",
        [
            r"interaction design",
            r"visual design",
            r"pixel-perfect",
            r"craft bar",
            r"high craft",
            r"strong craft",
            r"visual and interaction",
            r"has taste",
            r"software craftsmanship",
            r"polished execution",
        ],
    ),
    (
        "Experimentation, growth, and metrics",
        [
            r"experiment",
            r"hypothes",
            r"measurable outcomes",
            r"success (criteria|measures)",
            r"funnel",
            r"activation",
            r"retention",
            r"conversion",
            r"onboarding",
            r"product data",
            r"monetization",
        ],
    ),
    (
        "Developer tools, B2B SaaS, or enterprise complexity",
        [
            r"developer tools",
            r"DevSecOps",
            r"technical products",
            r"infrastructure",
            r"B2B SaaS",
            r"enterprise",
            r"complex.*product",
            r"software products",
            r"dev cloud",
        ],
    ),
    (
        "Storytelling and design communication",
        [
            r"storytelling",
            r"articulate design",
            r"compelling story",
            r"influential storyteller",
            r"explain tradeoffs",
            r"written and verbal communication",
        ],
    ),
    (
        "Accessibility and trust UX",
        [
            r"accessibility",
            r"build trust",
            r"help users understand, trust",
            r"high-stakes",
            r"sensitive user",
            r"trustworthy experiences",
        ],
    ),
    (
        "Figma fluency",
        [r"\bFigma\b"],
    ),
    (
        "React or frontend fluency",
        [r"\bReact\b", r"JavaScript", r"frontend", r"web code"],
    ),
]


def fetch_api(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode())


def strip_html(s):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    return re.sub(r"\s+", " ", s)


def load_texts():
    texts = {}

    for name, url in API_JOBS:
        data = fetch_api(url)
        texts[name] = strip_html(data.get("content", ""))

    for name, org, jid in ASHBY_JOBS:
        data = fetch_api(f"https://api.ashbyhq.com/posting-api/job-board/{org}")
        job = next((j for j in data.get("jobs", []) if j.get("id") == jid), None)
        if not job:
            raise RuntimeError(f"Ashby job not found: {name}")
        texts[name] = strip_html(job.get("descriptionPlain") or job.get("descriptionHtml") or "")

    for name, path in STATIC_JOBS.items():
        texts[name] = path.read_text(encoding="utf-8")

    return texts


def analyze(texts):
    counts = defaultdict(int)
    post_hits = defaultdict(list)

    for company, text in texts.items():
        for skill, patterns in SKILL_PATTERNS:
            if any(re.search(p, text, re.I) for p in patterns):
                counts[skill] += 1
                post_hits[skill].append(company)

    n = len(texts)
    ranked = sorted(counts.items(), key=lambda x: (-x[1], x[0]))
    top_10 = []
    for i, (skill, count) in enumerate(ranked[:10], 1):
        top_10.append(
            {
                "rank": i,
                "skill": skill,
                "count": count,
                "total": n,
                "pct": round(100 * count / n),
                "companies": post_hits[skill],
            }
        )
    return n, top_10


def main():
    texts = load_texts()
    n, top_10 = analyze(texts)
    out = {
        "posts_analyzed": n,
        "companies": list(texts.keys()),
        "top_10": top_10,
    }
    out_path = Path(__file__).resolve().parents[1] / "docs" / "skill-analysis.json"
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    for row in top_10:
        print(f"{row['rank']}. {row['skill']} | {row['count']}/{n} ({row['pct']}%)")


if __name__ == "__main__":
    main()
