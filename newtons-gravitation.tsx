"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3 } from "three"

export default function NewtonsGravitation() {
  const [mass1, setMass1] = useState(5)
  const [mass2, setMass2] = useState(10)
  const [distance, setDistance] = useState(5)
  const [showForceVectors, setShowForceVectors] = useState(true)
  const [showFieldLines, setShowFieldLines] = useState(true)
  const [paused, setPaused] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [orbitDemo, setOrbitDemo] = useState(false)

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
        <h2 className="text-xl font-bold mb-4">Newton's Law of Universal Gravitation</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Mass 1: {mass1.toFixed(1)} units</label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={mass1}
              onChange={(e) => setMass1(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Mass 2: {mass2.toFixed(1)} units</label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={mass2}
              onChange={(e) => setMass2(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Distance: {distance.toFixed(1)} units</label>
            <input
              type="range"
              min="3"
              max="10"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(Number.parseFloat(e.target.value))}
              className="w-full"
              disabled={orbitDemo}
            />
          </div>
          <div className="flex space-x-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showForceVectors}
                onChange={() => setShowForceVectors(!showForceVectors)}
                className="mr-2"
              />
              Show Force Vectors
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFieldLines}
                onChange={() => setShowFieldLines(!showFieldLines)}
                className="mr-2"
              />
              Show Field Lines
            </label>
          </div>
          <div className="flex space-x-2">
            <label className="flex items-center">
              <input type="checkbox" checked={orbitDemo} onChange={() => setOrbitDemo(!orbitDemo)} className="mr-2" />
              Orbital Motion Demo
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
        <PerspectiveCamera makeDefault position={[0, 5, 15]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <GravitationScene
          mass1={mass1}
          mass2={mass2}
          distance={distance}
          showForceVectors={showForceVectors}
          showFieldLines={showFieldLines}
          paused={paused}
          orbitDemo={orbitDemo}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function GravitationScene({ mass1, mass2, distance, showForceVectors, showFieldLines, paused, orbitDemo }) {
  const timeRef = useRef(0)
  const [orbitAngle, setOrbitAngle] = useState(0)
  const [orbitDistance, setOrbitDistance] = useState(distance)

  // Calculate gravitational force
  // F = G * (m1 * m2) / r^2
  // Using G = 1 for simplicity
  const calculateForce = (m1, m2, r) => {
    return (m1 * m2) / (r * r)
  }

  const force = calculateForce(mass1, mass2, orbitDemo ? orbitDistance : distance)

  // Scale for visualization
  const forceScale = 0.5
  const scaledForce = force * forceScale

  // Calculate positions
  const pos1 = new Vector3(-distance / 2, 0, 0)
  const pos2 = new Vector3(distance / 2, 0, 0)

  // For orbital motion
  useFrame((state, delta) => {
    if (!paused && orbitDemo) {
      // Update time
      timeRef.current += delta

      // Calculate orbital period based on masses and initial distance
      // Using a simplified version of Kepler's third law
      const period = 2 * Math.PI * Math.sqrt(Math.pow(distance, 3) / (mass1 + mass2))

      // Update angle
      const newAngle = (timeRef.current / period) * 2 * Math.PI
      setOrbitAngle(newAngle)

      // Calculate new distance (can add eccentricity here for elliptical orbits)
      // For now, keeping it circular
      setOrbitDistance(distance)
    }
  })

  // Calculate orbital positions
  let position1 = pos1
  let position2 = pos2

  if (orbitDemo) {
    // For simplicity, fix mass1 at center and orbit mass2
    position1 = new Vector3(0, 0, 0)
    position2 = new Vector3(orbitDistance * Math.cos(orbitAngle), 0, orbitDistance * Math.sin(orbitAngle))
  }

  return (
    <group>
      {/* Coordinate System */}
      <CoordinateSystem />

      {/* Masses */}
      <Mass position={position1} mass={mass1} color="#4169E1" label="Mass 1" />
      <Mass position={position2} mass={mass2} color="#E14169" label="Mass 2" />

      {/* Force Vectors */}
      {showForceVectors && <ForceVectors position1={position1} position2={position2} force={scaledForce} />}

      {/* Gravitational Field Lines */}
      {showFieldLines && <FieldLines position1={position1} position2={position2} mass1={mass1} mass2={mass2} />}

      {/* Formula and Explanation */}
      <Formula mass1={mass1} mass2={mass2} distance={orbitDemo ? orbitDistance : distance} force={force} />
    </group>
  )
}

function CoordinateSystem() {
  const axisLength = 10

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
      <Text position={[axisLength + 0.5, 0, 0]} fontSize={0.4} color="red">
        X
      </Text>

      {/* Y-axis (green) */}
      <Line
        points={[
          [0, -axisLength, 0],
          [0, axisLength, 0],
        ]}
        color="green"
        lineWidth={1}
        opacity={0.5}
      />
      <Text position={[0, axisLength + 0.5, 0]} fontSize={0.4} color="green">
        Y
      </Text>

      {/* Z-axis (blue) */}
      <Line
        points={[
          [0, 0, -axisLength],
          [0, 0, axisLength],
        ]}
        color="blue"
        lineWidth={1}
        opacity={0.5}
      />
      <Text position={[0, 0, axisLength + 0.5]} fontSize={0.4} color="blue">
        Z
      </Text>
    </group>
  )
}

function Mass({ position, mass, color, label }) {
  // Scale radius based on mass
  const radius = 0.3 + mass * 0.1

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, radius + 0.5, 0]} fontSize={0.4} color="white">
        {label}
      </Text>
      <Text position={[0, radius + 0.1, 0]} fontSize={0.3} color="white">
        {mass.toFixed(1)} units
      </Text>
    </group>
  )
}

