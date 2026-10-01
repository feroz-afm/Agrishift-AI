import {
  Globe,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  Sprout
} from "lucide-react";

export default function About({ onOpenModal }) {
  const pillars = [
    {
      icon: Globe,
      title: "NASA Applied Sciences",
      desc: "Built in adherence to NASA Earth Science Division data standards, ensuring research-grade radiometric accuracy for every field boundary."
    },
    {
      icon: ShieldCheck,
      title: "Data Sovereignty & Privacy",
      desc: "Your field boundaries, yield records, and farm telemetry remain 100% private and protected by enterprise encryption."
    },
    {
      icon: Award,
      title: "Certified Agronomy Team",
      desc: "Our AI recommendation models are supervised by certified crop advisors (CCA) and agricultural university researchers."
    },
    {
      icon: Users,
      title: "Global Grower Network",
      desc: "Deployed across 14 countries spanning drought-prone arid zones, temperate grain belts, and tropical plantations."
    }
  ];

  return (
    <section
      id="about"
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
            bg-purple-500/10
            border
            border-purple-500/30
            text-purple-400
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
            About AgriShift AI
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
            Pioneering Space-Powered Agriculture
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
            We empower farmers and cooperatives with the computational intelligence needed
            to sustain crop yields in the face of climate volatility.
          </p>
        </div>

        {/* Pillars Grid */}
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
          mt-16
          "
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="
                p-7
                rounded-3xl
                bg-white/5
                border
                border-white/10
                hover:border-purple-400/40
                transition
                "
              >
                <div
                  className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-purple-500/10
                  text-purple-400
                  flex
                  items-center
                  justify-center
                  mb-4
                  "
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3
                  className="
                  text-lg
                  font-bold
                  text-white
                  "
                >
                  {pillar.title}
                </h3>

                <p
                  className="
                  text-xs
                  text-gray-300
                  mt-2
                  leading-relaxed
                  "
                >
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Big Final Call to Action Banner */}
        <div
          className="
          mt-20
          p-10
          sm:p-14
          rounded-3xl
          bg-gradient-to-r
          from-emerald-950/70
          via-slate-900/90
          to-teal-950/70
          border
          border-emerald-500/30
          text-center
          relative
          overflow-hidden
          shadow-2xl
          shadow-green-500/10
          "
        >
          <div
            className="
            w-16
            h-16
            rounded-full
            bg-green-400/20
            border
            border-green-400/40
            text-green-400
            flex
            items-center
            justify-center
            mx-auto
            mb-6
            "
          >
            <Sprout className="w-8 h-8" />
          </div>

          <h3
            className="
            text-3xl
            sm:text-4xl
            font-bold
            text-white
            max-w-2xl
            mx-auto
            "
          >
            Ready to Transform Your Farm With Satellite Intelligence?
          </h3>

          <p
            className="
            text-base
            text-gray-300
            mt-4
            max-w-xl
            mx-auto
            "
          >
            Join over 1,200 growers leveraging NASA multispectral telemetry
            for higher yields and reduced climate risk.
          </p>

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
            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal("advisory")}
              className="
              px-8
              py-4
              rounded-full
              bg-green-400
              hover:bg-green-300
              text-black
              font-bold
              text-base
              flex
              items-center
              gap-2
              shadow-lg
              shadow-green-400/30
              transition
              cursor-pointer
              "
            >
              <span>Explore Demo Farm</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal("contact")}
              className="
              px-8
              py-4
              rounded-full
              bg-white/10
              hover:bg-white/20
              border
              border-white/20
              text-white
              font-semibold
              text-base
              flex
              items-center
              gap-2
              backdrop-blur-md
              transition
              cursor-pointer
              "
            >
              <PhoneCall className="w-5 h-5 text-green-400" />
              <span>Contact Sales</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
