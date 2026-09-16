"""Scrape up to 100 Sr/Staff Product Designer roles from Greenhouse + Ashby boards."""
import json
import re
import urllib.request
from pathlib import Path

GREENHOUSE_BOARDS = [
    "gitlab", "stripe", "scaleai", "intercom", "durable", "vsco39", "sigmacomputing",
    "aidashinc", "circleso", "anthropic", "figma", "datadog", "databricks", "brex",
    "gusto", "airtable", "asana", "dropbox", "discord", "vercel", "linear", "retool",
    "cohere", "harvey", "fal", "mongodb", "hashicorp", "snowflake", "ramp", "plaid",
    "rippling", "zapier", "canva", "slack", "notion", "openai", "weightsandbiases",
    "huggingface", "replicate", "langchain", "pinecone", "supabase", "flyio", "railway",
    "temporal", "cockroachlabs", "confluent", "elastic", "grafana", "sentry",
    "launchdarkly", "amplitude", "mixpanel", "posthog", "lattice", "gong", "clay",
    "engine", "doordash", "instacart", "figma", "mongodb", "cloudflare", "netlify",
    "twilio", "segment", "figma", "figma", "figma",
]

ASHBY_ORGS = [
    "runpod", "owner", "render", "tessera-labs", "check-technologies", "futurefitai",
    "cohere", "whoop", "vercel", "linear", "anthropic", "perplexity", "replit",
    "lovable", "anysphere", "harvey", "gorgias", "deel", "mercury", "ramp", "brex",
    "clerk", "resend", "mintlify", "modal", "baseten", "together", "helicone",
    "notion", "cursor", "ashby", "figma",
]

TITLE_RE = re.compile(
    r"product designer|staff product designer|senior product designer|"
    r"lead product designer|principal product designer|design engineer|"
    r"product design manager",
    re.I,
)

LEVEL_RE = re.compile(r"senior|staff|lead|principal|AI|product designer", re.I)


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode())


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


def collect(limit=100):
    posts = []
    seen_urls = set()

    def add(company, title, url, location="", remote=""):
        if not url or url in seen_urls:
            return
        seen_urls.add(url)
        posts.append({
            "company": company,
            "title": title,
            "url": url,
            "location": location or "",
            "remote": remote or "",
        })

    for board in GREENHOUSE_BOARDS:
        if len(posts) >= limit:
            break
        for job in greenhouse_jobs(board):
            title = job.get("title", "")
            if not TITLE_RE.search(title) or not LEVEL_RE.search(title):
                continue
            jid = job.get("id")
            url = job.get("absolute_url") or f"https://job-boards.greenhouse.io/{board}/jobs/{jid}"
            loc = job.get("location", {}).get("name", "") if isinstance(job.get("location"), dict) else str(job.get("location") or "")
            remote = "Remote" if re.search(r"remote", loc, re.I) else ""
            add(job.get("company_name") or board.title(), title, url, loc, remote)
            if len(posts) >= limit:
                break

    for org in ASHBY_ORGS:
        if len(posts) >= limit:
            break
        for job in ashby_jobs(org):
            title = job.get("title", "")
            if not TITLE_RE.search(title) or not LEVEL_RE.search(title):
                continue
            url = job.get("jobUrl") or job.get("applyUrl") or ""
            loc = job.get("location") or job.get("locationName") or ""
            if isinstance(loc, list):
                loc = ", ".join(str(x) for x in loc)
            remote = "Remote" if job.get("isRemote") or re.search(r"remote", str(loc), re.I) else ""
            add(job.get("companyName") or org.title(), title, url, str(loc), remote)
            if len(posts) >= limit:
                break

    return posts[:limit]


def main():
    posts = collect(100)
    out = Path(__file__).parent / "jobs-100.json"
    out.write_text(json.dumps({"scraped_at": "2026-09-07", "count": len(posts), "jobs": posts}, indent=2), encoding="utf-8")
    print(f"Scraped {len(posts)} jobs -> {out}")


if __name__ == "__main__":
    main()
