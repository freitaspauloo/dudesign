import json
from pathlib import Path

jobs = json.load(open(Path(__file__).parent / "jobs-100.json", encoding="utf-8"))["jobs"]

TOP = {
    "harvey", "owner", "gitlab", "render", "vercel", "runpod", "linear", "notion",
    "anthropic", "openai", "scale", "cohere", "fal", "durable", "tessera", "futurefit",
    "check", "intercom", "fin",
}

rows = []
for i, j in enumerate(jobs, 1):
    company = j["company"]
    priority = "⭐ Top" if any(t in company.lower() for t in TOP) else ""
    remote = j.get("remote") or ("Remote" if "remote" in (j.get("location") or "").lower() else "")
    loc = (j.get("location") or "").replace("|", "/")
    title = j["title"].replace("|", "/")
    url = j["url"]
    rows.append(
        f"<tr><td>{i}</td><td>{company}</td><td>{title}</td>"
        f"<td>[Apply]({url})</td><td>{loc}</td><td>{remote}</td>"
        f"<td>{priority}</td><td></td></tr>"
    )

table = (
    '<table header-row="true" fit-page-width="true">\n'
    "<tr><td>#</td><td>Company</td><td>Role</td><td>Link</td>"
    "<td>Location</td><td>Remote</td><td>Priority</td><td>Status</td></tr>\n"
    + "\n".join(rows)
    + "\n</table>"
)

out = Path(__file__).parent / "jobs-table-notion.txt"
out.write_text(table, encoding="utf-8")
print(f"Wrote {len(table)} chars, {len(rows)} rows")
