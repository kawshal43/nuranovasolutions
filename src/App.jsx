import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Home />
        <Services />
        <About />
        <Contact />
      </div>
      <Footer />
    </>
  );
}
