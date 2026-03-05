import React, { useEffect, useRef } from "react";

export default function HeroAnimation() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });

        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (isReducedMotion) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            return;
        }

        let mouse = { x: width / 2, y: height / 2 };
        let smoothMouse = { x: width / 2, y: height / 2 };
        let isActive = false;
        let reveal = 0; // 0 (hidden) to 1 (visible)

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            isActive = true;
        };

        const handleMouseLeave = () => {
            isActive = false;
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        canvas.addEventListener("mouseleave", handleMouseLeave);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener("resize", handleResize);

        let animationFrameId;

        const render = () => {
            // Clear to transparent — aurora comes from the CSS body background
            ctx.clearRect(0, 0, width, height);


            // Smooth reveal on interaction
            const targetReveal = isActive ? 1 : 0;
            reveal += (targetReveal - reveal) * 0.08;

            if (isActive) {
                // Lower factor means it catches up to the mouse slower, creating a noticeable trail/delay
                smoothMouse.x += (mouse.x - smoothMouse.x) * 0.04;
                smoothMouse.y += (mouse.y - smoothMouse.y) * 0.04;
            } else {
                // Drift gently when idle
                smoothMouse.x += (width / 2 - smoothMouse.x) * 0.02;
                smoothMouse.y += (height / 2 - smoothMouse.y) * 0.02;
            }

            const spacing = 40; // Increased the gap between particles as requested
            const dotSize = 1;
            const baseRadius = width < 768 ? 200 : 350;
            const maxDisplacement = 80; // Lens bulge strength

            const cols = Math.floor(width / spacing) + 4;
            const rows = Math.floor(height / spacing) + 4;

            // Define a palette of nice, vibrant colors (blue, purple, pink, etc.) to pick from randomly
            const colors = ["#3b83f67e", "#8a5cf675", "#ec489a6c", "#10b98169", "#f59f0b6c"];

            // Simple seeded random function based on coordinates so the colors don't flicker every frame
            const seededRandom = (x, y) => {
                const seed = x * 1337 + y * 9973;
                return Math.abs(Math.sin(seed) * 10000) % 1;
            };

            // Animation speed for organic shape
            const time = performance.now() * 0.0015;

            if (reveal > 0.01) {
                const quickBounds = baseRadius * 16;

                for (let i = -2; i < cols; i++) {
                    for (let j = -2; j < rows; j++) {
                        const baseX = i * spacing;
                        const baseY = j * spacing;

                        const dx = baseX - smoothMouse.x;
                        const dy = baseY - smoothMouse.y;

                        // Quick discard if too far away from the mouse
                        if (Math.abs(dx) > quickBounds || Math.abs(dy) > quickBounds) continue;

                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx);

                        // Organic, morphing shape based on angle and time
                        const wave1 = Math.sin(angle * 3 + time) * (baseRadius * 0.15);
                        const wave2 = Math.cos(angle * 2 - time * 0.8) * (baseRadius * 0.2);
                        const wave3 = Math.sin(angle * 5 + time * 1.2) * (baseRadius * 0.1);
                        const currentRadius = baseRadius + wave1 + wave2 + wave3;

                        if (dist < currentRadius) {
                            const distRatio = dist / currentRadius; // 0 (center) to 1 (edge)

                            // Smooth fade out towards the edges of the organic shape
                            const edgeFade = 1 - Math.pow(distRatio, 2);
                            const opacity = edgeFade * reveal * 0.5; // max 0.8 opacity

                            if (opacity > 0.01) {
                                let x = baseX;
                                let y = baseY;

                                // Lens bulge effect
                                const force = Math.sin(distRatio * Math.PI) * maxDisplacement * reveal;
                                if (dist > 0) {
                                    x += (dx / dist) * force;
                                    y += (dy / dist) * force;
                                }

                                // Larger dots near the bulge ridge
                                const scale = 4 + Math.sin(distRatio * Math.PI) * 2 * reveal;

                                // Pick a consistent color for this specific dot
                                const colorIndex = Math.floor(seededRandom(i, j) * colors.length);
                                ctx.fillStyle = colors[colorIndex];

                                ctx.globalAlpha = opacity;
                                const rectSize = dotSize * scale;

                                // Add a base blur for all dots, and scale it up near the edges
                                // The closest the dot is to the center, the sharper it is (minimum blur of 1)
                                let baseBlur = 1;

                                if (distRatio > 0.6) {
                                    // Scale blur heavily based on how close it is to the very edge 
                                    baseBlur += ((distRatio - 0.6) / 0.4) * 8 * reveal;
                                }

                                ctx.shadowBlur = baseBlur;
                                ctx.shadowColor = colors[colorIndex];

                                // Draw dot as a circle for a softer, organic look
                                ctx.beginPath();
                                ctx.arc(x, y, rectSize / 2, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }
                    }
                }
            }

            ctx.globalAlpha = 1; // Reset opacity
            ctx.shadowBlur = 0; // Reset blur
            animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                pointerEvents: "none",
            }}
            aria-hidden="true"
        />
    );
}
