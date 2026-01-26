import "./ServiceCard.css";

export default function ServiceCard({ title, description, image, onLearnMore }) {
  return (
    <div className="service-card">
      <div className="service-left">
        <img className="service-image" src={image} alt={title} />
      </div>

      <div className="service-right">
        <h3 className="service-title">{title}</h3>
        <p className="service-desc">{description}</p>

        <div className="service-actions">
          <button className="service-btn" onClick={onLearnMore}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
