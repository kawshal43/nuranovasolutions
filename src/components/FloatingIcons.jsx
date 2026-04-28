import { useEffect, useMemo, useRef, useState } from "react";
import "./FloatingIcons.css";

import a from "../assets/a.png";
import b from "../assets/b.png";
import c from "../assets/c.png";
import f from "../assets/f.png";
import g from "../assets/g.png";
import h from "../assets/h.png";
import i from "../assets/i.png";

const ambientIconList = [b, c, f, g, h, i];
const random = (min, max) => Math.random() * (max - min) + min;

const homeHeroIcons = [
  {
    id: "hero-top-left",
    src: a,
    className: "is-top-left",
    style: {
      "--left-desktop": "3.5%",
      "--top-desktop": "10%",
      "--left-mobile": "1%",
      "--top-mobile": "11%",
      "--size-desktop": "clamp(124px, 12vw, 192px)",
      "--size-mobile": "clamp(92px, 25vw, 128px)",
      "--drift-x": "10px",
      "--drift-y": "8px",
      "--tilt": "5deg",
      "--motion-duration": "10.9s",
      "--motion-delay": "-5s",
      "--depth-duration": "8.7s",
      "--depth-delay": "-3s",
    },
  },
  {
    id: "hero-left-middle",
    src: b,
    className: "is-left-middle",
    style: {
      "--left-desktop": "15%",
      "--top-desktop": "35%",
      "--left-mobile": "8%",
      "--top-mobile": "32%",
      "--size-desktop": "clamp(92px, 8vw, 136px)",
      "--size-mobile": "clamp(76px, 21vw, 108px)",
      "--drift-x": "7px",
      "--drift-y": "6px",
      "--tilt": "4deg",
      "--motion-duration": "9.4s",
      "--motion-delay": "-8s",
      "--depth-duration": "7.8s",
      "--depth-delay": "-2s",
    },
  },
  {
    id: "hero-bottom-left",
    src: c,
    className: "is-bottom-left",
    style: {
      "--left-desktop": "9%",
      "--top-desktop": "71%",
      "--left-mobile": "9%",
      "--top-mobile": "72%",
      "--size-desktop": "clamp(112px, 10vw, 154px)",
      "--size-mobile": "clamp(86px, 24vw, 118px)",
      "--drift-x": "9px",
      "--drift-y": "8px",
      "--tilt": "6deg",
      "--motion-duration": "8.6s",
      "--motion-delay": "-7s",
      "--depth-duration": "7.1s",
      "--depth-delay": "-4s",
    },
  },
  {
    id: "hero-top-right",
    src: f,
    className: "is-top-right",
    style: {
      "--left-desktop": "95%",
      "--top-desktop": "17%",
      "--left-mobile": "96%",
      "--top-mobile": "15%",
      "--size-desktop": "clamp(130px, 12vw, 196px)",
      "--size-mobile": "clamp(92px, 26vw, 136px)",
      "--drift-x": "10px",
      "--drift-y": "8px",
      "--tilt": "6deg",
      "--motion-duration": "10.2s",
      "--motion-delay": "-6s",
      "--depth-duration": "8.4s",
      "--depth-delay": "-5s",
    },
  },
  {
    id: "hero-right-middle",
    src: i,
    className: "is-right-middle",
    style: {
      "--left-desktop": "78%",
      "--top-desktop": "52%",
      "--left-mobile": "87%",
      "--top-mobile": "44%",
      "--size-desktop": "clamp(110px, 10vw, 160px)",
      "--size-mobile": "clamp(78px, 22vw, 110px)",
      "--drift-x": "8px",
      "--drift-y": "7px",
      "--tilt": "4deg",
      "--motion-duration": "9.2s",
      "--motion-delay": "-4s",
      "--depth-duration": "8.2s",
      "--depth-delay": "-6s",
    },
  },
  {
    id: "hero-bottom-center",
    src: h,
    className: "is-bottom-center hide-on-mobile",
    style: {
      "--left-desktop": "42%",
      "--top-desktop": "90%",
      "--left-mobile": "40%",
      "--top-mobile": "88%",
      "--size-desktop": "clamp(88px, 8vw, 132px)",
      "--size-mobile": "clamp(70px, 18vw, 92px)",
      "--drift-x": "6px",
      "--drift-y": "6px",
      "--tilt": "3deg",
      "--motion-duration": "11.4s",
      "--motion-delay": "-10s",
      "--depth-duration": "8.9s",
      "--depth-delay": "-4s",
    },
  },
  {
    id: "hero-bottom-right",
    src: g,
    className: "is-bottom-right",
    style: {
      "--left-desktop": "89%",
      "--top-desktop": "85%",
      "--left-mobile": "92%",
      "--top-mobile": "84%",
      "--size-desktop": "clamp(108px, 10vw, 152px)",
      "--size-mobile": "clamp(82px, 22vw, 118px)",
      "--drift-x": "9px",
      "--drift-y": "8px",
      "--tilt": "6deg",
      "--motion-duration": "8.8s",
      "--motion-delay": "-9s",
      "--depth-duration": "7.9s",
      "--depth-delay": "-5s",
    },
  },
];

