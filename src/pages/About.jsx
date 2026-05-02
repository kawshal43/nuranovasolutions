// src/pages/About.jsx
import { useEffect, useRef, useState } from "react";
import "./About.css";

import heroImg from "../assets/first.png";
import blurImg from "../assets/h.png";

import missionIcon from "../assets/mission.png";
import visionIcon from "../assets/vision.png";

const VISION_TEXT =
  "To become a trusted global ecosystem where digital solutions, creative media, and technology education converge to inspire new beginnings.";
const MISSION_TEXT =
  "To empower businesses and students alike by building reliable, ethical, and innovative digital experiences that bridge the gap between imagination and reality.";
const PHILOSOPHY_MATCH_QUESTIONS = [
  {
    id: "mind",
    symbol: "Idea Brain",
    answer: "Intelligence",
    note: "Smart thinking before any build starts",
    options: ["Creativity", "Intelligence", "Decoration"],
  },
  {
    id: "spark",
    symbol: "Launch Spark",
    answer: "New Creation",
    note: "The moment a fresh idea comes alive",
    options: ["New Creation", "Maintenance", "Shortcut"],
  },
  {
    id: "bridge",
    symbol: "Solution Bridge",
    answer: "Solutions",
    note: "Connects imagination with real results",
    options: ["Noise", "Solutions", "Speed"],
  },
  {
    id: "compass",
    symbol: "Vision Compass",
    answer: "Direction",
    note: "Points every decision toward purpose",
    options: ["Direction", "Trend", "Guesswork"],
  },
  {
    id: "core",
    symbol: "Trust Core",
    answer: "Reliability",
    note: "Keeps the product stable and dependable",
    options: ["Hype", "Reliability", "Luck"],
  },
];

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

export default function About() {
  const wrapRef = useRef(null);

  // typing starts when About is visible
  const [started, setStarted] = useState(false);
  const [matchQuestionIndex, setMatchQuestionIndex] = useState(() =>
    Math.floor(Math.random() * PHILOSOPHY_MATCH_QUESTIONS.length)
  );
  const [selectedMeaning, setSelectedMeaning] = useState("");
  const [puzzleStatus, setPuzzleStatus] = useState("idle");

  const titleFull = "More Than\nJust Code.";
  const paraFull =
    'NuraNova Solutions is not just a company; It\'s a philosophy, a mindset, and a promise regarding "The Code".';

  const [tTitle, setTTitle] = useState("");
  const [tPara, setTPara] = useState("");

  const activeMatchQuestion = PHILOSOPHY_MATCH_QUESTIONS[matchQuestionIndex];
  const puzzleSolved = puzzleStatus === "solved";

  const handleMeaningChoice = (meaning) => {
    if (puzzleSolved) return;
    setSelectedMeaning(meaning);

    if (meaning !== activeMatchQuestion.answer) {
      setPuzzleStatus("wrong");
      window.setTimeout(() => setPuzzleStatus("idle"), 650);
      return;
    }

    setPuzzleStatus("solved");
  };

  const resetPuzzle = () => {
    setMatchQuestionIndex((current) => {
      if (PHILOSOPHY_MATCH_QUESTIONS.length <= 1) return current;
      let next = current;
      while (next === current) {
        next = Math.floor(Math.random() * PHILOSOPHY_MATCH_QUESTIONS.length);
      }
      return next;
    });
    setSelectedMeaning("");
    setPuzzleStatus("idle");
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

  return (
    <div className="about-page landing-panel landing-about-panel" id="about" ref={wrapRef}>
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

      {/* PHILOSOPHY (MINI LOGIC GRID PUZZLE) */}
      <section className="philosophy-section philo-modern-section">
        <div className="philo-modern-header">
          <h2 className="ph-card-title">Now we start small game</h2>
          <p className="ph-card-sub">
            Pick the correct meaning and unlock the idea.
          </p>
        </div>

        <div className={`philo-puzzle philo-gridlock ${puzzleStatus === "wrong" ? "is-wrong" : ""} ${puzzleSolved ? "is-solved" : ""}`}>
          <div className="philo-puzzle-copy">
            <span className="philo-puzzle-kicker">Logic grid</span>
            <h3>Match today&apos;s symbol with its hidden meaning.</h3>
            <p>
              One puzzle appears at a time. Refresh the page or reset the puzzle to get another symbol from the set.
            </p>

            <div className="philo-puzzle-steps" aria-label="Path progress">
              <span className="philo-puzzle-step is-complete">
                {matchQuestionIndex + 1}/5
              </span>
              <span className={`philo-puzzle-step ${puzzleSolved ? "is-complete" : ""}`}>
                {puzzleSolved ? "Matched" : "Waiting"}
              </span>
            </div>

            <p className="philo-puzzle-hint">
              {puzzleSolved
                ? `${activeMatchQuestion.symbol} means ${activeMatchQuestion.answer}.`
                : puzzleStatus === "wrong"
                  ? "That pair does not belong together. Try another meaning."
                  : "Choose the meaning that belongs to the symbol."}
            </p>

            <button className="philo-puzzle-reset" onClick={resetPuzzle} type="button">
              Reset puzzle
            </button>
          </div>

          <div className="philo-puzzle-board philo-gridlock-board" aria-label="Interactive logic grid puzzle">
            <div className="philo-gridlock-beam" aria-hidden="true" />

            <div className="philo-gridlock-column">
              <span className="philo-gridlock-label">Symbol</span>
              <article className={`philo-grid-card philo-grid-symbol is-selected ${puzzleSolved ? "is-matched" : ""}`}>
                <strong>{activeMatchQuestion.symbol}</strong>
                <small>{activeMatchQuestion.note}</small>
              </article>
            </div>

            <div className={`philo-gridlock-core ${puzzleSolved ? "is-open" : ""}`} aria-hidden="true">
              <span>{puzzleSolved ? "1/1" : "0/1"}</span>
              <strong>{puzzleSolved ? "Unlocked" : "Locked"}</strong>
            </div>

            <div className="philo-gridlock-column">
              <span className="philo-gridlock-label">Meanings</span>
              {activeMatchQuestion.options.map((meaning) => (
                <button
                  className={`philo-grid-card philo-grid-meaning ${selectedMeaning === meaning ? "is-selected" : ""} ${puzzleSolved && meaning === activeMatchQuestion.answer ? "is-matched" : ""}`}
                  key={meaning}
                  onClick={() => handleMeaningChoice(meaning)}
                  type="button"
                >
                  <strong>{meaning}</strong>
                  <small>Match with today&apos;s symbol</small>
                </button>
              ))}
            </div>

            <div className={`philo-grid-reveal ${puzzleSolved ? "is-visible" : ""}`}>
              <span>NuraNova logic</span>
              <strong>{activeMatchQuestion.symbol} unlocks {activeMatchQuestion.answer}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Future use: Mission & Vision section kept here intentionally.
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
      */}

    </div>
  );
}
