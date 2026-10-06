(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  const arcadeView = $("#arcade-view");
  const playView = $("#play-view");
  const searchInput = $("#search");
  const tagChipsEl = $("#tag-chips");
  const featuredSection = $("#featured-section");
  const featuredGrid = $("#featured-grid");
  const gamesGrid = $("#games-grid");
  const emptyState = $("#empty-state");
  const resultCount = $("#result-count");
  const playFrame = $("#play-frame");
  const playTitle = $("#play-title");
  const openTab = $("#open-tab");
  const backBtn = $("#back-btn");
  const frameFallback = $("#frame-fallback");
  const fallbackOpen = $("#fallback-open");
  const fallbackBack = $("#fallback-back");

  let games = [];
  let activeTag = null;
  let searchQuery = "";
  let frameLoadTimer = null;
  let frameLoaded = false;

  async function init() {
    try {
      const res = await fetch("games.json");
      if (!res.ok) throw new Error("Failed to load games.json (" + res.status + ")");
      games = await res.json();
    } catch (err) {
      gamesGrid.innerHTML = '<p class="empty-state">Could not load games. Open via a local server (see README).</p>';
      console.error(err);
      return;
    }

    renderTagChips();
    render();
    bindEvents();
  }

  function allTags() {
    const set = new Set();
    games.forEach((g) => g.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  function renderTagChips() {
    const tags = allTags();
    const chips = [
      '<button type="button" class="chip active" data-tag="">All</button>',
    ].concat(
      tags.map(function (t) {
        return (
          '<button type="button" class="chip" data-tag="' +
          escapeAttr(t) +
          '">' +
          escapeHtml(t) +
          "</button>"
        );
      })
    );
    tagChipsEl.innerHTML = chips.join("");
  }

  function matchesFilters(game) {
    if (activeTag && !game.tags.includes(activeTag)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const hay = [game.name, game.description].concat(game.tags).join(" ").toLowerCase();
    return hay.includes(q);
  }

  function render() {
    const filtered = games.filter(matchesFilters);
    const featured = filtered.filter((g) => g.featured);
    const rest = filtered.filter((g) => !g.featured);

    const showFeatured = featured.length > 0 && !searchQuery;
    featuredSection.hidden = !showFeatured;
    featuredGrid.innerHTML = showFeatured
      ? featured.map((g) => cardHtml(g, true)).join("")
      : "";

    const mainList = showFeatured ? rest : filtered;
    gamesGrid.innerHTML = mainList.map((g) => cardHtml(g, false)).join("");

    emptyState.hidden = filtered.length > 0;
    resultCount.textContent =
      filtered.length === games.length
        ? games.length + " games"
        : filtered.length + " of " + games.length;

    $("#all-heading").textContent = showFeatured ? "The Collection" : "Games";
  }

  function cardHtml(game, inFeatured) {
    const tags = game.tags
      .map(function (t) {
        const cls = t === "nashville" ? "tag-pill nashville" : "tag-pill";
        return '<span class="' + cls + '">' + escapeHtml(t) + "</span>";
      })
      .join("");

    const badge =
      game.featured && inFeatured
        ? '<span class="badge">Featured</span>'
        : "";

    return (
      '<article class="game-card' +
      (inFeatured ? " featured-card" : "") +
      '" data-id="' +
      escapeAttr(game.id) +
      '">' +
      '<div class="card-top">' +
      '<h3 class="card-title">' +
      escapeHtml(game.name) +
      "</h3>" +
      badge +
      "</div>" +
      '<p class="card-desc">' +
      escapeHtml(game.description) +
      "</p>" +
      '<div class="card-tags">' +
      tags +
      "</div>" +
      '<div class="card-actions">' +
      '<button type="button" class="btn primary" data-play="' +
      escapeAttr(game.id) +
      '">Play</button>' +
      '<a class="btn ghost" href="' +
      escapeAttr(game.playUrl) +
      '" target="_blank" rel="noopener noreferrer">Open in new tab</a>' +
      "</div>" +
      "</article>"
    );
  }

  function bindEvents() {
    searchInput.addEventListener("input", function () {
      searchQuery = searchInput.value.trim();
      render();
    });

    tagChipsEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      const tag = btn.dataset.tag || null;
      activeTag = tag || null;
      tagChipsEl.querySelectorAll(".chip").forEach(function (c) {
        c.classList.toggle("active", (c.dataset.tag || "") === (tag || ""));
      });
      render();
    });

    document.addEventListener("click", function (e) {
      const playBtn = e.target.closest("[data-play]");
      if (playBtn) {
        const game = games.find(function (g) {
          return g.id === playBtn.dataset.play;
        });
        if (game) openPlay(game);
      }
    });

    backBtn.addEventListener("click", closePlay);
    fallbackBack.addEventListener("click", closePlay);

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !playView.hidden) closePlay();
    });
  }

  function openPlay(game) {
    frameLoaded = false;
    frameFallback.hidden = true;
    playFrame.style.visibility = "visible";
    playTitle.textContent = game.name;
    openTab.href = game.playUrl;
    fallbackOpen.href = game.playUrl;

    playFrame.removeAttribute("src");
    playFrame.src = game.playUrl;

    arcadeView.hidden = true;
    playView.hidden = false;
    document.body.style.overflow = "hidden";

    clearTimeout(frameLoadTimer);

    playFrame.onload = function () {
      frameLoaded = true;
      try {
        const doc = playFrame.contentDocument;
        if (doc && doc.body && !doc.body.innerHTML.trim()) {
          showFallback();
        }
      } catch (e) {
        // Cross-origin: treat as successful embed
      }
    };

    frameLoadTimer = setTimeout(function () {
      if (!frameLoaded) {
        showFallback();
      }
    }, 8000);
  }

  function showFallback() {
    frameFallback.hidden = false;
    playFrame.style.visibility = "hidden";
  }

  function closePlay() {
    clearTimeout(frameLoadTimer);
    playFrame.onload = null;
    playFrame.src = "about:blank";
    frameFallback.hidden = true;
    playView.hidden = true;
    arcadeView.hidden = false;
    document.body.style.overflow = "";
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }

  init();
})();
