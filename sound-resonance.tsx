"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3, CatmullRomCurve3 } from "three"

export default function SoundResonance() {
  const [drivingFrequency, setDrivingFrequency] = useState(1)
  const [resonantFrequency, setResonantFrequency] = useState(1)
  const [amplitude, setAmplitude] = useState(0.5)
  const [damping, setDamping] = useState(0.1)
  const [resonanceMode, setResonanceMode] = useState("tube")
  const [paused, setPaused] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showAmplitudeGraph, setShowAmplitudeGraph] = useState(true)

  return (
    <div className="w-full h-screen bg-gray-900 relative">
      {/* Toggle button - always visible */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 z-20 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {showControls ? "Hide Controls" : "Show Controls"}
      </button>

      {/* Controls panel - conditionally visible */}
      <div
        className={`absolute top-4 left-4 z-10 bg-gray-800 p-4 rounded-lg text-white transition-all duration-300 ${
          showControls ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Sound Resonance</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Resonance Mode:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setResonanceMode("tube")}
                className={`px-2 py-1 rounded ${resonanceMode === "tube" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Tube Resonance
              </button>
              <button
                onClick={() => setResonanceMode("string")}
                className={`px-2 py-1 rounded ${resonanceMode === "string" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                String Resonance
              </button>
              <button
                onClick={() => setResonanceMode("cavity")}
                className={`px-2 py-1 rounded ${resonanceMode === "cavity" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Cavity Resonance
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">
              Driving Frequency: {drivingFrequency.toFixed(2)} Hz
              {Math.abs(drivingFrequency - resonantFrequency) < 0.05 && (
                <span className="ml-2 text-green-400">(Resonating!)</span>
              )}
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.01"
              value={drivingFrequency}
              onChange={(e) => setDrivingFrequency(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Resonant Frequency: {resonantFrequency.toFixed(2)} Hz</label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.01"
              value={resonantFrequency}
              onChange={(e) => setResonantFrequency(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Source Amplitude: {amplitude.toFixed(2)}</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={amplitude}
              onChange={(e) => setAmplitude(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Damping: {damping.toFixed(2)}</label>
            <input
              type="range"
              min="0.01"
              max="0.3"
              step="0.01"
              value={damping}
              onChange={(e) => setDamping(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAmplitudeGraph}
                onChange={() => setShowAmplitudeGraph(!showAmplitudeGraph)}
                className="mr-2"
              />
              Show Amplitude Graph
            </label>
          </div>

          <button
            onClick={() => setPaused(!paused)}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <ResonanceScene
          drivingFrequency={drivingFrequency}
          resonantFrequency={resonantFrequency}
          amplitude={amplitude}
          damping={damping}
          resonanceMode={resonanceMode}
          paused={paused}
          showAmplitudeGraph={showAmplitudeGraph}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function ResonanceScene({
  drivingFrequency,
  resonantFrequency,
  amplitude,
  damping,
  resonanceMode,
  paused,
  showAmplitudeGraph,
}: {
  drivingFrequency: number;
  resonantFrequency: number;
  amplitude: number;
  damping: number;
  resonanceMode: string;
  paused: boolean;
  showAmplitudeGraph: boolean;
}) {
  const timeRef = useRef(0)
  const [time, setTime] = useState(0)
  const [responseAmplitude, setResponseAmplitude] = useState(0)
  const [amplitudeHistory, setAmplitudeHistory] = useState<Array<{ time: number; amplitude: number }>>([])
  const [frequencySweepData, setFrequencySweepData] = useState<Array<{ frequency: number; response: number }>>([])

  // Update time and calculate response
  useFrame((state, delta) => {
    if (!paused) {
      // Update time
      const newTime = timeRef.current + delta
      timeRef.current = newTime
      setTime(newTime)

      // Calculate resonance response using a damped harmonic oscillator model
      // The response amplitude depends on how close the driving frequency is to the resonant frequency
      const frequencyRatio = drivingFrequency / resonantFrequency
      const forcingTerm = Math.sin(2 * Math.PI * drivingFrequency * newTime)

      // Resonance formula: amplitude ratio = 1/sqrt((1-r²)² + (2ζr)²) where r is frequency ratio and ζ is damping ratio
      const resonanceAmplitude =
        1 / Math.sqrt(Math.pow(1 - Math.pow(frequencyRatio, 2), 2) + Math.pow(2 * damping * frequencyRatio, 2))

      // Scale the response and apply the forcing term
      const newResponseAmplitude = amplitude * resonanceAmplitude * forcingTerm
      setResponseAmplitude(newResponseAmplitude)

      // Update amplitude history for visualization
      if (newTime % 0.1 < delta) {
        setAmplitudeHistory((prev) => {
          const newHistory = [...prev, { time: newTime, amplitude: Math.abs(newResponseAmplitude) }]
          return newHistory.slice(-100) // Keep only the last 100 points
        })
      }

      // Generate frequency sweep data if needed
      if (frequencySweepData.length === 0 || newTime % 5 < delta) {
        const sweepData = []
        for (let f = 0.5; f <= 1.5; f += 0.01) {
          const ratio = f / resonantFrequency
          const response = 1 / Math.sqrt(Math.pow(1 - Math.pow(ratio, 2), 2) + Math.pow(2 * damping * ratio, 2))
          sweepData.push({ frequency: f, response: response * amplitude })
        }
        setFrequencySweepData(sweepData)
      }
    }
  })

  // Render the appropriate resonance mode
  switch (resonanceMode) {
    case "tube":
      return (
        <TubeResonance
          drivingFrequency={drivingFrequency}
          resonantFrequency={resonantFrequency}
          amplitude={amplitude}
          responseAmplitude={responseAmplitude}
          time={time}
          amplitudeHistory={amplitudeHistory}
          frequencySweepData={frequencySweepData}
          showAmplitudeGraph={showAmplitudeGraph}
        />
      )
    case "string":
      return (
        <StringResonance
          drivingFrequency={drivingFrequency}
          resonantFrequency={resonantFrequency}
          amplitude={amplitude}
          responseAmplitude={responseAmplitude}
          time={time}
          amplitudeHistory={amplitudeHistory}
          frequencySweepData={frequencySweepData}
          showAmplitudeGraph={showAmplitudeGraph}
        />
      )
    case "cavity":
      return (
        <CavityResonance
          drivingFrequency={drivingFrequency}
          resonantFrequency={resonantFrequency}
          amplitude={amplitude}
          responseAmplitude={responseAmplitude}
          time={time}
          amplitudeHistory={amplitudeHistory}
          frequencySweepData={frequencySweepData}
          showAmplitudeGraph={showAmplitudeGraph}
        />
      )
    default:
      return null
  }
}

function TubeResonance({
  drivingFrequency,
  resonantFrequency,
  amplitude,
  responseAmplitude,
  time,
  amplitudeHistory,
  frequencySweepData,
  showAmplitudeGraph,
}: {
  drivingFrequency: number;
  resonantFrequency: number;
  amplitude: number;
  responseAmplitude: number;
  time: number;
  amplitudeHistory: Array<{ time: number; amplitude: number }>;
  frequencySweepData: Array<{ frequency: number; response: number }>;
  showAmplitudeGraph: boolean;
}) {
  const tubeLength = 10
  const tubeRadius = 1
  const numPoints = 50

  // Calculate wavelength based on resonant frequency (for visualization)
  const wavelength = (2 * tubeLength) / Math.round(resonantFrequency * 2)

  // Generate points for the standing wave in the tube
  const wavePoints: [number, number, number][] = []
  for (let i = 0; i <= numPoints; i++) {
    const x = -tubeLength / 2 + (i / numPoints) * tubeLength

    // Standing wave equation: A * sin(kx) * cos(ωt)
    // For a tube open at one end, closed at the other: k = (2n-1)π/2L
    const k = Math.PI / tubeLength
    const omega = 2 * Math.PI * drivingFrequency

    // Calculate amplitude based on position in tube and resonance
    const positionFactor = Math.sin(k * (x + tubeLength / 2))
    const y = responseAmplitude * positionFactor

    wavePoints.push([x, y, 0] as [number, number, number])
  }

  return (
    <group>
      {/* Tube with realistic appearance */}
      <group>
        {/* Tube body - cylindrical with transparency */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[tubeRadius, tubeRadius, tubeLength, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#88CCFF"
            transparent={true}
            opacity={0.3}
            roughness={0.1}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Closed end cap */}
        <mesh position={[-tubeLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[tubeRadius, tubeRadius, 0.2, 32]} />
          <meshStandardMaterial color="#555555" roughness={0.7} metalness={0.5} />
        </mesh>

        {/* Open end rim */}
        <mesh position={[tubeLength / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[tubeRadius, 0.1, 16, 32]} />
          <meshStandardMaterial color="#555555" roughness={0.7} metalness={0.5} />
        </mesh>
      </group>

      {/* Sound source - realistic speaker */}
      <group position={[tubeLength / 2 + 1.5, 0, 0]}>
        {/* Speaker cone */}
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <coneGeometry args={[0.8, 0.6, 32, 1, true]} />
          <meshStandardMaterial color="#222222" roughness={0.9} />
        </mesh>

        {/* Speaker frame */}
        <mesh position={[0.3, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.2, 32]} />
          <meshStandardMaterial color="#444444" roughness={0.7} metalness={0.5} />
        </mesh>

        {/* Speaker driver - moves with the sound */}
        <mesh
          position={[0.1 + Math.sin(time * Math.PI * 2 * drivingFrequency) * amplitude * 0.1, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <meshStandardMaterial color="#888888" roughness={0.5} metalness={0.8} />
        </mesh>
      </group>

      {/* Air particles - more realistic with varying sizes and colors */}
      {Array.from({ length: 40 }).map((_, index) => {
        const x = -tubeLength / 2 + 0.5 + ((index % 20) * (tubeLength - 1)) / 20

        // Calculate displacement based on standing wave pattern
        const k = Math.PI / tubeLength
        const omega = 2 * Math.PI * drivingFrequency
        const positionFactor = Math.sin(k * (x + tubeLength / 2))
        const displacement = responseAmplitude * positionFactor * Math.cos(omega * time)

        // Randomize y and z slightly for more natural appearance
        const angleOffset = index * 137.5 // golden angle for even distribution
        const radius = (0.7 + (index % 3) * 0.1) * Math.min(0.9, Math.abs(displacement) * 2 + 0.2)
        const y = radius * Math.cos(angleOffset) * 0.7
        const z = radius * Math.sin(angleOffset) * 0.7

        // Particle size varies with position in the wave
        const size = 0.08 + Math.abs(displacement) * 0.1

        // Color varies with displacement
        const intensity = 0.5 + Math.abs(displacement) * 0.5
        const hue = displacement > 0 ? 200 : 220 // slightly different blues

        return (
          <mesh key={index} position={[x, y, z]}>
            <sphereGeometry args={[size, 12, 12]} />
            <meshStandardMaterial
              color={`hsl(${hue}, ${70 + Math.abs(displacement) * 30}%, ${50 + intensity * 30}%)`}
              emissive={`hsl(${hue}, 70%, ${intensity * 30}%)`}
              emissiveIntensity={0.5}
              transparent={true}
              opacity={0.8}
            />
          </mesh>
        )
      })}

      {/* Sound wave visualization - more vibrant */}
      <Line
        points={wavePoints}
        color="#00FFFF"
        lineWidth={3}
        vertexColors={wavePoints.map((_, i) => {
          const hue = 180 + (i / numPoints) * 40;
          return [hue/360, 1, 0.7] as [number, number, number];
        })}
      />

      {/* Amplitude graph */}
      {showAmplitudeGraph && (
        <AmplitudeGraph
          amplitudeHistory={amplitudeHistory}
          frequencySweepData={frequencySweepData}
          drivingFrequency={drivingFrequency}
          resonantFrequency={resonantFrequency}
        />
      )}

      {/* Explanation */}
      <ResonanceExplanation
        drivingFrequency={drivingFrequency}
        resonantFrequency={resonantFrequency}
        mode="tube"
        wavelength={wavelength}
      />
    </group>
  )
}

function StringResonance({
  drivingFrequency,
  resonantFrequency,
  amplitude,
  responseAmplitude,
  time,
  amplitudeHistory,
  frequencySweepData,
  showAmplitudeGraph,
}: {
  drivingFrequency: number;
  resonantFrequency: number;
  amplitude: number;
  responseAmplitude: number;
  time: number;
  amplitudeHistory: Array<{ time: number; amplitude: number }>;
  frequencySweepData: Array<{ frequency: number; response: number }>;
  showAmplitudeGraph: boolean;
}) {
  const stringLength = 10
  const numPoints = 100

  // Calculate wavelength based on resonant frequency (for visualization)
  const wavelength = (2 * stringLength) / Math.round(resonantFrequency * 2)

  // Generate points for the vibrating string with more detail
  const stringPoints = []
  for (let i = 0; i <= numPoints; i++) {
    const x = -stringLength / 2 + (i / numPoints) * stringLength

    // Standing wave equation: A * sin(kx) * cos(ωt)
    // For a string fixed at both ends: k = nπ/L
    const k = Math.PI / stringLength
    const omega = 2 * Math.PI * drivingFrequency
    const timeFactor = Math.cos(omega * time)

    // Calculate amplitude based on position on string and resonance
    const positionFactor = Math.sin(k * (x + stringLength / 2))
    const y = responseAmplitude * positionFactor * timeFactor

    // Add a slight 3D effect for more realism
    const z = Math.sin(i / 5) * 0.02 * Math.abs(y)

    stringPoints.push([x, y, z])
  }

  return (
    <group>
      {/* Wooden resonance box */}
      <group position={[0, -1.5, -0.5]}>
        <mesh>
          <boxGeometry args={[stringLength + 2, 1, 2]} />
          <meshStandardMaterial
            color="#8B4513"
            roughness={0.9}
            metalness={0.1}
            map={null} // You would use a wood texture here in a real implementation
          />
        </mesh>

        {/* Sound hole */}
        <mesh position={[0, 0.51, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.1, 32]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>

      {/* String mounting pegs */}
      <group position={[-stringLength / 2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
          <meshStandardMaterial color="#B8860B" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      <group position={[stringLength / 2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
          <meshStandardMaterial color="#B8860B" roughness={0.7} metalness={0.3} />
        </mesh>
      </group>

      {/* Vibrating string - metallic appearance */}
      <mesh>
        <tubeGeometry
          args={[
            new CatmullRomCurve3(stringPoints.map((p) => new Vector3(p[0], p[1], p[2]))),
            numPoints,
            0.05,
            8,
            false,
          ]}
        />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.3}
          metalness={0.8}
          emissive="#444444"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Sound source - tuning fork */}
      <group position={[0, -3, 0]}>
        {/* Fork handle */}
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 1.5, 16]} />
          <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Fork base */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
          <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Fork tines - vibrating */}
        <group>
          {/* Left tine */}
          <mesh position={[-0.3, 0.75 + Math.sin(time * Math.PI * 2 * drivingFrequency) * amplitude * 0.1, 0]}>
            <boxGeometry args={[0.1, 1.5, 0.1]} />
            <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Right tine */}
          <mesh position={[0.3, 0.75 + Math.sin(time * Math.PI * 2 * drivingFrequency) * amplitude * 0.1, 0]}>
            <boxGeometry args={[0.1, 1.5, 0.1]} />
            <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Sound waves emanating from tuning fork */}
      {[0.5, 1, 1.5].map((radius, i) => (
        <mesh
          key={i}
          position={[0, -3, 0]}
          scale={[
            (0.5 + Math.sin(time * Math.PI * drivingFrequency - i * 0.5) * 0.5 + 0.5) * radius,
            (0.5 + Math.sin(time * Math.PI * drivingFrequency - i * 0.5) * 0.5 + 0.5) * radius,
            (0.5 + Math.sin(time * Math.PI * drivingFrequency - i * 0.5) * 0.5 + 0.5) * radius
          ]}
        >
          <torusGeometry args={[1, 0.02, 16, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent={true}
            opacity={0.3 - i * 0.1}
            emissive="#FFFFFF"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Amplitude graph */}
      {showAmplitudeGraph && (
        <AmplitudeGraph
          amplitudeHistory={amplitudeHistory}
          frequencySweepData={frequencySweepData}
          drivingFrequency={drivingFrequency}
          resonantFrequency={resonantFrequency}
        />
      )}

      {/* Explanation */}
      <ResonanceExplanation
        drivingFrequency={drivingFrequency}
        resonantFrequency={resonantFrequency}
        mode="string"
        wavelength={wavelength}
      />
    </group>
  )
}

function CavityResonance({
  drivingFrequency,
  resonantFrequency,
  amplitude,
  responseAmplitude,
  time,
  amplitudeHistory,
  frequencySweepData,
  showAmplitudeGraph,
}: {
  drivingFrequency: number;
  resonantFrequency: number;
  amplitude: number;
  responseAmplitude: number;
  time: number;
  amplitudeHistory: Array<{ time: number; amplitude: number }>;
  frequencySweepData: Array<{ frequency: number; response: number }>;
  showAmplitudeGraph: boolean;
}) {
  const cavityWidth = 8
  const cavityHeight = 6
  const cavityDepth = 1
  const numPointsX = 20
  const numPointsY = 15

  // Generate 2D grid of points for cavity visualization
  const cavityPoints = []
  for (let i = 0; i <= numPointsX; i++) {
    for (let j = 0; j <= numPointsY; j++) {
      const x = -cavityWidth / 2 + (i / numPointsX) * cavityWidth
      const y = -cavityHeight / 2 + (j / numPointsY) * cavityHeight

      // 2D standing wave pattern
      const kx = Math.PI / cavityWidth
      const ky = Math.PI / cavityHeight
      const omega = 2 * Math.PI * drivingFrequency

      // Calculate amplitude based on 2D position in cavity and resonance
      const positionFactor = Math.sin(kx * (x + cavityWidth / 2)) * Math.sin(ky * (y + cavityHeight / 2))
      const z = responseAmplitude * positionFactor * Math.cos(omega * time)

      cavityPoints.push({ x, y, z })
    }
  }

  return (
    <group>
      {/* Realistic cavity - like a Chladni plate or resonance chamber */}
      <group>
        {/* Base plate */}
        <mesh position={[0, 0, -0.2]}>
          <boxGeometry args={[cavityWidth + 1, cavityHeight + 1, 0.2]} />
          <meshStandardMaterial color="#444444" roughness={0.7} metalness={0.6} />
        </mesh>

        {/* Cavity walls */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[cavityWidth, cavityHeight, cavityDepth]} />
          <meshStandardMaterial color="#222222" transparent={true} opacity={0.1} roughness={0.1} metalness={0.1} />
        </mesh>

        {/* Frame */}
        <mesh>
          <boxGeometry args={[cavityWidth, cavityHeight, cavityDepth]} />
          <meshStandardMaterial color="#888888" transparent={true} opacity={0.0} wireframe={true} />
        </mesh>
      </group>

      {/* Sound source - realistic speaker */}
      <group position={[-cavityWidth / 2 - 2, 0, 0]}>
        {/* Speaker housing */}
        <mesh>
          <boxGeometry args={[1.5, 2, 1.5]} />
          <meshStandardMaterial color="#222222" roughness={0.9} />
        </mesh>

        {/* Speaker cone */}
        <mesh position={[0.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <coneGeometry args={[0.8, 0.6, 32, 1, true]} />
          <meshStandardMaterial color="#444444" roughness={0.9} />
        </mesh>

        {/* Speaker driver - moves with the sound */}
        <mesh
          position={[0.9 + Math.sin(time * Math.PI * 2 * drivingFrequency) * amplitude * 0.1, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <meshStandardMaterial color="#888888" roughness={0.5} metalness={0.8} />
        </mesh>
      </group>

      {/* Sound waves emanating from speaker */}
      {[1, 1.5, 2].map((radius, i) => (
        <mesh
          key={i}
          position={[-cavityWidth / 2 - 1.2, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          scale={[
            (0.5 + Math.sin(time * Math.PI * drivingFrequency - i * 0.5) * 0.5 + 0.5) * radius,
            (0.5 + Math.sin(time * Math.PI * drivingFrequency - i * 0.5) * 0.5 + 0.5) * radius,
            (0.5 + Math.sin(time * Math.PI * drivingFrequency - i * 0.5) * 0.5 + 0.5) * radius
          ]}
        >
          <torusGeometry args={[1, 0.05, 16, 32]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent={true}
            opacity={0.2 - i * 0.05}
            emissive="#FFFFFF"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Resonance visualization - sand particles on Chladni plate */}
      {cavityPoints.map((point, index) => {
        // Sand particles accumulate at nodes (where amplitude is low)
        const amplitude = Math.abs(point.z)
        const isNode = amplitude < 0.05 * Math.abs(responseAmplitude)

        // Only show particles at nodes or with significant displacement
        if (isNode || amplitude > 0.3 * Math.abs(responseAmplitude)) {
          return (
            <mesh key={index} position={[point.x, point.y, isNode ? 0.05 : point.z]}>
              <sphereGeometry args={[isNode ? 0.12 : 0.08, 8, 8]} />
              <meshStandardMaterial
                color={isNode ? "#D2B48C" : "#00BFFF"}
                emissive={isNode ? "#D2B48C" : "#00BFFF"}
                emissiveIntensity={isNode ? 0.1 : 0.5}
                transparent={!isNode}
                opacity={isNode ? 1 : 0.7}
              />
            </mesh>
          )
        }
        return null
      })}

      {/* Amplitude graph */}
      {showAmplitudeGraph && (
        <AmplitudeGraph
          amplitudeHistory={amplitudeHistory}
          frequencySweepData={frequencySweepData}
          drivingFrequency={drivingFrequency}
          resonantFrequency={resonantFrequency}
        />
      )}

      {/* Explanation */}
      <ResonanceExplanation
        drivingFrequency={drivingFrequency}
        resonantFrequency={resonantFrequency}
        mode="cavity"
        wavelength={cavityWidth}
      />
    </group>
  )
}

function AmplitudeGraph({ 
  amplitudeHistory, 
  frequencySweepData, 
  drivingFrequency, 
  resonantFrequency 
}: {
  amplitudeHistory: Array<{ time: number; amplitude: number }>;
  frequencySweepData: Array<{ frequency: number; response: number }>;
  drivingFrequency: number;
  resonantFrequency: number;
}) {
  const graphWidth = 10
  const graphHeight = 4
  const graphX = 0
  const graphY = -8

  // Generate points for amplitude history graph
  const historyPoints = amplitudeHistory.map((data, i) => {
    const x = graphX - graphWidth / 2 + (i / Math.max(1, amplitudeHistory.length - 1)) * graphWidth
    const y = graphY + data.amplitude * 2
    return [x, y, 0] as [number, number, number]
  })

  // Generate points for frequency response curve
  const responsePoints = frequencySweepData.map((data) => {
    const x = graphX - graphWidth / 2 + ((data.frequency - 0.5) / 1) * graphWidth
    const y = graphY - graphHeight - 1 + data.response * 2
    return [x, y, 0] as [number, number, number]
  })

  // Current frequency marker
  const markerX = graphX - graphWidth / 2 + ((drivingFrequency - 0.5) / 1) * graphWidth

  return (
    <group>
      {/* Amplitude history graph */}
      <mesh position={[graphX, graphY, -0.1]}>
        <planeGeometry args={[graphWidth, graphHeight]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <Text position={[graphX, graphY + graphHeight / 2 + 0.5, 0]} fontSize={0.4} color="#FFFFFF">
        Amplitude vs. Time
      </Text>

      {historyPoints.length > 1 && <Line points={historyPoints} color="#00BFFF" lineWidth={2} />}

      {/* Frequency response graph */}
      <mesh position={[graphX, graphY - graphHeight - 1, -0.1]}>
        <planeGeometry args={[graphWidth, graphHeight]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <Text position={[graphX, graphY - graphHeight - 1 + graphHeight / 2 + 0.5, 0]} fontSize={0.4} color="#FFFFFF">
        Amplitude vs. Frequency
      </Text>

      {responsePoints.length > 1 && <Line points={responsePoints} color="#FF4500" lineWidth={2} />}

      {/* Resonant frequency marker */}
      <Line
        points={[
          [graphX - graphWidth / 2 + ((resonantFrequency - 0.5) / 1) * graphWidth, graphY - graphHeight - 1, 0],
          [
            graphX - graphWidth / 2 + ((resonantFrequency - 0.5) / 1) * graphWidth,
            graphY - graphHeight - 1 + graphHeight,
            0,
          ],
        ]}
        color="#FFFFFF"
        lineWidth={1}
        dashed={true}
      />

      <Text
        position={[
          graphX - graphWidth / 2 + ((resonantFrequency - 0.5) / 1) * graphWidth,
          graphY - graphHeight - 1 - 0.5,
          0,
        ]}
        fontSize={0.3}
        color="#FFFFFF"
      >
        f₀ = {resonantFrequency.toFixed(2)}
      </Text>

      {/* Current frequency marker */}
      <Line
        points={[
          [markerX, graphY - graphHeight - 1, 0],
          [markerX, graphY - graphHeight - 1 + graphHeight, 0],
        ]}
        color="#FFFF00"
        lineWidth={1}
      />

      <mesh position={[markerX, graphY - graphHeight - 1 + graphHeight / 2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFF00" />
      </mesh>
    </group>
  )
}

function ResonanceExplanation({ 
  drivingFrequency, 
  resonantFrequency, 
  mode, 
  wavelength 
}: {
  drivingFrequency: number;
  resonantFrequency: number;
  mode: string;
  wavelength: number;
}) {
  // Calculate how close we are to resonance
  const frequencyRatio = drivingFrequency / resonantFrequency
  const isResonating = Math.abs(frequencyRatio - 1) < 0.05

  // Mode-specific explanations
  let modeExplanation = ""
  switch (mode) {
    case "tube":
      modeExplanation = "In a tube open at one end, resonance occurs when the tube length equals (2n-1)λ/4"
      break
    case "string":
      modeExplanation = "In a string fixed at both ends, resonance occurs when the string length equals nλ/2"
      break
    case "cavity":
      modeExplanation = "In a rectangular cavity, resonance depends on the cavity dimensions matching the wavelength"
      break
  }

  return (
    <group position={[0, 5, 0]}>
      <Text position={[0, 0, 0]} fontSize={0.7} color="white" anchorX="center">
        Sound Resonance
      </Text>

      <Text position={[0, -1, 0]} fontSize={0.5} color={isResonating ? "#00FF00" : "white"} anchorX="center">
        {isResonating
          ? "System is at resonance!"
          : frequencyRatio < 1
            ? "Driving frequency is below resonance"
            : "Driving frequency is above resonance"}
      </Text>

      <Text position={[0, -2, 0]} fontSize={0.4} color="white" anchorX="center">
        {modeExplanation}
      </Text>

      <Text position={[0, -3, 0]} fontSize={0.4} color="white" anchorX="center">
        Wavelength: {wavelength.toFixed(2)} units
      </Text>

      <Text position={[0, -4, 0]} fontSize={0.4} color="white" anchorX="center">
        Resonance occurs when the driving frequency matches the natural frequency of the system
      </Text>

      <Text position={[0, -5, 0]} fontSize={0.4} color="white" anchorX="center">
        At resonance, energy transfer is maximized, resulting in maximum amplitude
      </Text>
    </group>
  )
}
