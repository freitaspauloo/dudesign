# Deploy paulo.dudesign.us from dudesign

One GitHub repo, two Vercel projects.

| Site | Repo | Root Directory | Domain |
|------|------|----------------|--------|
| Studio deck | `freitaspauloo/dudesign` | `.` | `dudesign.us` |
| Personal portfolio | `freitaspauloo/dudesign` | `portfolio` | `paulo.dudesign.us` |

## One-time Vercel setup (Paulo project)

1. Open [vercel.com/dashboard](https://vercel.com/dashboard) → **Paulo** project (or create one).
2. **Settings → Git**
   - Repository: `freitaspauloo/dudesign`
   - Production Branch: `main`
   - **Root Directory: `portfolio`** (enable the override toggle)
3. **Settings → Domains** — confirm `paulo.dudesign.us` is attached.
4. **Deployments → Redeploy** latest `main`.

The old `freitaspauloo/Paulo` repo can stay archived; production should no longer deploy from it.

## Ship changes

```bash
# edit files under portfolio/
git add portfolio/
git commit -m "Update portfolio …"
git push origin main
```

Vercel rebuilds the Paulo project automatically when `portfolio/` changes on `main`.

## Local dev

```bash
npm run portfolio:install   # once
npm run portfolio:dev       # :3001
npm run dev                 # :3000 deck; /paulo proxies to :3001
```

## Verify

- https://paulo.dudesign.us
- https://paulo.dudesign.us/work
- https://paulo.dudesign.us/fun
