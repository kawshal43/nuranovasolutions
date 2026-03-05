import React, { useEffect, useState } from "react";
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
    const [icons, setIcons] = useState([]);

    useEffect(() => {
        // Generate icons drifting around the page
        const newIcons = Array.from({ length: 18 }).map((_, index) => {
            const src = iconList[index % iconList.length];

            const dirX = Math.random() > 0.5 ? "alternate" : "alternate-reverse";
            const dirY = Math.random() > 0.5 ? "alternate" : "alternate-reverse";
            const dirZ = Math.random() > 0.5 ? "alternate" : "alternate-reverse";

            return {
                id: index,
                src,
                left: `${random(-10, 100)}%`,
                top: `${random(-10, 100)}%`,
                durX: random(60, 120),
                durY: random(60, 120),
                durZ: random(30, 60),
                delX: random(-60, 0),
                delY: random(-60, 0),
                delZ: random(-30, 0),
                baseSize: random(80, 160),
                dirX,
                dirY,
                dirZ,
            };
        });
        setIcons(newIcons);
    }, []);

    return (
        <div className="floating-icons-container" aria-hidden="true">
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
