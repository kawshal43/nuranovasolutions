import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CreativeServiceDetail.css";

const WHATSAPP_LINK =
  "https://wa.me/94763307535?text=Hi%20NuraNova%2C%20I%27d%20like%20to%20discuss%20a%20new%20project.";

const PAGE_CONTENT = {
  "video-production-editing": {
    kind: "ai",
    eyebrow: "Digital direction meets AI filmmaking",
    title: "Digital & AI Creations",
    lead: "We turn ideas into cinematic AI films, campaign visuals, and digital stories designed to hold attention.",
    statement: "Creativity leads. Premium AI craft brings the vision to life.",
    services: [
      "Premium AI films and brand stories",
      "AI animation and motion visuals",
      "Creative product and campaign concepts",
      "Cinematic scenes and digital worlds",
      "AI-powered social content",
      "Creative direction and polished post-production",
    ],
    strengths: [
      ["Creativity comes first", "We begin with the idea, emotion, and audience. AI supports the vision instead of deciding it."],
      ["Premium AI craft", "We refine characters, scenes, movement, lighting, and final edits so the work feels considered and high quality."],
      ["Real film thinking", "Our filmmaking experience shapes the pacing, framing, mood, and continuity behind every visual sequence."],
    ],
    closing: "Have a film, campaign, or visual idea in mind? Tell us the outcome you want—we will shape the creative route.",
  },
};

const PHOTO_ROOT = "/services/photograogy";

const PHOTO_CATEGORIES = [
  {
    id: "baby",
    label: "Baby Shoot",
    kicker: "Little stories, honestly held",
    description: "Soft, joyful portraits that preserve every tiny expression and natural moment.",
    images: [
      { src: `${PHOTO_ROOT}/1%20(3).jpg`, alt: "Baby portrait in a soft pink studio setting", shape: "portrait" },
      { src: `${PHOTO_ROOT}/1%20(2).jpg`, alt: "Four-photo baby portrait story in a pink dress", shape: "wide" },
      { src: `${PHOTO_ROOT}/1%20(4).jpg`, alt: "Baby smiling during a pink themed portrait session", shape: "portrait" },
    ],
  },
  {
    id: "model",
    label: "Model Shoot",
    kicker: "Portraits with mood and movement",
    description: "Creative outdoor portraits shaped with natural light, thoughtful direction, and a distinct visual mood.",
    images: [
      { src: `${PHOTO_ROOT}/1%20(1).jpg`, alt: "Creative model story in a green field", shape: "portrait" },
      { src: `${PHOTO_ROOT}/1%20(3).jpg`, alt: "Creative portrait session", shape: "portrait" },
      { src: `${PHOTO_ROOT}/1%20(5).jpg`, alt: "Outdoor model portrait in a white dress beneath a dramatic sky", shape: "wide" },
    ],
  },
  {
    id: "birthday",
    label: "Birthday Shoot",
    kicker: "Colourful moments, beautifully remembered",
    description: "Joyful birthday portraits and celebration stories filled with personality, colour, and natural expression.",
    images: [
      { src: `${PHOTO_ROOT}/1%20(2).jpg`, alt: "Colourful birthday portrait story", shape: "wide" },
      { src: `${PHOTO_ROOT}/1%20(4).jpg`, alt: "Birthday portrait in a soft pink setting", shape: "portrait" },
      { src: `${PHOTO_ROOT}/1%20(6).jpg`, alt: "Natural-light birthday portrait", shape: "wide" },
      { src: `${PHOTO_ROOT}/1%20(7).jpg`, alt: "Creative birthday portrait story", shape: "portrait" },
      { src: `${PHOTO_ROOT}/1%20(8).jpg`, alt: "Cinematic birthday portrait", shape: "portrait" },
    ],
  },
  { id: "wedding", label: "Wedding Shoot", kicker: "Wedding stories coming soon", description: "A timeless new collection is being prepared.", images: [] },
];

const PHOTO_HERO_REEL = [
  { src: `${PHOTO_ROOT}/1%20(1).jpg`, alt: "Model shoot frame one" },
  { src: `${PHOTO_ROOT}/1%20(2).jpg`, alt: "Birthday shoot frame two" },
  { src: `${PHOTO_ROOT}/1%20(3).jpg`, alt: "Model shoot frame three" },
  { src: `${PHOTO_ROOT}/1%20(4).jpg`, alt: "Birthday shoot frame four" },
  { src: `${PHOTO_ROOT}/1%20(5).jpg`, alt: "Model shoot frame five" },
  { src: `${PHOTO_ROOT}/1%20(6).jpg`, alt: "Birthday shoot frame six" },
  { src: `${PHOTO_ROOT}/1%20(7).jpg`, alt: "Birthday shoot frame seven" },
  { src: `${PHOTO_ROOT}/1%20(8).jpg`, alt: "Birthday shoot frame eight" },
];

