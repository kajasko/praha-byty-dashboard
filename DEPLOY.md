# Deploy & daily refresh — Praha Byty dashboard

Public site: **https://kajasko.github.io/praha-byty-dashboard/**

Airtable (`appa2Lby5vCZbdbsf` / Properties) stays source of truth. This repo is a **static snapshot** (no API keys in the browser). Live feel = rebuild data on the box and re-push.

## One-time (already done)

1. Public repo `kajasko/praha-byty-dashboard`
2. GitHub Pages from branch `main` / folder `/` (root)
3. Client only loads `data.js` + local `thumbs/` — never Airtable tokens

## Daily rebuild (routine prompt draft)

Copy into a scheduled agent routine (do **not** put PAT in client JS):

```
Daily Praha Byty dashboard refresh (Europe/Prague morning):

1. Via Airtable MCP (user-Airtable), read base appa2Lby5vCZbdbsf table Properties tblN9zKqD4sNnTmrw.
2. Apply dashboard rules from /workspace/praha-byty-dashboard/README.md:
   - Co teď: Listing Availability = ACTIVE VERIFIED AND Last Verified = today (Europe/Prague)
     AND Next Action ∈ {CALL NOW, BOOK VIEWING}
   - Investigate section: same but Next Action = INVESTIGATE
   - Never include REMOVED/INACTIVE, RESERVED, UNKNOWN, REJECT, NONE, WATCH/WAIT, or stale Last Verified
3. Regenerate /workspace/praha-byty-dashboard/data.js + data.json (window.PRAHA_BYTY_DATA).
4. Refresh thumbs/ for included records only; delete unused thumb files.
5. Sync publish tree (exclude _build) into git clone of kajasko/praha-byty-dashboard,
   commit "chore: daily dashboard refresh YYYY-MM-DD", push to main.
6. Confirm https://kajasko.github.io/praha-byty-dashboard/ loads (Pages may lag ~1 min).

NEVER write Airtable API keys into app.js, data.js, or any file served by Pages.
```

## Manual re-deploy from box

```bash
# after regenerating data.js / thumbs under /workspace/praha-byty-dashboard/
cd /tmp/praha-byty-pages   # or a persistent clone
# copy updated files (exclude _build), then:
git add -A && git commit -m "chore: dashboard refresh" && git push origin main
```

## Netlify Drop fallback (if Pages is down)

Zip the folder (no `_build`), open https://app.netlify.com/drop, drag the zip — get a temporary `*.netlify.app` URL in two clicks.
