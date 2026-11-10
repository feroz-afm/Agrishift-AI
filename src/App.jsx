import { useState, useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import NasaData from "./components/NasaData";
import HowItWorks from "./components/HowItWorks";
import Impact from "./components/Impact";
import About from "./components/About";
import Footer from "./components/Footer";
import HeroModal from "./components/HeroModal";

// The working crop-rotation app (real NASA data + backend) lives at #/app
const FieldShiftApp = lazy(() => import("./fieldshift/FieldShiftApp.jsx"));
const isAppRoute = () => window.location.hash.startsWith("#/app");

export default function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [appRoute, setAppRoute] = useState(isAppRoute);

  useEffect(() => {
    const onHash = () => { setAppRoute(isAppRoute()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (appRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0D1412]" />}>
        <FieldShiftApp />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b17] text-white selection:bg-green-400 selection:text-black">
      <Navbar onOpenModal={setActiveModal} />

      <main>
        <Hero onOpenModal={setActiveModal} />
        <Features />
        <NasaData onOpenModal={setActiveModal} />
        <HowItWorks onOpenModal={setActiveModal} />
        <Impact onOpenModal={setActiveModal} />
        <About onOpenModal={setActiveModal} />
      </main>

      <Footer />

      {activeModal && (
        <HeroModal type={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}