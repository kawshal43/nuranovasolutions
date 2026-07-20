import { useEffect, useRef, useState } from "react";
import "./About.css";

import heroImg from "../assets/first.png";
import blurImg from "../assets/h.png";

const TITLE = "More Than\nJust Code.";
const DESCRIPTION =
  'NuraNova Solutions is not just a company; it\'s a philosophy, a mindset, and a promise behind every line of code.';

const CAPABILITIES = [
  "Software",
  "Web & Apps",
  "Photography",
  "AI Video",
  "Design",
  "Marketing",
];

const REASONS = [
  {
    number: "01",
    title: "Many talents. One team.",
    text: "Developers, designers, media creators, photographers, and marketers work together around one clear goal.",
    accent: "blue",
  },
  {
    number: "02",
    title: "Everything stays connected.",
    text: "Your website, app, visuals, AI video, photography, and marketing feel like one brand—not separate pieces.",
    accent: "violet",
  },
  {
    number: "03",
    title: "Modern by default.",
    text: "We use current technology and smarter creative workflows to build work that is fast, relevant, and ready to grow.",
    accent: "cyan",
  },
  {
    number: "04",
    title: "Clear at every step.",
    text: "Easy discussions, regular progress updates, and a team that stays available keep your project simple to manage.",
    accent: "pink",
  },
  {
    number: "05",
    title: "Ownership from start to finish.",
    text: "We focus fully on every assignment, take responsibility for the details, and carry the work through to delivery.",
    accent: "orange",
  },
  {
    number: "06",
    title: "More value in one package.",
    text: "Flexible combination packages and reasonable pricing make it easier to access the right skills without managing many providers.",
    accent: "green",
  },
];

const WEBSITE_PACKAGES = {
  business: {
    label: "Business Websites",
    packages: {
      basic: {
        name: "Business Basic",
        price: "LKR 39,900",
        bestFor: "Best for small businesses",
        features: [
          "Up to 5 pages",
          "Mobile-responsive design",
          "Home, About, Services/Menu, Gallery and Contact pages",
          "Contact form and WhatsApp button",
          "Google Maps and social-media links",
          "Basic SEO setup",
          "First-year domain, hosting and SSL",
          "1 month support",
        ],
      },
      medium: {
        name: "Business Medium",
        price: "LKR 49,900",
        bestFor: "Best for online orders",
        features: [
          "Everything in Business Basic",
          "Up to 15 products or menu items",
          "Online orders",
          "Cart or order-request form",
          "Cash on delivery or bank transfer",
          "Product or menu management",
          "Admin dashboard",
          "2 months support",
        ],
      },
      premium: {
        name: "Business Premium",
        price: "LKR 69,900",
        bestFor: "Best for full online selling",
        recommended: true,
        features: [
          "Everything in Business Medium",
          "Up to 30 products or menu items",
          "Online payment integration",
          "Full e-commerce system",
          "Customer reviews",
          "Discount coupons",
          "Order management and status tracking",
          "3 months support",
        ],
      },
    },
  },
  hospitality: {
    label: "Hotel / Villa / Cabana",
    packages: {
      basic: {
        name: "Hotel Basic",
        price: "LKR 49,900",
        bestFor: "Best for small properties",
        features: [
          "Up to 6 pages",
          "Mobile-responsive design",
          "Home, About, Rooms, Gallery and Contact pages",
          "Room or property showcase",
          "Amenities section",
          "Contact form and WhatsApp button",
          "Google Maps, social links and basic SEO",
          "First-year domain, hosting and SSL",
          "1 month support",
        ],
      },
      medium: {
        name: "Hotel Medium",
        price: "LKR 79,900",
        bestFor: "Best for booking inquiries",
        features: [
          "Everything in Hotel Basic",
          "Up to 15 rooms, villas or cabanas",
          "Booking inquiry form",
          "Individual room pages and image gallery",
          "Seasonal rates or packages",
          "Inquiry management",
          "Admin dashboard and Google review section",
          "2 months support",
        ],
      },
      premium: {
        name: "Hotel Premium",
        price: "LKR 119,900",
        bestFor: "Best for full online booking",
        recommended: true,
        features: [
          "Everything in Hotel Medium",
          "Full online booking system",
          "Availability calendar",
          "Online payment integration",
          "Up to 30 units",
          "Customer reviews and promotional offers",
          "Booking-status management",
          "Optional multilingual setup",
          "3 months support",
        ],
      },
    },
  },
};

