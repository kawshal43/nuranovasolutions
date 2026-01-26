import { useEffect, useMemo, useRef, useState } from "react";
import "./Services.css";
import ServiceCard from "../components/ServiceCard";

export default function Services() {
  /* ========== SLIDES ========== */
  const slides = useMemo(() => ["/hero/a.png", "/hero/b.png", "/hero/c.png"], []);

  /* ========== LOOP CLONES ========== */
  const loopSlides = useMemo(() => {
    if (slides.length === 0) return [];
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides]);

  const [index, setIndex] = useState(0);  // which real slide is active
  const [pos, setPos] = useState(1);      // position in loopSlides
  const [enableAnim, setEnableAnim] = useState(true);

  /* ========== AUTOPLAY ========== */
  const timerRef = useRef(null);
  const SLIDE_MS = 4500;

  useEffect(() => {
    slides.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }, [slides]);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const next = () => {
    setEnableAnim(true);
    setPos((p) => p + 1);
    setIndex((i) => (i + 1) % slides.length);
  };

  const prev = () => {
    setEnableAnim(true);
    setPos((p) => p - 1);
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  const start = () => {
    stop();
    timerRef.current = setInterval(next, SLIDE_MS);
  };

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos]);

  const goTo = (i) => {
    setEnableAnim(true);
    setIndex(i);
    setPos(i + 1);
    start();
  };

  const onTransitionEnd = () => {
    // handle infinite loop jumps
    if (pos === slides.length + 1) {
      setEnableAnim(false);
      setPos(1);
    }
    if (pos === 0) {
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

  return (
    <div className="services-page">
      {/* ========= HERO SLIDER ========= */}
      <section className="hero">
        <div
          className={`hero-track ${enableAnim ? "anim" : "no-anim"}`}
          style={{
            width: `${loopSlides.length * 100}%`,
            transform: `translateX(-${pos * (100 / loopSlides.length)}%)`,
          }}
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

        <div className="hero-overlay" />

        <button className="hero-arrow left" onClick={prev}>
          ‹
        </button>
        <button className="hero-arrow right" onClick={next}>
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
