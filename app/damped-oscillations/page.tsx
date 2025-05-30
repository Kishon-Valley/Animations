import Link from "next/link"

export default function DampedOscillationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <Link
        href="/"
        className="absolute top-4 left-4 z-30 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to Menu
      </Link>
      
      <div className="max-w-4xl mx-auto mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Damped Oscillations</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">About Damped Oscillations</h2>
          <p className="mb-4">
            Damped oscillations occur when a system experiences a resistive force (like friction or air resistance) 
            that causes the amplitude of oscillation to decrease over time.
          </p>
          <p>
            There are three types of damping: underdamped, critically damped, and overdamped, each with distinct behaviors 
            in how the system returns to equilibrium.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Underdamped:</strong> System oscillates with decreasing amplitude</li>
            <li><strong>Critically damped:</strong> System returns to equilibrium as quickly as possible without oscillating</li>
            <li><strong>Overdamped:</strong> System returns to equilibrium without oscillating, but more slowly</li>
            <li><strong>Damping ratio:</strong> Determines the type of damping behavior</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
