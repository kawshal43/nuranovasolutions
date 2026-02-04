import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <AppRoutes />
      </div>
      <Footer />
    </>
  );
}
