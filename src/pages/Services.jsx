import { useNavigate } from "react-router-dom";
import "./Services.css";
import ServiceCard from "../components/ServiceCard";
import ServiceHero from "../components/ServiceHero";
import { serviceCatalog } from "../data/services";

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="services-page landing-panel landing-services-panel" id="service-page">
      <ServiceHero
        onScrollDown={() =>
          document.getElementById("services-grid").scrollIntoView({ behavior: "smooth" })
        }
      />

      <section className="services-catalog-section" id="services-grid">
        <div className="services-grid">
          {serviceCatalog.map((service, index) => (
            <ServiceCard
              key={service.slug}
              index={index}
              title={service.title}
              description={service.description}
              image={service.image}
              onLearnMore={() => navigate(`/services/${service.slug}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
