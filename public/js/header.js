// Shared Header Component for RUDI
document.addEventListener('DOMContentLoaded', function() {
    // Header HTML template
    const headerHTML = `
        <nav class="nav-header">
            <div class="container nav-container">
                <div class="logo">
                    <a href="/">
                        <h2 style="margin: 0; color: white; font-weight: 600;">RUDI</h2>
                    </a>
                </div>
                <ul class="nav-links">
                    <li><a href="/ai-training.html">AI Training</a></li>
                    <li><a href="/learn/">Learning Library</a></li>
                    <li><a href="/consulting.html">Consulting</a></li>
                    <li><a href="/capabilities.html">Capabilities</a></li>
                    <li><a href="/case-studies/">Case Studies</a></li>
                    <li><a href="/insights/">Insights</a></li>
                    <li><a href="/partners.html">Partners</a></li>
                    <li><a href="/about.html">About</a></li>
                </ul>
                <a href="/contact.html" class="nav-cta">Contact</a>
                <button class="mobile-menu-toggle"><i class="fas fa-bars"></i></button>
            </div>
            <div class="mobile-menu">
                <a href="/contact.html" class="mobile-cta-link">
                    <i class="fas fa-bolt"></i> Contact RUDI
                </a>
                <a href="/">Home</a>
                <a href="/ai-training.html">AI Training</a>
                <a href="/learn/">Learning Library</a>
                <a href="/consulting.html">Consulting</a>
                <a href="/capabilities.html">Capabilities</a>
                <a href="/case-studies/">Case Studies</a>
                <a href="/insights/">Insights</a>
                <a href="/partners.html">Partners</a>
                <a href="/about.html">About</a>
                <a href="/contact.html">Contact</a>
            </div>
        </nav>
    `;

    // Insert header into the page
    const headerContainer = document.getElementById('site-header');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;

        const currentPath = window.location.pathname;

        const normalizePath = (href) => {
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return null;
            }

            let path = href;

            if (path.startsWith('http')) {
                try {
                    path = new URL(path).pathname;
                } catch (e) {
                    return null;
                }
            }

            if (!path.startsWith('/')) {
                path = '/' + path.replace(/^\.\//, '');
            }

            return path;
        };

        const matchesCurrentPath = (targetPath) => {
            if (!targetPath) return false;

            if (targetPath === '/' || targetPath === '/index.html') {
                return currentPath === '/' || currentPath === '/index.html';
            }

            if (targetPath.endsWith('/')) {
                return currentPath === targetPath || currentPath.startsWith(targetPath);
            }

            if (targetPath.endsWith('/index.html')) {
                const basePath = targetPath.replace(/index\.html$/, '');
                return currentPath === targetPath || currentPath === basePath || currentPath.startsWith(basePath);
            }

            return currentPath === targetPath;
        };

        const highlightActiveLink = (selector) => {
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                const linkPath = normalizePath(link.getAttribute('href'));
                if (matchesCurrentPath(linkPath)) {
                    link.classList.add('active');
                }
            });
        };

        highlightActiveLink('.nav-links a');
        highlightActiveLink('.mobile-menu a');

        // Re-initialize mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
            });
        }
    }
});
