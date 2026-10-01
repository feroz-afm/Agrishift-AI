import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div
      className="
      min-h-screen
      bg-[#0b1220]
      text-white
      selection:bg-green-400
      selection:text-black
      "
    >
      <Navbar />

      <main>
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  );
}