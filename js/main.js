const HTML = document.documentElement;
const DEFAULT_SETTINGS = {
  "remove_homepage": true,
  "remove_sidebar": true,
}

function setSettings() {
  chrome.storage.local.get(localSettings => {
    Object.keys(DEFAULT_SETTINGS).forEach(settingKey => {
      const isLocal = localSettings.hasOwnProperty(settingKey);
      const settingValue = isLocal ? localSettings[settingKey] : DEFAULT_SETTINGS[settingKey];
      if (!isLocal) chrome.storage.local.set({ [settingKey] : settingValue });
      HTML.setAttribute(settingKey, settingValue);
    });
  });

}

try {
  setSettings();

} catch (e) {
  console.log(e);
}
