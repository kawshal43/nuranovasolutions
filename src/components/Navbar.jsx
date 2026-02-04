import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when route changes (because <a> reloads) or when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const linkClass = (path) => (currentPath === path ? "active" : "");

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* BRAND */}
        <div className="brand">
          <img src="public/Logo.png" alt="NuraNova Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-main">NuraNova</span>
            <span className="brand-sub">SOLUTIONS</span>
          </div>
        </div>

        {/* HAMBURGER (mobile) */}
        <button
          className="menu-btn"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          type="button"
        >
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
          <span className={`bar ${menuOpen ? "open" : ""}`} />
        </button>

        {/* LINKS */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" className={linkClass("/")}>Home</Link>
          </li>
          <li>
            <Link to="/services" className={linkClass("/services")}>Services</Link>
          </li>
          <li>
            <Link to="/about" className={linkClass("/about")}>About Us</Link>
          </li>
          <li>
            <Link to="/contact" className={linkClass("/contact")}>Contact</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
