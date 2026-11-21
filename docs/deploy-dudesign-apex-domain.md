# Move studio site to dudesign.us (apex)

**Goal:** serve the Next.js app in `studio/` at **https://dudesign.us** instead of **https://studio.dudesign.us**, and retire the old Framer site on the apex domain.

**Current DNS (Nov 2026):**

| Host | Points to |
|------|-----------|
| `dudesign.us` (apex) | Framer (`31.43.160.6`, `31.43.161.6`) |
| `www.dudesign.us` | `sites.framer.app` |
| `studio.dudesign.us` | Vercel (`dudesign-i742.vercel.app`) |

The repo’s `studio/middleware.ts` sends **308** redirects from `studio.dudesign.us` → `dudesign.us` once both hosts hit the same Vercel project.

## 1. Vercel (project that deploys `studio/`)

Account: **dudufreitas28@gmail.com** (see `scripts/paulo-portfolio/README.md`).

1. Open the Vercel project that serves **studio.dudesign.us** (CNAME target `dudesign-i742.vercel.app`).
2. Confirm **Settings → Git → Root Directory** = `studio`.
3. **Settings → Domains** → add:
   - `dudesign.us`
   - `www.dudesign.us`
4. Leave `studio.dudesign.us` attached (for the redirect middleware).
5. Copy the DNS records Vercel shows for apex + www (usually apex **A** → `76.76.21.21`, **www** **CNAME** → `cname.vercel-dns.com`).

Redeploy after merging canonical URL changes on `main`.

## 2. Hover (dudesign.us)

1. Log in at [hover.com](https://www.hover.com) → **dudesign.us** → **DNS**.
2. Remove or replace Framer records on **@** and **www**:
   - Delete apex **A** records to `31.43.160.6` / `31.43.161.6`.
   - Delete **www** **CNAME** to `sites.framer.app` (if present).
3. Add Vercel records from step 1 (apex **A** `76.76.21.21` and/or Hover **ALIAS** to `cname.vercel-dns.com` if Hover offers it for apex).
4. Add **www** **CNAME** → `cname.vercel-dns.com` if Vercel requests it.
5. Do **not** change `studio`, `paulo`, or MX/email records unless Vercel/Hover tell you to.

Propagation can take from a few minutes up to 48 hours.

## 3. Verify

```bash
dig dudesign.us +short
dig www.dudesign.us +short
curl -sI https://dudesign.us/ | head -5    # expect server: Vercel
curl -sI https://studio.dudesign.us/ | grep -i location   # expect https://dudesign.us/
```

## 4. Optional cleanup

- Remove the Framer custom domain for `dudesign.us` in Framer so it is not accidentally re-pointed.
- After a few weeks, you can remove `studio.dudesign.us` from Vercel if you no longer need the subdomain hostname (keep it while bookmarks still use it).