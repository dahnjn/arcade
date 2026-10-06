# Arcade

Stark black-and-white Swiss / International Typographic Style launcher for games by [Josh Dahn](https://github.com/dahnjn) (@dahnjn).

**Live:** https://dahnjn.github.io/arcade/

Poster cards sorted alphabetically. Play opens each game in a new tab.

## Games

| Game | Play |
|------|------|
| Anova | https://dahnjn.github.io/anova/ |
| Art for All | https://dahnjn.github.io/art-for-all/ |
| Fish | https://dahnjn.github.io/fish/ |
| Hollywood | https://dahnjn.github.io/hollywood/ |
| Lizard Kings | https://dahnjn.github.io/lizard-kings/ |
| Nashcity | https://dahnjn.github.io/nashcity/ |
| Nashville | https://dahnjn.github.io/nashville/ |
| News | https://dahnjn.github.io/news/ |
| Pumpkin | https://dahnjn.github.io/pumpkin/ |
| Starlite | https://dahnjn.github.io/starlite/ |

## Files

- `index.html` — page shell
- `styles.css` — B&W Swiss typography
- `app.js` — load catalog, sort A–Z, open play URLs in a new tab
- `games.json` — catalog (`poster`, `playUrl`; descriptions/tags kept as data only)
- `posters/` — Swiss poster images (`<id>.jpg`)

## Run locally

```bash
cd game-arcade
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

## Deploy

Push to `dahnjn/arcade` and enable GitHub Pages from the default branch root. Site: **https://dahnjn.github.io/arcade/**.
