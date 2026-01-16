
export const generateExtensionZip = () => {
  const manifest = {
    manifest_version: 3,
    name: "EmpowerNet Guard",
    version: "1.0.0",
    description: "Real-time AI Scam & Deepfake Protection",
    permissions: ["activeTab", "storage", "notifications", "scripting"],
    background: { service_worker: "background.js" },
    action: { default_popup: "popup.html" },
    content_scripts: [{
      matches: ["<all_urls>"],
      js: ["contentScript.js"]
    }]
  };

  const bgScript = `
// EmpowerNet Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('EmpowerNet Guard Active');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SCAN_CONTENT') {
    // Forward to EmpowerNet ML Engine
    fetch('https://api.empowernet.ai/v1/scan', {
      method: 'POST',
      body: JSON.stringify(request.data)
    })
    .then(r => r.json())
    .then(data => {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'EmpowerNet Security Alert',
        message: 'Analysis complete: ' + data.status
      });
      sendResponse(data);
    })
    .catch(err => console.error(err));
    return true; // Keep channel open
  }
});`;

  const contentScript = `
// EmpowerNet Content Script
const scanPage = () => {
  const text = document.body.innerText.substring(0, 2000);
  chrome.runtime.sendMessage({ 
    type: 'SCAN_CONTENT', 
    data: { text, url: window.location.href } 
  });
};

window.addEventListener('load', () => {
  setTimeout(scanPage, 2000);
});`;

  const popupHtml = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body style="width:300px;padding:20px;font-family:sans-serif;background:#f8f9fc;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
    <div style="width:32px;height:32px;background:#7c3aed;border-radius:8px;"></div>
    <h2 style="margin:0;color:#1e1b4b;font-size:18px;">EmpowerNet</h2>
  </div>
  <div id="status-card" style="background:white;padding:15px;border-radius:12px;border:1px solid #e2e8f0;">
    <p style="margin:0;font-size:12px;color:#64748b;font-weight:600;">STATUS</p>
    <p id="status" style="margin:5px 0 0 0;font-size:14px;font-weight:bold;color:#10b981;">Protection Active</p>
  </div>
  <button id="scan-now" style="width:100%;margin-top:15px;padding:12px;background:#7c3aed;color:white;border:none;border-radius:10px;font-weight:bold;cursor:pointer;">Scan Current Page</button>
  <script src="popup.js"></script>
</body>
</html>`;

  const readme = `
# EmpowerNet Guard Extension v1.0.0

## Installation
1. Download this source package.
2. Open Chrome and go to chrome://extensions
3. Enable "Developer mode" (top right).
4. Click "Load unpacked".
5. Select the folder containing these files.

## Features
- Real-time linguistic fraud detection
- On-page deepfake image analysis
- Live meeting voice clone detection sync
- Secure consensus proof logging on Hedera`;

  const fullOutput = `
=== MANIFEST.JSON ===
${JSON.stringify(manifest, null, 2)}

=== BACKGROUND.JS ===
${bgScript}

=== CONTENTSCRIPT.JS ===
${contentScript}

=== POPUP.HTML ===
${popupHtml}

=== README.MD ===
${readme}
  `;

  const blob = new Blob([fullOutput], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'EmpowerNet_Extension_v1_Source.txt';
  link.click();
};
