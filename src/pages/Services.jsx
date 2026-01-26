import { useEffect, useMemo, useRef, useState } from "react";
import "./Services.css";
import ServiceCard from "../components/ServiceCard";

export default function Services() {
  /* =========================
     1) SLIDES (REAL IMAGES)
     ========================= */
  // Put ONLY real slide images here (no duplicates, no commas inside strings)
  const slides = useMemo(() => ["/hero/a.png", "/hero/b.png", "/hero/c.png"], []);

  /* =========================
     2) SLIDER STATE
     ========================= */
  // index = active REAL slide index (0..slides.length-1) -> used for dots
  const [index, setIndex] = useState(0);

  // pos = track position (includes clones)
  // We start at 1 because 0 is the "last clone"
  const [pos, setPos] = useState(1);

  // enableAnim = true => smooth transition, false => instant jump (for looping)
  const [enableAnim, setEnableAnim] = useState(true);

  // pause on hover
  const [paused, setPaused] = useState(false);

  /* =========================
     3) AUTOPLAY TIMER
     ========================= */
  const timerRef = useRef(null);
  const SLIDE_MS = 4500;

  /* =========================
     4) MAKE LOOP SLIDES (CLONES)
     ========================= */
  // Loop structure: [lastClone, ...realSlides, firstClone]
  const loopSlides = useMemo(() => {
    if (slides.length === 0) return [];
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides]);

  /* =========================
     5) PRELOAD IMAGES (NO FLASH)
     ========================= */
  useEffect(() => {
    slides.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }, [slides]);

  /* =========================
     6) TIMER HELPERS
     ========================= */
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = () => {
    stop();
    timerRef.current = setInterval(() => {
      next(); // go to next slide every SLIDE_MS
    }, SLIDE_MS);
  };

  // Start/Stop timer depending on hover (paused)
  useEffect(() => {
    if (paused) {
      stop();
      return;
    }
    start();
    return () => stop();
    // We depend on paused + pos so it stays consistent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, pos]);

  /* =========================
     7) NAVIGATION (NEXT / PREV / DOTS)
     ========================= */
  const next = () => {
    setEnableAnim(true);         // enable smooth animation
    setPos((p) => p + 1);        // move track one slide forward
    setIndex((i) => (i + 1) % slides.length); // update active real slide index
  };

  const prev = () => {
    setEnableAnim(true);
    setPos((p) => p - 1);
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  const goTo = (i) => {
    // i is real index (0..slides.length-1)
    setEnableAnim(true);
    setIndex(i);
    setPos(i + 1); // because real slides start from pos=1
    if (!paused) start(); // restart autoplay after manual click
  };

  /* =========================
     8) INFINITE LOOP FIX (IMPORTANT)
     ========================= */
  // When we reach a CLONE slide, we jump instantly to the real one.
  // This jump happens AFTER the sliding animation ends.
  const onTransitionEnd = () => {
    // If we moved to the firstClone (after the last real slide)
    if (pos === slides.length + 1) {
      setEnableAnim(false); // disable animation to avoid visible jump
      setPos(1);            // jump to first real slide
    }

    // If we moved to the lastClone (before the first real slide)
    if (pos === 0) {
      setEnableAnim(false);
      setPos(slides.length); // jump to last real slide
    }
  };

  /* =========================
     9) SERVICES DATA
     ========================= */
  const img = (path) => encodeURI(path);

  const services = [
    {
      title: "Software Development &\nWeb Solutions",
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

  /* =========================
     10) UI RENDER
     ========================= */
  return (
    <div className="services-page">
      {/* ================= HERO SLIDER ================= */}
      <section
        className="hero"
        //onMouseEnter={() => setPaused(true)}  // pause autoplay
       // onMouseLeave={() => setPaused(false)} // resume autoplay
      >
        {/* TRACK (MOVING SLIDES) */}
        <div
          className={`hero-track ${enableAnim ? "anim" : "no-anim"}`}
          style={{ transform: `translateX(-${pos * 100}%)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {loopSlides.map((src, i) => (
            <div
              key={i}
              className="hero-slide"
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>

        {/* 50% BLACK OVERLAY */}
        <div className="hero-overlay" />

        {/* ARROWS */}
        <button
          className="hero-arrow left"
          onClick={prev}
          type="button"
          aria-label="Previous slide"
        >
          ‹
        </button>

        <button
          className="hero-arrow right"
          onClick={next}
          type="button"
          aria-label="Next slide"
        >
          ›
        </button>

        {/* CONTENT */}
        <div className="hero-content">
          <h1>Our Services</h1>
          <p>Smart solutions for a digital world.</p>

          {/* DOTS */}
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

      {/* ================= SERVICES GRID ================= */}
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
