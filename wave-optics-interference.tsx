"use client"

import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3 } from "three"

export default function WaveOpticsInterference() {
  const [experimentType, setExperimentType] = useState("double-slit")
  const [wavelength, setWavelength] = useState(550) // in nm
  const [slitSeparation, setSlitSeparation] = useState(0.1) // in mm
  const [screenDistance, setScreenDistance] = useState(1) // in m
  const [filmThickness, setFilmThickness] = useState(500) // in nm
  const [refractiveIndex, setRefractiveIndex] = useState(1.5)
  const [incidentAngle, setIncidentAngle] = useState(0) // in degrees
  const [showWavefronts, setShowWavefronts] = useState(true)
  const [showRays, setShowRays] = useState(true)
  const [showPhaseDifference, setShowPhaseDifference] = useState(true)
  const [paused, setPaused] = useState(false)
  const [showControls, setShowControls] = useState(true)

  // Convert wavelength to visible color
  const wavelengthToColor = (wavelength: number) => {
    // Simple conversion from wavelength to RGB
    let r, g, b
    if (wavelength >= 380 && wavelength < 440) {
      r = (-1 * (wavelength - 440)) / (440 - 380)
      g = 0
      b = 1
    } else if (wavelength >= 440 && wavelength < 490) {
      r = 0
      g = (wavelength - 440) / (490 - 440)
      b = 1
    } else if (wavelength >= 490 && wavelength < 510) {
      r = 0
      g = 1
      b = (-1 * (wavelength - 510)) / (510 - 490)
    } else if (wavelength >= 510 && wavelength < 580) {
      r = (wavelength - 510) / (580 - 510)
      g = 1
      b = 0
    } else if (wavelength >= 580 && wavelength < 645) {
      r = 1
      g = (-1 * (wavelength - 645)) / (645 - 580)
      b = 0
    } else if (wavelength >= 645 && wavelength <= 780) {
      r = 1
      g = 0
      b = 0
    } else {
      r = 0.5
      g = 0.5
      b = 0.5
    }

    // Intensity factor
    let factor
    if (wavelength >= 380 && wavelength < 420) {
      factor = 0.3 + (0.7 * (wavelength - 380)) / (420 - 380)
    } else if (wavelength >= 420 && wavelength < 700) {
      factor = 1
    } else if (wavelength >= 700 && wavelength <= 780) {
      factor = 0.3 + (0.7 * (780 - wavelength)) / (780 - 700)
    } else {
      factor = 0.5
    }

    r = Math.round(255 * Math.min(1, r * factor))
    g = Math.round(255 * Math.min(1, g * factor))
    b = Math.round(255 * Math.min(1, b * factor))

    return `rgb(${r}, ${g}, ${b})`
  }

  const lightColor = wavelengthToColor(wavelength)

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-auto">
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
        <h2 className="text-xl font-bold mb-4">Wave Optics: Interference</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Experiment Type:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setExperimentType("double-slit")}
                className={`px-2 py-1 rounded ${experimentType === "double-slit" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Young's Double Slit
              </button>
              <button
                onClick={() => setExperimentType("thin-film")}
                className={`px-2 py-1 rounded ${experimentType === "thin-film" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Thin Film Interference
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">
              Wavelength: {wavelength} nm
              <span className="ml-2 inline-block w-4 h-4 rounded-full" style={{ backgroundColor: lightColor }}></span>
            </label>
            <input
              type="range"
              min="380"
              max="750"
              step="10"
              value={wavelength}
              onChange={(e) => setWavelength(Number.parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {experimentType === "double-slit" && (
            <>
              <div>
                <label className="block mb-1">Slit Separation: {slitSeparation.toFixed(2)} mm</label>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.01"
                  value={slitSeparation}
                  onChange={(e) => setSlitSeparation(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Screen Distance: {screenDistance.toFixed(1)} m</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={screenDistance}
                  onChange={(e) => setScreenDistance(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          {experimentType === "thin-film" && (
            <>
              <div>
                <label className="block mb-1">Film Thickness: {filmThickness} nm</label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="10"
                  value={filmThickness}
                  onChange={(e) => setFilmThickness(Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Refractive Index: {refractiveIndex.toFixed(2)}</label>
                <input
                  type="range"
                  min="1.1"
                  max="2.5"
                  step="0.05"
                  value={refractiveIndex}
                  onChange={(e) => setRefractiveIndex(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Incident Angle: {incidentAngle}°</label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={incidentAngle}
                  onChange={(e) => setIncidentAngle(Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showWavefronts}
                onChange={() => setShowWavefronts(!showWavefronts)}
                className="mr-2"
              />
              Wavefronts
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={showRays} onChange={() => setShowRays(!showRays)} className="mr-2" />
              Light Rays
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPhaseDifference}
                onChange={() => setShowPhaseDifference(!showPhaseDifference)}
                className="mr-2"
              />
              Phase Difference
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

      <Canvas shadows style={{ height: "100vh" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <WaveOpticsScene
          experimentType={experimentType}
          wavelength={wavelength}
          slitSeparation={slitSeparation}
          screenDistance={screenDistance}
          filmThickness={filmThickness}
          refractiveIndex={refractiveIndex}
          incidentAngle={incidentAngle}
          showWavefronts={showWavefronts}
          showRays={showRays}
          showPhaseDifference={showPhaseDifference}
          paused={paused}
          lightColor={lightColor}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function WaveOpticsScene({
  experimentType,
  wavelength,
  slitSeparation,
  screenDistance,
  filmThickness,
  refractiveIndex,
  incidentAngle,
  showWavefronts,
  showRays,
  showPhaseDifference,
  paused,
  lightColor,
}: {
  experimentType: string;
  wavelength: number;
  slitSeparation: number;
  screenDistance: number;
  filmThickness: number;
  refractiveIndex: number;
  incidentAngle: number;
  showWavefronts: boolean;
  showRays: boolean;
  showPhaseDifference: boolean;
  paused: boolean;
  lightColor: string;
}) {
  const timeRef = useRef(0)
  const [time, setTime] = useState(0)

  // Update time
  useFrame((state, delta) => {
    if (!paused) {
      const newTime = timeRef.current + delta
      timeRef.current = newTime
      setTime(newTime)
    }
  })

  // Render the appropriate experiment
  return (
    <group position={[0, 0, 0]} scale={0.7}>
      {experimentType === "double-slit" ? (
        <DoubleSlit
          wavelength={wavelength}
          slitSeparation={slitSeparation}
          screenDistance={screenDistance}
          showWavefronts={showWavefronts}
          showRays={showRays}
          showPhaseDifference={showPhaseDifference}
          time={time}
          lightColor={lightColor}
        />
      ) : (
        <ThinFilm
          wavelength={wavelength}
          filmThickness={filmThickness}
          refractiveIndex={refractiveIndex}
          incidentAngle={incidentAngle}
          showWavefronts={showWavefronts}
          showRays={showRays}
          showPhaseDifference={showPhaseDifference}
          time={time}
          lightColor={lightColor}
        />
      )}
    </group>
  )
}

function DoubleSlit({
  wavelength,
  slitSeparation,
  screenDistance,
  showWavefronts,
  showRays,
  showPhaseDifference,
  time,
  lightColor,
}: {
  wavelength: number;
  slitSeparation: number;
  screenDistance: number;
  showWavefronts: boolean;
  showRays: boolean;
  showPhaseDifference: boolean;
  time: number;
  lightColor: string;
}) {
  // Constants for visualization
  const sourcePosition = -10
  const slitPosition = -5
  const screenPositionX = slitPosition + screenDistance * 10 // Scale for visualization

  // Convert wavelength from nm to visualization units
  const visualWavelength = wavelength / 100

  // Convert slit separation from mm to visualization units
  const visualSlitSeparation = slitSeparation * 10

  // Calculate positions of the two slits
  const slit1Y = visualSlitSeparation / 2
  const slit2Y = -visualSlitSeparation / 2

  // Calculate the interference pattern
  const screenHeight = 15
  const numScreenPoints = 300
  const screenIntensity = useMemo(() => {
    const intensities = []

    for (let i = 0; i < numScreenPoints; i++) {
      const y = -screenHeight / 2 + (i / (numScreenPoints - 1)) * screenHeight

      // Calculate path length difference
      const r1 = Math.sqrt(Math.pow(screenPositionX - slitPosition, 2) + Math.pow(y - slit1Y, 2))
      const r2 = Math.sqrt(Math.pow(screenPositionX - slitPosition, 2) + Math.pow(y - slit2Y, 2))
      const pathDifference = r2 - r1

      // Calculate phase difference
      const phaseDifference = (2 * Math.PI * pathDifference) / visualWavelength

      // Calculate intensity using interference equation
      const intensity = Math.pow(Math.cos(phaseDifference / 2), 2)

      intensities.push({ y, intensity })
    }

    return intensities
  }, [screenPositionX, slitPosition, slit1Y, slit2Y, visualWavelength, screenHeight, numScreenPoints])

  // Generate wavefronts
  const wavefronts = useMemo(() => {
    if (!showWavefronts) return []

    const fronts = []
    const numWavefronts = 15
    const maxRadius = 20

    // Incident wavefronts (from source to slits)
    for (let i = 0; i < numWavefronts; i++) {
      const radius = (i * visualWavelength + time * 5) % maxRadius
      if (radius > 0.5) {
        const points: [number, number, number][] = []
        for (let j = 0; j <= 32; j++) {
          const angle = (j / 32) * Math.PI
          const x = sourcePosition + radius * Math.cos(angle)
          const y = radius * Math.sin(angle)
          if (x <= slitPosition) {
            points.push([x, y, 0])
          }
        }
        if (points.length > 0) {
          fronts.push(points)
        }
      }
    }

    // Wavefronts from slit 1
    for (let i = 0; i < numWavefronts; i++) {
      const radius = (i * visualWavelength + time * 5) % maxRadius
      if (radius > 0.5) {
        const points: [number, number, number][] = []
        for (let j = 0; j <= 32; j++) {
          const angle = (j / 32) * Math.PI - Math.PI / 2
          const x = slitPosition + radius * Math.cos(angle)
          const y = slit1Y + radius * Math.sin(angle)
          if (x >= slitPosition && x <= screenPositionX) {
            points.push([x, y, 0])
          }
        }
        if (points.length > 0) {
          fronts.push(points)
        }
      }
    }

    // Wavefronts from slit 2
    for (let i = 0; i < numWavefronts; i++) {
      const radius = (i * visualWavelength + time * 5) % maxRadius
      if (radius > 0.5) {
        const points: [number, number, number][] = []
        for (let j = 0; j <= 32; j++) {
          const angle = (j / 32) * Math.PI - Math.PI / 2
          const x = slitPosition + radius * Math.cos(angle)
          const y = slit2Y + radius * Math.sin(angle)
          if (x >= slitPosition && x <= screenPositionX) {
            points.push([x, y, 0])
          }
        }
        if (points.length > 0) {
          fronts.push(points)
        }
      }
    }

    return fronts
  }, [showWavefronts, visualWavelength, time, sourcePosition, screenDistance])

  // Sample points on the screen for ray visualization
  const samplePoints = useMemo(() => {
    const points = []
    const numSamples = 11 // Odd number to include center

    for (let i = 0; i < numSamples; i++) {
      const y = -screenHeight / 2 + (i / (numSamples - 1)) * screenHeight

      // Find the closest point in screenIntensity
      const closestPoint = screenIntensity.reduce((prev, curr) => {
        return Math.abs(curr.y - y) < Math.abs(prev.y - y) ? curr : prev
      })

      points.push({
        y,
        intensity: closestPoint.intensity,
      })
    }

    return points
  }, [screenHeight, screenIntensity])

  return (
    <group position={[0, 0, 0]}>
      {/* Light source */}
      <mesh position={[sourcePosition, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={1} />
      </mesh>
      <Text position={[sourcePosition, 1.5, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
        COHERENT SOURCE
      </Text>

      {/* Barrier with slits */}
      <mesh position={[slitPosition, 0, 0]}>
        <boxGeometry args={[0.2, screenHeight, 0.2]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Slits */}
      <mesh position={[slitPosition, slit1Y, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color="black" transparent opacity={0} />
      </mesh>
      <Text position={[slitPosition - 1.5, slit1Y, 0]} fontSize={0.6} color="#FFFF00" anchorX="center">
        SLIT 1
      </Text>

      <mesh position={[slitPosition, slit2Y, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color="black" transparent opacity={0} />
      </mesh>
      <Text position={[slitPosition - 1.5, slit2Y, 0]} fontSize={0.6} color="#FFFF00" anchorX="center">
        SLIT 2
      </Text>

      {/* Screen */}
      <mesh position={[screenPositionX, 0, 0]}>
        <boxGeometry args={[0.1, screenHeight, 0.5]} />
        <meshStandardMaterial color="#DDDDDD" />
      </mesh>
      <Text position={[screenPositionX, screenHeight / 2 + 1.5, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
        SCREEN
      </Text>

      {/* Interference pattern on screen */}
      {screenIntensity.map((point, index) => {
        // Skip some points for performance
        if (index % 3 !== 0) return null

        return (
          <mesh key={index} position={[screenPositionX + 0.1, point.y, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.1]} />
            <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={point.intensity} />
          </mesh>
        )
      })}

      {/* Wavefronts */}
      {wavefronts?.map((points: [number, number, number][], index) => (
        <Line key={`wavefront-${index}`} points={points} color={lightColor} lineWidth={1} opacity={0.5} />
      ))}

      {/* Light rays */}
      {showRays &&
        samplePoints.map((point, index) => {
          // Ray from source to slit 1
          const ray1SourceToSlit: [number, number, number][] = [
            [sourcePosition, 0, 0],
            [slitPosition, slit1Y, 0],
          ]

          // Ray from slit 1 to screen
          const ray1SlitToScreen: [number, number, number][] = [
            [slitPosition, slit1Y, 0],
            [screenPositionX, point.y, 0],
          ]

          // Ray from source to slit 2
          const ray2SourceToSlit: [number, number, number][] = [
            [sourcePosition, 0, 0],
            [slitPosition, slit2Y, 0],
          ]

          // Ray from slit 2 to screen
          const ray2SlitToScreen: [number, number, number][] = [
            [slitPosition, slit2Y, 0],
            [screenPositionX, point.y, 0],
          ]

          return (
            <group key={`rays-${index}`}>
              <Line points={ray1SourceToSlit} color={lightColor} lineWidth={1} opacity={0.3} />
              <Line points={ray1SlitToScreen} color={lightColor} lineWidth={1} opacity={point.intensity * 0.7} />
              <Line points={ray2SourceToSlit} color={lightColor} lineWidth={1} opacity={0.3} />
              <Line points={ray2SlitToScreen} color={lightColor} lineWidth={1} opacity={point.intensity * 0.7} />
            </group>
          )
        })}

      {/* Phase difference visualization */}
      {showPhaseDifference && (
        <group position={[0, -screenHeight / 2 - 4, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
            PATH DIFFERENCE & PHASE
          </Text>

          {samplePoints.map((point, index) => {
            // Calculate path lengths
            const r1 = Math.sqrt(Math.pow(screenPositionX - slitPosition, 2) + Math.pow(point.y - slit1Y, 2))
            const r2 = Math.sqrt(Math.pow(screenPositionX - slitPosition, 2) + Math.pow(point.y - slit2Y, 2))
            const pathDifference = r2 - r1

            // Calculate phase difference
            const phaseDifference = (2 * Math.PI * pathDifference) / visualWavelength
            const phaseDegrees = ((phaseDifference * 180) / Math.PI) % 360

            // Determine if constructive or destructive
            const isConstructive = Math.abs(Math.sin(phaseDifference / 2)) < 0.3
            const isDestructive = Math.abs(Math.sin(phaseDifference / 2)) > 0.7

            if (index % 2 === 0) {
              return (
                <group key={`phase-${index}`} position={[screenPositionX, point.y, 0]}>
                  <Text
                    position={[2.5, 0, 0]}
                    fontSize={0.5}
                    color={isConstructive ? "#00FF00" : isDestructive ? "#FF0000" : "#FFFFFF"}
                    anchorX="left"
                  >
                    ΔL = {pathDifference.toFixed(2)} λ, Δφ = {phaseDegrees.toFixed(0)}°
                    {isConstructive ? " (CONSTRUCTIVE)" : isDestructive ? " (DESTRUCTIVE)" : ""}
                  </Text>
                </group>
              )
            }
            return null
          })}
        </group>
      )}

      {/* Explanation */}
      <group position={[0, screenHeight / 2 + 8, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.9} color="#FFFFFF" anchorX="center">
          YOUNG'S DOUBLE SLIT EXPERIMENT
        </Text>

        <Text position={[0, -2, 0]} fontSize={0.7} color="#FFFFFF" anchorX="center">
          Demonstrates the wave nature of light through interference
        </Text>

        <Text position={[0, -4, 0]} fontSize={0.6} color="#00FF00" anchorX="center">
          BRIGHT FRINGES: Constructive interference (path difference = mλ)
        </Text>

        <Text position={[0, -6, 0]} fontSize={0.6} color="#FF0000" anchorX="center">
          DARK FRINGES: Destructive interference (path difference = (m+1/2)λ)
        </Text>

        <Text position={[0, -8, 0]} fontSize={0.6} color="#FFFF00" anchorX="center">
          Fringe spacing: y = (λL)/d where L = screen distance, d = slit separation
        </Text>
      </group>

      {/* Formulas and calculations */}
      <group position={[0, -screenHeight / 2 - 10, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
          Wavelength: {wavelength} nm, Slit Separation: {slitSeparation} mm, Screen Distance: {screenDistance} m
        </Text>

        <Text position={[0, -2, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
          Fringe Spacing: {(((wavelength * 1e-9 * screenDistance) / (slitSeparation * 1e-3)) * 1000).toFixed(2)} mm
        </Text>
      </group>
    </group>
  )
}

function ThinFilm({
  wavelength,
  filmThickness,
  refractiveIndex,
  incidentAngle,
  showWavefronts,
  showRays,
  showPhaseDifference,
  time,
  lightColor,
}: {
  wavelength: number;
  filmThickness: number;
  refractiveIndex: number;
  incidentAngle: number;
  showWavefronts: boolean;
  showRays: boolean;
  showPhaseDifference: boolean;
  time: number;
  lightColor: string;
}) {
  // Constants for visualization
  const sourcePosition = -8
  const filmStartX = -4
  const filmEndX = 4
  const filmThicknessVisual = filmThickness / 100 // Scale for visualization

  // Convert wavelength from nm to visualization units
  const visualWavelength = wavelength / 100

  // Convert incident angle to radians
  const incidentAngleRad = (incidentAngle * Math.PI) / 180

  // Calculate refracted angle using Snell's law
  const refractedAngleRad = Math.asin(Math.sin(incidentAngleRad) / refractiveIndex)

  // Calculate reflection points
  const entryPoint = [filmStartX, 0, 0]
  const exitPoint = [filmStartX + 2 * filmThicknessVisual * Math.tan(refractedAngleRad), -filmThicknessVisual, 0]

  // Calculate optical path length for the ray in the film
  const pathInFilm = (2 * filmThicknessVisual) / Math.cos(refractedAngleRad)
  const opticalPathLength = pathInFilm * refractiveIndex

  // Calculate phase difference
  // Phase shift due to path difference
  const pathPhaseDiff = (2 * Math.PI * opticalPathLength) / visualWavelength

  // Additional phase shift due to reflection (π if n1 < n2, 0 if n1 > n2)
  // For air to film, n1 (air) < n2 (film), so there's a π phase shift
  const reflectionPhaseDiff = Math.PI

  // Total phase difference
  const totalPhaseDiff = pathPhaseDiff + reflectionPhaseDiff

  // Determine if constructive or destructive interference
  const isConstructive = Math.cos(totalPhaseDiff / 2) > 0.7
  const isDestructive = Math.cos(totalPhaseDiff / 2) < 0.3

  // Calculate the interference color
  const interferenceResult = Math.pow(Math.cos(totalPhaseDiff / 2), 2)

  // Generate wavefronts
  const wavefronts = useMemo(() => {
    if (!showWavefronts) return []

    const fronts = []
    const numWavefronts = 10
    const maxRadius = 15

    // Incident wavefronts (from source to film)
    for (let i = 0; i < numWavefronts; i++) {
      const radius = (i * visualWavelength + time * 5) % maxRadius
      if (radius > 0.5) {
        const points: [number, number, number][] = []
        for (let j = 0; j <= 32; j++) {
          const angle = (j / 32) * Math.PI - Math.PI / 2 + incidentAngleRad
          const x = sourcePosition + radius * Math.cos(angle)
          const y = radius * Math.sin(angle)
          if (x <= filmStartX) {
            points.push([x, y, 0])
          }
        }
        if (points.length > 0) {
          fronts.push(points)
        }
      }
    }

    // Wavefronts in the film
    for (let i = 0; i < numWavefronts; i++) {
      const radius = ((i * visualWavelength) / refractiveIndex + time * 5) % maxRadius
      if (radius > 0.5) {
        const points: [number, number, number][] = []
        for (let j = 0; j <= 32; j++) {
          const angle = (j / 32) * Math.PI - Math.PI / 2 + refractedAngleRad
          const x = entryPoint[0] + radius * Math.cos(angle)
          const y = entryPoint[1] + radius * Math.sin(angle)
          if (x >= filmStartX && x <= filmEndX && y <= 0 && y >= -filmThicknessVisual) {
            points.push([x, y, 0])
          }
        }
        if (points.length > 0) {
          fronts.push(points)
        }
      }
    }

    // Reflected wavefronts from top surface
    for (let i = 0; i < numWavefronts; i++) {
      const radius = (i * visualWavelength + time * 5) % maxRadius
      if (radius >  i++) {
      const radius = (i * visualWavelength + time * 5) % maxRadius
      if (radius > 0.5) {
        const points: [number, number, number][] = []
        for (let j = 0; j <= 32; j++) {
          const angle = (j / 32) * Math.PI - Math.PI / 2 - incidentAngleRad
          const x = entryPoint[0] + radius * Math.cos(angle)
          const y = entryPoint[1] + radius * Math.sin(angle)
          if (x <= filmStartX) {
            points.push([x, y, 0])
          }
        }
        if (points.length > 0) {
          fronts.push(points)
        }
      }
    }

    // Reflected wavefronts from bottom surface
    for (let i = 0; i < numWavefronts; i++) {
      const radius = (i * visualWavelength + time * 5 + opticalPathLength) % maxRadius
      if (radius > 0.5) {
        const points: [number, number, number][] = []
        for (let j = 0; j <= 32; j++) {
          const angle = (j / 32) * Math.PI - Math.PI / 2 - incidentAngleRad
          const x = exitPoint[0] + radius * Math.cos(angle)
          const y = exitPoint[1] - radius * Math.sin(angle)
          if (x <= filmStartX) {
            points.push([x, y, 0])
          }
        }
        if (points.length > 0) {
          fronts.push(points)
        }
      }
    }

    return fronts
  }, [showWavefronts, visualWavelength, time, sourcePosition, filmThickness])

  return (
    <group position={[0, 0, 0]}>
      {/* Light source */}
      <mesh position={[sourcePosition, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={1} />
      </mesh>
      <Text position={[sourcePosition, 1.5, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
        LIGHT SOURCE
      </Text>

      {/* Thin film */}
      <mesh position={[0, -filmThicknessVisual / 2, 0]}>
        <boxGeometry args={[filmEndX - filmStartX, filmThicknessVisual, 0.2]} />
        <meshStandardMaterial color="#88CCFF" transparent={true} opacity={0.5} roughness={0.1} metalness={0.2} />
      </mesh>

      {/* Film boundaries */}
      <Line
        points={[
          [filmStartX, 0, 0],
          [filmEndX, 0, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
      />
      <Line
        points={[
          [filmStartX, -filmThicknessVisual, 0],
          [filmEndX, -filmThicknessVisual, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
      />

      <Text position={[filmStartX - 2, 0, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
        AIR (n=1.0)
      </Text>
      <Text position={[filmStartX - 2, -filmThicknessVisual / 2, 0]} fontSize={0.6} color="#FFFF00" anchorX="center">
        FILM (n={refractiveIndex.toFixed(2)})
      </Text>
      <Text position={[filmStartX - 2, -filmThicknessVisual - 1, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
        SUBSTRATE
      </Text>

      {/* Wavefronts */}
      {wavefronts?.map((points: [number, number, number][], index) => (
        <Line key={`wavefront-${index}`} points={points} color={lightColor} lineWidth={1} opacity={0.5} />
      ))}

      {/* Light rays */}
      {showRays && (
        <group>
          {/* Incident ray */}
          <Line points={[[sourcePosition, 0, 0], entryPoint]} color={lightColor} lineWidth={2} opacity={0.7} />

          {/* Reflected ray from top surface */}
          <Line
            points={[
              entryPoint,
              [entryPoint[0] - 5 * Math.cos(incidentAngleRad), entryPoint[1] + 5 * Math.sin(incidentAngleRad), 0],
            ]}
            color={lightColor}
            lineWidth={2}
            opacity={interferenceResult * 0.7}
          />

          {/* Refracted ray in film */}
          <Line points={[entryPoint, exitPoint]} color={lightColor} lineWidth={2} opacity={0.7} />

          {/* Reflected ray from bottom surface */}
          <Line
            points={[exitPoint, [exitPoint[0] - 2 * filmThicknessVisual * Math.tan(refractedAngleRad), 0, 0]]}
            color={lightColor}
            lineWidth={2}
            opacity={0.7}
          />

          {/* Reflected ray from bottom surface to observer */}
          <Line
            points={[
              [exitPoint[0] - 2 * filmThicknessVisual * Math.tan(refractedAngleRad), 0, 0],
              [entryPoint[0] - 5 * Math.cos(incidentAngleRad), entryPoint[1] + 5 * Math.sin(incidentAngleRad), 0],
            ]}
            color={lightColor}
            lineWidth={2}
            opacity={interferenceResult * 0.7}
          />
        </group>
      )}

      {/* Interference result visualization */}
      <mesh position={[filmStartX - 6, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color={lightColor} emissive={lightColor} emissiveIntensity={interferenceResult} />
      </mesh>
      <Text position={[filmStartX - 6, -2, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
        REFLECTED LIGHT
      </Text>
      <Text
        position={[filmStartX - 6, -3, 0]}
        fontSize={0.6}
        color={isConstructive ? "#00FF00" : isDestructive ? "#FF0000" : "#FFFFFF"}
        anchorX="center"
      >
        {isConstructive ? "CONSTRUCTIVE" : isDestructive ? "DESTRUCTIVE" : "PARTIAL"} INTERFERENCE
      </Text>

      {/* Phase difference visualization */}
      {showPhaseDifference && (
        <group position={[0, -filmThicknessVisual - 5, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
            PHASE ANALYSIS
          </Text>

          <Text position={[0, -1.5, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
            Optical Path: {opticalPathLength.toFixed(2)} units = {(opticalPathLength / visualWavelength).toFixed(2)}λ
          </Text>

          <Text position={[0, -3, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
            Path Phase Difference: {((pathPhaseDiff * 180) / Math.PI).toFixed(0)}°
          </Text>

          <Text position={[0, -4.5, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
            Reflection Phase Shift: {((reflectionPhaseDiff * 180) / Math.PI).toFixed(0)}°
          </Text>

          <Text
            position={[0, -6, 0]}
            fontSize={0.6}
            color={isConstructive ? "#00FF00" : isDestructive ? "#FF0000" : "#FFFFFF"}
            anchorX="center"
          >
            Total Phase Difference: {((totalPhaseDiff * 180) / Math.PI).toFixed(0)}° (
            {isConstructive ? "CONSTRUCTIVE" : isDestructive ? "DESTRUCTIVE" : "PARTIAL"})
          </Text>
        </group>
      )}

      {/* Explanation */}
      <group position={[0, 12, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.9} color="#FFFFFF" anchorX="center">
          THIN FILM INTERFERENCE
        </Text>

        <Text position={[0, -2, 0]} fontSize={0.7} color="#FFFFFF" anchorX="center">
          Interference between light reflected from top and bottom surfaces
        </Text>

        <Text position={[0, -4, 0]} fontSize={0.6} color="#FFFF00" anchorX="center">
          Phase difference depends on: film thickness, refractive index, wavelength, and angle
        </Text>

        <Text position={[0, -6, 0]} fontSize={0.6} color="#00FF00" anchorX="center">
          Constructive: 2nt cos(θ) = (m+1/2)λ
        </Text>

        <Text position={[0, -8, 0]} fontSize={0.6} color="#FF0000" anchorX="center">
          Destructive: 2nt cos(θ) = mλ
        </Text>

        <Text position={[0, -10, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
          Applications: anti-reflection coatings, soap bubbles, oil slicks
        </Text>
      </group>

      {/* Formulas and calculations */}
      <group position={[0, -filmThicknessVisual - 12, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
          Wavelength: {wavelength} nm, Film Thickness: {filmThickness} nm, n = {refractiveIndex.toFixed(2)}
        </Text>

        <Text position={[0, -2, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
          Optical Path: 2nt cos(θ) = {(2 * refractiveIndex * filmThickness * Math.cos(refractedAngleRad)).toFixed(0)} nm
        </Text>
      </group>
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
