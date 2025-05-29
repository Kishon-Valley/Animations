"use client"

import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3, CatmullRomCurve3, TubeGeometry } from "three"

export default function WavePropagation() {
  const [selectedDemo, setSelectedDemo] = useState("waveSpeed")
  const [tension, setTension] = useState(50)
  const [linearDensity, setLinearDensity] = useState(0.01)
  const [amplitude, setAmplitude] = useState(1)
  const [frequency, setFrequency] = useState(0.5)
  const [impedance1, setImpedance1] = useState(1)
  const [impedance2, setImpedance2] = useState(2)
  const [paused, setPaused] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [stringThickness, setStringThickness] = useState(0.15)
  const [showParticles, setShowParticles] = useState(true)

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
        <h2 className="text-xl font-bold mb-4">Wave Propagation</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Demonstration:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDemo("waveSpeed")}
                className={`px-2 py-1 rounded ${selectedDemo === "waveSpeed" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Wave Speed
              </button>
              <button
                onClick={() => setSelectedDemo("energyTransfer")}
                className={`px-2 py-1 rounded ${selectedDemo === "energyTransfer" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Energy Transfer
              </button>
              <button
                onClick={() => setSelectedDemo("impedance")}
                className={`px-2 py-1 rounded ${selectedDemo === "impedance" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Impedance & Intensity
              </button>
            </div>
          </div>

          {selectedDemo === "waveSpeed" && (
            <>
              <div>
                <label className="block mb-1">Tension: {tension.toFixed(0)} N</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={tension}
                  onChange={(e) => setTension(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Linear Density: {linearDensity.toFixed(3)} kg/m</label>
                <input
                  type="range"
                  min="0.005"
                  max="0.05"
                  step="0.005"
                  value={linearDensity}
                  onChange={(e) => setLinearDensity(Number.parseFloat(e.target.value))}
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
            </>
          )}

          {selectedDemo === "energyTransfer" && (
            <>
              <div>
                <label className="block mb-1">Amplitude: {amplitude.toFixed(1)} units</label>
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
                <label className="block mb-1">Tension: {tension.toFixed(0)} N</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={tension}
                  onChange={(e) => setTension(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          {selectedDemo === "impedance" && (
            <>
              <div>
                <label className="block mb-1">Medium 1 Impedance: {impedance1.toFixed(1)} units</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={impedance1}
                  onChange={(e) => setImpedance1(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Medium 2 Impedance: {impedance2.toFixed(1)} units</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={impedance2}
                  onChange={(e) => setImpedance2(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Amplitude: {amplitude.toFixed(1)} units</label>
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
            </>
          )}

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
        <WaveScene
          selectedDemo={selectedDemo}
          tension={tension}
          linearDensity={linearDensity}
          amplitude={amplitude}
          frequency={frequency}
          impedance1={impedance1}
          impedance2={impedance2}
          paused={paused}
          stringThickness={stringThickness}
          showParticles={showParticles}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function WaveScene({
  selectedDemo,
  tension,
  linearDensity,
  amplitude,
  frequency,
  impedance1,
  impedance2,
  paused,
  stringThickness,
  showParticles,
}: {
  selectedDemo: string;
  tension: number;
  linearDensity: number;
  amplitude: number;
  frequency: number;
  impedance1: number;
  impedance2: number;
  paused: boolean;
  stringThickness: number;
  showParticles: boolean;
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

  // Render the appropriate demo
  return (
    <group>
      {/* Coordinate System */}
      <CoordinateSystem />

      {/* Wave Visualization */}
      {selectedDemo === "waveSpeed" && (
        <WaveSpeedDemo
          tension={tension}
          linearDensity={linearDensity}
          frequency={frequency}
          time={time}
          amplitude={amplitude}
          stringThickness={stringThickness}
          showParticles={showParticles}
        />
      )}

      {selectedDemo === "energyTransfer" && (
        <EnergyTransferDemo
          amplitude={amplitude}
          frequency={frequency}
          tension={tension}
          time={time}
          stringThickness={stringThickness}
          showParticles={showParticles}
        />
      )}

      {selectedDemo === "impedance" && (
        <ImpedanceDemo
          impedance1={impedance1}
          impedance2={impedance2}
          amplitude={amplitude}
          frequency={frequency}
          time={time}
          stringThickness={stringThickness}
          showParticles={showParticles}
        />
      )}
    </group>
  )
}

function CoordinateSystem() {
  const axisLength = 12

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

      {/* Z-axis (blue) */}
      <Line
        points={[
          [0, 0, -axisLength / 2],
          [0, 0, axisLength / 2],
        ]}
        color="blue"
        lineWidth={1}
        opacity={0.5}
      />
      <Text position={[0, 0, axisLength / 2 + 0.5]} fontSize={0.5} color="blue">
        Z
      </Text>
    </group>
  )
}

function StringMesh({ points, thickness, color, segments = 64 }: { 
  points: [number, number, number][]; 
  thickness: number; 
  color: string; 
  segments?: number; 
}) {
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

function WaveSpeedDemo({ 
  tension, 
  linearDensity, 
  frequency, 
  time, 
  amplitude, 
  stringThickness, 
  showParticles 
}: { 
  tension: number;
  linearDensity: number;
  frequency: number;
  time: number;
  amplitude: number;
  stringThickness: number;
  showParticles: boolean;
}) {
  const waveLength = 20
  const numPoints = 100
  const numParticles = 20

  // Calculate wave speed
  const waveSpeed = Math.sqrt(tension / linearDensity)

  // Generate wave points
  const wavePoints: [number, number, number][] = []
  for (let i = 0; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    const y = amplitude * Math.sin(2 * Math.PI * (x / waveSpeed - frequency * time))
    wavePoints.push([x, y, 0])
  }

  // Add fixed endpoints for the strings
  const fixedPoints: [number, number, number][] = [[-waveLength / 2, 0, 0], ...wavePoints, [waveLength / 2, 0, 0]]

  // Calculate wave front positions (for visualization)
  const waveFrontX = (((2 * Math.PI * time) / (2 * Math.PI * frequency)) % waveLength) - waveLength / 2

  return (
    <group>
      {/* Current wave */}
      <group position={[0, 0, 0]}>
        {/* String visualization as a 3D tube */}
        <StringMesh points={fixedPoints} thickness={stringThickness} color="#00BFFF" />

        {/* Particles */}
        {showParticles &&
          wavePoints.map((pos, index) => (
            <mesh key={`p1-${index}`} position={[pos[0], pos[1], 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#FF9900" />
            </mesh>
          ))}

        {/* Wave front indicator */}
        <mesh position={[waveFrontX, 0, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
        </mesh>

        {/* Fixed endpoints */}
        <mesh position={[-waveLength / 2, 0, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[waveLength / 2, 0, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>

        {/* Wave parameters */}
        <Text position={[waveLength / 2 + 1, 0, 0]} fontSize={0.4} color="white" anchorX="left">
          Your Wave
        </Text>
        <Text position={[waveLength / 2 + 1, -0.5, 0]} fontSize={0.35} color="white" anchorX="left">
          Tension: {tension.toFixed(0)} N
        </Text>
        <Text position={[waveLength / 2 + 1, -1.0, 0]} fontSize={0.35} color="white" anchorX="left">
          Density: {linearDensity.toFixed(3)} kg/m
        </Text>
        <Text position={[waveLength / 2 + 1, -1.5, 0]} fontSize={0.35} color="white" anchorX="left">
          Speed: {waveSpeed.toFixed(1)} m/s
        </Text>
        <Text position={[waveLength / 2 + 1, -2.0, 0]} fontSize={0.35} color="white" anchorX="left">
          Wavelength: {waveLength.toFixed(1)} m
        </Text>
      </group>

      {/* Reference wave */}
      <group position={[0, -3, 0]}>
        {/* String visualization as a 3D tube */}
        <StringMesh points={fixedPoints} thickness={stringThickness} color="#4CAF50" />

        {/* Particles */}
        {showParticles &&
          wavePoints.map((pos, index) => (
            <mesh key={`p2-${index}`} position={[pos[0], pos[1], 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#FFFF00" />
            </mesh>
          ))}

        {/* Wave front indicator */}
        <mesh position={[waveFrontX, 0, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
        </mesh>

        {/* Fixed endpoints */}
        <mesh position={[-waveLength / 2, 0, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[waveLength / 2, 0, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>

        {/* Wave parameters */}
        <Text position={[waveLength / 2 + 1, 0, 0]} fontSize={0.4} color="white" anchorX="left">
          Reference Wave
        </Text>
        <Text position={[waveLength / 2 + 1, -0.5, 0]} fontSize={0.35} color="white" anchorX="left">
          Tension: {tension.toFixed(0)} N
        </Text>
        <Text position={[waveLength / 2 + 1, -1.0, 0]} fontSize={0.35} color="white" anchorX="left">
          Density: {linearDensity.toFixed(3)} kg/m
        </Text>
        <Text position={[waveLength / 2 + 1, -1.5, 0]} fontSize={0.35} color="white" anchorX="left">
          Speed: {waveSpeed.toFixed(1)} m/s
        </Text>
        <Text position={[waveLength / 2 + 1, -2.0, 0]} fontSize={0.35} color="white" anchorX="left">
          Wavelength: {waveLength.toFixed(1)} m
        </Text>
      </group>

      {/* Title and explanation */}
      <Text position={[0, 3, 0]} fontSize={0.7} color="white" anchorX="center">
        Wave Speed on a String
      </Text>
      <Text position={[0, 2.3, 0]} fontSize={0.5} color="white" anchorX="center">
        v = √(T/μ)
      </Text>
      <Text position={[0, 1.7, 0]} fontSize={0.4} color="white" anchorX="center">
        Wave speed increases with higher tension and decreases with higher linear density
      </Text>
      <Text position={[0, -6, 0]} fontSize={0.4} color="white" anchorX="center">
        Red markers show wave fronts - notice how they travel at different speeds
      </Text>
    </group>
  )
}

function EnergyTransferDemo({ 
  amplitude, 
  frequency, 
  tension, 
  time, 
  stringThickness, 
  showParticles 
}: { 
  amplitude: number;
  frequency: number;
  tension: number;
  time: number;
  stringThickness: number;
  showParticles: boolean;
}) {
  const waveLength = 20
  const numPoints = 100
  const numParticles = 20

  // Angular frequency
  const omega = 2 * Math.PI * frequency

  // Assume a standard linear density
  const linearDensity = 0.01

  // Calculate wave speed
  const waveSpeed = Math.sqrt(tension / linearDensity)

  // Calculate wavelength
  const wavelength = waveSpeed / frequency

  // Wave number
  const k = (2 * Math.PI) / wavelength

  // Generate wave points
  const wavePoints: [number, number, number][] = []
  for (let i = 0; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    const y = amplitude * Math.sin(k * x - omega * time)
    wavePoints.push([x, y, 0])
  }

  // Calculate particle velocities
  const particleVelocities: number[] = wavePoints.map((_, i) => {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    return -amplitude * omega * Math.cos(k * x - omega * time)
  })

  // Calculate energy at each point
  const totalEnergyPoints: [number, number, number][] = []
  const kineticEnergyPoints: [number, number, number][] = []
  const potentialEnergyPoints: [number, number, number][] = []

  wavePoints.forEach((point, i) => {
    const x = point[0]
    const y = point[1]
    const velocity = particleVelocities[i]
    
    // Kinetic energy = 1/2 * m * v^2
    const kineticEnergy = 0.5 * linearDensity * velocity * velocity
    
    // Potential energy = 1/2 * k * y^2
    const potentialEnergy = 0.5 * tension * y * y
    
    // Total energy
    const totalEnergy = kineticEnergy + potentialEnergy
    
    // Store energy values as points for visualization
    totalEnergyPoints.push([x, totalEnergy, 0])
    kineticEnergyPoints.push([x, kineticEnergy, 0])
    potentialEnergyPoints.push([x, potentialEnergy, 0])
  })

  // Energy flow visualization
  const energyFlowParticles = []
  const numEnergyParticles = 10
  for (let i = 0; i < numEnergyParticles; i++) {
    const baseX = -waveLength / 2 + ((waveSpeed * time) % (waveLength / numEnergyParticles))
    const x = baseX + i * (waveLength / numEnergyParticles)
    if (x < waveLength / 2) {
      energyFlowParticles.push(x)
    }
  }

  return (
    <group>
      {/* String visualization as a 3D tube */}
      <StringMesh points={wavePoints} thickness={stringThickness} color="#00BFFF" />

      {/* Fixed endpoints */}
      <mesh position={[-waveLength / 2, 0, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[waveLength / 2, 0, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Particles with velocity vectors */}
      {showParticles &&
        wavePoints.map((pos, index) => (
          <group key={index}>
            <mesh position={[pos[0], pos[1], pos[2]]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#FF9900" />
            </mesh>

            {/* Velocity vector */}
            <ArrowHelper
              dir={new Vector3(0, 1, 0)}
              origin={new Vector3(pos[0], pos[1], pos[2])}
              length={Math.abs(particleVelocities[index]) * 0.2}
              color={particleVelocities[index] > 0 ? "#00FF00" : "#FF0000"}
            />
          </group>
        ))}

      {/* Energy visualization */}
      <group position={[0, 0, 0]}>
        <Text position={[-waveLength / 2 - 1, -3, 0]} fontSize={0.4} color="white" anchorX="right">
          Energy
        </Text>

        {/* Total energy line */}
        <Line points={totalEnergyPoints} color="#FFFFFF" lineWidth={2} />
        <Text position={[waveLength / 2 + 0.5, -3 + totalEnergyPoints[totalEnergyPoints.length - 1][1], 0]} fontSize={0.35} color="#FFFFFF" anchorX="left">
          Total Energy
        </Text>

        {/* Kinetic energy line */}
        <Line points={kineticEnergyPoints} color="#FF0000" lineWidth={2} />
        <Text
          position={[waveLength / 2 + 0.5, -3 + kineticEnergyPoints[kineticEnergyPoints.length - 1][1], 0]}
          fontSize={0.35}
          color="#FF0000"
          anchorX="left"
        >
          Kinetic Energy
        </Text>

        {/* Potential energy line */}
        <Line points={potentialEnergyPoints} color="#00FF00" lineWidth={2} />
        <Text
          position={[waveLength / 2 + 0.5, -3 + potentialEnergyPoints[potentialEnergyPoints.length - 1][1], 0]}
          fontSize={0.35}
          color="#00FF00"
          anchorX="left"
        >
          Potential Energy
        </Text>
      </group>

      {/* Energy flow visualization */}
      {energyFlowParticles.map((x, index) => (
        <mesh key={`energy-${index}`} position={[x, -1.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Power and energy indicators */}
      <group position={[0, -5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.5} color="white" anchorX="center">
          Total Energy ∝ ρω²A² = {(totalEnergyPoints[totalEnergyPoints.length - 1][1] / 0.5).toFixed(2)} J/m
        </Text>
        <Text position={[0, -0.7, 0]} fontSize={0.5} color="white" anchorX="center">
          Power = ½ρω²A²v = {(0.5 * linearDensity * Math.pow(omega, 2) * Math.pow(amplitude, 2) * waveSpeed).toFixed(2)} W
        </Text>

        {/* Power flow arrow */}
        <ArrowHelper dir={new Vector3(1, 0, 0)} origin={new Vector3(-5, -1.5, 0)} length={3} color="#FFFF00" />
        <Text position={[-5 + 1.5, -2, 0]} fontSize={0.4} color="#FFFF00" anchorX="center">
          Energy Flow
        </Text>
      </group>

      {/* Title and explanation */}
      <Text position={[0, 3, 0]} fontSize={0.7} color="white" anchorX="center">
        Energy Transfer and Power in Waves
      </Text>
      <Text position={[0, 2.3, 0]} fontSize={0.5} color="white" anchorX="center">
        Energy oscillates between kinetic and potential forms
      </Text>
      <Text position={[0, 1.7, 0]} fontSize={0.4} color="white" anchorX="center">
        Total energy is constant and proportional to amplitude squared
      </Text>
    </group>
  )
}

function ImpedanceDemo({ 
  impedance1, 
  impedance2, 
  amplitude, 
  frequency, 
  time, 
  stringThickness, 
  showParticles 
}: { 
  impedance1: number;
  impedance2: number;
  amplitude: number;
  frequency: number;
  time: number;
  stringThickness: number;
  showParticles: boolean;
}) {
  const waveLength = 20
  const numPoints = 100
  const numParticles = 30
  const boundaryX = 0 // Position of the boundary between media

  // Angular frequency
  const omega = 2 * Math.PI * frequency

  // Calculate reflection and transmission coefficients
  const reflectionCoeff = (impedance1 - impedance2) / (impedance1 + impedance2)
  const transmissionCoeff = (2 * impedance1) / (impedance1 + impedance2)

  // Calculate reflected and transmitted amplitudes
  const reflectedAmplitude = amplitude * reflectionCoeff
  const transmittedAmplitude = amplitude * transmissionCoeff

  // Calculate wave speeds (inversely proportional to impedance for simplicity)
  const speed1 = 10 / impedance1
  const speed2 = 10 / impedance2

  // Calculate wavelengths
  const wavelength1 = speed1 / frequency
  const wavelength2 = speed2 / frequency

  // Wave numbers
  const k1 = (2 * Math.PI) / wavelength1
  const k2 = (2 * Math.PI) / wavelength2

  // Generate points for the string
  const fixedStringPoints: [number, number, number][] = []
  const incidentPoints: [number, number, number][] = []
  const reflectedPoints: [number, number, number][] = []
  const transmittedPoints: [number, number, number][] = []

  for (let i = 0; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength
    const t = time - Math.abs(x - boundaryX) / (x < boundaryX ? speed1 : speed2)
    let y = 0

    if (x < boundaryX) {
      // Incident wave
      y = amplitude * Math.sin(omega * t - (omega / speed1) * (x - boundaryX))
      incidentPoints.push([x, y, 0])
    } else {
      // Transmitted wave
      y = transmittedAmplitude * Math.sin(omega * t - (omega / speed2) * (x - boundaryX))
      transmittedPoints.push([x, y, 0])
    }

    // Reflected wave (only in first medium)
    if (x < boundaryX) {
      const reflectedY = reflectedAmplitude * Math.sin(omega * t + (omega / speed1) * (x - boundaryX))
      reflectedPoints.push([x, reflectedY, 0])
      y += reflectedY
    }

    fixedStringPoints.push([x, y, 0])
  }

  // Generate particles for visualization
  const particlePositions = []

  // Particles in medium 1
  for (let i = 0; i < numParticles / 2; i++) {
    const x = -waveLength / 2 + (i / (numParticles / 2)) * (waveLength / 2)

    // Superposition of incident and reflected waves
    const y = amplitude * Math.sin(k1 * x - omega * time) + reflectedAmplitude * Math.sin(k1 * x + omega * time)

    particlePositions.push({
      x: x,
      y: y,
      medium: 1,
    })
  }

  // Particles in medium 2
  for (let i = 0; i < numParticles / 2; i++) {
    const x = (i / (numParticles / 2)) * (waveLength / 2) + boundaryX

    // Transmitted wave
    const y = transmittedAmplitude * Math.sin(k2 * x - omega * time)

    particlePositions.push({
      x: x,
      y: y,
      medium: 2,
    })
  }

  // Calculate intensity (proportional to amplitude squared * impedance)
  const incidentIntensity = Math.pow(amplitude, 2) * impedance1
  const reflectedIntensity = Math.pow(reflectedAmplitude, 2) * impedance1
  const transmittedIntensity = Math.pow(transmittedAmplitude, 2) * impedance2

  // Calculate intensity transmission coefficient
  const intensityTransCoeff = transmittedIntensity / incidentIntensity

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
        dashed={true}
      />

      {/* Medium labels */}
      <Text position={[-waveLength / 4, waveLength / 8, 0]} fontSize={0.5} color="white" anchorX="center">
        Medium 1 (Z₁ = {impedance1.toFixed(1)})
      </Text>
      <Text position={[waveLength / 4, waveLength / 8, 0]} fontSize={0.5} color="white" anchorX="center">
        Medium 2 (Z₂ = {impedance2.toFixed(1)})
      </Text>

      {/* String visualization as a 3D tube */}
      <StringMesh points={fixedStringPoints} thickness={stringThickness} color="#FFFFFF" />

      {/* Fixed endpoints */}
      <mesh position={[-waveLength / 2, 0, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[waveLength / 2, 0, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Boundary indicator */}
      <mesh position={[boundaryX, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>

      {/* Wave visualization (for educational purposes) */}
      <Line points={incidentPoints} color="#00BFFF" lineWidth={1.5} opacity={0.7} />
      <Line points={reflectedPoints} color="#FF6B6B" lineWidth={1.5} opacity={0.7} />
      <Line points={transmittedPoints} color="#4CAF50" lineWidth={1.5} opacity={0.7} />

      {/* Particles */}
      {showParticles &&
        particlePositions.map((particle, index) => (
          <mesh key={index} position={[particle.x, particle.y, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color={particle.medium === 1 ? "#FF9900" : "#FFFF00"}
              emissive={particle.medium === 1 ? "#FF9900" : "#FFFF00"}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

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

      {/* Intensity and coefficient information */}
      <group position={[0, -4, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.5} color="white" anchorX="center">
          Reflection Coefficient: r = (Z₂-Z₁)/(Z₂+Z₁) = {reflectionCoeff.toFixed(2)}
        </Text>
        <Text position={[0, -0.7, 0]} fontSize={0.5} color="white" anchorX="center">
          Transmission Coefficient: t = 2Z₁/(Z₂+Z₁) = {transmissionCoeff.toFixed(2)}
        </Text>
        <Text position={[0, -1.4, 0]} fontSize={0.5} color="white" anchorX="center">
          Incident Intensity: {incidentIntensity.toFixed(2)} W/m²
        </Text>
        <Text position={[0, -2.1, 0]} fontSize={0.5} color="white" anchorX="center">
          Reflected Intensity: {reflectedIntensity.toFixed(2)} W/m² (
          {((reflectedIntensity / incidentIntensity) * 100).toFixed(0)}%)
        </Text>
        <Text position={[0, -2.8, 0]} fontSize={0.5} color="white" anchorX="center">
          Transmitted Intensity: {transmittedIntensity.toFixed(2)} W/m² (
          {((transmittedIntensity / incidentIntensity) * 100).toFixed(0)}%)
        </Text>
      </group>

      {/* Title and explanation */}
      <Text position={[0, 5, 0]} fontSize={0.7} color="white" anchorX="center">
        Wave Impedance and Intensity
      </Text>
      <Text position={[0, 4.3, 0]} fontSize={0.5} color="white" anchorX="center">
        When waves cross boundaries between media with different impedances:
      </Text>
      <Text position={[0, 3.7, 0]} fontSize={0.4} color="white" anchorX="center">
        • If Z₂ {">"} Z₁: Reflected wave is inverted (180° phase shift)
      </Text>
      <Text position={[0, 3.2, 0]} fontSize={0.4} color="white" anchorX="center">
        • If Z₂ {"<"} Z₁: Reflected wave is not inverted (0° phase shift)
      </Text>
      <Text position={[0, 2.7, 0]} fontSize={0.4} color="white" anchorX="center">
        • Maximum transmission occurs when impedances match (Z₁ = Z₂)
      </Text>
    </group>
  )
}

// Helper component for arrows
function ArrowHelper({ 
  dir, 
  origin,
  length, 
  color 
}: { 
  dir: Vector3; 
  origin: Vector3; 
  length: number; 
  color: string; 
}) {
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
