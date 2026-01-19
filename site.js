const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mainNav = document.getElementById('main-nav');

if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-controls', 'main-nav');
    mainNav.setAttribute('aria-hidden', 'true');

    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        const isOpen = mainNav.classList.contains('active');

        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        mainNav.setAttribute('aria-hidden', String(!isOpen));

        if (icon) {
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-times', isOpen);
        }
    });

    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mainNav.setAttribute('aria-hidden', 'true');

            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}
