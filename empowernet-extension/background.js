import { scanContent } from './api.js';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "scanImage",
        title: "Scan Image with EmpowerNet",
        contexts: ["image"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "scanImage") {
        const imageUrl = info.srcUrl;

        // Convert image URL to base64
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1];
                const result = await scanContent('image', base64data, 'Context Menu Image');

                // Notify popup or store result
                chrome.storage.local.set({ lastScanResult: result, lastScanType: 'image' }, () => {
                    chrome.action.openPopup();
                });
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error("Context menu scan failed:", error);
        }
    }
});

// Listener for automatic text scans from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "autoScanText") {
        scanContent('text', request.content, request.label)
            .then(result => {
                chrome.storage.local.set({ lastAutoScan: result, lastAutoScanTime: Date.now() });
                sendResponse({ success: true, result });
            })
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true; // Keep channel open for async response
    }
});

// Enforce Site Blocking
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId !== 0) return; // Only main frame

    const url = new URL(details.url);
    const domain = url.hostname;

    chrome.storage.local.get(['blockedDomains'], (data) => {
        const blocked = data.blockedDomains || [];
        // Check if any blocked entry matches the current domain
        if (blocked.some(b => b.domain === domain)) {
            chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('blocked.html') });
        }
    });
});
