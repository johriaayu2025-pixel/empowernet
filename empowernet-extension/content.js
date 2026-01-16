let lastScannedText = "";
const SCAN_INTERVAL = 20000; // 20 seconds

function extractVisibleText() {
    // Simple extraction of visible text
    // In a real production app, we'd be more surgical (e.g., ignoring nav, footer)
    const bodyText = document.body.innerText;

    // Gmail specific: try to get email body if possible
    if (window.location.hostname === "mail.google.com") {
        const emailBody = document.querySelector(".adn.ads");
        if (emailBody) return emailBody.innerText;
    }

    // Meeting captions (Google Meet)
    if (window.location.hostname === "meet.google.com") {
        const captions = document.querySelector(".iT388c"); // Common caption container class
        if (captions) return captions.innerText;
    }

    return bodyText.slice(0, 5000); // Limit to 5KB as per requirements
}

function performScan() {
    const currentText = extractVisibleText();

    // Only scan if text has changed significantly
    if (currentText.length < 50 || currentText === lastScannedText) return;

    lastScannedText = currentText;

    let label = "Webpage";
    if (window.location.hostname === "mail.google.com") label = "Gmail";
    if (window.location.hostname === "meet.google.com") label = "Meeting Caption";

    chrome.runtime.sendMessage({
        action: "autoScanText",
        content: currentText,
        label: label
    }, (response) => {
        if (chrome.runtime.lastError) {
            console.warn("Scan message failed:", chrome.runtime.lastError);
            return;
        }
        console.log("EmpowerNet Auto-Scan Result:", response);
    });
}

// Initial scan after load
setTimeout(performScan, 3000);

// Set interval for recurring scans
setInterval(performScan, SCAN_INTERVAL);

// Listen for manual scan requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLatestContent") {
        const content = extractVisibleText();
        let label = "Webpage";
        if (window.location.hostname === "mail.google.com") label = "Gmail";
        if (window.location.hostname === "meet.google.com") label = "Meeting Caption";

        sendResponse({
            content: content,
            label: label,
            url: window.location.href,
            domain: window.location.hostname
        });
    }
});
