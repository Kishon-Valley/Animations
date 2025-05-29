"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera, Stars } from "@react-three/drei"
import { MathUtils } from "three"

export default function PlanetaryMotion() {
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [timeScale, setTimeScale] = useState(0.3)
  const [selectedView, setSelectedView] = useState("solar-system")
  const [paused, setPaused] = useState(false)
  const [showControls, setShowControls] = useState(true)

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Toggle button - always visible */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 z-20 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {showControls ? "Hide Controls" : "Show Controls"}
      </button>

      {/* Controls panel - conditionally visible */}
      <div
        className={`absolute top-4 left-4 z-10 bg-gray-800 bg-opacity-80 p-4 rounded-lg text-white transition-all duration-300 ${
          showControls ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Motion of Planets and Satellites</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Time Scale: {timeScale.toFixed(1)}x</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={timeScale}
              onChange={(e) => setTimeScale(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="block">View:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedView("solar-system")}
                className={`px-2 py-1 rounded ${selectedView === "solar-system" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Solar System
              </button>
              <button
                onClick={() => setSelectedView("earth-moon")}
                className={`px-2 py-1 rounded ${selectedView === "earth-moon" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Earth-Moon
              </button>
              <button
                onClick={() => setSelectedView("satellite")}
                className={`px-2 py-1 rounded ${selectedView === "satellite" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Satellite Orbits
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showOrbits}
                onChange={() => setShowOrbits(!showOrbits)}
                className="mr-2"
              />
              Show Orbits
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={() => setShowLabels(!showLabels)}
                className="mr-2"
              />
              Show Labels
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
        <PerspectiveCamera makeDefault position={[0, 20, 30]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#FFFFFF" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <PlanetaryScene
          showOrbits={showOrbits}
          showLabels={showLabels}
          timeScale={timeScale}
          selectedView={selectedView}
          paused={paused}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function PlanetaryScene({ showOrbits, showLabels, timeScale, selectedView, paused }) {
  // Use a ref for time to avoid re-renders
  const timeRef = useRef(0)
  // Use state for the current scene time that will be passed to children
  const [sceneTime, setSceneTime] = useState(0)

  // Define planets and their properties
  const planets = [
    {
      name: "Mercury",
      color: "#A9A9A9",
      radius: 0.38,
      distance: 5,
      orbitPeriod: 0.24,
      rotationPeriod: 58.6,
      orbitEccentricity: 0.205,
      orbitTilt: 7,
    },
    {
      name: "Venus",
      color: "#E6E6FA",
      radius: 0.95,
      distance: 7,
      orbitPeriod: 0.62,
      rotationPeriod: -243,
      orbitEccentricity: 0.007,
      orbitTilt: 3.4,
    },
    {
      name: "Earth",
      color: "#1E90FF",
      radius: 1,
      distance: 10,
      orbitPeriod: 1,
      rotationPeriod: 1,
      orbitEccentricity: 0.017,
      orbitTilt: 0,
      hasMoon: true,
      moonDistance: 2.5,
      moonRadius: 0.27,
      moonOrbitPeriod: 2.0,
      satellites: [
        { name: "ISS", distance: 1.2, orbitPeriod: 0.5, color: "#FFFFFF", radius: 0.05 },
        { name: "GPS", distance: 1.8, orbitPeriod: 0.8, color: "#FFD700", radius: 0.05 },
      ],
    },
    {
      name: "Mars",
      color: "#FF4500",
      radius: 0.53,
      distance: 15,
      orbitPeriod: 1.88,
      rotationPeriod: 1.03,
      orbitEccentricity: 0.093,
      orbitTilt: 1.9,
    },
    {
      name: "Jupiter",
      color: "#F0E68C",
      radius: 11.2 * 0.3, // Scaled down for visualization
      distance: 22,
      orbitPeriod: 11.86,
      rotationPeriod: 0.41,
      orbitEccentricity: 0.048,
      orbitTilt: 1.3,
    },
    {
      name: "Saturn",
      color: "#F5DEB3",
      radius: 9.45 * 0.3, // Scaled down for visualization
      distance: 30,
      orbitPeriod: 29.46,
      rotationPeriod: 0.44,
      orbitEccentricity: 0.056,
      orbitTilt: 2.5,
      hasRings: true,
    },
  ]

  // Update time in useFrame
  useFrame((state, delta) => {
    if (!paused) {
      timeRef.current += delta * timeScale
      setSceneTime(timeRef.current) // Update state to trigger re-renders
    }
  })

  // Determine which scene to render based on selectedView
  if (selectedView === "earth-moon") {
    return (
      <EarthMoonSystem
        time={sceneTime}
        showOrbits={showOrbits}
        showLabels={showLabels}
        earthData={planets.find((p) => p.name === "Earth")}
      />
    )
  } else if (selectedView === "satellite") {
    return (
      <SatelliteSystem
        time={sceneTime}
        showOrbits={showOrbits}
        showLabels={showLabels}
        earthData={planets.find((p) => p.name === "Earth")}
      />
    )
  } else {
    return <SolarSystem time={sceneTime} planets={planets} showOrbits={showOrbits} showLabels={showLabels} />
  }
}

function SolarSystem({ time, planets, showOrbits, showLabels }) {
  // Force update with time
  const [_, forceUpdate] = useState(0)
  useFrame(() => {
    forceUpdate((prev) => (prev + 1) % 1000)
  })
  return (
    <group>
      {/* Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#FFFF00" />
      </mesh>
      {showLabels && (
        <Text position={[0, 3, 0]} fontSize={1} color="white">
          Sun
        </Text>
      )}

      {/* Planets */}
      {planets.map((planet, index) => (
        <Planet key={index} planet={planet} time={time} showOrbit={showOrbits} showLabel={showLabels} />
      ))}

      {/* Educational text */}
      <Text position={[0, -15, 0]} fontSize={1.2} color="white" anchorX="center">
        Solar System Model (Not to Scale)
      </Text>
      <Text position={[0, -17, 0]} fontSize={0.8} color="white" anchorX="center">
        Planets orbit the Sun following Kepler's Laws of Planetary Motion
      </Text>
      <Text position={[0, -18.5, 0]} fontSize={0.8} color="white" anchorX="center">
        1. Planets move in elliptical orbits with the Sun at one focus
      </Text>
      <Text position={[0, -19.5, 0]} fontSize={0.8} color="white" anchorX="center">
        2. A line joining a planet to the Sun sweeps out equal areas in equal times
      </Text>
      <Text position={[0, -20.5, 0]} fontSize={0.8} color="white" anchorX="center">
        3. The square of the orbital period is proportional to the cube of the semi-major axis
      </Text>
    </group>
  )
}

function EarthMoonSystem({ time, showOrbits, showLabels, earthData }) {
  // Force update with time
  const [_, forceUpdate] = useState(0)
  useFrame(() => {
    forceUpdate((prev) => (prev + 1) % 1000)
  })
  return (
    <group>
      {/* Earth */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#1E90FF" />
      </mesh>
      {showLabels && (
        <Text position={[0, 1.5, 0]} fontSize={0.5} color="white">
          Earth
        </Text>
      )}

      {/* Moon orbit */}
      {showOrbits && (
        <EllipticalOrbit semiMajorAxis={earthData.moonDistance} eccentricity={0.055} color="#FFFFFF" tilt={5.1} />
      )}

      {/* Moon */}
      <CelestialBody
        name="Moon"
        radius={earthData.moonRadius}
        distance={earthData.moonDistance}
        orbitPeriod={earthData.moonOrbitPeriod}
        orbitEccentricity={0.055}
        orbitTilt={5.1}
        color="#CCCCCC"
        time={time}
        showLabel={showLabels}
        parentBody={null}
      />

      {/* Educational text */}
      <Text position={[0, -5, 0]} fontSize={0.7} color="white" anchorX="center">
        Earth-Moon System
      </Text>
      <Text position={[0, -6, 0]} fontSize={0.5} color="white" anchorX="center">
        The Moon orbits Earth at an average distance of 384,400 km
      </Text>
      <Text position={[0, -7, 0]} fontSize={0.5} color="white" anchorX="center">
        Orbital period: 27.3 days (sidereal) / 29.5 days (synodic)
      </Text>
      <Text position={[0, -8, 0]} fontSize={0.5} color="white" anchorX="center">
        The Moon is in tidal lock with Earth, always showing the same face
      </Text>
    </group>
  )
}

function SatelliteSystem({ time, showOrbits, showLabels, earthData }) {
  // Force update with time
  const [_, forceUpdate] = useState(0)
  useFrame(() => {
    forceUpdate((prev) => (prev + 1) % 1000)
  })
  // Define different satellite orbits
  const satellites = [
    { name: "Low Earth Orbit", distance: 1.2, orbitPeriod: 0.5, color: "#FFFFFF", radius: 0.05, inclination: 51.6 },
    { name: "GPS Satellite", distance: 2.6, orbitPeriod: 1.0, color: "#FFD700", radius: 0.05, inclination: 55 },
    { name: "Geostationary", distance: 6, orbitPeriod: 2.0, color: "#FF4500", radius: 0.05, inclination: 0 },
    {
      name: "Molniya Orbit",
      distance: 4,
      orbitPeriod: 1.5,
      color: "#00FFFF",
      radius: 0.05,
      inclination: 63.4,
      eccentricity: 0.7,
    },
  ]

  return (
    <group>
      {/* Earth */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#1E90FF" />
      </mesh>
      {showLabels && (
        <Text position={[0, 1.5, 0]} fontSize={0.5} color="white">
          Earth
        </Text>
      )}

      {/* Satellite orbits */}
      {satellites.map((satellite, index) => (
        <group key={index}>
          {showOrbits && (
            <EllipticalOrbit
              semiMajorAxis={satellite.distance}
              eccentricity={satellite.eccentricity || 0}
              color={satellite.color}
              tilt={satellite.inclination}
            />
          )}

          {/* Satellite */}
          <CelestialBody
            name={satellite.name}
            radius={satellite.radius}
            distance={satellite.distance}
            orbitPeriod={satellite.orbitPeriod}
            orbitEccentricity={satellite.eccentricity || 0}
            orbitTilt={satellite.inclination}
            color={satellite.color}
            time={time}
            showLabel={showLabels}
            parentBody={null}
          />
        </group>
      ))}

      {/* Educational text */}
      <Text position={[0, -5, 0]} fontSize={0.7} color="white" anchorX="center">
        Satellite Orbits Around Earth
      </Text>
      <Text position={[0, -6, 0]} fontSize={0.5} color="white" anchorX="center">
        Low Earth Orbit (LEO): 160-2,000 km, Period ~90 minutes
      </Text>
      <Text position={[0, -7, 0]} fontSize={0.5} color="white" anchorX="center">
        Medium Earth Orbit (MEO): 2,000-35,786 km, Period ~12 hours
      </Text>
      <Text position={[0, -8, 0]} fontSize={0.5} color="white" anchorX="center">
        Geostationary Orbit (GEO): 35,786 km, Period = Earth's rotation (24h)
      </Text>
      <Text position={[0, -9, 0]} fontSize={0.5} color="white" anchorX="center">
        Molniya Orbit: Highly elliptical, high inclination, Period ~12 hours
      </Text>
    </group>
  )
}

function Planet({ planet, time, showOrbit, showLabel }) {
  // Force component to update with time changes
  const [_, forceUpdate] = useState(0)
  useFrame(() => {
    forceUpdate((prev) => (prev + 1) % 1000) // Update state to force re-render
  })
  // Calculate position based on orbital parameters
  const position = calculateOrbitalPosition(
    planet.distance,
    planet.orbitPeriod,
    planet.orbitEccentricity || 0,
    planet.orbitTilt || 0,
    time,
  )

  return (
    <group>
      {/* Planet orbit */}
      {showOrbit && (
        <EllipticalOrbit
          semiMajorAxis={planet.distance}
          eccentricity={planet.orbitEccentricity || 0}
          color="#FFFFFF"
          tilt={planet.orbitTilt}
        />
      )}

      {/* Planet */}
      <mesh position={position}>
        <sphereGeometry args={[planet.radius, 32, 32]} />
        <meshStandardMaterial color={planet.color} />
      </mesh>

      {/* Saturn's rings */}
      {planet.hasRings && (
        <group position={position}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.radius * 1.2, planet.radius * 2, 64]} />
            <meshBasicMaterial color="#D2B48C" side={2} transparent opacity={0.8} />
          </mesh>
        </group>
      )}

      {/* Planet label */}
      {showLabel && (
        <Text position={[position[0], position[1] + planet.radius + 0.5, position[2]]} fontSize={0.5} color="white">
          {planet.name}
        </Text>
      )}

      {/* Moon for Earth */}
      {planet.hasMoon && (
        <CelestialBody
          name="Moon"
          radius={planet.moonRadius}
          distance={planet.moonDistance}
          orbitPeriod={planet.moonOrbitPeriod}
          orbitEccentricity={0.055}
          orbitTilt={5.1}
          color="#CCCCCC"
          time={time}
          showLabel={showLabel}
          parentBody={position}
        />
      )}

      {/* Satellites for Earth */}
      {planet.satellites &&
        planet.satellites.map((satellite, index) => (
          <CelestialBody
            key={index}
            name={satellite.name}
            radius={satellite.radius}
            distance={satellite.distance}
            orbitPeriod={satellite.orbitPeriod}
            orbitEccentricity={0}
            orbitTilt={51.6} // ISS inclination
            color={satellite.color}
            time={time}
            showLabel={showLabel}
            parentBody={position}
          />
        ))}
    </group>
  )
}

function CelestialBody({
  name,
  radius,
  distance,
  orbitPeriod,
  orbitEccentricity,
  orbitTilt,
  color,
  time,
  showLabel,
  parentBody,
}) {
  // Force component to update with time changes
  const [_, forceUpdate] = useState(0)
  useFrame(() => {
    forceUpdate((prev) => (prev + 1) % 1000) // Update state to force re-render
  })
  // Calculate position relative to parent body
  const relativePosition = calculateOrbitalPosition(distance, orbitPeriod, orbitEccentricity, orbitTilt, time)

  // If there's a parent body, add its position
  const position = parentBody
    ? [relativePosition[0] + parentBody[0], relativePosition[1] + parentBody[1], relativePosition[2] + parentBody[2]]
    : relativePosition

  return (
    <group>
      {/* Body */}
      <mesh position={position}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Text position={[position[0], position[1] + radius + 0.3, position[2]]} fontSize={0.3} color="white">
          {name}
        </Text>
      )}
    </group>
  )
}

function EllipticalOrbit({ semiMajorAxis, eccentricity, color, tilt }) {
  const segments = 64
  const points = []

  // Generate points for an elliptical orbit
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2

    // Parametric equation of an ellipse
    const r = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(theta))
    const x = r * Math.cos(theta)
    const z = r * Math.sin(theta)

    // Apply tilt (in degrees)
    const tiltRad = MathUtils.degToRad(tilt)
    const xTilted = x
    const zTilted = z * Math.cos(tiltRad) - 0 * Math.sin(tiltRad)
    const yTilted = z * Math.sin(tiltRad) + 0 * Math.cos(tiltRad)

    points.push([xTilted, yTilted, zTilted])
  }

  return <Line points={points} color={color} lineWidth={1} opacity={0.5} />
}

// Helper function to calculate orbital position
function calculateOrbitalPosition(semiMajorAxis, orbitPeriod, eccentricity, tilt, time) {
  // Calculate angle based on time and period
  const angle = (time / orbitPeriod) * Math.PI * 2

  // Calculate position in orbital plane
  const x = semiMajorAxis * Math.cos(angle)
  const y = semiMajorAxis * Math.sin(angle)

  // Apply tilt (in degrees)
  const tiltRad = MathUtils.degToRad(tilt)
  const xTilted = x
  const zTilted = y * Math.cos(tiltRad)
  const yTilted = y * Math.sin(tiltRad)

  return [xTilted, yTilted, zTilted]
}
