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

function ThemeIcon({ theme }) {
  if (theme === "dark") {
    return (
      <svg aria-hidden="true" className="theme-toggle-icon" viewBox="0 0 24 24">
        <path
          d="M14.5 3.5c-1 1.4-1.5 3-1.5 4.8 0 4.5 3.7 8.2 8.2 8.2.5 0 1 0 1.5-.1-1.4 2.5-4 4.1-7 4.1-4.4 0-8-3.6-8-8 0-3 1.7-5.7 4.3-7z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="theme-toggle-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" fill="currentColor" r="4.5" />
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8">
        <path d="M12 2.75v2.5" />
        <path d="M12 18.75v2.5" />
        <path d="M2.75 12h2.5" />
        <path d="M18.75 12h2.5" />
        <path d="M5.45 5.45l1.8 1.8" />
        <path d="M16.75 16.75l1.8 1.8" />
        <path d="M5.45 18.55l1.8-1.8" />
        <path d="M16.75 7.25l1.8-1.8" />
      </g>
    </svg>
  );
}

export default function Navbar({ theme, onToggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [pillStyle, setPillStyle] = useState({ opacity: 0 });
  const [user, setUser] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(76);
  const [isTopBarHidden, setIsTopBarHidden] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(false);

  const navRefs = useRef([]);
  const headerRef = useRef(null);
  const accountMenuRef = useRef(null);
  const pendingScrollRef = useRef(null);
  const firstRootLoadRef = useRef(true);
  const initialHashHandledRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const mobileNavDismissUntilRef = useRef(0);

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
    void Promise.resolve().then(loadSession);

    const handleAuthChanged = () => {
      loadSession();
    };

    window.addEventListener("nuranova-auth-changed", handleAuthChanged);
    return () => window.removeEventListener("nuranova-auth-changed", handleAuthChanged);
  }, [loadSession]);

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
    let frame = null;

    const syncTopBar = () => {
      frame = null;

      if (window.innerWidth >= 768) {
        lastScrollYRef.current = window.scrollY;
        setIsTopBarHidden(false);
        setIsBottomNavVisible(false);
        return;
      }

      const nextScrollY = Math.max(window.scrollY, 0);
      const lastScrollY = lastScrollYRef.current;
      const delta = nextScrollY - lastScrollY;

      if (nextScrollY <= 12 || delta < -8) {
        setIsTopBarHidden(false);
        setIsBottomNavVisible(false);
      } else if (delta > 8 && nextScrollY > headerHeight) {
        setIsTopBarHidden(true);
        setIsBottomNavVisible(Date.now() >= mobileNavDismissUntilRef.current);
        setAccountMenuOpen(false);
      }

      lastScrollYRef.current = nextScrollY;
    };

    const scheduleSync = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(syncTopBar);
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [headerHeight]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (location.pathname.startsWith("/services/")) {
        setActive("service-page");
        return;
      }

      const hash = location.hash.replace("#", "");
      if (firstRootLoadRef.current) {
        firstRootLoadRef.current = false;
        if (hash) {
          window.history.replaceState({}, "", `${location.pathname}${location.search}`);
          window.scrollTo({ top: 0, behavior: "auto" });
        }
        setActive("home");
        return;
      }

      setActive(hash || "home");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname, location.search]);

  const updateActiveSection = useCallback(() => {
    if (location.pathname !== "/") {
      return;
    }

    const sections = ITEMS.map(({ id }) => document.querySelector(`[id="${id}"]`)).filter(Boolean);
    if (!sections.length) {
      return;
    }

    const navHeight = headerRef.current?.offsetHeight || headerHeight || 70;
    const viewportTrigger = Math.min(Math.max(window.innerHeight * 0.16, 80), 150);
    const scrollMarker = window.scrollY + navHeight + viewportTrigger;
    const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const isNearBottom = window.scrollY + window.innerHeight >= pageHeight - 8;
    const pendingTargetId = pendingScrollRef.current;
    const homeSection = sections.find((section) => section.id === "home");

    if (!pendingTargetId && homeSection) {
      const homeBottom = homeSection.offsetTop + homeSection.offsetHeight;
      const topZoneEnd = Math.max(navHeight + 48, homeBottom - viewportTrigger);
      if (window.scrollY + navHeight < topZoneEnd) {
        setActive((current) => (current === "home" ? current : "home"));
        return;
      }
    }

    if (!pendingTargetId && window.scrollY <= 16) {
      setActive((current) => (current === "home" ? current : "home"));
      return;
    }

    if (pendingTargetId) {
      const pendingTarget = sections.find((section) => section.id === pendingTargetId);

      if (!pendingTarget) {
        pendingScrollRef.current = null;
      } else {
        const targetY = pendingTarget.getBoundingClientRect().top + window.scrollY - navHeight - 10;
        const reachedTarget = Math.abs(window.scrollY - targetY) <= 24;

        if (!reachedTarget) {
          setActive((current) => (current === pendingTargetId ? current : pendingTargetId));
          return;
        }

        pendingScrollRef.current = null;
      }
    }

    let nextActive = sections[0].id;

    for (const section of sections) {
      if (scrollMarker >= section.offsetTop) {
        nextActive = section.id;
        continue;
      }

      break;
    }

    if (isNearBottom) {
      nextActive = sections[sections.length - 1].id;
    }

    setActive((current) => (current === nextActive ? current : nextActive));
  }, [headerHeight, location.pathname]);

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
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        mobileNavDismissUntilRef.current = Date.now() + 1200;
      }

      if (location.pathname !== "/") {
        window.location.href = `/#${id}`;
        return;
      }

      pendingScrollRef.current = id;
      window.history.pushState({}, "", `#${id}`);

      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        const ok = scrollToSection(id);
        if (ok || tries > 40) clearInterval(timer);
      }, 50);

      setActive(id);
      setIsTopBarHidden(false);
      setIsBottomNavVisible(false);
      setAccountMenuOpen(false);
    },
    [location.pathname, scrollToSection]
  );

  useEffect(() => {
    if (location.pathname !== "/") return undefined;

    const hash = location.hash.replace("#", "");
    if (!hash) return undefined;

    if (!initialHashHandledRef.current) {
      initialHashHandledRef.current = true;
      return undefined;
    }

    pendingScrollRef.current = hash;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const ok = scrollToSection(hash);
      if (ok || tries > 60) clearInterval(timer);
    }, 50);

    return () => clearInterval(timer);
  }, [location.hash, location.pathname, scrollToSection]);

  useEffect(() => {
    if (location.pathname !== "/") {
      return undefined;
    }

    let frame = null;

    const syncActiveSection = () => {
      frame = null;
      updateActiveSection();
    };

    const scheduleSync = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(syncActiveSection);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("load", scheduleSync);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("load", scheduleSync);
    };
  }, [location.pathname, updateActiveSection]);

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

    const pillPaddingX = 4;
    const pillPaddingY = 2;

    setPillStyle({
      left: li.offsetLeft + anchor.offsetLeft - pillPaddingX,
      top: li.offsetTop + anchor.offsetTop - pillPaddingY,
      width: anchor.offsetWidth + pillPaddingX * 2,
      height: anchor.offsetHeight + pillPaddingY * 2,
      opacity: 1,
    });
  }, [active]);

  useLayoutEffect(() => {
    const scheduleMovePill = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(movePill);
      });
    };

    const frame = requestAnimationFrame(movePill);
    const navLinks = headerRef.current?.querySelector(".nav-links");
    const activeIndex = ITEMS.findIndex((item) => item.id === active);
    const activeAnchor = navRefs.current[activeIndex]?.querySelector("a");
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleMovePill) : null;

    if (resizeObserver) {
      if (navLinks) resizeObserver.observe(navLinks);
      if (activeAnchor) resizeObserver.observe(activeAnchor);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleMovePill).catch(() => {});
    }

    window.addEventListener("resize", movePill);
    window.addEventListener("load", scheduleMovePill);
    window.addEventListener("pageshow", scheduleMovePill);
    scheduleMovePill();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", movePill);
      window.removeEventListener("load", scheduleMovePill);
      window.removeEventListener("pageshow", scheduleMovePill);
      resizeObserver?.disconnect();
    };
  }, [active, movePill]);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return undefined;
    }

    const updateHeaderHeight = () => {
      setHeaderHeight(header.offsetHeight || 76);
    };

    updateHeaderHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateHeaderHeight) : null;

    resizeObserver?.observe(header);
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

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
    navigate(`/services/education-tutorials?panel=profile&tab=${tab}`);
  }

  function openEducationWorkspace(workspace) {
    setAccountMenuOpen(false);
    navigate(`/services/education-tutorials?workspace=${workspace}`);
  }

  const avatarSrc = resolveApiAssetUrl(user?.avatarUrl);

  return (
    <>
      <div aria-hidden="true" className="navbar-spacer" style={{ height: `${headerHeight}px` }} />

      <header
        className={`navbar ${isTopBarHidden ? "is-mobile-hidden" : ""}`}
        ref={headerRef}
        style={{ "--navbar-height": `${headerHeight}px` }}
      >
        <div className="navbar-container">
          <div className="brand" onClick={() => handleClick("home")}>
            <img src="/Logo.PNG" alt="Logo" className="brand-logo" />
            <div className="brand-text">
              <span className="brand-main">NuraNova</span>
              <span className="brand-sub">SOLUTIONS</span>
            </div>
          </div>

          <ul className="nav-links">
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
                  aria-current={active === item.id ? "page" : undefined}
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
              onMouseDown={(event) => event.preventDefault()}
              onPointerUp={(event) => event.currentTarget.blur()}
              type="button"
            >
                <span className="theme-toggle-track">
                  <span className={`theme-toggle-thumb ${theme === "dark" ? "is-dark" : ""}`}>
                    <ThemeIcon theme={theme} />
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

          </div>
        </div>
      </header>

      <nav
        className={`mobile-bottom-nav ${isBottomNavVisible ? "is-visible" : ""}`}
        aria-label="Mobile primary navigation"
      >
        {ITEMS.slice(0, 2).map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? "page" : undefined}
            className={active === item.id ? "active" : ""}
            onClick={(event) => {
              event.preventDefault();
              handleClick(item.id);
            }}
          >
            {item.name}
          </a>
        ))}

        <button
          aria-label="Go to home"
          className="mobile-nav-logo"
          onClick={() => handleClick("home")}
          type="button"
        >
          <img src="/Logo.PNG" alt="" aria-hidden="true" />
        </button>

        {ITEMS.slice(2).map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={active === item.id ? "page" : undefined}
            className={active === item.id ? "active" : ""}
            onClick={(event) => {
              event.preventDefault();
              handleClick(item.id);
            }}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </>
  );
}


