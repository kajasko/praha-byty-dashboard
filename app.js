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
      landTitle: "Co je tahle stránka",
      landLead: "Živý shortlist pražských bytů, které řešíme pro tátu (na bydlení) a na investici (dlouhodobý pronájem). Fotky a ceny jsou z inzerátů; stav rozhodování je v Airtable.",
      land1: "<strong>Co teď</strong> — jen byty ověřené dnes jako živé, kde je potřeba volat nebo prohlídka. Mrtvé inzeráty se tu neobjeví.",
      land2: "<strong>Karty</strong> — Otevřít inzerát vede na původní nabídku. Skóre Dad / Invest pomáhají porovnat (když jsou vyplněná).",
      land3: "<strong>Filtry</strong> — Co teď / Dad / Investice. Jazyk: výchozí EN, k dispozici CS.",
      land4: "<strong>Aktualizace</strong> — všední dny se přegeneruje z Airtable. Když něco nesedí, zkus znovu po ranním refreshi.",
      landNote: "Nejde o realitku — soukromá nástěnka pro rodinu.",
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
      landTitle: "What this page is",
      landLead: "A live shortlist of Prague flats we’re evaluating for Dad (to live in) and for investment (long-term rent). Photos and prices come from the listing sites; the decision status lives in Airtable.",
      land1: "<strong>What now</strong> — only flats verified live today that need a call or viewing. Dead ads never appear here.",
      land2: "<strong>Cards</strong> — Open listing goes to the original ad. Dad / Invest scores help compare (when filled).",
      land3: "<strong>Filters</strong> — What now / Dad focus / Investment. Language: EN by default, CS available.",
      land4: "<strong>Updates</strong> — refreshed on weekdays from Airtable. If something looks off, check again after the morning rebuild.",
      landNote: "Not a real-estate agency site — a private decision board for the family.",
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
    const lt = $("[data-i18n=land-title]"); if (lt) lt.textContent = dict.landTitle;
    const ll = $("[data-i18n=land-lead]"); if (ll) ll.textContent = dict.landLead;
    const l1 = $("[data-i18n=land-1]"); if (l1) l1.innerHTML = dict.land1;
    const l2 = $("[data-i18n=land-2]"); if (l2) l2.innerHTML = dict.land2;
    const l3 = $("[data-i18n=land-3]"); if (l3) l3.innerHTML = dict.land3;
    const l4 = $("[data-i18n=land-4]"); if (l4) l4.innerHTML = dict.land4;
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
