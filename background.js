chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");

  chrome.contextMenus.create({
    id: "exportData",
    title: "Export Data",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "importData",
    title: "Import Data",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "separator-1",
    type: "separator",
    contexts: ["all"]
  });


  chrome.contextMenus.create({
    id: "refreshTabs",
    title: "Refresh all miku-tabs",
    contexts: ["action"]
  });

  chrome.contextMenus.create({
    id: "resetSha",
    title: "Reset commit SHA",
    contexts: ["action"]
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "exportData") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("data/export.html")
    });
  }

  if (info.menuItemId === "importData") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("data/import.html")
    });
  }

  if (info.menuItemId === "refreshTabs") {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        if (tab.url === "chrome://newtab/") {
          chrome.tabs.create({ index: tab.index + 1 }, function () {
            chrome.tabs.remove(tab.id);
          });
        }
      });
    });
  }
  if (info.menuItemId === "resetSha") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("data/reset_sha.html")
    });
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'reloadNewTab') {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        if (tab.url === "chrome://newtab/") {
          chrome.tabs.reload(tab.id);
        }
      });
    });
    sendResponse({ reloaded: true });
  }
});
