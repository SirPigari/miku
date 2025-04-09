const nudeModeToggle = document.getElementById('nudeModeToggle');
const enableBackgroundToggle = document.getElementById('enableBackgroundToggle');
const defaultImageSelect = document.getElementById('defaultImageSelect');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');

window.onload = function () {
    const savedNudeMode = localStorage.getItem('nudeMode') === 'true';
    const savedBackgroundEnabled = localStorage.getItem('backgroundEnabled') === 'true';
    const savedDefaultImage = localStorage.getItem('defaultImage') || savedNudeMode ? 'miku_nude_4.png' : 'miku_normal_4.png';
    
    populateImageOptions(savedNudeMode);

    defaultImageSelect.value = savedDefaultImage;
    nudeModeToggle.checked = savedNudeMode;
    enableBackgroundToggle.checked = savedBackgroundEnabled;

    updateStatus();
};

saveBtn.addEventListener('click', () => {
    localStorage.setItem('nudeMode', nudeModeToggle.checked);
    localStorage.setItem('backgroundEnabled', enableBackgroundToggle.checked);
    localStorage.setItem('defaultImage', defaultImageSelect.value);

    updateStatus();
    updateBackgroundMode();
});

resetBtn.addEventListener('click', () => {
    localStorage.removeItem('nudeMode');
    localStorage.removeItem('backgroundEnabled');

    nudeModeToggle.checked = false;
    enableBackgroundToggle.checked = true;

    updateStatus();

    updateBackgroundMode();
});

function updateStatus() {
    const nudeModeStatus = nudeModeToggle.checked ? 'Enabled' : 'Disabled';
    const backgroundStatus = enableBackgroundToggle.checked ? 'Enabled' : 'Disabled';

    statusText.textContent = `Nude Mode: ${nudeModeStatus}, Background Image: ${backgroundStatus}, Default Image: ${localStorage.getItem('defaultImage')}`;
    populateImageOptions(nudeModeToggle.checked);
}

function updateBackgroundMode() {
    if (enableBackgroundToggle.checked) {
        localStorage.setItem('nudeMode', nudeModeToggle.checked);
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#fff';
    }
}

function populateImageOptions(isNudeMode) {
    defaultImageSelect.innerHTML = '';

    const images = isNudeMode ? [
        'none',
        'miku_nude_1.png',
        'miku_nude_2.png',
        'miku_nude_3.png',
        'miku_nude_4.png'
    ] : [
        'none',
        'miku_normal_1.png',
        'miku_normal_2.png',
        'miku_normal_3.png',
        'miku_normal_4.png'
    ];

    images.forEach(image => {
        const option = document.createElement('option');
        option.value = image;
        option.textContent = image;
        defaultImageSelect.appendChild(option);
    });

    const savedDefaultImage = localStorage.getItem('defaultImage') || (isNudeMode ? 'miku_nude_4.png' : 'miku_normal_4.png');
    defaultImageSelect.value = savedDefaultImage;
}