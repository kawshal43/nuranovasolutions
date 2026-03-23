import Home from "./Home";
import Services from "./Services";
import About from "./About";
import Contact from "./Contact";

export default function LandingPage() {
  return (
    <div className="main-content">
      <Home />
      <Services />
      <About />
      <Contact />
    </div>
  );
}
