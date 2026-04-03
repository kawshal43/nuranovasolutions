import { useEffect, useRef, useState } from "react";
import "./Contact.css";

export default function Contact() {
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
    const likeTimersRef = useRef(new Map());

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
        return () => {
            likeTimersRef.current.forEach((timer) => clearTimeout(timer));
            likeTimersRef.current.clear();
        };
    }, []);

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
