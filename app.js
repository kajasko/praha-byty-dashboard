(function () {
  const I18N = {
    cs: {
      pageTitle: "Praha Byty — prohlížení | Praha Byty — browse",
      kicker: "Praha Byty · prohlížení",
      title: "Byty k rozhodnutí",
      subtitle: "Jen dnes ověřené živé inzeráty z Airtable (ACTIVE VERIFIED). Prodané/stažené se nezobrazují.",
      filterAll: "Vše",
      filterNow: "Co teď",
      filterDad: "Dad focus",
      filterInvest: "Investment focus",
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
      landEyebrow: "Soukromá rodinná nástěnka",
      landTitle: "Živý shortlist pro tátu i investici",
      landLead: "Pražské byty, které řešíme na bydlení a na dlouhodobý pronájem. Jen dnes ověřené živé inzeráty — prodané nebo stažené se tu neobjeví.",
      land1t: "Co teď",
      land1: "Ověřeno dnes jako živé — nejdřív volat nebo prohlídka. Mrtvé inzeráty zůstávají venku.",
      land2t: "Dvě optiky",
      land2: "Dad Fit a Invest skóre vedle sebe. Karta otevře původní inzerát.",
      land3t: "Vždy čerstvé",
      land3: "Ve všední dny se přegeneruje z Airtable. Filtry: Co teď, Dad, Investice.",
      landNote: "Ne realitka · nástěnka pro rozhodnutí",
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
      filterDad: "Dad focus",
      filterInvest: "Investment focus",
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
      landEyebrow: "Private family board",
      landTitle: "A live shortlist for Dad & investment",
      landLead: "Prague flats we’re evaluating to live in and to rent long-term. Only listings verified live today — sold or removed never appear.",
      land1t: "What now",
      land1: "Verified live today — call or viewing first. Dead ads stay out.",
      land2t: "Two lenses",
      land2: "Dad Fit and Invest scores side by side. Open any card for the original listing.",
      land3t: "Always fresh",
      land3: "Rebuilt on weekdays from Airtable. Filters: What now, Dad, Investment.",
      landNote: "Not an agency · decision board",
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
    sort: "dad",
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

  function matchesFilter(p) {
    const use = Array.isArray(p.useCase) ? p.useCase : [];
    const tags = Array.isArray(p.tags) ? p.tags : [];
    if (state.filter === "action-now") {
      return p.nextAction === "CALL NOW" || p.nextAction === "BOOK VIEWING";
    }
    if (state.filter === "dad") {
      return (
        (p.dadFit != null && p.dadFit >= 60) ||
        use.includes("Dad") ||
        tags.some((x) => String(x).includes("DAD") || String(x).includes("BOTH")) ||
        p.nextAction === "CALL NOW" ||
        p.nextAction === "BOOK VIEWING"
      );
    }
    if (state.filter === "invest") {
      return (
        (p.investment != null && p.investment >= 75) ||
        use.includes("Investment") ||
        tags.some((x) => String(x).includes("INVEST") || String(x).includes("BOTH")) ||
        p.nextAction === "CALL NOW" ||
        p.nextAction === "BOOK VIEWING"
      );
    }
    if (state.filter === "active") {
      return p.availability === "ACTIVE VERIFIED";
    }
    return true;
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
    $("[data-i18n=kicker]").textContent = dict.kicker;
    $("[data-i18n=title]").textContent = dict.title;
    $("[data-i18n=subtitle]").textContent = dict.subtitle;
    $("[data-i18n=filter-all]").textContent = dict.filterAll;
    $("[data-i18n=filter-now]").textContent = dict.filterNow;
    $("[data-i18n=filter-dad]").textContent = dict.filterDad;
    $("[data-i18n=filter-invest]").textContent = dict.filterInvest;
    const fa = $("[data-i18n=filter-active]"); if (fa) fa.textContent = dict.filterActive;
    $("[data-i18n=sort-label]").childNodes[0].textContent = dict.sortLabel + " ";
    const sel = $("#sort");
    sel.options[0].textContent = dict.sortDad;
    sel.options[1].textContent = dict.sortInv;
    sel.options[2].textContent = dict.sortPrice;
    sel.options[3].textContent = dict.sortVerified;
    const le = $("[data-i18n=land-eyebrow]"); if (le) le.textContent = dict.landEyebrow;
    const lt = $("[data-i18n=land-title]"); if (lt) lt.textContent = dict.landTitle;
    const ll = $("[data-i18n=land-lead]"); if (ll) ll.textContent = dict.landLead;
    const l1t = $("[data-i18n=land-1-t]"); if (l1t) l1t.textContent = dict.land1t;
    const l1 = $("[data-i18n=land-1]"); if (l1) l1.textContent = dict.land1;
    const l2t = $("[data-i18n=land-2-t]"); if (l2t) l2t.textContent = dict.land2t;
    const l2 = $("[data-i18n=land-2]"); if (l2) l2.textContent = dict.land2;
    const l3t = $("[data-i18n=land-3-t]"); if (l3t) l3t.textContent = dict.land3t;
    const l3 = $("[data-i18n=land-3]"); if (l3) l3.textContent = dict.land3;
    const ln = $("[data-i18n=land-note]"); if (ln) ln.textContent = dict.landNote;
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
    const link = p.url
      ? `<a class="open-link" href="${p.url}" target="_blank" rel="noopener noreferrer">${dict.openListing} ↗</a>`
      : `<span class="verified">${dict.noUrl}</span>`;
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
            <div class="chips">
              <span class="score dad">${dict.dad} ${p.dadFit != null ? p.dadFit : "—"}</span>
              <span class="score inv">${dict.inv} ${p.investment != null ? p.investment : "—"}</span>
            </div>
            <div class="footer">
              <div class="verified">${dict.verified}: ${p.lastVerifiedLabel || dict.never}</div>
              ${link}
            </div>
          </div>
        </article>`;
  }

  function render() {
    applyI18n();
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
    const showInv = state.filter !== "action-now";
    const inv = showInv ? sorted(data.investigate.filter(matchesFilter)) : [];
    const all = main.concat(inv);
    const withPhoto = all.filter((p) => p.hasPhoto).length;

    $("#meta").innerHTML =
      `${dict.filterNow}: <strong>${main.length}</strong>` +
      (showInv ? ` · ${dict.actions.INVESTIGATE}: <strong>${inv.length}</strong>` : "") +
      ` · <strong>${withPhoto}</strong> ${dict.photos}` +
      ` · <strong>${all.length - withPhoto}</strong> ${dict.placeholders}`;

    grid.innerHTML = main.length ? main.map((p) => cardHtml(p, dict)).join("") : `<div class="empty">${dict.emptyNow}</div>`;

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
    document.querySelectorAll(".chip[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filter = btn.dataset.filter;
        document.querySelectorAll(".chip[data-filter]").forEach((b) => b.classList.toggle("active", b === btn));
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
