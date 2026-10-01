import {
  Satellite,
  Globe,
  Radio,
  Layers,
  ArrowRight,
  Activity,
  CheckCircle2
} from "lucide-react";

export default function NasaData({ onOpenModal }) {
  const satellites = [
    {
      name: "Landsat-8 & Landsat-9",
      instrument: "OLI-2 / TIRS-2",
      cadence: "8-Day Revisit Cadence",
      resolution: "15m Panchromatic • 30m Multispectral",
      desc: "Captures thermal infrared signatures and visible spectral bands to gauge canopy surface temperature and cellular vegetation vitality.",
      badges: ["Canopy Temp", "NDVI", "Thermal Stress"]
    },
    {
      name: "Sentinel-2 (Copernicus / NASA)",
      instrument: "MultiSpectral Instrument (MSI)",
      cadence: "5-Day Combined Revisit",
      resolution: "10m High Spatial Resolution",
      desc: "13 spectral bands engineered for red-edge chlorophyll absorption, nitrogen modeling, and active growth stage tracking.",
      badges: ["10m Ground Resolution", "Red-Edge Chlorophyll", "Cloud Masking"]
    },
    {
      name: "NASA SMAP",
      instrument: "L-Band Radar / Radiometer",
      cadence: "2–3 Day Global Cadence",
      resolution: "Top 5cm Soil Profile + Root Saturation",
      desc: "Penetrates cloud cover and canopy vegetation to measure dielectric properties of topsoil and root-zone soil moisture.",
      badges: ["Root-Zone Moisture", "Drought Tracking", "All-Weather Radar"]
    },
    {
      name: "ECOSTRESS (ISS)",
      instrument: "Multispectral Thermal Radiometer",
      cadence: "High Temporal Revisit",
      resolution: "70m Evapotranspiration Metric",
      desc: "Mounted on the International Space Station, monitoring diurnal plant water stress and cooling efficiency across field sectors.",
      badges: ["Evapotranspiration", "Water Use Efficiency", "Diurnal Cycle"]
    }
  ];

  return (
    <section
      id="nasa-data"
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
      overflow-hidden
      "
    >
      {/* Background Glow */}
      <div
        className="
        absolute
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        w-[600px]
        h-[600px]
        bg-cyan-500/10
        rounded-full
        blur-3xl
        pointer-events-none
        "
        aria-hidden="true"
      />

      <div
        className="
        relative
        z-10
        max-w-7xl
        mx-auto
        "
      >
        {/* Section Header */}
        <div
          className="
          flex
          flex-col
          md:flex-row
          md:items-end
          justify-between
          gap-6
          "
        >
          <div>
            <div
              className="
              inline-flex
              items-center
              gap-2
              bg-cyan-500/10
              border
              border-cyan-500/30
              text-cyan-400
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
              <Satellite className="w-3.5 h-3.5" />
              <span>NASA Earth Observation Program</span>
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
              Orbital Earth Science Data Engine
            </h2>

            <p
              className="
              mt-4
              text-base
              sm:text-lg
              text-gray-300
              max-w-2xl
              leading-relaxed
              "
            >
              We ingest and calibrate petabytes of raw NASA Earth observation data daily,
              converting space-grade radiation telemetry into farm-level decision intelligence.
            </p>
          </div>

          <div
            className="
            flex
            flex-wrap
            gap-3
            "
          >
            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal("specs")}
              className="
              px-5
              py-3
              rounded-full
              bg-cyan-500/20
              hover:bg-cyan-500/30
              border
              border-cyan-400/50
              text-cyan-300
              text-sm
              font-semibold
              flex
              items-center
              gap-2
              transition
              cursor-pointer
              "
            >
              <Globe className="w-4 h-4" />
              <span>Sensor Specifications</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenModal && onOpenModal("satellite")}
              className="
              px-6
              py-3
              rounded-full
              bg-green-400
              hover:bg-green-300
              text-black
              text-sm
              font-bold
              flex
              items-center
              gap-2
              shadow-lg
              shadow-green-400/20
              transition
              cursor-pointer
              "
            >
              <span>Explore Live Telemetry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Satellite Status Bar */}
        <div
          className="
          mt-12
          p-4
          rounded-2xl
          bg-black/60
          border
          border-cyan-500/30
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
          "
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
            <span className="text-xs sm:text-sm font-mono text-cyan-300">
              NASA Constellation Status: <strong className="text-emerald-400">NOMINAL & OPERATIONAL</strong>
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-gray-400">
            <span>Landsat-9 Pass: 38m ago</span>
            <span>Sentinel-2 Synced: 14m ago</span>
            <span>Spectral Ingestion: 99.98%</span>
          </div>
        </div>

        {/* Satellite Cards Grid */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          mt-8
          "
        >
          {satellites.map((sat) => (
            <div
              key={sat.name}
              className="
              p-7
              rounded-3xl
              bg-white/5
              border
              border-white/10
              hover:border-cyan-400/40
              transition-all
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
                  mb-3
                  "
                >
                  <h3
                    className="
                    text-xl
                    font-bold
                    text-white
                    "
                  >
                    {sat.name}
                  </h3>
                  <span
                    className="
                    text-xs
                    font-mono
                    text-cyan-400
                    bg-cyan-500/10
                    px-2.5
                    py-1
                    rounded-lg
                    border
                    border-cyan-500/20
                    "
                  >
                    {sat.instrument}
                  </span>
                </div>

                <div
                  className="
                  text-xs
                  font-medium
                  text-gray-400
                  mb-3
                  flex
                  items-center
                  gap-2
                  "
                >
                  <span>{sat.cadence}</span>
                  <span>•</span>
                  <span>{sat.resolution}</span>
                </div>

                <p
                  className="
                  text-sm
                  text-gray-300
                  leading-relaxed
                  "
                >
                  {sat.desc}
                </p>
              </div>

              <div
                className="
                flex
                flex-wrap
                gap-2
                mt-6
                pt-4
                border-t
                border-white/10
                "
              >
                {sat.badges.map((b) => (
                  <span
                    key={b}
                    className="
                    text-[11px]
                    font-semibold
                    text-emerald-300
                    bg-emerald-950/60
                    border
                    border-emerald-500/30
                    px-2.5
                    py-0.5
                    rounded-md
                    "
                  >
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
