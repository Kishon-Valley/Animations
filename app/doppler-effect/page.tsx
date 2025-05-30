import Link from "next/link"

export default function DopplerEffectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <Link
        href="/"
        className="absolute top-4 left-4 z-30 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to Menu
      </Link>
      
      <div className="max-w-4xl mx-auto mt-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Doppler Effect</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">About the Doppler Effect</h2>
          <p className="mb-4">
            The Doppler effect is the change in frequency of a wave in relation to an observer who is moving
            relative to the wave source. When a wave source moves toward an observer, the frequency observed
            is higher than the emitted frequency. When the source moves away, the observed frequency is lower.
          </p>
          <p>
            This phenomenon explains why the pitch of a siren changes as an ambulance passes by, or why the
            light from stars moving away from Earth is shifted toward the red end of the spectrum.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Approaching source:</strong> Observed frequency increases (higher pitch)</li>
            <li><strong>Receding source:</strong> Observed frequency decreases (lower pitch)</li>
            <li><strong>Wavelength compression:</strong> Waves bunch up in front of a moving source</li>
            <li><strong>Wavelength expansion:</strong> Waves spread out behind a moving source</li>
            <li><strong>Applications:</strong> Radar, astronomy (redshift), medical ultrasound</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
