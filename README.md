# IP Lookup — Self-hosted on GitHub Pages

Zero dependencies. No API keys. No backend. Free forever.

Uses [DB-IP City Lite](https://db-ip.com/db/lite.php) (CC BY 4.0).

---

## One-time setup

### 1. Create a GitHub repo

Create a new public repo, e.g. `ip-api`. Clone it locally.

### 2. Copy files into the repo

```
your-repo/
├── package.json
├── scripts/
│   └── build-db.js       ← build tool (not deployed)
├── site/
│   ├── index.html        ← GitHub Pages root
│   ├── ip-lookup.js      ← binary search engine
│   └── db.js             ← generated IP database (you build this)
└── webrtc-ip-lookup.js   ← drop into any page
```

### 3. Build the database

```cmd
npm run build-db
```

This downloads the free DB-IP CSV (~20 MB) and outputs `site/db.js` (~50 MB).
No account or API key needed.

### 4. Enable GitHub Pages

- Go to your repo → **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: `main`, folder: `/site`
- Save

Your API will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

### 5. Push everything

```cmd
git add .
git commit -m "Initial deploy"
git push
```

### 6. Update `webrtc-ip-lookup.js`

Edit the top of `webrtc-ip-lookup.js`:
```js
const API_BASE = "https://YOUR_USERNAME.github.io/YOUR_REPO";
```

---

## Using the WebRTC script

Drop `webrtc-ip-lookup.js` into any page:

```html
<script src="webrtc-ip-lookup.js"></script>
```

When WebRTC leaks a public IP, it automatically looks it up and logs:

```
---------------------
IP:      203.0.113.42
Country: United States
State:   California
City:    Mountain View
Lat/Lon: (37.4056, -122.0775)
Timezone:America/Los_Angeles
---------------------
```

---

## Updating the database monthly

DB-IP releases a new file each month. To update:

```cmd
npm run build-db
git add site/db.js
git commit -m "Update IP database - $(date +%Y-%m)"
git push
```

---

## .gitignore

Add this so the temp file isn't committed:

```
_tmp.csv
node_modules/
```
