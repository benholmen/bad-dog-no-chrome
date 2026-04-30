const MAX_WINDOWS = 3;
const MAX_TABS = 10;

// Track tab creation timestamps per tab ID
const tabAge = new Map();

chrome.tabs.onCreated.addListener(async (tab) => {
    tabAge.set(tab.id, Date.now());

    const tabs = await chrome.tabs.query({ windowId: tab.windowId });
    if (tabs.length <= MAX_TABS) return;

    let oldestTabId = null;
    let oldestTime = Infinity;
    let oldestIndex = Infinity;

    for (const t of tabs) {
        const age = tabAge.get(t.id) ?? 0;
        if (age < oldestTime || (age === oldestTime && t.index < oldestIndex)) {
            oldestTime = age;
            oldestTabId = t.id;
            oldestIndex = t.index;
        }
    }

    if (oldestTabId !== null) {
        await chrome.tabs.remove(oldestTabId);
        tabAge.delete(oldestTabId);

        const { tabsClosed = 0 } = await chrome.storage.local.get("tabsClosed");
        await chrome.storage.local.set({ tabsClosed: tabsClosed + 1 });
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    tabAge.delete(tabId);
});

// Seed ages for any tabs that already exist when the service worker starts
chrome.tabs.query({}).then((tabs) => {
    const now = Date.now();
    for (const tab of tabs) {
        if (!tabAge.has(tab.id)) {
            tabAge.set(tab.id, now);
        }
    }
});

chrome.windows.onCreated.addListener(async (newWindow) => {
    if (newWindow.type !== "normal") return;

    const allWindows = await chrome.windows.getAll({ windowTypes: ["normal"] });
    if (allWindows.length <= MAX_WINDOWS) return;

    await chrome.windows.remove(newWindow.id);

    const { totalClosed = 0 } = await chrome.storage.local.get("totalClosed");
    await chrome.storage.local.set({ totalClosed: totalClosed + 1 });
});
