"use client"

import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3, CatmullRomCurve3, TubeGeometry } from "three"

export default function WaveProperties() {
  const [selectedProperty, setSelectedProperty] = useState("reflection")
  const [amplitude, setAmplitude] = useState(1)
  const [frequency, setFrequency] = useState(0.5)
  const [wavelength, setWavelength] = useState(4)
  const [mediumDensity1, setMediumDensity1] = useState(1)
  const [mediumDensity2, setMediumDensity2] = useState(2)
  const [obstacleWidth, setObstacleWidth] = useState(2)
  const [apertureWidth, setApertureWidth] = useState(3)
  const [stringThickness, setStringThickness] = useState(0.15)
  const [showParticles, setShowParticles] = useState(true)
  const [paused, setPaused] = useState(false)
  const [showControls, setShowControls] = useState(true)

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
        <h2 className="text-xl font-bold mb-4">Wave Properties</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Wave Property:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedProperty("reflection")}
                className={`px-2 py-1 rounded ${selectedProperty === "reflection" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Reflection
              </button>
              <button
                onClick={() => setSelectedProperty("transmission")}
                className={`px-2 py-1 rounded ${selectedProperty === "transmission" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Transmission
              </button>
              <button
                onClick={() => setSelectedProperty("refraction")}
                className={`px-2 py-1 rounded ${selectedProperty === "refraction" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Refraction
              </button>
              <button
                onClick={() => setSelectedProperty("diffraction")}
                className={`px-2 py-1 rounded ${selectedProperty === "diffraction" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Diffraction
              </button>
              <button
                onClick={() => setSelectedProperty("dispersion")}
                className={`px-2 py-1 rounded ${selectedProperty === "dispersion" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Dispersion
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Amplitude: {amplitude.toFixed(1)}</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={amplitude}
              onChange={(e) => setAmplitude(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Frequency: {frequency.toFixed(1)} Hz</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Wavelength: {wavelength.toFixed(1)} units</label>
            <input
              type="range"
              min="2"
              max="8"
              step="0.1"
              value={wavelength}
              onChange={(e) => setWavelength(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {(selectedProperty === "transmission" || selectedProperty === "refraction") && (
            <>
              <div>
                <label className="block mb-1">Medium 1 Density: {mediumDensity1.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={mediumDensity1}
                  onChange={(e) => setMediumDensity1(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Medium 2 Density: {mediumDensity2.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={mediumDensity2}
                  onChange={(e) => setMediumDensity2(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          {selectedProperty === "diffraction" && (
            <>
              <div>
                <label className="block mb-1">Aperture Width: {apertureWidth.toFixed(1)} units</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.1"
                  value={apertureWidth}
                  onChange={(e) => setApertureWidth(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Obstacle Width: {obstacleWidth.toFixed(1)} units</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={obstacleWidth}
                  onChange={(e) => setObstacleWidth(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-1">Wave Thickness: {stringThickness.toFixed(2)}</label>
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

          <div className="flex space-x-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showParticles}
                onChange={() => setShowParticles(!showParticles)}
                className="mr-2"
              />
              Show Particles
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
        <WavePropertiesScene
          selectedProperty={selectedProperty}
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          mediumDensity1={mediumDensity1}
          mediumDensity2={mediumDensity2}
          obstacleWidth={obstacleWidth}
          apertureWidth={apertureWidth}
          stringThickness={stringThickness}
          showParticles={showParticles}
          paused={paused}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function WavePropertiesScene({
  selectedProperty,
  amplitude,
  frequency,
  wavelength,
  mediumDensity1,
  mediumDensity2,
  obstacleWidth,
  apertureWidth,
  stringThickness,
  showParticles,
  paused,
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

  // Render the appropriate property demonstration
  switch (selectedProperty) {
    case "reflection":
      return (
        <ReflectionDemo
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          time={time}
          stringThickness={stringThickness}
          showParticles={showParticles}
        />
      )
    case "transmission":
      return (
        <TransmissionDemo
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          mediumDensity1={mediumDensity1}
          mediumDensity2={mediumDensity2}
          time={time}
          stringThickness={stringThickness}
          showParticles={showParticles}
        />
      )
    case "refraction":
      return (
        <RefractionDemo
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          mediumDensity1={mediumDensity1}
          mediumDensity2={mediumDensity2}
          time={time}
          stringThickness={stringThickness}
          showParticles={showParticles}
        />
      )
    case "diffraction":
      return (
        <DiffractionDemo
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          obstacleWidth={obstacleWidth}
          apertureWidth={apertureWidth}
          time={time}
          stringThickness={stringThickness}
          showParticles={showParticles}
        />
      )
    case "dispersion":
      return (
        <DispersionDemo
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          time={time}
          stringThickness={stringThickness}
          showParticles={showParticles}
        />
      )
    default:
      return null
  }
}

function ReflectionDemo({ amplitude, frequency, wavelength, time, stringThickness, showParticles }) {
  const waveLength = 20
  const numPoints = 100
  const numParticles = 30
  const boundaryX = 0 // Position of the reflecting boundary

  // Angular frequency
  const omega = 2 * Math.PI * frequency
  // Wave number
  const k = (2 * Math.PI) / wavelength

  // Generate points for incident wave (traveling right)
  const incidentPoints = []
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    const y = amplitude * Math.sin(k * x - omega * time)
    incidentPoints.push([x, y, 0])
  }

  // Generate points for reflected wave (traveling left)
  const reflectedPoints = []
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    // Reflected wave has a phase shift of π (180°) for fixed end reflection
    const y = -amplitude * Math.sin(k * (2 * boundaryX - x) - omega * time)
    reflectedPoints.push([x, y, 0])
  }

  // Generate points for superposition of incident and reflected waves
  const superpositionPoints = []
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    const yIncident = amplitude * Math.sin(k * x - omega * time)
    const yReflected = -amplitude * Math.sin(k * (2 * boundaryX - x) - omega * time)
    const y = yIncident + yReflected
    superpositionPoints.push([x, y, 0])
  }

  // Generate particles for visualization
  const particlePositions = []
  if (showParticles) {
    for (let i = 0; i < numParticles / 2; i++) {
      const x = -waveLength / 2 + (i / (numParticles / 2)) * (waveLength / 2)
      const yIncident = amplitude * Math.sin(k * x - omega * time)
      const yReflected = -amplitude * Math.sin(k * (2 * boundaryX - x) - omega * time)
      const y = yIncident + yReflected
      particlePositions.push([x, y, 0])
    }
  }

  // Create complete wave points for visualization
  const wavePoints = [...superpositionPoints]

  // Add fixed endpoints
  const fixedWavePoints = [[-waveLength / 2, 0, 0], ...wavePoints]

  return (
    <group>
      {/* Boundary line */}
      <Line
        points={[
          [boundaryX, -waveLength / 4, 0],
          [boundaryX, waveLength / 4, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
      />

      {/* Boundary wall */}
      <mesh position={[boundaryX + 0.5, 0, 0]}>
        <boxGeometry args={[1, waveLength / 2, 1]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Wave visualization */}
      <group>
        {/* Incident wave */}
        <Line points={incidentPoints} color="#00BFFF" lineWidth={2} opacity={0.7} />

        {/* Reflected wave */}
        <Line points={reflectedPoints} color="#FF6B6B" lineWidth={2} opacity={0.7} />

        {/* Superposition wave */}
        <StringMesh points={fixedWavePoints} thickness={stringThickness} color="#FFFFFF" />

        {/* Particles */}
        {particlePositions.map((pos, index) => (
          <mesh key={index} position={[pos[0], pos[1], pos[2]]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={0.3} />
          </mesh>
        ))}

        {/* Fixed endpoint */}
        <mesh position={[-waveLength / 2, 0, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Wave labels */}
      <Text position={[-waveLength / 4, 2, 0]} fontSize={0.4} color="#00BFFF" anchorX="center">
        Incident Wave
      </Text>
      <ArrowHelper
        dir={new Vector3(1, 0, 0)}
        origin={new Vector3(-waveLength / 4, 1.5, 0)}
        length={1}
        color="#00BFFF"
      />

      <Text position={[-waveLength / 4, 0.5, 0]} fontSize={0.4} color="#FF6B6B" anchorX="center">
        Reflected Wave
      </Text>
      <ArrowHelper dir={new Vector3(-1, 0, 0)} origin={new Vector3(-waveLength / 4, 0, 0)} length={1} color="#FF6B6B" />

      {/* Title and explanation */}
      <Text position={[0, 5, 0]} fontSize={0.7} color="white" anchorX="center">
        Wave Reflection
      </Text>
      <Text position={[0, 4, 0]} fontSize={0.5} color="white" anchorX="center">
        When waves encounter a boundary, they reflect back
      </Text>
      <Text position={[0, 3.3, 0]} fontSize={0.4} color="white" anchorX="center">
        Fixed End Reflection: Wave is inverted (phase shift of π)
      </Text>
      <Text position={[0, -4, 0]} fontSize={0.4} color="white" anchorX="center">
        The incident and reflected waves create a standing wave pattern
      </Text>
      <Text position={[0, -4.7, 0]} fontSize={0.4} color="white" anchorX="center">
        Angle of incidence equals angle of reflection
      </Text>
    </group>
  )
}

function TransmissionDemo({
  amplitude,
  frequency,
  wavelength,
  mediumDensity1,
  mediumDensity2,
  time,
  stringThickness,
  showParticles,
}) {
  const waveLength = 20
  const numPoints = 100
  const numParticles = 30
  const boundaryX = 0 // Position of the boundary between media

  // Calculate impedance (simplified as proportional to density)
  const impedance1 = mediumDensity1
  const impedance2 = mediumDensity2

  // Calculate reflection and transmission coefficients
  const reflectionCoeff = (impedance1 - impedance2) / (impedance1 + impedance2)
  const transmissionCoeff = (2 * impedance1) / (impedance1 + impedance2)

  // Calculate wave speeds (inversely proportional to square root of density)
  const speed1 = 10 / Math.sqrt(mediumDensity1)
  const speed2 = 10 / Math.sqrt(mediumDensity2)

  // Angular frequency (same in both media)
  const omega = 2 * Math.PI * frequency

  // Calculate wavelengths in each medium
  const wavelength1 = wavelength
  const wavelength2 = (speed2 / speed1) * wavelength1

  // Wave numbers
  const k1 = (2 * Math.PI) / wavelength1
  const k2 = (2 * Math.PI) / wavelength2

  // Calculate amplitudes
  const incidentAmplitude = amplitude
  const reflectedAmplitude = Math.abs(reflectionCoeff) * incidentAmplitude
  const transmittedAmplitude = Math.abs(transmissionCoeff) * incidentAmplitude

  // Phase shifts
  const reflectedPhaseShift = reflectionCoeff < 0 ? Math.PI : 0
  const transmittedPhaseShift = 0

  // Generate points for incident wave (traveling right in medium 1)
  const incidentPoints = []
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    if (x <= boundaryX) {
      const y = incidentAmplitude * Math.sin(k1 * x - omega * time)
      incidentPoints.push([x, y, 0])
    }
  }

  // Generate points for reflected wave (traveling left in medium 1)
  const reflectedPoints = []
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    if (x <= boundaryX) {
      const y = reflectedAmplitude * Math.sin(k1 * x + omega * time + reflectedPhaseShift)
      reflectedPoints.push([x, y, 0])
    }
  }

  // Generate points for transmitted wave (traveling right in medium 2)
  const transmittedPoints = []
  for (let i = numPoints / 2; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    if (x >= boundaryX) {
      const y = transmittedAmplitude * Math.sin(k2 * (x - boundaryX) - omega * time + transmittedPhaseShift)
      transmittedPoints.push([x, y, 0])
    }
  }

  // Generate points for superposition in medium 1
  const superposition1Points = []
  for (let i = 0; i <= numPoints / 2; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    if (x <= boundaryX) {
      const yIncident = incidentAmplitude * Math.sin(k1 * x - omega * time)
      const yReflected = reflectedAmplitude * Math.sin(k1 * x + omega * time + reflectedPhaseShift)
      const y = yIncident + yReflected
      superposition1Points.push([x, y, 0])
    }
  }

  // Create complete wave points for visualization
  const wavePoints = [...superposition1Points, ...transmittedPoints]

  // Generate particles for visualization
  const particlePositions = []
  if (showParticles) {
    // Particles in medium 1
    for (let i = 0; i < numParticles / 2; i++) {
      const x = -waveLength / 2 + (i / (numParticles / 2)) * (waveLength / 2)
      if (x <= boundaryX) {
        const yIncident = incidentAmplitude * Math.sin(k1 * x - omega * time)
        const yReflected = reflectedAmplitude * Math.sin(k1 * x + omega * time + reflectedPhaseShift)
        const y = yIncident + yReflected
        particlePositions.push({ x, y, medium: 1 })
      }
    }

    // Particles in medium 2
    for (let i = 0; i < numParticles / 2; i++) {
      const x = boundaryX + (i / (numParticles / 2)) * (waveLength / 2)
      if (x >= boundaryX) {
        const y = transmittedAmplitude * Math.sin(k2 * (x - boundaryX) - omega * time + transmittedPhaseShift)
        particlePositions.push({ x, y, medium: 2 })
      }
    }
  }

  // Add fixed endpoints
  const fixedWavePoints = [[-waveLength / 2, 0, 0], ...wavePoints, [waveLength / 2, 0, 0]]

  return (
    <group>
      {/* Medium backgrounds */}
      <mesh position={[-waveLength / 4, 0, -0.1]}>
        <planeGeometry args={[waveLength / 2, waveLength / 2]} />
        <meshStandardMaterial color="#1E3A8A" opacity={0.2} transparent />
      </mesh>
      <mesh position={[waveLength / 4, 0, -0.1]}>
        <planeGeometry args={[waveLength / 2, waveLength / 2]} />
        <meshStandardMaterial color="#3B0764" opacity={0.2} transparent />
      </mesh>

      {/* Boundary line */}
      <Line
        points={[
          [boundaryX, -waveLength / 4, 0],
          [boundaryX, waveLength / 4, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
        dashed={true}
      />

      {/* Medium labels */}
      <Text position={[-waveLength / 4, waveLength / 4 + 1, 0]} fontSize={0.5} color="white" anchorX="center">
        Medium 1 (ρ = {mediumDensity1.toFixed(1)})
      </Text>
      <Text position={[waveLength / 4, waveLength / 4 + 1, 0]} fontSize={0.5} color="white" anchorX="center">
        Medium 2 (ρ = {mediumDensity2.toFixed(1)})
      </Text>

      {/* Wave visualization */}
      <group>
        {/* Incident wave */}
        <Line points={incidentPoints} color="#00BFFF" lineWidth={2} opacity={0.7} />

        {/* Reflected wave */}
        <Line points={reflectedPoints} color="#FF6B6B" lineWidth={2} opacity={0.7} />

        {/* Transmitted wave */}
        <Line points={transmittedPoints} color="#4CAF50" lineWidth={2} opacity={0.7} />

        {/* Complete wave */}
        <StringMesh points={fixedWavePoints} thickness={stringThickness} color="#FFFFFF" />

        {/* Particles */}
        {particlePositions.map((particle, index) => (
          <mesh key={index} position={[particle.x, particle.y, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={particle.medium === 1 ? "#00BFFF" : "#4CAF50"}
              emissive={particle.medium === 1 ? "#00BFFF" : "#4CAF50"}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* Fixed endpoints */}
        <mesh position={[-waveLength / 2, 0, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[waveLength / 2, 0, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Wave labels */}
      <Text position={[-waveLength / 4 - 2, 2, 0]} fontSize={0.4} color="#00BFFF" anchorX="center">
        Incident Wave
      </Text>
      <ArrowHelper
        dir={new Vector3(1, 0, 0)}
        origin={new Vector3(-waveLength / 4 - 2, 1.5, 0)}
        length={1}
        color="#00BFFF"
      />

      <Text position={[-waveLength / 4 - 2, 0.5, 0]} fontSize={0.4} color="#FF6B6B" anchorX="center">
        Reflected Wave
      </Text>
      <ArrowHelper
        dir={new Vector3(-1, 0, 0)}
        origin={new Vector3(-waveLength / 4 - 2, 0, 0)}
        length={1}
        color="#FF6B6B"
      />

      <Text position={[waveLength / 4 + 2, 2, 0]} fontSize={0.4} color="#4CAF50" anchorX="center">
        Transmitted Wave
      </Text>
      <ArrowHelper
        dir={new Vector3(1, 0, 0)}
        origin={new Vector3(waveLength / 4 + 2, 1.5, 0)}
        length={1}
        color="#4CAF50"
      />

      {/* Title and explanation */}
      <Text position={[0, 5, 0]} fontSize={0.7} color="white" anchorX="center">
        Wave Transmission
      </Text>
      <Text position={[0, 4, 0]} fontSize={0.5} color="white" anchorX="center">
        When waves encounter a boundary between media, some energy is transmitted
      </Text>
      <Text position={[0, 3.3, 0]} fontSize={0.4} color="white" anchorX="center">
        Transmission coefficient: t = 2Z₁/(Z₁+Z₂) = {transmissionCoeff.toFixed(2)}
      </Text>
      <Text position={[0, -4, 0]} fontSize={0.4} color="white" anchorX="center">
        Reflection coefficient: r = (Z₂-Z₁)/(Z₁+Z₂) = {reflectionCoeff.toFixed(2)}
      </Text>
      <Text position={[0, -4.7, 0]} fontSize={0.4} color="white" anchorX="center">
        Wavelength changes in the new medium: λ₂ = {wavelength2.toFixed(2)} units
      </Text>
    </group>
  )
}

function RefractionDemo({
  amplitude,
  frequency,
  wavelength,
  mediumDensity1,
  mediumDensity2,
  time,
  stringThickness,
  showParticles,
}) {
  const waveLength = 20
  const numPoints = 100
  const numParticles = 40
  const boundaryX = 0 // Position of the boundary between media
  const incidentAngle = Math.PI / 6 // 30 degrees incident angle

  // Calculate wave speeds (inversely proportional to square root of density)
  const speed1 = 10 / Math.sqrt(mediumDensity1)
  const speed2 = 10 / Math.sqrt(mediumDensity2)

  // Calculate refraction angle using Snell's Law
  // sin(θ₂)/sin(θ₁) = v₂/v₁
  const refractedAngle = Math.asin((speed2 / speed1) * Math.sin(incidentAngle))

  // Angular frequency (same in both media)
  const omega = 2 * Math.PI * frequency

  // Calculate wavelengths in each medium
  const wavelength1 = wavelength
  const wavelength2 = (speed2 / speed1) * wavelength1

  // Wave numbers
  const k1 = (2 * Math.PI) / wavelength1
  const k2 = (2 * Math.PI) / wavelength2

  // Generate 2D wave fronts for incident wave
  const incidentWaveFronts = []
  const numWaveFronts = 5
  const waveFrontSpacing = wavelength1

  for (let i = 0; i < numWaveFronts; i++) {
    const distance = i * waveFrontSpacing - speed1 * time
    const waveFront = []

    for (let j = 0; j <= 20; j++) {
      const angle = incidentAngle - Math.PI / 2 + (j / 20) * Math.PI
      const radius = distance % (wavelength1 * numWaveFronts)
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)

      // Only include points in medium 1 (left side)
      if (x <= boundaryX) {
        waveFront.push([x, y, 0])
      }
    }

    if (waveFront.length > 0) {
      incidentWaveFronts.push(waveFront)
    }
  }

  // Generate 2D wave fronts for refracted wave
  const refractedWaveFronts = []

  for (let i = 0; i < numWaveFronts; i++) {
    const distance = i * waveFrontSpacing - speed1 * time
    const waveFront = []

    for (let j = 0; j <= 20; j++) {
      const angle = refractedAngle - Math.PI / 2 + (j / 20) * Math.PI
      const radius = ((distance * speed2) / speed1) % (wavelength2 * numWaveFronts)
      const x = boundaryX + radius * Math.cos(angle)
      const y = radius * Math.sin(angle)

      // Only include points in medium 2 (right side)
      if (x >= boundaryX) {
        waveFront.push([x, y, 0])
      }
    }

    if (waveFront.length > 0) {
      refractedWaveFronts.push(waveFront)
    }
  }

  // Generate particles for visualization
  const particlePositions = []
  if (showParticles) {
    // Particles for incident wave
    for (let i = 0; i < numParticles / 2; i++) {
      const distance = (i * waveLength) / numParticles - speed1 * time
      const angle = incidentAngle
      const x = distance * Math.cos(angle)
      const y = distance * Math.sin(angle)

      if (x <= boundaryX) {
        particlePositions.push({ x, y, medium: 1 })
      }
    }

    // Particles for refracted wave
    for (let i = 0; i < numParticles / 2; i++) {
      const distance = (i * waveLength) / numParticles - speed2 * time
      const angle = refractedAngle
      const x = boundaryX + distance * Math.cos(angle)
      const y = distance * Math.sin(angle)

      if (x >= boundaryX) {
        particlePositions.push({ x, y, medium: 2 })
      }
    }
  }

  return (
    <group>
      {/* Medium backgrounds */}
      <mesh position={[-waveLength / 4, 0, -0.1]}>
        <planeGeometry args={[waveLength / 2, waveLength / 2]} />
        <meshStandardMaterial color="#1E3A8A" opacity={0.2} transparent />
      </mesh>
      <mesh position={[waveLength / 4, 0, -0.1]}>
        <planeGeometry args={[waveLength / 2, waveLength / 2]} />
        <meshStandardMaterial color="#3B0764" opacity={0.2} transparent />
      </mesh>

      {/* Boundary line */}
      <Line
        points={[
          [boundaryX, -waveLength / 4, 0],
          [boundaryX, waveLength / 4, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
        dashed={true}
      />

      {/* Medium labels */}
      <Text position={[-waveLength / 4, waveLength / 4 + 1, 0]} fontSize={0.5} color="white" anchorX="center">
        Medium 1 (v = {speed1.toFixed(1)})
      </Text>
      <Text position={[waveLength / 4, waveLength / 4 + 1, 0]} fontSize={0.5} color="white" anchorX="center">
        Medium 2 (v = {speed2.toFixed(1)})
      </Text>

      {/* Wave visualization */}
      <group>
        {/* Incident wave fronts */}
        {incidentWaveFronts.map((waveFront, i) => (
          <Line key={`incident-${i}`} points={waveFront} color="#00BFFF" lineWidth={2} opacity={0.7} />
        ))}

        {/* Refracted wave fronts */}
        {refractedWaveFronts.map((waveFront, i) => (
          <Line key={`refracted-${i}`} points={waveFront} color="#4CAF50" lineWidth={2} opacity={0.7} />
        ))}

        {/* Particles */}
        {particlePositions.map((particle, index) => (
          <mesh key={index} position={[particle.x, particle.y, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={particle.medium === 1 ? "#00BFFF" : "#4CAF50"}
              emissive={particle.medium === 1 ? "#00BFFF" : "#4CAF50"}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Angle indicators */}
      <group>
        {/* Incident angle */}
        <Line
          points={[
            [boundaryX, 0, 0],
            [boundaryX - 2 * Math.cos(incidentAngle), 2 * Math.sin(incidentAngle), 0],
          ]}
          color="#FFFF00"
          lineWidth={1}
          dashed={true}
        />
        <Text
          position={[boundaryX - 1.5 * Math.cos(incidentAngle), 1.5 * Math.sin(incidentAngle), 0]}
          fontSize={0.4}
          color="#FFFF00"
          anchorX="center"
        >
          θ₁ = {((incidentAngle * 180) / Math.PI).toFixed(0)}°
        </Text>

        {/* Refracted angle */}
        <Line
          points={[
            [boundaryX, 0, 0],
            [boundaryX + 2 * Math.cos(refractedAngle), 2 * Math.sin(refractedAngle), 0],
          ]}
          color="#FFFF00"
          lineWidth={1}
          dashed={true}
        />
        <Text
          position={[boundaryX + 1.5 * Math.cos(refractedAngle), 1.5 * Math.sin(refractedAngle), 0]}
          fontSize={0.4}
          color="#FFFF00"
          anchorX="center"
        >
          θ₂ = {((refractedAngle * 180) / Math.PI).toFixed(0)}°
        </Text>
      </group>

      {/* Title and explanation */}
      <Text position={[0, 5, 0]} fontSize={0.7} color="white" anchorX="center">
        Wave Refraction
      </Text>
      <Text position={[0, 4, 0]} fontSize={0.5} color="white" anchorX="center">
        When waves enter a medium with a different speed, they change direction
      </Text>
      <Text position={[0, 3.3, 0]} fontSize={0.4} color="white" anchorX="center">
        Snell's Law: sin(θ₂)/sin(θ₁) = v₂/v₁ = λ₂/λ₁
      </Text>
      <Text position={[0, -4, 0]} fontSize={0.4} color="white" anchorX="center">
        If v₂ {"<"} v₁: Wave bends toward the normal (smaller angle)
      </Text>
      <Text position={[0, -4.7, 0]} fontSize={0.4} color="white" anchorX="center">
        If v₂ {">"} v₁: Wave bends away from the normal (larger angle)
      </Text>
    </group>
  )
}

function DiffractionDemo({
  amplitude,
  frequency,
  wavelength,
  obstacleWidth,
  apertureWidth,
  time,
  stringThickness,
  showParticles,
}) {
  const waveLength = 20
  const numPoints = 100
  const numParticles = 40
  const boundaryX = 0 // Position of the obstacle/aperture

  // Angular frequency
  const omega = 2 * Math.PI * frequency
  // Wave number
  const k = (2 * Math.PI) / wavelength
  // Wave speed
  const speed = wavelength * frequency

  // Generate 2D wave fronts for incident wave
  const incidentWaveFronts = []
  const numWaveFronts = 5
  const waveFrontSpacing = wavelength

  for (let i = 0; i < numWaveFronts; i++) {
    const distance = i * waveFrontSpacing - speed * time
    const waveFront = []

    for (let j = 0; j <= 20; j++) {
      const y = -waveLength / 4 + ((j / 20) * waveLength) / 2
      const x = distance % (wavelength * numWaveFronts)

      // Only include points in left side
      if (x <= boundaryX) {
        waveFront.push([x, y, 0])
      }
    }

    if (waveFront.length > 0) {
      incidentWaveFronts.push(waveFront)
    }
  }

  // Generate 2D wave fronts for diffracted wave
  const diffractedWaveFronts = []

  // Determine if we're showing obstacle or aperture diffraction
  const isAperture = apertureWidth < obstacleWidth
  const effectiveWidth = isAperture ? apertureWidth : obstacleWidth

  // Calculate aperture/obstacle position
  const apertureTop = effectiveWidth / 2
  const apertureBottom = -effectiveWidth / 2

  // Generate circular wave fronts from the aperture/edges
  const numDiffractedFronts = 5

  if (isAperture) {
    // Aperture diffraction - waves emanate from the aperture
    for (let i = 0; i < numDiffractedFronts; i++) {
      const radius = i * waveFrontSpacing - speed * time
      if (radius > 0) {
        const waveFront = []

        // Generate points for a semi-circle on the right side
        for (let j = 0; j <= 40; j++) {
          const angle = -Math.PI / 2 + (j / 40) * Math.PI
          const x = boundaryX + Math.abs(radius % (wavelength * numDiffractedFronts)) * Math.cos(angle)
          const y = Math.abs(radius % (wavelength * numDiffractedFronts)) * Math.sin(angle)

          // Only include points in right side and within aperture height
          if (x >= boundaryX && y >= apertureBottom && y <= apertureTop) {
            waveFront.push([x, y, 0])
          }
        }

        if (waveFront.length > 0) {
          diffractedWaveFronts.push(waveFront)
        }
      }
    }
  } else {
    // Obstacle diffraction - waves bend around the obstacle
    // Top edge diffraction
    for (let i = 0; i < numDiffractedFronts; i++) {
      const radius = i * waveFrontSpacing - speed * time
      if (radius > 0) {
        const waveFrontTop = []

        for (let j = 0; j <= 20; j++) {
          const angle = -Math.PI / 2 + (j / 20) * Math.PI
          const x = boundaryX + Math.abs(radius % (wavelength * numDiffractedFronts)) * Math.cos(angle)
          const y = apertureTop + Math.abs(radius % (wavelength * numDiffractedFronts)) * Math.sin(angle)

          if (x >= boundaryX) {
            waveFrontTop.push([x, y, 0])
          }
        }

        if (waveFrontTop.length > 0) {
          diffractedWaveFronts.push(waveFrontTop)
        }

        // Bottom edge diffraction
        const waveFrontBottom = []

        for (let j = 0; j <= 20; j++) {
          const angle = Math.PI / 2 - (j / 20) * Math.PI
          const x = boundaryX + Math.abs(radius % (wavelength * numDiffractedFronts)) * Math.cos(angle)
          const y = apertureBottom + Math.abs(radius % (wavelength * numDiffractedFronts)) * Math.sin(angle)

          if (x >= boundaryX) {
            waveFrontBottom.push([x, y, 0])
          }
        }

        if (waveFrontBottom.length > 0) {
          diffractedWaveFronts.push(waveFrontBottom)
        }
      }
    }
  }

  // Generate particles for visualization
  const particlePositions = []
  if (showParticles) {
    // Particles for incident wave
    for (let i = 0; i < numParticles / 2; i++) {
      const x = -waveLength / 2 + ((i / (numParticles / 2)) * waveLength) / 2
      const y = amplitude * Math.sin(k * x - omega * time)

      if (x <= boundaryX) {
        particlePositions.push({ x, y, type: "incident" })
      }
    }

    // Particles for diffracted wave
    if (isAperture) {
      // Particles emanating from aperture
      for (let i = 0; i < numParticles / 2; i++) {
        const angle = -Math.PI / 4 + ((i / (numParticles / 2)) * Math.PI) / 2
        const distance = waveLength / 8 + ((i % 4) * wavelength) / 4
        const x = boundaryX + distance * Math.cos(angle)
        const y = distance * Math.sin(angle)

        if (x >= boundaryX && y >= apertureBottom && y <= apertureTop) {
          particlePositions.push({ x, y, type: "diffracted" })
        }
      }
    } else {
      // Particles bending around obstacle
      for (let i = 0; i < numParticles / 4; i++) {
        const angle = -Math.PI / 4 + ((i / (numParticles / 4)) * Math.PI) / 8
        const distance = waveLength / 8 + ((i % 4) * wavelength) / 4
        const x = boundaryX + distance * Math.cos(angle)
        const y = apertureTop + distance * Math.sin(angle)

        particlePositions.push({ x, y, type: "diffracted" })
      }

      for (let i = 0; i < numParticles / 4; i++) {
        const angle = Math.PI / 4 - ((i / (numParticles / 4)) * Math.PI) / 8
        const distance = waveLength / 8 + ((i % 4) * wavelength) / 4
        const x = boundaryX + distance * Math.cos(angle)
        const y = apertureBottom + distance * Math.sin(angle)

        particlePositions.push({ x, y, type: "diffracted" })
      }
    }
  }

  return (
    <group>
      {/* Obstacle or aperture */}
      {isAperture ? (
        // Aperture
        <group>
          <mesh position={[boundaryX, waveLength / 4 + apertureTop / 2, 0]}>
            <boxGeometry args={[0.5, waveLength / 2 - apertureTop, 1]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
          <mesh position={[boundaryX, -waveLength / 4 - apertureBottom / 2, 0]}>
            <boxGeometry args={[0.5, waveLength / 2 + apertureBottom, 1]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
        </group>
      ) : (
        // Obstacle
        <mesh position={[boundaryX, (apertureTop + apertureBottom) / 2, 0]}>
          <boxGeometry args={[0.5, effectiveWidth, 1]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      )}

      {/* Wave visualization */}
      <group>
        {/* Incident wave fronts */}
        {incidentWaveFronts.map((waveFront, i) => (
          <Line key={`incident-${i}`} points={waveFront} color="#00BFFF" lineWidth={2} opacity={0.7} />
        ))}

        {/* Diffracted wave fronts */}
        {diffractedWaveFronts.map((waveFront, i) => (
          <Line key={`diffracted-${i}`} points={waveFront} color="#4CAF50" lineWidth={2} opacity={0.7} />
        ))}

        {/* Particles */}
        {particlePositions.map((particle, index) => (
          <mesh key={index} position={[particle.x, particle.y, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={particle.type === "incident" ? "#00BFFF" : "#4CAF50"}
              emissive={particle.type === "incident" ? "#00BFFF" : "#4CAF50"}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Title and explanation */}
      <Text position={[0, 5, 0]} fontSize={0.7} color="white" anchorX="center">
        Wave Diffraction
      </Text>
      <Text position={[0, 4, 0]} fontSize={0.5} color="white" anchorX="center">
        {isAperture ? "Waves spread out after passing through an aperture" : "Waves bend around obstacles"}
      </Text>
      <Text position={[0, 3.3, 0]} fontSize={0.4} color="white" anchorX="center">
        Diffraction is more pronounced when the aperture/obstacle size is comparable to wavelength
      </Text>
      <Text position={[0, -4, 0]} fontSize={0.4} color="white" anchorX="center">
        {isAperture
          ? `Aperture width: ${apertureWidth.toFixed(1)} units (${(apertureWidth / wavelength).toFixed(1)}λ)`
          : `Obstacle width: ${obstacleWidth.toFixed(1)} units (${(obstacleWidth / wavelength).toFixed(1)}λ)`}
      </Text>
      <Text position={[0, -4.7, 0]} fontSize={0.4} color="white" anchorX="center">
        Diffraction allows waves to reach areas that would otherwise be in the "shadow" region
      </Text>
    </group>
  )
}

function DispersionDemo({ amplitude, frequency, wavelength, time, stringThickness, showParticles }) {
  const waveLength = 20
  const numPoints = 100
  const numParticles = 40
  const prismX = 0 // Position of the prism

  // Define different frequencies for the color components
  const frequencies = [
    { color: "#FF0000", name: "Red", freq: frequency * 0.8, speed: 8 }, // Red (lowest frequency)
    { color: "#FFA500", name: "Orange", freq: frequency * 0.85, speed: 8.5 },
    { color: "#FFFF00", name: "Yellow", freq: frequency * 0.9, speed: 9 },
    { color: "#00FF00", name: "Green", freq: frequency * 0.95, speed: 9.5 },
    { color: "#0000FF", name: "Blue", freq: frequency, speed: 10 }, // Blue (highest frequency)
    { color: "#4B0082", name: "Indigo", freq: frequency * 1.05, speed: 10.5 },
    { color: "#9400D3", name: "Violet", freq: frequency * 1.1, speed: 11 },
  ]

  // Define prism shape
  const prismPoints = [
    [prismX - 2, -2, 0],
    [prismX + 2, -2, 0],
    [prismX, 2, 0],
    [prismX - 2, -2, 0],
  ]

  // Generate incident wave (white light)
  const incidentPoints = []
  const incidentWave = []

  // Wave parameters
  const k = (2 * Math.PI) / wavelength
  const omega = 2 * Math.PI * frequency

  for (let i = 0; i <= numPoints / 2; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    if (x < prismX - 2) {
      const y = amplitude * Math.sin(k * x - omega * time)
      incidentPoints.push([x, y, 0])

      // Add points for the wave visualization
      incidentWave.push([x, y, 0])
    }
  }

  // Generate dispersed waves
  const dispersedWaves = frequencies.map((freq) => {
    const points = []
    const wave = []
    const angle = ((freq.freq / frequencies[0].freq - 1) * Math.PI) / 6 // Angle increases with frequency

    for (let i = 0; i <= numPoints / 2; i++) {
      const distance = i * (waveLength / numPoints / 2)
      const x = prismX + distance * Math.cos(angle)
      const y = distance * Math.sin(angle)

      if (x > prismX) {
        const waveY = y + amplitude * 0.5 * Math.sin(k * distance - freq.freq * 2 * Math.PI * time)
        points.push([x, waveY, 0])

        // Add points for the wave visualization
        wave.push([x, waveY, 0])
      }
    }

    return { color: freq.color, name: freq.name, points, wave }
  })

  // Generate particles for visualization
  const particlePositions = []
  if (showParticles) {
    // Particles for incident wave (white light)
    for (let i = 0; i < numParticles / 3; i++) {
      const x = -waveLength / 2 + (i / (numParticles / 3)) * (waveLength / 2 - 2)
      const y = amplitude * Math.sin(k * x - omega * time)

      if (x < prismX - 2) {
        particlePositions.push({ x, y, color: "#FFFFFF", type: "incident" })
      }
    }

    // Particles for dispersed waves
    dispersedWaves.forEach((wave, waveIndex) => {
      for (let i = 0; i < numParticles / (frequencies.length * 2); i++) {
        const angle = ((frequencies[waveIndex].freq / frequencies[0].freq - 1) * Math.PI) / 6
        const distance = 2 + (i / (numParticles / (frequencies.length * 2))) * (waveLength / 2)
        const x = prismX + distance * Math.cos(angle)
        const y = distance * Math.sin(angle)

        particlePositions.push({ x, y, color: wave.color, type: "dispersed" })
      }
    })
  }

  return (
    <group>
      {/* Prism */}
      <Line points={prismPoints} color="#FFFFFF" lineWidth={2} />
      <mesh position={[prismX, -0.5, 0]}>
        <planeGeometry args={[3.5, 3]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.2} transparent />
      </mesh>

      {/* Wave visualization */}
      <group>
        {/* Incident wave (white light) */}
        <Line points={incidentWave} color="#FFFFFF" lineWidth={2} opacity={0.7} />

        {/* Dispersed waves */}
        {dispersedWaves.map((wave, i) => (
          <Line key={`wave-${i}`} points={wave.wave} color={wave.color} lineWidth={2} opacity={0.7} />
        ))}

        {/* Particles */}
        {particlePositions.map((particle, index) => (
          <mesh key={index} position={[particle.x, particle.y, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={particle.color} emissive={particle.color} emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Color labels */}
      {dispersedWaves.map((wave, i) => (
        <Text
          key={`label-${i}`}
          position={[
            prismX + 7 * Math.cos(((frequencies[i].freq / frequencies[0].freq - 1) * Math.PI) / 6),
            7 * Math.sin(((frequencies[i].freq / frequencies[0].freq - 1) * Math.PI) / 6),
            0,
          ]}
          fontSize={0.4}
          color={wave.color}
          anchorX="center"
        >
          {wave.name}
        </Text>
      ))}

      {/* Title and explanation */}
      <Text position={[0, 5, 0]} fontSize={0.7} color="white" anchorX="center">
        Wave Dispersion
      </Text>
      <Text position={[0, 4, 0]} fontSize={0.5} color="white" anchorX="center">
        Different frequencies travel at different speeds in dispersive media
      </Text>
      <Text position={[0, 3.3, 0]} fontSize={0.4} color="white" anchorX="center">
        This causes white light to separate into its component colors
      </Text>
      <Text position={[0, -4, 0]} fontSize={0.4} color="white" anchorX="center">
        Higher frequencies (blue/violet) refract more than lower frequencies (red)
      </Text>
      <Text position={[0, -4.7, 0]} fontSize={0.4} color="white" anchorX="center">
        Dispersion explains rainbows and prism effects
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

// Helper component for arrows
function ArrowHelper({ dir, origin, length, color }) {
  const normalizedDir = new Vector3().copy(dir).normalize()
  const end = new Vector3().copy(origin).add(normalizedDir.multiplyScalar(length))

  // Calculate arrow head points
  const headLength = Math.min(length * 0.2, 0.3)
  const headWidth = headLength * 0.5

  const arrowDir = new Vector3().copy(normalizedDir)
  const sideDir = new Vector3(arrowDir.y, -arrowDir.x, 0).normalize()
  if (Math.abs(arrowDir.z) > 0.9) {
    sideDir.set(1, 0, 0)
  }

  const headBase = new Vector3().copy(end).sub(arrowDir.multiplyScalar(headLength))
  const side1 = new Vector3().copy(headBase).add(sideDir.clone().multiplyScalar(headWidth))
  const side2 = new Vector3().copy(headBase).add(sideDir.clone().multiplyScalar(-headWidth))

  return (
    <group>
      {/* Arrow shaft */}
      <Line
        points={[
          [origin.x, origin.y, origin.z],
          [end.x, end.y, end.z],
        ]}
        color={color}
        lineWidth={2}
      />

      {/* Arrow head */}
      <Line
        points={[
          [end.x, end.y, end.z],
          [side1.x, side1.y, side1.z],
        ]}
        color={color}
        lineWidth={2}
      />
      <Line
        points={[
          [end.x, end.y, end.z],
          [side2.x, side2.y, side2.z],
        ]}
        color={color}
        lineWidth={2}
      />
      <Line
        points={[
          [side1.x, side1.y, side1.z],
          [side2.x, side2.y, side2.z],
        ]}
        color={color}
        lineWidth={2}
      />
    </group>
  )
}
