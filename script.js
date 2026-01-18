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
    // Color Inputs - Dots
    const dotsColorInput = document.getElementById('dots-color');
    const dotsColorHex = document.getElementById('dots-color-hex');
    const dotsGradientCheck = document.getElementById('dots-gradient-check');
    const dotsGradientOptions = document.getElementById('dots-gradient-options');
    const dotsColor2Input = document.getElementById('dots-color2');
    const dotsColor2Hex = document.getElementById('dots-color2-hex');
    const dotsGradientType = document.getElementById('dots-gradient-type');
    const dotsGradientRotation = document.getElementById('dots-gradient-rotation');

    // Color Inputs - Background
    const bgColorInput = document.getElementById('bg-color');
    const bgColorHex = document.getElementById('bg-color-hex');
    const bgGradientCheck = document.getElementById('bg-gradient-check');
    const bgGradientOptions = document.getElementById('bg-gradient-options');
    const bgColor2Input = document.getElementById('bg-color2');
    const bgColor2Hex = document.getElementById('bg-color2-hex');
    const bgGradientType = document.getElementById('bg-gradient-type');
    const bgGradientRotation = document.getElementById('bg-gradient-rotation');

    // Color Inputs - Corners
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
    const shareBtn = document.getElementById('share-btn');
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

    // WhatsApp inputs
    const whatsappPhone = document.getElementById('whatsapp-phone');
    const whatsappMessage = document.getElementById('whatsapp-message');

    // Text inputs
    const textContent = document.getElementById('text-content');

    // Event inputs
    const eventTitle = document.getElementById('event-title');
    const eventLocation = document.getElementById('event-location');
    const eventStart = document.getElementById('event-start');
    const eventEnd = document.getElementById('event-end');
    const eventDescription = document.getElementById('event-description');

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
        const qrOptions = {
            data: getQRData(),
            image: currentLogo,
            qrOptions: {
                errorCorrectionLevel: "H"
            },
            dotsOptions: {
                type: dotsTypeSelect.value
            },
            backgroundOptions: {},
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
        };

        // Dots Color / Gradient Logic
        if (dotsGradientCheck.checked) {
            qrOptions.dotsOptions.gradient = {
                type: dotsGradientType.value,
                rotation: parseInt(dotsGradientRotation.value) * (Math.PI / 180), // Convert to radians if needed, or check lib docs. Lib takes radians usually? Docs say 'rotation' in number. Assuming radians or degrees?
                // Actually qr-code-styling usually takes rotation in radians for gradient. Let's check docs or safe bet. 
                // Correction: The library usually takes Radians. 0-2PI.
                // Wait, standard CSS is degrees. Let's try sending it as is first, or standard conversion.
                // Reading docs for qr-code-styling: "rotation: number" (in radians).
                rotation: (parseInt(dotsGradientRotation.value) || 0) * (Math.PI / 180),
                colorStops: [
                    { offset: 0, color: dotsColorInput.value },
                    { offset: 1, color: dotsColor2Input.value }
                ]
            };
        } else {
            qrOptions.dotsOptions.color = dotsColorInput.value;
        }

        // Background Color / Gradient Logic
        if (bgGradientCheck.checked) {
            qrOptions.backgroundOptions.gradient = {
                type: bgGradientType.value,
                rotation: (parseInt(bgGradientRotation.value) || 0) * (Math.PI / 180),
                colorStops: [
                    { offset: 0, color: bgColorInput.value },
                    { offset: 1, color: bgColor2Input.value }
                ]
            };
        } else {
            qrOptions.backgroundOptions.color = bgColorInput.value;
        }

        qrCode.update(qrOptions);
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

            case 'whatsapp':
                let waNum = whatsappPhone.value || "";
                // Cleanup number: remove +, space, -, (, )
                waNum = waNum.replace(/[\+\s\-\(\)]/g, "");
                const waMsg = encodeURIComponent(whatsappMessage.value || "");
                return `https://wa.me/${waNum}?text=${waMsg}`;

            case 'text':
                return textContent.value || "Prince QR Generator";

            case 'event':
                const title = eventTitle.value || "Evento";
                const loc = eventLocation.value || "";
                const desc = eventDescription.value || "";

                // Format dates to YYYYMMDDTHHmmSSZ
                const formatDate = (dateInput) => {
                    if (!dateInput.value) return "";
                    const d = new Date(dateInput.value);
                    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
                };

                const start = formatDate(eventStart);
                const end = formatDate(eventEnd);

                return `BEGIN:VEVENT\nSUMMARY:${title}\nLOCATION:${loc}\nDESCRIPTION:${desc}\nDTSTART:${start}\nDTEND:${end}\nEND:VEVENT`;

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

    // WhatsApp inputs
    whatsappPhone.addEventListener('input', updateQR);
    whatsappMessage.addEventListener('input', updateQR);

    // Text inputs
    textContent.addEventListener('input', updateQR);

    // Event inputs
    eventTitle.addEventListener('input', updateQR);
    eventLocation.addEventListener('input', updateQR);
    eventStart.addEventListener('change', updateQR);
    eventEnd.addEventListener('change', updateQR);
    eventDescription.addEventListener('input', updateQR);

    // Colors
    // Colors - Logic
    dotsColorInput.addEventListener('input', () => syncColorToHex(dotsColorInput, dotsColorHex));
    dotsColorHex.addEventListener('input', () => syncHexToColor(dotsColorHex, dotsColorInput));

    // Gradient Dots Listeners
    dotsGradientCheck.addEventListener('change', () => {
        dotsGradientOptions.style.display = dotsGradientCheck.checked ? 'block' : 'none';
        updateQR();
    });
    dotsColor2Input.addEventListener('input', () => syncColorToHex(dotsColor2Input, dotsColor2Hex));
    dotsColor2Hex.addEventListener('input', () => syncHexToColor(dotsColor2Hex, dotsColor2Input));
    dotsGradientType.addEventListener('change', updateQR);
    dotsGradientRotation.addEventListener('input', updateQR);

    // BG Colors
    bgColorInput.addEventListener('input', () => syncColorToHex(bgColorInput, bgColorHex));
    bgColorHex.addEventListener('input', () => syncHexToColor(bgColorHex, bgColorInput));

    // Gradient BG Listeners
    bgGradientCheck.addEventListener('change', () => {
        bgGradientOptions.style.display = bgGradientCheck.checked ? 'block' : 'none';
        updateQR();
    });
    bgColor2Input.addEventListener('input', () => syncColorToHex(bgColor2Input, bgColor2Hex));
    bgColor2Hex.addEventListener('input', () => syncHexToColor(bgColor2Hex, bgColor2Input));
    bgGradientType.addEventListener('change', updateQR);
    bgGradientRotation.addEventListener('input', updateQR);

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

    // Share Button Logic
    if (navigator.share) {
        shareBtn.style.display = 'flex';
        shareBtn.addEventListener('click', async () => {
            // Generate Blob
            const size = 1024; // Good quality for sharing
            qrCode.update({ width: size, height: size });

            // Wait for update
            setTimeout(async () => {
                try {
                    const blob = await qrCode.getRawData('png');
                    if (blob) {
                        const file = new File([blob], "prince-qr.png", { type: "image/png" });
                        await navigator.share({
                            title: 'Mi Código QR',
                            text: 'Generado con Prince QR Generator',
                            files: [file]
                        });
                    }
                } catch (err) {
                    console.error('Error sharing:', err);
                } finally {
                    qrCode.update({ width: 300, height: 300 }); // Reset preview
                }
            }, 100);
        });
    }

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
