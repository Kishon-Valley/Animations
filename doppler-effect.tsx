"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"

export default function DopplerEffect() {
  const [sourceVelocity, setSourceVelocity] = useState(0)
  const [waveSpeed, setWaveSpeed] = useState(10)
  const [frequency, setFrequency] = useState(1)
  const [amplitude, setAmplitude] = useState(0.5)
  const [showWavefronts, setShowWavefronts] = useState(true)
  const [showFrequencyShift, setShowFrequencyShift] = useState(true)
  const [paused, setPaused] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [observerPosition, setObserverPosition] = useState(8)

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
        <h2 className="text-xl font-bold mb-4">Doppler Effect</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Source Velocity: {sourceVelocity.toFixed(1)} units/s</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={sourceVelocity}
              onChange={(e) => setSourceVelocity(Number.parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              Negative: moving away from observer | Positive: moving toward observer
            </div>
          </div>

          <div>
            <label className="block mb-1">Wave Speed: {waveSpeed.toFixed(1)} units/s</label>
            <input
              type="range"
              min="5"
              max="20"
              step="0.5"
              value={waveSpeed}
              onChange={(e) => setWaveSpeed(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Frequency: {frequency.toFixed(1)} Hz</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Amplitude: {amplitude.toFixed(1)} units</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={amplitude}
              onChange={(e) => setAmplitude(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Observer Position: {observerPosition.toFixed(1)} units</label>
            <input
              type="range"
              min="4"
              max="12"
              step="0.5"
              value={observerPosition}
              onChange={(e) => setObserverPosition(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showWavefronts}
                onChange={() => setShowWavefronts(!showWavefronts)}
                className="mr-2"
              />
              Show Wavefronts
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFrequencyShift}
                onChange={() => setShowFrequencyShift(!showFrequencyShift)}
                className="mr-2"
              />
              Show Frequency Shift
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
        <DopplerScene
          sourceVelocity={sourceVelocity}
          waveSpeed={waveSpeed}
          frequency={frequency}
          amplitude={amplitude}
          showWavefronts={showWavefronts}
          showFrequencyShift={showFrequencyShift}
          paused={paused}
          observerPosition={observerPosition}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function DopplerScene({
  sourceVelocity,
  waveSpeed,
  frequency,
  amplitude,
  showWavefronts,
  showFrequencyShift,
  paused,
  observerPosition,
}) {
  const timeRef = useRef(0)
  const [time, setTime] = useState(0)
  const [sourcePosition, setSourcePosition] = useState(0)
  const [wavefronts, setWavefronts] = useState([])
  const [observedFrequency, setObservedFrequency] = useState(frequency)

  // Update time and source position
  useFrame((state, delta) => {
    if (!paused) {
      // Update time
      const newTime = timeRef.current + delta
      timeRef.current = newTime
      setTime(newTime)

      // Update source position based on velocity
      const newPosition = sourceVelocity * newTime
      setSourcePosition(newPosition)

      // Generate new wavefront at regular intervals based on frequency
      const wavefrontInterval = 1 / frequency
      if (Math.floor(newTime / wavefrontInterval) > Math.floor((newTime - delta) / wavefrontInterval)) {
        // Add new wavefront
        setWavefronts((prevWavefronts) =>
          [...prevWavefronts, { birthTime: newTime, sourcePosition: newPosition }].slice(-50),
        ) // Keep only the last 50 wavefronts for performance
      }

      // Calculate observed frequency using the Doppler effect formula
      // f' = f * (v / (v - vs))
      // where f is the emitted frequency, v is the wave speed, vs is the source velocity
      const observedFreq =
        sourceVelocity >= waveSpeed
          ? frequency * 2 // Cap at 2x for extreme cases
          : frequency * (waveSpeed / (waveSpeed - sourceVelocity))

      setObservedFrequency(Math.abs(observedFreq))
    }
  })

  // Calculate wavelength
  const wavelength = waveSpeed / frequency

  // Calculate Doppler-shifted wavelength
  const shiftedWavelength = waveSpeed / observedFrequency

  return (
    <group>
      {/* Coordinate system */}
      <CoordinateSystem />

      {/* Source */}
      <mesh position={[sourcePosition, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FF4500" />
      </mesh>
      <Text position={[sourcePosition, 1, 0]} fontSize={0.4} color="#FFFFFF">
        Source
      </Text>

      {/* Observer */}
      <mesh position={[observerPosition, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
      <Text position={[observerPosition, 1, 0]} fontSize={0.4} color="#FFFFFF">
        Observer
      </Text>

      {/* Wavefronts */}
      {showWavefronts &&
        wavefronts.map((wavefront, index) => {
          // Calculate radius based on time elapsed since wavefront was created and wave speed
          const radius = (time - wavefront.birthTime) * waveSpeed

          // Only show wavefronts that haven't reached the edge of the scene
          if (radius > 0 && radius < 20) {
            return (
              <WavefrontCircle key={index} center={[wavefront.sourcePosition, 0, 0]} radius={radius} color="#00BFFF" />
            )
          }
          return null
        })}

      {/* Frequency visualization */}
      {showFrequencyShift && (
        <FrequencyVisualization
          sourcePosition={sourcePosition}
          observerPosition={observerPosition}
          emittedFrequency={frequency}
          observedFrequency={observedFrequency}
          amplitude={amplitude}
          time={time}
        />
      )}

      {/* Doppler effect explanation */}
      <DopplerExplanation
        sourceVelocity={sourceVelocity}
        waveSpeed={waveSpeed}
        frequency={frequency}
        observedFrequency={observedFrequency}
        wavelength={wavelength}
        shiftedWavelength={shiftedWavelength}
      />
    </group>
  )
}

function CoordinateSystem() {
  const axisLength = 15

  return (
    <group>
      {/* X-axis (red) */}
      <Line
        points={[
          [-axisLength, 0, 0],
          [axisLength, 0, 0],
        ]}
        color="red"
        lineWidth={1}
        opacity={0.5}
      />
      <Text position={[axisLength + 0.5, 0, 0]} fontSize={0.5} color="red">
        X
      </Text>

      {/* Y-axis (green) */}
      <Line
        points={[
          [0, -axisLength / 2, 0],
          [0, axisLength / 2, 0],
        ]}
        color="green"
        lineWidth={1}
        opacity={0.5}
      />
      <Text position={[0, axisLength / 2 + 0.5, 0]} fontSize={0.5} color="green">
        Y
      </Text>
    </group>
  )
}

function WavefrontCircle({ center, radius, color }) {
  const segments = 64
  const points = []

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    const x = center[0] + radius * Math.cos(theta)
    const y = center[1] + radius * Math.sin(theta)
    points.push([x, y, 0])
  }

  return <Line points={points} color={color} lineWidth={1} opacity={0.5} />
}

function FrequencyVisualization({
  sourcePosition,
  observerPosition,
  emittedFrequency,
  observedFrequency,
  amplitude,
  time,
}) {
  // Generate points for emitted wave (at source)
  const emittedWavePoints = []
  const numPoints = 100
  const waveLength = 10

  for (let i = 0; i <= numPoints; i++) {
    const x = sourcePosition - waveLength / 2 + (i / numPoints) * waveLength
    const y = -4 + amplitude * Math.sin(2 * Math.PI * emittedFrequency * (time - (x - sourcePosition) / 10))
    emittedWavePoints.push([x, y, 0])
  }

  // Generate points for observed wave (at observer)
  const observedWavePoints = []

  for (let i = 0; i <= numPoints; i++) {
    const x = observerPosition - waveLength / 2 + (i / numPoints) * waveLength
    const y = -6 + amplitude * Math.sin(2 * Math.PI * observedFrequency * (time - (x - observerPosition) / 10))
    observedWavePoints.push([x, y, 0])
  }

  return (
    <group>
      {/* Emitted wave */}
      <Line points={emittedWavePoints} color="#FF4500" lineWidth={2} />
      <Text position={[sourcePosition - waveLength / 2 - 1, -4, 0]} fontSize={0.4} color="#FF4500" anchorX="right">
        Emitted: {emittedFrequency.toFixed(2)} Hz
      </Text>

      {/* Observed wave */}
      <Line points={observedWavePoints} color="#4169E1" lineWidth={2} />
      <Text position={[observerPosition - waveLength / 2 - 1, -6, 0]} fontSize={0.4} color="#4169E1" anchorX="right">
        Observed: {observedFrequency.toFixed(2)} Hz
      </Text>
    </group>
  )
}

function DopplerExplanation({
  sourceVelocity,
  waveSpeed,
  frequency,
  observedFrequency,
  wavelength,
  shiftedWavelength,
}) {
  // Determine if source is moving toward or away from observer
  const movingToward = sourceVelocity > 0
  const movingAway = sourceVelocity < 0
  const stationary = sourceVelocity === 0

  // Calculate frequency shift
  const frequencyShift = observedFrequency - frequency
  const percentShift = (frequencyShift / frequency) * 100

  return (
    <group position={[0, 5, 0]}>
      <Text position={[0, 0, 0]} fontSize={0.7} color="white" anchorX="center">
        Doppler Effect
      </Text>

      <Text position={[0, -1, 0]} fontSize={0.5} color="white" anchorX="center">
        {stationary
          ? "Source is stationary"
          : movingToward
            ? "Source is moving toward the observer"
            : "Source is moving away from the observer"}
      </Text>

      <Text position={[0, -2, 0]} fontSize={0.4} color="white" anchorX="center">
        {stationary
          ? "No frequency shift occurs"
          : movingToward
            ? "Observed frequency is higher (blue shift)"
            : "Observed frequency is lower (red shift)"}
      </Text>

      <Text position={[0, -3, 0]} fontSize={0.4} color="white" anchorX="center">
        Frequency shift: {frequencyShift.toFixed(2)} Hz ({percentShift.toFixed(1)}%)
      </Text>

      <Text position={[0, -8, 0]} fontSize={0.4} color="white" anchorX="center">
        Emitted wavelength: {wavelength.toFixed(2)} units
      </Text>

      <Text position={[0, -9, 0]} fontSize={0.4} color="white" anchorX="center">
        Observed wavelength: {shiftedWavelength.toFixed(2)} units
      </Text>

      <Text position={[0, -10, 0]} fontSize={0.4} color="white" anchorX="center">
        f' = f × (v / (v - vₛ)) where f is frequency, v is wave speed, vₛ is source velocity
      </Text>
    </group>
  )
}
