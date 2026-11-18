# Paulo Freitas — Portfolio

Personal portfolio for **Product Designer — AI/SaaS** job applications.

**Live:** [paulo.dudesign.us](https://paulo.dudesign.us)

This app lives inside the **dudesign** monorepo. Vercel deploys it from `portfolio/` (Root Directory) on pushes to `main`.

## Run locally

From the **dudesign repo root**:

```bash
npm run portfolio:install   # first time
npm run portfolio:dev       # http://localhost:3001
```

Or from this folder:

```bash
npm install
npm run dev
```

Preview via the studio dev server at [http://localhost:3000/paulo](http://localhost:3000/paulo) (proxies to port 3001).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Home — hero + selected work |
| `/work` | Case index |
| `/work/*` | Case studies |
| `/fun` | Interests |
| `/about` | Bio + skills |
| `/resume` | Print-friendly résumé |

## Content

Case studies live in `src/content/cases/`. Edit typed TS files — no CMS.

## Deploy (Vercel)

One GitHub repo (`freitaspauloo/dudesign`), two Vercel projects:

| Domain | Root Directory | App |
|--------|----------------|-----|
| `dudesign.us` | `.` (repo root) | Studio pitch deck |
| `paulo.dudesign.us` | `portfolio` | This portfolio |

In the **Paulo** Vercel project: **Settings → Git → Root Directory → `portfolio`**, then connect to `freitaspauloo/dudesign` and redeploy.

Distribution checklist: [docs/distribution-personal-portfolio.md](../docs/distribution-personal-portfolio.md)
