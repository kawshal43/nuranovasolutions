import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Services.css";
import ServiceCard from "../components/ServiceCard";
import HeroAnimation from "../components/HeroAnimation";
import FloatingIcons from "../components/FloatingIcons";
import ServicesCurve from "../components/ServicesCurve";
import ServiceHero from "../components/ServiceHero";

import b from "../assets/b.png";
import c from "../assets/c.png";
import f from "../assets/f.png";
import g from "../assets/g.png";
import h from "../assets/h.png";
import i from "../assets/i.png";
export default function Services() {
  const img = (path) => encodeURI(path);

  /* ========== SERVICES CONTENT ========== */
  const services = [
    {
      title: "Software Development & Web Solutions",
      description:
        "Modern, scalable web and software solutions built for performance and security.",
      image: img("/services/software.png"),
    },
    {
      title: "Design & Creative Media",
      description:
        "Creative visuals and digital content that strengthen your brand identity.",
      image: img("/services/design.png"),
    },
    {
      title: "Video Production & Editing",
      description:
        "Professional video editing, animations, and visual storytelling.",
      image: img("/services/video.png"),
    },
    {
      title: "Photography Services",
      description:
        "Creative and professional photography for events and products.",
      image: img("/services/photography.png"),
    },
    {
      title: "Education & Tutorials",
      description:
        "Simple and practical tutorials for technology and digital skills.",
      image: img("/services/education.png"),
    },
    {
      title: "Product & Brand Marketing",
      description:
        "Strategic visuals and media to grow brand visibility and engagement.",
      image: img("/services/marketing.png"),
    },
  ];

  /* ========== PARALLAX SCROLL ========== */
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const p = useMemo(() => {
    const y = scrollY;
    return { a: y * 0.04, b: y * 0.03, c: y * 0.035 };
  }, [scrollY]);

  return (
    <div className="services-page" id="service-page">
      {/* Background animation for the entire page */}
      {/*<HeroAnimation />*/}

      {/* ========= HERO STATIC BANNER ========= */}
      <FloatingIcons />
      <ServiceHero
        onScrollDown={() => document.getElementById('services-grid').scrollIntoView({ behavior: 'smooth' })}
      />

      {/* ========= SERVICES GRID ========= */}
      <section className="services-section" id="services-grid">
        <div className="services-grid">
          {services.map((s, i) => (
            <ServiceCard
              key={i}
              index={i}
              title={s.title}
              description={s.description}
              image={s.image}
              onLearnMore={() => alert(s.title)}
            />
          ))}
        </div>
      </section>
    </div >
  );
}
