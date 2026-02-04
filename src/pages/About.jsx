import "./About.css";
import s1 from "../assets/s1.png"; // Placeholder for team member 1
import s2 from "../assets/s2.png"; // Placeholder for team member 2
import s3 from "../assets/s3.png"; // Placeholder for team member 3
import s from "../assets/a.png"; // Placeholder for hero image (using existing asset)

export default function About() {
    return (
        <div className="about-page" id="about">
            {/* HERO SECTION */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">
                        More Than <br />
                        Just Code .
                    </h1>
                    <p className="about-desc">
                        NuraNova solutions is not just a company; It's a philosophy, a mindset, and a promise regarding "The Code"
                    </p>
                    <button className="about-btn">Contact US</button>
                </div>
                <div className="about-hero-img">
                    {/* Using an existing asset as placeholder or the user provided one in spirit */}
                    <img src={s} alt="Creative Rocket" className="hero-illustration" />
                </div>
            </section>

            {/* PHILOSOPHY SECTION */}
            <section className="philosophy-section">
                <h2 className="section-title">The Philosophy Behind the Name</h2>
                <p className="section-sub">Combining Intelligence with the spark of new creation</p>

                <div className="philosophy-cards">
                    <div className="phil-card">
                        <div className="phil-icon">
                            {/* Lightbulb Icon (Nura) */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18h6" />
                                <path d="M10 22h4" />
                                <path d="M12 2v1" />
                                <path d="M4.2 4.2l.7.7" />
                                <path d="M19.1 4.9l.7-.7" />
                                <path d="M12 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
                            </svg>
                        </div>
                        <h3>Nura</h3>
                        <p>(Knowledge & Energy)</p>
                    </div>

                    <div className="phil-divider">|</div>

                    <div className="phil-card">
                        <div className="phil-icon">
                            {/* Star/Spark Icon (Nova) */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <h3>Nova</h3>
                        <p>(New Beginnings)</p>
                    </div>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className="mission-vision-section">
                <h2 className="section-title">Our Mission & Vision</h2>

                <div className="mv-cards">
                    {/* Mission */}
                    <div className="mv-card">
                        <div className="mv-icon">
                            {/* Target Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" />
                                <path d="M22 12h-4" />
                                <path d="M6 12H2" />
                                <path d="M12 6V2" />
                                <path d="M12 22v-4" />
                            </svg>
                        </div>
                        <h3>Our Mission:</h3>
                        <p>
                            To empower businesses and students alike by building reliable,
                            ethical and innovative digital solutions that bridge the gap
                            between imagination and reality.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="mv-card">
                        <div className="mv-icon">
                            {/* Telescope Icon */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 19l4-4" />
                                <path d="M15 15l-6 6" />
                                <path d="M19 19l-4-4" />
                                <path d="M15 9l-3 3" />
                                <path d="M2 2l3 3" />
                                <path d="M20 18l2 2" />
                                <path d="M17 17l-1-1" />
                                <circle cx="12" cy="12" r="10" transform="rotate(-45 12 12)" stroke="none" fill="none" />
                                <path d="M8.29 18.79a9.97 9.97 0 0 1-5.7-9.52C2.18 4.25 5.92-.09 10.96.01c5.03.11 9.07 4.15 9.18 9.18a9.97 9.97 0 0 1-5.63 7.8" stroke-dasharray="0" stroke="none" />
                                {/* Simplified Telescope */}
                                <path d="M19.5 5.5L7 18" />
                                <path d="M16 2l6 6" />
                                <path d="M2 16l6 6" />
                            </svg>
                            {/* Custom Telescope SVG for better match */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                                <path d="M9.8 17.2l-3.3 2.8" />
                                <path d="M14.2 12.8L20 7" />
                                <path d="M19.2 19L21 21" />
                                <path d="M16 16l3 3" />
                                <path d="M5 21l3-3" />
                                <rect x="3" y="11" width="9" height="5" rx="1" transform="rotate(-45 7.5 13.5)" />
                                <rect x="12" y="7" width="5" height="4" rx="1" transform="rotate(-45 14.5 9)" />
                            </svg>
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
                    {/* Member 1 */}
                    <div className="team-card">
                        <div className="team-img-wrapper">
                            <div className="team-placeholder" /> {/* Grey circle placeholder */}
                        </div>
                        <h3>AB. Kiri Suman(CEO)</h3>
                        <p className="team-role">Software Engineer(UK)</p>
                        <p className="team-desc">Visionary leader guiding innovation</p>
                        <button className="team-btn">More</button>
                    </div>

                    {/* Member 2 */}
                    <div className="team-card">
                        <div className="team-img-wrapper">
                            <div className="team-placeholder" />
                        </div>
                        <h3>AB. Kiri Suman(COO)</h3>
                        <p className="team-role">Software Engineer(UK)</p>
                        <p className="team-desc">Operational excellence driver</p>
                        <button className="team-btn">More</button>
                    </div>

                    {/* Member 3 */}
                    <div className="team-card">
                        <div className="team-img-wrapper">
                            <div className="team-placeholder" />
                        </div>
                        <h3>AB. Kiri Suman(CTO)</h3>
                        <p className="team-role">Software Engineer(UK)</p>
                        <p className="team-desc">Tech architect and strategist</p>
                        <button className="team-btn">More</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
