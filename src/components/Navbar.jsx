export default function Navbar() {
  return (
    <nav className="
    absolute
    top-0
    left-0
    w-full
    z-20
    flex
    justify-between
    items-center
    px-6
    sm:px-10
    py-6
    text-white
    ">

      <a
        href="/"
        className="
        text-2xl
        font-bold
        flex
        gap-2
        items-center
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-green-400
        ">

        <span className="text-green-400 text-3xl" aria-hidden="true">
          🌱
        </span>

        AgriShift
        <span className="text-blue-400">
          AI
        </span>

      </a>

      <div className="
      hidden
      md:flex
      gap-10
      text-gray-200
      ">

        <a
          href="#home"
          className="
          hover:text-green-400
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-green-400
          transition
          ">
          Home
        </a>

        <a
          href="#features"
          className="
          hover:text-green-400
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-green-400
          transition
          ">
          Features
        </a>

        <a
          href="#nasa-data"
          className="
          hover:text-green-400
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-green-400
          transition
          ">
          NASA Data
        </a>

        <a
          href="#how-it-works"
          className="
          hover:text-green-400
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-green-400
          transition
          ">
          How It Works
        </a>

        <a
          href="#impact"
          className="
          hover:text-green-400
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-green-400
          transition
          ">
          Impact
        </a>

        <a
          href="#about"
          className="
          hover:text-green-400
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-green-400
          transition
          ">
          About
        </a>

      </div>

      <div className="flex gap-4">

        <button
          type="button"
          className="
          px-6
          py-2
          rounded-full
          border
          border-blue-400
          hover:bg-white/10
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-blue-400
          transition
          ">
          Demo
        </button>

        <button
          type="button"
          className="
          px-7
          py-2
          rounded-full
          bg-green-400
          text-black
          font-semibold
          hover:bg-green-300
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-green-400
          transition
          ">
          Login
        </button>

      </div>

    </nav>
  )
}