import { useNavigate } from "react-router-dom";
import "./Services.css";
import ServiceCard from "../components/ServiceCard";
import FloatingIcons from "../components/FloatingIcons";
import ServiceHero from "../components/ServiceHero";
import { serviceCatalog } from "../data/services";

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="services-page" id="service-page">
      <FloatingIcons />
      <ServiceHero
        onScrollDown={() =>
          document.getElementById("services-grid").scrollIntoView({ behavior: "smooth" })
        }
      />

      <section className="services-section" id="services-grid">
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
