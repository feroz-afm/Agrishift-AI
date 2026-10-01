export default function FeatureCard({ icon, title, text }) {

  return (
    <div className="
    w-full
    sm:w-[250px]
    p-5
    rounded-2xl
    bg-black/40
    backdrop-blur-xl
    border
    border-white/20
    text-white
    hover:scale-105
    focus-within:scale-105
    transition
    cursor-pointer
    ">

      <div className="
      text-4xl
      mb-4
      " aria-hidden="true">
        {icon}
      </div>

      <h3 className="
      font-bold
      text-lg
      ">
        {title}
      </h3>

      <p className="
      text-sm
      text-gray-300
      mt-2
      ">
        {text}
      </p>

    </div>
  )
}