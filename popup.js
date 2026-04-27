document.addEventListener("DOMContentLoaded", async () => {
    const el = document.getElementById("count");
    const { totalClosed = 0 } = await chrome.storage.local.get("totalClosed");
    el.textContent = totalClosed;

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.totalClosed) el.textContent = changes.totalClosed.newValue;
    });
});
