document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    let qrText = "https://princeqr.com";

    // Default Prince Palette
    const defaultColors = {
        dots: "#000000",
        bg: "#ffffff",
        corners: "#000000"
    };

    // --- DOM Elements ---
    const urlInput = document.getElementById('url-input');
    const qrCanvasContainer = document.getElementById('canvas');

    // Color Inputs
    const dotsColorInput = document.getElementById('dots-color');
    const dotsColorHex = document.getElementById('dots-color-hex');
    const bgColorInput = document.getElementById('bg-color');
    const bgColorHex = document.getElementById('bg-color-hex');
    const cornersColorInput = document.getElementById('corners-square-color');
    const cornersColorHex = document.getElementById('corners-square-color-hex');

    // Shape Inputs
    const dotsTypeSelect = document.getElementById('dots-type');
    const cornersTypeSelect = document.getElementById('corners-type');

    // Logo Inputs
    const logoInput = document.getElementById('logo-input');
    const clearLogoBtn = document.getElementById('clear-logo-btn');
    const logoHideBgCheckbox = document.getElementById('logo-hide-bg');

    // Buttons
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const themeBtns = document.querySelectorAll('.theme-btn');

    // QR Type Elements
    const typeTabs = document.querySelectorAll('.type-tab');
    const qrForms = document.querySelectorAll('.qr-form');

    // WiFi inputs
    const wifiSsid = document.getElementById('wifi-ssid');
    const wifiPassword = document.getElementById('wifi-password');
    const wifiSecurity = document.getElementById('wifi-security');
    const wifiHidden = document.getElementById('wifi-hidden');

    // vCard inputs
    const vcardName = document.getElementById('vcard-name');
    const vcardOrg = document.getElementById('vcard-org');
    const vcardPhone = document.getElementById('vcard-phone');
    const vcardEmail = document.getElementById('vcard-email');
    const vcardUrl = document.getElementById('vcard-url');

    // Email inputs
    const emailTo = document.getElementById('email-to');
    const emailSubject = document.getElementById('email-subject');
    const emailBody = document.getElementById('email-body');

    // SMS inputs
    const smsPhone = document.getElementById('sms-phone');
    const smsMessage = document.getElementById('sms-message');

    // --- State ---
    let currentType = 'url';
    let qrHistory = [];

    // History Elements
    const historyGrid = document.getElementById('history-grid');
    const historyCount = document.querySelector('.history-count');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // Export Options
    const qrSizeSelect = document.getElementById('qr-size');

    // --- Initialization ---
    let currentLogo = ""; // Store current logo data URL
    const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "canvas", // Using canvas to enable history thumbnails
        data: qrText,
        image: "",
        qrOptions: {
            errorCorrectionLevel: "H" // Fixed high level for better reliability with logos
        },
        dotsOptions: {
            color: defaultColors.dots,
            type: "square"
        },
        backgroundOptions: {
            color: defaultColors.bg,
        },
        cornersSquareOptions: {
            color: defaultColors.corners,
            type: "square"
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 10,
            imageSize: 0.4,
            hideBackgroundDots: true
        }
    });

    // Initial Render
    qrCode.append(qrCanvasContainer);

    // --- Functions ---

    function updateQR() {
        qrCode.update({
            data: getQRData(),
            image: currentLogo,
            qrOptions: {
                errorCorrectionLevel: "H" // Fixed high level for better reliability with logos
            },
            dotsOptions: {
                color: dotsColorInput.value,
                type: dotsTypeSelect.value
            },
            backgroundOptions: {
                color: bgColorInput.value,
            },
            cornersSquareOptions: {
                color: cornersColorInput.value,
                type: cornersTypeSelect.value
            },
            cornersDotOptions: {
                color: cornersColorInput.value,
                type: cornersTypeSelect.value === 'square' ? 'square' : 'dot'
            },
            imageOptions: {
                hideBackgroundDots: logoHideBgCheckbox.checked
            }
        });
    }

    function syncHexToColor(hexInput, colorInput) {
        let hex = hexInput.value;
        if (hex.startsWith('#') && (hex.length === 4 || hex.length === 7)) {
            colorInput.value = hex;
            updateQR();
        }
    }

    function syncColorToHex(colorInput, hexInput) {
        hexInput.value = colorInput.value;
        updateQR();
    }

    // --- QR Data Formatters ---

    function getQRData() {
        switch (currentType) {
            case 'url':
                return urlInput.value || "https://princeqr.com";

            case 'wifi':
                const security = wifiSecurity.value;
                const ssid = wifiSsid.value || "";
                const password = wifiPassword.value || "";
                const hidden = wifiHidden.checked ? "true" : "false";
                return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;

            case 'vcard':
                const name = vcardName.value || "";
                const org = vcardOrg.value || "";
                const phone = vcardPhone.value || "";
                const email = vcardEmail.value || "";
                const url = vcardUrl.value || "";
                return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${org}\nTEL:${phone}\nEMAIL:${email}\nURL:${url}\nEND:VCARD`;

            case 'email':
                const to = emailTo.value || "";
                const subject = encodeURIComponent(emailSubject.value || "");
                const body = encodeURIComponent(emailBody.value || "");
                return `mailto:${to}?subject=${subject}&body=${body}`;

            case 'sms':
                const smsNum = smsPhone.value || "";
                const msg = encodeURIComponent(smsMessage.value || "");
                return `sms:${smsNum}?body=${msg}`;

            default:
                return urlInput.value || "https://princeqr.com";
        }
    }

    // --- History Management ---

    function loadHistory() {
        const saved = localStorage.getItem('qrHistory');
        qrHistory = saved ? JSON.parse(saved) : [];
        displayHistory();
    }

    function saveToHistory() {
        const canvas = qrCanvasContainer.querySelector('canvas');
        if (!canvas) return;

        const thumbnail = canvas.toDataURL('image/png');

        const historyItem = {
            id: Date.now(),
            type: currentType,
            data: getQRData(),
            colors: {
                dots: dotsColorInput.value,
                bg: bgColorInput.value,
                corners: cornersColorInput.value
            },
            shapes: {
                dots: dotsTypeSelect.value,
                corners: cornersTypeSelect.value
            },
            logo: currentLogo,
            thumbnail: thumbnail
        };

        qrHistory.unshift(historyItem);

        if (qrHistory.length > 20) {
            qrHistory = qrHistory.slice(0, 20);
        }

        localStorage.setItem('qrHistory', JSON.stringify(qrHistory));
        displayHistory();
    }

    function displayHistory() {
        if (qrHistory.length === 0) {
            historyGrid.innerHTML = '<p class="empty-history">No hay QRs guardados aún. Los QRs se guardan automáticamente al generarlos.</p>';
            historyCount.textContent = '0 QRs guardados';
            clearHistoryBtn.style.display = 'none';
            return;
        }

        historyCount.textContent = `${qrHistory.length} QR${qrHistory.length > 1 ? 's' : ''} guardado${qrHistory.length > 1 ? 's' : ''}`;
        clearHistoryBtn.style.display = 'inline-flex';

        historyGrid.innerHTML = qrHistory.map(item => `
            <div class="history-item" data-id="${item.id}">
                <button class="history-item-delete" data-id="${item.id}">
                    <i class="fa-solid fa-times"></i>
                </button>
                <img src="${item.thumbnail}" alt="${item.type} QR">
                <div class="history-item-type">${item.type}</div>
            </div>
        `).join('');

        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.history-item-delete')) {
                    loadFromHistory(parseInt(item.dataset.id));
                }
            });
        });

        document.querySelectorAll('.history-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteFromHistory(parseInt(btn.dataset.id));
            });
        });
    }

    function loadFromHistory(id) {
        const item = qrHistory.find(h => h.id === id);
        if (!item) return;

        currentType = item.type;
        typeTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.type === item.type);
        });
        qrForms.forEach(form => {
            form.style.display = form.id === `form-${item.type}` ? 'block' : 'none';
        });

        switch (item.type) {
            case 'url':
                urlInput.value = item.data;
                break;
        }

        dotsColorInput.value = item.colors.dots;
        dotsColorHex.value = item.colors.dots;
        bgColorInput.value = item.colors.bg;
        bgColorHex.value = item.colors.bg;
        cornersColorInput.value = item.colors.corners;
        cornersColorHex.value = item.colors.corners;

        dotsTypeSelect.value = item.shapes.dots;
        cornersTypeSelect.value = item.shapes.corners;

        currentLogo = item.logo || "";
        if (currentLogo) {
            clearLogoBtn.style.display = 'inline-flex';
        }

        updateQR();
    }

    function deleteFromHistory(id) {
        qrHistory = qrHistory.filter(h => h.id !== id);
        localStorage.setItem('qrHistory', JSON.stringify(qrHistory));
        displayHistory();
    }

    function clearAllHistory() {
        if (confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
            qrHistory = [];
            localStorage.removeItem('qrHistory');
            displayHistory();
        }
    }

    // --- Event Listeners ---

    // URL / Content
    urlInput.addEventListener('input', updateQR);

    // Type Switching
    typeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.dataset.type;

            // Update active tab
            typeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding form
            qrForms.forEach(form => form.style.display = 'none');
            document.getElementById(`form-${type}`).style.display = 'block';

            // Update current type
            currentType = type;

            // Update QR
            updateQR();
        });
    });

    // WiFi inputs
    wifiSsid.addEventListener('input', updateQR);
    wifiPassword.addEventListener('input', updateQR);
    wifiSecurity.addEventListener('change', updateQR);
    wifiHidden.addEventListener('change', updateQR);

    // vCard inputs
    vcardName.addEventListener('input', updateQR);
    vcardOrg.addEventListener('input', updateQR);
    vcardPhone.addEventListener('input', updateQR);
    vcardEmail.addEventListener('input', updateQR);
    vcardUrl.addEventListener('input', updateQR);

    // Email inputs
    emailTo.addEventListener('input', updateQR);
    emailSubject.addEventListener('input', updateQR);
    emailBody.addEventListener('input', updateQR);

    // SMS inputs
    smsPhone.addEventListener('input', updateQR);
    smsMessage.addEventListener('input', updateQR);

    // Colors
    dotsColorInput.addEventListener('input', () => syncColorToHex(dotsColorInput, dotsColorHex));
    dotsColorHex.addEventListener('input', () => syncHexToColor(dotsColorHex, dotsColorInput));

    bgColorInput.addEventListener('input', () => syncColorToHex(bgColorInput, bgColorHex));
    bgColorHex.addEventListener('input', () => syncHexToColor(bgColorHex, bgColorInput));

    cornersColorInput.addEventListener('input', () => syncColorToHex(cornersColorInput, cornersColorHex));
    cornersColorHex.addEventListener('input', () => syncHexToColor(cornersColorHex, cornersColorInput));

    // Shapes
    dotsTypeSelect.addEventListener('change', updateQR);
    cornersTypeSelect.addEventListener('change', updateQR);

    // Logo
    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentLogo = e.target.result;
                updateQR();
                clearLogoBtn.style.display = 'inline-flex';
            }
            reader.readAsDataURL(file);
        }
    });

    clearLogoBtn.addEventListener('click', () => {
        currentLogo = "";
        logoInput.value = "";
        updateQR();
        clearLogoBtn.style.display = 'none';
    });

    logoHideBgCheckbox.addEventListener('change', updateQR);

    // Presets / Themes
    themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dots = btn.dataset.dots;
            const bg = btn.dataset.bg;
            const corners = btn.dataset.corners;

            // Update Inputs
            dotsColorInput.value = dots;
            dotsColorHex.value = dots;

            bgColorInput.value = bg;
            bgColorHex.value = bg;

            cornersColorInput.value = corners;
            cornersColorHex.value = corners;

            updateQR();
        });
    });

    // Accordion
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;

            // Toggle current
            header.classList.toggle('active');
            content.classList.toggle('open');

            // Rotate icon
            const icon = header.querySelector('.fa-chevron-down');
            if (content.classList.contains('open')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // Downloads
    downloadPngBtn.addEventListener('click', () => {
        const size = parseInt(qrSizeSelect.value);
        qrCode.update({ width: size, height: size });
        setTimeout(() => {
            qrCode.download({ name: "prince-qr-code", extension: "png" });
            qrCode.update({ width: 300, height: 300 }); // Reset to preview size
            saveToHistory();
        }, 100);
    });

    downloadSvgBtn.addEventListener('click', () => {
        const size = parseInt(qrSizeSelect.value);
        qrCode.update({ width: size, height: size });
        setTimeout(() => {
            qrCode.download({ name: "prince-qr-code", extension: "svg" });
            qrCode.update({ width: 300, height: 300 }); // Reset to preview size
            saveToHistory();
        }, 100);
    });



    // History
    clearHistoryBtn.addEventListener('click', clearAllHistory);

    // Initialize history on page load
    loadHistory();

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

});