function PhotographyPortfolio() {
  const [activeCategory, setActiveCategory] = useState(PHOTO_CATEGORIES[0]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (!selectedPhoto) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && setSelectedPhoto(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedPhoto]);

  return (
    <main className="photo-portfolio">
      <section className="photo-hero" aria-labelledby="photo-page-title">
        <div className="photo-hero-reel" aria-label="Selected NuraNova photography">
          <div className="photo-hero-track">
            {[...PHOTO_HERO_REEL, ...PHOTO_HERO_REEL].map((photo, index) => (
              <figure aria-hidden={index >= PHOTO_HERO_REEL.length} key={`${photo.src}-${index}`}>
                <img className="photo-reel-backdrop" src={photo.src} alt="" aria-hidden="true" decoding="async" />
                <img className="photo-reel-image" src={photo.src} alt={index < PHOTO_HERO_REEL.length ? photo.alt : ""} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
              </figure>
            ))}
          </div>
        </div>
        <div className="photo-hero-shade" aria-hidden="true" />
        <div className="photo-hero-copy">
          <span className="photo-hero-index">Photography / Sri Lanka</span>
          <h1 id="photo-page-title">Stories,<br /><em>beautifully</em> seen.</h1>
          <p>Creative portraits and honest moments, photographed with feeling.</p>
          <a href="#photo-work">Explore our work <span aria-hidden="true">↓</span></a>
        </div>
        <span className="photo-hero-note">NuraNova Visual Stories · 2026</span>
      </section>

      <section className="photo-work" id="photo-work" aria-labelledby="photo-work-title">
        <header className="photo-work-heading">
          <div><span>Selected stories</span><h2 id="photo-work-title">Every frame<br />holds a feeling.</h2></div>
          <p>Choose a collection and step inside the story.</p>
        </header>

        <div className="photo-category-tabs" role="tablist" aria-label="Photography categories">
          {PHOTO_CATEGORIES.map((category, index) => (
            <button key={category.id} type="button" role="tab" aria-selected={activeCategory.id === category.id} aria-controls="photo-category-panel" className={activeCategory.id === category.id ? "is-active" : ""} onClick={() => setActiveCategory(category)}>
              <span>{String(index + 1).padStart(2, "0")}</span>{category.label}<i aria-hidden="true">{category.images.length || "—"}</i>
            </button>
          ))}
        </div>

        <div className="photo-category-intro" aria-live="polite">
          <span>{activeCategory.label}</span>
          <div><h3>{activeCategory.kicker}</h3><p>{activeCategory.description}</p></div>
        </div>

        <div id="photo-category-panel" role="tabpanel" className="photo-category-panel">
          {activeCategory.images.length > 0 ? (
            <div className={`photo-story-grid photo-story-${activeCategory.id}`}>
              {activeCategory.images.map((photo, index) => (
                <button type="button" className={`photo-story-frame photo-story-frame-${photo.shape}`} key={photo.src} onClick={() => setSelectedPhoto(photo)} aria-label={`Open photo ${index + 1} from ${activeCategory.label}`}>
                  <img src={photo.src} alt={photo.alt} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                  <span><b>{String(index + 1).padStart(2, "0")}</b> View frame <i aria-hidden="true">↗</i></span>
                </button>
              ))}
            </div>
          ) : (
            <div className="photo-empty-state">
              <span aria-hidden="true">{activeCategory.id === "wedding" ? "∞" : "✦"}</span>
              <p>New work is on the way.</p>
              <h3>Be the story<br />we capture next.</h3>
              <a href={WHATSAPP_LINK} rel="noreferrer" target="_blank">Contact Us on WhatsApp ↗</a>
            </div>
          )}
        </div>
      </section>

      <section className="photo-approach" aria-labelledby="photo-approach-title">
        <div><span>Our approach</span><h2 id="photo-approach-title">Natural moments.<br /><em>Intentional</em> frames.</h2></div>
        <ol>
          <li><span>01</span><div><h3>Listen</h3><p>We understand your story, mood, and the moments that matter.</p></div></li>
          <li><span>02</span><div><h3>Direct gently</h3><p>Simple guidance keeps every pose comfortable and every expression natural.</p></div></li>
          <li><span>03</span><div><h3>Refine carefully</h3><p>Thoughtful colour and detail work gives the final collection one beautiful rhythm.</p></div></li>
        </ol>
      </section>

      <section className="photo-contact" aria-labelledby="photo-contact-title">
        <span>Have a story in mind?</span>
        <h2 id="photo-contact-title">Let’s make it<br /><em>unforgettable.</em></h2>
        <a href={WHATSAPP_LINK} rel="noreferrer" target="_blank">Contact Us on WhatsApp <span aria-hidden="true">↗</span></a>
      </section>

      {selectedPhoto && (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setSelectedPhoto(null)}>
          <button type="button" onClick={() => setSelectedPhoto(null)} aria-label="Close photo viewer">Close ×</button>
          <img src={selectedPhoto.src} alt={selectedPhoto.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </main>
  );
}

const AI_CAPABILITIES = [
  { id: "films", label: "AI Films", code: "01", title: "Cinematic AI films", text: "Brand stories and campaign films shaped with human direction, cinematic pacing, and premium AI production." },
  { id: "animation", label: "AI Animation", code: "02", title: "Animation with personality", text: "Original motion worlds, explainers, and social visuals designed to make complex ideas instantly engaging." },
  { id: "characters", label: "AI Characters", code: "03", title: "Characters made for your brand", text: "Distinct, copyright-conscious characters built from an original concept—not copied from celebrities, films, or existing IP." },
  { id: "campaigns", label: "Campaigns", code: "04", title: "One idea, every screen", text: "Connected key visuals, short-form clips, product moments, and campaign assets with one consistent creative language." },
];

const AI_STAGES = [
  { number: "01", name: "Idea", title: "Start with the human spark.", text: "We understand the audience, emotion, message, and business outcome before choosing a visual direction." },
  { number: "02", name: "Character", title: "Create an original identity.", text: "We shape the look, personality, expressions, and visual rules that make every character feel recognisable." },
  { number: "03", name: "Scene", title: "Build a world around it.", text: "Lighting, colour, composition, environment, and camera language turn the concept into a believable visual world." },
  { number: "04", name: "Motion", title: "Give every frame intention.", text: "We direct movement, rhythm, transitions, and continuity so the animation feels purposeful—not randomly generated." },
  { number: "05", name: "Final Film", title: "Finish it like a production.", text: "Editing, sound, colour, typography, and quality control bring every piece together for a polished final delivery." },
];

function NuraCharacter({ pulse, onActivate }) {
  return (
    <button className={`nura-character ${pulse ? "is-pulsing" : ""}`} type="button" onClick={onActivate} aria-label="Activate Nura AI character">
      <span className="nura-orbit nura-orbit-one" aria-hidden="true" />
      <span className="nura-orbit nura-orbit-two" aria-hidden="true" />
      <span className="nura-orbit nura-orbit-three" aria-hidden="true" />
      <svg viewBox="0 0 420 520" role="img" aria-label="Nura, NuraNova's original abstract AI character">
        <defs>
          <linearGradient id="nuraBody" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#91f7ff" /><stop offset=".48" stopColor="#7567ff" /><stop offset="1" stopColor="#ff6bd6" /></linearGradient>
          <radialGradient id="nuraFace"><stop stopColor="#24315e" /><stop offset="1" stopColor="#080b1d" /></radialGradient>
          <filter id="nuraGlow"><feGaussianBlur stdDeviation="9" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path className="nura-wing nura-wing-left" d="M105 231C38 206 27 141 54 98c41 13 86 48 111 91z" fill="url(#nuraBody)" opacity=".58" />
        <path className="nura-wing nura-wing-right" d="M315 231c67-25 78-90 51-133-41 13-86 48-111 91z" fill="url(#nuraBody)" opacity=".58" />
        <path d="M120 251c0-94 36-163 90-163s90 69 90 163v123c0 39-31 70-70 70h-40c-39 0-70-31-70-70z" fill="url(#nuraBody)" opacity=".92" />
        <path d="M139 244c0-72 27-126 71-126s71 54 71 126v75c0 41-32 73-71 73s-71-32-71-73z" fill="url(#nuraFace)" />
        <path className="nura-brow" d="M164 229c14-9 28-9 42-1M214 228c14-8 28-8 42 1" fill="none" stroke="#8ef9ff" strokeLinecap="round" strokeWidth="5" opacity=".65" />
        <ellipse className="nura-eye nura-eye-left" cx="184" cy="258" rx="13" ry="18" fill="#bafcff" filter="url(#nuraGlow)" />
        <ellipse className="nura-eye nura-eye-right" cx="236" cy="258" rx="13" ry="18" fill="#bafcff" filter="url(#nuraGlow)" />
        <path d="M190 310c13 10 27 10 40 0" fill="none" stroke="#ff91df" strokeLinecap="round" strokeWidth="5" />
        <circle className="nura-core" cx="210" cy="373" r="27" fill="#a9fbff" filter="url(#nuraGlow)" />
        <circle cx="210" cy="373" r="11" fill="#fff" />
        <path d="M160 435c-17 29-22 49-18 61M260 435c17 29 22 49 18 61" fill="none" stroke="url(#nuraBody)" strokeLinecap="round" strokeWidth="19" />
      </svg>
      <span className="nura-character-hint"><i aria-hidden="true" /> Click to activate Nura</span>
    </button>
  );
}

function AiCreationPage() {
  const [activeCapability, setActiveCapability] = useState(AI_CAPABILITIES[0]);
  const [activeStage, setActiveStage] = useState(AI_STAGES[0]);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content") ?? "";
    document.title = "AI Animation & AI Video Production Sri Lanka | NuraNova";
    description?.setAttribute("content", "Original AI animation, cinematic AI films, custom AI characters, and creative campaign production by NuraNova Solutions Sri Lanka.");
    return () => {
      document.title = previousTitle;
      description?.setAttribute("content", previousDescription);
    };
  }, []);

  const moveNura = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--nura-x", `${((event.clientX - box.left) / box.width - 0.5) * 12}px`);
    event.currentTarget.style.setProperty("--nura-y", `${((event.clientY - box.top) / box.height - 0.5) * 10}px`);
  };

  const activateNura = () => {
    setPulse(false);
    window.requestAnimationFrame(() => setPulse(true));
    window.setTimeout(() => setPulse(false), 850);
  };

  return (
    <main className="ai-creation-page">
      <section className="ai-hero" aria-labelledby="ai-page-title" onPointerMove={moveNura} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--nura-x", "0px"); event.currentTarget.style.setProperty("--nura-y", "0px"); }}>
        <div className="ai-grid" aria-hidden="true" />
        <div className="ai-aurora ai-aurora-one" aria-hidden="true" /><div className="ai-aurora ai-aurora-two" aria-hidden="true" />
        <div className="ai-hero-copy">
          <span className="ai-kicker"><i aria-hidden="true" /> NuraNova Creative Intelligence</span>
          <h1 id="ai-page-title">Human ideas.<br /><em>Amplified</em> by AI.</h1>
          <p>Original AI films, animations, and characters—creatively directed for brands that want to be remembered.</p>
          <div className="ai-hero-actions"><a href={WHATSAPP_LINK} rel="noreferrer" target="_blank">Start a project <span aria-hidden="true">↗</span></a><a href="#ai-capabilities">Explore capabilities <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="ai-nura-stage">
          <span className="ai-nura-label">Meet Nura / Original AI character</span>
          <NuraCharacter pulse={pulse} onActivate={activateNura} />
          {AI_CAPABILITIES.map((item, index) => <button key={item.id} type="button" className={`ai-orbit-node ai-orbit-node-${index + 1} ${activeCapability.id === item.id ? "is-active" : ""}`} onClick={() => setActiveCapability(item)}><span>{item.code}</span>{item.label}</button>)}
        </div>
        <div className="ai-hero-status" aria-hidden="true"><span>Creative system online</span><i /><b>Human directed</b></div>
      </section>

      <section className="ai-capabilities" id="ai-capabilities" aria-labelledby="ai-capabilities-title">
        <header><span>Creative capabilities / 04</span><h2 id="ai-capabilities-title">One creative mind.<br />Many possible worlds.</h2></header>
        <div className="ai-capability-console">
          <div className="ai-capability-list" role="tablist" aria-label="AI creative capabilities">
            {AI_CAPABILITIES.map((item) => <button key={item.id} type="button" role="tab" aria-selected={activeCapability.id === item.id} onClick={() => setActiveCapability(item)} className={activeCapability.id === item.id ? "is-active" : ""}><span>{item.code}</span><b>{item.label}</b><i aria-hidden="true">↗</i></button>)}
          </div>
          <div className={`ai-capability-display ai-display-${activeCapability.id}`} role="tabpanel" aria-live="polite">
            <span className="ai-display-scan" aria-hidden="true" /><div className="ai-display-symbol" aria-hidden="true"><span /><i /><b /></div>
            <div><span>{activeCapability.code} / NuraNova</span><h3>{activeCapability.title}</h3><p>{activeCapability.text}</p></div>
          </div>
        </div>
      </section>

      <section className="ai-lab" aria-labelledby="ai-lab-title">
        <header><span>Interactive creation lab</span><h2 id="ai-lab-title">From first thought<br />to final frame.</h2><p>Click each stage to explore our human-directed AI workflow.</p></header>
        <div className="ai-lab-interface">
          <div className="ai-stage-track" role="tablist" aria-label="AI production stages">{AI_STAGES.map((stage) => <button key={stage.number} type="button" role="tab" aria-selected={activeStage.number === stage.number} className={activeStage.number === stage.number ? "is-active" : ""} onClick={() => setActiveStage(stage)}><span>{stage.number}</span><b>{stage.name}</b><i aria-hidden="true" /></button>)}</div>
          <div className="ai-stage-output" role="tabpanel" aria-live="polite"><span>{activeStage.number} / 05</span><h3>{activeStage.title}</h3><p>{activeStage.text}</p><div className="ai-stage-wave" aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} />)}</div></div>
        </div>
      </section>

      <section className="ai-principles" aria-labelledby="ai-principles-title">
        <div><span>Our creative standard</span><h2 id="ai-principles-title">AI power.<br /><em>Human judgment.</em></h2></div>
        <div className="ai-principle-grid"><article><span>01</span><h3>Original by design</h3><p>Every concept and character begins with a fresh creative direction built for your brand.</p></article><article><span>02</span><h3>Consistency matters</h3><p>We control character, colour, lighting, and visual language across every scene.</p></article><article><span>03</span><h3>Craft beyond prompts</h3><p>Direction, editing, sound, typography, and finishing turn generated material into real creative work.</p></article></div>
      </section>

      <section className="ai-contact" aria-labelledby="ai-contact-title"><span>Ready to create what does not exist yet?</span><h2 id="ai-contact-title">Bring us the idea.<br /><em>We’ll build the world.</em></h2><a href={WHATSAPP_LINK} rel="noreferrer" target="_blank">Contact Us on WhatsApp <span aria-hidden="true">↗</span></a></section>
    </main>
  );
}

