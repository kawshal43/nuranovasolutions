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

import missionIcon from "../assets/mission.png";
import visionIcon from "../assets/vision.png";

const PHILO_DOT_COUNT = 170;
const VISION_TEXT =
  "To become a trusted global ecosystem where digital solutions, creative media, and technology education converge to inspire new beginnings.";
const MISSION_TEXT =
  "To empower businesses and students alike by building reliable, ethical, and innovative digital experiences that bridge the gap between imagination and reality.";

function buildCloudTokens(text, seed = 1) {
  const words = text.split(" ");
  const orbitalAngles = [
    330, 30, 300, 60, 0, 180, 240, 120, 210, 150, 270, 90, 345, 15, 315, 45,
    285, 75, 255, 105, 225, 135, 195, 165,
  ];
  const rings = [
    { rx: 118, ry: 86 },
    { rx: 142, ry: 104 },
    { rx: 164, ry: 120 },
  ];
  const placed = [];
  const usedSlots = new Set();
  const slotCandidates = [];

  rings.forEach((ring, ringIndex) => {
    orbitalAngles.forEach((angle, angleIndex) => {
      const rad = (angle * Math.PI) / 180;
      slotCandidates.push({
        x: Math.cos(rad) * ring.rx,
        y: Math.sin(rad) * ring.ry,
        slotId: `${ringIndex}-${angleIndex}`,
      });
    });
  });

  const isBlocked = (x, y, width, height, padX = 15, padY = 10) => {
    const anchorHalfW = 116;
    const anchorHalfH = 54;
    if (
      Math.abs(x) < anchorHalfW + width * 0.5 &&
      Math.abs(y) < anchorHalfH + height * 0.5
    ) {
      return true;
    }

    for (let i = 0; i < placed.length; i += 1) {
      const p = placed[i];
      const overlapX = Math.abs(x - p.x) < (width + p.width) * 0.5 + padX;
      const overlapY = Math.abs(y - p.y) < (height + p.height) * 0.5 + padY;
      if (overlapX && overlapY) return true;
    }

    return false;
  };

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const width = Math.max(40, Math.min(118, word.length * 8.2));
    const height = 20;
    const start = (seed * 5 + index * 7) % slotCandidates.length;
    let chosen = null;

    for (let step = 0; step < slotCandidates.length; step += 1) {
      const candidate = slotCandidates[(start + step) % slotCandidates.length];
      if (usedSlots.has(candidate.slotId)) continue;
      if (!isBlocked(candidate.x, candidate.y, width, height)) {
        chosen = { ...candidate, width, height };
        usedSlots.add(candidate.slotId);
        break;
      }
    }

    if (!chosen) {
      const overflowScales = [1.08, 1.16, 1.24];
      for (let scaleIndex = 0; scaleIndex < overflowScales.length; scaleIndex += 1) {
        const scale = overflowScales[scaleIndex];
        for (let angleStep = 0; angleStep < orbitalAngles.length; angleStep += 1) {
          const angle = orbitalAngles[(index + angleStep + seed) % orbitalAngles.length];
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * rings[2].rx * scale;
          const y = Math.sin(rad) * rings[2].ry * scale;
          if (!isBlocked(x, y, width, height, 12, 8)) {
            chosen = { x, y, width, height };
            break;
          }
        }
        if (chosen) break;
      }
    }

    if (!chosen) {
      // Final deterministic guard: keep layout stable even for very narrow viewports.
      const angle = orbitalAngles[(index * 3 + seed) % orbitalAngles.length];
      const rad = (angle * Math.PI) / 180;
      chosen = {
        x: Math.cos(rad) * rings[2].rx * 1.26,
        y: Math.sin(rad) * rings[2].ry * 1.26,
        width,
        height,
      };
    }

    placed.push(chosen);
  }

  return words.map((word, index) => {
    const point = placed[index];
    const rotate = (((index + seed) % 6) - 2.5) * 0.6;
    const floatDelay = ((index * 73 + seed * 37) % 1000) / 1000;
    return {
      word,
      driftX: point.x,
      driftY: point.y,
      rotate,
      floatDelay,
    };
  });
}

