import { useState } from "react";
import heroBg from "../assets/hero-bg.png";
import FeatureCard from "./FeatureCard";
import LoginCard from "./LoginCard";
import HeroModal from "./HeroModal";
import {
  Satellite,
  Play,
  ArrowRight,
  Sprout,
  Sparkles,
  FileText,
  PhoneCall,
  TrendingUp,
  Globe
} from "lucide-react";

export default function Hero() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <section
      id="home"
      className="
      min-h-screen
      bg-cover
      bg-center
      relative
      flex
      items-center
      px-6
      sm:px-10
      lg:px-16
      py-32
      lg:py-24
      "
      style={{
        backgroundImage: `url(${heroBg})`
      }}
    >
      <div
        className="
        absolute
        inset-0
        bg-black/40
        backdrop-blur-[1px]
        "
        aria-hidden="true"
      />

      <div
        className="
        relative
        z-10
        grid
        grid-cols-1
        lg:grid-cols-2
        items-center
        gap-10
        lg:gap-16
        w-full
        max-w-7xl
        mx-auto
        "
      >
        <div>
          {/* Top NASA Badge Button */}
          <button
            type="button"
            onClick={() => setActiveModal("specs")}
            className="
            inline-flex
            items-center
            gap-2
            bg-blue-900/60
            hover:bg-blue-800/80
            border
            border-blue-400/30
            px-4
            py-1.5
            rounded-full
            text-xs
            sm:text-sm
            text-white
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-blue-400
            transition
            cursor-pointer
            group
            "
          >
            <Satellite className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Powered by NASA Earth Data</span>
            <span className="text-cyan-300 font-semibold group-hover:translate-x-0.5 transition-transform">
              • View Specs →
            </span>
          </button>

          <h1
            className="
            text-white
            text-4xl
            sm:text-5xl
            lg:text-6xl
            font-bold
            leading-tight
            mt-6
            "
          >
            Transform Farming
            <br />
            with{" "}
            <span
              className="
              text-green-400
              "
            >
              NASA Earth
            </span>
            <br />
            Intelligence
          </h1>

          <p
            className="
            text-gray-200
            text-lg
            sm:text-xl
            mt-5
            max-w-xl
            leading-relaxed
            "
          >
            AI-powered crop recommendations and multispectral telemetry for
            climate-resilient, sustainable agriculture.
          </p>

          {/* Primary Action Buttons */}
          <div
            className="
            flex
            flex-wrap
            gap-3.5
            mt-8
            "
          >
            <button
              type="button"
              onClick={() => setActiveModal("advisory")}
              className="
              bg-green-400
              hover:bg-green-300
              text-black
              px-7
              py-3.5
              rounded-full
              font-bold
              text-sm
              sm:text-base
              flex
              items-center
              gap-2
              shadow-lg
              shadow-green-400/20
              hover:shadow-green-400/40
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-green-400
              transition
              cursor-pointer
              "
            >
              <span>Explore Demo Farm</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("satellite")}
              className="
              bg-cyan-500/20
              hover:bg-cyan-500/30
              border
              border-cyan-400/50
              text-white
              px-6
              py-3.5
              rounded-full
              font-semibold
              text-sm
              sm:text-base
              flex
              items-center
              gap-2.5
              backdrop-blur-md
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-cyan-400
              transition
              cursor-pointer
              "
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
              <Satellite className="w-4 h-4 text-cyan-300" />
              <span>Live Satellite Map</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("advisory")}
              className="
              bg-emerald-500/20
              hover:bg-emerald-500/30
              border
              border-emerald-400/50
              text-white
              px-6
              py-3.5
              rounded-full
              font-semibold
              text-sm
              sm:text-base
              flex
              items-center
              gap-2
              backdrop-blur-md
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-emerald-400
              transition
              cursor-pointer
              "
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Crop Advisory</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("video")}
              className="
              border
              border-white/40
              hover:border-white
              hover:bg-white/10
              text-white
              px-6
              py-3.5
              rounded-full
              font-semibold
              text-sm
              sm:text-base
              flex
              items-center
              gap-2
              backdrop-blur-md
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-white
              transition
              cursor-pointer
              "
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Video</span>
            </button>
          </div>

          {/* Secondary Quick-Action Pill Buttons */}
          <div
            className="
            mt-6
            pt-5
            border-t
            border-white/15
            "
          >
            <div
              className="
              text-xs
              font-semibold
              text-gray-300
              uppercase
              tracking-wider
              mb-3
              flex
              items-center
              gap-1.5
              "
            >
              <span>Quick Actions</span>
            </div>

            <div
              className="
              flex
              flex-wrap
              gap-2.5
              "
            >
              <button
                type="button"
                onClick={() => setActiveModal("cases")}
                className="
                inline-flex
                items-center
                gap-1.5
                px-4
                py-2
                rounded-xl
                bg-white/10
                hover:bg-white/20
                border
                border-white/15
                hover:border-white/30
                text-xs
                sm:text-sm
                font-medium
                text-gray-200
                hover:text-white
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-green-400
                transition
                cursor-pointer
                "
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Case Studies</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("contact")}
                className="
                inline-flex
                items-center
                gap-1.5
                px-4
                py-2
                rounded-xl
                bg-white/10
                hover:bg-white/20
                border
                border-white/15
                hover:border-white/30
                text-xs
                sm:text-sm
                font-medium
                text-gray-200
                hover:text-white
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-green-400
                transition
                cursor-pointer
                "
              >
                <PhoneCall className="w-3.5 h-3.5 text-green-400" />
                <span>Contact Sales</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("roi")}
                className="
                inline-flex
                items-center
                gap-1.5
                px-4
                py-2
                rounded-xl
                bg-white/10
                hover:bg-white/20
                border
                border-white/15
                hover:border-white/30
                text-xs
                sm:text-sm
                font-medium
                text-gray-200
                hover:text-white
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-amber-400
                transition
                cursor-pointer
                "
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                <span>ROI Calculator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("specs")}
                className="
                inline-flex
                items-center
                gap-1.5
                px-4
                py-2
                rounded-xl
                bg-white/10
                hover:bg-white/20
                border
                border-white/15
                hover:border-white/30
                text-xs
                sm:text-sm
                font-medium
                text-gray-200
                hover:text-white
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-cyan-400
                transition
                cursor-pointer
                "
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>NASA Specs</span>
              </button>
            </div>
          </div>

          {/* Feature Cards Row */}
          <div
            id="features"
            className="
            flex
            flex-wrap
            gap-4
            mt-10
            "
          >
            <FeatureCard
              icon="🛰️"
              title="Satellite Monitoring"
              text="Real-time NASA Earth observation data & spectral indices"
              actionText="Live Telemetry"
              onClick={() => setActiveModal("satellite")}
            />

            <FeatureCard
              icon="🌱"
              title="AI Crop Recommendation"
              text="Predictive climate-soil matching for maximum yield"
              actionText="Try AI Simulator"
              onClick={() => setActiveModal("advisory")}
            />
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div
          className="
          flex
          justify-center
          lg:justify-end
          "
        >
          <LoginCard />
        </div>
      </div>

      {/* Interactive Modal triggered by buttons */}
      <HeroModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </section>
  );
}