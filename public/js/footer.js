// Shared legacy footer component. New architecture pages use semantic inline footers.
document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('site-footer');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer>
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-section"><h4>RUDI</h4><p>AI readiness and enablement for organizations preparing to adopt and implement AI responsibly.</p></div>
                    <div class="footer-section"><h4>How We Help</h4><a href="/how-we-help/ai-readiness/">AI Readiness</a><a href="/how-we-help/ai-strategy/">AI Strategy</a><a href="/how-we-help/ai-enablement/">AI Enablement</a><a href="/how-we-help/ai-adoption/">AI Adoption</a><a href="/how-we-help/ai-implementation/">AI Implementation</a></div>
                    <div class="footer-section"><h4>Explore</h4><a href="/approach/">Approach</a><a href="/case-studies/">Case Studies</a><a href="/insights/">Insights &amp; Research</a><a href="/greater-cincinnati/">Greater Cincinnati</a></div>
                    <div class="footer-section"><h4>RUDI</h4><a href="/about.html">About</a><a href="/about.html#founder">Founder</a><a href="/about.html#partners">Partners</a><a href="/start-here/">Start Here</a><a href="/privacy.html">Privacy</a></div>
                </div>
                <div class="footer-bottom"><p>© 2026 RUDI LLC. Responsible Use of Digital Intelligence.</p></div>
            </div>
        </footer>`;
});
