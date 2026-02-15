/* background.js */
// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Background can handle global state or cross-tab actions here if needed
    return true;
});

// Shortcut for developers: You can add keyboard commands in manifest.json 
// and handle them here to toggle the sidebar without clicking the icon.
