import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getServiceBySlug } from "../data/services";
import EducationPlatform from "./EducationPlatform";
import CreativeServiceDetail from "./CreativeServiceDetail";
import ServiceHeroScene from "../components/ServiceHeroScene";
import "./ServiceDetail.css";

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
  const activePreview =
    activePreviewIndex === null ? null : portfolioProjects[activePreviewIndex] ?? null;

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
    setOpenFaq(null);
    setActivePreviewIndex(null);
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
    <main className="service-detail-page" ref={pageRef}>
      <div className="service-detail-backdrop" aria-hidden="true" />

      <section className="service-detail-hero">
        <div className="service-hero-copy" data-reveal="hero-left">
          <span className="service-detail-eyebrow" data-reveal="fade-up" style={{ "--reveal-delay": "80ms" }}>
            {service.eyebrow}
          </span>
          <h1>{service.title}</h1>
          <p className="service-detail-subtitle">{service.subtitle}</p>

          <div className="service-detail-cta-row" data-reveal="fade-up" style={{ "--reveal-delay": "140ms" }}>
            <a className="service-detail-btn primary" href="#service-contact">
              Start a Project
            </a>
            <Link className="service-detail-btn secondary" to="/#service-page">
              Back to Services
            </Link>
          </div>

          <div className="service-detail-stat-row" data-reveal="fade-up" style={{ "--reveal-delay": "220ms" }}>
            {service.heroStats.map((item) => (
              <span className="service-detail-stat" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="service-hero-visual" data-reveal="hero-right" style={{ "--reveal-delay": "140ms" }}>
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
              <div className="service-preview-topline">Premium service preview</div>
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
                    : service.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="service-detail-section">
        <div className="section-heading" data-reveal="fade-up">
          <span>What is included</span>
          <h2>Professional scope with real delivery value</h2>
        </div>

        <div className="detail-grid detail-grid-four">
          {service.highlights.map((item, index) => (
            <article
              className="detail-card"
              data-reveal={index % 2 === 0 ? "section-left" : "section-right"}
              style={{ "--reveal-delay": `${index * 70}ms` }}
              key={item.title}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-detail-section">
        <div className="section-heading" data-reveal="fade-up">
          <span>Our process</span>
          <h2>Structured collaboration from first brief to final delivery</h2>
        </div>

        <div className="process-grid">
          {service.process.map((item, index) => (
            <article
              className="process-card"
              data-reveal="process-rise"
              style={{ "--reveal-delay": `${index * 60}ms` }}
              key={item.step}
            >
              <div className="process-step">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-detail-section service-deliverables-grid">
        <article className="detail-card detail-card-accent" data-reveal="section-left">
          <span className="detail-card-label">Deliverables</span>
          <h2>What the client walks away with</h2>
          <ul className="detail-list">
            {service.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="detail-card" data-reveal="section-right" style={{ "--reveal-delay": "100ms" }}>
          <span className="detail-card-label">Why NuraNova</span>
          <div className="stacked-points">
            {service.differentiators.map((item) => (
              <div className="stacked-point" key={item}>
                <span className="point-dot" aria-hidden="true" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

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
