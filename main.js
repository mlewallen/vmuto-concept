/* Liberty Fitness concept v2 — site + member app behaviour.
   Reads everything brand-level from window.BRAND (brand.js). All app data is simulated in the browser. */
(function () {
  "use strict";
  var B = window.BRAND;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === "text") n.textContent = v;
      else if (k === "class") n.className = v;
      else if (k === "on") Object.keys(v).forEach(function (ev) { n.addEventListener(ev, v[ev]); });
      else n.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  var SVGNS = "http://www.w3.org/2000/svg";
  function icon(name, cls) {
    var s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("class", "ic" + (cls ? " " + cls : ""));
    s.setAttribute("aria-hidden", "true");
    var u = document.createElementNS(SVGNS, "use");
    u.setAttribute("href", "#i-" + name);
    s.appendChild(u);
    return s;
  }

  /* ---------- storage (optional; everything works without it) ---------- */
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: demo still works this session */ }
  }

  /* ================================ BRAND ================================ */
  var overrides = load("lf2-brand", {});
  var darkMQ = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : { matches: false };

  function brand() {
    var key = overrides.theme || B.theme;
    if (key === "auto") key = darkMQ.matches ? "midnight" : "modern";
    if (!B.themes[key]) key = "modern";
    var t = B.themes[key];
    var colors = Object.assign({}, t.colors);
    if (overrides.accent) colors.accent = overrides.accent;
    return {
      name: overrides.name || B.name,
      shortName: overrides.shortName || B.shortName,
      tagline: overrides.tagline || B.tagline,
      themeKey: overrides.theme || B.theme,
      colors: colors,
      display: B.fonts.display[overrides.display] ? overrides.display : t.display,
      body: B.fonts.body[overrides.body] ? overrides.body : t.body,
      theme: t,
    };
  }

  function applyBrand() {
    var b = brand(), c = b.colors, root = document.documentElement.style;
    var vars = {
      "--bg": c.bg, "--surface": c.surface, "--ink": c.ink, "--muted": c.muted, "--line": c.line,
      "--accent": c.accent, "--accent-ink": c.accentInk, "--inv-bg": c.invBg || c.ink, "--inv-ink": c.invInk || c.bg,
      "--radius": b.theme.radius, "--btn-radius": b.theme.buttonRadius || b.theme.radius,
      "--display-weight": b.theme.displayWeight || 500, "--display-case": b.theme.displayCase || "none",
      "--display-track": b.theme.displayTracking || "0",
      "--font-display": B.fonts.display[b.display].stack, "--font-body": B.fonts.body[b.body].stack,
    };
    Object.keys(vars).forEach(function (k) { root.setProperty(k, vars[k]); });
    root.setProperty("color-scheme", b.theme.dark ? "dark" : "light");

    var fams = {};
    fams[b.display] = B.fonts.display[b.display].weights;
    fams[b.body] = fams[b.body] ? mergeWeights(fams[b.body], B.fonts.body[b.body].weights) : B.fonts.body[b.body].weights;
    $("#brand-fonts").href = "https://fonts.googleapis.com/css2?" + Object.keys(fams).map(function (f) {
      return "family=" + f.replace(/ /g, "+") + ":wght@" + fams[f];
    }).join("&") + "&display=swap";

    var text = {
      name: b.name, shortName: b.shortName, tagline: b.tagline, subline: B.subline,
      location: B.location, locationShort: B.location.split(",")[0], status: B.status, credit: B.credit,
      coachName: B.coach.name, coachFirst: B.coach.name.split(" ")[0],
      coachProof: B.coach.proof, coachLine: B.coach.line,
    };
    $$("[data-brand]").forEach(function (n) { n.textContent = text[n.getAttribute("data-brand")] || ""; });
    document.title = inApp() ? b.shortName + " — Member app" : b.name + " — " + B.location;
    $('meta[name="theme-color"]').setAttribute("content", c.bg);
    $('meta[name="apple-mobile-web-app-status-bar-style"]').setAttribute("content", b.theme.dark ? "black-translucent" : "default");
  }
  function mergeWeights(a, b) {
    var set = {};
    (a + ";" + b).split(";").forEach(function (w) { set[w] = 1; });
    return Object.keys(set).sort(function (x, y) { return x - y; }).join(";");
  }
  if (darkMQ.addEventListener) darkMQ.addEventListener("change", function () { if ((overrides.theme || B.theme) === "auto") applyBrand(); });

  /* ================================ SITE ================================ */
  function renderTicker() {
    var bar = $("#ticker"), items = B.ticker || [], track = $("#ticker-track");
    bar.hidden = !items.length;
    track.textContent = "";
    for (var r = 0; r < 4; r++) items.forEach(function (t) { track.appendChild(el("span", { text: t })); });
    var btn = $("#ticker-btn");
    btn.addEventListener("click", function () {
      var paused = bar.classList.toggle("paused");
      btn.setAttribute("aria-pressed", String(paused));
      btn.setAttribute("aria-label", paused ? "Play scrolling text" : "Pause scrolling text");
      btn.querySelector("use").setAttribute("href", paused ? "#i-play" : "#i-pause");
    });
  }

  function renderSite() {
    $("#equipment").replaceChildren.apply($("#equipment"), B.gym.equipment.map(function (e) { return el("li", { text: e }); }));
    $("#gym-features").replaceChildren.apply($("#gym-features"), B.gym.features.map(function (f) {
      return el("li", {}, [el("span", { class: "f-ic" }, [icon(f.icon)]), el("strong", { text: f.title }), el("span", { text: f.text })]);
    }));
    function steps(list) {
      return list.map(function (s, i) {
        return el("li", {}, [el("span", { class: "step-n", "aria-hidden": "true", text: String(i + 1).padStart(2, "0") }), el("strong", { text: s.title }), el("p", { text: s.text })]);
      });
    }
    $("#how-steps").replaceChildren.apply($("#how-steps"), steps(B.howItWorks));
    $("#coach-steps").replaceChildren.apply($("#coach-steps"), steps(B.coachingSteps));
    $("#coach-bio").replaceChildren.apply($("#coach-bio"), B.coach.bio.map(function (p) { return el("p", { text: p }); }));
    $("#coach-creds").replaceChildren.apply($("#coach-creds"), B.coach.credentials.map(function (c) { return el("li", {}, [icon("check"), c]); }));
    $("#perks").replaceChildren.apply($("#perks"), B.founding.perks.map(function (p) { return el("li", {}, [icon("check"), p]); }));

    // FAQ
    $("#faq-list").replaceChildren.apply($("#faq-list"), B.faq.map(function (f) {
      return el("details", {}, [el("summary", {}, [el("span", { text: f.q }), icon("plus")]), el("p", { text: f.a })]);
    }));

    // Visit + footer
    var c = B.contact;
    $("#v-address").textContent = c.address || "To be announced — " + B.location;
    $("#v-members").textContent = B.hours.members;
    $("#v-staffed").textContent = B.hours.staffed;
    var social = $("#v-social"); social.textContent = "";
    if (c.instagram) social.appendChild(el("a", { href: c.instagram, rel: "noopener", target: "_blank", text: "@" + c.instagram.replace(/\/$/, "").split("/").pop() }));
    var box = $("#foot-contact"); box.textContent = "";
    var parts = [c.address, c.phone, c.email].filter(Boolean);
    box.appendChild(document.createTextNode(parts.length ? parts.join(" · ") + " · " : "Contact details to be added · "));
    if (c.instagram) box.appendChild(el("a", { href: c.instagram, rel: "noopener", target: "_blank", text: "Instagram" }));
  }

  function interestOf(t) { return t.coaching === "video" ? "remote" : t.coaching ? "training" : "membership"; }

  function renderTiers() {
    var grid = $("#tier-grid"), dots = $("#tier-dots");
    grid.textContent = ""; dots.textContent = "";
    B.tiers.forEach(function (t, i) {
      grid.appendChild(el("article", { class: "tier" + (t.featured ? " featured" : ""), "aria-label": t.name }, [
        t.featured ? el("span", { class: "flag", text: "Most popular" }) : null,
        el("h3", { text: t.name }),
        el("span", { class: "price", text: t.price || "Pricing to be set" }),
        el("p", { text: t.blurb }),
        el("ul", {}, t.features.map(function (f) { return el("li", {}, [icon("check"), f]); })),
        el("a", { class: "btn btn-sm " + (t.featured ? "btn-light" : "btn-ghost"), href: "#join", "data-interest": interestOf(t), text: "Choose " + t.name }),
      ]));
      dots.appendChild(el("span", { class: i === 0 ? "on" : "" }));
    });
    grid.addEventListener("scroll", function () {
      var cards = grid.children, best = 0, bestD = Infinity, gl = grid.getBoundingClientRect().left;
      for (var i = 0; i < cards.length; i++) { var d = Math.abs(cards[i].getBoundingClientRect().left - gl); if (d < bestD) { bestD = d; best = i; } }
      if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4) best = cards.length - 1;
      $$("span", dots).forEach(function (s, i) { s.className = i === best ? "on" : ""; });
    }, { passive: true });

    // Comparison table
    var table = $("#compare-table"); table.textContent = "";
    table.appendChild(el("caption", { class: "sr-only", text: "What each plan includes" }));
    table.appendChild(el("thead", {}, [el("tr", {}, [el("th", { scope: "col", text: "Plan" })].concat(B.tiers.map(function (t) {
      return el("th", { scope: "col", class: t.featured ? "col-featured" : "", text: t.name });
    })))]));
    table.appendChild(el("tbody", {}, B.compare.map(function (row) {
      return el("tr", {}, [el("th", { scope: "row", text: row.label })].concat(B.tiers.map(function (t) {
        var v = row.values[t.id], cls = t.featured ? "col-featured" : "";
        if (v === true) return el("td", { class: cls }, [icon("check"), el("span", { class: "sr-only", text: "Included" })]);
        if (!v) return el("td", { class: cls }, [el("span", { class: "no", "aria-label": "Not included", text: "—" })]);
        return el("td", { class: cls, text: v });
      })));
    })));
  }

  // Menu
  var menu = $("#menu"), menuBtn = $("#menu-btn");
  function setMenu(open) {
    if (open) {
      var nav = $("#nav").getBoundingClientRect();
      menu.style.setProperty("--menu-top", Math.max(0, nav.bottom) + "px");
    }
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
    document.body.classList.toggle("lock", open);
    if (open) menu.querySelector("a").focus();
  }
  menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });

  // Nav border on scroll + sticky CTA visibility
  var nav = $("#nav"), sticky = $("#sticky-cta");
  window.addEventListener("scroll", function () { nav.classList.toggle("scrolled", window.scrollY > 40); }, { passive: true });
  if ("IntersectionObserver" in window) {
    var seen = { home: true, join: false };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting; });
      var show = !seen.home && !seen.join;
      sticky.classList.toggle("show", show);
      sticky.setAttribute("aria-hidden", String(!show));
      sticky.querySelector("a").tabIndex = show ? 0 : -1;
    }, { threshold: 0 });
    io.observe($("#home")); io.observe($("#join"));
  }

  // Pre-select interest from any CTA
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-interest]");
    if (!a) return;
    var want = a.getAttribute("data-interest");
    $$('#join-form input[name="interest"]').forEach(function (i) { if (i.value === want) i.checked = true; });
  });

  // Join form with inline validation
  var form = $("#join-form");
  function setErr(input, errEl, msg) {
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    errEl.textContent = msg || "";
  }
  function validate(focus) {
    var name = form.name.value.trim(), email = form.email.value.trim();
    var interests = $$('input[name="interest"]:checked', form);
    var errs = [];
    setErr(form.name, $("#e-name"), name ? "" : "Add your name.");
    if (!name) errs.push(form.name);
    var emailMsg = !email ? "Add your email." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "That email doesn't look right. Check for typos." : "";
    setErr(form.email, $("#e-email"), emailMsg);
    if (emailMsg) errs.push(form.email);
    setErr(null, $("#e-interest"), interests.length ? "" : "Pick at least one so we know what to send you.");
    if (!interests.length) errs.push($('input[name="interest"]', form));
    if (focus && errs[0]) errs[0].focus();
    return !errs.length;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.dataset.tried = "1";
    if (!validate(true)) return;
    var first = form.name.value.trim().split(" ")[0];
    $("#done-h").textContent = "You're on the list, " + first + ".";
    $("#done-msg").textContent = "Concept only, so nothing was sent. On the live site this goes straight to " + B.coach.name.split(" ")[0] + ", and founding members hear the opening date first.";
    form.hidden = true; $("#join-done").hidden = false; $("#join-done").focus();
  });
  form.addEventListener("input", function () { if (form.dataset.tried) validate(false); });
  form.addEventListener("change", function () { if (form.dataset.tried) validate(false); });
  $("#join-again").addEventListener("click", function () {
    form.reset(); delete form.dataset.tried; validate(false);
    $$("[aria-invalid]", form).forEach(function (i) { i.removeAttribute("aria-invalid"); });
    $$(".field-err", form).forEach(function (p) { p.textContent = ""; });
    $("#join-done").hidden = true; form.hidden = false; form.name.focus();
  });

  /* ================================ ROUTING ================================
     #app or #app/<tab> shows the member app (#member-app still works).
     Any other hash is an in-page anchor on the site. */
  var TABS = ["key", "book", "program", "plan", "me"];
  function parseHash() {
    var h = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (h === "member-app") h = "app";
    if (h === "app" || h.indexOf("app/") === 0) return { app: true, tab: TABS.indexOf(h.split("/")[1]) > -1 ? h.split("/")[1] : "key" };
    return { app: false, id: h };
  }
  function inApp() { return parseHash().app; }
  var wasApp = null;
  function route(initial) {
    var r = parseHash();
    $("#app").hidden = !r.app;
    $("#site").hidden = r.app;
    document.body.classList.toggle("in-app", r.app);
    setMenu(false); setDemo(false);
    if (r.app) {
      showTab(r.tab, wasApp !== true);
      if (wasApp !== true) window.scrollTo(0, 0);
    } else {
      var t = r.id && document.getElementById(r.id);
      if (wasApp === true || initial) {
        // Wait for fonts so the anchor position is final.
        var go = function () { if (t && r.id !== "home") t.scrollIntoView(); else window.scrollTo(0, 0); };
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(go); }); else go();
      }
    }
    wasApp = r.app;
    document.title = r.app ? brand().shortName + " — Member app" : brand().name + " — " + B.location;
  }
  window.addEventListener("hashchange", function () { route(false); });

  /* ================================ MEMBER APP ================================ */
  var DEMO_DEFAULT = function () { return { tier: "coached", bookings: [], entries: [], done: {}, logged: [], prefs: { remind: true, program: true, news: false } }; };
  var demo = Object.assign(DEMO_DEFAULT(), load("lf2-demo", {}));
  var clock = null; // minutes since midnight, or null for real time
  var selectedDay = 0, progDay = null, currentTab = "key";

  function persist() { save("lf2-demo", demo); }
  function tier(id) { var x = id || demo.tier; return B.tiers.filter(function (t) { return t.id === x; })[0] || B.tiers[0]; }
  function nowMin() { if (clock !== null) return clock; var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  function dateAt(offset) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + offset); return d; }
  function dayKey(offset) { var d = dateAt(offset); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function toMin(hhmm) { var p = hhmm.split(":"); return +p[0] * 60 + +p[1]; }
  function fmt(min) { var h = Math.floor(min / 60) % 24, m = min % 60; return (h % 12 || 12) + ":" + ("0" + m).slice(-2) + " " + (h < 12 ? "am" : "pm"); }
  function dayLabel(key, long) {
    var p = key.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]);
    if (key === dayKey(0)) return "Today";
    if (key === dayKey(1)) return "Tomorrow";
    return d.toLocaleDateString(undefined, long ? { weekday: "long", month: "short", day: "numeric" } : { weekday: "short", month: "short", day: "numeric" });
  }
  function isTaken(dayOffset, slotIndex) { return ((dayOffset * 7 + slotIndex * 5 + 3) % 4) === 0; }
  function myBookings() {
    var today = dayKey(0), now = nowMin();
    return demo.bookings.filter(function (b) { return b.day > today || (b.day === today && toMin(b.slot) + B.sessionWindow.after >= now); })
      .sort(function (a, b) { return (a.day + a.slot).localeCompare(b.day + b.slot); });
  }
  function accessLabel(t) { return { always: "24 / 7", session: "Around booked sessions", none: "None (remote)" }[t.access]; }
  function coachingLabel(t) { return t.coaching === "video" ? "By video" : t.coaching ? "In person" : "Not included"; }

  // The one access rule: plan + booked session + time of day -> may the door open?
  function checkAccess() {
    var t = tier(), now = nowMin();
    if (t.access === "always") return { ok: true, why: "Your plan includes entry at any hour." };
    if (t.access === "none") return { ok: false, why: "The " + t.name + " plan has no door access. Your sessions are by video." };
    var w = B.sessionWindow;
    var open = demo.bookings.filter(function (b) { var s = toMin(b.slot); return b.day === dayKey(0) && now >= s - w.before && now <= s + w.after; })[0];
    if (open) return { ok: true, why: "Open for your " + fmt(toMin(open.slot)) + " session." };
    var next = myBookings()[0];
    return { ok: false, why: next
      ? "Your plan opens the door from " + w.before + " minutes before a session. Next: " + dayLabel(next.day) + ", " + fmt(toMin(next.slot)) + "."
      : "Your plan opens the door around a booked session. You have none booked." };
  }

  // Simulated occupancy: busy at 6–8am and 5–7pm, near-empty overnight.
  function occupancy() {
    var h = nowMin() / 60;
    var f = 0.04 + 0.55 * Math.exp(-Math.pow((h - 7) / 1.2, 2)) + 0.65 * Math.exp(-Math.pow((h - 17.75) / 1.4, 2)) + 0.2 * Math.exp(-Math.pow((h - 12) / 1.2, 2));
    if (h < 4.5 || h > 22.5) f = 0.03;
    var n = Math.max(h < 4.5 || h > 22.5 ? 0 : 1, Math.round(B.capacity * f));
    return { n: n, pct: Math.min(100, Math.round((n / B.capacity) * 100)) };
  }

  /* ---------- toast + confirm sheet ---------- */
  var toastTimer;
  function toast(msg, undo) {
    var t = $("#toast"), u = $("#toast-undo");
    $("#toast-msg").textContent = msg;
    u.hidden = !undo;
    u.onclick = function () { t.hidden = true; if (undo) undo(); };
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, undo ? 6000 : 3500);
  }
  var dlg = $("#confirm");
  function confirmSheet(opts) {
    $("#confirm-h").textContent = opts.title;
    var body = $("#confirm-body"); body.textContent = "";
    (opts.body || []).forEach(function (n) { body.appendChild(typeof n === "string" ? el("p", { text: n }) : n); });
    $("#confirm-yes").textContent = opts.yes || "Confirm";
    $("#confirm-yes").className = "btn " + (opts.danger ? "btn-ghost" : "btn-solid");
    $("#confirm-yes").style.cssText = opts.danger ? "border-color: var(--no); color: var(--no)" : "";
    $("#confirm-no").textContent = opts.no || "Cancel";
    return new Promise(function (resolve) {
      if (typeof dlg.showModal !== "function") { resolve(window.confirm(opts.title)); return; }
      dlg.returnValue = "";
      dlg.addEventListener("close", function h() { dlg.removeEventListener("close", h); resolve(dlg.returnValue === "ok"); });
      dlg.showModal();
      $("#confirm-yes").focus();
    });
  }
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close("cancel"); }); // tap backdrop to dismiss
  function diffList(rows) {
    return el("dl", { class: "diff" }, rows.map(function (r) {
      return el("div", {}, [el("dt", { text: r[0] }), el("dd", {}, r[1] === r[2] ? [r[2]] : [el("s", { text: r[1] }), r[2]])]);
    }));
  }

  /* ---------- tabs ---------- */
  function showTab(name, instant) {
    currentTab = name;
    $$(".tab").forEach(function (s) { s.hidden = s.getAttribute("data-tab") !== name; });
    $$(".tabbar button").forEach(function (x) { x.getAttribute("data-go") === name ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current"); });
    $("#app-main").scrollTop = 0;
    if (!instant) window.scrollTo(0, 0);
    renderApp();
  }
  $$(".tabbar button").forEach(function (b) {
    b.addEventListener("click", function () {
      var go = b.getAttribute("data-go");
      if (location.hash !== "#app/" + go) location.hash = "app/" + go; else showTab(go);
    });
  });

  /* ---------- render ---------- */
  function renderApp() {
    $("#app-time").textContent = fmt(nowMin()) + (clock !== null ? " · demo" : "");
    $("#demo-clock").value = nowMin() - (nowMin() % 15);
    $("#demo-clock-out").textContent = fmt(nowMin()) + (clock === null ? " (now)" : "");
    ({ key: renderKey, book: renderBook, program: renderProgram, plan: renderPlan, me: renderMe })[currentTab]();
  }

  function renderKey() {
    var t = tier(), a = checkAccess();
    if (!$("#unlock").classList.contains("ok") && !$("#unlock").classList.contains("no") && raf === null) {
      $("#key-tier").textContent = t.name + " plan";
      $("#key-headline").textContent =
        t.access === "always" ? "Open to you, all hours." :
        t.access === "none" ? "Coaching, wherever you are." :
        a.ok ? "Your session window is open." : "The door opens for your session.";
      $("#key-sub").textContent = a.why;
      $(".unlock-text").textContent = "Hold to unlock";
      $("#unlock").className = "unlock";
      $("#unlock").style.setProperty("--p", 0);
    }

    // Next session card
    var next = myBookings()[0], card = $("#next-card");
    card.textContent = "";
    card.appendChild(el("div", { class: "card-head" }, [el("h2", { class: "card-h", text: "Next session" }), t.coaching ? el("span", { class: "badge", text: t.coaching === "video" ? "Video" : "In person" }) : null]));
    if (!t.coaching) {
      card.appendChild(el("p", { class: "card-sub", text: "Coaching isn't part of the " + t.name + " plan." }));
      card.appendChild(el("a", { class: "btn btn-ghost btn-sm", href: "#app/plan", text: "Compare plans" }));
    } else if (next) {
      card.appendChild(el("p", { class: "card-big", text: dayLabel(next.day, true) + " · " + fmt(toMin(next.slot)) }));
      card.appendChild(el("p", { class: "card-sub", text: "With " + B.coach.name + (t.coaching === "video" ? " by video." : " in " + B.location.split(",")[0] + ".") }));
    } else {
      card.appendChild(el("p", { class: "card-sub", text: "Nothing booked. " + B.coach.name.split(" ")[0] + " has open times this week." }));
      card.appendChild(el("a", { class: "btn btn-solid btn-sm", href: "#app/book", text: "Book a session" }));
    }

    // Occupancy
    var o = occupancy(), label = o.pct < 30 ? "Quiet" : o.pct < 60 ? "Steady" : "Busy";
    $("#busy-label").textContent = label;
    $("#busy-label").className = "badge " + (o.pct < 30 ? "quiet" : o.pct >= 60 ? "busy" : "");
    $("#busy-fill").style.width = Math.max(3, o.pct) + "%";
    var m = $("#busy-meter"); m.setAttribute("aria-valuemax", B.capacity); m.setAttribute("aria-valuenow", o.n); m.setAttribute("aria-valuetext", label + ", about " + o.n + " people");
    $("#busy-sub").textContent = o.n === 0 ? "Nobody on the floor right now." : "About " + o.n + (o.n === 1 ? " person" : " people") + " training at " + fmt(nowMin()) + ".";

    // Entry log
    var log = $("#entry-log"); log.textContent = "";
    var recent = demo.entries.slice(-4).reverse();
    if (!recent.length) log.appendChild(el("li", { class: "empty", text: "No entries yet. Hold the key to try the door." }));
    recent.forEach(function (e) {
      log.appendChild(el("li", {}, [
        el("span", { class: "t", text: e.day === dayKey(0) ? "Today, " + fmt(e.min) : dayLabel(e.day) + ", " + fmt(e.min) }),
        el("span", { class: e.ok ? "r-ok" : "r-no", text: e.ok ? "Entered" : "Declined" }),
      ]));
    });
  }

  function renderBook() {
    var t = tier(), canBook = !!t.coaching;
    $("#book-sub").textContent = !canBook
      ? "Sessions aren't part of the " + t.name + " plan."
      : t.coaching === "video" ? "Video sessions with " + B.coach.name + ". 60 minutes." : "In person with " + B.coach.name + " in " + B.location.split(",")[0] + ". 60 minutes.";

    var days = $("#days"); days.textContent = "";
    for (var i = 0; i < 7; i++) (function (i) {
      var d = dateAt(i), key = dayKey(i);
      var has = demo.bookings.some(function (b) { return b.day === key; });
      var btn = el("button", { type: "button", class: has ? "has" : "", "aria-pressed": String(i === selectedDay),
        "aria-label": d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) + (has ? ", you have a session" : "") }, [
        d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 3), el("b", { text: String(d.getDate()) }),
      ]);
      btn.addEventListener("click", function () { selectedDay = i; renderBook(); days.children[i].focus(); });
      days.appendChild(btn);
    })(i);

    var key = dayKey(selectedDay);
    $("#slots-h").textContent = "Times · " + dayLabel(key);
    var slots = $("#slots"); slots.textContent = "";
    B.sessionSlots.forEach(function (s, si) {
      var mine = demo.bookings.some(function (b) { return b.day === key && b.slot === s; });
      var past = selectedDay === 0 && toMin(s) <= nowMin();
      var taken = !mine && isTaken(selectedDay, si);
      var label = fmt(toMin(s));
      var btn = el("button", { type: "button", class: mine ? "mine" : "", text: label, "aria-pressed": String(mine) });
      if (!canBook || (past && !mine) || taken) {
        btn.disabled = true;
        btn.setAttribute("aria-label", label + ", " + (taken ? "taken" : past ? "past" : "unavailable"));
      }
      btn.addEventListener("click", function () { mine ? cancelBooking({ day: key, slot: s }) : book(key, s); });
      slots.appendChild(btn);
    });

    var list = $("#bookings"); list.textContent = "";
    var notice = $(".tab[data-tab=book] .notice"); if (notice) notice.remove();
    if (!canBook) {
      $("#bookings").after(el("div", { class: "notice" }, [
        el("p", { text: "Add coaching to book sessions with " + B.coach.name.split(" ")[0] + "." }),
        el("a", { class: "btn btn-solid btn-sm", href: "#app/plan", text: "See plans" }),
      ]));
    }
    var mineAll = myBookings();
    if (!mineAll.length) list.appendChild(el("li", { class: "empty", text: "Nothing booked yet." }));
    mineAll.forEach(function (b) {
      list.appendChild(el("li", {}, [
        el("span", { class: "b-when" }, [el("span", { text: dayLabel(b.day) + " · " + fmt(toMin(b.slot)) }), el("small", { text: t.coaching === "video" ? "Video session" : "In person" })]),
        el("button", { type: "button", text: "Cancel", "aria-label": "Cancel " + dayLabel(b.day) + " " + fmt(toMin(b.slot)), on: { click: function () { cancelBooking(b); } } }),
      ]));
    });
  }

  function book(day, slot) {
    var t = tier();
    var body = [diffList([["Day", dayLabel(day, true), dayLabel(day, true)], ["Time", fmt(toMin(slot)), fmt(toMin(slot))], ["Where", "", t.coaching === "video" ? "Video call" : B.location.split(",")[0]]])];
    if (t.access === "session") body.push("The door will open for you from " + B.sessionWindow.before + " minutes before.");
    body.push("Free to cancel up to 12 hours before.");
    confirmSheet({ title: "Book this session?", body: body, yes: "Book session" }).then(function (ok) {
      if (!ok) return;
      var item = { day: day, slot: slot };
      demo.bookings.push(item); persist(); renderApp();
      if (navigator.vibrate) navigator.vibrate(12);
      toast("Booked " + dayLabel(day) + ", " + fmt(toMin(slot)) + ".", function () {
        demo.bookings = demo.bookings.filter(function (b) { return !(b.day === day && b.slot === slot); }); persist(); renderApp();
      });
    });
  }
  function cancelBooking(b) {
    confirmSheet({ title: "Cancel this session?", body: [dayLabel(b.day, true) + " at " + fmt(toMin(b.slot)) + " with " + B.coach.name + "."], yes: "Cancel session", no: "Keep it", danger: true }).then(function (ok) {
      if (!ok) return;
      demo.bookings = demo.bookings.filter(function (x) { return !(x.day === b.day && x.slot === b.slot); }); persist(); renderApp();
      toast("Session cancelled.", function () { demo.bookings.push({ day: b.day, slot: b.slot }); persist(); renderApp(); });
    });
  }

  function weekdayIndex(offset) { return (dateAt(offset || 0).getDay() + 6) % 7; } // Mon = 0
  function renderProgram() {
    var t = tier(), P = B.program, body = $("#prog-body");
    body.textContent = "";
    $("#prog-eyebrow").textContent = t.coaching ? P.name : "Program";
    if (!t.coaching) {
      body.appendChild(el("div", { class: "notice" }, [
        el("p", { text: "Written programs come with coaching. The " + t.name + " plan gives you the floor; add coaching and " + B.coach.name.split(" ")[0] + " writes your training here." }),
        el("a", { class: "btn btn-solid btn-sm", href: "#app/plan", text: "See plans" }),
      ]));
      return;
    }
    var today = weekdayIndex(0);
    if (progDay === null) progDay = today;
    var weekKey = dayKey(-today); // Monday of this week
    var doneFor = function (i) { return demo.done[weekKey + ":" + i] || []; };
    var dayComplete = function (i) { var d = P.days[i]; return d.items.length > 0 && doneFor(i).length >= d.items.length; };
    var completeCount = P.days.filter(function (d, i) { return dayComplete(i); }).length;
    var trainDays = P.days.filter(function (d) { return d.items.length; }).length;

    body.appendChild(el("div", { class: "prog-meta" }, [
      el("p", { class: "key-sub", text: "Week " + P.week + " of " + P.weeks + " · " + completeCount + " of " + trainDays + " sessions done this week" }),
      el("div", { class: "meter", role: "progressbar", "aria-label": "Block progress", "aria-valuemin": "0", "aria-valuemax": String(P.weeks), "aria-valuenow": String(P.week) }, [el("span", { style: "width:" + Math.round((P.week - 1 + completeCount / trainDays) / P.weeks * 100) + "%" })]),
    ]));

    var week = el("div", { class: "week", role: "group", "aria-label": "Day of the week" });
    P.days.forEach(function (d, i) {
      var done = dayComplete(i);
      week.appendChild(el("button", { type: "button", class: i === today ? "today" : "", "aria-pressed": String(i === progDay),
        "aria-label": d.day + ", " + d.title + (done ? ", done" : "") + (i === today ? ", today" : ""),
        on: { click: function () { progDay = i; renderProgram(); week.children[i] && $(".week").children[i].focus(); } } }, [
        el("span", { text: d.day }), done ? icon("check") : el("i"),
      ]));
    });
    body.appendChild(week);

    var D = P.days[progDay], done = doneFor(progDay);
    body.appendChild(el("div", { class: "day-h" }, [
      el("h2", { text: D.title }),
      el("span", { text: D.items.length ? done.length + " / " + D.items.length : "" }),
    ]));
    if (!D.items.length) {
      body.appendChild(el("p", { class: "key-sub", text: "Rest day. Walk, sleep, eat well. Back at it tomorrow." }));
    } else {
      var ul = el("ul", { class: "exercises" });
      D.items.forEach(function (x, xi) {
        var cb = el("input", { type: "checkbox" });
        cb.checked = done.indexOf(xi) > -1;
        cb.addEventListener("change", function () {
          var k = weekKey + ":" + progDay, cur = (demo.done[k] || []).filter(function (n) { return n !== xi; });
          if (cb.checked) cur.push(xi);
          demo.done[k] = cur;
          if (cur.length === D.items.length && demo.logged.indexOf(k) === -1) {
            demo.logged.push(k);
            if (navigator.vibrate) navigator.vibrate([10, 40, 10]);
            toast(D.title + " logged. Nice work.");
          }
          persist(); renderProgram();
          var again = $$(".exercises input")[xi]; if (again) again.focus();
        });
        ul.appendChild(el("li", {}, [el("label", { class: "ex" }, [
          cb, el("span", { class: "box" }, [icon("check")]),
          el("span", {}, [el("b", { text: x.name }), x.note ? el("small", { text: x.note }) : null]),
          el("span", { class: "sets", text: x.sets }),
        ])]));
      });
      body.appendChild(ul);
    }
    body.appendChild(el("div", { class: "coach-note" }, [
      el("span", { class: "avatar", "aria-hidden": "true", text: B.coach.name.split(" ").map(function (s) { return s[0]; }).join("") }),
      el("div", {}, [el("b", { text: "Note from " + B.coach.name.split(" ")[0] }), el("p", { text: "Keep the squats crisp this week. If the last set feels like a grind, take 5% off. We'll check in at your next session." })]),
    ]));
  }

  function renderPlan() {
    var list = $("#plan-list"); list.textContent = "";
    B.tiers.forEach(function (p) {
      var on = p.id === demo.tier;
      list.appendChild(el("button", { type: "button", class: "plan", role: "radio", "aria-checked": String(on), on: { click: function () { changePlan(p); } } }, [
        el("b", { text: p.name }), el("span", { text: p.blurb }),
        el("span", { class: "access-tag", text: "Door: " + accessLabel(p) }),
        el("span", { class: "radio", "aria-hidden": "true" }),
      ]));
    });
  }
  function changePlan(p) {
    var from = tier();
    if (p.id === from.id) return;
    var rows = [["Door access", accessLabel(from), accessLabel(p)], ["Coaching", coachingLabel(from), coachingLabel(p)], ["Price", from.price || "To be set", p.price || "To be set"]];
    var body = [diffList(rows)];
    if (!p.coaching && myBookings().length) body.push("Your " + myBookings().length + " booked session" + (myBookings().length > 1 ? "s" : "") + " will stay on the calendar in this demo. In the real app you'd choose what happens to them.");
    body.push("Changes take effect at your next billing date.");
    confirmSheet({ title: "Switch to " + p.name + "?", body: body, yes: "Switch plan", no: "Keep " + from.name }).then(function (ok) {
      if (!ok) return;
      demo.tier = p.id; persist(); renderApp();
      toast("You're on " + p.name + ".", function () { demo.tier = from.id; persist(); renderApp(); });
    });
  }

  function renderMe() {
    var t = tier();
    $("#me-plan").textContent = t.name;
    $("#me-access").textContent = accessLabel(t);
    var month = dayKey(0).slice(0, 7);
    var stats = [
      [demo.bookings.filter(function (b) { return b.day.slice(0, 7) === month; }).length, "Sessions"],
      [demo.entries.filter(function (e) { return e.ok; }).length, "Visits"],
      [demo.logged.length, "Workouts"],
    ];
    $("#me-stats").replaceChildren.apply($("#me-stats"), stats.map(function (s) { return el("div", { class: "stat" }, [el("b", { text: String(s[0]) }), el("span", { text: s[1] })]); }));
    $$("[data-pref]").forEach(function (i) { i.checked = !!demo.prefs[i.getAttribute("data-pref")]; });
  }
  $$("[data-pref]").forEach(function (i) {
    i.addEventListener("change", function () { demo.prefs[i.getAttribute("data-pref")] = i.checked; persist(); toast(i.checked ? "Notifications on." : "Notifications off."); });
  });

  /* ---------- hold to unlock (press and hold; keyboard: hold Enter or Space) ---------- */
  var unlock = $("#unlock"), raf = null, resetTimer = null, HOLD = 900;
  function finish() {
    raf = null;
    var a = checkAccess();
    unlock.classList.remove("holding");
    unlock.className = "unlock " + (a.ok ? "ok" : "no");
    unlock.style.setProperty("--p", 100);
    unlock.querySelector("use").setAttribute("href", a.ok ? "#i-check" : "#i-x");
    $(".unlock-text").textContent = a.ok ? "Unlocked" : "Not now";
    $("#key-result").textContent = a.ok ? "Door unlocked (simulated). Welcome in." : a.why;
    demo.entries.push({ day: dayKey(0), min: nowMin(), ok: a.ok }); demo.entries = demo.entries.slice(-30); persist();
    if (navigator.vibrate) navigator.vibrate(a.ok ? [15, 60, 15] : [80]);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(resetUnlock, 4500);
    renderKeyCardsOnly();
  }
  function renderKeyCardsOnly() { var keep = currentTab; if (keep === "key") { var cls = unlock.className; renderKey(); unlock.className = cls; } }
  function resetUnlock() {
    unlock.className = "unlock"; unlock.style.setProperty("--p", 0);
    unlock.querySelector("use").setAttribute("href", "#i-key");
    $("#key-result").textContent = "";
    if (currentTab === "key") renderKey();
  }
  function startHold() {
    cancelAnimationFrame(raf); clearTimeout(resetTimer);
    unlock.className = "unlock holding"; unlock.querySelector("use").setAttribute("href", "#i-key");
    $("#key-result").textContent = ""; $(".unlock-text").textContent = "Keep holding";
    var t0 = performance.now();
    (function step(t) {
      var p = Math.min(100, ((t - t0) / HOLD) * 100);
      unlock.style.setProperty("--p", p);
      if (p >= 100) finish(); else raf = requestAnimationFrame(step);
    })(t0);
  }
  function endHold() {
    if (raf === null) return;
    cancelAnimationFrame(raf); raf = null;
    unlock.classList.remove("holding");
    unlock.style.setProperty("--p", 0); $(".unlock-text").textContent = "Hold to unlock";
  }
  unlock.addEventListener("pointerdown", function (e) { if (e.button > 0) return; e.preventDefault(); try { unlock.setPointerCapture(e.pointerId); } catch (x) {} startHold(); });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) { unlock.addEventListener(ev, endHold); });
  unlock.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  unlock.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && !e.repeat) { e.preventDefault(); startHold(); } });
  unlock.addEventListener("keyup", function (e) { if (e.key === "Enter" || e.key === " ") endHold(); });
  unlock.addEventListener("blur", endHold);

  /* ---------- demo controls (side panel on desktop, sheet on phones) ---------- */
  var demoPanel = $("#demo-panel"), demoOpen = $("#demo-open");
  function setDemo(open) {
    if (open) $("#toast").hidden = true;
    demoPanel.classList.toggle("open", open);
    $("#demo-scrim").hidden = !open;
    demoOpen.setAttribute("aria-expanded", String(open));
    if (open) $("#demo-clock").focus();
  }
  demoOpen.addEventListener("click", function () { setDemo(!demoPanel.classList.contains("open")); });
  $$("[data-demo-close]").forEach(function (b) { b.addEventListener("click", function () { setDemo(false); demoOpen.focus(); }); });
  $("#demo-clock").addEventListener("input", function (e) { clock = +e.target.value; renderApp(); });
  $$("[data-clock]").forEach(function (b) {
    b.addEventListener("click", function () { var v = b.getAttribute("data-clock"); clock = v === "now" ? null : +v; resetUnlock(); renderApp(); });
  });
  $("#reset-demo").addEventListener("click", function () {
    demo = DEMO_DEFAULT(); clock = null; selectedDay = 0; progDay = null; persist(); resetUnlock(); renderApp(); toast("Demo reset.");
  });

  /* ================================ BRAND PANEL ================================ */
  var panel = $("#brand-panel"), lastToggle = null;
  if (!B.showBrandPanel) $$("[data-brand-toggle], .brand-open").forEach(function (n) { n.hidden = true; });
  function fillSelect(sel, options, labelOf) {
    sel.textContent = "";
    Object.keys(options).forEach(function (k) { sel.appendChild(el("option", { value: k, text: labelOf ? labelOf(k) : k })); });
  }
  var themeOpts = Object.assign({}, B.themes, { auto: { label: "Auto — Modern or Midnight, follows the device" } });
  fillSelect($("#bp-theme"), themeOpts, function (k) { return themeOpts[k].label; });
  fillSelect($("#bp-display"), B.fonts.display);
  fillSelect($("#bp-body"), B.fonts.body);
  function syncPanel() {
    var b = brand();
    $("#bp-name").value = b.name; $("#bp-short").value = b.shortName; $("#bp-tagline").value = b.tagline;
    $("#bp-theme").value = b.themeKey; $("#bp-accent").value = b.colors.accent;
    $("#bp-display").value = b.display; $("#bp-body").value = b.body;
  }
  function setOverride(key, value) { if (value) overrides[key] = value; else delete overrides[key]; save("lf2-brand", overrides); applyBrand(); }
  function setPanel(open, from) {
    if (open) $("#toast").hidden = true;
    panel.hidden = !open;
    $$("[data-brand-toggle]").forEach(function (t) { t.setAttribute("aria-expanded", String(open)); });
    if (open) { lastToggle = from; syncPanel(); setDemo(false); $("#bp-name").focus(); }
    else if (lastToggle && document.body.contains(lastToggle) && lastToggle.offsetParent) lastToggle.focus();
  }
  $$("[data-brand-toggle]").forEach(function (t) { t.addEventListener("click", function () { setPanel(panel.hidden, t); }); });
  $("#bp-name").addEventListener("input", function (e) { setOverride("name", e.target.value.trim()); });
  $("#bp-short").addEventListener("input", function (e) { setOverride("shortName", e.target.value.trim()); });
  $("#bp-tagline").addEventListener("input", function (e) { setOverride("tagline", e.target.value.trim()); });
  $("#bp-accent").addEventListener("input", function (e) { setOverride("accent", e.target.value); });
  $("#bp-display").addEventListener("change", function (e) { setOverride("display", e.target.value); });
  $("#bp-body").addEventListener("change", function (e) { setOverride("body", e.target.value); });
  $("#bp-theme").addEventListener("change", function (e) {
    delete overrides.accent; delete overrides.display; delete overrides.body; // a theme brings its own
    setOverride("theme", e.target.value); syncPanel();
  });
  $("#bp-reset").addEventListener("click", function () { overrides = {}; save("lf2-brand", overrides); applyBrand(); syncPanel(); $("#bp-msg").textContent = "Back to brand.js values."; });
  $("#bp-copy").addEventListener("click", function () {
    var b = brand();
    var snippet = JSON.stringify({ name: b.name, shortName: b.shortName, tagline: b.tagline, theme: b.themeKey, accent: b.colors.accent, display: b.display, body: b.body }, null, 2);
    var done = function (ok) { $("#bp-msg").textContent = ok ? "Copied. Paste the values into brand.js." : snippet; };
    try { navigator.clipboard.writeText(snippet).then(function () { done(true); }, function () { done(false); }); } catch (e) { done(false); }
  });

  // Escape closes whatever is on top
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!panel.hidden) setPanel(false);
    else if (demoPanel.classList.contains("open")) { setDemo(false); demoOpen.focus(); }
    else if (!menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  // Leaving phone width with the menu open
  window.addEventListener("resize", function () { if (!menu.hidden && window.innerWidth >= 960) setMenu(false); });

  /* ================================ START ================================ */
  applyBrand(); renderTicker(); renderSite(); renderTiers(); route(true);
  setInterval(function () { if (inApp() && clock === null && raf === null && currentTab === "key" && !/ok|no/.test(unlock.className)) renderApp(); else if (inApp() && clock === null) $("#app-time").textContent = fmt(nowMin()); }, 30000);
})();
