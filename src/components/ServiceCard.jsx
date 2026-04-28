import { useEffect, useRef } from "react";
import "./ServiceCard.css";
import { serviceContraller } from "../controllers/serviceContraller";

export default function ServiceCard({
  title,
  description,
  image,
  onContact,
  onLearnMore,
  index = 0,
}) {
  const { cardBehavior } = serviceContraller;
  const cardRef = useRef(null);
  const animState = useRef({ targetProgress: 0, currentProgress: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (cardRef.current) {
        cardRef.current.style.opacity = "1";
        cardRef.current.style.transform = "none";
      }
      return undefined;
    }

    let rafId;

    const updateTarget = () => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const vHeight = window.innerHeight;
      const stagger = (index % 3) * cardBehavior.columnStagger;
      const bottomZoneHeight = (vHeight * cardBehavior.entranceViewportFactor) + stagger;
      const pBottom = (vHeight - rect.top) / bottomZoneHeight;
      const topZoneStart = vHeight * cardBehavior.exitViewportStartFactor;
      const topZoneEnd = -rect.height;
      const pTop = (rect.top - topZoneEnd) / (topZoneStart - topZoneEnd);

      let progress = Math.min(pBottom, pTop);
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      animState.current.targetProgress = progress;
    };

    const renderLoop = () => {
      const state = animState.current;
      state.currentProgress += (state.targetProgress - state.currentProgress) * cardBehavior.lerpSpeed;

      if (cardRef.current && Math.abs(state.targetProgress - state.currentProgress) > 0.0001) {
        const progress = state.currentProgress;
        const overshoot = cardBehavior.bounceOvershoot;
        const pMod = progress - 1;
        const eased = pMod * pMod * ((overshoot + 1) * pMod + overshoot) + 1;
        const cubicEased = 1 - Math.pow(1 - progress, 3);
        const scale = cardBehavior.scaleStart + cardBehavior.scaleRange * cubicEased;
        const ty = cardBehavior.driftY * (1 - cubicEased);
        const opacity = Math.min(progress * cardBehavior.fadeSpeed, 1);

        cardRef.current.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
        cardRef.current.style.opacity = `${opacity}`;
        cardRef.current.style.setProperty(
          "--card-shadow-lift",
          (1 + (1 - eased) * cardBehavior.shadowLiftRange).toFixed(3)
        );
      }

      rafId = window.requestAnimationFrame(renderLoop);
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget, { passive: true });
    updateTarget();
    renderLoop();

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      window.cancelAnimationFrame(rafId);
    };
  }, [cardBehavior, index]);

  return (
    <article ref={cardRef} className="service-card">
      <div className="service-img-wrap">
        <img className="service-image" src={image} alt={title} />
      </div>

      <div className="service-content">
        <div className="service-copy">
          <h3 className="service-title">{title}</h3>
          <p className="service-desc">{description}</p>
        </div>

        <div className="service-actions">
          <button className="service-btn btn-primary" onClick={onContact} type="button">
            <span className="service-btn-icon service-btn-icon--lead" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2 11 13"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M22 2 15 22l-4-9-9-4Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span className="service-btn-label">Contact</span>
          </button>
          <button className="service-btn btn-secondary" onClick={onLearnMore} type="button">
            <span className="service-btn-label">Learn More</span>
            <span className="service-btn-icon service-btn-icon--trail" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="m13 6 6 6-6 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
