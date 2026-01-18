document.addEventListener('DOMContentLoaded', () => {
    
    // --- Configuration ---
    let qrText = "https://princeqr.com";
    
    // Default Prince Palette
    const defaultColors = {
        dots: "#1C2B4B",
        bg: "#ffffff",
        corners: "#1399AB"
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
    
    // Buttons
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const colorPresets = document.querySelectorAll('.color-preset');

    // --- Initialization ---
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
            margin: 20
        }
    });

    // Initial Render
    qrCode.append(qrCanvasContainer);

    // --- Functions ---
    
    function updateQR() {
        qrCode.update({
            data: urlInput.value || "https://princeqr.com",
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
            // Note: For full consistency, we should also update cornersDotOptions if we want them to match the square color
            cornersDotOptions: {
                color: cornersColorInput.value,
                type: cornersTypeSelect.value === 'square' ? 'square' : 'dot' // simplified mapping
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

    // Presets
    colorPresets.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.target.dataset.color;
            // Apply preset to Dots & Corners for a quick theme match, keep BG white
            dotsColorInput.value = color;
            dotsColorHex.value = color;
            
            // Just for variety, let's keep corners same or complimentary. 
            // For simplicity, let's set dots to the preset.
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
            if(content.classList.contains('open')){
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
