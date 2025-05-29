import WaveProperties from "../../wave-properties"
import Link from "next/link"

export default function WavePropertiesPage() {
  return (
    <div className="relative">
      <Link
        href="/"
        className="absolute top-4 left-4 z-30 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to Menu
      </Link>
      <WaveProperties />
    </div>
  )
}
