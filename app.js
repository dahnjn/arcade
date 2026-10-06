(function () {
  "use strict";

  const grid = document.getElementById("grid");
  const errorEl = document.getElementById("error");

  function openPlay(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function card(game) {
    const article = document.createElement("article");
    article.className = "card";
    article.setAttribute("role", "link");
    article.setAttribute("tabindex", "0");
    article.setAttribute("aria-label", "Play " + game.name);

    const img = document.createElement("img");
    img.className = "card-poster";
    img.src = game.poster || "posters/" + game.id + ".jpg";
    img.alt = game.name;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "card-body";

    const name = document.createElement("h2");
    name.className = "card-name";
    name.textContent = game.name;

    const play = document.createElement("a");
    play.className = "card-play";
    play.href = game.playUrl;
    play.target = "_blank";
    play.rel = "noopener noreferrer";
    play.textContent = "Play";
    play.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    body.appendChild(name);
    body.appendChild(play);
    article.appendChild(img);
    article.appendChild(body);

    article.addEventListener("click", function () {
      openPlay(game.playUrl);
    });

    article.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPlay(game.playUrl);
      }
    });

    return article;
  }

  function render(games) {
    grid.innerHTML = "";
    const sorted = games.slice().sort(function (a, b) {
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
    sorted.forEach(function (g) {
      grid.appendChild(card(g));
    });
  }

  fetch("games.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load games.json (" + res.status + ")");
      return res.json();
    })
    .then(render)
    .catch(function (err) {
      errorEl.hidden = false;
      errorEl.textContent = String(err.message || err);
    });
})();
