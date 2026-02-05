import { useEffect, useState, useRef } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillStyle, setPillStyle] = useState({ opacity: 0 });
  const navRefs = useRef([]);

  // Close menu when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const items = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Logic to move the pill
  const movePill = () => {
    const activeIndex = items.findIndex((item) => item.path === currentPath);
    const activeLi = navRefs.current[activeIndex];

    if (activeLi) {
      const link = activeLi.querySelector("a");
      if (link) {
        // ADJUST THESE VALUES TO CHANGE PILL SIZE
        const widthModifier = 0; // Add or subtract width (e.g., 10 or -10)
        const heightModifier = -4; // Add or subtract height

        setPillStyle({
          left: activeLi.offsetLeft + link.offsetLeft - widthModifier / 2,
          top: activeLi.offsetTop + link.offsetTop - heightModifier / 2,
          width: link.offsetWidth + widthModifier,
          height: link.offsetHeight + heightModifier,
          opacity: 1,
        });
      }
    } else {
      setPillStyle({ opacity: 0 });
    }
  };

  // Update pill position when currentPath changes AND on window resize
  useEffect(() => {
    // Initial calculate
    requestAnimationFrame(movePill);

    // Listen for resize to re-calculate position
    const onResize = () => requestAnimationFrame(movePill);
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [currentPath, menuOpen]);

  // Handle click to prevent reload for demo
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    setMenuOpen(false);
  };

  const linkClass = (path) => (currentPath === path ? "active" : "");

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* BRAND */}
        <div className="brand">
          {/* Vite public folder image path */}
          <img src="public/Logo.png" alt="NuraNova Logo" className="brand-logo" />
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

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <div className="nav-pill" style={pillStyle} />
          {items.map((item, i) => (
            <li
              key={item.path}
              className="nav-item"
              ref={(el) => (navRefs.current[i] = el)}
              style={{ "--d": `${i * 90}ms` }} // stagger delay
            >
              <a
                href={item.path}
                className={linkClass(item.path)}
                onClick={(e) => handleLinkClick(e, item.path)}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;