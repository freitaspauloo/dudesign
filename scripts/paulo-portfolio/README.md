# Paulo portfolio — Frameline homepage grid

Patch for **freitaspauloo/Paulo** (deploys to [paulo.dudesign.us](https://paulo.dudesign.us)).

## Apply (local or Cloud Agent without Paulo repo push access)

From a clone of `https://github.com/freitaspauloo/Paulo`:

```bash
git checkout -b cursor/frameline-portfolio-cases-3d43
git am /path/to/dudesign/scripts/paulo-portfolio/0001-Add-seven-Frameline-catalog-cases-to-homepage-grid.patch
git push -u origin cursor/frameline-portfolio-cases-3d43
```

If `git am` fails on binary assets, copy `frameline-assets/*.webp` into `public/work/cases/frameline/` and apply the code hunks from the patch manually.

## Deploy

Merge the PR on GitHub, then deploy the Paulo project on Vercel (account: **dudufreitas28@gmail.com**).

## What changed

- Homepage featured grid: **7 Frameline catalog screens** with title + short description.
- Posters from [frameline.ai](https://frameline.ai) catalog, optimized as WebP.
