# DUDESIGN — studio site

Duplicate of the personal portfolio, with studio copy.

The personal site stays in [`portfolio/`](../portfolio/) and keeps deploying to [paulo.dudesign.us](https://paulo.dudesign.us). This app does not replace it, and it does not replace the pitch deck at the repo root.

**Canonical URL in metadata:** [dudesign.us](https://dudesign.us)

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
| `/fun` | Interests |
| `/about` | Studio |
| `/resume` | Studio background |

## Content

Case studies live in `src/content/cases/`. They match the personal portfolio. Studio voice is in the public chrome: home, about, footer, and metadata.

## Deploy

Do not point the existing Paulo Vercel project at this folder. That project must keep Root Directory `portfolio` so paulo.dudesign.us stays the personal site.

A separate Vercel project can use Root Directory `studio`. Attaching `dudesign.us` to it would replace the pitch deck, so leave domains as they are until that cutover is intentional.
