import React, { useEffect, useRef, useState } from "react";
import "./FloatingIcons.css";

import b from "../assets/b.png";
import c from "../assets/c.png";
import f from "../assets/f.png";
import g from "../assets/g.png";
import h from "../assets/h.png";
import i from "../assets/i.png";

const iconList = [b, c, f, g, h, i];
const random = (min, max) => Math.random() * (max - min) + min;

export default function FloatingIcons() {
    const containerRef = useRef(null);
    const [icons, setIcons] = useState([]);

    useEffect(() => {
        const buildIcons = () => {
            const parent = containerRef.current?.parentElement;
            if (!parent) return;

            const width = parent.clientWidth || window.innerWidth;
            const height = parent.scrollHeight || parent.clientHeight || window.innerHeight;
            const columns = Math.max(4, Math.round(width / 260));
            const rows = Math.max(6, Math.round(height / 240));
            const cellWidth = 100 / columns;
            const cellHeight = 100 / rows;
            const nextIcons = [];

            for (let row = 0; row < rows; row += 1) {
                for (let col = 0; col < columns; col += 1) {
                    const index = row * columns + col;
                    const src = iconList[index % iconList.length];
                    const centerX = col * cellWidth + cellWidth / 2;
                    const centerY = row * cellHeight + cellHeight / 2;

                    nextIcons.push({
                        id: `${row}-${col}`,
                        src,
                        left: `${centerX + random(-cellWidth * 0.22, cellWidth * 0.22)}%`,
                        top: `${centerY + random(-cellHeight * 0.22, cellHeight * 0.22)}%`,
                        durX: random(55, 95),
                        durY: random(50, 90),
                        durZ: random(24, 42),
                        delX: random(-50, 0),
                        delY: random(-50, 0),
                        delZ: random(-24, 0),
                        baseSize: random(72, 138),
                        dirX: Math.random() > 0.5 ? "alternate" : "alternate-reverse",
                        dirY: Math.random() > 0.5 ? "alternate" : "alternate-reverse",
                        dirZ: Math.random() > 0.5 ? "alternate" : "alternate-reverse",
                    });
                }
            }

            setIcons(nextIcons);
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
    }, []);

    return (
        <div ref={containerRef} className="floating-icons-container" aria-hidden="true">
            {icons.map((item) => (
                <div
                    key={item.id}
                    className="floating-base"
                    style={{
                        left: item.left,
                        top: item.top,
                        width: item.baseSize,
                        height: item.baseSize,
                    }}
                >
                    <div
                        className="move-x"
                        style={{
                            animationDuration: `${item.durX}s`,
                            animationDelay: `${item.delX}s`,
                            animationDirection: item.dirX
                        }}
                    >
                        <div
                            className="move-y"
                            style={{
                                animationDuration: `${item.durY}s`,
                                animationDelay: `${item.delY}s`,
                                animationDirection: item.dirY
                            }}
                        >
                            <img
                                src={item.src}
                                className="depth-z"
                                alt="floating element"
                                style={{
                                    animationDuration: `${item.durZ}s`,
                                    animationDelay: `${item.delZ}s`,
                                    animationDirection: item.dirZ
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
