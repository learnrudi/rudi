// Shared Footer Component for RUDI
document.addEventListener('DOMContentLoaded', function() {
    // Footer HTML template
    const footerHTML = `
        <footer>
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-section">
                        <h4>RUDI</h4>
                        <p>Responsible Use of Digital Intelligence. Applied AI training and workflow enablement for modern teams.</p>
                    </div>
                    <div class="footer-section">
                        <h4>Services</h4>
                        <a href="/ai-training.html">AI Training</a>
                        <a href="/ai-training/live-workflow-clinic.html">Live Workflow Clinic</a>
                        <a href="/consulting.html">Consulting</a>
                        <a href="/capabilities.html">Capabilities</a>
                    </div>
                    <div class="footer-section">
                        <h4>Resources</h4>
                        <a href="/case-studies/">Case Studies</a>
                        <a href="/insights/">Insights</a>
                        <a href="/prompting.html">Prompt Guide</a>
                        <a href="/framework.html">Framework</a>
                        <a href="/ohio.html">Ohio TechCred</a>
                    </div>
                    <div class="footer-section">
                        <h4>Company</h4>
                        <a href="/about.html">About</a>
                        <a href="/founder.html">Founder</a>
                        <a href="/partners.html">Partners</a>
                        <a href="/contact.html">Contact</a>
                        <a href="/privacy.html">Privacy</a>
                        <a href="/terms.html">Terms</a>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 RUDI. Responsible Use of Digital Intelligence.</p>
                </div>
            </div>
        </footer>
    `;

    // Insert footer into the page
    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
});
