import { useState } from "react";
import "./Contact.css";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const onChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // Demo only. Later connect EmailJS/backend.
        alert("✅ Message sent (demo).");
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <main className="contact-page landing-panel landing-contact-panel" id="contact">
            {/* soft blobs */}
            <span className="c-blob c-blob-1" />
            <span className="c-blob c-blob-2" />
            <span className="c-blob c-blob-3" />

            {/* HERO */}
            <section className="c-hero">
                <div className="c-container c-hero-grid">
                    <div className="c-hero-left">
                        <h1 className="c-title">Contact Us</h1>
                        <p className="c-subtitle">
                            Get in touch with us for any inquiries <br /> or collaborations.
                        </p>

                        <a className="c-btn" href="#get-in-touch">
                            Contact Us
                        </a>
                    </div>

                    <div className="illu-wrap">
                        <div className="illu-drift">
                            <div className="illu-float">
                                <img className="c-hero-illu" src="public/contact.png" alt="Contact illustration" />
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* MAIN GLASS WRAP */}
            <section id="get-in-touch" className="c-main">
                <div className="c-container c-wrap">
                    <div className="c-head">
                        <h2 className="c-head-title">Get in touch</h2>
                        <p className="c-head-sub">
                            We&apos;re here to answer any questions you may have
                        </p>
                    </div>

                    <div className="c-grid">
                        {/* LEFT CARD */}
                        <aside className="c-card">
                            <h3 className="c-card-title">Contact information</h3>

                            <div className="c-info">
                                <div className="c-info-row">
                                    <span className="c-ico">{icons.mail}</span>
                                    <span className="c-info-label">Email</span>
                                    <span className="c-info-value">Nuranova@gmail.com</span>
                                </div>

                                <div className="c-info-row">
                                    <span className="c-ico">{icons.phone}</span>
                                    <span className="c-info-label">Phone</span>
                                    <span className="c-info-value">+94 XXXXXX</span>
                                </div>

                                <div className="c-info-row">
                                    <span className="c-ico">{icons.pin}</span>
                                    <span className="c-info-label">Location</span>
                                    <span className="c-info-value">Colombo, Sri Lanka</span>
                                </div>
                            </div>

                            <div className="c-social">
                                <a className="c-social-pill" href="#" target="_blank" rel="noreferrer">
                                    <span className="c-social-ico">{icons.linkedin}</span>
                                    Linkedin
                                </a>

                                <a className="c-social-pill" href="#" target="_blank" rel="noreferrer">
                                    <span className="c-social-ico">{icons.github}</span>
                                    GitHub
                                </a>

                                <a className="c-social-pill" href="#" target="_blank" rel="noreferrer">
                                    <span className="c-social-ico">{icons.twitter}</span>
                                    Twitter
                                </a>
                            </div>
                        </aside>

                        {/* RIGHT CARD */}
                        <div className="c-card c-card-form">
                            <h3 className="c-card-title">Send us a message</h3>

                            <form className="c-form" onSubmit={onSubmit}>
                                <div className="c-two">
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={onChange}
                                        placeholder="Name"
                                        required
                                    />
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={onChange}
                                        placeholder="Email"
                                        type="email"
                                        required
                                    />
                                </div>

                                <input
                                    name="subject"
                                    value={form.subject}
                                    onChange={onChange}
                                    placeholder="Subject"
                                    required
                                />

                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={onChange}
                                    placeholder="Your message..."
                                    rows="6"
                                    required
                                />

                                <button className="c-send" type="submit">
                                    Send Message
                                </button>

                                <p className="c-note">We&apos;ll get back to you soon.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer is NOT here. You will render <Footer /> separately */}
        </main>
    );
}

const icons = {
    mail: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M4 6h16v12H4V6Zm1.5 1.7 6.3 4.5c.1.1.3.1.4 0l6.3-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    phone: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M6.5 3.8 9 6.3c.5.5.5 1.3 0 1.8l-1.3 1.3c1.3 2.4 3.2 4.3 5.6 5.6L14.6 14c.5-.5 1.3-.5 1.8 0l2.5 2.5c.5.5.5 1.3 0 1.8l-1.1 1.1c-.6.6-1.4.9-2.3.8-8-.8-14.3-7.1-15.1-15.1-.1-.9.2-1.7.8-2.3l1.1-1.1c.5-.5 1.3-.5 1.8 0Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    pin: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    ),
    linkedin: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M6.5 9.5V18M6.5 6.8v.4M10 9.5V18m0-4.6c0-2.2 3.5-2.4 3.5 0V18M4.5 4.5h15v15h-15v-15Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    github: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M9 19c-4 1.2-4-2-5-2m10 4v-3.2c0-.9-.3-1.5-.9-1.9 3-.3 6.2-1.4 6.2-6.2 0-1.3-.5-2.4-1.2-3.3.1-.3.5-1.6-.1-3.2 0 0-1-.3-3.3 1.2a11.2 11.2 0 0 0-6 0C6.4 2.9 5.4 3.2 5.4 3.2c-.6 1.6-.2 2.9-.1 3.2-.7.9-1.2 2-1.2 3.3 0 4.8 3.2 5.9 6.2 6.2-.4.3-.7.8-.8 1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    twitter: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M4.5 19.5 19.5 4.5M9.2 4.5h4.1l6.2 7.9v7.1h-3.3v-5.6L9.2 4.5ZM4.5 4.5h3.3l12.3 15h-3.3L4.5 4.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
};
