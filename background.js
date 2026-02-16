/* background.js - Direct Toggle on Icon Click */
chrome.action.onClicked.addListener(async (tab) => {
    try {
        // Try sending toggle message to existing content script
        chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar', state: 'toggle' }, (response) => {
            if (chrome.runtime.lastError) {
                // Content script not loaded yet — inject it first
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                }, () => {
                    chrome.scripting.insertCSS({
                        target: { tabId: tab.id },
                        files: ['sidebar.css']
                    });
                    setTimeout(() => {
                        chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar', state: true });
                    }, 150);
                });
            }
        });
    } catch (e) {
        console.error('Toggle failed:', e);
    }
});
