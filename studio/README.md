# DUDESIGN — studio site

Duplicate of the personal portfolio, with studio copy.

The personal site stays in [`portfolio/`](../portfolio/) and keeps deploying to [paulo.dudesign.us](https://paulo.dudesign.us). This app does not replace it, and it does not replace the pitch deck at the repo root.

**Live URL:** [studio.dudesign.us](https://studio.dudesign.us)

## Run locally

From the **dudesign repo root**:

```bash
npm run studio:install   # first time
npm run studio:dev       # http://localhost:3002
```

Or from this folder:

```bash
npm install
npm run dev
```

## Routes

| Path | Purpose |
|------|---------|
| `/` | Home — hero + selected work |
| `/work` | Case index |
| `/work/*` | Case studies |
| `/about` | Studio |

`/fun` and `/resume` exist only on the personal portfolio. Here they redirect to `/about`.

## Content

Case studies live in `src/content/cases/`. They use the same projects as the personal portfolio, written in the studio voice (we, our).

## Deploy

Do not point the existing Paulo Vercel project at this folder. That project must keep Root Directory `portfolio` so paulo.dudesign.us stays the personal site.

`studio.dudesign.us` is a subdomain of `dudesign.us`, which is already registered at Hover, so there is nothing to buy. To put it live:

1. In Vercel, create a new project from this repo with Root Directory `studio`.
2. In that project, go to Settings → Domains and add `studio.dudesign.us`. Make it the primary domain.
3. In Hover, open DNS for `dudesign.us` and add a `CNAME` record with host `studio` and the target Vercel shows (for example `cname.vercel-dns.com`).
4. Wait for Vercel to show the domain as Valid Configuration. It issues HTTPS automatically.

Attaching `dudesign.us` itself to this project would replace the pitch deck, so leave the apex domain as it is until that cutover is intentional.
