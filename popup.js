document.addEventListener("DOMContentLoaded", async () => {
    const windowEl = document.getElementById("windowCount");
    const tabEl = document.getElementById("tabCount");

    const data = await chrome.storage.local.get(["totalClosed", "tabsClosed"]);
    windowEl.textContent = data.totalClosed || 0;
    tabEl.textContent = data.tabsClosed || 0;

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.totalClosed) windowEl.textContent = changes.totalClosed.newValue;
        if (changes.tabsClosed) tabEl.textContent = changes.tabsClosed.newValue;
    });
});
