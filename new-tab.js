const CURRENT_COMMIT_SHA = '2376b4318f191d8274a381c79977fe63521a43bc';

window.onload = async function () {
    loadShortcuts();

    let backgroundImage = localStorage.getItem('backgroundImage') || 'miku_normal.png';
    if (localStorage.getItem('backgroundEnabled') !== 'true') {
        if (backgroundImage === 'custom') {
            backgroundImage = localStorage.getItem('customBackgroundImage') || 'custom.png';
        }

        if (backgroundImage === 'none') {
            document.body.style.backgroundImage = 'none';
        } else {
            let customBackgroundImage = localStorage.getItem('customBackgroundImage');
            if (customBackgroundImage && customBackgroundImage !== '') {
                backgroundImage = customBackgroundImage;
            } else {
                backgroundImage = `./images/${backgroundImage}`;
            }
            document.body.style.backgroundImage = `url(${backgroundImage})`;
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        }
    }

    // SHA check logic
    console.log("Checking for updates at " + new Date().toISOString());

    const isValidSha = sha => /^[0-9a-f]{40}$/i.test(sha);

    let sha = localStorage.getItem("commit_sha");
    if (!sha) {
        sha = current_sha;
        localStorage.setItem("commit_sha", sha);
    }

    if (!isValidSha(sha) && sha !== "null") {
        showStatusMessage("Invalid commit SHA found in localStorage! Resetting to null.", "fas fa-exclamation-triangle");
        localStorage.setItem("commit_sha", null);
        return;
    }

    const repoOwner = "SirPigari";
    const repoName = "miku";
    const branch = "main";

    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?sha=${branch}`);
        const commits = await response.json();

        const latestSha = commits[0]?.sha;
        const secondLatestSha = commits[1]?.sha;

        console.log("Your local commit SHA:", sha);
        console.log("Latest commit SHA on GitHub:", latestSha);
        console.log("Second latest commit SHA on GitHub:", secondLatestSha);

        if (sha !== latestSha && sha !== secondLatestSha && sha !== "null") {
            showStatusMessage("Your extension is not up to date!", "fas fa-exclamation-triangle");
        } else {
            console.log("Your local commit is up to date.");
        }
    } catch (err) {
        showStatusMessage("Failed to fetch remote commits: " + err.message, "fas fa-exclamation-triangle");
    }
};


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('searchForm');
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.addEventListener('mouseover', function () {
        const query = document.querySelector('input[name="q"]').value.trim();

        if (!query) {
            submitButton.style.cursor = 'default';
        } else {
            submitButton.style.cursor = 'pointer';
        }
    });

    form.addEventListener('submit', function (event) {
        const query = document.querySelector('input[name="q"]').value.trim();

        if (!query) {
            event.preventDefault();
        }
    });

    submitButton.addEventListener('click', function (event) {
        const query = document.querySelector('input[name="q"]').value.trim();

        if (!query) {
            event.preventDefault();
        }
    });
});


function loadShortcuts() {
    const shortcutsContainer = document.querySelector('.shortcuts-container');
    shortcutsContainer.innerHTML = '';
    let shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];

    shortcuts.forEach((shortcut, index) => {
        addShortcutElement(shortcut, index);
    });

    if (shortcuts.length < 10) {
        addAddButton();
    }
}

function addShortcutElement(shortcut, index) {
    const shortcutsContainer = document.querySelector('.shortcuts-container');
    const shortcutElement = document.createElement('div');
    shortcutElement.classList.add('shortcut');

    shortcutElement.title = shortcut.url;
    shortcutElement.innerHTML = `
        <a href="${shortcut.url}" target="_self"><img src="https://www.google.com/s2/favicons?domain=${shortcut.url}&sz=256" class="shortcut-img"></a>
        <span>${shortcut.name}</span>
        <div class="shortcut-options">
            <button class="delete-button">
                <i class="fas fa-trash"></i>
            </button>
            <button class="edit-button">
                <i class="fas fa-ellipsis-v"></i>
            </button>
        </div>
    `;

    const deleteButton = shortcutElement.querySelector('.delete-button');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        openConfirmationModal(index);
    });

    const editButton = shortcutElement.querySelector('.edit-button');
    editButton.addEventListener('click', (event) => {
        event.stopPropagation();
        openShortcutModal(index, event);
    });

    shortcutsContainer.appendChild(shortcutElement);
}

function openConfirmationModal(index) {
    const modal = document.getElementById('confirmation-modal');
    const confirmButton = document.getElementById('confirm-delete');
    const cancelButton = document.getElementById('cancel-delete');

    modal.style.display = 'block';

    confirmButton.onclick = () => {
        deleteShortcut(index);
        modal.style.display = 'none';
    };

    cancelButton.onclick = () => {
        modal.style.display = 'none';
    };
}

function addAddButton() {
    const shortcutsContainer = document.querySelector('.shortcuts-container');
    const addButton = document.createElement('div');
    addButton.classList.add('shortcut', 'add-button');
    addButton.innerHTML = '+';
    addButton.onclick = () => openShortcutModal(null);
    shortcutsContainer.appendChild(addButton);
}

function openShortcutModal(index) {
    let shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
    let modal = document.getElementById('shortcut-modal');
    let nameInput = document.getElementById('shortcut-name');
    let urlInput = document.getElementById('shortcut-url');
    let saveButton = document.getElementById('save-shortcut');

    if (index !== null) {
        document.getElementById('modal-title').innerText = 'Edit Shortcut';
        nameInput.value = shortcuts[index].name;
        urlInput.value = shortcuts[index].url;
        saveButton.onclick = function () {
            editShortcut(index);
        };
    } else {
        document.getElementById('modal-title').innerText = 'Add Shortcut';
        nameInput.value = '';
        urlInput.value = '';
        saveButton.onclick = function () {
            addShortcut();
        };
    }

    modal.style.display = 'block';
}

function deleteShortcut(index) {
    let shortcuts = JSON.parse(localStorage.getItem('shortcuts'));
    shortcuts.splice(index, 1);
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    loadShortcuts();
}

document.getElementById('cancel-shortcut').onclick = function () {
    document.getElementById('shortcut-modal').style.display = 'none';
};

function addShortcut() {
    let name = document.getElementById('shortcut-name').value.trim();
    let url = document.getElementById('shortcut-url').value.trim();

    if (name && url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        let shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
        shortcuts.push({ name, url });
        localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
        document.getElementById('shortcut-modal').style.display = 'none';
        loadShortcuts();
    }
}

function editShortcut(index) {
    let shortcuts = JSON.parse(localStorage.getItem('shortcuts'));
    shortcuts[index].name = document.getElementById('shortcut-name').value;
    shortcuts[index].url = document.getElementById('shortcut-url').value;
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    document.getElementById('shortcut-modal').style.display = 'none';
    loadShortcuts();
}

function showStatusMessage(message, iconClass = 'fas fa-info-circle') {
    const statusText = document.getElementById('status-text');

    statusText.style.display = 'flex'; // make sure it's shown
    statusText.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
        <div id="status-progress"></div>
    `;
    statusText.classList.add('show');

    // After 2.5s + transition delay (buffer), hide and display:none
    setTimeout(() => {
        statusText.classList.remove('show');
        setTimeout(() => {
            statusText.style.display = 'none';
        }, 400); // match CSS transition time
    }, 2500);
}



document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('searchForm');
    const searchInput = form.querySelector('input[name="q"]');
    const submitButton = form.querySelector('button[type="submit"]');

    let savedSearchEngine = localStorage.getItem('searchEngine') || 'https://www.google.com/search?q=%s';

    submitButton.addEventListener('mouseover', function () {
        const query = searchInput.value.trim();
        submitButton.style.cursor = query ? 'pointer' : 'default';
    });

    form.addEventListener('submit', function (event) {
        const query = searchInput.value.trim();

        if (!query) {
            event.preventDefault();
            return;
        }

        event.preventDefault();

        const searchURL = savedSearchEngine.replace('%s', encodeURIComponent(query));
        window.location.href = searchURL;
    });

    submitButton.addEventListener('click', function (event) {
        const query = searchInput.value.trim();
        if (!query) {
            event.preventDefault();
        }
    });
});
