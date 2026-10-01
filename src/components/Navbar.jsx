import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="
      sticky
      top-0
      w-full
      z-40
      bg-[#0b1220]/90
      backdrop-blur-md
      border-b
      border-white/10
      "
    >
      <div
        className="
        max-w-6xl
        mx-auto
        flex
        justify-between
        items-center
        px-6
        py-4
        text-white
        "
      >
        {/* Brand */}
        <a
          href="#home"
          className="
          text-2xl
          font-bold
          flex
          gap-2
          items-center
          focus-visible:outline-2
          focus-visible:outline-green-400
          "
        >
          <span className="text-green-400 text-3xl" aria-hidden="true">
            🌱
          </span>
          AgriShift
          <span className="text-blue-400">
            AI
          </span>
        </a>

        {/* Desktop Links */}
        <div
          className="
          hidden
          md:flex
          items-center
          gap-8
          text-sm
          text-gray-200
          "
        >
          <a
            href="#home"
            className="
            hover:text-green-400
            transition
            "
          >
            Home
          </a>

          <a
            href="#features"
            className="
            hover:text-green-400
            transition
            "
          >
            Features
          </a>

          <a
            href="#about"
            className="
            hover:text-green-400
            transition
            "
          >
            About
          </a>
        </div>

        {/* Action Button */}
        <div className="hidden md:block">
          <a
            href="#features"
            className="
            px-6
            py-2.5
            rounded-full
            bg-green-400
            text-black
            font-semibold
            text-sm
            hover:bg-green-300
            focus-visible:outline-2
            focus-visible:outline-green-400
            transition
            "
          >
            Get Started
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="
          md:hidden
          p-2
          rounded-xl
          bg-white/10
          text-white
          hover:bg-white/20
          transition
          "
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="
          md:hidden
          px-6
          py-4
          border-t
          border-white/10
          bg-[#0b1220]
          flex
          flex-col
          gap-3
          "
        >
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-200 hover:text-green-400 py-1"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-200 hover:text-green-400 py-1"
          >
            Features
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-200 hover:text-green-400 py-1"
          >
            About
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="
            w-full
            text-center
            py-2.5
            rounded-full
            bg-green-400
            text-black
            font-bold
            text-sm
            mt-2
            "
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}