import {
  Satellite,
  Cpu,
  Tractor,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function HowItWorks({ onOpenModal }) {
  const steps = [
    {
      num: "01",
      icon: Satellite,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      title: "Daily Orbital Ingestion",
      desc: "Our cloud ingestion pipelines pull raw multispectral and thermal imagery from NASA Landsat-8/9, Sentinel-2, and SMAP satellites within minutes of downlink."
    },
    {
      num: "02",
      icon: Cpu,
      color: "text-green-400",
      bg: "bg-green-500/10",
      title: "AI Agro-Calibration",
      desc: "Deep neural networks cross-correlate spectral reflectance with your regional soil surveys, topography, and historical weather patterns to detect early stress."
    },
    {
      num: "03",
      icon: Tractor,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      title: "Field Prescription & Action",
      desc: "Farmers receive pinpoint recommendations for crop rotation, variable-rate fertilizer zones, and optimized irrigation schedules ready for cab export."
    }
  ];

  return (
    <section
      id="how-it-works"
      className="
      relative
      py-24
      px-6
      sm:px-10
      lg:px-16
      bg-slate-950
      text-white
      border-t
      border-white/10
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        "
      >
        {/* Header */}
        <div
          className="
          text-center
          max-w-3xl
          mx-auto
          "
        >
          <div
            className="
            inline-block
            bg-emerald-500/10
            border
            border-emerald-500/30
            text-emerald-400
            text-xs
            font-bold
            uppercase
            tracking-widest
            px-4
            py-1.5
            rounded-full
            mb-4
            "
          >
            Streamlined Workflow
          </div>

          <h2
            className="
            text-3xl
            sm:text-4xl
            lg:text-5xl
            font-bold
            tracking-tight
            "
          >
            How AgriShift AI Delivers Intelligence
          </h2>

          <p
            className="
            mt-4
            text-base
            sm:text-lg
            text-gray-300
            leading-relaxed
            "
          >
            A completely automated pipeline from space observation to precise ground action.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-8
          mt-16
          relative
          "
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="
                relative
                p-8
                rounded-3xl
                bg-white/5
                border
                border-white/10
                hover:border-green-400/40
                transition-all
                duration-300
                flex
                flex-col
                justify-between
                group
                "
              >
                <div>
                  <div
                    className="
                    flex
                    items-center
                    justify-between
                    mb-6
                    "
                  >
                    <div
                      className={`
                      w-14
                      h-14
                      rounded-2xl
                      ${step.bg}
                      ${step.color}
                      flex
                      items-center
                      justify-center
                      group-hover:scale-110
                      transition-transform
                      `}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <span
                      className="
                      text-4xl
                      font-mono
                      font-bold
                      text-white/15
                      group-hover:text-green-400/30
                      transition-colors
                      "
                    >
                      {step.num}
                    </span>
                  </div>

                  <h3
                    className="
                    text-xl
                    font-bold
                    text-white
                    group-hover:text-green-300
                    transition-colors
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                    text-sm
                    text-gray-300
                    mt-3
                    leading-relaxed
                    "
                  >
                    {step.desc}
                  </p>
                </div>

                <div
                  className="
                  mt-6
                  pt-4
                  border-t
                  border-white/10
                  text-xs
                  font-mono
                  text-gray-400
                  "
                >
                  Step {idx + 1} of 3 • Fully Automated
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div
          className="
          mt-14
          p-8
          rounded-3xl
          bg-gradient-to-r
          from-green-950/40
          via-emerald-950/30
          to-slate-900/80
          border
          border-green-500/30
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-6
          text-center
          sm:text-left
          "
        >
          <div>
            <h4
              className="
              text-xl
              font-bold
              text-white
              flex
              items-center
              justify-center
              sm:justify-start
              gap-2
              "
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>Experience the Simulation in Real Time</span>
            </h4>
            <p
              className="
              text-sm
              text-gray-300
              mt-1
              "
            >
              Test how AgriShift AI recommends crops and conserves water based on your soil type.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenModal && onOpenModal("advisory")}
            className="
            px-7
            py-3.5
            rounded-full
            bg-green-400
            hover:bg-green-300
            text-black
            font-bold
            text-sm
            flex
            items-center
            gap-2
            shadow-lg
            shadow-green-400/20
            transition
            cursor-pointer
            shrink-0
            "
          >
            <span>Launch AI Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
