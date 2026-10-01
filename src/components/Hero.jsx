import heroBg from "../assets/hero-bg.png";
import FeatureCard from "./FeatureCard";
import LoginCard from "./LoginCard";


export default function Hero() {

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
      lg:py-20
      "

      style={{
        backgroundImage: `url(${heroBg})`
      }}

    >

      <div className="
      absolute
      inset-0
      bg-black/30
      " aria-hidden="true">
      </div>

      <div className="
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
      ">

        <div>

          <div className="
          inline-block
          bg-blue-900/50
          px-5
          py-2
          rounded-full
          text-white
          ">
            <span aria-hidden="true">🛰</span> Powered by NASA Earth Data
          </div>

          <h1 className="
          text-white
          text-4xl
          sm:text-5xl
          lg:text-6xl
          font-bold
          leading-tight
          mt-8
          ">
            Transform Farming
            <br />
            with
            <span className="
            text-green-400
            ">
              NASA Earth
            </span>
            <br />
            Intelligence
          </h1>

          <p className="
          text-white
          text-lg
          sm:text-xl
          mt-6
          max-w-xl
          ">
            AI-powered crop recommendations
            for climate-resilient and sustainable agriculture.
          </p>

          <div className="
          flex
          flex-wrap
          gap-5
          mt-8
          ">

            <button
              type="button"
              className="
              bg-green-400
              text-black
              px-8
              py-4
              rounded-full
              font-bold
              hover:bg-green-300
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-green-400
              transition
              ">
              Explore Demo Farm →
            </button>

            <button
              type="button"
              className="
              border
              border-white
              text-white
              px-8
              py-4
              rounded-full
              hover:bg-white/10
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-white
              transition
              ">
              <span aria-hidden="true">▶</span> Watch Video
            </button>

          </div>

          <div
            id="features"
            className="
            flex
            flex-wrap
            gap-4
            mt-16
            "
          >

            <FeatureCard
              icon="🛰️"
              title="Satellite Monitoring"
              text="Real-time NASA Earth observation data"
            />

            <FeatureCard
              icon="🌱"
              title="AI Crop Recommendation"
              text="Find best crops for your field"
            />

          </div>

        </div>

        <div className="
        flex
        justify-center
        lg:justify-end
        ">
          <LoginCard />
        </div>

      </div>

    </section>
  )
}