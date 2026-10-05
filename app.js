(function () {
  const I18N = {
    cs: {
      pageTitle: "Praha Byty — prohlížení | Praha Byty — browse",
      kicker: "Praha Byty · prohlížení",
      title: "Byty k rozhodnutí",
      subtitle: "Jen dnes ověřené živé inzeráty z Airtable (ACTIVE VERIFIED). Prodané/stažené se nezobrazují.",
      filterAll: "Vše",
      filterNow: "Co teď",
      filterDad: "Dad",
      filterInvest: "Investice",
      filterNewbuild: "Novostavby",
      filterActive: "Jen ACTIVE",
      sortLabel: "Řadit",
      sortDad: "Dad Fit",
      sortInv: "Investment",
      sortPrice: "Cena",
      sortVerified: "Naposledy ověřeno",
      showing: "Zobrazeno",
      of: "z",
      photos: "s fotkou",
      placeholders: "placeholder",
      openListing: "Otevřít inzerát",
      noUrl: "Bez URL",
      verified: "Ověřeno",
      never: "neověřeno",
      empty: "Nic neodpovídá filtrům.",
      emptyNow: "Dnes žádný ověřený živý byt k akci.",
      invTitle: "K prověření · ověřeno dnes",
      invSub: "ACTIVE VERIFIED a dnes znovu otevřené — zatím ne Co teď.",
      stale: "Data nejsou ověřena dnes — karty skryty. Spusťte znovu ověření inzerátů.",
      dad: "Dad",
      inv: "Invest",
      drop: "Sleva",
      reserved: "RESERVED",
      landEyebrow: "Soukromé · rodina",
      landTitle: "Shortlist živých pražských bytů",
      landLead: "Pro tátu (na bydlení) a na dlouhodobý pronájem. Jen dnes ověřené živé inzeráty.",
      heroScript: "Praha",
      heroTagline: "Skvělé místo k životu",
      land1t: "Co teď",
      land1: "Kandidáti na volat / prohlídku, ověřené dnes jako živé.",
      land2t: "Skóre",
      land2: "Dad Fit a Invest na kartě; odtud otevřeš původní inzerát.",
      land3t: "Zdroj",
      land3: "Airtable; ve všední dny se přegeneruje. Filtry: Dad, Investice, Novostavby, Vše.",
      landNote: "",
      foot: "Zdroj: Airtable. Veřejný snapshot na GitHub Pages — záznamy zůstávají v Airtable.",
      actions: {
        "CALL NOW": "Volat teď",
        "BOOK VIEWING": "Prohlídka",
        "INVESTIGATE": "Prověřit",
        "WATCH / WAIT": "Sledovat",
        "MAKE OFFER": "Nabídka",
      },
    },
    en: {
      pageTitle: "Praha Byty — browse | Praha Byty — prohlížení",
      kicker: "Praha Byty · browse",
      title: "Homes to decide on",
      subtitle: "Only listings verified live today in Airtable (ACTIVE VERIFIED). Sold/removed never shown.",
      filterAll: "All",
      filterNow: "What now",
      filterDad: "Dad",
      filterInvest: "Investment",
      filterNewbuild: "New builds",
      filterActive: "Active only",
      sortLabel: "Sort",
      sortDad: "Dad Fit",
      sortInv: "Investment",
      sortPrice: "Price",
      sortVerified: "Last verified",
      showing: "Showing",
      of: "of",
      photos: "with photo",
      placeholders: "placeholder",
      openListing: "Open listing",
      noUrl: "No URL",
      verified: "Verified",
      never: "not verified",
      empty: "Nothing matches these filters.",
      emptyNow: "No verified live listing to act on today.",
      invTitle: "To investigate · verified today",
      invSub: "ACTIVE VERIFIED and re-opened today — not What now yet.",
      stale: "Data not verified today — cards hidden. Re-run listing verification.",
      dad: "Dad",
      inv: "Invest",
      drop: "Price drop",
      reserved: "RESERVED",
      landEyebrow: "Private · family",
      landTitle: "Shortlist of live Prague flats",
      landLead: "For Dad (to live in) and for long-term rent. Only listings verified live today.",
      heroScript: "Prague",
      heroTagline: "A great place to call home",
      land1t: "What now",
      land1: "Call or viewing candidates, verified live today.",
      land2t: "Scores",
      land2: "Dad Fit and Invest on each card; open the original listing from the card.",
      land3t: "Source",
      land3: "Airtable; rebuilt on weekdays. Filters: Dad, Investment, New builds, All.",
      landNote: "",
      foot: "Source: Airtable. Public snapshot on GitHub Pages — records stay in Airtable.",
      actions: {
        "CALL NOW": "Call now",
        "BOOK VIEWING": "Book viewing",
        "INVESTIGATE": "Investigate",
        "WATCH / WAIT": "Watch / wait",
        "MAKE OFFER": "Make offer",
      },
    },
  };

  const state = {
    lang: localStorage.getItem("praha-byty-lang") || "en",
    filter: "all",
    sort: "price",
  };

  const $ = (sel) => document.querySelector(sel);
  const rawData = window.PRAHA_BYTY_DATA || { meta: {}, properties: [], investigate: [] };

  // HARD GUARD: never render dead / reserved / stale cards, even if they slip into data.js.
  function pragueToday() {
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Prague", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  }
  function pragueDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Prague", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
    } catch (e) {
      return String(iso).slice(0, 10);
    }
  }
  const TODAY = pragueToday();
  const isLiveToday = (p) => p && p.availability === "ACTIVE VERIFIED" && p.lastVerified && pragueDate(p.lastVerified) === TODAY;
  const data = {
    meta: rawData.meta || {},
    properties: (rawData.properties || []).filter((p) => isLiveToday(p) && (p.nextAction === "CALL NOW" || p.nextAction === "BOOK VIEWING")),
    investigate: (rawData.investigate || []).filter((p) => isLiveToday(p) && p.nextAction === "INVESTIGATE"),
  };
  const isStale = (rawData.meta && rawData.meta.verifiedDate && rawData.meta.verifiedDate !== TODAY);

  function t() {
    return I18N[state.lang] || I18N.cs;
  }

  function formatMoney(n) {
    if (n == null || Number.isNaN(Number(n))) return "—";
    return new Intl.NumberFormat(state.lang === "cs" ? "cs-CZ" : "en-GB").format(Math.round(Number(n))) + " Kč";
  }

  function formatPpm2(n) {
    if (n == null || Number.isNaN(Number(n))) return "";
    return new Intl.NumberFormat(state.lang === "cs" ? "cs-CZ" : "en-GB").format(Math.round(Number(n))) + " Kč/m²";
  }

  function actionClass(a) {
    if (a === "CALL NOW") return "call";
    if (a === "BOOK VIEWING") return "book";
    if (a === "INVESTIGATE") return "investigate";
    if (a === "WATCH / WAIT") return "watch";
    if (a === "MAKE OFFER") return "offer";
    return "";
  }

  function isNewBuild(p) {
    const tags = p.tags || [];
    return tags.some((t) => String(t).toUpperCase() === "NEW BUILD");
  }

  function matchesFilter(p) {
    // Dad: only show when Dad Fit is in play (>= 60)
    if (state.filter === "dad") {
      return p.dadFit != null && Number(p.dadFit) >= 60;
    }
    // Investment: has an invest score (shown even when Dad is hidden)
    if (state.filter === "invest") {
      return p.investment != null && Number(p.investment) > 0;
    }
    // New builds: NEW BUILD tag only
    if (state.filter === "newbuild") {
      return isNewBuild(p);
    }
    // All: everything live today in the pipeline views
    return true;
  }


  function allLive() {
    return data.properties.concat(data.investigate);
  }

  function countForFilter(filter) {
    const list = allLive();
    if (filter === "dad") return list.filter((p) => p.dadFit != null && Number(p.dadFit) >= 60).length;
    if (filter === "invest") return list.filter((p) => p.investment != null && Number(p.investment) > 0).length;
    if (filter === "newbuild") return list.filter(isNewBuild).length;
    return list.length;
  }

  function updateViewCounts() {
    const map = {
      dad: countForFilter("dad"),
      invest: countForFilter("invest"),
      newbuild: countForFilter("newbuild"),
      all: countForFilter("all"),
    };
    document.querySelectorAll("[data-count]").forEach((el) => {
      const key = el.dataset.count;
      if (key in map) el.textContent = String(map[key]);
    });
  }

  function sorted(list) {
    const copy = list.slice();
    const dir = -1;
    copy.sort((a, b) => {
      if (state.sort === "price") {
        return ((a.price || 0) - (b.price || 0));
      }
      if (state.sort === "verified") {
        return (Date.parse(b.lastVerified || 0) || 0) - (Date.parse(a.lastVerified || 0) || 0);
      }
      if (state.sort === "investment") {
        return ((b.investment || 0) - (a.investment || 0)) * (dir > 0 ? -1 : 1);
      }
      // dad default, with action priority boost for CALL NOW
      const ap = { "CALL NOW": 1000, "BOOK VIEWING": 800, "MAKE OFFER": 600, INVESTIGATE: 200, "WATCH / WAIT": 100 };
      const score = (p) => (ap[p.nextAction] || 0) + (p.dadFit || 0);
      if (state.sort === "dad") {
        // when sorting by dad, still keep strong action signal only if equal-ish? User asked sort by Dad Fit
        return score(b) - score(a);
      }
      return score(b) - score(a);
    });
    return copy;
  }

  function applyI18n() {
    const dict = t();
    document.documentElement.lang = state.lang;
    document.title = dict.pageTitle;
    const titleEl = $("[data-i18n=title]"); if (titleEl) titleEl.textContent = dict.title;
    const fall = $("[data-i18n=filter-all]"); if (fall) fall.textContent = dict.filterAll;
    const fdad = $("[data-i18n=filter-dad]"); if (fdad) fdad.textContent = dict.filterDad;
    const finv = $("[data-i18n=filter-invest]"); if (finv) finv.textContent = dict.filterInvest;
    const fnb = $("[data-i18n=filter-newbuild]"); if (fnb) fnb.textContent = dict.filterNewbuild;
    const sortLabel = $("[data-i18n=sort-label]");
    if (sortLabel) sortLabel.childNodes[0].textContent = dict.sortLabel + " ";
    const sel = $("#sort");
    // options: price, dad, investment, verified
    sel.options[0].textContent = dict.sortPrice;
    sel.options[1].textContent = dict.sortDad;
    sel.options[2].textContent = dict.sortInv;
    sel.options[3].textContent = dict.sortVerified;
    const le = $("[data-i18n=land-eyebrow]"); if (le) le.textContent = dict.landEyebrow;
    const lt = $("[data-i18n=land-title]"); if (lt) lt.textContent = dict.landTitle;
    const ll = $("[data-i18n=land-lead]"); if (ll) ll.textContent = dict.landLead;
    const hs = $("[data-i18n=hero-script]"); if (hs) hs.textContent = dict.heroScript;
    const ht = $("[data-i18n=hero-tagline]"); if (ht) ht.textContent = dict.heroTagline;
    $("[data-i18n=foot]").textContent = dict.foot;
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === state.lang);
    });
  }

  function cardHtml(p, dict) {
    const actionLabel = dict.actions[p.nextAction] || p.nextAction || "";
    const photo = p.hasPhoto && p.thumb
      ? `<img src="${p.thumb}" alt="" loading="lazy" decoding="async">`
      : `<div class="placeholder" aria-hidden="true"><span>${p.initials || "PB"}</span></div>`;
    const badges = [
      p.nextAction ? `<span class="badge ${actionClass(p.nextAction)}">${actionLabel}</span>` : "",
      p.priceDrop ? `<span class="badge drop">${dict.drop}</span>` : "",
    ].join("");
    const dad = p.dadFit;
    const inv = p.investment;
    const showDad = dad != null && Number(dad) >= 60;
    const fits = [];
    if (showDad) fits.push(fitDonut("dad", dict.dad, dad));
    if (inv != null) fits.push(fitDonut("inv", dict.inv, inv));
    const cta = p.url
      ? `<a class="open-link" href="${p.url}" target="_blank" rel="noopener noreferrer">${dict.openListing}</a>`
      : `<span class="open-link disabled">${dict.noUrl}</span>`;
    return `
        <article class="card">
          <div class="photo">
            ${photo}
            <div class="badge-row">${badges}</div>
          </div>
          <div class="body">
            <h2 class="title">${escapeHtml(p.title)}</h2>
            <div class="neighborhood">${escapeHtml(p.neighborhood || p.address || "")}</div>
            <div class="price-row">
              <div class="price">${formatMoney(p.price)}</div>
              <div class="ppm2">${formatPpm2(p.ppm2)}</div>
            </div>
            <div class="fits${fits.length === 1 ? " single" : ""}">${fits.join("")}</div>
            <div class="notes">${dict.verified}: ${p.lastVerifiedLabel || dict.never}</div>
            ${cta}
          </div>
        </article>`;
  }

  function fitDonut(kind, label, value) {
    const n = Math.max(0, Math.min(100, Math.round(Number(value))));
    const r = 34;
    const c = 2 * Math.PI * r;
    const dash = (n / 100) * c;
    return `
      <div class="donut ${kind}" role="img" aria-label="${label} ${n}">
        <div class="donut-ring">
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <circle class="donut-bg" cx="40" cy="40" r="${r}"></circle>
            <circle class="donut-fg" cx="40" cy="40" r="${r}"
              stroke-dasharray="${dash.toFixed(2)} ${c.toFixed(2)}"
              transform="rotate(-90 40 40)"></circle>
          </svg>
          <span class="donut-num">${n}</span>
        </div>
        <span class="donut-label">${label}</span>
      </div>`;
  }

  function render() {
    applyI18n();
    updateViewCounts();
    const dict = t();
    const grid = $("#grid");
    const invSection = $("#investigate-section");
    const invGrid = $("#investigate-grid");

    if (isStale) {
      $("#meta").textContent = "";
      grid.innerHTML = `<div class="empty">${dict.stale}</div>`;
      if (invSection) invSection.hidden = true;
      return;
    }

    const main = sorted(data.properties.filter(matchesFilter));
    const showInv = true;
    const inv = showInv ? sorted(data.investigate.filter(matchesFilter)) : [];
    const all = main.concat(inv);
    const withPhoto = all.filter((p) => p.hasPhoto).length;

    $("#meta").innerHTML =
      `<strong>${main.length + (showInv ? inv.length : 0)}</strong>` +
      (showInv && inv.length ? ` · ${dict.actions.INVESTIGATE}: <strong>${inv.length}</strong>` : "") +
      ` · <strong>${withPhoto}</strong> ${dict.photos}`;

    grid.innerHTML = main.length ? main.map((p) => cardHtml(p, dict)).join("") : `<div class="empty">${dict.empty}</div>`;

    if (invSection) {
      invSection.hidden = !showInv || !inv.length;
      $("[data-i18n=inv-title]").textContent = dict.invTitle;
      $("[data-i18n=inv-sub]").textContent = dict.invSub;
      invGrid.innerHTML = inv.map((p) => cardHtml(p, dict)).join("");
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bind() {
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.lang = btn.dataset.lang;
        localStorage.setItem("praha-byty-lang", state.lang);
        render();
      });
    });
    document.querySelectorAll(".view-btn[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filter = btn.dataset.filter;
        document.querySelectorAll(".view-btn[data-filter]").forEach((b) => b.classList.toggle("active", b === btn));
        render();
      });
    });
    $("#sort").addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });
  }

  bind();
  render();
})();
