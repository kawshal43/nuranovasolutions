import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer" id="contact">
            <div className="footer-top">
                <p className="footer-tagline">
                    Innovative software, creative media, and digital solutions designed to bring ideas to life.
                </p>
            </div>

            <div className="footer-grid">
                {/* Quick Links */}
                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#service-page">Services</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                {/* Services */}
                <div className="footer-col">
                    <h4>Services</h4>
                    <ul>
                        <li>Software Development</li>
                        <li>Design & Creative Media</li>
                        <li>Video Production</li>
                        <li>Photography</li>
                        <li>Education & Tutorials</li>
                        <li>Product & Brand Marketing</li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li>hello@nuranova.com</li>
                        <li>+94 XXX XXX XXXX</li>
                        <li>Sri Lanka</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-brand">
                    <img src="/Logo.PNG" alt="NuraNova" className="footer-logo" />
                    <div className="footer-brand-text">
                        <span>NuraNova</span>
                        <small>SOLUTIONS</small>
                    </div>
                </div>

                <div className="footer-copyright">
                    © 2024 NuraNova Solutions. All rights reserved.
                </div>

                <div className="footer-legal">
                    Privacy Policy | Terms & Conditions
                </div>

                <div className="footer-socials">
                    <span className="social-icon">YT</span>
                    <span className="social-icon">FB</span>
                    <span className="social-icon">IG</span>
                    <span className="social-icon">LI</span>
                    <span className="social-icon">WA</span>
                </div>
            </div>
        </footer>
    );
}
