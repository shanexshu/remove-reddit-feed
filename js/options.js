const HTML = document.documentElement;
const DEFAULT_SETTINGS = {
  "remove_homepage": true,
  "remove_sidebar": true,
}

// Make checkboxes reflect local settings
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(localSettings => {
    Object.keys(localSettings).forEach(settingKey => {
      if (!Object.keys(DEFAULT_SETTINGS).includes(settingKey)) return;
      document.getElementById(settingKey).checked = localSettings[settingKey];
    });
  });
});

// Handle check/uncheck events
Object.keys(DEFAULT_SETTINGS).forEach(settingKey => {
  const settingCheckbox = document.getElementById(settingKey);
  settingCheckbox.addEventListener("change", async e => {
    const settingKey = e.target.id;
    const settingValue = e.target.checked;

    // 1. Save changes to local storage
    const saveObj = { [settingKey]: settingValue };
    chrome.storage.local.set(saveObj);

    // 2. Update running tabs with the changed setting
    const messageObj = { key: settingKey, value: settingValue };
    chrome.runtime.sendMessage({ "message": "key_change", ...messageObj });
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, messageObj);
      });
    });
  });
});
