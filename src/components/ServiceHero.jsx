import React, { useEffect, useRef, useState } from "react";
import "./ServiceHero.css";

const CONFIG = {
    headingAnimationDuration: 1500, // EXACT 2s
    typingSpeed: 50,
    delayBetweenSteps: 250,
    scrollTriggerThreshold: 0.15,

    // Visual controls
    glassTransparencyLevel: 0.82,
    glowStrength: 2, // 0.5 - 2
    outlineStroke: 2, // px
    shineWidth: 35, // %
};

export default function ServiceHero({ onScrollDown }) {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [phase, setPhase] = useState(0);
    const [typedText, setTypedText] = useState("");

    const subtitleText = "Smart solutions for a digital world.";

    // Trigger on enter / reset on leave
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    // reset fully when leaving viewport
                    setIsVisible(false);
                    setPhase(0);
                    setTypedText("");
                }
            },
            { threshold: CONFIG.scrollTriggerThreshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Sequence
    useEffect(() => {
        if (!isVisible) return;

        let t;

        if (phase === 0) {
            setPhase(1); // start heading immediately
            return;
        }

        if (phase === 1) {
            // wait exactly 2s for heading to finish, then subtitle
            t = setTimeout(() => setPhase(2), CONFIG.headingAnimationDuration);
        }

        if (phase === 2) {
            if (typedText.length < subtitleText.length) {
                t = setTimeout(() => {
                    setTypedText(subtitleText.slice(0, typedText.length + 1));
                }, CONFIG.typingSpeed);
            } else {
                t = setTimeout(() => setPhase(3), CONFIG.delayBetweenSteps);
            }
        }

        return () => clearTimeout(t);
    }, [isVisible, phase, typedText]);

    const cssVars = {
        "--heading-duration": `${CONFIG.headingAnimationDuration}ms`,
        "--glass-alpha": `${CONFIG.glassTransparencyLevel}`,
        "--glow-strength": `${CONFIG.glowStrength}`,
        "--outline-stroke": `${CONFIG.outlineStroke}px`,
        "--shine-width": `${CONFIG.shineWidth}%`,
    };

    return (
        <section
            ref={sectionRef}
            className={`service-hero ${!isVisible ? "hero-hidden" : ""}`}
            style={cssVars}
        >
            <div className="hero-content">
                <div className={`heading-wrapper ${phase >= 1 ? "animate-heading" : ""}`}>
                    {/* The actual visible layers are done via ::before */}
                    <h1 className="glass-title">
                        {/* Invisible size-setter so the h1 has natural height */}
                        <span className="layer-sizer" aria-hidden="true">Our Services</span>
                        <span className="layer outline" data-text="Our Services" />
                        <span className="layer shine" data-text="Our Services" />
                        <span className="layer glass" data-text="Our Services" />
                        <span className="layer final" data-text="Our Services" />
                    </h1>
                </div>

                <div className="subtitle-container">
                    <p className={`glass-subtitle ${phase >= 2 ? "show-subtitle" : ""}`}>
                        {typedText}
                        {phase === 2 && <span className="caret">|</span>}
                    </p>
                </div>

                <button
                    className={`scroll-down-wrap ${phase >= 3 ? "show-scroll" : ""}`}
                    onClick={onScrollDown}
                    type="button"
                >
                    <span className="scroll-text">Scroll Down</span>
                    <span className="scroll-icon" aria-hidden="true">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </button>
            </div>
        </section>
    );
}