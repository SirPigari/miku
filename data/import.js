const input = document.getElementById('importFile');
const fileNameDisplay = document.getElementById('fileName');

input.addEventListener('change', () => {
    if (input.files.length > 0) {
        fileNameDisplay.textContent = `Selected: ${input.files[0].name}`;
    } else {
        fileNameDisplay.textContent = '';
    }
});

document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const data = JSON.parse(event.target.result);
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    localStorage.setItem(key, data[key]);
                }
            }
            alert("Data imported successfully!");

            chrome.runtime.sendMessage({ action: "reloadNewTab" }, (response) => {
                window.close();
            });
        } catch (err) {
            alert("Invalid JSON file.");
        }
    };
    reader.readAsText(file);
});