function makeScatterTargets(count, width, height, margin = 24) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    points.push({
      x: margin + Math.random() * (width - margin * 2),
      y: margin + Math.random() * (height - margin * 2),
    });
  }
  return points;
}

function makeBulbTargets(count, width, height) {
  const points = [];
  const minDim = Math.min(width, height);
  const cx = width * 0.5;
  const cy = height * 0.39;
  const globeRx = minDim * 0.24;
  const globeRy = minDim * 0.29;
  const neckTop = cy + globeRy * 0.72;
  const neckBottom = neckTop + minDim * 0.11;
  const neckHalfWTop = minDim * 0.05;
  const neckHalfWBottom = minDim * 0.075;
  const baseTop = neckBottom + minDim * 0.012;
  const baseBottom = baseTop + minDim * 0.11;
  const baseHalfW = minDim * 0.13;

  const globeEdgeCount = Math.floor(count * 0.28);
  const globeFillCount = Math.floor(count * 0.4);
  const neckCount = Math.floor(count * 0.14);
  const baseCount = Math.floor(count * 0.18);

  for (let i = 0; i < globeEdgeCount; i += 1) {
    const angle = (i / globeEdgeCount) * Math.PI * 2;
    const jitter = 0.95 + Math.random() * 0.08;
    points.push({
      x: cx + Math.cos(angle) * globeRx * jitter,
      y: cy + Math.sin(angle) * globeRy * jitter,
    });
  }

  for (let i = 0; i < globeFillCount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    points.push({
      x: cx + Math.cos(angle) * globeRx * r,
      y: cy + Math.sin(angle) * globeRy * r,
    });
  }

  for (let i = 0; i < neckCount; i += 1) {
    const t = i / Math.max(1, neckCount - 1);
    const halfW = neckHalfWTop + (neckHalfWBottom - neckHalfWTop) * t;
    const y = neckTop + (neckBottom - neckTop) * t;
    points.push({
      x: cx - halfW + Math.random() * (halfW * 2),
      y,
    });
  }

  for (let i = 0; i < baseCount; i += 1) {
    const y = baseTop + Math.random() * (baseBottom - baseTop);
    const roundT = (y - baseTop) / Math.max(1, baseBottom - baseTop);
    const squeeze = 0.93 - Math.abs(roundT - 0.5) * 0.22;
    const halfW = baseHalfW * squeeze;
    points.push({
      x: cx - halfW + Math.random() * (halfW * 2),
      y,
    });
  }

  while (points.length < count) {
    points.push({
      x: cx + (Math.random() - 0.5) * minDim * 0.08,
      y: baseTop + Math.random() * (baseBottom - baseTop),
    });
  }

  return points;
}

function makeStarTargets(count, width, height) {
  const points = [];
  const minDim = Math.min(width, height);
  const cx = width * 0.5;
  const cy = height * 0.5;
  const outerR = minDim * 0.29;
  const innerR = minDim * 0.118;
  const starVertices = [];

  for (let i = 0; i < 10; i += 1) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? outerR : innerR;
    starVertices.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  }

  const edgeCount = Math.floor(count * 0.62);
  for (let i = 0; i < edgeCount; i += 1) {
    const edge = i % starVertices.length;
    const a = starVertices[edge];
    const b = starVertices[(edge + 1) % starVertices.length];
    const t = i / edgeCount;
    points.push({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    });
  }

  const innerRingCount = Math.floor(count * 0.23);
  for (let i = 0; i < innerRingCount; i += 1) {
    const angle = (i / innerRingCount) * Math.PI * 2;
    const radius = innerR * (0.64 + Math.random() * 0.18);
    points.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  }

  for (let i = edgeCount; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * innerR * 0.7;
    points.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  }

  return points;
}



