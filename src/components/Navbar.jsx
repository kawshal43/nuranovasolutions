import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [pillStyle, setPillStyle] = useState({ opacity: 0 });

  const navRefs = useRef([]);
  const headerRef = useRef(null);

  // ✅ IMPORTANT: Contact id must match your Contact.jsx section id
  const items = [
    { name: "Home", id: "home" },
    { name: "Services", id: "services" },
    { name: "About Us", id: "about" },
    { name: "Contact", id: "get-in-touch" }, // <-- YOUR CONTACT SECTION ID
  ];

  // Close menu when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ESC close + body lock when menu open
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Smooth scroll with sticky navbar offset
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return false;

    const navH = headerRef.current?.offsetHeight || 70;
    const y = el.getBoundingClientRect().top + window.scrollY - navH - 10;

    window.scrollTo({ top: y, behavior: "smooth" });
    return true;
  };

  // Click handler
  const handleClick = (id) => {
    // If user is not on home route, go home with hash
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    window.history.pushState({}, "", `#${id}`);

    // Retry until element exists (for safety)
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      const ok = scrollToSection(id);
      if (ok || tries > 40) clearInterval(timer);
    }, 50);

    setActive(id);
    setMenuOpen(false);
  };

  // On refresh / direct link #hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      const ok = scrollToSection(hash);
      if (ok || tries > 60) clearInterval(timer);
    }, 50);

    setActive(hash);
  }, []);

  // Desktop pill movement
  const movePill = () => {
    if (window.innerWidth < 768) {
      setPillStyle({ opacity: 0 });
      return;
    }

    const index = items.findIndex((i) => i.id === active);
    const li = navRefs.current[index];
    if (!li) return;

    const a = li.querySelector("a");
    if (!a) return;

    // modify size if needed
    const widthModifier = 0;
    const heightModifier = -4;

    setPillStyle({
      left: li.offsetLeft + a.offsetLeft - widthModifier / 2,
      top: li.offsetTop + a.offsetTop - heightModifier / 2,
      width: a.offsetWidth + widthModifier,
      height: a.offsetHeight + heightModifier,
      opacity: 1,
    });
  };

  useLayoutEffect(() => {
    requestAnimationFrame(movePill);
    window.addEventListener("resize", movePill);
    return () => window.removeEventListener("resize", movePill);
  }, [active, menuOpen]);

  return (
    <header className="navbar" ref={headerRef}>
      <div className="navbar-container">
        {/* BRAND */}
        <div className="brand" onClick={() => handleClick("home")}>
          <img src="public/Logo.png" alt="Logo" className="brand-logo" />
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

        {/* OVERLAY (optional - needs CSS .nav-overlay) */}
        {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <div className="nav-pill" style={pillStyle} />

          {items.map((item, i) => (
            <li
              key={item.id}
              className="nav-item"
              ref={(el) => (navRefs.current[i] = el)}
              style={{ "--d": `${i * 90}ms` }}
            >
              <a
                href={`#${item.id}`}
                className={active === item.id ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(item.id);
                }}
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