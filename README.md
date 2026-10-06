# Game Arcade

A curated static arcade launcher for **10 games** by [Josh Dahn](https://github.com/dahnjn) (@dahnjn). Browse cards, filter by search or tags, and play in-app (iframe) or open in a new tab.

**Live (after Pages deploy):** https://dahnjn.github.io/arcade/

## The collection

| Game | Play |
|------|------|
| Starlite *(featured)* | https://dahnjn.github.io/starlite/ |
| Pumpkin *(featured)* | https://dahnjn.github.io/pumpkin/ |
| Nashcity | https://dahnjn.github.io/nashcity/ |
| Nashville | https://dahnjn.github.io/nashville/ |
| Fish | https://dahnjn.github.io/fish/ |
| Lizard Kings | https://dahnjn.github.io/lizard-kings/ |
| Art for All | https://dahnjn.github.io/art-for-all/ |
| Hollywood | https://dahnjn.github.io/hollywood/ |
| News | https://dahnjn.github.io/news/ |
| Anova | https://dahnjn.github.io/anova/ |

## Files

- `index.html` — page shell
- `styles.css` — dark cinematic theme
- `app.js` — load `games.json`, search/tag filters, play view
- `games.json` — curated catalog (exactly these 10)

## Run locally

From this folder:

```bash
cd game-arcade
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

You can also open `index.html` directly in a browser, but `fetch("games.json")` needs a local server in most browsers.

## Deploy to GitHub Pages (`dahnjn/arcade`)

1. Create a new repo named **`game-arcade`** under **dahnjn** (or use the existing one).
2. Push this folder to the repo’s default branch (e.g. `main`):

   ```bash
   git init
   git add .
   git commit -m "Curated Game Arcade — 10 games"
   git branch -M main
   git remote add origin https://github.com/dahnjn/arcade.git
   git push -u origin main
   ```

   If the remote already exists, use `git remote set-url` / `git push` as usual.

3. In the repo: **Settings → Pages → Build and deployment**.
4. Source: **Deploy from a branch** → branch `main` → folder `/ (root)` → Save.
5. Site will be at **https://dahnjn.github.io/arcade/**.

## Notes

Some games may set `X-Frame-Options` / CSP and block iframe embedding. The play view detects a failed load and offers **Open in new tab**.
