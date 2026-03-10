// src/pages/About.jsx
import { useEffect, useMemo, useState } from "react";
import "./About.css";

import heroImg from "../assets/first.png";
import blurImg from "../assets/h.png";

import missionIcon from "../assets/mission.png";
import visionIcon from "../assets/vision.png";

import meImg from "../assets/me.png";
import pusiImg from "../assets/pusi.png";
import asiyaImg from "../assets/asiya.png";

export default function About() {
  const fullTitle = "MORE THAN JUST CODE";
  const fullDesc =
    "NuraNova helps you build digital solutions, craft visual stories, and bring your ideas to life.";

  // ✅ typing controls (you can change speed here)
  const typing = useMemo(
    () => ({
      titleSpeed: 55, // smaller = faster
      descSpeed: 16,  // smaller = faster
      startDelay: 200,
    }),
    []
  );

  const { title, desc, showCursor } = useTypewriter(fullTitle, fullDesc, typing);

  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div
          className="about-blur-bg"
          style={{ backgroundImage: `url(${blurImg})` }}
          aria-hidden="true"
        />

        <div className="about-hero-content">
          <h1 className="about-title">
            {title}
            {showCursor ? <span className="caret">|</span> : null}
          </h1>

          <p className="about-desc">{desc}</p>

          <button className="about-btn">Contact Us</button>
        </div>

        <div className="about-hero-img">
          <img src={heroImg} alt="Hero" className="hero-illustration floating" />
        </div>
      </section>

      {/* ✅ PHILOSOPHY TEMPORARILY REMOVED */}

      {/* ✅ MISSION & VISION */}
      <section className="mission-vision-section">
        <h2 className="section-title">Our Mission & Vision</h2>

        <div className="mv-cards">
          <div className="mv-card hover-pop">
            <div className="mv-icon-box">
              <img className="mv-icon-img" src={missionIcon} alt="Mission" />
            </div>
            <h3>Our Mission</h3>
            <p>
              To empower businesses and students alike by building reliable, ethical and
              innovative digital solutions that bridge the gap between imagination and reality.
            </p>
          </div>

          <div className="mv-card hover-pop">
            <div className="mv-icon-box">
              <img className="mv-icon-img" src={visionIcon} alt="Vision" />
            </div>
            <h3>Our Vision</h3>
            <p>
              To become a trusted global ecosystem where digital solutions, creative media, and
              technology education converge to inspire new beginnings.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ INNOVATORS */}
      <section className="innovators-section">
        <h2 className="section-title">Meet the Innovators</h2>

        <div className="team-grid">
          <TeamCard
            img={meImg}
            name="S.T.Weerathunga (CEO)"
            role="Software Engineer (OUSL)"
            desc="Visionary leader guiding innovation"
          />
          <TeamCard
            img={pusiImg}
            name="R.K.D.S.Rajapaksha (COO)"
            role="Software Engineer (OUSL)"
            desc="Operational excellence driver"
          />
          <TeamCard
            img={asiyaImg}
            name="R.M.Kawshal (CTO)"
            role="Software Engineer (OUSL)"
            desc="Tech architect and strategist"
          />
        </div>
      </section>
    </div>
  );
}

/* ✅ Typewriter (typing ALWAYS works unless user has Reduce Motion ON) */
function useTypewriter(fullTitle, fullDesc, cfg) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ✅ Only if user REALLY wants reduced motion, skip typing
    if (reduced) {
      setTitle(fullTitle);
      setDesc(fullDesc);
      setShowCursor(false);
      return;
    }

    let t1 = 0;
    let t2 = 0;
    let startT = 0;
    let i = 0;
    let j = 0;

    const typeDesc = () => {
      t2 = window.setInterval(() => {
        j++;
        setDesc(fullDesc.slice(0, j));
        if (j >= fullDesc.length) {
          window.clearInterval(t2);
          setTimeout(() => setShowCursor(false), 400);
        }
      }, cfg.descSpeed);
    };

    const typeTitle = () => {
      t1 = window.setInterval(() => {
        i++;
        setTitle(fullTitle.slice(0, i));
        if (i >= fullTitle.length) {
          window.clearInterval(t1);
          typeDesc();
        }
      }, cfg.titleSpeed);
    };

    startT = window.setTimeout(typeTitle, cfg.startDelay);

    return () => {
      window.clearTimeout(startT);
      window.clearInterval(t1);
      window.clearInterval(t2);
    };
  }, [fullTitle, fullDesc, cfg]);

  return { title, desc, showCursor };
}

function TeamCard({ img, name, role, desc }) {
  return (
    <div className="team-card team-pop">
      <div className="team-img-wrapper">
        <img src={img} alt={name} className="team-img" />
      </div>
      <h3>{name}</h3>
      <p className="team-role">{role}</p>
      <p className="team-desc">{desc}</p>
      <button className="team-btn">More</button>
    </div>
  );
}