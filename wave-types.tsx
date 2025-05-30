"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3 } from "three"

interface Particle {
  restX: number;
  x: number;
  y: number;
  z: number;
  displacement: number;
}

export default function WaveTypes() {
  const [waveType, setWaveType] = useState("transverse")
  const [amplitude, setAmplitude] = useState(1)
  const [frequency, setFrequency] = useState(0.5)
  const [wavelength, setWavelength] = useState(4)
  const [damping, setDamping] = useState(0)
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
        <h2 className="text-xl font-bold mb-4">Types of Waves</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Wave Type:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setWaveType("transverse")}
                className={`px-2 py-1 rounded ${waveType === "transverse" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Transverse
              </button>
              <button
                onClick={() => setWaveType("longitudinal")}
                className={`px-2 py-1 rounded ${waveType === "longitudinal" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Longitudinal
              </button>
              <button
                onClick={() => setWaveType("surface")}
                className={`px-2 py-1 rounded ${waveType === "surface" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Surface
              </button>
              <button
                onClick={() => setWaveType("standing")}
                className={`px-2 py-1 rounded ${waveType === "standing" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Standing
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Amplitude: {amplitude.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
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
              step="0.5"
              value={wavelength}
              onChange={(e) => setWavelength(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {waveType !== "standing" && (
            <div>
              <label className="block mb-1">Damping: {damping.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.01"
                value={damping}
                onChange={(e) => setDamping(Number.parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <button
            onClick={() => setPaused(!paused)}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <WaveScene
          waveType={waveType}
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          damping={damping}
          paused={paused}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function WaveScene({ 
  waveType, 
  amplitude, 
  frequency, 
  wavelength, 
  damping, 
  paused 
}: { 
  waveType: string; 
  amplitude: number; 
  frequency: number; 
  wavelength: number; 
  damping: number; 
  paused: boolean; 
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

  // Render the appropriate wave type
  return (
    <group>
      {/* Coordinate System */}
      <CoordinateSystem />

      {/* Wave Visualization */}
      {waveType === "transverse" && (
        <TransverseWave
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          damping={damping}
          time={time}
        />
      )}

      {waveType === "longitudinal" && (
        <LongitudinalWave
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          damping={damping}
          time={time}
        />
      )}

      {waveType === "surface" && (
        <SurfaceWave
          amplitude={amplitude}
          frequency={frequency}
          wavelength={wavelength}
          damping={damping}
          time={time}
        />
      )}

      {waveType === "standing" && (
        <StandingWave amplitude={amplitude} frequency={frequency} wavelength={wavelength} time={time} />
      )}

      {/* Wave Type Description */}
      <WaveDescription waveType={waveType} />
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

function TransverseWave({ 
  amplitude, 
  frequency, 
  wavelength, 
  damping, 
  time 
}: { 
  amplitude: number; 
  frequency: number; 
  wavelength: number; 
  damping: number; 
  time: number; 
}) {
  const numPoints = 100
  const waveLength = 20
  const wavePoints: [number, number, number][] = []
  const particlePositions = []
  const numParticles = 20

  // Angular frequency
  const omega = 2 * Math.PI * frequency
  // Wave number
  const k = (2 * Math.PI) / wavelength

  // Generate wave points
  for (let i = 0; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength

    // Calculate damping factor
    const dampingFactor = Math.exp(-damping * Math.abs(x))

    // Calculate wave displacement
    const y = amplitude * dampingFactor * Math.sin(k * x - omega * time)

    wavePoints.push([x, y, 0] as [number, number, number])
  }

  // Generate particle positions
  for (let i = 0; i < numParticles; i++) {
    const x = -waveLength / 2 + (i / (numParticles - 1)) * waveLength

    // Calculate damping factor
    const dampingFactor = Math.exp(-damping * Math.abs(x))

    // Calculate wave displacement
    const y = amplitude * dampingFactor * Math.sin(k * x - omega * time)

    particlePositions.push([x, y, 0] as [number, number, number])
  }

  return (
    <group>
      {/* Wave curve */}
      <Line points={wavePoints} color="#00BFFF" lineWidth={2} />

      {/* Particles */}
      {particlePositions.map((pos, index) => (
        <mesh key={index} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#FF9900" />
        </mesh>
      ))}

      {/* Direction of motion indicators */}
      {particlePositions
        .filter((_, i) => i % 4 === 0)
        .map((pos, index) => (
          <ArrowHelper
            key={index}
            dir={new Vector3(0, 1, 0)}
            origin={new Vector3(pos[0], pos[1], pos[2])}
            length={0.5}
            color="#FFFF00"
          />
        ))}

      {/* Direction of propagation */}
      <ArrowHelper dir={new Vector3(1, 0, 0)} origin={new Vector3(-waveLength / 2, -2, 0)} length={2} color="#FF0000" />
      <Text position={[-waveLength / 2 + 1, -2.5, 0]} fontSize={0.4} color="#FF0000">
        Direction of Propagation
      </Text>
    </group>
  )
}

function LongitudinalWave({ 
  amplitude, 
  frequency, 
  wavelength, 
  damping, 
  time 
}: { 
  amplitude: number; 
  frequency: number; 
  wavelength: number; 
  damping: number; 
  time: number; 
}) {
  const numPoints = 100
  const waveLength = 20
  const wavePoints: [number, number, number][] = []
  const particlePositions: Particle[] = []
  const particleTrails = []
  const numParticles = 50
  const particleSpacing = waveLength / numParticles

  // Angular frequency
  const omega = 2 * Math.PI * frequency
  // Wave number
  const k = (2 * Math.PI) / wavelength

  // Generate particle positions
  for (let i = 0; i < numParticles; i++) {
    const restX = -waveLength / 2 + i * particleSpacing

    // Calculate damping factor
    const dampingFactor = Math.exp(-damping * Math.abs(restX))

    // Calculate longitudinal displacement
    const displacement = amplitude * dampingFactor * Math.sin(k * restX - omega * time)

    // Displaced position
    particlePositions.push({
      restX: restX,
      x: restX + displacement,
      y: 0,
      z: 0,
      displacement: displacement,
    } as Particle)
  }

  // Calculate density regions for visualization
  const densityVisualization = []
  const densityHeight = 2

  for (let i = 0; i < numParticles - 1; i++) {
    const currentParticle = particlePositions[i]
    const nextParticle = particlePositions[i + 1]

    // Calculate local density based on particle spacing
    const restSpacing = nextParticle.restX - currentParticle.restX
    const actualSpacing = nextParticle.x - currentParticle.x

    // Normalize density (1 is normal, >1 is compression, <1 is rarefaction)
    const relativeDensity = restSpacing / actualSpacing

    // Map density to color
    const r = relativeDensity > 1 ? 1 : 0
    const b = relativeDensity < 1 ? 1 : 0
    const g = Math.max(0, 1 - Math.abs(relativeDensity - 1))

    // Add density visualization rectangle
    densityVisualization.push({
      x: (currentParticle.x + nextParticle.x) / 2,
      width: actualSpacing,
      color: `rgb(${r * 255},${g * 255},${b * 255})`,
      density: relativeDensity,
    } as { x: number; width: number; color: string; density: number })
  }

  return (
    <group>
      {/* Rest position line */}
      <Line
        points={[
          [-waveLength / 2, 0, 0],
          [waveLength / 2, 0, 0],
        ]}
        color="#AAAAAA"
        lineWidth={1}
        dashed={true}
      />

      {/* Density visualization */}
      {densityVisualization.map((region, index) => (
        <group key={`density-${index}`}>
          <mesh position={[region.x, -densityHeight / 2 - 0.5, 0]}>
            <planeGeometry args={[region.width, densityHeight]} />
            <meshBasicMaterial color={region.color} opacity={0.5} transparent />
          </mesh>
        </group>
      ))}

      {/* Particles */}
      {particlePositions.map((particle, index) => (
        <group key={`particle-${index}`}>
          {/* Particle */}
          <mesh position={[particle.x, particle.y, particle.z]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#FF9900" />
          </mesh>

          {/* Line connecting to rest position */}
          <Line
            points={[
              [particle.restX, particle.y, particle.z],
              [particle.x, particle.y, particle.z],
            ]}
            color="#AAAAAA"
            lineWidth={1}
            opacity={0.3}
          />
        </group>
      ))}

      {/* Direction of motion indicators */}
      {particlePositions
        .filter((_, i) => i % 10 === 0)
        .map((particle, index) => {
          const direction = particle.displacement > 0 ? 1 : -1

          return (
            <ArrowHelper
              key={`arrow-${index}`}
              dir={new Vector3(direction, 0, 0)}
              origin={new Vector3(particle.x, particle.y, particle.z)}
              length={0.5}
              color="#FFFF00"
            />
          )
        })}

      {/* Direction of propagation */}
      <ArrowHelper dir={new Vector3(1, 0, 0)} origin={new Vector3(-waveLength / 2, -4, 0)} length={2} color="#FF0000" />
      <Text position={[-waveLength / 2 + 1, -4.5, 0]} fontSize={0.4} color="#FF0000">
        Direction of Propagation
      </Text>

      {/* Compression and rarefaction labels */}
      <Text position={[0, -densityHeight - 1.5, 0]} fontSize={0.5} color="#FFFFFF">
        Compression (high density) → Blue Rarefaction (low density) → Red
      </Text>

      {/* Explanation */}
      <Text position={[0, 2, 0]} fontSize={0.5} color="#FFFFFF">
        Particles oscillate parallel to the direction of wave propagation
      </Text>
    </group>
  )
}

function SurfaceWave({ 
  amplitude, 
  frequency, 
  wavelength, 
  damping, 
  time 
}: { 
  amplitude: number; 
  frequency: number; 
  wavelength: number; 
  damping: number; 
  time: number; 
}) {
  const numPoints = 100
  const waveLength = 20
  const wavePoints: [number, number, number][] = []
  const particlePositions = []
  const particleTrails = []
  const numParticles = 15

  // Angular frequency
  const omega = 2 * Math.PI * frequency
  // Wave number
  const k = (2 * Math.PI) / wavelength

  // Generate wave points
  for (let i = 0; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength

    // Calculate damping factor
    const dampingFactor = Math.exp(-damping * Math.abs(x))

    // Calculate wave displacement
    const y = amplitude * dampingFactor * Math.sin(k * x - omega * time)

    wavePoints.push([x, y, 0] as [number, number, number])
  }

  // Generate particle positions and trails
  for (let i = 0; i < numParticles; i++) {
    const x = -waveLength / 2 + (i / (numParticles - 1)) * waveLength

    // Calculate damping factor
    const dampingFactor = Math.exp(-damping * Math.abs(x))

    // Calculate vertical displacement
    const y = amplitude * dampingFactor * Math.sin(k * x - omega * time)

    // Calculate horizontal displacement (smaller than vertical)
    const xDisplacement = -0.3 * amplitude * dampingFactor * Math.cos(k * x - omega * time)

    particlePositions.push([x + xDisplacement, y, 0] as [number, number, number])

    // Generate elliptical trail for each particle
    const trailPoints: [number, number, number][] = []
    for (let j = 0; j <= 20; j++) {
      const angle = (j / 20) * Math.PI * 2
      const trailX = x + xDisplacement * Math.cos(angle)
      const trailY = y + amplitude * dampingFactor * Math.sin(angle)
      trailPoints.push([trailX, trailY, 0] as [number, number, number])
    }
    particleTrails.push(trailPoints)
  }

  return (
    <group>
      {/* Surface */}
      <Line points={wavePoints} color="#00BFFF" lineWidth={2} />

      {/* Water body representation */}
      <mesh position={[0, -2, 0]}>
        <planeGeometry args={[waveLength, 4]} />
        <meshStandardMaterial color="#1E90FF" opacity={0.3} transparent />
      </mesh>

      {/* Particles */}
      {particlePositions.map((pos, index) => (
        <mesh key={index} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#FF9900" />
        </mesh>
      ))}

      {/* Particle trails (elliptical motion) */}
      {particleTrails.map((trail, index) => (
        <Line key={index} points={trail} color="#FFFF00" lineWidth={1} opacity={0.3} />
      ))}

      {/* Direction of propagation */}
      <ArrowHelper dir={new Vector3(1, 0, 0)} origin={new Vector3(-waveLength / 2, -4, 0)} length={2} color="#FF0000" />
      <Text position={[-waveLength / 2 + 1, -4.5, 0]} fontSize={0.4} color="#FF0000">
        Direction of Propagation
      </Text>
    </group>
  )
}

function StandingWave({ 
  amplitude, 
  frequency, 
  wavelength, 
  time 
}: { 
  amplitude: number; 
  frequency: number; 
  wavelength: number; 
  time: number; 
}) {
  const numPoints = 100
  const waveLength = 20
  const wavePoints: [number, number, number][] = []
  const particlePositions = []
  const numParticles = 20

  // Angular frequency
  const omega = 2 * Math.PI * frequency
  // Wave number
  const k = (2 * Math.PI) / wavelength

  // Generate wave points for standing wave
  for (let i = 0; i <= numPoints; i++) {
    const x = -waveLength / 2 + (i / numPoints) * waveLength

    // Standing wave equation: A * sin(kx) * cos(ωt)
    const y = amplitude * Math.sin(k * x) * Math.cos(omega * time)

    wavePoints.push([x, y, 0] as [number, number, number])
  }

  // Generate particle positions
  for (let i = 0; i < numParticles; i++) {
    const x = -waveLength / 2 + (i / (numParticles - 1)) * waveLength

    // Standing wave equation for particles
    const y = amplitude * Math.sin(k * x) * Math.cos(omega * time)

    particlePositions.push([x, y, 0] as [number, number, number])
  }

  // Calculate node positions
  const nodePositions = []
  for (let i = 0; i <= Math.floor(waveLength / wavelength); i++) {
    const x = -waveLength / 2 + (i * wavelength) / 2
    nodePositions.push(x)
  }

  // Calculate antinode positions
  const antinodePositions = []
  for (let i = 0; i < Math.floor(waveLength / wavelength); i++) {
    const x = -waveLength / 2 + wavelength / 4 + (i * wavelength) / 2
    antinodePositions.push(x)
  }

  return (
    <group>
      {/* Standing wave */}
      <Line points={wavePoints} color="#00BFFF" lineWidth={2} />

      {/* Particles */}
      {particlePositions.map((pos, index) => (
        <mesh key={index} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#FF9900" />
        </mesh>
      ))}

      {/* Nodes */}
      {nodePositions.map((x, index) => (
        <group key={`node-${index}`}>
          <mesh position={[x, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#FF0000" />
          </mesh>
          <Line
            points={[
              [x, -amplitude * 1.2, 0],
              [x, amplitude * 1.2, 0],
            ]}
            color="#FF0000"
            lineWidth={1}
            opacity={0.5}
            dashed={true}
          />
          {index === 0 && (
            <Text position={[x, -amplitude * 1.5, 0]} fontSize={0.4} color="#FF0000">
              Node
            </Text>
          )}
        </group>
      ))}

      {/* Antinodes */}
      {antinodePositions.map((x, index) => (
        <group key={`antinode-${index}`}>
          <mesh position={[x, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#00FF00" />
          </mesh>
          <Line
            points={[
              [x, -amplitude * 1.2, 0],
              [x, amplitude * 1.2, 0],
            ]}
            color="#00FF00"
            lineWidth={1}
            opacity={0.5}
            dashed={true}
          />
          {index === 0 && (
            <Text position={[x, -amplitude * 1.5, 0]} fontSize={0.4} color="#00FF00">
              Antinode
            </Text>
          )}
        </group>
      ))}

      {/* Envelope curves */}
      <Line
        points={wavePoints.map((point) => [point[0], amplitude * Math.sin(k * point[0]), 0])}
        color="#FF6B6B"
        lineWidth={1}
        opacity={0.5}
        dashed={true}
      />
      <Line
        points={wavePoints.map((point) => [point[0], -amplitude * Math.sin(k * point[0]), 0])}
        color="#FF6B6B"
        lineWidth={1}
        opacity={0.5}
        dashed={true}
      />
    </group>
  )
}

function WaveDescription({ waveType }: { waveType: string }) {
  let title = ""
  let description: string[] = []
  let examples: string[] = []

  switch (waveType) {
    case "transverse":
      title = "Transverse Wave"
      description = [
        "Particles move perpendicular to the direction of wave propagation",
        "Creates peaks (crests) and valleys (troughs)",
        "Energy travels in the direction of wave propagation",
      ]
      examples = ["Light waves", "Electromagnetic waves", "Waves on a string"]
      break

    case "longitudinal":
      title = "Longitudinal Wave"
      description = [
        "Particles move parallel to the direction of wave propagation",
        "Creates compressions (high density) and rarefactions (low density)",
        "Energy travels in the same direction as particle displacement",
      ]
      examples = ["Sound waves", "Seismic P-waves", "Waves in springs"]
      break

    case "surface":
      title = "Surface Wave"
      description = [
        "Particles move in elliptical paths",
        "Combines both transverse and longitudinal motion",
        "Amplitude decreases with depth",
      ]
      examples = ["Ocean waves", "Ripples on water", "Rayleigh waves in earthquakes"]
      break

    case "standing":
      title = "Standing Wave"
      description = [
        "Formed by interference of two waves traveling in opposite directions",
        "Appears to stand in place rather than travel",
        "Has fixed nodes (zero amplitude) and antinodes (maximum amplitude)",
      ]
      examples = [
        "Vibrating strings in musical instruments",
        "Resonance in wind instruments",
        "Microwave oven standing waves",
      ]
      break
  }

  return (
    <group position={[0, -6, 0]}>
      <Text position={[0, 0, 0]} fontSize={0.7} color="white" anchorX="center">
        {title}
      </Text>

      {description.map((text, index) => (
        <Text key={index} position={[0, -0.7 - index * 0.5, 0]} fontSize={0.4} color="white" anchorX="center">
          • {text}
        </Text>
      ))}

      <Text position={[0, -2.5, 0]} fontSize={0.5} color="#FFFF00" anchorX="center">
        Examples:
      </Text>

      {examples.map((text, index) => (
        <Text key={index} position={[0, -3 - index * 0.5, 0]} fontSize={0.4} color="#FFFF00" anchorX="center">
          • {text}
        </Text>
      ))}
    </group>
  )
}

// Helper component for arrows
function ArrowHelper({ dir, origin, length, color }: { dir: Vector3; origin: Vector3; length: number; color: string }) {
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
