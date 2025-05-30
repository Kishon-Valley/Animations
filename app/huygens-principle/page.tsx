import Link from "next/link"

export default function HuygensPrinciplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <Link
        href="/"
        className="absolute top-4 left-4 z-30 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to Menu
      </Link>
      
      <div className="max-w-4xl mx-auto mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Huygens Principle</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">About Huygens Principle</h2>
          <p className="mb-4">
            Huygens' Principle states that every point on a wavefront serves as a source of wavelets that spread out 
            in the forward direction at the same speed as the wave. The new wavefront is the tangential surface to all 
            of these wavelets.
          </p>
          <p>
            This principle explains how waves propagate and interact with obstacles, allowing us to understand 
            phenomena such as diffraction and interference.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Wavefront:</strong> A surface of constant phase in a wave</li>
            <li><strong>Secondary wavelets:</strong> New waves generated from each point on a wavefront</li>
            <li><strong>Wave propagation:</strong> The process by which waves travel through a medium</li>
            <li><strong>Diffraction:</strong> The bending of waves around obstacles or through openings</li>
            <li><strong>Applications:</strong> Optics, acoustics, radio wave propagation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