export default function About() {
  const wrapRef = useRef(null);
  const nuraWrapRef = useRef(null);
  const nuraCanvasRef = useRef(null);
  const nuraModeRef = useRef("scatter");
  const novaWrapRef = useRef(null);
  const novaCanvasRef = useRef(null);
  const novaModeRef = useRef("scatter");
  const mobileTimerRef = useRef(null);
  const mvZoneRef = useRef(null);
  const mvIconTimerRef = useRef(null);
  const isCoarsePointerRef = useRef(false);

  // typing starts when About is visible
  const [started, setStarted] = useState(false);
  const [activeWord, setActiveWord] = useState("");
  const [mvActiveSide, setMvActiveSide] = useState("");
  const [mvIconSide, setMvIconSide] = useState("");

  const visionTokens = buildCloudTokens(VISION_TEXT, 2);
  const missionTokens = buildCloudTokens(MISSION_TEXT, 7);

  const titleFull = "More Than\nJust Code.";
  const paraFull =
    'NuraNova Solutions is not just a company; It\'s a philosophy, a mindset, and a promise regarding "The Code".';

  const [tTitle, setTTitle] = useState("");
  const [tPara, setTPara] = useState("");

  const setNuraMode = (mode) => {
    nuraModeRef.current = mode;
    setActiveWord(mode === "bulb" ? "nura" : "");
  };

  const setNovaMode = (mode) => {
    novaModeRef.current = mode;
    setActiveWord(mode === "star" ? "nova" : "");
  };

  const pulseSideOnTap = (side) => {
    if (mobileTimerRef.current) window.clearTimeout(mobileTimerRef.current);
    if (side === "nura") {
      nuraModeRef.current = "bulb";
      novaModeRef.current = "scatter";
      setActiveWord("nura");
    } else {
      novaModeRef.current = "star";
      nuraModeRef.current = "scatter";
      setActiveWord("nova");
    }

    mobileTimerRef.current = window.setTimeout(() => {
      nuraModeRef.current = "scatter";
      novaModeRef.current = "scatter";
      setActiveWord("");
    }, 1800);
  };

  const activateMvSide = (side) => {
    if (mvIconTimerRef.current) window.clearTimeout(mvIconTimerRef.current);
    setMvActiveSide(side);
    setMvIconSide("");
    mvIconTimerRef.current = window.setTimeout(() => {
      setMvIconSide(side);
    }, 460);
  };

  const deactivateMv = () => {
    if (mvIconTimerRef.current) window.clearTimeout(mvIconTimerRef.current);
    setMvActiveSide("");
    setMvIconSide("");
  };

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

  useEffect(() => {
    const setupField = ({
      canvas,
      wrap,
      modeRef,
      shapeMode,
      shapeTargetsFactory,
      color,
    }) => {
      if (!canvas || !wrap) return () => {};
      const context = canvas.getContext("2d");
      if (!context) return () => {};

      const particles = [];
      let scatterTargets = [];
      let shapeTargets = [];
      let stageWidth = 280;
      let stageHeight = 260;
      let raf = 0;

      const setCanvasSize = () => {
        const rect = wrap.getBoundingClientRect();
        const width = Math.max(240, Math.floor(rect.width));
        const height = Math.max(240, Math.floor(rect.height));
        stageWidth = width;
        stageHeight = height;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        scatterTargets = makeScatterTargets(PHILO_DOT_COUNT, width, height, 16);
        shapeTargets = shapeTargetsFactory(PHILO_DOT_COUNT, width, height);

        particles.length = 0;
        for (let i = 0; i < PHILO_DOT_COUNT; i += 1) {
          particles.push({
            x: scatterTargets[i].x,
            y: scatterTargets[i].y,
            r: 0.85 + Math.random() * 1.45,
            alpha: 0.22 + Math.random() * 0.42,
          });
        }
      };

      const draw = () => {
        context.clearRect(0, 0, stageWidth, stageHeight);
        const targetSet =
          modeRef.current === shapeMode ? shapeTargets : scatterTargets;

        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];
          const t = targetSet[i] || scatterTargets[i];
          p.x += (t.x - p.x) * 0.085;
          p.y += (t.y - p.y) * 0.085;
          context.beginPath();
          context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          context.fillStyle = `rgba(${color}, ${p.alpha})`;
          context.fill();
        }

        raf = window.requestAnimationFrame(draw);
      };

      setCanvasSize();
      draw();
      window.addEventListener("resize", setCanvasSize);

      return () => {
        window.removeEventListener("resize", setCanvasSize);
        if (raf) window.cancelAnimationFrame(raf);
      };
    };

    const cleanupNura = setupField({
      canvas: nuraCanvasRef.current,
      wrap: nuraWrapRef.current,
      modeRef: nuraModeRef,
      shapeMode: "bulb",
      shapeTargetsFactory: makeBulbTargets,
      color: "24, 83, 160",
    });

    const cleanupNova = setupField({
      canvas: novaCanvasRef.current,
      wrap: novaWrapRef.current,
      modeRef: novaModeRef,
      shapeMode: "star",
      shapeTargetsFactory: makeStarTargets,
      color: "33, 96, 188",
    });

    return () => {
      cleanupNura();
      cleanupNova();
      if (mobileTimerRef.current) window.clearTimeout(mobileTimerRef.current);
    };
  }, []);

  useEffect(() => {
    isCoarsePointerRef.current = window.matchMedia(
      "(hover: none), (pointer: coarse)"
    ).matches;
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!isCoarsePointerRef.current || !mvActiveSide) return;
      const zone = mvZoneRef.current;
      if (!zone) return;
      if (!zone.contains(event.target)) deactivateMv();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [mvActiveSide]);

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

      {/* PHILOSOPHY (INTERACTIVE DOT FIELD) */}
      <section className="philosophy-section philo-modern-section">
        <div className="philo-modern-header">
          <h2 className="ph-card-title">The Philosophy Behind the Name</h2>
          <p className="ph-card-sub">
            Combining Intelligence with the spark of new creation
          </p>
        </div>
        <div className="philo-dual-layout">
          <div
            className="philo-side"
            role="button"
            tabIndex={0}
            aria-label="Nura philosophy interaction"
            onMouseEnter={() => setNuraMode("bulb")}
            onMouseLeave={() => setNuraMode("scatter")}
            onFocus={() => setNuraMode("bulb")}
            onBlur={() => setNuraMode("scatter")}
            onClick={() => pulseSideOnTap("nura")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                pulseSideOnTap("nura");
              }
            }}
          >
            <span className={`philo-word ${activeWord === "nura" ? "is-active" : ""}`}>
              Nura
            </span>
            <p className="philo-word-sub">Knowledge & Energy</p>
            <div className="philo-canvas-wrap" ref={nuraWrapRef} aria-hidden="true">
              <canvas ref={nuraCanvasRef} className="philo-canvas" />
            </div>
          </div>

          <div
            className="philo-side"
            role="button"
            tabIndex={0}
            aria-label="Nova philosophy interaction"
            onMouseEnter={() => setNovaMode("star")}
            onMouseLeave={() => setNovaMode("scatter")}
            onFocus={() => setNovaMode("star")}
            onBlur={() => setNovaMode("scatter")}
            onClick={() => pulseSideOnTap("nova")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                pulseSideOnTap("nova");
              }
            }}
          >
            <span className={`philo-word ${activeWord === "nova" ? "is-active" : ""}`}>
              Nova
            </span>
            <p className="philo-word-sub">New Beginnings</p>
            <div className="philo-canvas-wrap" ref={novaWrapRef} aria-hidden="true">
              <canvas ref={novaCanvasRef} className="philo-canvas" />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="mission-vision-section" ref={mvZoneRef}>
        <div className={`mv-cards ${mvActiveSide ? `has-active active-${mvActiveSide}` : ""}`}>
          <article
            className={`mv-card mv-card-vision ${mvActiveSide === "vision" ? "is-active" : ""} ${mvActiveSide && mvActiveSide !== "vision" ? "is-dimmed" : ""}`}
            onMouseEnter={() => activateMvSide("vision")}
            onMouseLeave={() => deactivateMv()}
            onFocus={() => activateMvSide("vision")}
            onBlur={() => deactivateMv()}
            onClick={() => {
              if (!isCoarsePointerRef.current) return;
              if (mvActiveSide === "vision") deactivateMv();
              else activateMvSide("vision");
            }}
            role="button"
            tabIndex={0}
            aria-label="Vision interaction area"
          >
            <div
              className={`mv-icon-box icon mv-icon-vision ${mvIconSide === "vision" ? "is-visible" : ""}`}
              aria-hidden="true"
            >
              <img className="mv-icon-img" src={visionIcon} alt="Vision" />
            </div>
            <h3 className="mv-anchor">Our Vision</h3>
            <p className={`mv-word-cloud ${mvActiveSide === "vision" ? "is-hidden" : ""}`}>
              {visionTokens.map((token, index) => (
                <span
                  key={`vision-${index}`}
                  className="mv-word-token"
                  style={{
                    "--i": index,
                    "--dx": `${token.driftX}px`,
                    "--dy": `${token.driftY}px`,
                    "--rot": `${token.rotate}deg`,
                    "--fd": `${token.floatDelay}s`,
                  }}
                >
                  {token.word}
                </span>
              ))}
            </p>
            <p className={`mv-paragraph ${mvActiveSide === "vision" ? "is-visible" : ""}`}>
              {VISION_TEXT}
            </p>
          </article>

          <article
            className={`mv-card mv-card-mission ${mvActiveSide === "mission" ? "is-active" : ""} ${mvActiveSide && mvActiveSide !== "mission" ? "is-dimmed" : ""}`}
            onMouseEnter={() => activateMvSide("mission")}
            onMouseLeave={() => deactivateMv()}
            onFocus={() => activateMvSide("mission")}
            onBlur={() => deactivateMv()}
            onClick={() => {
              if (!isCoarsePointerRef.current) return;
              if (mvActiveSide === "mission") deactivateMv();
              else activateMvSide("mission");
            }}
            role="button"
            tabIndex={0}
            aria-label="Mission interaction area"
          >
            <div
              className={`mv-icon-box icon mv-icon-mission ${mvIconSide === "mission" ? "is-visible" : ""}`}
              aria-hidden="true"
            >
              <img className="mv-icon-img" src={missionIcon} alt="Mission" />
            </div>
            <h3 className="mv-anchor">Our Mission</h3>
            <p className={`mv-word-cloud ${mvActiveSide === "mission" ? "is-hidden" : ""}`}>
              {missionTokens.map((token, index) => (
                <span
                  key={`mission-${index}`}
                  className="mv-word-token"
                  style={{
                    "--i": index,
                    "--dx": `${token.driftX}px`,
                    "--dy": `${token.driftY}px`,
                    "--rot": `${token.rotate}deg`,
                    "--fd": `${token.floatDelay}s`,
                  }}
                >
                  {token.word}
                </span>
              ))}
            </p>
            <p className={`mv-paragraph ${mvActiveSide === "mission" ? "is-visible" : ""}`}>
              {MISSION_TEXT}
            </p>
          </article>
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
            <button className="team-btn">View Profile</button>
          </div>

          <div className="team-card team-pop">
            <div className="team-img-wrapper">
               <img src={pusiImg} alt="Team member 1" className="team-img" />
            </div>
            <h3>R.K.D.S.Rajapaksha (COO)</h3>
            <p className="team-role">Software Engineer (OUSL)</p>
            <p className="team-desc">Operational excellence driver</p>
            <button className="team-btn">View Profile</button>
          </div>

          <div className="team-card team-pop">
            <div className="team-img-wrapper">
              <img src={asiyaImg} alt="Team member 3" className="team-img" />
            </div>
            <h3>R.M.Kawshal (CTO)</h3>
            <p className="team-role">Software Engineer (OUSL)</p>
            <p className="team-desc">Tech architect and strategist</p>
            <button className="team-btn">View Profile</button>
          </div>
        </div>
      </section>
    </div>
  );
}
