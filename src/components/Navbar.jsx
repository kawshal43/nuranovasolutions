import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, resolveApiAssetUrl } from "../lib/educationApi";
import "./Navbar.css";

const ITEMS = [
  { name: "Home", id: "home" },
  { name: "Services", id: "service-page" },
  { name: "About Us", id: "about" },
  { name: "Contact", id: "contact" },
];

function getInitials(user) {
  const source = user?.fullName || user?.username || "NN";
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function isAdminUser(user) {
  return user?.role === "ADMIN";
}

export default function Navbar({ theme, onToggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [pillStyle, setPillStyle] = useState({ opacity: 0 });
  const [user, setUser] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navRefs = useRef([]);
  const headerRef = useRef(null);
  const accountMenuRef = useRef(null);

  const loadSession = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
        return;
      }
    }
  }, []);

  useEffect(() => {
    loadSession();

    const handleAuthChanged = () => {
      loadSession();
    };

    window.addEventListener("nuranova-auth-changed", handleAuthChanged);
    return () => window.removeEventListener("nuranova-auth-changed", handleAuthChanged);
  }, [loadSession]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!accountMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (accountMenuRef.current?.contains(event.target)) {
        return;
      }

      setAccountMenuOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountMenuOpen]);

  useEffect(() => {
    if (location.pathname.startsWith("/services/")) {
      setActive("service-page");
      return;
    }

    const hash = location.hash.replace("#", "");
    setActive(hash || "home");
  }, [location.hash, location.pathname]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return false;

    const navHeight = headerRef.current?.offsetHeight || 70;
    const y = el.getBoundingClientRect().top + window.scrollY - navHeight - 10;

    window.scrollTo({ top: y, behavior: "smooth" });
    return true;
  }, []);

  const handleClick = useCallback(
    (id) => {
      if (location.pathname !== "/") {
        window.location.href = `/#${id}`;
        return;
      }

      window.history.pushState({}, "", `#${id}`);

      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        const ok = scrollToSection(id);
        if (ok || tries > 40) clearInterval(timer);
      }, 50);

      setActive(id);
      setMenuOpen(false);
      setAccountMenuOpen(false);
    },
    [location.pathname, scrollToSection]
  );

  useEffect(() => {
    if (location.pathname !== "/") return undefined;

    const hash = location.hash.replace("#", "");
    if (!hash) return undefined;

    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const ok = scrollToSection(hash);
      if (ok || tries > 60) clearInterval(timer);
    }, 50);

    return () => clearInterval(timer);
  }, [location.hash, location.pathname, scrollToSection]);

  const movePill = useCallback(() => {
    if (window.innerWidth < 768) {
      setPillStyle({ opacity: 0 });
      return;
    }

    const index = ITEMS.findIndex((item) => item.id === active);
    const li = navRefs.current[index];
    if (!li) return;

    const anchor = li.querySelector("a");
    if (!anchor) return;

    setPillStyle({
      left: li.offsetLeft + anchor.offsetLeft,
      top: li.offsetTop + anchor.offsetTop + 2,
      width: anchor.offsetWidth,
      height: anchor.offsetHeight - 4,
      opacity: 1,
    });
  }, [active]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(movePill);
    window.addEventListener("resize", movePill);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", movePill);
    };
  }, [menuOpen, movePill]);

  async function handleNavbarLogout() {
    try {
      await logoutUser();
      setUser(null);
      setAccountMenuOpen(false);
      window.dispatchEvent(new Event("nuranova-auth-changed"));
      navigate("/");
    } catch {
      setAccountMenuOpen(false);
    }
  }

  function openProfile(tab = "information") {
    setAccountMenuOpen(false);
    setMenuOpen(false);
    navigate(`/services/education-tutorials?panel=profile&tab=${tab}`);
  }

  function openEducationWorkspace(workspace) {
    setAccountMenuOpen(false);
    setMenuOpen(false);
    navigate(`/services/education-tutorials?workspace=${workspace}`);
  }

  const avatarSrc = resolveApiAssetUrl(user?.avatarUrl);

  return (
    <header className="navbar" ref={headerRef}>
      <div className="navbar-container">
        <div className="brand" onClick={() => handleClick("home")}>
          <img src="/Logo.PNG" alt="Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-main">NuraNova</span>
            <span className="brand-sub">SOLUTIONS</span>
          </div>
        </div>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <div className="nav-pill" style={pillStyle} />

          {ITEMS.map((item, index) => (
            <li
              key={item.id}
              className="nav-item"
              ref={(element) => {
                navRefs.current[index] = element;
              }}
              style={{ "--d": `${index * 90}ms` }}
            >
              <a
                href={`#${item.id}`}
                className={active === item.id ? "active" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  handleClick(item.id);
                }}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="theme-toggle"
            onClick={onToggleTheme}
            type="button"
          >
            <span className="theme-toggle-track">
              <span className={`theme-toggle-thumb ${theme === "dark" ? "is-dark" : ""}`}>
                {theme === "dark" ? "M" : "N"}
              </span>
            </span>
          </button>

          {user ? (
            <div className="navbar-account" ref={accountMenuRef}>
              <button
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                className={`navbar-account-trigger ${accountMenuOpen ? "is-open" : ""}`}
                onClick={() => setAccountMenuOpen((current) => !current)}
                type="button"
              >
                <span className="navbar-account-avatar" aria-hidden="true">
                  {avatarSrc ? <img alt="" src={avatarSrc} /> : <span>{getInitials(user)}</span>}
                </span>
              </button>

              {accountMenuOpen ? (
                <div className="navbar-account-menu" role="menu">
                  <div className="navbar-account-menu-head">
                    <strong>{getInitials(user)}</strong>
                    <button aria-label="Close account menu" onClick={() => setAccountMenuOpen(false)} type="button">
                      x
                    </button>
                  </div>

                  <button className="navbar-account-item" onClick={() => openProfile("information")} role="menuitem" type="button">
                    Go to profile
                  </button>
                  {isAdminUser(user) ? (
                    <>
                      <button className="navbar-account-item" onClick={() => openEducationWorkspace("admin")} role="menuitem" type="button">
                        Admin Panel
                      </button>
                      <button className="navbar-account-item" onClick={() => openEducationWorkspace("learn")} role="menuitem" type="button">
                        Learner View
                      </button>
                    </>
                  ) : null}
                  <button className="navbar-account-item" onClick={() => openProfile("password")} role="menuitem" type="button">
                    Settings
                  </button>
                  <button className="navbar-account-item" onClick={() => handleClick("contact")} role="menuitem" type="button">
                    Help
                  </button>
                  <button className="navbar-account-item is-danger" onClick={handleNavbarLogout} role="menuitem" type="button">
                    Log Out
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          <button
            className={`menu-btn ${menuOpen ? "is-open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>

        {menuOpen ? <div className="nav-overlay" onClick={() => setMenuOpen(false)} /> : null}
      </div>
    </header>
  );
}
