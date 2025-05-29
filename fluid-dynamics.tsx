"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3 } from "three"

interface Particle {
  x: number;
  y: number;
  speed: number;
  baseY?: number;
  phase?: number;
}

export default function FluidDynamics() {
  const [selectedDemo, setSelectedDemo] = useState("bernoulli")
  const [flowRate, setFlowRate] = useState(5)
  const [viscosity, setViscosity] = useState(1)
  const [reynoldsNumber, setReynoldsNumber] = useState(1000)
  const [showVelocityVectors, setShowVelocityVectors] = useState(true)
  const [showPressureValues, setShowPressureValues] = useState(true)
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
        <h2 className="text-xl font-bold mb-4">Fluid Dynamics</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Demonstration:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDemo("bernoulli")}
                className={`px-2 py-1 rounded ${selectedDemo === "bernoulli" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Bernoulli's Principle
              </button>
              <button
                onClick={() => setSelectedDemo("continuity")}
                className={`px-2 py-1 rounded ${selectedDemo === "continuity" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Continuity Equation
              </button>
              <button
                onClick={() => setSelectedDemo("flowTypes")}
                className={`px-2 py-1 rounded ${selectedDemo === "flowTypes" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Flow Types
              </button>
              <button
                onClick={() => setSelectedDemo("viscosity")}
                className={`px-2 py-1 rounded ${selectedDemo === "viscosity" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Viscosity & Drag
              </button>
            </div>
          </div>

          {selectedDemo === "bernoulli" && (
            <>
              <div>
                <label className="block mb-1">Flow Rate: {flowRate.toFixed(1)} m³/s</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showVelocityVectors}
                    onChange={() => setShowVelocityVectors(!showVelocityVectors)}
                    className="mr-2"
                  />
                  Show Velocity Vectors
                </label>
              </div>
              <div className="flex space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPressureValues}
                    onChange={() => setShowPressureValues(!showPressureValues)}
                    className="mr-2"
                  />
                  Show Pressure Values
                </label>
              </div>
            </>
          )}

          {selectedDemo === "continuity" && (
            <>
              <div>
                <label className="block mb-1">Flow Rate: {flowRate.toFixed(1)} m³/s</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showVelocityVectors}
                    onChange={() => setShowVelocityVectors(!showVelocityVectors)}
                    className="mr-2"
                  />
                  Show Velocity Vectors
                </label>
              </div>
            </>
          )}

          {selectedDemo === "flowTypes" && (
            <>
              <div>
                <label className="block mb-1">Reynolds Number: {reynoldsNumber}</label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={reynoldsNumber}
                  onChange={(e) => setReynoldsNumber(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Flow Rate: {flowRate.toFixed(1)} m³/s</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          {selectedDemo === "viscosity" && (
            <>
              <div>
                <label className="block mb-1">Viscosity: {viscosity.toFixed(1)} Pa·s</label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={viscosity}
                  onChange={(e) => setViscosity(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Flow Rate: {flowRate.toFixed(1)} m³/s</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

        {selectedDemo === "bernoulli" && (
          <BernoulliDemo
            flowRate={flowRate}
            showVelocityVectors={showVelocityVectors}
            showPressureValues={showPressureValues}
          />
        )}

        {selectedDemo === "continuity" && (
          <ContinuityDemo flowRate={flowRate} showVelocityVectors={showVelocityVectors} />
        )}

        {selectedDemo === "flowTypes" && <FlowTypesDemo reynoldsNumber={reynoldsNumber} flowRate={flowRate} />}

        {selectedDemo === "viscosity" && <ViscosityDemo viscosity={viscosity} flowRate={flowRate} />}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function BernoulliDemo({ flowRate, showVelocityVectors, showPressureValues }: { flowRate: number; showVelocityVectors: boolean; showPressureValues: boolean }) {
  const pipeLength = 16
  const wideRadius = 2
  const narrowRadius = 1
  const transitionLength = 2

  // Calculate velocities and pressures based on Bernoulli's principle
  const wideArea = Math.PI * wideRadius * wideRadius
  const narrowArea = Math.PI * narrowRadius * narrowRadius

  const wideVelocity = flowRate / wideArea
  const narrowVelocity = flowRate / narrowArea

  // Simplified pressure calculation (P1 + 0.5*ρ*v1² = P2 + 0.5*ρ*v2²)
  // Using ρ = 1000 kg/m³ (water density)
  const density = 1000
  const referencePressure = 101325 // atmospheric pressure in Pa
  const narrowPressure =
    referencePressure - 0.5 * density * (narrowVelocity * narrowVelocity - wideVelocity * wideVelocity)

  // Generate particles for flow visualization
  const particlesRef = useRef<Particle[]>([])
  const [_, forceUpdate] = useState(0)

  // Initialize particles if empty
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push({
        x: -pipeLength / 2 + Math.random() * pipeLength,
        y: (Math.random() - 0.5) * wideRadius * 1.8,
        speed: 0,
      })
    }
  }

  // Update particle positions
  useFrame((state, delta) => {
    particlesRef.current.forEach((particle) => {
      // Determine which section the particle is in
      if (particle.x < -transitionLength) {
        // Wide section
        particle.speed = wideVelocity

        // Check if particle is outside pipe radius
        const maxRadius = wideRadius * 0.9
        if (Math.abs(particle.y) > maxRadius) {
          particle.y = Math.sign(particle.y) * maxRadius
        }
      } else if (particle.x > transitionLength) {
        // Narrow section
        particle.speed = narrowVelocity

        // Check if particle is outside pipe radius
        const maxRadius = narrowRadius * 0.9
        if (Math.abs(particle.y) > maxRadius) {
          particle.y = Math.sign(particle.y) * maxRadius
        }
      } else {
        // Transition section - interpolate speed
        const t = (particle.x + transitionLength) / (2 * transitionLength)
        particle.speed = wideVelocity * (1 - t) + narrowVelocity * t

        // Interpolate radius
        const maxRadius = (wideRadius * (1 - t) + narrowRadius * t) * 0.9
        if (Math.abs(particle.y) > maxRadius) {
          particle.y = Math.sign(particle.y) * maxRadius
        }
      }

      // Update position
      particle.x += particle.speed * delta

      // Reset if out of bounds
      if (particle.x > pipeLength / 2) {
        particle.x = -pipeLength / 2
        particle.y = (Math.random() - 0.5) * wideRadius * 1.8
      }
    })

    forceUpdate((prev) => (prev + 1) % 1000) // Force re-render
  })

  // Generate velocity vectors
  const velocityVectors = []
  if (showVelocityVectors) {
    const numVectors = 8
    const spacing = pipeLength / numVectors

    for (let i = 0; i < numVectors; i++) {
      const x = -pipeLength / 2 + i * spacing
      const y = 0
      let velocity
      let maxRadius

      if (x < -transitionLength) {
        // Wide section
        velocity = wideVelocity
        maxRadius = wideRadius * 0.5
      } else if (x > transitionLength) {
        // Narrow section
        velocity = narrowVelocity
        maxRadius = narrowRadius * 0.5
      } else {
        // Transition section - interpolate
        const t = (x + transitionLength) / (2 * transitionLength)
        velocity = wideVelocity * (1 - t) + narrowVelocity * t
        maxRadius = wideRadius * (1 - t) + narrowRadius * t * 0.5
      }

      velocityVectors.push({
        position: [x, y, 0],
        velocity: velocity,
        length: velocity * 0.3,
      })
    }
  }

  return (
    <group>
      {/* Pipe outline */}
      <PipeShape
        pipeLength={pipeLength}
        wideRadius={wideRadius}
        narrowRadius={narrowRadius}
        transitionLength={transitionLength}
      />

      {/* Particles */}
      {particlesRef.current.map((particle, index) => (
        <mesh key={index} position={[particle.x, particle.y, 0.1]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#00BFFF" />
        </mesh>
      ))}

      {/* Velocity vectors */}
      {velocityVectors.map((vector, index) => (
        <group key={index}>
          <ArrowHelper
            dir={new Vector3(1, 0, 0)}
            origin={new Vector3(...vector.position)}
            length={vector.length}
            color="#FFFF00"
          />
          {index % 2 === 0 && (
            <Text
              position={[vector.position[0], vector.position[1] + 0.5, vector.position[2]]}
              fontSize={0.3}
              color="#FFFF00"
            >
              v = {vector.velocity.toFixed(1)} m/s
            </Text>
          )}
        </group>
      ))}

      {/* Pressure values */}
      {showPressureValues && (
        <>
          <Text position={[-pipeLength / 3, -wideRadius - 1, 0]} fontSize={0.4} color="#FF6B6B">
            P₁ = {referencePressure.toFixed(0)} Pa
          </Text>
          <Text position={[pipeLength / 3, -narrowRadius - 1, 0]} fontSize={0.4} color="#FF6B6B">
            P₂ = {narrowPressure.toFixed(0)} Pa
          </Text>
          <Text position={[0, -wideRadius - 2, 0]} fontSize={0.4} color="#FF6B6B">
            ΔP = {(referencePressure - narrowPressure).toFixed(0)} Pa
          </Text>
        </>
      )}

      {/* Title and explanation */}
      <Text position={[0, wideRadius + 2, 0]} fontSize={0.7} color="white" anchorX="center">
        Bernoulli's Principle
      </Text>
      <Text position={[0, wideRadius + 1, 0]} fontSize={0.5} color="white" anchorX="center">
        As fluid velocity increases, pressure decreases
      </Text>
      <Text position={[0, -wideRadius - 3, 0]} fontSize={0.5} color="white" anchorX="center">
        P₁ + ½ρv₁² = P₂ + ½ρv₂²
      </Text>
      <Text position={[0, -wideRadius - 4, 0]} fontSize={0.5} color="white" anchorX="center">
        Conservation of energy in fluid flow
      </Text>
    </group>
  )
}

function ContinuityDemo({ flowRate, showVelocityVectors }: { flowRate: number; showVelocityVectors: boolean }) {
  const pipeLength = 16
  const section1Radius = 2
  const section2Radius = 1
  const section3Radius = 0.7
  const sectionLength = pipeLength / 3

  // Calculate velocities based on continuity equation (A₁v₁ = A₂v₂)
  const area1 = Math.PI * section1Radius * section1Radius
  const area2 = Math.PI * section2Radius * section2Radius
  const area3 = Math.PI * section3Radius * section3Radius

  const velocity1 = flowRate / area1
  const velocity2 = flowRate / area2
  const velocity3 = flowRate / area3

  // Generate particles for flow visualization
  const particlesRef = useRef<Particle[]>([])
  const [_, forceUpdate] = useState(0)

  // Initialize particles if empty
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push({
        x: -pipeLength / 2 + Math.random() * pipeLength,
        y: (Math.random() - 0.5) * section1Radius * 1.8,
        speed: 0,
      })
    }
  }

  // Update particle positions
  useFrame((state, delta) => {
    particlesRef.current.forEach((particle) => {
      // Determine which section the particle is in
      if (particle.x < -sectionLength / 2) {
        // Section 1
        particle.speed = velocity1

        // Check if particle is outside pipe radius
        const maxRadius = section1Radius * 0.9
        if (Math.abs(particle.y) > maxRadius) {
          particle.y = Math.sign(particle.y) * maxRadius
        }
      } else if (particle.x < sectionLength / 2) {
        // Section 2
        particle.speed = velocity2

        // Check if particle is outside pipe radius
        const maxRadius = section2Radius * 0.9
        if (Math.abs(particle.y) > maxRadius) {
          particle.y = Math.sign(particle.y) * maxRadius
        }
      } else {
        // Section 3
        particle.speed = velocity3

        // Check if particle is outside pipe radius
        const maxRadius = section3Radius * 0.9
        if (Math.abs(particle.y) > maxRadius) {
          particle.y = Math.sign(particle.y) * maxRadius
        }
      }

      // Update position
      particle.x += particle.speed * delta

      // Reset if out of bounds
      if (particle.x > pipeLength / 2) {
        particle.x = -pipeLength / 2
        particle.y = (Math.random() - 0.5) * section1Radius * 1.8
      }
    })

    forceUpdate((prev) => (prev + 1) % 1000) // Force re-render
  })

  // Generate velocity vectors
  const velocityVectors = []
  if (showVelocityVectors) {
    // Section 1
    velocityVectors.push({
      position: [-sectionLength, 0, 0],
      velocity: velocity1,
      length: velocity1 * 0.2,
    })

    // Section 2
    velocityVectors.push({
      position: [0, 0, 0],
      velocity: velocity2,
      length: velocity2 * 0.2,
    })

    // Section 3
    velocityVectors.push({
      position: [sectionLength, 0, 0],
      velocity: velocity3,
      length: velocity3 * 0.2,
    })
  }

  return (
    <group>
      {/* Pipe sections */}
      <group>
        {/* Section 1 */}
        <mesh position={[-sectionLength, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[section1Radius, section1Radius, sectionLength, 32, 1, true]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.5} />
        </mesh>

        {/* Section 2 */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[section2Radius, section2Radius, sectionLength, 32, 1, true]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.5} />
        </mesh>

        {/* Section 3 */}
        <mesh position={[sectionLength, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[section3Radius, section3Radius, sectionLength, 32, 1, true]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.5} />
        </mesh>

        {/* Transition 1-2 */}
        <mesh position={[-sectionLength / 2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[section1Radius, section2Radius, 0.5, 32, 1, true]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.5} />
        </mesh>

        {/* Transition 2-3 */}
        <mesh position={[sectionLength / 2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[section2Radius, section3Radius, 0.5, 32, 1, true]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Particles */}
      {particlesRef.current.map((particle, index) => (
        <mesh key={index} position={[particle.x, particle.y, 0.1]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#00BFFF" />
        </mesh>
      ))}

      {/* Velocity vectors */}
      {velocityVectors.map((vector, index) => (
        <group key={index}>
          <ArrowHelper
            dir={new Vector3(1, 0, 0)}
            origin={new Vector3(...vector.position)}
            length={vector.length}
            color="#FFFF00"
          />
          <Text
            position={[vector.position[0], vector.position[1] + 0.5, vector.position[2]]}
            fontSize={0.3}
            color="#FFFF00"
          >
            v = {vector.velocity.toFixed(1)} m/s
          </Text>
        </group>
      ))}

      {/* Area and flow rate labels */}
      <Text position={[-sectionLength, -section1Radius - 0.5, 0]} fontSize={0.4} color="#4CAF50">
        A₁ = {area1.toFixed(1)} m²
      </Text>
      <Text position={[0, -section2Radius - 0.5, 0]} fontSize={0.4} color="#4CAF50">
        A₂ = {area2.toFixed(1)} m²
      </Text>
      <Text position={[sectionLength, -section3Radius - 0.5, 0]} fontSize={0.4} color="#4CAF50">
        A₃ = {area3.toFixed(1)} m²
      </Text>

      {/* Title and explanation */}
      <Text position={[0, section1Radius + 2, 0]} fontSize={0.7} color="white" anchorX="center">
        Continuity Equation
      </Text>
      <Text position={[0, section1Radius + 1, 0]} fontSize={0.5} color="white" anchorX="center">
        Flow rate is constant throughout the pipe
      </Text>
      <Text position={[0, -section1Radius - 2, 0]} fontSize={0.5} color="white" anchorX="center">
        A₁v₁ = A₂v₂ = A₃v₃ = {flowRate.toFixed(1)} m³/s
      </Text>
      <Text position={[0, -section1Radius - 3, 0]} fontSize={0.5} color="white" anchorX="center">
        Velocity increases as cross-sectional area decreases
      </Text>
    </group>
  )
}

function FlowTypesDemo({ reynoldsNumber, flowRate }: { reynoldsNumber: number; flowRate: number }) {
  const pipeLength = 16
  const pipeRadius = 2

  // Determine flow type based on Reynolds number
  const flowType = reynoldsNumber < 2000 ? "laminar" : reynoldsNumber < 4000 ? "transitional" : "turbulent"

  // Generate particles for flow visualization
  const particlesRef = useRef<Particle[]>([])
  const timeRef = useRef(0)
  const [_, forceUpdate] = useState(0)

  // Initialize particles if empty
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < 100; i++) {
      particlesRef.current.push({
        x: -pipeLength / 2 + Math.random() * pipeLength,
        y: (Math.random() - 0.5) * pipeRadius * 1.8,
        baseY: 0,
        speed: 0,
        phase: Math.random() * Math.PI * 2,
      })
    }
  }

  // Update particle positions
  useFrame((state, delta) => {
    timeRef.current += delta

    particlesRef.current.forEach((particle) => {
      // Base speed depends on flow rate and position in pipe (parabolic profile for laminar flow)
      const distFromCenter = Math.abs(particle.y) / pipeRadius
      let baseSpeed

      if (flowType === "laminar") {
        // Parabolic velocity profile for laminar flow
        baseSpeed = flowRate * (1 - distFromCenter * distFromCenter) * 0.5
      } else {
        // More uniform velocity profile for turbulent flow
        baseSpeed = flowRate * Math.pow(1 - distFromCenter, 1 / 6) * 0.3
      }

      // Add fluctuations based on flow type
      if (flowType === "laminar") {
        // Minimal fluctuations
        particle.speed = baseSpeed
      } else if (flowType === "transitional") {
        // Moderate fluctuations
        particle.speed = baseSpeed * (1 + 0.2 * Math.sin(timeRef.current * 5 + (particle.phase ?? 0)))
        particle.y = (particle.baseY ?? 0) + 0.2 * Math.sin(timeRef.current * 3 + (particle.phase ?? 0))
      } else {
        // Strong fluctuations for turbulent flow
        particle.speed = baseSpeed * (1 + 0.4 * Math.sin(timeRef.current * 10 + (particle.phase ?? 0)))
        particle.y = (particle.baseY ?? 0) + 0.5 * Math.sin(timeRef.current * 6 + (particle.phase ?? 0)) * Math.cos(timeRef.current * 4 + (particle.phase ?? 0) * 2)
      }

      // Update position
      particle.x += particle.speed * delta

      // Reset if out of bounds
      if (particle.x > pipeLength / 2) {
        particle.x = -pipeLength / 2
        particle.baseY = (Math.random() - 0.5) * pipeRadius * 1.8
        particle.y = particle.baseY
        particle.phase = Math.random() * Math.PI * 2
      }

      // Keep particles within pipe
      const maxRadius = pipeRadius * 0.9
      if (Math.abs(particle.y) > maxRadius) {
        particle.y = Math.sign(particle.y) * maxRadius
        particle.baseY = particle.y
      }
    })

    forceUpdate((prev) => (prev + 1) % 1000) // Force re-render
  })

  // Generate velocity profile
  const velocityProfile = []
  const numPoints = 20

  for (let i = 0; i < numPoints; i++) {
    const y = -pipeRadius + (i / (numPoints - 1)) * 2 * pipeRadius
    const distFromCenter = Math.abs(y) / pipeRadius
    let velocity

    if (flowType === "laminar") {
      // Parabolic velocity profile for laminar flow
      velocity = flowRate * (1 - distFromCenter * distFromCenter) * 0.5
    } else {
      // More uniform velocity profile for turbulent flow
      velocity = flowRate * Math.pow(1 - distFromCenter, 1 / 6) * 0.3
    }

    velocityProfile.push([velocity, y])
  }

  return (
    <group>
      {/* Pipe outline */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[pipeLength, pipeRadius * 2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Pipe walls */}
      <Line
        points={[
          [-pipeLength / 2, -pipeRadius, 0],
          [pipeLength / 2, -pipeRadius, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
      />
      <Line
        points={[
          [-pipeLength / 2, pipeRadius, 0],
          [pipeLength / 2, pipeRadius, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
      />

      {/* Particles */}
      {particlesRef.current.map((particle, index) => (
        <mesh key={index} position={[particle.x, particle.y, 0.1]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={flowType === "laminar" ? "#00BFFF" : flowType === "transitional" ? "#FFFF00" : "#FF4500"}
          />
        </mesh>
      ))}

      {/* Velocity profile */}
      <group position={[-pipeLength / 3, 0, 0.1]}>
        <Line points={velocityProfile.map((point) => [point[0], point[1], 0])} color="#4CAF50" lineWidth={2} />
        <Line
          points={[
            [0, -pipeRadius, 0],
            [0, pipeRadius, 0],
          ]}
          color="#FFFFFF"
          lineWidth={1}
          dashed={true}
        />
        <Text position={[1, pipeRadius + 0.5, 0]} fontSize={0.4} color="#4CAF50">
          Velocity Profile
        </Text>
      </group>

      {/* Flow type indicator */}
      <Text
        position={[0, -pipeRadius - 1, 0]}
        fontSize={0.6}
        color={flowType === "laminar" ? "#00BFFF" : flowType === "transitional" ? "#FFFF00" : "#FF4500"}
      >
        {flowType === "laminar" ? "Laminar Flow" : flowType === "transitional" ? "Transitional Flow" : "Turbulent Flow"}
      </Text>

      {/* Title and explanation */}
      <Text position={[0, pipeRadius + 2, 0]} fontSize={0.7} color="white" anchorX="center">
        Flow Types
      </Text>
      <Text position={[0, pipeRadius + 1, 0]} fontSize={0.5} color="white" anchorX="center">
        Reynolds Number: {reynoldsNumber}
      </Text>
      <Text position={[0, -pipeRadius - 2, 0]} fontSize={0.5} color="white" anchorX="center">
        Re {"<"} 2000: Laminar Flow | 2000 {"<"} Re {"<"} 4000: Transitional | Re {">"} 4000: Turbulent
      </Text>
      <Text position={[0, -pipeRadius - 3, 0]} fontSize={0.5} color="white" anchorX="center">
        Re = ρvD/μ (ρ: density, v: velocity, D: diameter, μ: viscosity)
      </Text>
    </group>
  )
}

function ViscosityDemo({ viscosity, flowRate }: { viscosity: number; flowRate: number }) {
  const channelLength = 16
  const channelHeight = 6
  const objectRadius = 0.8

  // Calculate drag force based on viscosity and flow rate
  // Using simplified Stokes' law: F = 6πμrv
  const dragCoefficient = 6 * Math.PI * viscosity * objectRadius
  const velocity = flowRate / (channelHeight * 2) // Simplified average velocity
  const dragForce = dragCoefficient * velocity

  // Calculate velocity profile based on viscosity
  // Using simplified Poiseuille flow profile
  const velocityProfile = []
  const numPoints = 20
  const maxVelocity = flowRate / ((channelHeight * 2) / 3) // Adjusted for parabolic profile

  for (let i = 0; i < numPoints; i++) {
    const y = -channelHeight / 2 + (i / (numPoints - 1)) * channelHeight
    const normalizedY = y / (channelHeight / 2) // -1 to 1
    const velocity = maxVelocity * (1 - normalizedY * normalizedY)
    velocityProfile.push([velocity, y])
  }

  // Generate particles for flow visualization
  const particlesRef = useRef<Particle[]>([])
  const [_, forceUpdate] = useState(0)

  // Initialize particles if empty
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < 100; i++) {
      particlesRef.current.push({
        x: -channelLength / 2 + Math.random() * channelLength,
        y: (Math.random() - 0.5) * channelHeight * 0.9,
        speed: 0,
      })
    }
  }

  // Object position
  const objectPosition = [0, 0, 0]

  // Update particle positions
  useFrame((state, delta) => {
    particlesRef.current.forEach((particle) => {
      // Calculate distance from object
      const dx = particle.x - objectPosition[0]
      const dy = particle.y - objectPosition[1]
      const distSq = dx * dx + dy * dy

      // Calculate velocity based on position in channel
      const normalizedY = particle.y / (channelHeight / 2) // -1 to 1
      let particleVelocity = maxVelocity * (1 - normalizedY * normalizedY)

      // Slow down particles near the object
      if (distSq < objectRadius * objectRadius * 9) {
        const dist = Math.sqrt(distSq)
        const slowdownFactor = Math.min(dist / (objectRadius * 3), 1)
        particleVelocity *= slowdownFactor
      }

      // Adjust velocity based on viscosity
      particleVelocity *= 1 / (viscosity * 0.5 + 0.5)

      particle.speed = particleVelocity

      // Update position
      particle.x += particle.speed * delta

      // Reset if out of bounds
      if (particle.x > channelLength / 2) {
        particle.x = -channelLength / 2
        particle.y = (Math.random() - 0.5) * channelHeight * 0.9
      }

      // Avoid collision with object
      const newDx = particle.x - objectPosition[0]
      const newDy = particle.y - objectPosition[1]
      const newDistSq = newDx * newDx + newDy * newDy

      if (newDistSq < objectRadius * objectRadius * 1.2) {
        // Move particle away from object
        const newDist = Math.sqrt(newDistSq)
        const overlapDist = objectRadius * 1.1 - newDist

        if (overlapDist > 0) {
          particle.x += (newDx / newDist) * overlapDist
          particle.y += (newDy / newDist) * overlapDist
        }
      }
    })

    forceUpdate((prev) => (prev + 1) % 1000) // Force re-render
  })

  return (
    <group>
      {/* Channel */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[channelLength, channelHeight]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Channel walls */}
      <Line
        points={[
          [-channelLength / 2, -channelHeight / 2, 0],
          [channelLength / 2, -channelHeight / 2, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
      />
      <Line
        points={[
          [-channelLength / 2, channelHeight / 2, 0],
          [channelLength / 2, channelHeight / 2, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
      />

      {/* Object */}
      <mesh position={objectPosition as [number, number, number]}>
        <sphereGeometry args={[objectRadius, 32, 32]} />
        <meshStandardMaterial color="#FF4500" />
      </mesh>

      {/* Drag force arrow */}
      <ArrowHelper
        dir={new Vector3(1, 0, 0)}
        origin={new Vector3(...objectPosition)}
        length={Math.min(dragForce * 0.1, 3)}
        color="#FF0000"
      />
      <Text position={[objectPosition[0] + 1.5, objectPosition[1] + 0.5, 0]} fontSize={0.4} color="#FF0000">
        Drag Force: {dragForce.toFixed(1)} N
      </Text>

      {/* Particles */}
      {particlesRef.current.map((particle, index) => (
        <mesh key={index} position={[particle.x, particle.y, 0.1]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#00BFFF" />
        </mesh>
      ))}

      {/* Velocity profile */}
      <group position={[-channelLength / 3, 0, 0.1]}>
        <Line points={velocityProfile.map((point) => [point[0], point[1], 0])} color="#4CAF50" lineWidth={2} />
        <Line
          points={[
            [0, -channelHeight / 2, 0],
            [0, channelHeight / 2, 0],
          ]}
          color="#FFFFFF"
          lineWidth={1}
          dashed={true}
        />
        <Text position={[1, channelHeight / 2 + 0.5, 0]} fontSize={0.4} color="#4CAF50">
          Velocity Profile
        </Text>
      </group>

      {/* Title and explanation */}
      <Text position={[0, channelHeight / 2 + 2, 0]} fontSize={0.7} color="white" anchorX="center">
        Viscosity and Drag
      </Text>
      <Text position={[0, channelHeight / 2 + 1, 0]} fontSize={0.5} color="white" anchorX="center">
        Viscosity: {viscosity.toFixed(1)} Pa·s
      </Text>
      <Text position={[0, -channelHeight / 2 - 1, 0]} fontSize={0.5} color="white" anchorX="center">
        Drag Force = 6πμrv (Stokes' Law)
      </Text>
      <Text position={[0, -channelHeight / 2 - 2, 0]} fontSize={0.5} color="white" anchorX="center">
        Higher viscosity → Slower flow and greater drag
      </Text>
    </group>
  )
}

function PipeShape({ pipeLength, wideRadius, narrowRadius, transitionLength }: { pipeLength: number; wideRadius: number; narrowRadius: number; transitionLength: number }) {
  // Generate points for the pipe outline
  const numPoints = 50
  const topPoints = []
  const bottomPoints = []

  for (let i = 0; i <= numPoints; i++) {
    const x = -pipeLength / 2 + (i / numPoints) * pipeLength
    let radius

    if (x < -transitionLength) {
      // Wide section
      radius = wideRadius
    } else if (x > transitionLength) {
      // Narrow section
      radius = narrowRadius
    } else {
      // Transition section - interpolate
      const t = (x + transitionLength) / (2 * transitionLength)
      radius = wideRadius * (1 - t) + narrowRadius * t
    }

    topPoints.push([x, radius, 0] as [number, number, number])
    bottomPoints.push([x, -radius, 0] as [number, number, number])
  }

  // Combine points for complete outline
  const outlinePoints = [...topPoints, ...bottomPoints.reverse(), topPoints[0]]

  return (
    <group>
      {/* Pipe background */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[pipeLength, wideRadius * 2.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Pipe outline */}
      <Line points={outlinePoints} color="#FFFFFF" lineWidth={2} />
    </group>
  )
}

// Helper component for arrows
function ArrowHelper({ dir, origin, length, color }: { dir: Vector3; origin: Vector3; length: number; color: string }) {
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
