import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Services.css";
import ServiceCard from "../components/ServiceCard";

export default function Services() {
  /* ========== SLIDES ========== */
  const slides = useMemo(() => ["/hero/a.png", "/hero/b.png", "/hero/c.png"], []);

  /* ========== LOOP CLONES (last + real slides + first) ========== */
  const loopSlides = useMemo(() => {
    if (!slides.length) return [];
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides]);

  const [index, setIndex] = useState(0); // active REAL slide (0..slides.length-1)
  const [pos, setPos] = useState(1);     // active position in loopSlides (starts at 1)
  const [enableAnim, setEnableAnim] = useState(true);

  /* ========== AUTOPLAY ========== */
  const timerRef = useRef(null);
  const SLIDE_MS = 4500;

  // Preload images (prevents flicker)
  useEffect(() => {
    slides.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }, [slides]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const next = useCallback(() => {
    if (!slides.length) return;
    setEnableAnim(true);
    setPos((p) => p + 1);
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (!slides.length) return;
    setEnableAnim(true);
    setPos((p) => p - 1);
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const start = useCallback(() => {
    stop();
    timerRef.current = setInterval(next, SLIDE_MS);
  }, [next, stop]);

  // Start once on mount, cleanup on unmount
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  const goTo = (i) => {
    if (!slides.length) return;
    setEnableAnim(true);
    setIndex(i);
    setPos(i + 1); // because loopSlides has 1 clone at the start
    start();
  };

  const onTransitionEnd = () => {
    // handle infinite loop jumps
    if (pos === slides.length + 1) {
      // reached "first clone" (after last real)
      setEnableAnim(false);
      setPos(1);
    } else if (pos === 0) {
      // reached "last clone" (before first real)
      setEnableAnim(false);
      setPos(slides.length);
    }
  };

  const img = (path) => encodeURI(path);

  /* ========== SERVICES CONTENT ========== */
  const services = [
    {
      title: "Software Development & Web Solutions",
      description:
        "Modern, scalable web and software solutions built with the latest technologies to deliver performance, security, and great user experiences.",
      image: img("/services/software.png"),
    },
    {
      title: "Design & Creative Media",
      description:
        "Creative visual designs that enhance brand identity through engaging graphics, digital content, and innovative media solutions.",
      image: img("/services/design.png"),
    },
    {
      title: "Video Production & Editing",
      description:
        "High-quality video editing, animations, and visual effects crafted to tell compelling stories and promote your brand effectively.",
      image: img("/services/video.png"),
    },
    {
      title: "Photography Services",
      description:
        "Professional photography services capturing moments, events, and products with clarity, creativity, and attention to detail.",
      image: img("/services/photography.png"),
    },
    {
      title: "Education & Tutorials",
      description:
        "Easy-to-understand tutorials and educational content designed to help learners build skills in technology, design, and digital tools.",
      image: img("/services/education.png"),
    },
    {
      title: "Product & Brand Marketing",
      description:
        "Creative marketing visuals, product media, and promotional content designed to boost brand visibility and engagement.",
      image: img("/services/marketing.png"),
    },
  ];

  // Safety: if slides empty, avoid divide-by-zero
  const trackWidth = loopSlides.length ? `${loopSlides.length * 100}%` : "100%";
  const translate = loopSlides.length
    ? `translateX(-${pos * (100 / loopSlides.length)}%)`
    : "translateX(0%)";

  return (
    <div className="services-page" id="service-page">
      {/* ========= HERO SLIDER ========= */}
      <section className="hero">
        <div
          className={`hero-track ${enableAnim ? "anim" : "no-anim"}`}
          style={{
            width: trackWidth,
            transform: translate,
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {loopSlides.map((src, i) => (
            <div key={`${src}-${i}`} className="hero-slide">
              <img
                src={src}
                alt=""
                className="hero-img"
                draggable="false"
                loading="eager"
              />
            </div>
          ))}
        </div>

        <div className="hero-overlay" />

        <button className="hero-arrow left" onClick={prev} aria-label="Previous">
          ‹
        </button>
        <button className="hero-arrow right" onClick={next} aria-label="Next">
          ›
        </button>

        <div className="hero-content">
          <h1>Our Services</h1>
          <p>Smart solutions for a digital world.</p>

          <div className="hero-dots">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === index ? "active" : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========= SERVICES GRID ========= */}
      <section className="services-section">
        <div className="services-grid">
          {services.map((s, i) => (
            <ServiceCard
              key={i}
              title={s.title}
              description={s.description}
              image={s.image}
              onLearnMore={() => alert(s.title)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
