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

    // Shortener
    const shortenBtn = document.getElementById('shorten-btn');
    const shortenMsg = document.getElementById('shorten-msg');

    // Frame Inputs
    const frameTypeSelect = document.getElementById('frame-type');
    const frameTextGroup = document.getElementById('frame-text-group');
    const frameColorGroup = document.getElementById('frame-color-group');
    const frameTextInput = document.getElementById('frame-text');
    const frameColorInput = document.getElementById('frame-color');
    const frameColorHex = document.getElementById('frame-color-line');

    if (frameColorInput && frameColorHex) {
        frameColorInput.addEventListener('input', () => frameColorHex.value = frameColorInput.value);
        frameColorHex.addEventListener('input', () => frameColorInput.value = frameColorHex.value);
    }

    if (frameTypeSelect) {
        frameTypeSelect.addEventListener('change', () => {
            const val = frameTypeSelect.value;
            if (val === 'none') {
                frameTextGroup.style.display = 'none';
                frameColorGroup.style.display = 'none';
            } else if (val === 'scanme') {
                frameTextGroup.style.display = 'block';
                frameColorGroup.style.display = 'block';
            } else if (val === 'border' || val === 'polaroid') {
                frameTextGroup.style.display = 'none';
                frameColorGroup.style.display = 'block';
            }
        });
    }

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
        // This function is now effectively replaced by addToHistory for new items
        // but it's still called by download functions.
        // We can make it call addToHistory with current state.
        addToHistory(getQRData(), currentType);
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

        historyGrid.innerHTML = qrHistory.map((item, index) => `
            <div class="history-item" data-id="${item.id}">
                <button class="history-item-delete" data-id="${item.id}">
                    <i class="fa-solid fa-times"></i>
                </button>
                <img src="${item.thumbnail}" alt="${item.type} QR">
                <div class="history-item-type">${item.type}</div>
                <span class="history-data" contenteditable="true" data-index="${index}" title="Clic para renombrar">${item.label || item.data}</span>
            </div>
        `).join('');

        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.history-item-delete') && !e.target.closest('.history-data')) {
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

        document.querySelectorAll('.history-data').forEach(span => {
            span.addEventListener('blur', () => {
                const newLabel = span.innerText;
                const index = parseInt(span.dataset.index);
                if (qrHistory[index]) {
                    qrHistory[index].label = newLabel;
                    localStorage.setItem('qrHistory', JSON.stringify(qrHistory));
                }
            });

            // Enter key blur
            span.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
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
            case 'wifi':
                const wifiParts = item.data.match(/S:([^;]+);P:([^;]+);H:([^;]+);/);
                if (wifiParts) {
                    wifiSsid.value = wifiParts[1];
                    wifiPassword.value = wifiParts[2];
                    wifiHidden.checked = wifiParts[3] === 'true';
                }
                // Security type is not saved in the simple regex, might need more robust parsing
                break;
            case 'vcard':
                const vcardNameMatch = item.data.match(/FN:([^\n]+)/);
                const vcardOrgMatch = item.data.match(/ORG:([^\n]+)/);
                const vcardPhoneMatch = item.data.match(/TEL:([^\n]+)/);
                const vcardEmailMatch = item.data.match(/EMAIL:([^\n]+)/);
                const vcardUrlMatch = item.data.match(/URL:([^\n]+)/);
                if (vcardNameMatch) vcardName.value = vcardNameMatch[1];
                if (vcardOrgMatch) vcardOrg.value = vcardOrgMatch[1];
                if (vcardPhoneMatch) vcardPhone.value = vcardPhoneMatch[1];
                if (vcardEmailMatch) vcardEmail.value = vcardEmailMatch[1];
                if (vcardUrlMatch) vcardUrl.value = vcardUrlMatch[1];
                break;
            case 'email':
                const emailMatch = item.data.match(/mailto:([^?]+)\?subject=([^&]*)(?:&body=(.*))?/);
                if (emailMatch) {
                    emailTo.value = emailMatch[1];
                    emailSubject.value = decodeURIComponent(emailMatch[2]);
                    emailBody.value = emailMatch[3] ? decodeURIComponent(emailMatch[3]) : '';
                }
                break;
            case 'sms':
                const smsMatch = item.data.match(/sms:([^?]+)\?body=(.*)/);
                if (smsMatch) {
                    smsPhone.value = smsMatch[1];
                    smsMessage.value = decodeURIComponent(smsMatch[2]);
                }
                break;
            case 'whatsapp':
                const whatsappMatch = item.data.match(/https:\/\/wa.me\/([^?]+)\?text=(.*)/);
                if (whatsappMatch) {
                    whatsappPhone.value = whatsappMatch[1];
                    whatsappMessage.value = decodeURIComponent(whatsappMatch[2]);
                }
                break;
            case 'text':
                textContent.value = item.data;
                break;
            case 'event':
                const eventTitleMatch = item.data.match(/SUMMARY:([^\n]+)/);
                const eventLocationMatch = item.data.match(/LOCATION:([^\n]+)/);
                const eventDescriptionMatch = item.data.match(/DESCRIPTION:([^\n]+)/);
                // Date parsing would be more complex, might not fully restore
                if (eventTitleMatch) eventTitle.value = eventTitleMatch[1];
                if (eventLocationMatch) eventLocation.value = eventLocationMatch[1];
                if (eventDescriptionMatch) eventDescription.value = eventDescriptionMatch[1];
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
        } else {
            clearLogoBtn.style.display = 'none';
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
            showNotification('Historial eliminado correctamente');
        }
    }

    function showNotification(message, type = 'success', duration = 3000) {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `notification-toast ${type}`;

        const iconClass = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';

        toast.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOutDown 0.3s ease-out forwards';
            toast.addEventListener('animationend', () => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            });
        }, duration);
    }

    // --- Event Listeners ---

    // URL / Content
    urlInput.addEventListener('input', updateQR);

    // Shortener Logic (JSONP)
    if (shortenBtn) {
        shortenBtn.addEventListener('click', () => {
            const longUrl = urlInput.value;
            if (!longUrl) { showNotification("Ingresa una URL primero", "error"); return; }
            if (longUrl.includes('is.gd')) { showNotification("Esta URL ya está acortada", "error"); return; }

            shortenBtn.disabled = true;
            shortenBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            // JSONP Callback
            window.isgdCallback = function (response) {
                if (response.shorturl) {
                    urlInput.value = response.shorturl;
                    updateQR();
                    shortenMsg.style.display = 'block';
                    shortenMsg.innerText = "¡URL Acortada!";
                    setTimeout(() => shortenMsg.style.display = 'none', 3000);
                } else {
                    showNotification("Error al acortar: " + (response.errormessage || "Desconocido"), "error");
                }
                // Cleanup
                delete window.isgdCallback;
                document.body.removeChild(document.getElementById('isgd-script'));
                shortenBtn.disabled = false;
                shortenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
            };

            const script = document.createElement('script');
            script.id = 'isgd-script';
            script.src = `https://is.gd/create.php?format=json&callback=isgdCallback&url=${encodeURIComponent(longUrl)}`;
            document.body.appendChild(script);
        });
    }

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



    // --- FRAMES LOGIC ---
    async function applyFrameCanvas(sourceCanvas) {
        const type = frameTypeSelect ? frameTypeSelect.value : 'none';
        if (type === 'none') return sourceCanvas;

        const ctxSource = sourceCanvas.getContext('2d');
        const width = sourceCanvas.width;
        const height = sourceCanvas.height;
        const frameColor = frameColorInput.value;
        const frameText = frameTextInput.value.toUpperCase();

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (type === 'scanme') {
            // Add space at bottom for text
            const bottomPad = 50;
            canvas.width = width + 40; // padding sides
            canvas.height = height + 40 + bottomPad;

            // Background white
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw QR centered
            ctx.drawImage(sourceCanvas, 20, 20);

            // Draw Frame Bubble / Text Background
            ctx.fillStyle = frameColor;
            ctx.beginPath();
            // Simple rounded rect at bottom
            const rectX = 40;
            const rectY = height + 30; // 10px below QR
            const rectW = canvas.width - 80;
            const rectH = 40;
            const radius = 20;
            ctx.roundRect(rectX, rectY, rectW, rectH, radius);
            ctx.fill();

            // Text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(frameText, canvas.width / 2, rectY + (rectH / 2));

        } else if (type === 'border') {
            const borderWidth = 20;
            canvas.width = width + (borderWidth * 2);
            canvas.height = height + (borderWidth * 2);

            ctx.fillStyle = frameColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(borderWidth, borderWidth, width, height);

            ctx.drawImage(sourceCanvas, borderWidth, borderWidth);

        } else if (type === 'polaroid') {
            const padSide = 20;
            const padBottom = 80;
            canvas.width = width + (padSide * 2);
            canvas.height = height + padSide + padBottom;

            // Polaroid uses white bg, but user might want colored "paper"
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 10;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.shadowBlur = 0; // reset

            // Inner Border Color (optional) or just draw QR
            ctx.fillStyle = frameColor; // Maybe user wants a colored border inside?
            // Let's keep it simple: White polaroid, QR in middle top

            // Draw QR
            ctx.drawImage(sourceCanvas, padSide, padSide);

            // Draw Text? optional. Let's assume no text for polaroid unless we add inputs.
            // Maybe reuse frameText if user wants?
            // Ok, let's reuse frameText for polaroid caption
            if (frameTextInput.value) {
                ctx.fillStyle = '#333333';
                ctx.font = '24px "Caveat", cursive, sans-serif'; // Cursive font would be nice, defaulting to sans
                ctx.textAlign = 'center';
                ctx.fillText(frameTextInput.value, canvas.width / 2, height + padSide + (padBottom / 2) + 5);
            }
        }

        return canvas;
    }


    document.querySelectorAll('.history-data').forEach(span => {
        span.addEventListener('blur', () => {
            const newLabel = span.innerText;
            const index = parseInt(span.dataset.index);
            if (qrHistory[index]) {
                qrHistory[index].label = newLabel;
                localStorage.setItem('qrHistory', JSON.stringify(qrHistory));
            }
        });

        // Enter key blur
        span.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
        });
    });

    // --- DOWNLOADS ---
    // (Redeclarations removed)
    downloadPngBtn.addEventListener('click', async () => {
        const size = parseInt(qrSizeSelect.value);
        qrCode.update({ width: size, height: size });
        setTimeout(async () => {
            const rawCanvas = document.querySelector('#canvas canvas');
            if (!rawCanvas) return;

            const finalCanvas = await applyFrameCanvas(rawCanvas);

            // Save
            finalCanvas.toBlob(blob => {
                saveAs(blob, "prince-qr-code.png");
            });

            qrCode.update({ width: 300, height: 300 }); // Reset to preview size
            saveToHistory();
        }, 100);
    });

    downloadSvgBtn.addEventListener('click', () => {
        const size = parseInt(qrSizeSelect.value);
        qrCode.update({ width: size, height: size });
        setTimeout(() => {
            if (frameTypeSelect && frameTypeSelect.value !== 'none') {
                showNotification("Los marcos solo están disponibles en formato PNG. Se descargará el QR sin marco.", "error");
            }
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
                    const rawCanvas = document.querySelector('#canvas canvas');
                    if (!rawCanvas) return;

                    const finalCanvas = await applyFrameCanvas(rawCanvas);

                    finalCanvas.toBlob(async (blob) => {
                        if (blob) {
                            const file = new File([blob], "prince-qr.png", { type: "image/png" });
                            await navigator.share({
                                title: 'Mi Código QR',
                                text: 'Generado con Prince QR Generator',
                                files: [file]
                            });
                        }
                    });
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


    // --- MODE SWITCHING ---
    const modeBtns = document.querySelectorAll('.mode-btn');
    const generatorWrappers = {
        'generate': document.getElementById('mode-generate'),
        'scan': document.getElementById('mode-scan'),
        'bulk': document.getElementById('mode-bulk')
    };

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;

            // Update buttons
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update sections
            Object.values(generatorWrappers).forEach(el => {
                if (el) el.style.display = 'none';
            });
            if (generatorWrappers[mode]) generatorWrappers[mode].style.display = 'flex';

            // Special Init for Scanner
            if (mode === 'scan' && !scannerInitialized) {
                initScanner();
            }
        });
    });

    // --- SCANNER LOGIC ---
    let scannerInitialized = false;
    let html5QrcodeScanner = null;

    function onScanSuccess(decodedText, decodedResult) {
        // Handle the scanned code
        const resultDiv = document.getElementById('scanner-result');
        const resultText = document.getElementById('result-text');
        const openBtn = document.getElementById('open-result');

        resultDiv.style.display = 'block';
        resultText.innerText = decodedText;

        // Open button
        if (decodedText.startsWith('http')) {
            openBtn.href = decodedText;
            openBtn.style.display = 'inline-flex';
        } else {
            openBtn.style.display = 'none';
        }
        // Optional: Stop scanning functionality could be added here
    }

    function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
    }

    function initScanner() {
        if (scannerInitialized) return;

        if (document.getElementById('reader')) {
            html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false);
            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
            scannerInitialized = true;
        }

        // Copy Result
        const copyBtn = document.getElementById('copy-result');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const text = document.getElementById('result-text').innerText;
                navigator.clipboard.writeText(text).then(() => {
                    showNotification('¡Copiado!');
                });
            });
        }
    }

    // --- BULK GENERATION ---
    const bulkPrefix = document.getElementById('bulk-prefix');
    const bulkStart = document.getElementById('bulk-start');
    const bulkEnd = document.getElementById('bulk-end');
    const bulkIncludeText = document.getElementById('bulk-include-text');
    const generateBulkBtn = document.getElementById('generate-bulk-btn');
    const printBulkBtn = document.getElementById('print-bulk-btn');
    const bulkProgress = document.getElementById('bulk-progress');
    const bulkBar = document.getElementById('bulk-bar');
    const bulkCounter = document.getElementById('bulk-counter');
    const bulkTotal = document.getElementById('bulk-total');

    // Helper for bulk generation loop
    async function runBulkOperation(callback) {
        const prefix = bulkPrefix.value || "";
        const start = parseInt(bulkStart.value) || 1;
        const end = parseInt(bulkEnd.value) || 10;

        if (end < start) { showNotification('El número final debe ser mayor al inicial', 'error'); return; }
        const total = end - start + 1;

        // Limits
        const limit = 500; // General limit
        if (total > limit) { showNotification(`Límite de ${limit} QRs.`, 'error'); return; }
        if (total > 50 && !confirm(`¿Procesar ${total} QRs?`)) return;

        bulkProgress.style.display = 'block';
        bulkTotal.innerText = total;

        const originalData = qrCode._options.data; // Save state

        for (let i = 0; i < total; i++) {
            const currentNum = start + i;
            const text = `${prefix}${currentNum}`;

            // Update QR
            qrCode.update({ data: text });
            await new Promise(r => setTimeout(r, 50)); // Wait for render

            try {
                // Get canvas or blob
                // For PDF we prefer Data URL from canvas
                const canvas = document.querySelector('#canvas canvas');
                // Use callback to handle the item
                await callback(i, total, text, canvas);
            } catch (e) {
                console.error(e);
            }

            // Update UI
            bulkCounter.innerText = i + 1;
            bulkBar.style.width = `${((i + 1) / total) * 100}%`;
        }

        // Restore
        qrCode.update({ data: originalData });

        // Hide progress
        setTimeout(() => {
            bulkProgress.style.display = 'none';
            bulkBar.style.width = '0%';
        }, 1000);
    }


    if (generateBulkBtn) {
        generateBulkBtn.addEventListener('click', async () => {
            generateBulkBtn.disabled = true;
            generateBulkBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            const zip = new JSZip();
            const folder = zip.folder("codes");
            const includeText = bulkIncludeText.checked;

            await runBulkOperation(async (i, total, text, canvas) => {
                const blob = await new Promise(r => canvas.toBlob(r));
                const filename = includeText ? `${text}.png` : `qr-${i + 1}.png`;
                folder.file(filename, blob);
            });

            // Save Zip
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "prince-qr-bulk.zip");

            generateBulkBtn.disabled = false;
            generateBulkBtn.innerHTML = '<i class="fa-solid fa-gears"></i> Generar ZIP';
        });
    }

    if (printBulkBtn) {
        printBulkBtn.addEventListener('click', async () => {
            printBulkBtn.disabled = true;
            printBulkBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF(); // A4 by default

            // Grid config for A4 (210 x 297 mm)
            const cols = 3;
            const rows = 4;
            const qrSize = 50; // mm
            const xGap = (210 - (cols * qrSize)) / (cols + 1);
            const yGap = (297 - (rows * qrSize)) / (rows + 1);

            let col = 0;
            let row = 0;
            let pageAdded = false;

            await runBulkOperation(async (i, total, text, canvas) => {
                const imgData = canvas.toDataURL('image/png');

                // Calc position
                const x = xGap + (col * (qrSize + xGap));
                const y = yGap + (row * (qrSize + yGap));

                doc.addImage(imgData, 'PNG', x, y, qrSize, qrSize);

                // Add simplistic text label below QR
                doc.setFontSize(10);
                const textWidth = doc.getTextWidth(text);
                const textX = x + (qrSize / 2) - (textWidth / 2);
                doc.text(text, textX, y + qrSize + 5);

                col++;
                if (col >= cols) {
                    col = 0;
                    row++;
                    if (row >= rows) {
                        // New page
                        if (i < total - 1) { // Only add if more items coming
                            doc.addPage();
                            row = 0;
                        }
                    }
                }
            });

            doc.save("prince-qr-print.pdf");

            printBulkBtn.disabled = false;
            printBulkBtn.innerHTML = '<i class="fa-solid fa-print"></i> PDF';
        });
    }


    // --- DARK MODE ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Check saved theme
    if (localStorage.getItem('theme') === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.querySelector('i').className = 'fa-solid fa-sun';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Toggle Icon
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        });
    }

});
