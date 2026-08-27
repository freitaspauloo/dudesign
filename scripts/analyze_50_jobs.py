"""Fetch up to 50 Sr/Product Designer JDs from AI/SaaS boards and rank skills."""
import json
import re
import html
import urllib.request
import urllib.error
from collections import defaultdict
from pathlib import Path

GREENHOUSE_BOARDS = [
    "gitlab", "stripe", "scaleai", "intercom", "durable", "vsco39", "sigmacomputing",
    "aidashinc", "circleso", "openai", "anthropic", "notion", "figma", "datadog",
    "mongodb", "hashicorp", "databricks", "snowflake", "ramp", "brex", "plaid",
    "rippling", "gusto", "airtable", "asana", "dropbox", "zapier", "canva",
    "discord", "slack", "vercel", "linear", "retool", "loom", "figma",
    "cohere", "mistral", "perplexity", "runwayml", "character", "togetherai",
    "weightsandbiases", "huggingface", "replicate", "langchain", "pinecone",
    "weaviate", "supabase", "planetscale", "neon", "flyio", "railway",
    "temporal", "cockroachlabs", "confluent", "elastic", "grafana", "sentry",
    "launchdarkly", "amplitude", "mixpanel", "posthog", "lattice", "gong",
    "clay", "harvey", "engine", "fal", "scaleai", "doordash", "instacart",
]

ASHBY_ORGS = [
    "runpod", "owner", "render", "tessera-labs", "check-technologies", "futurefitai",
    "cohere", "whoop", "ashby", "vercel", "linear", "notion", "anthropic",
    "perplexity", "replit", "lovable", "cursor", "anysphere", "harvey",
    "gorgias", "deel", "remote", "mercury", "ramp", "brex", "clerk",
    "resend", "mintlify", "modal", "baseten", "together", "helicone",
]

TITLE_RE = re.compile(
    r"product designer|staff product designer|senior product designer|"
    r"lead product designer|principal product designer|design engineer|"
    r"product design manager|ux designer.*product|product.*ux designer",
    re.I,
)

SKILL_PATTERNS = [
    ("End-to-end product design (0 to 1 through ship)", [
        r"end[- ]to[- ]end", r"0 to 1", r"zero to one", r"ideation to launch",
        r"initial concept through", r"from problem framing through launch",
        r"beginning to end", r"own the design process", r"no hand-offs",
        r"concept through delivery", r"full design lifecycle",
    ]),
    ("Systems thinking and design systems", [
        r"systems thinking", r"design systems?", r"component librar",
        r"shared systems", r"cohesive and scalable", r"visual language",
        r"platform design", r"platform-level design", r"cross-product",
    ]),
    ("AI and agent UX design", [
        r"AI[- ]native", r"AI[- ]powered", r"agentic", r"generative AI",
        r"designing with AI", r"AI agents?", r"AI experiences", r"AI-augmented",
        r"AI workflow", r"AI-first", r"AI Customer Agent", r"AI suite",
        r"prompt interface", r"multi-modal", r"LLM", r"intelligent systems",
        r"conversational AI", r"multi-agent",
    ]),
    ("Prototyping in code (beyond static mocks)", [
        r"prototyp", r"ship(ping)? in code", r"production code",
        r"working near code", r"producing in code", r"build prototypes",
        r"HTML/CSS", r"design engineer", r"not a role where you.*Figma",
        r"prototype in code", r"designer who codes",
    ]),
    ("Cursor, Claude Code, or v0", [
        r"Cursor", r"Claude Code", r"\bv0\b", r"AI-assisted coding",
        r"Figma Make", r"AI coding tools",
    ]),
    ("Cross-functional leadership with PM and Eng", [
        r"cross-functional", r"product managers?", r"\bPM\b", r"engineers?",
        r"engineering", r"paired tightly with", r"partnership with product",
        r"influencing cross-functional", r"partner with product and engineering",
        r"stakeholders",
    ]),
    ("User research and validation", [
        r"user research", r"customer research", r"conduct user research",
        r"research synthesis", r"uncover pain points", r"qualitative and quantitative",
        r"leveraging insights", r"validated user evidence", r"talking to customers",
    ]),
    ("Interaction and visual craft", [
        r"interaction design", r"visual design", r"pixel-perfect", r"craft bar",
        r"high craft", r"strong craft", r"visual and interaction", r"has taste",
        r"software craftsmanship", r"polished execution", r"obsession with craft",
    ]),
    ("Experimentation, growth, and metrics", [
        r"experiment", r"hypothes", r"measurable outcomes",
        r"success (criteria|measures)", r"funnel", r"activation", r"retention",
        r"conversion", r"onboarding", r"product data", r"monetization", r"evals",
    ]),
    ("Developer tools, B2B SaaS, or enterprise complexity", [
        r"developer tools", r"DevSecOps", r"technical products", r"infrastructure",
        r"B2B SaaS", r"enterprise", r"complex.*product", r"software products",
        r"dev cloud", r"desktop SaaS", r"data-intensive",
    ]),
    ("Storytelling and design communication", [
        r"storytelling", r"articulate design", r"compelling story",
        r"influential storyteller", r"explain tradeoffs", r"written and verbal communication",
    ]),
    ("Accessibility and trust UX", [
        r"accessibility", r"build trust", r"help users understand, trust",
        r"high-stakes", r"sensitive user", r"trustworthy", r"trust signals",
        r"explainability", r"transparency",
    ]),
    ("Figma fluency", [r"\bFigma\b"]),
    ("React or frontend fluency", [
        r"\bReact\b", r"JavaScript", r"frontend", r"web code", r"HTML/CSS",
    ]),
]


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode())


