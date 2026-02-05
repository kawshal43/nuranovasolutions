// src/pages/About.jsx
import { useEffect, useRef, useState } from "react";
import "./About.css";

import s1 from "../assets/s1.png";
import s2 from "../assets/s2.png";
import s3 from "../assets/s3.png";
import meImg from "../assets/me.png";
import pusiImg from "../assets/pusi.png";
import asiyaImg from "../assets/asiya.png";


import heroImg from "../assets/first.png";
import blurImg from "../assets/h.png";

import nuranovaImg from "../assets/nuranova.png";
import missionIcon from "../assets/mission.png";
import visionIcon from "../assets/vision.png";

import bBlur from "../assets/b.png";
import iBlur from "../assets/i.png";



export default function About() {
  const wrapRef = useRef(null);

  // typing starts when About is visible
  const [started, setStarted] = useState(false);

  const titleFull = "More Than\nJust Code.";
  const paraFull =
    'NuraNova Solutions is not just a company; It\'s a philosophy, a mindset, and a promise regarding "The Code".';

  const [tTitle, setTTitle] = useState("");
  const [tPara, setTPara] = useState("");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    let j = 0;
    setTTitle("");
    setTPara("");

    const titleTimer = setInterval(() => {
      i++;
      setTTitle(titleFull.slice(0, i));

      if (i >= titleFull.length) {
        clearInterval(titleTimer);

        const paraTimer = setInterval(() => {
          j++;
          setTPara(paraFull.slice(0, j));
          if (j >= paraFull.length) clearInterval(paraTimer);
        }, 20);
      }
    }, 45);

    return () => clearInterval(titleTimer);
  }, [started]);

  return (
    <div className="about-page" id="about" ref={wrapRef}>
      {/* HERO */}
      <section className="about-hero">
        <div
          className="about-blur-bg"
          style={{ backgroundImage: `url(${blurImg})` }}
          aria-hidden="true"
        />

        <div className="about-hero-content">
          <h1 className="about-title">
            {tTitle}
            {started && <span className="caret">|</span>}
          </h1>

          <p className="about-desc">
            {tPara}
            {started && <span className="caret">|</span>}
          </p>

          <button className="about-btn">Contact US</button>
        </div>

        <div className="about-hero-img">
          <img
            src={heroImg}
            alt="NuraNova intro"
            className={`hero-illustration ${started ? "floating" : ""}`}
            draggable="false"
          />
        </div>
      </section>

      {/* PHILOSOPHY (TEXT INSIDE CARD + BIG IMAGE + TIGHT SPACE) */}
      <section className="philosophy-section">
        <div className="about-bubbles" aria-hidden="true">
          <img src={bBlur} className="bubble b1" alt="" />
          <img src={iBlur} className="bubble b2" alt="" />
          <img src={bBlur} className="bubble b3" alt="" />
        </div>

        <div className="philosophy-card">
          <h2 className="ph-card-title">The Philosophy Behind the Name</h2>
          <p className="ph-card-sub">
            Combining Intelligence with the spark of new creation
          </p>

          <img className="philosophy-brand-img" src={nuranovaImg} alt="NuraNova" />
        </div>
      </section>

      {/* MISSION & VISION (CENTER + BIG ICONS) */}
      <section className="mission-vision-section">
        <h2 className="section-title">Our Mission & Vision</h2>

        <div className="mv-cards">
          <div className="mv-card hover-pop">
            <div className="mv-icon-box">
              <img className="mv-icon-img" src={missionIcon} alt="Mission" />
            </div>
            <h3>Our Mission:</h3>
            <p>
              To empower businesses and students alike by building reliable,
              ethical and innovative digital solutions that bridge the gap
              between imagination and reality.
            </p>
          </div>

          <div className="mv-card hover-pop">
            <div className="mv-icon-box">
              <img className="mv-icon-img" src={visionIcon} alt="Vision" />
            </div>
            <h3>Our Vision:</h3>
            <p>
              To become a trusted global ecosystem where digital solutions,
              creative media, and technology education converge to inspire new
              beginnings.
            </p>
          </div>
        </div>
      </section>


      {/* INNOVATORS */}
      <section className="innovators-section">
        <h2 className="section-title">Meet the Innovators</h2>

        <div className="team-grid">
          <div className="team-card team-pop">
            <div className="team-img-wrapper">
              <img src={meImg}  alt="Team member 1" className="team-img" />
            </div>
            <h3>S.T.Weerathunga (CEO)</h3>
            <p className="team-role">Software Engineer (OUSL)</p>
            <p className="team-desc">Visionary leader guiding innovation</p>
            <button className="team-btn">More</button>
          </div>

          <div className="team-card team-pop">
            <div className="team-img-wrapper">
               <img src={pusiImg} alt="Team member 1" className="team-img" />
            </div>
            <h3>R.K.D.S.Rajapaksha (COO)</h3>
            <p className="team-role">Software Engineer (OUSL)</p>
            <p className="team-desc">Operational excellence driver</p>
            <button className="team-btn">More</button>
          </div>

          <div className="team-card team-pop">
            <div className="team-img-wrapper">
              <img src={asiyaImg} alt="Team member 3" className="team-img" />
            </div>
            <h3>R.M.Kawshal (CTO)</h3>
            <p className="team-role">Software Engineer (OUSL)</p>
            <p className="team-desc">Tech architect and strategist</p>
            <button className="team-btn">More</button>
          </div>
        </div>
      </section>
    </div>
  );
}