function ForceVectors({ position1, position2, force }) {
  // Calculate direction vectors
  const dir1to2 = new Vector3().subVectors(position2, position1).normalize()
  const dir2to1 = new Vector3().subVectors(position1, position2).normalize()

  return (
    <group>
      {/* Force from mass1 to mass2 */}
      <ArrowHelper dir={dir1to2} origin={position1} length={force} color="#ffff00" />
      <Text
        position={[
          position1.x + dir1to2.x * force * 0.5,
          position1.y + dir1to2.y * force * 0.5 + 0.4,
          position1.z + dir1to2.z * force * 0.5,
        ]}
        fontSize={0.3}
        color="#ffff00"
      >
        F₁₂
      </Text>

      {/* Force from mass2 to mass1 */}
      <ArrowHelper dir={dir2to1} origin={position2} length={force} color="#ffff00" />
      <Text
        position={[
          position2.x + dir2to1.x * force * 0.5,
          position2.y + dir2to1.y * force * 0.5 + 0.4,
          position2.z + dir2to1.z * force * 0.5,
        ]}
        fontSize={0.3}
        color="#ffff00"
      >
        F₂₁
      </Text>
    </group>
  )
}

function FieldLines({ position1, position2, mass1, mass2 }) {
  const numLines = 16
  const lineLength = 1.5
  const fieldPoints1 = []
  const fieldPoints2 = []

  // Generate field lines around mass1
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2
    const x = Math.cos(angle)
    const z = Math.sin(angle)

    // Start point (on the sphere)
    const radius1 = 0.3 + mass1 * 0.1
    const start1 = [position1.x + x * radius1, position1.y, position1.z + z * radius1]

    // End point (extending outward)
    const end1 = [
      position1.x + x * (radius1 + (lineLength * mass1) / 5),
      position1.y,
      position1.z + z * (radius1 + (lineLength * mass1) / 5),
    ]

    fieldPoints1.push([start1, end1])
  }

  // Generate field lines around mass2
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2
    const x = Math.cos(angle)
    const z = Math.sin(angle)

    // Start point (on the sphere)
    const radius2 = 0.3 + mass2 * 0.1
    const start2 = [position2.x + x * radius2, position2.y, position2.z + z * radius2]

    // End point (extending outward)
    const end2 = [
      position2.x + x * (radius2 + (lineLength * mass2) / 5),
      position2.y,
      position2.z + z * (radius2 + (lineLength * mass2) / 5),
    ]

    fieldPoints2.push([start2, end2])
  }

  return (
    <group>
      {/* Field lines for mass1 */}
      {fieldPoints1.map((points, i) => (
        <Line key={`field1-${i}`} points={points} color="#4169E1" lineWidth={1} opacity={0.5} />
      ))}

      {/* Field lines for mass2 */}
      {fieldPoints2.map((points, i) => (
        <Line key={`field2-${i}`} points={points} color="#E14169" lineWidth={1} opacity={0.5} />
      ))}
    </group>
  )
}

function Formula({ mass1, mass2, distance, force }) {
  return (
    <group position={[0, -5, 0]}>
      <Text position={[0, 0, 0]} fontSize={0.5} color="white">
        Newton's Law of Universal Gravitation
      </Text>
      <Text position={[0, -0.7, 0]} fontSize={0.4} color="white">
        F = G × (m₁ × m₂) / r²
      </Text>
      <Text position={[0, -1.4, 0]} fontSize={0.4} color="white">
        F = 1 × ({mass1.toFixed(1)} × {mass2.toFixed(1)}) / {distance.toFixed(2)}² = {force.toFixed(2)} units
      </Text>
      <Text position={[0, -2.1, 0]} fontSize={0.35} color="#aaaaaa">
        Where G is the gravitational constant (set to 1 for simplicity)
      </Text>
      <Text position={[0, -2.6, 0]} fontSize={0.35} color="#aaaaaa">
        m₁ and m₂ are the masses, and r is the distance between them
      </Text>
    </group>
  )
}

// Helper component for arrows
function ArrowHelper({ dir, origin, length, color }) {
  const normalizedDir = new Vector3().copy(dir).normalize()
  const end = new Vector3().copy(origin).add(normalizedDir.multiplyScalar(length))

  // Calculate arrow head points
  const headLength = Math.min(length * 0.2, 0.5)
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
