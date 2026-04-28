import { useEffect, useRef, useState } from "react";
import "./ServiceHero.css";
import { serviceContraller } from "../controllers/serviceContraller";

export default function ServiceHero() {
  const { hero } = serviceContraller;
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState("");

  const subtitleText = "Smart solutions for a digital world.";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const startObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setPhase((currentPhase) => (currentPhase === 0 ? 1 : currentPhase));
        }
      },
      {
        threshold: 0,
        rootMargin: `0px 0px -${(1 - hero.scrollTriggerViewportRatio) * 100}% 0px`,
      }
    );

    const resetObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsVisible(false);
          setPhase(0);
          setTypedText("");
        }
      },
      { threshold: 0 }
    );

    startObserver.observe(el);
    resetObserver.observe(el);

    return () => {
      startObserver.disconnect();
      resetObserver.disconnect();
    };
  }, [hero.scrollTriggerViewportRatio]);

  useEffect(() => {
    if (!isVisible) return undefined;

    let timerId;

    if (phase === 1) {
      timerId = window.setTimeout(() => setPhase(2), hero.headingAnimationDuration);
    }

    if (phase === 2) {
      if (typedText.length < subtitleText.length) {
        timerId = window.setTimeout(() => {
          setTypedText(subtitleText.slice(0, typedText.length + 1));
        }, hero.typingSpeed);
      } else {
        timerId = window.setTimeout(() => setPhase(3), hero.delayBetweenSteps);
      }
    }

    return () => window.clearTimeout(timerId);
  }, [
    hero.delayBetweenSteps,
    hero.headingAnimationDuration,
    hero.typingSpeed,
    isVisible,
    phase,
    typedText,
    subtitleText,
  ]);

  return (
    <section ref={sectionRef} className={`service-hero ${isVisible ? "is-visible" : ""}`}>
      <div className="hero-content">
        <div className={`heading-wrapper ${phase >= 1 ? "animate-heading" : ""}`}>
          <h2 className="glass-title">Our Services</h2>
        </div>

        <div className="subtitle-container">
          <p className={`glass-subtitle ${phase >= 2 ? "show-subtitle" : ""}`}>
            {typedText}
            {phase === 2 ? <span className="caret">|</span> : null}
          </p>
        </div>
      </div>
    </section>
  );
}
