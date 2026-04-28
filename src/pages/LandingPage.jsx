import Home from "./Home";
import Services from "./Services";
import About from "./About";
import Contact from "./Contact";
import FloatingIcons from "../components/FloatingIcons";

export default function LandingPage() {
  return (
    <div className="main-content landing-flow">
      <Home />
      <div className="landing-secondary-flow">
        <FloatingIcons variant="ambient" />
        <Services />
        <About />
        <Contact />
      </div>
    </div>
  );
}
