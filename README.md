# Praha Byty — visual browsing dashboard

**Live (GitHub Pages):** https://kajasko.github.io/praha-byty-dashboard/

See [DEPLOY.md](DEPLOY.md) for daily rebuild. No Airtable secrets in client JS.

Bilingual (CS default + EN toggle) card gallery for Karolína’s Praha Byty pipeline.

**Airtable stays source of truth** (`appa2Lby5vCZbdbsf` / Properties `tblN9zKqD4sNnTmrw`). This folder is a local snapshot for clearer browsing with listing photos — records were not migrated.

## Open it

### Option A — open the file directly
```bash
open /workspace/praha-byty-dashboard/index.html
```
On macOS Finder: navigate to `/workspace/praha-byty-dashboard/` and double-click `index.html`.  
Works offline because data is embedded in `data.js` and photos are local under `thumbs/`.

### Option B — tiny local server (recommended if a browser blocks `file://`)
```bash
cd /workspace/praha-byty-dashboard
python3 -m http.server 8765
```
Then open http://127.0.0.1:8765/

## What’s inside

| File | Role |
|------|------|
| `index.html` | App shell |
| `styles.css` | Warm Scandi UI |
| `app.js` | Filters, sort, CS/EN |
| `data.js` / `data.json` | Snapshot of live candidates |
| `thumbs/` | Cached listing photos (or initials placeholder in UI) |

## Rules (since 5. 10. 2026 re-verification)

- **Co teď / What now** (top grid): `Listing Availability = ACTIVE VERIFIED` AND `Last Verified` = today (Europe/Prague) AND `Next Action` ∈ {`CALL NOW`, `BOOK VIEWING`}.
- **K prověření · ověřeno dnes** (separate section): same, but `Next Action = INVESTIGATE`.
- Never shown: `REMOVED / INACTIVE`, `RESERVED`, `UNKNOWN`, `REJECT`, `NONE`, `WATCH / WAIT`, or anything with Last Verified before today.
- `app.js` has a hard runtime guard: it drops any card that is not ACTIVE VERIFIED or not verified on the browser's current Prague date, and hides all cards with a "re-verify" notice if the snapshot is from an earlier day.

## Data snapshot (this build)

- Heavy scan 5. 10. 2026 ~20:00 (Europe/Prague): 72 Airtable records re-verified via their listing URLs → 69 live (4 of them RESERVED), 1 demoted to REMOVED / INACTIVE (Ruská – sold), 1 UNKNOWN (Aubrechtové – ceskereality 403, needs browser). Litevská moved to its new Sreality listing (price drop 8.95 → 8.85 M Kč).
- New today: 8 secondary-market candidates (Žižkov / Strašnice / Vršovice / Nusle) + 3 new builds (Rezidence K Botiči, Bohdalecké zahrady ×2).
- **7** Co teď cards (6 CALL NOW, 1 BOOK VIEWING), **57** investigate cards, **64** total; 54 with real photos, 10 placeholders (developer pages without a static photo).
- Thumbs of dead / non-dashboard records were removed from `thumbs/`.

Refresh: re-run the verification task and replace `data.js` / `data.json` / `thumbs/`.
