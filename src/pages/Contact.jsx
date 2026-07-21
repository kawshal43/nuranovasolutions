import { useEffect, useRef, useState } from "react";
import "./Contact.css";

const CONTACT_EMAIL = "nuranovasolutions@gmail.com";
const CONTACT_PHONE_DISPLAY = "+94 78 294 0117";
const CONTACT_PHONE_HREF = "+94782940117";
const CONTACT_WHATSAPP_HREF = "https://wa.me/94782940117";
const CONTACT_LOCATION_HREF = "https://www.google.com/maps/search/?api=1&query=Colombo%2C%20Sri%20Lanka";
const CONTACT_LOCATION = "Colombo, Sri Lanka";

function ContactHeroIllustration() {
    return (
        <svg
            aria-labelledby="contact-hero-title contact-hero-desc"
            className="c-hero-illu"
            role="img"
            viewBox="0 0 560 400"
        >
            <title id="contact-hero-title">Contact support illustration</title>
            <desc id="contact-hero-desc">A glass-style contact illustration with a floating support card, message panels, a paper plane, and soft animated badges.</desc>
            <defs>
                <linearGradient id="heroGlassShell" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#203454" stopOpacity="0.82" />
                    <stop offset="100%" stopColor="#0b1730" stopOpacity="0.72" />
                </linearGradient>
                <linearGradient id="heroGlassInner" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#263f69" stopOpacity="0.54" />
                    <stop offset="100%" stopColor="#101c38" stopOpacity="0.42" />
                </linearGradient>
                <linearGradient id="heroAccentBlue" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#8cc3ff" />
                    <stop offset="100%" stopColor="#6287ff" />
                </linearGradient>
                <linearGradient id="heroAccentSoft" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#90dbff" />
                    <stop offset="100%" stopColor="#64b8ff" />
                </linearGradient>
                <linearGradient id="heroAccentMint" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#9ef3e3" />
                    <stop offset="100%" stopColor="#63d6c2" />
                </linearGradient>
                <linearGradient id="heroAccentPink" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff9ec0" />
                    <stop offset="100%" stopColor="#ff749e" />
                </linearGradient>
                <linearGradient id="heroPlane" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#8bc8ff" />
                    <stop offset="100%" stopColor="#5e86ff" />
                </linearGradient>
                <linearGradient id="heroBadgeBlue" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#98bcff" />
                    <stop offset="100%" stopColor="#6784ff" />
                </linearGradient>
                <linearGradient id="heroBadgePink" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffa6c5" />
                    <stop offset="100%" stopColor="#ff789f" />
                </linearGradient>
                <filter id="heroShadow" colorInterpolationFilters="sRGB" x="-40%" y="-40%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="20" floodColor="#102241" floodOpacity="0.18" stdDeviation="14" />
                </filter>
                <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="22" />
                </filter>
            </defs>

            <circle className="hero-orb hero-orb-a" cx="226" cy="176" r="84" fill="#6f96ff" fillOpacity="0.16" filter="url(#heroGlow)" />
            <circle className="hero-orb hero-orb-b" cx="396" cy="124" r="72" fill="#ff9fca" fillOpacity="0.1" filter="url(#heroGlow)" />
            <circle className="hero-orb hero-orb-c" cx="386" cy="290" r="80" fill="#6bded6" fillOpacity="0.09" filter="url(#heroGlow)" />

            <g className="hero-layer hero-layer-main" filter="url(#heroShadow)">
                <rect x="176" y="92" width="252" height="190" rx="36" fill="url(#heroGlassShell)" stroke="#d9e6ff" strokeOpacity="0.26" strokeWidth="2" />
                <rect x="184" y="100" width="236" height="174" rx="30" fill="url(#heroGlassInner)" stroke="#d9e6ff" strokeOpacity="0.12" strokeWidth="1.5" />
                <rect x="216" y="122" width="84" height="28" rx="14" fill="url(#heroAccentBlue)" fillOpacity="0.9" />
                <rect x="316" y="126" width="74" height="10" rx="5" fill="#d8e8ff" fillOpacity="0.9" />
                <rect x="316" y="144" width="52" height="8" rx="4" fill="#d8e8ff" fillOpacity="0.56" />
                <rect x="214" y="164" width="132" height="52" rx="18" fill="url(#heroAccentBlue)" fillOpacity="0.74" />
                <rect x="236" y="182" width="84" height="10" rx="5" fill="#f3f8ff" fillOpacity="0.92" />
                <rect x="236" y="200" width="60" height="8" rx="4" fill="#dbe7ff" fillOpacity="0.7" />
                <rect x="282" y="228" width="108" height="38" rx="16" fill="url(#heroAccentSoft)" fillOpacity="0.26" />
                <rect x="222" y="236" width="44" height="10" rx="5" fill="#dbe7ff" fillOpacity="0.54" />
                <rect x="222" y="254" width="70" height="10" rx="5" fill="#dbe7ff" fillOpacity="0.34" />
            </g>

            <g className="hero-layer hero-layer-plane" filter="url(#heroShadow)">
                <path d="M286 248 438 286 340 338 314 302 272 294Z" fill="url(#heroPlane)" fillOpacity="0.9" />
                <path d="M286 248 340 338" fill="none" stroke="#d8ecff" strokeLinecap="round" strokeWidth="5" strokeOpacity="0.8" />
                <path d="M314 302 438 286" fill="none" stroke="#d8ecff" strokeLinecap="round" strokeWidth="5" strokeOpacity="0.8" />
            </g>

            <g className="hero-layer hero-layer-badge-a" filter="url(#heroShadow)">
                <circle cx="176" cy="214" r="20" fill="url(#heroAccentMint)" fillOpacity="0.92" />
                <path d="M176 194v24M164 206h24" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" />
            </g>

            <g className="hero-layer hero-layer-badge-b" filter="url(#heroShadow)">
                <circle cx="438" cy="120" r="27" fill="url(#heroBadgeBlue)" fillOpacity="0.94" />
                <circle cx="438" cy="112" r="9" fill="#ffffff" fillOpacity="0.96" />
                <path d="M425 133c3-7 8-10 13-10s10 3 13 10" fill="#ffffff" fillOpacity="0.96" />
            </g>

            <g className="hero-layer hero-layer-badge-c" filter="url(#heroShadow)">
                <circle cx="146" cy="290" r="21" fill="url(#heroBadgePink)" fillOpacity="0.9" />
                <path d="M136 290h20M136 298h14" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="4.5" strokeOpacity="0.96" />
            </g>

            <path className="hero-layer hero-layer-trail-a" d="M182 116c7-3 13-8 16-15" fill="none" stroke="#ff9f70" strokeLinecap="round" strokeWidth="6.5" strokeOpacity="0.9" />
            <path className="hero-layer hero-layer-trail-b" d="M454 214c9 2 15 7 20 13" fill="none" stroke="#7ea2ff" strokeLinecap="round" strokeWidth="6" strokeOpacity="0.92" />
            <path className="hero-layer hero-layer-trail-c" d="M444 320c-9-2-15-7-20-14" fill="none" stroke="#7ea2ff" strokeLinecap="round" strokeWidth="6" strokeOpacity="0.88" />

            <g className="hero-layer hero-layer-dots" opacity="0.84">
                <circle cx="206" cy="100" r="4" fill="#ff7ea7" />
                <circle cx="220" cy="92" r="5" fill="#7ef0d7" />
                <circle cx="414" cy="104" r="5" fill="#ff7ea7" />
                <circle cx="466" cy="252" r="5" fill="#7ef0d7" />
                <circle cx="224" cy="312" r="4" fill="#ffa2bd" />
                <circle cx="344" cy="342" r="4" fill="#ff7ea7" />
            </g>
        </svg>
    );
}

