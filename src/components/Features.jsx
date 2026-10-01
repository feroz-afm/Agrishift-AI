export default function Features() {
  const cards = [
    {
      icon: "🛰️",
      title: "Satellite Monitoring",
      description:
        "Real-time NASA Earth observation data tracking plant health (NDVI) and field conditions from orbit."
    },
    {
      icon: "🌱",
      title: "AI Crop Recommendations",
      description:
        "Intelligent suggestions matching your soil type and regional climate to the highest-yielding crops."
    },
    {
      icon: "💧",
      title: "Moisture & Water Insights",
      description:
        "Satellite radar measures topsoil and root-zone moisture to optimize irrigation and save up to 34% water."
    }
  ];

  return (
    <section
      id="features"
      className="
      py-24
      px-6
      sm:px-10
      bg-slate-950
      text-white
      border-t
      border-white/10
      "
    >
      <div
        className="
        max-w-6xl
        mx-auto
        "
      >
        {/* Header */}
        <div
          className="
          text-center
          max-w-2xl
          mx-auto
          "
        >
          <span
            className="
            text-green-400
            text-xs
            font-bold
            uppercase
            tracking-widest
            bg-green-500/10
            border
            border-green-500/20
            px-3.5
            py-1
            rounded-full
            "
          >
            Core Features
          </span>

          <h2
            className="
            text-3xl
            sm:text-4xl
            font-bold
            mt-4
            "
          >
            Intelligent Tools for Smarter Farming
          </h2>

          <p
            className="
            text-gray-300
            text-base
            mt-3
            "
          >
            Simple, data-driven insights to boost crop yields and conserve resources.
          </p>
        </div>

        {/* 3 Simple Cards Grid */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-8
          mt-14
          "
        >
          {cards.map((card) => (
            <div
              key={card.title}
              className="
              p-8
              rounded-3xl
              bg-white/5
              border
              border-white/10
              hover:border-green-400/40
              hover:bg-white/[0.08]
              transition
              "
            >
              <div
                className="
                text-4xl
                mb-5
                "
                aria-hidden="true"
              >
                {card.icon}
              </div>

              <h3
                className="
                text-xl
                font-bold
                text-white
                "
              >
                {card.title}
              </h3>

              <p
                className="
                text-sm
                text-gray-300
                mt-3
                leading-relaxed
                "
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