export default function CreativeServiceDetail({ service }) {
  if (service.slug === "photography-services") return <PhotographyPortfolio />;
  if (service.slug === "video-production-editing") return <AiCreationPage />;
  const content = PAGE_CONTENT[service.slug];

  return (
    <main className={`creative-detail creative-detail-${content.kind}`}>
      <section className="creative-detail-hero">
        <div className="creative-detail-glow" aria-hidden="true" />
        <div className="creative-detail-copy">
          <Link className="creative-detail-back" to="/#service-page">← Back to services</Link>
          <span className="creative-detail-eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1><p>{content.lead}</p>
          <div className="creative-detail-actions"><a href={WHATSAPP_LINK} rel="noreferrer" target="_blank">Contact Us on WhatsApp ↗</a></div>
        </div>
        <div className="creative-detail-visual" aria-label={`${content.title} visual`}>
          <span>AI</span><img src={service.image} alt="" aria-hidden="true" /><strong>{content.statement}</strong><i aria-hidden="true" />
        </div>
      </section>

      <section className="creative-detail-offer" aria-labelledby="ai-offer-title">
        <header><span>What we create</span><h2 id="ai-offer-title">Focused creative services. Clear results.</h2></header>
        <div className="creative-detail-service-grid">
          {content.services.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3></article>)}
        </div>
      </section>

      <section className="creative-detail-why" aria-labelledby="ai-why-title">
        <header><span>Why work with us</span><h2 id="ai-why-title">A focused team behind every detail.</h2></header>
        <div>{content.strengths.map(([title, text]) => <article key={title}><i aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="creative-detail-contact" aria-labelledby="ai-contact-title">
        <span>Ready when you are</span><h2 id="ai-contact-title">{content.closing}</h2>
        <a className="creative-detail-whatsapp" href={WHATSAPP_LINK} rel="noreferrer" target="_blank">Contact Us on WhatsApp ↗</a>
      </section>
    </main>
  );
}
