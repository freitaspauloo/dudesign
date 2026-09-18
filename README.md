# Conifer — landing redesign workspace

Local mirror of [conifer.build](https://www.conifer.build) for the landing-page redesign (Michael Jeffords / YC S26).

**Plan & roadmap:** [Notion — Conifer Landing Page Redesign](https://app.notion.com/p/3d50f86a172081cc99f3c6101f91bda3)

**Branches:** `main` = stable / what Michael sees · `dev` = work in progress.

Previously lived under [`freitaspauloo/dudesign`](https://github.com/freitaspauloo/dudesign) (`clients/conifer` on branch `conifer-main`).

## Refresh mirror

```bash
npm run mirror
```

## Preview locally

```bash
npm run preview
```

Opens at **http://127.0.0.1:4321** — static snapshot with CSS, fonts, images, and JS bundles from the live site.

Other previews: `npm run preview:v2` (port 4323), `preview:v3` (4324), `preview:v4` (4325).

## Layout

| Path | Purpose |
|------|---------|
| `site/` | Mirrored static site (do not edit — re-run mirror to refresh) |
| `MIRROR.json` | Last mirror timestamp + file count |
| `redesign/` … `redesign-v4/` | Redesign iterations |

## Notes

- ASCII hero and interactions depend on the mirrored JS bundles; serve locally rather than opening `index.html` directly.
- Some API-backed pages (console, admin) are HTML shells only — expected.
- Mirror is for internal redesign reference, not redistribution.
