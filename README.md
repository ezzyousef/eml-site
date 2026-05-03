# EML Website — Energy Materials Laboratory, AUC

Website for Prof. Nageh K. Allam's Energy Materials Laboratory at The American University in Cairo.

---

## 🚀 Deploy to GitHub Pages — Step by Step

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+) — download if you don't have it
- [Git](https://git-scm.com/) — download if you don't have it
- A [GitHub](https://github.com) account (free)

---

### Step 1 — Add your logo images
Place these inside the `public/` folder:
- `public/EML_logo.png` → your EML logo
- `public/AUC_logo.png` → the AUC logo

### Step 2 — Create a GitHub repository
1. Go to https://github.com/new
2. Name it: `eml-site`
3. Set to **Public**, click **Create repository**

### Step 3 — Update your username in 2 places

In `package.json`, replace `YOUR_GITHUB_USERNAME`:
  "homepage": "https://YOUR_GITHUB_USERNAME.github.io/eml-site"

In `vite.config.js`, the base is already set to '/eml-site/' — only change it if you used a different repo name.

### Step 4 — Open a terminal in this folder and run:
  npm install
  git init
  git add .
  git commit -m "Initial EML website"
  git remote add origin https://github.com/YOUR_USERNAME/eml-site.git
  git branch -M main
  git push -u origin main

### Step 5 — Deploy
  npm run deploy

### Step 6 — Enable GitHub Pages
1. GitHub repo → Settings → Pages
2. Source: branch `gh-pages`, folder `/ (root)`
3. Save → live in ~2 minutes at https://YOUR_USERNAME.github.io/eml-site

---

## Updating the site later
Edit src/App.jsx, then run: npm run deploy

## Custom domain (optional)
Create public/CNAME containing: eml.aucegypt.edu
Ask AUC IT for a CNAME DNS record pointing to YOUR_USERNAME.github.io
Run npm run deploy again.
