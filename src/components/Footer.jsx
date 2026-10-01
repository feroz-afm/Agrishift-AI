export default function Footer() {
  return (
    <footer
      id="about"
      className="
      bg-[#070b14]
      text-white
      border-t
      border-white/10
      py-12
      px-6
      sm:px-10
      "
    >
      <div
        className="
        max-w-6xl
        mx-auto
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
          <a
            href="#home"
            className="
            text-xl
            font-bold
            inline-flex
            items-center
            gap-2
            "
          >
            <span className="text-green-400 text-2xl" aria-hidden="true">
              🌱
            </span>
            AgriShift
            <span className="text-blue-400">
              AI
            </span>
          </a>

          <p
            className="
            text-xs
            text-gray-400
            mt-1.5
            max-w-sm
            "
          >
            AI-powered crop recommendations calibrated by NASA Earth observation data.
          </p>
        </div>

        <div
          className="
          flex
          items-center
          gap-6
          text-sm
          text-gray-300
          "
        >
          <a href="#home" className="hover:text-green-400 transition">
            Home
          </a>
          <a href="#features" className="hover:text-green-400 transition">
            Features
          </a>
          <a href="#about" className="hover:text-green-400 transition">
            About
          </a>
        </div>

        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} AgriShift AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
