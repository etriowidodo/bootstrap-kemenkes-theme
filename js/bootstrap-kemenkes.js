/*!
 * bootstrap-kemenkes-theme (unofficial) — lightweight helpers
 * No build step required. Works alongside Bootstrap 5 JS.
 */
(function () {
  "use strict";

  var STORE = "kmk-theme-prefs";
  var root = document.documentElement;

  var defaults = {
    heading: "'VAG Rounded', 'Quicksand', system-ui, sans-serif",
    body: "'Segoe UI', 'Segoe UI Brand', system-ui, sans-serif",
    size: 16,
    radius: 14
  };

  /* ---------- preferences ---------- */
  function load() {
    try {
      return Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORE) || "{}"));
    } catch (e) {
      return Object.assign({}, defaults);
    }
  }
  function save(prefs) {
    try { localStorage.setItem(STORE, JSON.stringify(prefs)); } catch (e) {}
  }
  function apply(prefs) {
    var p = Object.assign({}, defaults, prefs || {});
    root.style.setProperty("--kmk-heading-font", p.heading);
    root.style.setProperty("--kmk-body-font", p.body);
    root.style.setProperty("--kmk-radius", p.radius + "px");
    root.style.setProperty("--kmk-radius-sm", Math.max(0, p.radius - 4) + "px");
    root.style.fontSize = p.size + "px";
    return p;
  }
  function cssSnippet(p) {
    return ":root {\n" +
      "  --kmk-heading-font: " + p.heading + ";\n" +
      "  --kmk-body-font: " + p.body + ";\n" +
      "  --kmk-radius: " + p.radius + "px;\n" +
      "  --kmk-radius-sm: " + Math.max(0, p.radius - 4) + "px;\n" +
      "}\nhtml {\n  font-size: " + p.size + "px;\n}";
  }

  /* ---------- toast / copy ---------- */
  function toast(message) {
    var wrap = document.querySelector(".kmk-toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "kmk-toast-wrap";
      document.body.appendChild(wrap);
    }
    var el = document.createElement("div");
    el.className = "kmk-toast";
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(function () { el.remove(); }, 2600);
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); toast("Disalin ke clipboard"); } catch (e) {}
    ta.remove();
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () {
        toast("Disalin ke clipboard");
      }).catch(function () { fallbackCopy(text); });
    }
    fallbackCopy(text);
  }

  /* ---------- font picker ---------- */
  function initFontPicker(form) {
    var prefs = load();
    var fields = form.querySelectorAll("[data-kmk-key]");
    var preview = document.querySelector("[data-kmk-css]");
    var nameEl = document.querySelector("[data-kmk-name]");

    function sync() {
      var next = {};
      fields.forEach(function (el) {
        var key = el.getAttribute("data-kmk-key");
        next[key] = key === "size" || key === "radius" ? Number(el.value) : el.value;
      });
      prefs = apply(next);
      save(prefs);
      if (preview) preview.textContent = cssSnippet(prefs);
      if (nameEl) nameEl.textContent = "Aktif: " + prefs.size + "px · radius " + prefs.radius + "px";
    }
    fields.forEach(function (el) {
      var key = el.getAttribute("data-kmk-key");
      if (key === "size" || key === "radius") {
        var out = form.querySelector('[data-kmk-out="' + key + '"]');
        el.value = prefs[key];
        if (out) out.textContent = prefs[key] + "px";
        el.addEventListener("input", function () {
          if (out) out.textContent = el.value + "px";
          sync();
        });
      } else {
        el.value = prefs[key] || defaults[key];
        el.addEventListener("change", sync);
      }
    });
    sync();
    var reset = form.querySelector("[data-kmk-reset]");
    if (reset) reset.addEventListener("click", function (e) {
      e.preventDefault();
      prefs = apply(defaults);
      save(prefs);
      fields.forEach(function (el) {
        var key = el.getAttribute("data-kmk-key");
        el.value = prefs[key];
        var out = form.querySelector('[data-kmk-out="' + key + '"]');
        if (out) out.textContent = prefs[key] + "px";
      });
      if (preview) preview.textContent = cssSnippet(prefs);
      toast("Pengaturan dikembalikan ke default");
    });
    var copyBtn = form.querySelector("[data-kmk-copy]");
    if (copyBtn) copyBtn.addEventListener("click", function (e) {
      e.preventDefault();
      copy(cssSnippet(prefs));
    });
  }

  /* ---------- data table ---------- */
  function initDataTable(wrap) {
    var table = wrap.querySelector("table");
    if (!table || !table.tBodies[0]) return;
    var tbody = table.tBodies[0];
    var rows = Array.prototype.slice.call(tbody.rows);
    var search = wrap.querySelector("[data-kmk-table-search]");
    var pager = wrap.querySelector("[data-kmk-table-pager]");
    var size = parseInt(wrap.getAttribute("data-page-size") || "5", 10);
    var page = 1, query = "", sortIdx = -1, sortDir = 1;

    Array.prototype.forEach.call(table.tHead.rows[0].cells, function (th, idx) {
      if (!th.hasAttribute("data-sort")) return;
      th.classList.add("kmk-sort");
      th.addEventListener("click", function () {
        if (sortIdx === idx) { sortDir *= -1; } else { sortIdx = idx; sortDir = 1; }
        rows.sort(function (a, b) {
          var x = a.cells[idx].getAttribute("data-value") || a.cells[idx].textContent.trim();
          var y = b.cells[idx].getAttribute("data-value") || b.cells[idx].textContent.trim();
          var n1 = parseFloat(String(x).replace(/[^0-9.-]/g, ""));
          var n2 = parseFloat(String(y).replace(/[^0-9.-]/g, ""));
          var numeric = !isNaN(n1) && !isNaN(n2);
          if (numeric) return (n1 - n2) * sortDir;
          return x.localeCompare(y) * sortDir;
        });
        render();
      });
    });

    function filtered() {
      return rows.filter(function (r) {
        return !query || r.textContent.toLowerCase().indexOf(query) > -1;
      });
    }
    function render() {
      var d = filtered();
      var pages = Math.max(1, Math.ceil(d.length / size));
      if (page > pages) page = pages;
      rows.forEach(function (r) { r.style.display = "none"; });
      d.slice((page - 1) * size, page * size).forEach(function (r) { r.style.display = ""; });
      if (!pager) return;
      pager.innerHTML = "";
      var info = document.createElement("span");
      info.className = "small text-kmk-gray";
      var from = d.length ? (page - 1) * size + 1 : 0;
      var to = Math.min(d.length, page * size);
      info.textContent = "Menampilkan " + from + "–" + to + " dari " + d.length;
      var prev = document.createElement("button");
      prev.type = "button"; prev.className = "btn btn-sm btn-outline-primary"; prev.textContent = "‹";
      prev.disabled = page <= 1; prev.addEventListener("click", function () { page--; render(); });
      var next = document.createElement("button");
      next.type = "button"; next.className = "btn btn-sm btn-outline-primary ms-1"; next.textContent = "›";
      next.disabled = page >= pages; next.addEventListener("click", function () { page++; render(); });
      pager.appendChild(info); pager.appendChild(prev); pager.appendChild(next);
    }
    if (search) search.addEventListener("input", function () {
      query = search.value.toLowerCase(); page = 1; render();
    });
    render();
  }

  /* ---------- wizard ---------- */
  function initWizard(w) {
    var panels = Array.prototype.slice.call(w.querySelectorAll("[data-wizard-step]"));
    var indicators = Array.prototype.slice.call(w.querySelectorAll(".kmk-step"));
    var bar = w.querySelector(".kmk-wizard-progress .progress-bar");
    var idx = 0;
    if (!panels.length) return;
    function show(i) {
      idx = Math.max(0, Math.min(panels.length - 1, i));
      panels.forEach(function (p, n) {
        p.style.display = n === idx ? "" : "none";
        p.classList.toggle("is-active", n === idx);
      });
      indicators.forEach(function (s, n) {
        s.classList.toggle("is-active", n === idx);
        s.classList.toggle("is-done", n < idx);
      });
      if (bar) bar.style.width = ((idx / (panels.length - 1)) * 100) + "%";
      w.querySelectorAll("[data-wizard-prev]").forEach(function (b) { b.disabled = idx === 0; });
      w.querySelectorAll("[data-wizard-next]").forEach(function (b) { b.disabled = idx === panels.length - 1; });
    }
    w.querySelectorAll("[data-wizard-next]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); show(idx + 1); });
    });
    w.querySelectorAll("[data-wizard-prev]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); show(idx - 1); });
    });
    show(0);
  }

  /* ---------- charts ---------- */
  function initSpark(el) {
    var vals = (el.getAttribute("data-values") || "").split(",").map(Number).filter(function (n) { return !isNaN(n); });
    if (!vals.length) return;
    var w = el.clientWidth || 160, h = el.clientHeight || 40;
    var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    var span = (max - min) || 1;
    var pts = vals.map(function (v, i) {
      var x = vals.length === 1 ? w / 2 : (i / (vals.length - 1)) * w;
      var y = h - ((v - min) / span) * (h - 4) - 2;
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
    el.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="100%" preserveAspectRatio="none">' +
      '<polyline fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="' + pts + '"/></svg>';
    el.style.color = el.getAttribute("data-color") || "var(--kmk-teal)";
  }
  function initBars(el) {
    var vals = (el.getAttribute("data-values") || "").split(",").map(Number).filter(function (n) { return !isNaN(n); });
    if (!vals.length) return;
    var max = Math.max.apply(null, vals) || 1;
    el.innerHTML = vals.map(function (v) {
      var p = Math.round((v / max) * 100);
      return '<div class="kmk-bars-col"><div class="kmk-bars-fill" style="height:' + p + '%"></div><span>' + v + "</span></div>";
    }).join("");
  }

  /* ---------- init ---------- */
  function init() {
    apply(load());

    var form = document.querySelector("[data-kmk-font-picker]");
    if (form) initFontPicker(form);

    document.querySelectorAll("[data-kmk-datatable]").forEach(initDataTable);
    document.querySelectorAll("[data-kmk-wizard]").forEach(initWizard);
    document.querySelectorAll("[data-kmk-spark]").forEach(initSpark);
    document.querySelectorAll("[data-kmk-bars]").forEach(initBars);

    document.querySelectorAll("[data-kmk-copy-snippet]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var box = btn.closest(".kmk-snippet");
        var pre = box && box.querySelector("pre");
        if (pre) copy(pre.textContent);
      });
    });

    document.querySelectorAll("[data-kmk-toast]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        toast(btn.getAttribute("data-kmk-toast") || "Tersimpan");
      });
    });
  }

  window.KmkTheme = {
    load: load, save: save, apply: apply, applyFonts: function (p) { save(apply(p)); },
    cssSnippet: cssSnippet, toast: toast, copy: copy
  };

  document.addEventListener("DOMContentLoaded", init);
})();
