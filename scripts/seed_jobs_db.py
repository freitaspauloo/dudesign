"""Generate Notion create-pages batches for jobs database."""
import json
from pathlib import Path

TOP = {
    "harvey", "owner", "gitlab", "render", "vercel", "runpod", "linear", "notion",
    "anthropic", "openai", "scale", "cohere", "fal", "durable", "tessera", "futurefit",
    "check", "intercom", "fin",
}

jobs = json.load(open(Path(__file__).parent / "jobs-100.json", encoding="utf-8"))["jobs"]

pages = []
for j in jobs:
    company = j["company"]
    title = j["title"]
    name = f"{company} — {title}"
    if len(name) > 200:
        name = name[:197] + "..."
    priority = ["Top"] if any(t in company.lower() for t in TOP) else []
    loc = (j.get("location") or "").lower()
    if j.get("remote") or "remote" in loc:
        remote_type = "Remote"
    elif "hybrid" in loc:
        remote_type = "Hybrid"
    else:
        remote_type = None

    props = {
        "Name": name,
        "Company": company,
        "Role": title,
        "Link": j["url"],
        "Location": j.get("location") or "",
        "Priority": priority,
        "Status": "Para aplicar",
    }
    if remote_type:
        props["Remote"] = remote_type
    pages.append({"properties": props})

out = Path(__file__).parent / "jobs-db-pages.json"
out.write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"{len(pages)} pages written to {out}")
