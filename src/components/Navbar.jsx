import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("/");
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navRef = useRef(null);
  const itemRefs = useRef({});

  // Sync activeLink with URL path
  useEffect(() => {
    setActiveLink(location.pathname);
    setMenuOpen(false); // Close menu on route change
  }, [location]);

  // Update Fluid Highlight Pill Position
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
      } else {
        // Fallback or hide if no match
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    const timer = setTimeout(updateIndicator, 100);
    window.addEventListener("resize", updateIndicator);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeLink, menuOpen]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* BRAND */}
        <Link to="/" className="brand">
          <img src="/Logo.PNG" alt="NuraNova Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-main">NuraNova</span>
            <span className="brand-sub">SOLUTIONS</span>
          </div>
        </Link>

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
            <li key={item.path} ref={(el) => (itemRefs.current[item.path] = el)}>
              <Link
                to={item.path}
                className={activeLink === item.path ? "active" : ""}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
