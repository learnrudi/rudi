// Shared Footer Component for RUDI
document.addEventListener('DOMContentLoaded', function() {
    // Footer HTML template
    const footerHTML = `
        <footer>
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-section">
                        <h4>RUDI</h4>
                        <p>Responsible Use of Digital Intelligence. Professional AI certifications for modern professionals.</p>
                    </div>
                    <div class="footer-section">
                        <h4>Training &amp; Certifications</h4>
                        <a href="/certificates-education.html">Education Certificates</a>
                        <a href="/certificates-business.html">Business Certificates</a>
                        <a href="/framework.html">30-Point Framework</a>
                    </div>
                    <div class="footer-section">
                        <h4>Resources</h4>
                        <a href="/research.html">Research</a>
                        <a href="/resources.html">Downloads</a>
                        <a href="/prompting.html">Prompt Guide</a>
                        <a href="/ohio.html">Ohio TechCred</a>
                    </div>
                    <div class="footer-section">
                        <h4>Get Started</h4>
                        <a href="/contact.html">Contact Us</a>
                        <a href="/certificates.html">Enroll Now</a>
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
