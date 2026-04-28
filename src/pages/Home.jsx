import "./Home.css";
import heroTitleArrow from "../assets/hero-title-arrow.png";
import heroTitleArrowDark from "../assets/hero-title-arrow-dark.png";
import FloatingIcons from "../components/FloatingIcons";

export default function Home() {
  return (
    <div className="home-container landing-panel landing-home-panel" id="home">
      <section className="home-hero home-section">
        <div className="heroOverlay" aria-hidden="true" />
        <FloatingIcons variant="home" />

        <div className="container">
          <div className="heroInner">
            <div className="kicker">It all starts with innovation</div>

            {/* Desktop / laptop / tablet combined image */}
            <div className="heroImageWrap">
              <img
                src={heroTitleArrow}
                alt="Building Digital Experiences"
                className="hero-title-img"
              />
            </div>

            <div className="heroImageWrap heroImageWrapDark">
              <img
                src={heroTitleArrowDark}
                alt="Building Digital Experiences"
                className="hero-title-img hero-title-img-dark"
              />
            </div>

            {/* Mobile fallback title */}
            <h1 className="mobileHeroTitle">
              Building Digital <br />
              Experiences
            </h1>

            <div className="btnRow">
              <button
                className="btn btnHero"
                onClick={() =>
                  document.getElementById("service-page")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore More
              </button>
            </div>

            <p className="leadStrong">Creative. Reliable. Innovative.</p>
            <p className="lead">
              NuraNova helps you build digital solutions, craft visual stories,
              and bring your ideas to life.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
