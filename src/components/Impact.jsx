import {
  TrendingUp,
  Droplets,
  Sprout,
  DollarSign,
  ArrowRight,
  FileText,
  Calculator
} from "lucide-react";

export default function Impact({ onOpenModal }) {
  const stats = [
    {
      value: "-34%",
      label: "Irrigation Water Saved",
      sub: "Measured across 1,400 ha of almond orchards during severe drought",
      icon: Droplets,
      color: "text-blue-400"
    },
    {
      value: "+19.2%",
      label: "Average Yield Increase",
      sub: "Documented across 3,200 ha in the Midwestern Grain & Soybean Belt",
      icon: Sprout,
      color: "text-green-400"
    },
    {
      value: "-26%",
      label: "Fertilizer Waste Reduction",
      sub: "Precision nitrogen mapping preventing excess groundwater run-off",
      icon: TrendingUp,
      color: "text-amber-400"
    },
    {
      value: "$138",
      label: "Net Gain / Acre / Season",
      sub: "Combined savings from input reduction and enhanced crop harvest",
      icon: DollarSign,
      color: "text-emerald-400"
    }
  ];

  return (
    <section
      id="impact"
      className="
      relative
      py-24
      px-6
      sm:px-10
      lg:px-16
      bg-[#0a0f1d]
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
            bg-blue-500/10
            border
            border-blue-500/30
            text-blue-400
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
            Verified Field Impact
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
            Proven Economic & Ecological Returns
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
            Real results from commercial growers who transformed their seasonal planning
            using NASA Earth data analytics.
          </p>
        </div>

        {/* Stats Grid */}
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
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="
                p-7
                rounded-3xl
                bg-white/5
                border
                border-white/10
                hover:border-white/25
                transition
                flex
                flex-col
                justify-between
                "
              >
                <div>
                  <div
                    className="
                    flex
                    items-center
                    justify-between
                    mb-4
                    "
                  >
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                    <span className="text-xs font-mono text-gray-400">Verified</span>
                  </div>

                  <div
                    className={`
                    text-4xl
                    sm:text-5xl
                    font-extrabold
                    ${stat.color}
                    tracking-tight
                    `}
                  >
                    {stat.value}
                  </div>

                  <div
                    className="
                    text-base
                    font-bold
                    text-white
                    mt-2
                    "
                  >
                    {stat.label}
                  </div>

                  <p
                    className="
                    text-xs
                    text-gray-400
                    mt-2
                    leading-relaxed
                    "
                  >
                    {stat.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive CTA Dual Banner */}
        <div
          className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
          mt-12
          "
        >
          {/* Card 1: ROI Calculator */}
          <div
            className="
            p-8
            rounded-3xl
            bg-gradient-to-br
            from-emerald-950/40
            to-slate-900
            border
            border-emerald-500/30
            flex
            flex-col
            justify-between
            "
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-2">
                <Calculator className="w-4 h-4" />
                <span>Interactive Economic Calculator</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Estimate Your Acreage Gains</h3>
              <p className="text-sm text-gray-300 mt-2">
                Input your farm size to model estimated water savings, reduced nitrogen costs, and gross yield improvements.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal("roi")}
              className="
              mt-6
              w-fit
              px-6
              py-3
              rounded-full
              bg-emerald-400
              hover:bg-emerald-300
              text-black
              font-bold
              text-sm
              flex
              items-center
              gap-2
              transition
              cursor-pointer
              "
            >
              <span>Calculate My Farm ROI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Case Studies */}
          <div
            className="
            p-8
            rounded-3xl
            bg-gradient-to-br
            from-blue-950/40
            to-slate-900
            border
            border-blue-500/30
            flex
            flex-col
            justify-between
            "
          >
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-2">
                <FileText className="w-4 h-4" />
                <span>Peer-Reviewed Field Audits</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Explore Independent Case Studies</h3>
              <p className="text-sm text-gray-300 mt-2">
                Read how commercial grower cooperatives mitigated drought conditions and preserved seasonal bottom lines.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal("cases")}
              className="
              mt-6
              w-fit
              px-6
              py-3
              rounded-full
              bg-blue-400
              hover:bg-blue-300
              text-black
              font-bold
              text-sm
              flex
              items-center
              gap-2
              transition
              cursor-pointer
              "
            >
              <span>Read Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
