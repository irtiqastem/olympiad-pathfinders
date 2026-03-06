# 🔧 Fixes Applied — Why Your Site Was Blank on GitHub Pages

## Root Causes & Solutions

---

### ✅ Fix 1: Missing GitHub Actions Deployment Workflow
**File added:** `.github/workflows/deploy.yml`

**Problem:** GitHub Pages was likely set to deploy from a branch (e.g. `gh-pages`), but no build step was running. The raw source code was being served instead of the compiled `dist/` folder. React/Vite apps need to be **built** before deployment.

**Solution:** A complete workflow was added that:
- Triggers on every push to `main`
- Runs `npm ci` + `npm run build`
- Uploads the `dist/` folder to GitHub Pages

**After pushing, go to:** `Settings → Pages → Source → GitHub Actions`

---

### ✅ Fix 2: BrowserRouter → HashRouter (Most likely blank screen cause)
**File changed:** `src/App.tsx`

**Problem:** `BrowserRouter` relies on the server to serve `index.html` for every URL (e.g. `/olympiad-tracks`, `/dashboard`). GitHub Pages is a **static file server** — it doesn't know to serve `index.html` for those paths. It returns a real 404, which means your React app never loads → **blank screen**.

**Solution:** Switched to `HashRouter`, which uses `/#/` style URLs (e.g. `/#/olympiad-tracks`). GitHub Pages always serves `index.html` for the root path, and the `#` fragment is handled entirely by React in the browser.

```tsx
// BEFORE (broken on GitHub Pages)
import { BrowserRouter } from "react-router-dom";
<BrowserRouter>...</BrowserRouter>

// AFTER (works on GitHub Pages)
import { HashRouter } from "react-router-dom";
<HashRouter>...</HashRouter>
```

> **Note:** If you use a custom domain (irtiqastem.org) with proper server-side redirect rules, you could switch back to BrowserRouter. But HashRouter is the safest choice for GitHub Pages.

---

### ✅ Fix 3: Added `public/404.html`
**File added:** `public/404.html`

As an extra safety net, if GitHub Pages ever serves a 404 (e.g. someone bookmarks a direct URL), the `404.html` page redirects them back to the root so HashRouter can take over.

---

### ✅ Fix 4: Verified `vite.config.ts` base path
**File changed:** `vite.config.ts`

Set `base: "/"` — correct when using a custom domain (CNAME points to `irtiqastem.org`). If you were NOT using a custom domain and your repo was at `github.com/user/olympiad-pathfinders`, you'd need `base: "/olympiad-pathfinders/"`.

---

## Deployment Steps

1. Push this entire folder to your GitHub repository's `main` branch
2. Go to `Settings → Pages` in your repo
3. Under **Source**, select **"GitHub Actions"**
4. The workflow will trigger automatically and deploy your site
5. Your site will be live at your custom domain or `https://username.github.io/repo-name/`
