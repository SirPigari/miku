// Global constants for search engines
const engines = [
    { label: 'Google', value: 'https://www.google.com/search?q=%s' },
    { label: 'Bing', value: 'https://www.bing.com/search?q=%s' },
    { label: 'DuckDuckGo', value: 'https://duckduckgo.com/?q=%s' },
    { label: 'Google (udm=14)', value: 'https://www.google.com/search?udm=14&q=%s' },
    { label: 'Yahoo', value: 'https://search.yahoo.com/search?p=%s' },
    { label: 'Brave Search', value: 'https://search.brave.com/search?q=%s' },
    { label: 'Custom', value: 'custom' }
];

document.addEventListener("DOMContentLoaded", function() {
    const defaultImageSelect = document.getElementById('defaultImageSelect');
    const searchEngineSelect = document.getElementById('searchEngineSelect');
    const customSearchContainer = document.getElementById('customSearchContainer');
    const customSearchInput = document.getElementById('customSearchInput');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusText = document.getElementById('statusText');

    // Retrieve saved settings from localStorage
    const savedDefaultImage = localStorage.getItem('defaultImage') || 'miku_normal.png';
    let savedSearchEngine = localStorage.getItem('searchEngine');

    // If no search engine is saved, default it to Google
    if (!savedSearchEngine) {
        savedSearchEngine = 'https://www.google.com/search?q=%s';
        localStorage.setItem('searchEngine', savedSearchEngine);
    }

    // Populate options
    populateImageOptions(defaultImageSelect);
    populateSearchEngineOptions(searchEngineSelect);

    // Set saved values
    defaultImageSelect.value = savedDefaultImage;

    // Handle search engine
    if (engines.map(engine => engine.value).includes(savedSearchEngine)) {
        searchEngineSelect.value = savedSearchEngine;
        customSearchContainer.style.display = "none";
    } else {
        searchEngineSelect.value = "custom";
        customSearchContainer.style.display = "block";
        customSearchInput.value = savedSearchEngine;
    }

    updateStatus();

    // Save button logic
    saveBtn.addEventListener('click', () => {
        localStorage.setItem('defaultImage', defaultImageSelect.value);

        const searchEngineValue = searchEngineSelect.value === 'custom' ? customSearchInput.value : searchEngineSelect.value;
        localStorage.setItem('searchEngine', searchEngineValue);

        updateStatus();

        chrome.tabs.query({}, function (tabs) {
            // Iterate through all open tabs
            tabs.forEach(function (tab) {
                // Check if the tab's URL exactly matches chrome://newtab
                if (tab.url === "chrome://newtab/") {
                    // Reload the tab if it matches
                    chrome.tabs.reload(tab.id);
                }
            });
        });        
    });

    // Reset button logic
    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('defaultImage');
        localStorage.removeItem('searchEngine');

        searchEngineSelect.selectedIndex = 0;
        customSearchContainer.style.display = "none";
        customSearchInput.value = '';

        populateImageOptions(defaultImageSelect);

        updateStatus();

        chrome.tabs.query({}, function (tabs) {
            // Iterate through all open tabs
            tabs.forEach(function (tab) {
                // Check if the tab's URL exactly matches chrome://newtab
                if (tab.url === "chrome://newtab/") {
                    // Reload the tab if it matches
                    chrome.tabs.reload(tab.id);
                }
            });
        });
        
    });

    // Update search engine input visibility
    searchEngineSelect.addEventListener('change', () => {
        if (searchEngineSelect.value === 'custom') {
            customSearchContainer.style.display = 'block';
        } else {
            customSearchContainer.style.display = 'none';
        }
    });
    
    // Update status text
    function updateStatus() {
        const defaultImage = localStorage.getItem('defaultImage') || 'miku_normal.png';
        let searchEngine = localStorage.getItem('searchEngine');

        // If not set, fix to Google
        if (!searchEngine) {
            searchEngine = 'https://www.google.com/search?q=%s';
            localStorage.setItem('searchEngine', searchEngine);
        }

        statusText.textContent = `Image: ${defaultImage}, Search: ${searchEngine}`;
    }

    function populateImageOptions(defaultImageSelect) {
        defaultImageSelect.innerHTML = '';

        const images = [
            'none',
            'miku_normal.png',
            'miku_nude.png',
        ];

        images.forEach(image => {
            const option = document.createElement('option');
            option.value = image;
            option.textContent = image;
            defaultImageSelect.appendChild(option);
        });

        const savedDefaultImage = localStorage.getItem('defaultImage') || 'miku_normal.png';
        defaultImageSelect.value = savedDefaultImage;
    }

    // Fill search engine select dropdown
    function populateSearchEngineOptions(searchEngineSelect) {
        searchEngineSelect.innerHTML = '';

        engines.forEach(engine => {
            const option = document.createElement('option');
            option.value = engine.value;
            option.textContent = engine.label;
            searchEngineSelect.appendChild(option);
        });
    }
});
