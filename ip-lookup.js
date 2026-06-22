/**
 * ip-lookup.js
 * Hosted on GitHub Pages — import or fetch from:
 *   https://<you>.github.io/<repo>/ip-lookup.js
 *
 * Usage (from any page):
 *   const res = await fetch(`https://<you>.github.io/<repo>/api?ip=1.2.3.4`);
 *   const data = await res.json();
 */

(() => {
  // ─── Binary search through sorted IP ranges ───────────────────────────────

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, o) => (acc * 256) + parseInt(o, 10), 0) >>> 0;
  }

  function lookup(ip) {
    if (!window.__IPDB__) return { ip, error: 'Database not loaded.' };

    const ranges = window.__IPDB__;
    const needle = ipToInt(ip);

    let lo = 0, hi = ranges.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const [s, e, cc, co, rg, ci, la, lo2, tz] = ranges[mid];
      if (needle < s)      hi = mid - 1;
      else if (needle > e) lo = mid + 1;
      else return { ip, country_code: cc, country_name: co, state_prov: rg, city: ci, latitude: la, longitude: lo2, timezone: tz };
    }

    return { ip, country_code: null, country_name: null, state_prov: null, city: null, latitude: null, longitude: null, timezone: null };
  }

  // Expose globally
  window.IPLookup = { lookup };
})();
