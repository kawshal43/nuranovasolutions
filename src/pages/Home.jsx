import { useEffect, useMemo, useRef, useState } from "react";
import "./Home.css";

import b from "../assets/b.png";
import c from "../assets/c.png";
import f from "../assets/f.png";
import g from "../assets/g.png";
import h from "../assets/h.png";
import i from "../assets/i.png";
import ar from "../assets/ar.png";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  const servicesRef = useRef(null);
  const whyRef = useRef(null);

  const [inView, setInView] = useState({ services: false, why: false });

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute("data-id");
            if (id) setInView((p) => ({ ...p, [id]: true }));
          }
        });
      },
      { threshold: 0.18 }
    );

    [servicesRef.current, whyRef.current].forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // tiny parallax
  const p = useMemo(() => {
    const y = scrollY;
    return { a: y * 0.04, b: y * 0.03, c: y * 0.035 };
  }, [scrollY]);



  return (
    <div className="home-container" id="home">
      {/* HERO */}
      <section className="hero">
        <div className="heroOverlay" aria-hidden="true" />

        <div className="decor" aria-hidden="true">
          <img
            src={b}
            className="float sizeM posLT blur1"
            alt=""
            style={{ transform: `translateY(${p.a}px)` }}
          />
          <img
            src={c}
            className="float sizeL posLM sharp"
            alt=""
            style={{ transform: `translateY(${p.b}px)` }}
          />
          <img
            src={f}
            className="float sizeM posLB blur2"
            alt=""
            style={{ transform: `translateY(${p.c}px)` }}
          />
          <img src={g} className="float sizeL posRT blur1" alt="" />
          <img src={h} className="float sizeL posRM sharp" alt="" />
          <img src={i} className="float sizeM posRB blur3" alt="" />
        </div>

        <div className="container">
          <div className="heroInner">
            <div className="kicker">It all starts with innovation</div>

            {/* ✅ Title stays. Arrow is inside exp-wrap */}
            <h1 className="title">
              Building Digital <br />
              <span className="exp-wrap">
                Experiences
                <span className="arrow-holder">
                  <img src={ar} alt="arrow" />
                </span>
              </span>
            </h1>

            <div className="btnRow">
              <button
                className="btn btnHero"
                onClick={() => servicesRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore More
              </button>
            </div>

            <p className="leadStrong">Creative. Reliable. Innovative.</p>
            <p className="lead">
              NuraNova helps you build digital solutions, craft visual stories, and bring your ideas
              to life.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
}

function relationalImageFallback(img) {
  return img;
}
