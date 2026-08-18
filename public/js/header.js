// Shared legacy header component. New architecture pages use semantic inline navigation.
document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('site-header');
    if (!headerContainer) return;

    const links = [
        ['/how-we-help/', 'How We Help'],
        ['/approach/', 'Approach'],
        ['/case-studies/', 'Case Studies'],
        ['/insights/', 'Insights & Research'],
        ['/learn/', 'Learning Library'],
        ['/greater-cincinnati/', 'Greater Cincinnati'],
        ['/about.html', 'About']
    ];

    const currentPath = window.location.pathname;
    const isCurrent = (href) => href.endsWith('/') ? currentPath.startsWith(href) : currentPath === href;

    headerContainer.innerHTML = `
        <nav class="nav-header" aria-label="Primary navigation">
            <div class="container nav-container">
                <div class="logo"><a href="/"><h2 style="margin:0;color:white;font-weight:600">RUDI</h2></a></div>
                <ul class="nav-links">
                    ${links.map(([href, label]) => `<li><a h${'ref'}="${href}"${isCurrent(href) ? ' class="active" aria-current="page"' : ''}>${label}</a></li>`).join('')}
                </ul>
                <a href="/start-here/" class="nav-cta">Start Here</a>
                <button class="mobile-menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
            </div>
            <div class="mobile-menu">
                <a href="/start-here/" class="mobile-cta-link">Start a readiness conversation</a>
                <a href="/">Home</a>
                ${links.map(([href, label]) => `<a h${'ref'}="${href}">${label}</a>`).join('')}
            </div>
        </nav>`;

    const toggle = headerContainer.querySelector('.mobile-menu-toggle');
    const menu = headerContainer.querySelector('.mobile-menu');
    toggle?.addEventListener('click', () => {
        const open = !menu.classList.contains('active');
        menu.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
    });
});
