document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.site-nav')) return;

    const primaryLinks = [
        ['/how-we-help/', 'How We Help'],
        ['/approach/', 'Approach'],
        ['/case-studies/', 'Case Studies'],
        ['/insights/', 'Insights & Research'],
        ['/greater-cincinnati/', 'Greater Cincinnati'],
        ['/about.html', 'About']
    ];

    const currentPath = window.location.pathname;
    const isCurrent = (href) => {
        if (href === '/how-we-help/') {
            return currentPath.startsWith('/how-we-help/');
        }
        if (href.endsWith('/')) return currentPath.startsWith(href);
        return currentPath === href;
    };

    const desktop = document.querySelector('.nav .nav-links');
    if (desktop) {
        desktop.innerHTML = primaryLinks.map(([href, label]) =>
            `<li><a h${'ref'}="${href}"${isCurrent(href) ? ' class="active" aria-current="page"' : ''}>${label}</a></li>`
        ).join('');
    }

    document.querySelectorAll('.nav .nav-cta').forEach((link) => {
        link.href = '/start-here/';
        link.textContent = 'Start Here';
    });

    const mobile = document.querySelector('.mobile-menu');
    if (mobile) {
        mobile.innerHTML = [
            '<a href="/start-here/" class="mobile-cta-link">Start a readiness conversation</a>',
            '<a href="/">Home</a>',
            ...primaryLinks.map(([href, label]) => `<a h${'ref'}="${href}"${isCurrent(href) ? ' class="active" aria-current="page"' : ''}>${label}</a>`)
        ].join('');

        const toggle = document.querySelector('.nav .nav-toggle');
        mobile.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobile.classList.remove('active');
                toggle?.classList.remove('active');
                toggle?.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    const footerGrid = document.querySelector('footer .footer-grid');
    if (footerGrid && !footerGrid.closest('.site-footer')) {
        footerGrid.innerHTML = `
            <div class="footer-section">
                <h4>RUDI</h4>
                <p>AI readiness and enablement for organizations preparing to adopt and implement AI responsibly.</p>
            </div>
            <div class="footer-section">
                <h4>How We Help</h4>
                <a href="/how-we-help/ai-readiness/">AI Readiness</a>
                <a href="/how-we-help/ai-strategy/">AI Strategy</a>
                <a href="/how-we-help/ai-enablement/">AI Enablement</a>
                <a href="/how-we-help/ai-adoption/">AI Adoption</a>
                <a href="/how-we-help/ai-implementation/">AI Implementation</a>
            </div>
            <div class="footer-section">
                <h4>Explore</h4>
                <a href="/approach/">Approach</a>
                <a href="/case-studies/">Case Studies</a>
                <a href="/insights/">Insights &amp; Research</a>
                <a href="/greater-cincinnati/">Greater Cincinnati</a>
            </div>
            <div class="footer-section">
                <h4>RUDI</h4>
                <a href="/about.html">About</a>
                <a href="/about.html#founder">Founder</a>
                <a href="/about.html#partners">Partners</a>
                <a href="/start-here/">Start Here</a>
                <a href="/privacy.html">Privacy</a>
            </div>`;
    }

    const footerBottom = document.querySelector('footer .footer-bottom p');
    if (footerBottom) footerBottom.textContent = '© 2026 RUDI. Responsible Use of Digital Intelligence.';

    const compactFooter = document.querySelector('footer .footer-inner');
    if (compactFooter) {
        compactFooter.innerHTML = `
            <div><strong>RUDI</strong><br>AI Readiness &amp; Enablement.</div>
            <div>
                <a href="/how-we-help/">How We Help</a>
                <a href="/approach/">Approach</a>
                <a href="/start-here/">Start Here</a>
            </div>`;
    }
});
