import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getServiceBySlug } from "../data/services";
import EducationPlatform from "./EducationPlatform";
import CreativeServiceDetail from "./CreativeServiceDetail";
import ServiceHeroScene from "../components/ServiceHeroScene";
import webBg from "../assets/web_bg.png";
import "./ServiceDetail.css";

function getProjectHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  const pageRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(null);

  const previewMedia = service?.previewMedia ?? {
    type: "image",
    src: service?.image,
    alt: service?.title,
  };
  const portfolioProjects = service?.portfolioProjects ?? [];
  const isSoftwareShowcase = service?.solutionType === "software-showcase-premium";
  const activePreview =
    activePreviewIndex === null ? null : portfolioProjects[activePreviewIndex] ?? null;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const revealNodes = page.querySelectorAll("[data-reveal]");
    if (!revealNodes.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [slug]);

  useEffect(() => {
    const resetTimer = window.setTimeout(() => {
      setOpenFaq(null);
      setActivePreviewIndex(null);
    }, 0);

    return () => window.clearTimeout(resetTimer);
  }, [slug]);

  useEffect(() => {
    if (activePreviewIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActivePreviewIndex(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePreviewIndex]);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  if (service.slug === "education-tutorials") {
    return <EducationPlatform service={service} />;
  }

  if (["video-production-editing", "photography-services"].includes(service.slug)) {
    return <CreativeServiceDetail service={service} />;
  }

  return (
    <main
      className="service-detail-page"
      data-service-variant={service.solutionType ?? "default"}
      ref={pageRef}
    >
      <div className="service-detail-backdrop" aria-hidden="true" />

      <section className="service-detail-hero">
        <div className="service-hero-copy" data-reveal="hero-left">
          <span className="service-detail-eyebrow" data-reveal="fade-up" style={{ "--reveal-delay": "80ms" }}>
            {service.eyebrow}
          </span>
          {isSoftwareShowcase ? (
            <div className="software-hero-mobile-art" aria-hidden="true">
              <span className="software-hero-mobile-glow glow-one" />
              <span className="software-hero-mobile-glow glow-two" />
              <span className="software-hero-mobile-card card-main" />
              <span className="software-hero-mobile-card card-top" />
              <span className="software-hero-mobile-card card-small" />
              <span className="software-hero-mobile-orb" />
            </div>
          ) : null}
          {isSoftwareShowcase ? (
            <h1 className="software-hero-title">
              <span className="software-hero-line">Websites That Look Sharp,</span>
              <span className="software-hero-line">
                Load Fast, and <span className="service-hero-accent service-hero-accent-primary">Grow</span>
              </span>
              <span className="software-hero-line">
                <span className="service-hero-accent service-hero-accent-secondary">Your Business.</span>
              </span>
            </h1>
          ) : (
            <h1>{service.title}</h1>
          )}
          <p className="service-detail-subtitle">{service.subtitle}</p>

          <div className="service-detail-cta-row" data-reveal="fade-up" style={{ "--reveal-delay": "140ms" }}>
            <a className="service-detail-btn primary" href={service.heroPrimaryCtaHref ?? "#service-contact"}>
              {service.heroPrimaryCtaLabel ?? "Start a Project"}
            </a>
            {isSoftwareShowcase ? (
              <a className="service-detail-btn secondary" href={service.heroSecondaryCtaHref ?? "#service-contact"}>
                {service.heroSecondaryCtaLabel ?? "Get a Free Quote"}
              </a>
            ) : (
              <Link className="service-detail-btn secondary" to="/#service-page">
                Back to Services
              </Link>
            )}
          </div>

          {isSoftwareShowcase ? (
            <div className="software-hero-mobile-chips" data-reveal="fade-up" style={{ "--reveal-delay": "200ms" }}>
              {service.heroStats.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}

          <div className="service-detail-stat-row" data-reveal="fade-up" style={{ "--reveal-delay": "220ms" }}>
            {service.heroStats.map((item) => (
              <span className="service-detail-stat" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="service-hero-visual" data-reveal="hero-right" style={{ "--reveal-delay": "140ms" }}>
          {isSoftwareShowcase ? (
            <div className="software-hero-stage" aria-label="Website preview across desktop and mobile">
              <span className="software-hero-ambient ambient-left" aria-hidden="true" />
              <span className="software-hero-ambient ambient-right" aria-hidden="true" />
              <span className="software-hero-spark spark-one" aria-hidden="true" />
              <span className="software-hero-spark spark-two" aria-hidden="true" />
              <span className="software-hero-spark spark-three" aria-hidden="true" />
              <img
                alt="NuraNova software and website experience preview"
                className="software-hero-device-shot"
                src={webBg}
              />
            </div>
          ) : (
            <>
              <div
                className="service-hero-glow"
                style={{
                  "--accent-primary": service.accent.primary,
                  "--accent-secondary": service.accent.secondary,
                }}
                aria-hidden="true"
              />

              <div className="service-scene-shell">
                <div
                  className="service-scene-backdrop"
                  style={{
                    "--accent-primary": service.accent.primary,
                    "--accent-secondary": service.accent.secondary,
                    "--accent-glow": service.accent.glow,
                  }}
                  aria-hidden="true"
                />
                <ServiceHeroScene accent={service.accent} />
                <div className="service-scene-illusion" aria-hidden="true">
                  <span className="scene-orb orb-a" />
                  <span className="scene-orb orb-b" />
                  <span className="scene-ring ring-outer" />
                  <span className="scene-ring ring-middle" />
                  <span className="scene-ring ring-inner" />
                  <span className="scene-panel panel-one" />
                  <span className="scene-panel panel-two" />
                </div>

                <div className="service-preview-card" data-reveal="float-card" style={{ "--reveal-delay": "260ms" }}>
                  <div className="service-preview-topline">{service.heroPreviewLabel ?? "Premium service preview"}</div>
                  <div className="service-preview-image-wrap">
                    {previewMedia.type === "video" ? (
                      <video
                        autoPlay={previewMedia.autoplay ?? false}
                        className="service-preview-media"
                        controls
                        loop={previewMedia.loop ?? false}
                        muted={previewMedia.muted ?? true}
                        playsInline
                        poster={previewMedia.poster}
                        preload="metadata"
                        src={previewMedia.src}
                      />
                    ) : (
                      <img
                        alt={previewMedia.alt ?? service.title}
                        className="service-preview-media"
                        src={previewMedia.src}
                      />
                    )}
                  </div>
                  <div className="service-preview-copy">
                    <strong>{service.title}</strong>
                    <p>
                      {previewMedia.type === "video"
                        ? "This preview card is video-ready. You can later swap the current media for a service video without changing the layout."
                        : service.heroPreviewSummary ?? service.overview}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {isSoftwareShowcase ? (
        <>
          {portfolioProjects.length ? (
            <section className="service-detail-section software-showcase-section" id="software-showcase">
              <div className="section-heading software-showcase-heading" data-reveal="fade-up">
                <span>Live website showcase</span>
                <h2>Explore real projects with larger previews and clearer flow</h2>
                <p>
                  Each project is presented like a product experience, so visitors can understand the
                  look, purpose, and interaction quality before opening the full website.
                </p>
              </div>

              <div className="software-project-list">
                {portfolioProjects.map((project, index) => {
                  const showFallback = project.previewMode === "restricted";
                  const isReversed = index % 2 === 1;
                  const previewHost = getProjectHost(project.url);

                  return (
                    <article
                      className={`software-project-row${isReversed ? " is-reversed" : ""}`}
                      key={project.name}
                    >
                      <div
                        className="software-project-visual"
                        data-reveal={isReversed ? "section-left" : "section-right"}
                        style={{ "--reveal-delay": `${index * 70 + 100}ms` }}
                      >
                        <div className="software-project-preview-shell">
                          <div className="software-project-frame-toolbar">
                            <div className="software-project-browser-dots" aria-hidden="true">
                              <span />
                              <span />
                              <span />
                            </div>
                            <span className="software-project-frame-site">{previewHost}</span>
                            {!showFallback ? (
                              <span className="software-project-frame-open">Click preview to enlarge</span>
                            ) : null}
                          </div>

                          {showFallback ? (
                            <div className="software-project-frame software-project-frame-fallback">
                              <span className="software-project-frame-badge">Preview restricted</span>
                              <h3>{project.name}</h3>
                              <p>{project.previewNote}</p>
                              <button
                                className="software-project-frame-action"
                                onClick={() => setActivePreviewIndex(index)}
                                type="button"
                              >
                                Open Full Preview
                              </button>
                            </div>
                          ) : (
                            <button
                              className="software-project-frame"
                              onClick={() => setActivePreviewIndex(index)}
                              type="button"
                            >
                              <div className="software-project-frame-stage">
                                <iframe
                                  className="software-project-iframe"
                                  loading="lazy"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  src={project.url}
                                  tabIndex={-1}
                                  title={`${project.name} live preview`}
                                />
                              </div>
                              <span className="software-project-frame-hint">Open live preview</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div
                        className="software-project-copy"
                        data-reveal={isReversed ? "section-right" : "section-left"}
                        style={{ "--reveal-delay": `${index * 70}ms` }}
                      >
                        <div className="software-project-copy-top">
                          <span className="software-project-index">
                            {project.accentLabel ?? String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="software-project-heading">
                            <h2>{project.name}</h2>
                            <p className="software-project-category">{project.category}</p>
                          </div>
                        </div>
                        <p className="software-project-description">{project.description}</p>

                        <ul className="software-project-features">
                          {project.tech.map((item) => (
                            <li key={item}>
                              <span className="software-project-feature-mark" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        {showFallback ? <p className="portfolio-preview-note">{project.previewNote}</p> : null}

                        <div className="software-project-actions">
                          <a
                            className="service-detail-btn primary"
                            href={project.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {project.primaryActionLabel ?? "View Website"}
                          </a>
                          <a className="service-detail-btn secondary" href="#service-contact">
                            <span>{project.secondaryActionLabel ?? "Start Similar Project"}</span>
                            <span aria-hidden="true" className="software-project-action-arrow">
                              -&gt;
                            </span>
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {service.pricingPlans?.length ? (
            <section className="service-detail-section software-pricing-section">
              <div className="section-heading software-pricing-heading" data-reveal="fade-up">
                <h2>{service.pricingTitle}</h2>
                <p>{service.pricingSubtitle}</p>
              </div>

              <div className="software-pricing-grid">
                {service.pricingPlans.map((plan, index) => (
                  <article
                    className={`software-price-card${plan.featured ? " is-featured" : ""}`}
                    data-reveal="process-rise"
                    style={{ "--reveal-delay": `${index * 70}ms` }}
                    key={plan.name}
                  >
                    {plan.badge ? <span className="software-price-badge">{plan.badge}</span> : null}
                    <h3>{plan.name}</h3>
                    <p className="software-price-tagline">{plan.tagline}</p>
                    <span className="software-price-prefix">{plan.pricePrefix}</span>
                    <strong className="software-price-value">{plan.price}</strong>
                    <ul className="software-price-features">
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <a className="service-detail-btn secondary software-price-action" href="#service-contact">
                      Get Started
                    </a>
                  </article>
                ))}
              </div>
              <p className="software-pricing-note">
                * Every project is unique. Final pricing is confirmed after a free requirement discussion.
              </p>
            </section>
          ) : null}

          <section className="service-detail-section software-benefits-section">
            <div className="section-heading" data-reveal="fade-up">
              <h2>Why Choose NuraNova?</h2>
            </div>
            <div className="software-benefits-grid">
              {service.differentiators.map((item, index) => (
                <article
                  className="software-benefit-card detail-card"
                  data-reveal={index % 2 === 0 ? "section-left" : "section-right"}
                  style={{ "--reveal-delay": `${index * 60}ms` }}
                  key={item}
                >
                  <span className="software-benefit-icon" aria-hidden="true">✦</span>
                  <h3>{item}</h3>
                  <p>{service.differentiatorDetails?.[index] ?? item}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="service-detail-section software-process-section">
            <div className="section-heading" data-reveal="fade-up">
              <h2>From Idea to Launch</h2>
              <p>A simple and smooth process from start to success.</p>
            </div>
            <div className="software-process-line">
              {service.process.map((item, index) => (
                <article
                  className="software-process-step"
                  data-reveal="process-rise"
                  style={{ "--reveal-delay": `${index * 80}ms` }}
                  key={item.step}
                >
                  <div className="software-process-bubble">{item.step}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="service-detail-section service-intro-grid">
            <article className="detail-card detail-card-large" data-reveal="section-left">
              <span className="detail-card-label">Overview</span>
              <h2>Designed to feel clear, premium, and purposeful</h2>
              <p>{service.overview}</p>
            </article>

            <article className="detail-card" data-reveal="section-right" style={{ "--reveal-delay": "90ms" }}>
              <span className="detail-card-label">Ideal For</span>
              <ul className="detail-list">
                {service.idealFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </section>

          {portfolioProjects.length ? (
            <section className="service-detail-section portfolio-preview-section">
              <div className="section-heading portfolio-preview-heading" data-reveal="fade-up">
                <span>Portfolio preview</span>
                <h2>Selected websites you can explore live</h2>
                <p>
                  A curated preview of recent web projects, presented directly inside the page with
                  premium live frames and quick access to the full experience.
                </p>
              </div>

              <div className="portfolio-preview-list">
                {portfolioProjects.map((project, index) => {
                  const showFallback = project.previewMode === "restricted";

                  return (
                    <article className="portfolio-preview-row" key={project.name}>
                      <div
                        className="portfolio-preview-copy detail-card"
                        data-reveal="section-left"
                        style={{ "--reveal-delay": `${index * 70}ms` }}
                      >
                        <span className="detail-card-label">{String(index + 1).padStart(2, "0")}</span>
                        <h3>{project.name}</h3>
                        <p className="portfolio-preview-description">{project.description}</p>

                        <div className="portfolio-stack">
                          <span className="portfolio-stack-label">Tech stack</span>
                          <div className="portfolio-tech-list">
                            {project.tech.map((item) => (
                              <span className="portfolio-tech-chip" key={item}>
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        {project.previewNote ? (
                          <p className="portfolio-preview-note">{project.previewNote}</p>
                        ) : null}

                        <div className="portfolio-preview-actions">
                          <button
                            className="service-detail-btn primary"
                            onClick={() => setActivePreviewIndex(index)}
                            type="button"
                          >
                            Fullscreen Preview
                          </button>
                        </div>
                      </div>

                      <div
                        className="portfolio-preview-visual"
                        data-reveal="section-right"
                        style={{ "--reveal-delay": `${index * 70 + 100}ms` }}
                      >
                        <div className="portfolio-browser-shell">
                          <div className="portfolio-browser-bar">
                            <div className="portfolio-browser-dots" aria-hidden="true">
                              <span />
                              <span />
                              <span />
                            </div>
                            <span className="portfolio-browser-title">{project.name}</span>
                            <button
                              className="portfolio-browser-action"
                              onClick={() => setActivePreviewIndex(index)}
                              type="button"
                            >
                              Fullscreen
                            </button>
                          </div>

                          {showFallback ? (
                            <div className="portfolio-frame-fallback">
                              <span className="portfolio-frame-badge">Preview restricted</span>
                              <h3>{project.name}</h3>
                              <p>{project.previewNote}</p>
                            </div>
                          ) : (
                            <div className="portfolio-frame-wrap">
                              <iframe
                                className="portfolio-iframe"
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                                src={project.url}
                                title={`${project.name} live preview`}
                              />

                              <div className="portfolio-frame-overlay">
                                <span>Live Preview</span>
                                <strong>Interactive website showcase</strong>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </>
      )}
      <section className="service-detail-section">
        <div className="section-heading" data-reveal="fade-up">
          <span>FAQ</span>
          <h2>Practical questions clients usually ask before we begin</h2>
        </div>

        <div className="faq-grid">
          {service.faqs.map((item, index) => (
            <article
              className="detail-card faq-card"
              data-open={openFaq === index}
              data-reveal={index % 2 === 0 ? "section-left" : "section-right"}
              style={{ "--reveal-delay": `${index * 70}ms` }}
              key={item.question}
            >
              <button
                aria-expanded={openFaq === index}
                className="faq-toggle"
                onClick={() => setOpenFaq((current) => (current === index ? null : index))}
                type="button"
              >
                <span>{item.question}</span>
                <span className="faq-mark" aria-hidden="true">
                  +
                </span>
              </button>

              <div className="faq-answer">
                <div className="faq-answer-inner">
                  <p>{item.answer}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="service-detail-section">
        <article className="service-final-cta" data-reveal="cta-rise" id="service-contact">
          <div>
            <span className="detail-card-label">Next step</span>
            <h2>{service.ctaTitle}</h2>
            <p>{service.ctaText}</p>
          </div>

          <div className="service-final-actions">
            <a className="service-detail-btn primary" href="mailto:hello@nuranova.com">
              Contact by Email
            </a>
            <a className="service-detail-btn secondary" href="/#contact">
              View Contact Section
            </a>
          </div>
        </article>
      </section>

      {activePreview ? (
        <div
          className="portfolio-lightbox"
          onClick={() => setActivePreviewIndex(null)}
          role="presentation"
        >
          <div
            aria-label={`${activePreview.name} fullscreen preview`}
            aria-modal="true"
            className="portfolio-lightbox-dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="portfolio-lightbox-bar">
              <div className="portfolio-browser-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="portfolio-lightbox-copy">
                <strong>{activePreview.name}</strong>
                <span>Fullscreen preview</span>
              </div>

              <button
                className="portfolio-lightbox-close"
                onClick={() => setActivePreviewIndex(null)}
                type="button"
              >
                Close
              </button>
            </div>

            {activePreview.previewMode === "restricted" ? (
              <div className="portfolio-lightbox-fallback">
                <span className="portfolio-frame-badge">Preview restricted</span>
                <h3>{activePreview.name}</h3>
                <p>{activePreview.previewNote}</p>
              </div>
            ) : (
              <div className="portfolio-lightbox-frame">
                <iframe
                  className="portfolio-lightbox-iframe"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={activePreview.url}
                  title={`${activePreview.name} fullscreen preview`}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
