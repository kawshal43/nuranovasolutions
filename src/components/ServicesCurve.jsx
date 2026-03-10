import React from 'react';
import './ServicesCurve.css';

// Pre-defined list of all our service images
const icons = [
    '/services/software.png',
    '/services/design.png',
    '/services/video.png',
    '/services/photography.png',
    '/services/education.png',
    '/services/marketing.png',
];

export default function ServicesCurve() {
    // We want to loop the animation continuously.
    // 36 seconds total duration means 6 icons are perfectly spaced by 6 seconds each.
    const animationDuration = 36;

    return (
        <div className="services-curve-container">
            {/* 
        The viewBox creates a wide, fixed coordinate system we can draw our curve within.
        preserveAspectRatio="none" allows the SVG to stretch and fill the wide screen 
        while keeping the Y coordinates relatively scaled.
      */}
            <svg
                className="services-curve-svg"
                viewBox="0 0 1440 300"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/*
          The Curve Path.
          M = Move to start (x: -100, y: 150)
          C = Cubic Bezier curve (controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, endX, endY)
          We draw a smooth sine-like wave across the 1440px width and extend it slightly past the edges.
        */}
                <path
                    id="hero-curve-path"
                    d="M -100 150 C 400 350, 900 -50, 1540 150"
                    fill="transparent"
                    stroke="transparent"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                {/* Render each icon attached to the path */}
                {icons.map((src, index) => {
                    // Calculate stagger delay so they are evenly distributed along the 24s loop
                    const delay = -(animationDuration / icons.length) * index;

                    return (
                        <g key={src} className="animating-icon-group">
                            {/* Note: x and y are negative half the width/height to perfectly center the icon on the path line */}
                            <image
                                href={src}
                                width="140"
                                height="140"
                                x="-70"
                                y="-70"
                                className="animating-icon"
                                style={{
                                    /* Stagger the inner float animation so they wobble independently */
                                    animationDelay: `${-(index * 2.5)}s`,
                                    animationDuration: `${12 + (index % 4)}s`
                                }}
                            />
                            <animateMotion
                                dur={`${animationDuration}s`}
                                repeatCount="indefinite"
                                begin={`${delay}s`}
                            >
                                <mpath href="#hero-curve-path" />
                            </animateMotion>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
