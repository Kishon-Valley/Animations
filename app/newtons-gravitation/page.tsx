import NewtonsGravitation from "../../newtons-gravitation"
import Link from "next/link"

export default function NewtonsGravitationPage() {
  return (
    <div className="relative">
      <Link
        href="/"
        className="absolute top-4 left-4 z-30 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to Menu
      </Link>
      <NewtonsGravitation />
    </div>
  )
}
