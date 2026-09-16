# Conifer — reference clone

Local mirror of [conifer.build](https://www.conifer.build) for the landing-page redesign (Michael Jeffords / YC S26).

**Plan & roadmap:** [Notion — Conifer Landing Page Redesign](https://app.notion.com/p/3d50f86a172081cc99f3c6101f91bda3)

**Branches:** `conifer-main` = stable / what Michael sees · `conifer-dev` = work in progress.

## Refresh mirror

```bash
node scripts/mirror-conifer.mjs
```

## Preview locally

```bash
npm run conifer:preview
```

Opens at **http://127.0.0.1:4321** — static snapshot with CSS, fonts, images, and JS bundles from the live site.

## Layout

| Path | Purpose |
|------|---------|
| `site/` | Mirrored static site (do not edit — re-run mirror to refresh) |
| `MIRROR.json` | Last mirror timestamp + file count |
| `redesign/` | Your redesign work goes here (next step) |

## Notes

- ASCII hero and interactions depend on the mirrored JS bundles; serve locally rather than opening `index.html` directly.
- Some API-backed pages (console, admin) are HTML shells only — expected.
- Mirror is for internal redesign reference, not redistribution.
