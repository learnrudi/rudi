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
                    <li class="nav-dropdown">
                        <span class="nav-dropdown-trigger">Certifications <i class="fas fa-chevron-down" style="font-size: 0.7em; margin-left: 4px;"></i></span>
                        <ul class="dropdown-menu">
                            <li><a href="/certificates-business.html">Business</a></li>
                            <li><a href="/certificates-education.html">Education</a></li>
                        </ul>
                    </li>
                    <li><a href="/framework.html">Framework</a></li>
                    <li><a href="/ohio.html">Ohio</a></li>
                    <li><a href="/webinars/">Learning Labs</a></li>
                    <li><a href="/prompting.html">Prompting</a></li>
                    <li><a href="/about.html">About</a></li>
                    <li><a href="/research.html">Research</a></li>
                    <li><a href="/resources.html">Resources</a></li>
                </ul>
                <a href="/framework.html" class="nav-cta">Free Assessment</a>
                <button class="mobile-menu-toggle"><i class="fas fa-bars"></i></button>
            </div>
            <div class="mobile-menu">
                <a href="/framework.html" class="mobile-cta-link">
                    <i class="fas fa-bolt"></i> Free AI Assessment
                </a>
                <a href="/">Home</a>
                <a href="/certificates-business.html">Business Certificates</a>
                <a href="/certificates-education.html">Education Certificates</a>
                <a href="/framework.html">Framework</a>
                <a href="/ohio.html">Ohio</a>
                <a href="/webinars/">Learning Labs</a>
                <a href="/prompting.html">Prompting</a>
                <a href="/about.html">About</a>
                <a href="/research.html">Research</a>
                <a href="/resources.html">Resources</a>
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
