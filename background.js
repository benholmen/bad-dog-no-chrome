const MAX_WINDOWS = 3;

chrome.windows.onCreated.addListener(async (newWindow) => {
    if (newWindow.type !== "normal") return;

    const allWindows = await chrome.windows.getAll({ windowTypes: ["normal"] });
    if (allWindows.length <= MAX_WINDOWS) return;

    await chrome.windows.remove(newWindow.id);

    const { totalClosed = 0 } = await chrome.storage.local.get("totalClosed");
    await chrome.storage.local.set({ totalClosed: totalClosed + 1 });
});
