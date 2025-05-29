"use client"

import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, PerspectiveCamera, Line } from "@react-three/drei"
import { Vector3, CatmullRomCurve3, TubeGeometry } from "three"

export default function WaveSuperposition() {
  const [amplitude1, setAmplitude1] = useState(1)
  const [amplitude2, setAmplitude2] = useState(1)
  const [frequency1, setFrequency1] = useState(0.5)
  const [frequency2, setFrequency2] = useState(0.5)
  const [wavelength1, setWavelength1] = useState(4)
  const [wavelength2, setWavelength2] = useState(4)
  const [phaseShift, setPhaseShift] = useState(0)
  const [showComponents, setShowComponents] = useState(true)
  const [showResultant, setShowResultant] = useState(true)
  const [showParticles, setShowParticles] = useState(true)
  const [stringThickness, setStringThickness] = useState(0.15)
  const [paused, setPaused] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [demoMode, setDemoMode] = useState("basic") // "basic", "constructive", "destructive", "beats"
  const [showColoredContributions, setShowColoredContributions] = useState(true)

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
        <h2 className="text-xl font-bold mb-4">Wave Superposition</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Demonstration Mode:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setDemoMode("basic")
                  setAmplitude1(1)
                  setAmplitude2(1)
                  setFrequency1(0.5)
                  setFrequency2(0.5)
                  setWavelength1(4)
                  setWavelength2(4)
                  setPhaseShift(0)
                }}
                className={`px-2 py-1 rounded ${demoMode === "basic" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Basic
              </button>
              <button
                onClick={() => {
                  setDemoMode("constructive")
                  setAmplitude1(1)
                  setAmplitude2(1)
                  setFrequency1(0.5)
                  setFrequency2(0.5)
                  setWavelength1(4)
                  setWavelength2(4)
                  setPhaseShift(0) // In phase (0°)
                }}
                className={`px-2 py-1 rounded ${demoMode === "constructive" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Constructive
              </button>
              <button
                onClick={() => {
                  setDemoMode("destructive")
                  setAmplitude1(1)
                  setAmplitude2(1)
                  setFrequency1(0.5)
                  setFrequency2(0.5)
                  setWavelength1(4)
                  setWavelength2(4)
                  setPhaseShift(Math.PI) // Out of phase (180°)
                }}
                className={`px-2 py-1 rounded ${demoMode === "destructive" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Destructive
              </button>
              <button
                onClick={() => {
                  setDemoMode("beats")
                  setAmplitude1(1)
                  setAmplitude2(1)
                  setFrequency1(0.5)
                  setFrequency2(0.6) // Slightly different frequency
                  setWavelength1(4)
                  setWavelength2(3.33) // Corresponding wavelength
                  setPhaseShift(0)
                }}
                className={`px-2 py-1 rounded ${demoMode === "beats" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Beats
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Wave 1 (Blue)</h3>
              <div>
                <label className="block mb-1">Amplitude: {amplitude1.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={amplitude1}
                  onChange={(e) => setAmplitude1(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Frequency: {frequency1.toFixed(1)} Hz</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={frequency1}
                  onChange={(e) => setFrequency1(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Wavelength: {wavelength1.toFixed(1)} units</label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.1"
                  value={wavelength1}
                  onChange={(e) => setWavelength1(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Wave 2 (Red)</h3>
              <div>
                <label className="block mb-1">Amplitude: {amplitude2.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={amplitude2}
                  onChange={(e) => setAmplitude2(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Frequency: {frequency2.toFixed(1)} Hz</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={frequency2}
                  onChange={(e) => setFrequency2(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Wavelength: {wavelength2.toFixed(1)} units</label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.1"
                  value={wavelength2}
                  onChange={(e) => setWavelength2(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1">
              Phase Shift: {(phaseShift / Math.PI).toFixed(2)}π rad ({((phaseShift / Math.PI) * 180).toFixed(0)}°)
            </label>
            <input
              type="range"
              min="0"
              max={2 * Math.PI}
              step={Math.PI / 12}
              value={phaseShift}
              onChange={(e) => setPhaseShift(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">String Thickness: {stringThickness.toFixed(2)}</label>
            <input
              type="range"
              min="0.05"
              max="0.3"
              step="0.01"
              value={stringThickness}
              onChange={(e) => setStringThickness(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showComponents}
                onChange={() => setShowComponents(!showComponents)}
                className="mr-2"
              />
              Show Component Waves
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showResultant}
                onChange={() => setShowResultant(!showResultant)}
                className="mr-2"
              />
              Show Resultant Wave
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showParticles}
                onChange={() => setShowParticles(!showParticles)}
                className="mr-2"
              />
              Show Particles
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showColoredContributions}
                onChange={() => setShowColoredContributions(!showColoredContributions)}
                className="mr-2"
              />
              Show Colored Contributions
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

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <SuperpositionScene
          amplitude1={amplitude1}
          amplitude2={amplitude2}
          frequency1={frequency1}
          frequency2={frequency2}
          wavelength1={wavelength1}
          wavelength2={wavelength2}
          phaseShift={phaseShift}
          showComponents={showComponents}
          showResultant={showResultant}
          showParticles={showParticles}
          stringThickness={stringThickness}
          paused={paused}
          demoMode={demoMode}
          showColoredContributions={showColoredContributions}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function SuperpositionScene({
  amplitude1,
  amplitude2,
  frequency1,
  frequency2,
  wavelength1,
  wavelength2,
  phaseShift,
  showComponents,
  showResultant,
  showParticles,
  stringThickness,
  paused,
  demoMode,
  showColoredContributions,
}) {
  const timeRef = useRef(0)
  const [time, setTime] = useState(0)

  // Update time
  useFrame((state, delta) => {
    if (!paused) {
      timeRef.current += delta
      setTime(timeRef.current)
    }
  })

  // Wave parameters
  const waveLength = 20 // Length of the x-axis
  const numPoints = 100 // Number of points for wave calculation
  const numParticles = 20 // Number of particles to show

  // Angular frequencies
  const omega1 = 2 * Math.PI * frequency1
  const omega2 = 2 * Math.PI * frequency2

  // Wave numbers
  const k1 = (2 * Math.PI) / wavelength1
  const k2 = (2 * Math.PI) / wavelength2

  // Generate points for wave 1
  const wave1Points = []
  for (let i = 0; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    const y = amplitude1 * Math.sin(k1 * x - omega1 * time)
    wave1Points.push([x, y, 0])
  }

  // Generate points for wave 2
  const wave2Points = []
  for (let i = 0; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    const y = amplitude2 * Math.sin(k2 * x - omega2 * time + phaseShift)
    wave2Points.push([x, y, 0])
  }

  // Generate points for resultant wave (superposition)
  const resultantPoints = []
  for (let i = 0; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    const y1 = amplitude1 * Math.sin(k1 * x - omega1 * time)
    const y2 = amplitude2 * Math.sin(k2 * x - omega2 * time + phaseShift)
    const y = y1 + y2 // Superposition principle: waves add
    resultantPoints.push([x, y, 0])
  }

  // Generate particles for the resultant wave
  const particlePositions = []
  for (let i = 0; i < numParticles; i++) {
    const x = -waveLength / 2 + (i / (numParticles - 1)) * waveLength
    const y1 = amplitude1 * Math.sin(k1 * x - omega1 * time)
    const y2 = amplitude2 * Math.sin(k2 * x - omega2 * time + phaseShift)
    const y = y1 + y2
    particlePositions.push([x, y, 0])
  }

  // Add fixed endpoints for the strings
  const fixedWave1Points = [[-waveLength / 2, 0, 0], ...wave1Points, [waveLength / 2, 0, 0]]
  const fixedWave2Points = [[-waveLength / 2, 0, 0], ...wave2Points, [waveLength / 2, 0, 0]]
  const fixedResultantPoints = [[-waveLength / 2, 0, 0], ...resultantPoints, [waveLength / 2, 0, 0]]

  // Determine the vertical offset for each wave display
  const wave1Offset = showComponents && showResultant ? 3 : 0
  const wave2Offset = showComponents && showResultant ? 0 : 0
  const resultantOffset = showComponents && showResultant ? -3 : 0

  // Determine explanation text based on demo mode
  let explanationTitle = ""
  let explanationText = []

  switch (demoMode) {
    case "constructive":
      explanationTitle = "Constructive Interference"
      explanationText = [
        "When waves are in phase (0° phase difference),",
        "their amplitudes add together, creating a larger wave.",
        "This is called constructive interference.",
        "The resultant amplitude equals the sum of the individual amplitudes.",
      ]
      break
    case "destructive":
      explanationTitle = "Destructive Interference"
      explanationText = [
        "When waves are out of phase (180° phase difference),",
        "they cancel each other out where their amplitudes are equal.",
        "This is called destructive interference.",
        "The resultant amplitude equals the difference of the individual amplitudes.",
      ]
      break
    case "beats":
      explanationTitle = "Beat Phenomenon"
      explanationText = [
        "When two waves have slightly different frequencies,",
        "they create a pattern of alternating constructive and destructive interference.",
        "This produces a wave with amplitude that varies periodically,",
        "creating audible 'beats' in sound waves.",
      ]
      break
    default:
      explanationTitle = "Principle of Superposition"
      explanationText = [
        "When two or more waves overlap, the resultant displacement",
        "at any point equals the sum of the displacements of the individual waves.",
        "This is the principle of superposition.",
        "Adjust the controls to see how different waves combine.",
      ]
  }

  return (
    <group>
      {/* Wave 1 (Component) */}
      {showComponents && (
        <group position={[0, wave1Offset, 0]}>
          <StringMesh points={fixedWave1Points} thickness={stringThickness} color="#00BFFF" />

          {/* Fixed endpoints */}
          <mesh position={[-waveLength / 2, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[waveLength / 2, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>

          <Text position={[-waveLength / 2 - 1.5, 0, 0]} fontSize={0.5} color="#00BFFF" anchorX="right">
            Wave 1
          </Text>
        </group>
      )}

      {/* Wave 2 (Component) */}
      {showComponents && (
        <group position={[0, wave2Offset, 0]}>
          <StringMesh points={fixedWave2Points} thickness={stringThickness} color="#FF6B6B" />

          {/* Fixed endpoints */}
          <mesh position={[-waveLength / 2, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[waveLength / 2, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>

          <Text position={[-waveLength / 2 - 1.5, 0, 0]} fontSize={0.5} color="#FF6B6B" anchorX="right">
            Wave 2
          </Text>
        </group>
      )}

      {/* Colored Contributions (showing individual wave contributions) */}
      {showColoredContributions && showResultant && (
        <group position={[0, resultantOffset, 0]}>
          {/* Wave 1 contribution */}
          {wave1Points
            .map((point, i) => {
              if (i === 0 || i === numPoints) return null // Skip endpoints
              const x = point[0]
              const baseY = 0
              const y1 = point[1]
              return (
                <Line
                  key={`contrib1-${i}`}
                  points={[
                    [x, baseY, 0],
                    [x, baseY + y1, 0],
                  ]}
                  color="#00BFFF"
                  lineWidth={2}
                  opacity={0.7}
                />
              )
            })
            .filter(Boolean)}

          {/* Wave 2 contribution */}
          {wave2Points
            .map((point, i) => {
              if (i === 0 || i === numPoints) return null // Skip endpoints
              const x = point[0]
              const baseY = wave1Points[i][1] // Start from where wave 1 contribution ends
              const y2 = point[1]
              return (
                <Line
                  key={`contrib2-${i}`}
                  points={[
                    [x, baseY, 0],
                    [x, baseY + y2, 0],
                  ]}
                  color="#FF6B6B"
                  lineWidth={2}
                  opacity={0.7}
                />
              )
            })
            .filter(Boolean)}

          {/* Outline of the resultant wave */}
          <Line points={resultantPoints} color="#FFFFFF" lineWidth={1} opacity={0.5} dashed={true} />

          {/* Fixed endpoints */}
          <mesh position={[-waveLength / 2, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[waveLength / 2, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>

          <Text position={[-waveLength / 2 - 1.5, 0, 0]} fontSize={0.5} color="#FFFFFF" anchorX="right">
            Contributions
          </Text>
        </group>
      )}

      {/* Resultant Wave (Superposition) */}
      {showResultant && !showColoredContributions && (
        <group position={[0, resultantOffset, 0]}>
          <StringMesh points={fixedResultantPoints} thickness={stringThickness} color="#FFFF00" />

          {/* Fixed endpoints */}
          <mesh position={[-waveLength / 2, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[waveLength / 2, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>

          {/* Particles */}
          {showParticles &&
            particlePositions.map((pos, index) => (
              <mesh key={index} position={[pos[0], pos[1] + resultantOffset, pos[2]]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={0.3} />
              </mesh>
            ))}

          <Text position={[-waveLength / 2 - 1.5, 0, 0]} fontSize={0.5} color="#FFFF00" anchorX="right">
            Resultant
          </Text>
        </group>
      )}

      {/* Title and explanation */}
      <Text position={[0, 6, 0]} fontSize={0.7} color="white" anchorX="center">
        {explanationTitle}
      </Text>

      {explanationText.map((text, index) => (
        <Text key={index} position={[0, 5 - index * 0.6, 0]} fontSize={0.4} color="white" anchorX="center">
          {text}
        </Text>
      ))}

      {/* Mathematical representation */}
      <Text position={[0, -6, 0]} fontSize={0.5} color="white" anchorX="center">
        y₁(x,t) = A₁·sin(k₁x - ω₁t)
      </Text>
      <Text position={[0, -6.7, 0]} fontSize={0.5} color="white" anchorX="center">
        y₂(x,t) = A₂·sin(k₂x - ω₂t + φ)
      </Text>
      <Text position={[0, -7.4, 0]} fontSize={0.5} color="white" anchorX="center">
        y(x,t) = y₁(x,t) + y₂(x,t)
      </Text>

      {/* Phase difference indicator */}
      <Text position={[0, -8.5, 0]} fontSize={0.5} color="white" anchorX="center">
        Phase Difference: {(phaseShift / Math.PI).toFixed(2)}π rad ({((phaseShift / Math.PI) * 180).toFixed(0)}°)
      </Text>
    </group>
  )
}

function StringMesh({ points, thickness, color, segments = 64 }) {
  // Create a smooth curve from the points
  const curve = useMemo(() => {
    const curvePoints = points.map((point) => new Vector3(point[0], point[1], point[2]))
    return new CatmullRomCurve3(curvePoints)
  }, [points])

  // Create a tube geometry along the curve
  const geometry = useMemo(() => {
    return new TubeGeometry(curve, segments, thickness, 8, false)
  }, [curve, thickness, segments])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
    </mesh>
  )
}
