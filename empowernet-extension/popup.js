import { scanContent } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    const globalStatus = document.getElementById('global-status');
    const liveScanResult = document.getElementById('live-scan-result');
    const historyList = document.getElementById('scan-history');
    const blockedList = document.getElementById('blocked-list');
    const blockBtn = document.getElementById('block-site-btn');

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });

    // Load Last Auto-Scan
    function updateLiveScan() {
        chrome.storage.local.get(['lastAutoScan', 'lastAutoScanTime'], (data) => {
            if (data.lastAutoScan) {
                renderResult(liveScanResult, data.lastAutoScan);
                updateGlobalStatus(data.lastAutoScan.riskScore);
            }
        });
    }

    // Refresh live scan occasionally
    updateLiveScan();
    setInterval(updateLiveScan, 5000);

    // Global Status Helper
    function updateGlobalStatus(score) {
        globalStatus.className = 'status-badge';
        if (score > 75) {
            globalStatus.classList.add('danger');
            globalStatus.innerText = '🔴 HIGH RISK DETECTED';
        } else if (score > 40) {
            globalStatus.classList.add('suspicious');
            globalStatus.innerText = '🟡 SUSPICIOUS ACTIVITY';
        } else {
            globalStatus.classList.add('safe');
            globalStatus.innerText = '🟢 SYSTEM SECURE';
        }
    }

    // Result Rendering Helper
    function renderResult(container, result) {
        if (!result || result.error) {
            container.innerHTML = `<p class="error">Error: ${result?.error || 'Unknown error'}</p>`;
            return;
        }

        const categoryClass = result.category;
        container.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <span class="result-category ${categoryClass}">${result.category}</span>
                    <span class="result-score ${categoryClass}">${result.riskScore}%</span>
                </div>
                <p class="summary-text">${result.userSummary?.verdict || ''}</p>
                <p class="reason-text" style="font-size: 12px; color: var(--text-dim); margin-top: 8px;">
                    ${result.userSummary?.reason || ''}
                </p>
                <ul class="explanation-list" style="margin-top: 12px;">
                    ${(result.explanation || []).map(exp => `<li>${exp}</li>`).join('')}
                </ul>
                ${result.ledger?.status === 'confirmed' ? `
                <div style="margin-top: 15px; padding: 10px; background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.1); border-radius: 8px;">
                    <p style="font-size: 10px; font-weight: 800; color: var(--primary); margin-bottom: 4px;">
                        <span style="display: flex; align-items: center; gap: 4px;">✔️ HEDERA VERIFIED</span>
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 9px; color: var(--text-dim); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;">
                            ${result.evidenceHash}
                        </span>
                        <a href="${result.ledger.explorerUrl}" target="_blank" style="font-size: 9px; font-weight: 800; color: var(--primary); text-decoration: none; border-bottom: 1px solid var(--primary);">
                            VIEW RECORD
                        </a>
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        // Save to history
        addToHistory(result);
    }

    function addToHistory(result) {
        chrome.storage.local.get(['scanHistory'], (data) => {
            let history = data.scanHistory || [];
            // Check if already in history (simple check)
            if (history.length > 0 && history[0].evidenceHash === result.evidenceHash) return;

            history.unshift({ ...result, timestamp: Date.now() });
            history = history.slice(0, 10); // Keep last 10
            chrome.storage.local.set({ scanHistory: history }, renderHistory);
        });
    }

    function renderHistory() {
        chrome.storage.local.get(['scanHistory'], (data) => {
            if (!data.scanHistory || data.scanHistory.length === 0) {
                historyList.innerHTML = '<p class="placeholder">No recent scans</p>';
                return;
            }
            historyList.innerHTML = data.scanHistory.map(item => `
                <div class="card" style="padding: 10px; font-size: 12px; margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="${item.category}" style="font-weight: 800;">${item.category}</span>
                        <span style="color: var(--text-dim);">${new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                </div>
            `).join('');
        });
    }
    renderHistory();

    // Unified File Upload Handler (Media Scan)
    const dropArea = document.getElementById('image-upload');
    const input = document.getElementById('image-input');
    const resultArea = document.getElementById('image-result');

    dropArea.addEventListener('click', () => input.click());

    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        dropArea.innerHTML = `<p>Scanning ${file.name}...</p>`;

        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = reader.result.split(',')[1];
            let type = 'image';
            if (file.type.startsWith('video/')) type = 'video';
            if (file.type.startsWith('audio/')) type = 'audio';

            const result = await scanContent(type, base64, file.name);
            renderResult(resultArea, result);
            dropArea.innerHTML = `<p>Upload another file</p>`;
            updateGlobalStatus(result.riskScore);
        };
        reader.readAsDataURL(file);
    });

    // Manual Scan Trigger
    const scanNowBtn = document.getElementById('scan-now-btn');
    scanNowBtn.addEventListener('click', async () => {
        scanNowBtn.disabled = true;
        scanNowBtn.innerText = '⌛ Analyzing Page...';
        liveScanResult.innerHTML = '<p class="placeholder">Fetching latest page content...</p>';

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) throw new Error("No active tab found");

            // Request content from content script
            chrome.tabs.sendMessage(tab.id, { action: "getLatestContent" }, async (response) => {
                if (chrome.runtime.lastError || !response) {
                    renderResult(liveScanResult, { error: "Could not read page content. Refresh the page and try again." });
                    scanNowBtn.disabled = false;
                    scanNowBtn.innerText = '🔍 Scan Current Page';
                    return;
                }

                const result = await scanContent('text', response.content, response.label);
                renderResult(liveScanResult, result);
                chrome.storage.local.set({ lastAutoScan: result, lastAutoScanTime: Date.now() });
                updateGlobalStatus(result.riskScore);

                scanNowBtn.disabled = false;
                scanNowBtn.innerText = '🔍 Scan Current Page';
            });
        } catch (e) {
            renderResult(liveScanResult, { error: e.message });
            scanNowBtn.disabled = false;
            scanNowBtn.innerText = '🔍 Scan Current Page';
        }
    });

    // Block Site Feature
    blockBtn.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url) return;

        try {
            const domain = new URL(tab.url).hostname;
            const fullUrl = tab.url;
            chrome.storage.local.get(['blockedDomains'], (data) => {
                let blocked = data.blockedDomains || [];
                // Check if domain is already blocked
                if (!blocked.some(b => b.domain === domain)) {
                    blocked.push({ domain, url: fullUrl, timestamp: Date.now() });
                    chrome.storage.local.set({ blockedDomains: blocked }, () => {
                        renderBlockedList();
                        // Close popup to show effect or just show success
                    });
                }
            });
        } catch (e) {
            console.error(e);
        }
    });

    function renderBlockedList() {
        chrome.storage.local.get(['blockedDomains'], (data) => {
            const blocked = data.blockedDomains || [];
            if (blocked.length === 0) {
                blockedList.innerHTML = '<p class="placeholder">No domains blocked yet.</p>';
                return;
            }
            blockedList.innerHTML = blocked.map(item => `
                <div class="card" style="padding: 10px; font-size: 11px; margin-bottom: 8px; border-left: 3px solid #ef4444;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1; overflow: hidden;">
                            <p style="font-weight: 800; color: var(--text); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.domain}</p>
                            <p style="font-size: 9px; color: var(--text-dim); margin: 2px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.url}</p>
                        </div>
                        <button class="remove-btn" data-domain="${item.domain}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 10px; font-weight: 800; margin-left: 8px;">UNBLOCK</button>
                    </div>
                </div>
            `).join('');

            // Add unblock listeners
            blockedList.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const domain = btn.dataset.domain;
                    chrome.storage.local.get(['blockedDomains'], (data) => {
                        const blocked = (data.blockedDomains || []).filter(d => d.domain !== domain);
                        chrome.storage.local.set({ blockedDomains: blocked }, renderBlockedList);
                    });
                });
            });
        });
    }
    renderBlockedList();

    // Context Menu Result Polling
    // Check if background script just opened popup with a result
    chrome.storage.local.get(['lastScanResult', 'lastScanType'], (data) => {
        if (data.lastScanResult) {
            const targetTab = data.lastScanType || 'live';
            document.querySelector(`[data-tab="${targetTab}"]`).click();
            const resultArea = document.getElementById(`${targetTab}-result`) || liveScanResult;
            renderResult(resultArea, data.lastScanResult);
            // Clear it so it doesn't pop up again
            chrome.storage.local.remove(['lastScanResult', 'lastScanType']);
        }
    });

});
