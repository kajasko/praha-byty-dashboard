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

- Weekly heavy scan 19. 10. 2026 (Europe/Prague): 89 live-looking Airtable records re-verified on their listing URLs → 73 still ACTIVE VERIFIED, 6 demoted to REMOVED / INACTIVE (ads gone), 10 RESERVED (off the dashboard), 1 unverifiable (Aubrechtové – ceskereality 403). Na vrcholu (Žižkov) is back: the same flat was relisted on Sreality. Price drops: Černokostelecká 2+kk, Bednářská, Na Balkáně mezonet, Zvonková, V předpolí, Ovčárská.
- New this week: 19 secondary-market flats (Strašnice / Záběhlice / Nusle / Vršovice / Žižkov / Malešice / Michle / Vinohrady) + 8 new builds (M-House Vršovice, Za.hraďák, Roztylské nám., Harfa Living, Bohdalecké zahrady, Tesla Hloubětín, Kaskády 208/S, RANTA D 201).
- **15** Co teď cards (9 CALL NOW, 6 BOOK VIEWING), **74** investigate cards, **89** total; 78 with real photos, 11 placeholders (developer pages without a static photo).
- Only ACTIVE VERIFIED records verified on 19. 10. 2026 are included; thumbs of dead / non-dashboard records were removed from `thumbs/`.

Refresh: re-run the verification task and replace `data.js` / `data.json` / `thumbs/`.
