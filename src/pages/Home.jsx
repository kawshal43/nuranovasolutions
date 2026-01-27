import { useEffect, useMemo, useRef, useState } from "react";

import a from "../assets/a.png";
import b from "../assets/b.png";
import c from "../assets/c.png";
import f from "../assets/f.png";
import g from "../assets/g.png";
import h from "../assets/h.png";
import i from "../assets/i.png";
import s1 from "../assets/s1.png";
import s2 from "../assets/s2.png";
import s3 from "../assets/s3.png";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  // for reveal animations
  const servicesRef = useRef(null);
  const whyRef = useRef(null);
  const footerRef = useRef(null);

  const [inView, setInView] = useState({
    services: false,
    why: false,
    footer: false,
  });

  // Smooth-ish scroll listener
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal on enter viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute("data-id");
            if (id) setInView((p) => ({ ...p, [id]: true }));
          }
        });
      },
      { threshold: 0.18 }
    );

    [servicesRef.current, whyRef.current, footerRef.current].forEach((el) => {
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  // Parallax factors (tweak here)
  const p = useMemo(() => {
    const y = scrollY;
    return {
      p1: y * 0.18,
      p2: y * 0.12,
      p3: y * 0.22,
      p4: y * 0.16,
      p5: y * 0.10,
      p6: y * 0.14,
      p7: y * 0.20,
    };
  }, [scrollY]);

  return (
    <>
      <style>{`
      :root{
        --text:#0f172a;
        --muted:#64748b;
        --blue:#2563eb;
        --blue2:#1d4ed8;
        --border:#e5e7eb;
        --card:#ffffff;
        --shadow: 0 16px 40px rgba(2,6,23,.08);
        --shadow2: 0 10px 26px rgba(2,6,23,.06);
        --radius: 26px;
      }

      @media (max-width: 768px){

  /* HERO spacing */
  .hero{
    padding: 52px 14px 14px;
    min-height: auto;
  }

  .heroInner{
    padding-bottom: 16px;
  }

  .title{
    font-size: 40px;
    line-height: 1.08;
  }

  .lead{
    font-size: 13px;
    padding: 0 6px;
  }

  .btn{
    padding: 11px 22px;
    font-size: 14px;
  }

  /* PNG Decorations: keep few only (avoid clutter) */
  .pos2, .pos4, .pos6, .pos7 { display:none; } /* hide right side icons */
  .sizeL{ width: 86px; }
  .sizeM{ width: 66px; }
  .sizeS{ width: 52px; }

  /* SERVICES card */
  .sectionWrap{
    padding: 0 14px 36px;
  }

  .bigCard{
    padding: 22px 14px 18px;
    border-radius: 20px;
  }

  .cards3{
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 0;
  }

  .service{
    padding: 16px 12px;
  }

  /* WHY + CTA */
  .whyWrap{
    padding: 0 14px 36px;
  }

  .whyGrid{
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .cta{
    padding: 18px;
  }

  /* FOOTER */
  .footerGrid{
    grid-template-columns: 1fr;
    gap: 14px;
  }

    .copyRow{
      justify-content: center;
      text-align: center;
    }
  }


        *{ box-sizing:border-box; }

      body{
        font-family: "Roboto", system-ui, -apple-system, Segoe UI, Arial, sans-serif;
        background:#fff;
        color:var(--text);
      }

      .page{ width:100%; overflow-x:hidden; }

      /* ---------- HERO ---------- */
      .hero{
        position:relative;
        padding: 72px 18px 24px;
        min-height: 78vh;
      }

      .container{
        max-width: 1100px;
        margin: 0 auto;
        position:relative;
        z-index: 2;
      }

      .heroInner{
        max-width: 900px;
        margin: 0 auto;
        text-align:center;
        padding-bottom: 30px;
      }

      .kicker{
        font-size: 12px;
        font-weight: 700;
        color: var(--muted);
        letter-spacing:.2px;
      }

      .title{
        margin: 10px 0 12px;
        font-size: clamp(44px, 4.6vw, 72px);
        line-height: 1.03;
        font-weight: 900;
        letter-spacing: -0.03em;
      }

      .leadStrong{
        margin-top: 8px;
        font-size: 14px;
        font-weight: 700;
        color: var(--muted);
      }

      .lead{
        margin: 6px auto 0;
        max-width: 640px;
        font-size: 14px;
        line-height: 1.75;
        color: var(--muted);
      }

      .btnRow{
        margin-top: 18px;
        display:flex;
        justify-content:center;
      }

      .btn{
        border:0;
        background: var(--blue);
        color:#fff;
        padding: 12px 26px;
        border-radius: 999px;
        font-weight: 800;
        cursor:pointer;
        box-shadow: 0 16px 30px rgba(37,99,235,.22);
        transition: transform .2s ease, background .2s ease;
      }
      .btn:hover{
        background: var(--blue2);
        transform: translateY(-1px);
      }

      /* Decorative PNG layer */
      .decor{
        position:absolute;
        inset:0;
        z-index:1;
        pointer-events:none;
      }

      .float{
        position:absolute;
        height:auto;
        opacity:.98;
        filter:none;
        will-change: transform;
      }

      .sizeL{ width: 110px; }
      .sizeM{ width: 86px; }
      .sizeS{ width: 64px; }

      /* base positions like figma */
      .pos1{ top: 8%; left: 6%; }
      .pos2{ top: 10%; right: 8%; }
      .pos3{ top: 42%; left: 9%; }
      .pos4{ top: 28%; right: 12%; }
      .pos5{ top: 64%; left: 14%; }
      .pos6{ top: 66%; right: 14%; }
      .pos7{ top: 18%; left: 80%; }

      /* subtle floating */
      @keyframes bob {
        0%{ transform: translateY(0); }
        50%{ transform: translateY(-10px); }
        100%{ transform: translateY(0); }
      }
      .bob{ animation: bob 6.8s ease-in-out infinite; }

      /* ---------- SECTION CARD (Services) ---------- */
      .sectionWrap{
        padding: 0 18px 46px;
      }
      .bigCard{
        max-width: 1100px;
        margin: 0 auto;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: 34px 22px 26px;
      }

      .centerText{ text-align:center; }

      .h2{
        margin: 0;
        font-size: 28px;
        font-weight: 900;
      }
      .sub{
        margin: 8px 0 0;
        color: var(--muted);
        font-size: 13px;
      }

      .cards3{
        margin-top: 22px;
        display:grid;
        grid-template-columns: repeat(3, minmax(0,1fr));
        gap: 18px;
        padding: 0 6px;
      }

      .service{
        background:#fff;
        border: 1px solid #f1f5f9;
        border-radius: 18px;
        padding: 18px 14px;
        box-shadow: var(--shadow2);
        text-align:center;
        transition: transform .2s ease, box-shadow .2s ease;
      }
      .service:hover{
        transform: translateY(-2px);
        box-shadow: 0 18px 30px rgba(2,6,23,.09);
      }
        .bigCard{
        padding: 28px 18px 22px; /* reduce */
        }

      .iconBox{
         width: 66px;
         height: 66px;
        border-radius: 18px;
        background: #f8fafc;
        margin: 0 auto 10px;
        display:flex;
        align-items:center;
        justify-content:center;
}

  .iconImg{
  width: 44px;
  height: 44px;
  object-fit: contain;
}




      .sTitle{
        margin: 8px 0 4px;
        font-size: 13px;
        font-weight: 900;
      }
      .sSub{
        margin: 0;
        font-size: 12px;
        color: var(--muted);
      }

      /* slider dots like figma */
      .dots{
        margin: 14px 0 10px;
        display:flex;
        justify-content:center;
        gap: 8px;
      }
      .dot{
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: #cbd5e1;
      }
      .dot.active{
        background: var(--blue);
        width: 18px;
      }

      .centerBtn{
        display:flex;
        justify-content:center;
        margin-top: 8px;
      }

      /* ---------- WHY CHOOSE + CTA ---------- */
      .whyWrap{
        padding: 8px 18px 52px;
      }
      .whyGrid{
        max-width: 1100px;
        margin: 0 auto;
        display:grid;
        grid-template-columns: 1.1fr .9fr;
        gap: 22px;
        align-items:start;
      }
      .whyTitle{
        margin: 0;
        font-size: 26px;
        font-weight: 900;
      }
      .whySub{
        margin: 8px 0 0;
        color: var(--muted);
        font-size: 13px;
      }
      .tickList{
        margin-top: 16px;
        display:grid;
        gap: 12px;
      }
      .tickItem{
        display:flex;
        gap: 10px;
        align-items:flex-start;
        color: var(--muted);
        font-size: 13px;
      }
      .tick{
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: #10b981;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        color:#fff;
        font-size: 12px;
        flex: 0 0 auto;
        margin-top: 1px;
      }

      .cta{
        background:#fff;
        border: 1px solid var(--border);
        border-radius: 18px;
        box-shadow: var(--shadow2);
        padding: 22px;
      }
      .ctaTitle{
        margin: 0;
        font-size: 18px;
        font-weight: 900;
      }
      .ctaSub{
        margin: 10px 0 0;
        color: var(--muted);
        font-size: 13px;
        line-height:1.6;
      }
      .ctaBtnRow{
        margin-top: 16px;
        display:flex;
        justify-content:center;
      }
      .btnSmall{
        border:0;
        background: var(--blue);
        color:#fff;
        padding: 10px 18px;
        border-radius: 999px;
        font-weight: 800;
        cursor:pointer;
        box-shadow: 0 12px 22px rgba(37,99,235,.2);
      }

      /* ---------- FOOTER ---------- */
      .footer{
        padding: 22px 18px 30px;
        border-top: 1px solid #eef2f7;
      }
      .footerInner{
        max-width: 1100px;
        margin: 0 auto;
      }
      .footerTop{
        text-align:center;
        color: var(--muted);
        font-size: 11px;
        padding-bottom: 18px;
      }
      .footerGrid{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 18px;
        padding: 18px 0;
        border-top: 1px solid #eef2f7;
        border-bottom: 1px solid #eef2f7;
      }
      .fHead{
        font-weight: 900;
        font-size: 12px;
        margin-bottom: 8px;
      }
      .fLink{
        display:block;
        color: var(--muted);
        font-size: 12px;
        margin: 4px 0;
      }
      .copyRow{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap: 12px;
        padding-top: 14px;
        color: var(--muted);
        font-size: 11px;
        flex-wrap: wrap;
      }

      /* ---------- REVEAL ANIM ---------- */
      .reveal{
        opacity: 0;
        transform: translateY(18px);
        transition: opacity .6s ease, transform .6s ease;
      }
      .reveal.show{
        opacity: 1;
        transform: translateY(0);
      }

      @media (max-width: 920px){
        .cards3{ grid-template-columns: 1fr; }
        .whyGrid{ grid-template-columns: 1fr; }
        .pos2,.pos4,.pos7{ display:none; }
      }
      `}</style>

      <div className="page">
        {/* HERO */}
        <section className="hero">
          <div className="decor">
            {/* Parallax = translateY based on scroll */}
            <img
              src={a}
              className="float sizeL pos1 bob"
              style={{ transform: `translateY(${p.p1}px)` }}
              alt="a"
            />
            <img
              src={b}
              className="float sizeM pos2 bob"
              style={{ transform: `translateY(${p.p2}px)` }}
              alt="b"
            />
            <img
              src={c}
              className="float sizeS pos3 bob"
              style={{ transform: `translateY(${p.p3}px)` }}
              alt="c"
            />
            <img
              src={f}
              className="float sizeL pos4 bob"
              style={{ transform: `translateY(${p.p4}px)` }}
              alt="f"
            />
            <img
              src={g}
              className="float sizeM pos5 bob"
              style={{ transform: `translateY(${p.p5}px)` }}
              alt="g"
            />
            <img
              src={h}
              className="float sizeM pos6 bob"
              style={{ transform: `translateY(${p.p6}px)` }}
              alt="h"
            />
            <img
              src={i}
              className="float sizeS pos7 bob"
              style={{ transform: `translateY(${p.p7}px)` }}
              alt="i"
            />
          </div>

          <div className="container">
            <div className="heroInner">
              <div className="kicker">It all starts with innovation</div>
              <div className="title">Building Digital Experiences</div>

              <div className="leadStrong">Creative. Reliable. Innovative.</div>
              <div className="lead">
                NuraNova helps you build digital solutions, craft visual stories,
                and bring your ideas to life.
              </div>

              <div className="btnRow">
                <button
                  className="btn"
                  onClick={() =>
                    servicesRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="sectionWrap">
          <div
            ref={servicesRef}
            data-id="services"
            className={`bigCard reveal ${inView.services ? "show" : ""}`}
          >
            <div className="centerText">
              <h2 className="h2">Our Services</h2>
              <p className="sub">Smart solutions for a digital world.</p>
            </div>

            <div className="cards3">
              <div className="service">
                <div className="iconBox" >
                   <img src={s1} alt="service 1" className="iconImg" />
                </div>
                <div className="sTitle">Software Development & Web Solutions</div>
                <p className="sSub">Modern web apps & systems</p>
              </div>

              <div className="service">
                
                  <div className="iconBox" >
                   <img src={s2} alt="service 2" className="iconImg" />
                </div>
                <div className="sTitle">Video Production & Editing</div>
                <p className="sSub">Creative edits & motion</p>
              </div>

              <div className="service">
                <div className="iconBox">
                  <img src={s3} alt="service 3" className="iconImg" />
                </div>

                <div className="sTitle">Education & Tutorials</div>
                <p className="sSub">Learning content & guides</p>
              </div>
            </div>

            {/* Figma dots */}
            <div className="dots" aria-hidden="true">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>

            <div className="centerBtn">
              <button className="btn">
                View All Services <span style={{ marginLeft: 6 }}>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE + CTA */}
        <section className="whyWrap">
          <div
            ref={whyRef}
            data-id="why"
            className={`whyGrid reveal ${inView.why ? "show" : ""}`}
          >
            <div>
              <h3 className="whyTitle">Why choose NuraNova ?</h3>
              <p className="whySub">
                Innovative Solutions build on <b>Trust</b> and expertise.
              </p>

              <div className="tickList">
                <div className="tickItem">
                  <span className="tick">✓</span>
                  One team for technology, creativity & education
                </div>
                <div className="tickItem">
                  <span className="tick">✓</span>
                  Reliable, real-world digital solutions
                </div>
                <div className="tickItem">
                  <span className="tick">✓</span>
                  Ethical, student-friendly support
                </div>
                <div className="tickItem">
                  <span className="tick">✓</span>
                  Local roots with a global mindset
                </div>
              </div>
            </div>

            <div className="cta">
              <h4 className="ctaTitle">Ready to build Something Meaningful ?</h4>
              <p className="ctaSub">
                Let's work together to bring ideas to life.
              </p>
              <div className="ctaBtnRow">
                <button className="btnSmall">Contact Us</button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div
            ref={footerRef}
            data-id="footer"
            className={`footerInner reveal ${inView.footer ? "show" : ""}`}
          >
            <div className="footerTop">
              Innovative software, creative media, and digital solutions designed
              to bring ideas to life.
            </div>

            <div className="footerGrid">
              <div>
                <div className="fHead">Quick Links</div>
                <span className="fLink">Home</span>
                <span className="fLink">Services</span>
                <span className="fLink">About Us</span>
                <span className="fLink">Contact</span>
              </div>

              <div>
                <div className="fHead">Services</div>
                <span className="fLink">Software Development</span>
                <span className="fLink">Design & Creative Media</span>
                <span className="fLink">Video Production</span>
                <span className="fLink">Photography</span>
                <span className="fLink">Education & Tutorials</span>
                <span className="fLink">Product & Brand Marketing</span>
              </div>

              <div>
                <div className="fHead">Contact</div>
                <span className="fLink">hello@nuranova.com</span>
                <span className="fLink">+94 XX XXX XXXX</span>
                <span className="fLink">Sri Lanka</span>
              </div>
            </div>

            <div className="copyRow">
              <span>© {new Date().getFullYear()} NuraNova. All rights reserved.</span>
              <span>Privacy Policy | Terms & Conditions</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
