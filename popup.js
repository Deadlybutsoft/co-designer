/* popup.js - Co Designer Popup Logic */
document.addEventListener('DOMContentLoaded', async () => {
    const toggle = document.getElementById('toggle-editor');
    const statusText = document.getElementById('status-text');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab) {
        try {
            chrome.tabs.sendMessage(tab.id, { action: "ping" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.log("Content script not detected. Will inject on toggle.");
                } else if (response && response.visible) {
                    toggle.checked = true;
                    updateUI(true);
                }
            });
        } catch (e) { }
    }

    toggle.addEventListener('change', async () => {
        const isActive = toggle.checked;
        updateUI(isActive);

        if (!tab) return;

        try {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar', state: isActive }, (response) => {
                if (chrome.runtime.lastError) {
                    // Inject if missing
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }, () => {
                        chrome.scripting.insertCSS({
                            target: { tabId: tab.id },
                            files: ['sidebar.css']
                        });
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar', state: isActive });
                        }, 100);
                    });
                }
            });
        } catch (e) {
            console.error(e);
        }
    });

    function updateUI(active) {
        statusText.textContent = active ? "System Online" : "System Offline";
        statusText.style.color = active ? "#fff" : "#444";
        statusText.style.textShadow = active ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none";
    }
});