const defaultAmbientConfig = {
  icons: ambientIconList,
  minColumns: 4,
  minRows: 6,
  columnWidth: 260,
  rowHeight: 240,
  rowWeight: 2,
  spawnModulo: 3,
  spawnOffset: 0,
  jitterX: 0.22,
  jitterY: 0.22,
  sizeMin: 72,
  sizeMax: 138,
  durXMin: 55,
  durXMax: 95,
  durYMin: 50,
  durYMax: 90,
  durZMin: 24,
  durZMax: 42,
  delXMin: -50,
  delXMax: 0,
  delYMin: -50,
  delYMax: 0,
  delZMin: -24,
  delZMax: 0,
};

export default function FloatingIcons({ variant = "ambient", config = null }) {
  const containerRef = useRef(null);
  const [ambientIcons, setAmbientIcons] = useState([]);
  const ambientConfig = useMemo(
    () => ({ ...defaultAmbientConfig, ...(config?.ambientIcons ?? {}) }),
    [config]
  );

  useEffect(() => {
    if (variant !== "ambient") {
      setAmbientIcons([]);
      return undefined;
    }

    const buildIcons = () => {
      const parent = containerRef.current?.parentElement;
      if (!parent) return;

      const width = parent.clientWidth || window.innerWidth;
      const height = parent.scrollHeight || parent.clientHeight || window.innerHeight;
      const columns = Math.max(
        ambientConfig.minColumns,
        Math.round(width / ambientConfig.columnWidth)
      );
      const rows = Math.max(
        ambientConfig.minRows,
        Math.round(height / ambientConfig.rowHeight)
      );
      const ambientSources = ambientConfig.icons?.length ? ambientConfig.icons : ambientIconList;
      const cellWidth = 100 / columns;
      const cellHeight = 100 / rows;
      const nextIcons = [];

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
          if (
            (row * ambientConfig.rowWeight + col + ambientConfig.spawnOffset) %
              ambientConfig.spawnModulo !==
            0
          ) {
            continue;
          }

          const index = row * columns + col;
          const src = ambientSources[index % ambientSources.length];
          const centerX = col * cellWidth + cellWidth / 2;
          const centerY = row * cellHeight + cellHeight / 2;

          nextIcons.push({
            id: `${row}-${col}`,
            src,
            left: `${centerX + random(
              -cellWidth * ambientConfig.jitterX,
              cellWidth * ambientConfig.jitterX
            )}%`,
            top: `${centerY + random(
              -cellHeight * ambientConfig.jitterY,
              cellHeight * ambientConfig.jitterY
            )}%`,
            durX: random(ambientConfig.durXMin, ambientConfig.durXMax),
            durY: random(ambientConfig.durYMin, ambientConfig.durYMax),
            durZ: random(ambientConfig.durZMin, ambientConfig.durZMax),
            delX: random(ambientConfig.delXMin, ambientConfig.delXMax),
            delY: random(ambientConfig.delYMin, ambientConfig.delYMax),
            delZ: random(ambientConfig.delZMin, ambientConfig.delZMax),
            baseSize: random(ambientConfig.sizeMin, ambientConfig.sizeMax),
            dirX: Math.random() > 0.5 ? "alternate" : "alternate-reverse",
            dirY: Math.random() > 0.5 ? "alternate" : "alternate-reverse",
            dirZ: Math.random() > 0.5 ? "alternate" : "alternate-reverse",
          });
        }
      }

      setAmbientIcons(nextIcons);
    };

    buildIcons();

    const parent = containerRef.current?.parentElement;
    if (!parent || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", buildIcons);
      return () => window.removeEventListener("resize", buildIcons);
    }

    const observer = new ResizeObserver(() => {
      buildIcons();
    });

    observer.observe(parent);
    window.addEventListener("resize", buildIcons);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", buildIcons);
    };
  }, [ambientConfig, variant]);

  if (variant === "home") {
    return (
      <div className="floating-icons-container floating-icons-container--hero" aria-hidden="true">
        {homeHeroIcons.map((item) => (
          <div
            key={item.id}
            className={`floating-base floating-base--hero ${item.className}`}
            style={item.style}
          >
            <div className="floating-sway">
              <div className="floating-orbit">
                <img src={item.src} className="floating-depth" alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="floating-icons-container floating-icons-container--ambient"
      aria-hidden="true"
    >
      {ambientIcons.map((item) => (
        <div
          key={item.id}
          className="floating-base floating-base--ambient"
          style={{
            left: item.left,
            top: item.top,
            width: item.baseSize,
            height: item.baseSize,
          }}
        >
          <div
            className="ambient-move-x"
            style={{
              animationDuration: `${item.durX}s`,
              animationDelay: `${item.delX}s`,
              animationDirection: item.dirX,
            }}
          >
            <div
              className="ambient-move-y"
              style={{
                animationDuration: `${item.durY}s`,
                animationDelay: `${item.delY}s`,
                animationDirection: item.dirY,
              }}
            >
              <img
                src={item.src}
                className="ambient-depth"
                alt=""
                style={{
                  animationDuration: `${item.durZ}s`,
                  animationDelay: `${item.delZ}s`,
                  animationDirection: item.dirZ,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
