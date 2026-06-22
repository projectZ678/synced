/**
 * webrtc-ip-lookup.js
 *
 * Drop this into any page to intercept WebRTC ICE candidates,
 * extract the real public IP, and look it up via your self-hosted
 * GitHub Pages API — no third-party API keys required.
 *
 * SETUP: Replace YOUR_GITHUB_USERNAME and YOUR_REPO_NAME below.
 */

const API_BASE = "https://projectz678.github.io/synced";

// ─── Load the IP database from GitHub Pages ───────────────────────────────────

let dbReady = false;

function loadDatabase() {
  return new Promise((resolve, reject) => {
    if (dbReady) return resolve();

    // Load ip-lookup.js (the binary search engine)
    const lookupScript = document.createElement('script');
    lookupScript.src = `${API_BASE}/ip-lookup.js`;
    lookupScript.onerror = () => reject(new Error('Failed to load ip-lookup.js'));

    // Load db.js (the IP database) after ip-lookup.js is ready
    lookupScript.onload = () => {
      const dbScript = document.createElement('script');
      dbScript.src = `${API_BASE}/db.js`;
      dbScript.onerror = () => reject(new Error('Failed to load db.js'));
      dbScript.onload  = () => { dbReady = true; resolve(); };
      document.head.appendChild(dbScript);
    };

    document.head.appendChild(lookupScript);
  });
}

// ─── Lookup function ──────────────────────────────────────────────────────────

const getLocation = async (ip) => {
  try {
    await loadDatabase();

    const json = window.IPLookup.lookup(ip);

    const output = `
---------------------
IP:      ${ip}
Country: ${json.country_name || 'N/A'}
State:   ${json.state_prov   || 'N/A'}
City:    ${json.city         || 'N/A'}
Lat/Lon: (${json.latitude    || 'N/A'}, ${json.longitude || 'N/A'})
Timezone:${json.timezone     || 'N/A'}
---------------------`;

    console.log(output);
    return json;

  } catch (error) {
    console.error("Error fetching location:", error);
  }
};

// ─── WebRTC intercept ─────────────────────────────────────────────────────────

const originalRTCPeerConnection =
  window.RTCPeerConnection || window.webkitRTCPeerConnection;

window.RTCPeerConnection = function (...args) {
  const pc = new originalRTCPeerConnection(...args);
  const originalAddIceCandidate = pc.addIceCandidate.bind(pc);

  pc.addIceCandidate = function (iceCandidate, ...rest) {
    try {
      if (iceCandidate?.candidate) {
        const fields = iceCandidate.candidate.split(" ");

        // srflx = server reflexive = the real public IP
        if (fields.length > 7 && fields[7] === "srflx") {
          const ip = fields[4];
          if (ip) getLocation(ip);
        }
      }
    } catch (error) {
      console.error("Error processing ICE candidate:", error);
    }

    return originalAddIceCandidate(iceCandidate, ...rest);
  };

  return pc;
};

console.log("initialized! API:", API_BASE);