export default function Contact() {
    const heroTitleText = "Contact Us";
    const heroSubtitleLineOne = "Get in touch with us for any";
    const heroSubtitleLineTwo = "inquiries or collaborations.";
    const heroButtonText = "Contact Us";
    const socialLinks = [
        {
            href: CONTACT_WHATSAPP_HREF,
            icon: icons.whatsapp,
            label: "WhatsApp",
        },
        {
            href: "https://www.linkedin.com/in/nuranova-solutions-b791403b4/",
            icon: icons.linkedin,
            label: "LinkedIn",
        },
        {
            href: "https://github.com/nuranova-solutions",
            icon: icons.github,
            label: "GitHub",
        },
    ];

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [comments, setComments] = useState([
        {
            id: 1,
            author: "Amara Thennakoon",
            time: "4 hours ago",
            text: "This is a great initiative! Looking forward to collaborating with you.",
            likes: 0,
            replies: [],
        },
    ]);
    const [newComment, setNewComment] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyDrafts, setReplyDrafts] = useState({});
    const [likeAnimations, setLikeAnimations] = useState({});
    const [typedHeroTitle, setTypedHeroTitle] = useState("");
    const [typedHeroLineOne, setTypedHeroLineOne] = useState("");
    const [typedHeroLineTwo, setTypedHeroLineTwo] = useState("");
    const [typedHeroButton, setTypedHeroButton] = useState("");
    const [isHeroButtonVisible, setIsHeroButtonVisible] = useState(false);
    const [shouldStartHeroTyping, setShouldStartHeroTyping] = useState(false);
    const likeTimersRef = useRef(new Map());
    const heroTypingHostRef = useRef(null);

    const onChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        // Demo only. Later connect EmailJS/backend.
        alert("Message sent (demo).");
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    const addComment = () => {
        const text = newComment.trim();
        if (!text) return;

        setComments((prev) => [
            ...prev,
            {
                id: Date.now(),
                author: "Guest",
                time: "Just now",
                text,
                likes: 0,
                replies: [],
            },
        ]);
        setNewComment("");
    };

    const onCommentSubmit = (e) => {
        e.preventDefault();
        addComment();
    };

    const triggerLikeAnimation = (id) => {
        const existingTimer = likeTimersRef.current.get(id);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        setLikeAnimations((prev) => ({ ...prev, [id]: true }));

        const timer = window.setTimeout(() => {
            setLikeAnimations((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            likeTimersRef.current.delete(id);
        }, 520);

        likeTimersRef.current.set(id, timer);
    };

    const likeComment = (id) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === id
                    ? { ...comment, likes: comment.likes + 1 }
                    : comment
            )
        );
        triggerLikeAnimation(id);
    };

    const toggleReply = (id) => {
        setActiveReplyId((current) => (current === id ? null : id));
    };

    const updateReplyDraft = (id, value) => {
        setReplyDrafts((prev) => ({ ...prev, [id]: value }));
    };

    const submitReply = (id) => {
        const text = (replyDrafts[id] || "").trim();
        if (!text) return;

        setComments((prev) =>
            prev.map((comment) =>
                comment.id === id
                    ? {
                        ...comment,
                        replies: [
                            ...(comment.replies || []),
                            {
                                id: Date.now(),
                                author: "Guest",
                                time: "Just now",
                                text,
                            },
                        ],
                    }
                    : comment
            )
        );
        setReplyDrafts((prev) => ({ ...prev, [id]: "" }));
        setActiveReplyId(null);
    };

    const onReplySubmit = (e, id) => {
        e.preventDefault();
        submitReply(id);
    };

    useEffect(() => {
        const likeTimers = likeTimersRef.current;

        return () => {
            likeTimers.forEach((timer) => clearTimeout(timer));
            likeTimers.clear();
        };
    }, []);

    useEffect(() => {
        if (shouldStartHeroTyping) {
            return undefined;
        }

        const node = heroTypingHostRef.current;
        if (!node) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry?.isIntersecting) {
                    setShouldStartHeroTyping(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.35,
                rootMargin: "0px 0px -12% 0px",
            }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [shouldStartHeroTyping]);

    useEffect(() => {
        if (!shouldStartHeroTyping) {
            return undefined;
        }

        let cancelled = false;
        const timers = [];

        timers.push(
            window.setTimeout(() => {
                if (!cancelled) {
                    setTypedHeroTitle("");
                    setTypedHeroLineOne("");
                    setTypedHeroLineTwo("");
                    setTypedHeroButton("");
                    setIsHeroButtonVisible(false);
                }
            }, 0)
        );

        const queueTyping = (text, setter, startAt, speed) => {
            for (let i = 1; i <= text.length; i += 1) {
                timers.push(
                    window.setTimeout(() => {
                        if (!cancelled) {
                            setter(text.slice(0, i));
                        }
                    }, startAt + i * speed)
                );
            }

            return startAt + text.length * speed;
        };

        let cursor = 140;
        cursor = queueTyping(heroTitleText, setTypedHeroTitle, cursor, 56);
        cursor += 180;
        cursor = queueTyping(heroSubtitleLineOne, setTypedHeroLineOne, cursor, 26);
        cursor += 120;
        cursor = queueTyping(heroSubtitleLineTwo, setTypedHeroLineTwo, cursor, 26);
        cursor += 160;

        timers.push(
            window.setTimeout(() => {
                if (!cancelled) {
                    setIsHeroButtonVisible(true);
                }
            }, cursor)
        );

        queueTyping(heroButtonText, setTypedHeroButton, cursor + 40, 42);

        return () => {
            cancelled = true;
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, [shouldStartHeroTyping]);

    return (
        <main className="contact-page landing-panel landing-contact-panel" id="contact">
            {/* soft blobs */}
            <span className="c-blob c-blob-1" />
            <span className="c-blob c-blob-2" />
            <span className="c-blob c-blob-3" />

            {/* HERO */}
            <section className="c-hero">
                <div className="c-container c-hero-grid">
                    <div className="c-hero-left" ref={heroTypingHostRef}>
                        <h1 className="c-title c-title-typed">{typedHeroTitle}</h1>
                        <p className="c-subtitle c-subtitle-typed">
                            <span className="c-typed-line">{typedHeroLineOne}</span>
                            <span className="c-typed-line">{typedHeroLineTwo}</span>
                        </p>

                        <a className={`c-btn c-btn-typed ${isHeroButtonVisible ? "is-visible" : ""}`} href="#get-in-touch">
                            <span className="c-btn-typed-label">{typedHeroButton}</span>
                        </a>
                    </div>

                    <div className="c-hero-right">
                        <ContactHeroIllustration />
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
                                <a
                                    className="c-info-row c-info-link"
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    aria-label={`Email ${CONTACT_EMAIL}`}
                                >
                                    <span className="c-ico">{icons.mail}</span>
                                    <span className="c-info-label">Email</span>
                                    <span className="c-info-value">{CONTACT_EMAIL}</span>
                                </a>

                                <a
                                    className="c-info-row c-info-link"
                                    href={`tel:${CONTACT_PHONE_HREF}`}
                                    aria-label={`Call ${CONTACT_PHONE_DISPLAY}`}
                                >
                                    <span className="c-ico">{icons.phone}</span>
                                    <span className="c-info-label">Phone</span>
                                    <span className="c-info-value">{CONTACT_PHONE_DISPLAY}</span>
                                </a>

                                <a
                                    className="c-info-row c-info-link"
                                    href={CONTACT_LOCATION_HREF}
                                    aria-label={`Open location for ${CONTACT_LOCATION}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className="c-ico">{icons.pin}</span>
                                    <span className="c-info-label">Location</span>
                                    <span className="c-info-value">{CONTACT_LOCATION}</span>
                                </a>
                            </div>

                            <div className="c-social">
                                {socialLinks.map((socialLink) => (
                                    <a
                                        key={socialLink.label}
                                        className="c-social-pill"
                                        href={socialLink.href}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <span className="c-social-ico">{socialLink.icon}</span>
                                        {socialLink.label}
                                    </a>
                                ))}
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

            <section className="c-comments" aria-labelledby="comment-title">
                <div className="c-container">
                    <div className="c-comments-shell">
                        <div className="c-comments-head">
                            <h2 className="c-comments-title" id="comment-title">Leave a Comment</h2>
                            <p className="c-comments-sub">We&apos;d love to hear your thought!</p>
                        </div>

                        <div className="c-comments-panel c-card">
                            <div className="c-comments-list">
                                {comments.map((comment) => (
                                    <article className="c-comment-card c-card" key={comment.id}>
                                        <div className="c-comment-avatar" aria-hidden="true">
                                            <span>{getInitials(comment.author)}</span>
                                        </div>

                                        <div className="c-comment-body">
                                            <div className="c-comment-author">{comment.author}</div>
                                            <div className="c-comment-time">{comment.time}</div>
                                            <p className="c-comment-text">{comment.text}</p>

                                            <div className="c-comment-footer">
                                                <button
                                                    className={`c-comment-action ${activeReplyId === comment.id ? "is-active" : ""}`}
                                                    onClick={() => toggleReply(comment.id)}
                                                    type="button"
                                                >
                                                    Reply
                                                </button>
                                                <button
                                                    className="c-comment-action"
                                                    onClick={() => likeComment(comment.id)}
                                                    type="button"
                                                >
                                                    Like
                                                </button>
                                                <div
                                                    className={`c-comment-like-cluster ${likeAnimations[comment.id] ? "is-popping" : ""}`}
                                                >
                                                    <span className="c-comment-heart-display" aria-hidden="true">
                                                        <span className="c-comment-heart-icon">{icons.heart}</span>
                                                    </span>
                                                    <span className="c-comment-like-count">{comment.likes}</span>
                                                </div>
                                            </div>

                                            {comment.replies?.length > 0 ? (
                                                <div className="c-reply-list">
                                                    {comment.replies.map((reply) => (
                                                        <article className="c-reply-card" key={reply.id}>
                                                            <div className="c-reply-avatar" aria-hidden="true">
                                                                <span>{getInitials(reply.author)}</span>
                                                            </div>

                                                            <div className="c-reply-body">
                                                                <div className="c-reply-author">{reply.author}</div>
                                                                <div className="c-reply-time">{reply.time}</div>
                                                                <p className="c-reply-text">{reply.text}</p>
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            ) : null}

                                            {activeReplyId === comment.id ? (
                                                <form className="c-reply-compose c-card" onSubmit={(e) => onReplySubmit(e, comment.id)}>
                                                    <div className="c-reply-compose-avatar" aria-hidden="true">
                                                        {icons.user}
                                                    </div>

                                                    <div className="c-reply-compose-main">
                                                        <div className="c-reply-input-wrap">
                                                            <input
                                                                className="c-reply-input"
                                                                onChange={(e) => updateReplyDraft(comment.id, e.target.value)}
                                                                placeholder={`Reply to ${comment.author}...`}
                                                                value={replyDrafts[comment.id] || ""}
                                                            />
                                                            <button className="c-reply-btn" type="submit">
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            ) : null}
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <form className="c-comment-compose c-card" onSubmit={onCommentSubmit}>
                                <div className="c-comment-compose-avatar" aria-hidden="true">
                                    {icons.user}
                                </div>

                                <div className="c-comment-compose-main">
                                    <div className="c-comment-input-wrap">
                                        <input
                                            className="c-comment-input"
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write your comment..."
                                            value={newComment}
                                        />
                                        <button className="c-comment-btn" type="submit">
                                            Comment
                                        </button>
                                    </div>
                                    <p className="c-comment-helper">
                                        Be respectful, insightful and constructive in your comments.
                                    </p>
                                </div>
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
    whatsapp: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M12 20a7.5 7.5 0 0 0 3.8-1l3.7 1-1-3.6A7.5 7.5 0 1 0 12 20Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9.3 9.4c.2-.5.4-.6.6-.6h.5c.2 0 .4 0 .5.4l.5 1.3c.1.3.1.5-.1.7l-.4.5c.5.9 1.2 1.6 2.1 2.1l.5-.4c.2-.2.4-.2.7-.1l1.3.5c.4.1.4.3.4.5v.5c0 .2-.1.5-.6.6-.5.1-1.6.1-3.1-.6-1.3-.6-2.7-2-3.3-3.3-.7-1.5-.7-2.6-.6-3.1Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
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
    user: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    heart: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
                d="M12 20.2 5.8 14A4.3 4.3 0 0 1 12 8.1 4.3 4.3 0 0 1 18.2 14L12 20.2Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
};

function getInitials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}


