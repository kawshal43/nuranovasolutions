import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";
import FloatingIcons from "../components/FloatingIcons";
import ServiceCard from "../components/ServiceCard";
import ServiceHero from "../components/ServiceHero";
import {
  createServiceContrallerVars,
  getServiceContrallerThemeMode,
  serviceContraller,
} from "../controllers/serviceContraller";
import { serviceCatalog } from "../data/services";

export default function Services() {
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = useState(() =>
    getServiceContrallerThemeMode(document.documentElement.getAttribute("data-theme"))
  );

  useEffect(() => {
    const root = document.documentElement;
    const syncThemeMode = () => {
      setThemeMode(getServiceContrallerThemeMode(root.getAttribute("data-theme")));
    };

    syncThemeMode();

    const observer = new MutationObserver(syncThemeMode);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  const controllerVars = useMemo(() => createServiceContrallerVars(themeMode), [themeMode]);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      className="services-page landing-panel landing-services-panel"
      id="service-page"
      style={controllerVars}
    >
      <FloatingIcons config={serviceContraller.background} variant="ambient" />
      <div className="services-shell">
        <ServiceHero />
        <div className="services-catalog-divider" aria-hidden="true" />

        <div className="services-grid" id="services-grid">
          {serviceCatalog.map((service, index) => (
            <ServiceCard
              key={service.slug}
              description={service.description}
              image={service.image}
              index={index}
              onContact={scrollToContact}
              onLearnMore={() => navigate(`/services/${service.slug}`)}
              title={service.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
