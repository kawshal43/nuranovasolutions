import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <Home />
      <Services />
      <About />
      <Footer />
    </>
  );
}