export default function About() {
  const wrapRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDescription, setTypedDescription] = useState("");
  const [compactCards, setCompactCards] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false,
  );
  const [openReason, setOpenReason] = useState(null);
  const [websiteType, setWebsiteType] = useState("business");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event) => {
      setCompactCards(event.matches);
      if (!event.matches) setOpenReason(null);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const revealTimer = window.setTimeout(() => {
        setTypedTitle(TITLE);
        setTypedDescription(DESCRIPTION);
      }, 0);
      return () => window.clearTimeout(revealTimer);
    }

    let titleIndex = 0;
    let descriptionIndex = 0;
    let descriptionTimer;

    const titleTimer = window.setInterval(() => {
      titleIndex += 1;
      setTypedTitle(TITLE.slice(0, titleIndex));

      if (titleIndex >= TITLE.length) {
        window.clearInterval(titleTimer);
        descriptionTimer = window.setInterval(() => {
          descriptionIndex += 1;
          setTypedDescription(DESCRIPTION.slice(0, descriptionIndex));
          if (descriptionIndex >= DESCRIPTION.length) {
            window.clearInterval(descriptionTimer);
          }
        }, 20);
      }
    }, 45);

    return () => {
      window.clearInterval(titleTimer);
      if (descriptionTimer) window.clearInterval(descriptionTimer);
    };
  }, [started]);

  const scrollToContact = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("contact")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const formatOriginalPrice = (price) => {
    const currentPrice = Number(price.replace(/\D/g, ""));
    const originalPrice = Math.round(currentPrice / 0.85 / 100) * 100;
    return `LKR ${originalPrice.toLocaleString("en-US")}`;
  };

  return (
    <section className={`about-page landing-panel landing-about-panel ${started ? "is-visible" : ""}`} id="about" ref={wrapRef}>
      <div className="about-hero">
        <div
          className="about-blur-bg"
          style={{ backgroundImage: `url(${blurImg})` }}
          aria-hidden="true"
        />

        <div className="about-hero-content">
          <h2 className="about-title" aria-label={TITLE.replace("\n", " ")}>
            <span aria-hidden="true">{typedTitle}</span>
            {started && <span className="about-caret" aria-hidden="true">|</span>}
          </h2>

          <p className="about-desc" aria-label={DESCRIPTION}>
            <span aria-hidden="true">{typedDescription}</span>
            {started && <span className="about-caret" aria-hidden="true">|</span>}
          </p>

          <button className="about-btn" onClick={scrollToContact} type="button">
            Contact Us
          </button>
        </div>

        <div className="about-hero-img">
          <img
            src={heroImg}
            alt="NuraNova digital creativity illustration"
            className={`about-hero-illustration ${started ? "is-floating" : ""}`}
            draggable="false"
          />
        </div>
      </div>

      <section className="why-us" aria-labelledby="why-us-title">
        <div className="why-us-orbit" aria-hidden="true" />

        <header className="why-us-heading">
          <span className="why-us-eyebrow">Why choose NuraNova?</span>
          <h2 id="why-us-title">
            One team. Every capability.
            <span> One easier journey.</span>
          </h2>
          <p>
            Everything your business needs—technology, creative, and marketing—from one trusted team.
          </p>
        </header>

        <div className="why-us-capabilities" aria-label="Our connected digital capabilities">
          {CAPABILITIES.map((capability, index) => (
            <span key={capability} style={{ "--chip-index": index }}>
              <i aria-hidden="true" />
              {capability}
            </span>
          ))}
        </div>

        <div className="why-us-grid">
          {REASONS.map((reason, index) => (
            <article
              className={`why-card why-card-${reason.accent} ${openReason === reason.number ? "is-open" : ""}`}
              key={reason.number}
              style={{ "--card-index": index }}
            >
              <button
                aria-controls={`why-card-details-${reason.number}`}
                aria-expanded={!compactCards || openReason === reason.number}
                className="why-card-toggle"
                disabled={!compactCards}
                onClick={() => setOpenReason((current) => (current === reason.number ? null : reason.number))}
                type="button"
              >
                <span className="why-card-number">{reason.number}</span>
                <h3>{reason.title}</h3>
                <span className="why-card-indicator" aria-hidden="true">
                  <i />
                </span>
              </button>
              <div className="why-card-details" id={`why-card-details-${reason.number}`}>
                <p>{reason.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="why-us-statement">
          <div>
            <span>Your idea</span>
            <strong>One focused team</strong>
          </div>
          <i aria-hidden="true">→</i>
          <p>
            <strong>Less coordination.</strong> More consistency, clearer communication, and better value from brief to launch.
          </p>
          <button className="why-us-cta" onClick={scrollToContact} type="button">
            Build with our team
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <section className="project-start" aria-labelledby="project-start-title">
        <header className="project-start-heading">
          <span>Website packages</span>
          <h2 id="project-start-title">Find the right website package.</h2>
          <p>Choose your website type, compare packages, and see what is included.</p>
        </header>

        <div className="project-browser">
          <div className="project-path-panel">
            <div className="web-package-selector">
                <div aria-label="Website type" className="web-package-types" role="group">
                  {Object.entries(WEBSITE_PACKAGES).map(([key, category]) => (
                    <button
                      className={websiteType === key ? "is-active" : ""}
                      key={key}
                      onClick={() => setWebsiteType(key)}
                      type="button"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>

                <div className="web-price-grid" key={websiteType}>
                  {Object.entries(WEBSITE_PACKAGES[websiteType].packages).map(([tier, websitePackage]) => (
                    <article className={`web-price-card ${tier === "premium" ? "is-premium" : ""}`} key={tier}>
                      <span className="web-price-discount">15% OFF</span>
                      <header>
                        <span>{tier === "premium" ? "★ Best Value" : `${tier} package`}</span>
                        <h3>{websitePackage.name}</h3>
                        <p>{websitePackage.bestFor}</p>
                      </header>

                      <div className="web-price-amount">
                        <small>{formatOriginalPrice(websitePackage.price)}</small>
                        <strong>{websitePackage.price}</strong>
                        <span>Limited offer price</span>
                      </div>

                      <div className="web-price-included">Domain, hosting &amp; SSL included</div>

                      <ul>
                        {websitePackage.features.map((feature) => (
                          <li key={feature}>
                            <i aria-hidden="true">✓</i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
