import { useEffect, useRef } from "react";
import "./ServiceCard.css";

// ─────────────────────────────────────────────────────────────────────────────
// Animation Control Panel
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  // Float smoothness: The lower the number, the slower/more liquid the glide.
  // 0.08 = standard fluid glide, 0.008 = VERY slow heavy glide.
  lerpSpeed: 0.05,

  // Bounce / elastic overshoot amount (0 = no bounce, 1.4 = soft bounce, 2.0+ = strong)
  bounceOvershoot: 0.7,

  // How fast opacity fades in (1.0 = normal fade, 2.0 = fades in 2x as fast at the start)
  fadeSpeed: 2,

  // Entrance Travel Distance X (pixels left/right offscreen)
  travelX: 200,

  // Entrance Travel Distance Y (pixels downward drift)
  driftY: 100,

  // 3D Swivel amount (degrees of rotation like a door opening)
  swivelDeg: 30,
};

export default function ServiceCard({ title, description, image, onLearnMore, index = 0 }) {
  const cardRef = useRef(null);

  // Track scroll target and current smooth value for fluid Lerping
  const animState = useRef({ targetProgress: 0, currentProgress: 0 });

  useEffect(() => {
    let rafId;

    // 1. Update the TARGET progress purely based on scroll
    const updateTarget = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const vHeight = window.innerHeight;

      // Stagger right column
      const stagger = (index % 2) * 80;

      // Bottom Zone: Entrance (0 to 1 as it scrolls up from bottom)
      const bottomZoneHeight = (vHeight * 0.45) + stagger;
      const pBottom = (vHeight - rect.top) / bottomZoneHeight;

      // Top Zone: Exit (1 to 0 as it scrolls off the top)
      // Starts leaving when card top is 20% from top of window
      // Fully gone when card bottom passes top of window
      const topZoneStart = vHeight * 0.20;
      const topZoneEnd = -rect.height;
      const pTop = (rect.top - topZoneEnd) / (topZoneStart - topZoneEnd);

      // The card's progress is whichever is smaller (0 = invisible, 1 = fully visible)
      // This means as it goes up, pBottom > 1 but pTop = 1. Then pTop drops to 0 at the top.
      let p = Math.min(pBottom, pTop);

      // Clamp between 0 and 1
      if (p < 0) p = 0;
      if (p > 1) p = 1;

      animState.current.targetProgress = p;
    };

    // 2. Continuously render and Lerp toward the target on every single frame
    const renderLoop = () => {
      const state = animState.current;

      // Lerp (Linear Interpolation) for that glassy, floaty momentum
      state.currentProgress += (state.targetProgress - state.currentProgress) * CONFIG.lerpSpeed;

      // Only update DOM if the difference is noticeably large enough (optimizes performance)
      if (cardRef.current && Math.abs(state.targetProgress - state.currentProgress) > 0.0001) {
        const progress = state.currentProgress;

        // Apply an 'easeOutBack' curve so it overshoots and bounces into place
        const s = CONFIG.bounceOvershoot;
        const pMod = progress - 1;
        const eased = pMod * pMod * ((s + 1) * pMod + s) + 1;

        // Pure smooth cubic for non-bouncing properties (opacity/scale/vertical drift)
        const cubicEased = 1 - Math.pow(1 - progress, 3);

        const isLeft = index % 2 === 0;

        // Calculate physics using the CONFIG variables
        const tx = (isLeft ? -CONFIG.travelX : CONFIG.travelX) * (1 - eased);
        const ty = CONFIG.driftY * (1 - cubicEased);
        const rotY = (isLeft ? -CONFIG.swivelDeg : CONFIG.swivelDeg) * (1 - eased);

        // Scale and Opacity don't bounce backward, they just smoothly lerp in
        const scale = 0.90 + 0.10 * cubicEased;
        const opac = Math.min(progress * CONFIG.fadeSpeed, 1);

        cardRef.current.style.transform = `perspective(1200px) translate3d(${tx}px, ${ty}px, 0) rotateY(${rotY}deg) scale(${scale})`;
        cardRef.current.style.opacity = opac;
      }

      rafId = window.requestAnimationFrame(renderLoop);
    };

    // Initialize
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget, { passive: true });
    updateTarget();     // Initial measurement
    renderLoop();       // Start continuous animation engine

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      window.cancelAnimationFrame(rafId);
    };
  }, [index]);

  return (
    <div ref={cardRef} className="service-card">
      <div className="service-img-wrap">
        <img className="service-image" src={image} alt={title} />
      </div>

      <div className="service-content">
        <h3 className="service-title">{title}</h3>
        <p className="service-desc">{description}</p>

        <div className="service-actions">
          <button className="service-btn btn-primary" onClick={() => alert("Contact")}>
            Contact
          </button>
          <button className="service-btn btn-secondary" onClick={onLearnMore}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
