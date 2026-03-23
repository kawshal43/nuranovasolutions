import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppBootOverlay from "./components/AppBootOverlay";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Background from "./components/Background";
import LandingPage from "./pages/LandingPage";
import ServiceDetail from "./pages/ServiceDetail";

export default function App() {
  const [bootReady, setBootReady] = useState(false);

  return (
    <>
      <Background />
      {!bootReady && <AppBootOverlay onComplete={() => setBootReady(true)} />}
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
      </Routes>
      <Footer />
    </>
  );
}
