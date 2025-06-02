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
    const backgroundImageSelect = document.getElementById('backgroundImageSelect');
    const searchEngineSelect = document.getElementById('searchEngineSelect');
    const customSearchContainer = document.getElementById('customSearchContainer');
    const customSearchInput = document.getElementById('customSearchInput');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusText = document.getElementById('statusText');
    const customBgContainer = document.querySelector('#customBgContainer');
    const customBgInput = document.querySelector('#customBgInput');

    const savedbackgroundImage = localStorage.getItem('backgroundImage') || 'miku_normal.png';
    let savedSearchEngine = localStorage.getItem('searchEngine');

    if (!savedSearchEngine) {
        savedSearchEngine = 'https://www.google.com/search?q=%s';
        localStorage.setItem('searchEngine', savedSearchEngine);
    }

    populateImageOptions(backgroundImageSelect);
    populateSearchEngineOptions(searchEngineSelect);

    backgroundImageSelect.value = savedbackgroundImage;

    if (engines.map(engine => engine.value).includes(savedSearchEngine)) {
        searchEngineSelect.value = savedSearchEngine;
        customSearchContainer.style.display = "none";
    } else {
        searchEngineSelect.value = "custom";
        customSearchContainer.style.display = "block";
        customSearchInput.value = savedSearchEngine;
    }

    customBgContainer.style.display = savedbackgroundImage === 'custom' ? 'block' : 'none';

    updateStatus();

    saveBtn.addEventListener('click', () => {
        localStorage.setItem('backgroundImage', backgroundImageSelect.value);

        const searchEngineValue = searchEngineSelect.value === 'custom' ? customSearchInput.value : searchEngineSelect.value;
        localStorage.setItem('searchEngine', searchEngineValue);

        if (backgroundImageSelect.value === 'custom') {
            localStorage.setItem('customBackgroundImage', customBgInput.value);
        }

        updateStatus();

        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                if (tab.url === "chrome://newtab/") {
                    chrome.tabs.reload(tab.id);
                }
            });
        });
        this.location.reload();
    });

    resetBtn.addEventListener('click', () => {
        const savedShortcuts = localStorage.getItem("shortcuts");

        localStorage.clear();

        if (savedShortcuts !== null) {
            localStorage.setItem("shortcuts", savedShortcuts);
        }

        localStorage.removeItem('backgroundImage');
        localStorage.removeItem('searchEngine');

        searchEngineSelect.selectedIndex = 0;
        customSearchContainer.style.display = "none";
        customSearchInput.value = '';
        customBgContainer.style.display = 'none';
        customBgInput.value = '';
        backgroundImageSelect.value = 'miku_normal.png';
        localStorage.removeItem('customBackgroundImage');
        localStorage.setItem('backgroundImage', 'miku_normal.png');

        populateImageOptions(backgroundImageSelect);

        updateStatus();

        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                if (tab.url === "chrome://newtab/") {
                    chrome.tabs.reload(tab.id);
                }
            });
        });
    });

    searchEngineSelect.addEventListener('change', () => {
        if (searchEngineSelect.value === 'custom') {
            customSearchContainer.style.display = 'block';
        } else {
            customSearchContainer.style.display = 'none';
        }
        updateStatus();
    });

    backgroundImageSelect.addEventListener('change', () => {
        if (backgroundImageSelect.value === 'custom') {
            customBgContainer.style.display = 'block';
            customBgInput.value = localStorage.getItem('customBackgroundImage') || '';
        } else {
            customBgContainer.style.display = 'none';
        }

        if (localStorage.getItem('customBackgroundImage') == '') {
            if (backgroundImageSelect.value === 'custom') {
                localStorage.setItem('customBackgroundImage', customBgInput.value || 'custom.png');
            } else {
                localStorage.removeItem('customBackgroundImage');
            }
        }

        updateStatus();
    });
    
    function updateStatus() {
        let backgroundImage = localStorage.getItem('backgroundImage') || 'miku_normal.png';
        let searchEngine = localStorage.getItem('searchEngine');
        const customBgImage = localStorage.getItem('customBackgroundImage');

        if (!searchEngine) {
            searchEngine = 'https://www.google.com/search?q=%s';
            localStorage.setItem('searchEngine', searchEngine);
        }

        if (backgroundImage === 'custom' && customBgImage) {
            backgroundImage = "Custom (" + customBgImage + ")";
        }

        statusText.textContent = `Image: ${backgroundImage}, Search: ${searchEngine}`;
    }

    function populateImageOptions(backgroundImageSelect) {
        backgroundImageSelect.innerHTML = '';

        const images = [
            'none',
            'miku_normal.png',
            'miku_nude.png',
            'custom',
        ];

        images.forEach(image => {
            const option = document.createElement('option');
            option.value = image;
            option.textContent = image;
            backgroundImageSelect.appendChild(option);
        });
        
        const savedbackgroundImage = localStorage.getItem('backgroundImage') || 'miku_normal.png';
        const savedCustomImage = localStorage.getItem('customBackgroundImage');

        if (savedCustomImage) {
            customBgContainer.style.display = 'block';
            customBgInput.value = savedCustomImage || '';
        }

        backgroundImageSelect.value = savedbackgroundImage;
    }

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
