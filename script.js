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

    // --- Initialization ---
    let currentLogo = ""; // Store current logo data URL
    const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: qrText,
        image: "",
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
            data: urlInput.value || "https://princeqr.com",
            image: currentLogo,
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

    // --- Event Listeners ---

    // URL / Content
    urlInput.addEventListener('input', () => {
        updateQR();
    });

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
        qrCode.download({ name: "prince-qr-code", extension: "png" });
    });

    downloadSvgBtn.addEventListener('click', () => {
        qrCode.download({ name: "prince-qr-code", extension: "svg" });
    });

});
