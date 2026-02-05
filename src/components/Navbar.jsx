import { useEffect, useState, useRef } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navRef = useRef(null);
  const itemRefs = useRef({});

  // 1. Observer for Scroll Highlighting
  useEffect(() => {
    const sections = ["home", "service-page", "about", "contact"];
    const ratios = {};

    const observer = new IntersectionObserver(
      (entries) => {
        // Update ratios for changed entries
        entries.forEach((entry) => {
          ratios[entry.target.id] = entry.intersectionRatio;
        });

        // Find section with highest ratio
        const best = Object.keys(ratios).reduce((a, b) => {
          return (ratios[a] || 0) > (ratios[b] || 0) ? a : b;
        }, activeLink);

        // Only update if significantly visible (e.g. > 10%)
        if (ratios[best] > 0.1) {
          setActiveLink(best);
        }
      },
      {
        root: null,
        rootMargin: "0px", // Use full viewport
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] // Granular updates
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 2. Update Fluid Highlight Pill Position
  useEffect(() => {
    const updateIndicator = () => {
      const activeItem = itemRefs.current[activeLink];
      if (activeItem) {
        const { offsetLeft, offsetWidth } = activeItem;
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth,
          opacity: 1,
        });
      }
    };

    // Run immediately
    updateIndicator();

    // Run after a small delay to ensure layout is settled (fixes initial load)
    const timer = setTimeout(updateIndicator, 100);

    // Run on resize
    window.addEventListener("resize", updateIndicator);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeLink, menuOpen]);

  const handleScroll = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Instant update for better feel, though observer will confirm
      setActiveLink(id);
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "service-page", label: "Services" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* BRAND */}
        <div className="brand" onClick={(e) => handleScroll(e, "home")} style={{ cursor: "pointer" }}>
          <img src="/Logo.PNG" alt="NuraNova Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-main">NuraNova</span>
            <span className="brand-sub">SOLUTIONS</span>
          </div>
        </div>

        {/* HAMBURGER */}
        <button
          className={`menu-btn ${menuOpen ? "is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          type="button"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        {/* LINKS */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`} ref={navRef}>
          {/* Fluid Indicator */}
          <li
            className="nav-highlight"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              opacity: indicatorStyle.opacity
            }}
          />

          {navItems.map((item) => (
            <li key={item.id} ref={(el) => (itemRefs.current[item.id] = el)}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleScroll(e, item.id)}
                className={activeLink === item.id ? "active" : ""}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