def strip_html(s):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    return re.sub(r"\s+", " ", s).strip()


def greenhouse_jobs(board):
    try:
        data = fetch_json(f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs")
        return data.get("jobs", [])
    except Exception:
        return []


def ashby_jobs(org):
    try:
        data = fetch_json(f"https://api.ashbyhq.com/posting-api/job-board/{org}")
        return data.get("jobs", [])
    except Exception:
        return []


def collect_posts(limit=50):
    posts = []
    seen = set()

    def add(name, title, text, url):
        key = (name.lower(), title.lower())
        if key in seen or len(text) < 200:
            return
        seen.add(key)
        posts.append({"company": name, "title": title, "url": url, "text": text})

    for board in GREENHOUSE_BOARDS:
        if len(posts) >= limit:
            break
        for job in greenhouse_jobs(board):
            title = job.get("title", "")
            if not TITLE_RE.search(title):
                continue
            # prefer senior/staff/lead/AI roles
            if not re.search(r"senior|staff|lead|principal|AI|product designer", title, re.I):
                continue
            jid = job.get("id")
            try:
                detail = fetch_json(
                    f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs/{jid}"
                )
                text = strip_html(detail.get("content", ""))
                url = job.get("absolute_url") or f"https://job-boards.greenhouse.io/{board}/jobs/{jid}"
                add(job.get("company_name") or board, title, text, url)
            except Exception:
                pass
            if len(posts) >= limit:
                break

    for org in ASHBY_ORGS:
        if len(posts) >= limit:
            break
        for job in ashby_jobs(org):
            title = job.get("title", "")
            if not TITLE_RE.search(title):
                continue
            if not re.search(r"senior|staff|lead|principal|AI|product designer", title, re.I):
                continue
            text = strip_html(job.get("descriptionPlain") or job.get("descriptionHtml") or "")
            url = job.get("jobUrl") or job.get("applyUrl") or ""
            add(job.get("companyName") or org, title, text, url)
            if len(posts) >= limit:
                break

    return posts[:limit]


def analyze(posts):
    counts = defaultdict(int)
    hits = defaultdict(list)
    for p in posts:
        label = p["company"]
        text = p["text"]
        for skill, patterns in SKILL_PATTERNS:
            if any(re.search(pat, text, re.I) for pat in patterns):
                counts[skill] += 1
                hits[skill].append(label)
    n = len(posts)
    ranked = sorted(counts.items(), key=lambda x: (-x[1], x[0]))
    top10 = []
    for i, (skill, count) in enumerate(ranked[:10], 1):
        top10.append({
            "rank": i, "skill": skill, "count": count, "total": n,
            "pct": round(100 * count / n), "companies": hits[skill][:8],
            "more": max(0, len(hits[skill]) - 8),
        })
    extras = []
    for skill, count in ranked[10:14]:
        extras.append({"skill": skill, "count": count, "total": n, "pct": round(100 * count / n)})
    return n, top10, extras, ranked


def main():
    posts = collect_posts(50)
    n, top10, extras, ranked = analyze(posts)
    out = Path(__file__).parent / "job-analysis-50.json"
    out.write_text(json.dumps({
        "posts_analyzed": n,
        "posts": [{"company": p["company"], "title": p["title"], "url": p["url"]} for p in posts],
        "top_10": top10,
        "extras": extras,
        "all_skills": [{"skill": s, "count": c, "pct": round(100*c/n)} for s, c in ranked],
    }, indent=2), encoding="utf-8")
    print(f"Analyzed {n} posts")
    for row in top10:
        print(f"{row['rank']}. {row['skill']} | {row['count']}/{n} ({row['pct']}%)")


if __name__ == "__main__":
    main()
