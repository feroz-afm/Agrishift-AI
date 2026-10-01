import heroBg from "../assets/hero-bg.png";
import { Play, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="
      min-h-[90vh]
      bg-cover
      bg-center
      relative
      flex
      items-center
      justify-center
      px-6
      sm:px-10
      py-28
      lg:py-32
      "
      style={{
        backgroundImage: `url(${heroBg})`
      }}
    >
      <div
        className="
        absolute
        inset-0
        bg-black/55
        backdrop-blur-[1px]
        "
        aria-hidden="true"
      />

      <div
        className="
        relative
        z-10
        flex
        flex-col
        items-center
        text-center
        max-w-3xl
        mx-auto
        "
      >
        {/* Top Badge */}
        <div
          className="
          inline-flex
          items-center
          gap-2
          bg-blue-900/60
          border
          border-blue-400/40
          px-4
          py-1.5
          rounded-full
          text-xs
          sm:text-sm
          text-white
          "
        >
          <span aria-hidden="true">🛰</span>
          <span>Powered by NASA Earth Data</span>
        </div>

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
          text-base
          sm:text-lg
          mt-5
          max-w-xl
          leading-relaxed
          "
        >
          AI-powered crop recommendations and satellite telemetry
          for climate-resilient and sustainable agriculture.
        </p>

        {/* 2 Clear Action Buttons */}
        <div
          className="
          flex
          flex-wrap
          items-center
          justify-center
          gap-4
          mt-8
          "
        >
          <a
            href="#features"
            className="
            bg-green-400
            hover:bg-green-300
            text-black
            px-8
            py-4
            rounded-full
            font-bold
            text-base
            flex
            items-center
            gap-2
            shadow-lg
            shadow-green-400/25
            focus-visible:outline-2
            focus-visible:outline-green-400
            transition
            "
          >
            <span>Explore Demo Farm</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => alert("Product video tour coming soon!")}
            className="
            border
            border-white/40
            hover:border-white
            hover:bg-white/10
            text-white
            px-7
            py-4
            rounded-full
            font-semibold
            text-base
            flex
            items-center
            gap-2.5
            backdrop-blur-md
            focus-visible:outline-2
            focus-visible:outline-white
            transition
            cursor-pointer
            "
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Watch Video</span>
          </button>
        </div>
      </div>
    </section>
  );
}