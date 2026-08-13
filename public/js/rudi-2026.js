document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        const closeMenu = () => {
            toggle.setAttribute('aria-expanded', 'false');
            mobileNav.dataset.open = 'false';
            document.body.classList.remove('nav-open');
        };

        toggle.addEventListener('click', () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!isOpen));
            mobileNav.dataset.open = String(!isOpen);
            document.body.classList.toggle('nav-open', !isOpen);
        });

        mobileNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1000) closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });
    }

    const desktopDropdowns = document.querySelectorAll('.nav-dropdown');
    desktopDropdowns.forEach((dropdown) => {
        dropdown.addEventListener('toggle', () => {
            if (!dropdown.open) return;
            desktopDropdowns.forEach((other) => {
                if (other !== dropdown) other.open = false;
            });
        });
    });

    document.addEventListener('click', (event) => {
        desktopDropdowns.forEach((dropdown) => {
            if (dropdown.open && !dropdown.contains(event.target)) dropdown.open = false;
        });
    });
});
