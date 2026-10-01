import heroBg from "../assets/hero-bg.png";
import { Play, ArrowRight, ChevronDown, Satellite } from "lucide-react";

export default function Hero({ onOpenModal }) {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-6 sm:px-10 py-32 overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#060b17]" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/30 via-transparent to-cyan-950/20" aria-hidden="true" />

      {/* Animated glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] animate-pulse-glow pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-[80px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.2s" }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Live badge */}
        <button
          type="button"
          onClick={() => onOpenModal && onOpenModal("satellite")}
          className="inline-flex items-center gap-2.5 bg-black/50 border border-green-500/30 hover:border-green-400/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-green-300 hover:text-green-200 transition-all duration-300 mb-8 cursor-pointer group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <Satellite className="w-3.5 h-3.5" />
          Powered by NASA Earth Observation — Live Data
          <ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
        </button>

        {/* Headline */}
        <h1
          className="text-white font-bold leading-[1.08] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-8xl"
          style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
        >
          Transform Farming
          <br />
          with{" "}
          <span className="gradient-text">
            Satellite
          </span>
          <br />
          Intelligence
        </h1>

        <p className="text-gray-300 text-lg sm:text-xl mt-8 max-w-2xl leading-relaxed">
          AI-powered crop recommendations and real-time NASA telemetry —
          built for climate-resilient, high-yield agriculture.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 mb-10">
          {[
            { val: "+19.2%", label: "Avg Yield Increase" },
            { val: "−34%", label: "Water Saved" },
            { val: "1,200+", label: "Active Growers" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold gradient-text-warm">{s.val}</span>
              <span className="text-xs text-gray-400 mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#features"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-green-500/30 hover:shadow-green-400/50 hover:scale-[1.03] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-green-400"
          >
            Explore Demo Farm
            <ArrowRight className="w-4.5 h-4.5" />
          </a>

          <button
            type="button"
            onClick={() => onOpenModal && onOpenModal("advisory")}
            className="inline-flex items-center gap-2.5 border border-white/20 hover:border-white/40 bg-white/8 hover:bg-white/14 text-white px-8 py-4 rounded-2xl font-semibold text-base backdrop-blur-md hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            AI Simulator
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#features"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors duration-200 group"
        aria-label="Scroll to features"
      >
        <span className="text-xs font-medium tracking-widest uppercase opacity-60">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </a>
    </section>
  );
}