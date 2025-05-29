"use client"

import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3 } from "three"

export default function WaveOpticsDiffraction() {
  const [diffractionType, setDiffractionType] = useState("single-slit")
  const [wavelength, setWavelength] = useState(550) // in nm
  const [slitWidth, setSlitWidth] = useState(0.2) // in mm
  const [slitCount, setSlitCount] = useState(3) // for diffraction grating
  const [slitSpacing, setSlitSpacing] = useState(0.5) // in mm, for diffraction grating
  const [screenDistance, setScreenDistance] = useState(1) // in m
  const [showWavefronts, setShowWavefronts] = useState(true)
  const [showRays, setShowRays] = useState(true)
  const [showIntensity, setShowIntensity] = useState(true)
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
        <h2 className="text-xl font-bold mb-4">Wave Optics: Diffraction</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Diffraction Type:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDiffractionType("single-slit")}
                className={`px-2 py-1 rounded ${diffractionType === "single-slit" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Single Slit
              </button>
              <button
                onClick={() => setDiffractionType("grating")}
                className={`px-2 py-1 rounded ${diffractionType === "grating" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Diffraction Grating
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

          <div>
            <label className="block mb-1">Slit Width: {slitWidth.toFixed(2)} mm</label>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={slitWidth}
              onChange={(e) => setSlitWidth(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {diffractionType === "grating" && (
            <>
              <div>
                <label className="block mb-1">Number of Slits: {slitCount}</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={slitCount}
                  onChange={(e) => setSlitCount(Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Slit Spacing: {slitSpacing.toFixed(2)} mm</label>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={slitSpacing}
                  onChange={(e) => setSlitSpacing(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

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
                checked={showIntensity}
                onChange={() => setShowIntensity(!showIntensity)}
                className="mr-2"
              />
              Intensity Pattern
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
        <DiffractionScene
          diffractionType={diffractionType}
          wavelength={wavelength}
          slitWidth={slitWidth}
          slitCount={slitCount}
          slitSpacing={slitSpacing}
          screenDistance={screenDistance}
          showWavefronts={showWavefronts}
          showRays={showRays}
          showIntensity={showIntensity}
          paused={paused}
          lightColor={lightColor}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function DiffractionScene({
  diffractionType,
  wavelength,
  slitWidth,
  slitCount,
  slitSpacing,
  screenDistance,
  showWavefronts,
  showRays,
  showIntensity,
  paused,
  lightColor,
}: {
  diffractionType: string;
  wavelength: number;
  slitWidth: number;
  slitCount: number;
  slitSpacing: number;
  screenDistance: number;
  showWavefronts: boolean;
  showRays: boolean;
  showIntensity: boolean;
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

  // Render the appropriate diffraction type
  return (
    <group position={[0, 0, 0]} scale={0.7}>
      {diffractionType === "single-slit" ? (
        <SingleSlitDiffraction
          wavelength={wavelength}
          slitWidth={slitWidth}
          screenDistance={screenDistance}
          showWavefronts={showWavefronts}
          showRays={showRays}
          showIntensity={showIntensity}
          time={time}
          lightColor={lightColor}
        />
      ) : (
        <DiffractionGrating
          wavelength={wavelength}
          slitWidth={slitWidth}
          slitCount={slitCount}
          slitSpacing={slitSpacing}
          screenDistance={screenDistance}
          showWavefronts={showWavefronts}
          showRays={showRays}
          showIntensity={showIntensity}
          time={time}
          lightColor={lightColor}
        />
      )}
    </group>
  )
}

function SingleSlitDiffraction({
  wavelength,
  slitWidth,
  screenDistance,
  showWavefronts,
  showRays,
  showIntensity,
  time,
  lightColor,
}: {
  wavelength: number;
  slitWidth: number;
  screenDistance: number;
  showWavefronts: boolean;
  showRays: boolean;
  showIntensity: boolean;
  time: number;
  lightColor: string;
}) {
  // Constants for visualization
  const sourcePosition = -10
  const slitPosition = -5
  const screenPositionX = slitPosition + screenDistance * 10 // Scale for visualization

  // Convert wavelength from nm to visualization units
  const visualWavelength = wavelength / 100

  // Convert slit width from mm to visualization units
  const visualSlitWidth = slitWidth * 5

  // Calculate the diffraction pattern
  const screenHeight = 15
  const numScreenPoints = 300
  const screenIntensity = useMemo(() => {
    const intensities = []
    const k = (2 * Math.PI) / visualWavelength // Wave number

    for (let i = 0; i < numScreenPoints; i++) {
      const y = -screenHeight / 2 + (i / (numScreenPoints - 1)) * screenHeight

      // Calculate angle from slit to screen point
      const theta = Math.atan2(y, screenPositionX - slitPosition)

      // Single slit diffraction formula: I = I₀ * [sin(α)/α]²
      // where α = (π*a*sin(θ))/λ, a is slit width
      const alpha = (Math.PI * visualSlitWidth * Math.sin(theta)) / visualWavelength

      // Avoid division by zero
      let intensity
      if (Math.abs(alpha) < 0.001) {
        intensity = 1.0 // Maximum intensity at center
      } else {
        intensity = Math.pow(Math.sin(alpha) / alpha, 2)
      }

      intensities.push({ y, intensity })
    }

    return intensities
  }, [screenPositionX, slitPosition, visualSlitWidth, visualWavelength, screenHeight, numScreenPoints])

  // Generate wavefronts
  const wavefronts = useMemo(() => {
    if (!showWavefronts) return []

    const fronts = []
    const numWavefronts = 15
    const maxRadius = 20

    // Incident wavefronts (from source to slit)
    for (let i = 0; i < numWavefronts; i++) {
      const radius = (i * visualWavelength + time * 5) % maxRadius
      if (radius > 0.5) {
        const points = []
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

    // Diffracted wavefronts from slit
    for (let i = 0; i < numWavefronts; i++) {
      const radius = (i * visualWavelength + time * 5) % maxRadius
      if (radius > 0.5) {
        const points = []
        // Create semicircular wavefronts emanating from the slit
        for (let j = 0; j <= 32; j++) {
          const angle = (j / 32) * Math.PI - Math.PI / 2
          const x = slitPosition + radius * Math.cos(angle)
          const y = radius * Math.sin(angle)
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
  }, [showWavefronts, visualWavelength, time, sourcePosition, slitPosition, screenPositionX])

  // Sample points on the screen for ray visualization
  const samplePoints = useMemo(() => {
    if (!showRays) return []

    const points = []
    const numSamples = 15 // Odd number to include center

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
  }, [showRays, screenHeight, screenIntensity])

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

      {/* Barrier with slit */}
      <mesh position={[slitPosition, 0, 0]}>
        <boxGeometry args={[0.2, screenHeight, 0.2]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Slit */}
      <mesh position={[slitPosition, 0, 0]}>
        <boxGeometry args={[0.3, visualSlitWidth, 0.3]} />
        <meshStandardMaterial color="black" transparent opacity={0} />
      </mesh>
      <Text position={[slitPosition - 1.5, 0, 0]} fontSize={0.6} color="#FFFF00" anchorX="center">
        SLIT
      </Text>
      <Text position={[slitPosition - 1.5, -1.5, 0]} fontSize={0.5} color="#FFFFFF" anchorX="center">
        Width: {slitWidth} mm
      </Text>

      {/* Screen */}
      <mesh position={[screenPositionX, 0, 0]}>
        <boxGeometry args={[0.1, screenHeight, 0.5]} />
        <meshStandardMaterial color="#DDDDDD" />
      </mesh>
      <Text position={[screenPositionX, screenHeight / 2 + 1.5, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
        SCREEN
      </Text>

      {/* Diffraction pattern on screen */}
      {showIntensity &&
        screenIntensity.map((point, index) => {
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
      {wavefronts.map((points, index) => (
        <Line key={`wavefront-${index}`} points={points.map(p => [p[0], p[1], 0] as [number, number, number])} color={lightColor} lineWidth={1} opacity={0.5} />
      ))}

      {/* Light rays */}
      {showRays &&
        screenIntensity.map((point, index) => {
          if (index % 10 === 0) {
            const raySourceToSlit = [[sourcePosition, 0, 0], [slitPosition, 0, 0]] as [number, number, number][]
            const raySlitToScreen = [[slitPosition, 0, 0], [screenPositionX, point.y, 0]] as [number, number, number][]
            return (
              <group key={`rays-${index}`}>
                <Line points={raySourceToSlit} color={lightColor} lineWidth={1} opacity={0.3} />
                <Line points={raySlitToScreen} color={lightColor} lineWidth={1} opacity={point.intensity * 0.7} />
              </group>
            )
          }
          return null
        })}

      {/* Intensity graph */}
      {showIntensity && (
        <group position={[screenPositionX + 3, 0, 0]}>
          <Text position={[0, screenHeight / 2 + 1, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
            INTENSITY PATTERN
          </Text>

          {/* Intensity curve */}
          <Line
            points={screenIntensity.map((point) => [point.intensity * 3, point.y, 0])}
            color={lightColor}
            lineWidth={2}
          />

          {/* Axis */}
          <Line
            points={[
              [0, -screenHeight / 2, 0],
              [0, screenHeight / 2, 0],
            ]}
            color="#FFFFFF"
            lineWidth={1}
          />

          {/* Intensity markers */}
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
            <group key={`marker-${i}`}>
              <Line
                points={[
                  [intensity * 3, -screenHeight / 2, 0],
                  [intensity * 3, -screenHeight / 2 + 0.3, 0],
                ]}
                color="#FFFFFF"
                lineWidth={1}
              />
              <Text
                position={[intensity * 3, -screenHeight / 2 - 0.5, 0]}
                fontSize={0.3}
                color="#FFFFFF"
                anchorX="center"
              >
                {intensity}
              </Text>
            </group>
          ))}

          <Text position={[1.5, -screenHeight / 2 - 1, 0]} fontSize={0.4} color="#FFFFFF" anchorX="center">
            Relative Intensity
          </Text>
        </group>
      )}

      {/* Explanation */}
      <group position={[0, screenHeight / 2 + 8, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.9} color="#FFFFFF" anchorX="center">
          SINGLE SLIT DIFFRACTION
        </Text>

        <Text position={[0, -2, 0]} fontSize={0.7} color="#FFFFFF" anchorX="center">
          Light waves bend around edges and interfere with each other
        </Text>

        <Text position={[0, -4, 0]} fontSize={0.6} color="#FFFF00" anchorX="center">
          Intensity pattern: I = I₀ [sin(α)/α]² where α = (πa sin θ)/λ
        </Text>

        <Text position={[0, -6, 0]} fontSize={0.6} color="#00FF00" anchorX="center">
          Central maximum is twice as wide as side maxima
        </Text>

        <Text position={[0, -8, 0]} fontSize={0.6} color="#FF0000" anchorX="center">
          Minima occur at angles where sin θ = mλ/a (m = ±1, ±2, ...)
        </Text>
      </group>

      {/* Formulas and calculations */}
      <group position={[0, -screenHeight / 2 - 5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
          Wavelength: {wavelength} nm, Slit Width: {slitWidth} mm
        </Text>

        <Text position={[0, -2, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
          First minimum at angle: {(() => {
            const angle = Math.atan((wavelength * 1e-9) / (slitWidth * 1e-3)) * (180 / Math.PI);
            return angle.toFixed(2);
          })()}°
        </Text>
      </group>
    </group>
  )
}

function DiffractionGrating({
  wavelength,
  slitWidth,
  slitCount,
  slitSpacing,
  screenDistance,
  showWavefronts,
  showRays,
  showIntensity,
  time,
  lightColor,
}: {
  wavelength: number;
  slitWidth: number;
  slitCount: number;
  slitSpacing: number;
  screenDistance: number;
  showWavefronts: boolean;
  showRays: boolean;
  showIntensity: boolean;
  time: number;
  lightColor: string;
}) {
  // Constants for visualization
  const sourcePosition = -10
  const gratingPosition = -5
  const screenPositionX = gratingPosition + screenDistance * 10 // Scale for visualization

  // Convert wavelength from nm to visualization units
  const visualWavelength = wavelength / 100

  // Convert slit width and spacing from mm to visualization units
  const visualSlitWidth = slitWidth * 5
  const visualSlitSpacing = slitSpacing * 5

  // Calculate total width of the grating
  const gratingWidth = (slitCount - 1) * visualSlitSpacing + visualSlitWidth

  // Calculate positions of all slits
  const slitPositions = useMemo(() => {
    const positions = []
    const startY = -gratingWidth / 2 + visualSlitWidth / 2

    for (let i = 0; i < slitCount; i++) {
      positions.push(startY + i * visualSlitSpacing)
    }

    return positions
  }, [slitCount, visualSlitSpacing, visualSlitWidth, gratingWidth])

  // Calculate the diffraction pattern
  const screenHeight = 15
  const numScreenPoints = 300
  const screenIntensity = useMemo(() => {
    const intensities = []
    const k = (2 * Math.PI) / visualWavelength // Wave number

    for (let i = 0; i < numScreenPoints; i++) {
      const y = -screenHeight / 2 + (i / (numScreenPoints - 1)) * screenHeight

      // Calculate angle from grating center to screen point
      const theta = Math.atan2(y, screenPositionX - gratingPosition)

      // Single slit factor: [sin(α)/α]² where α = (π*a*sin(θ))/λ
      const alpha = (Math.PI * visualSlitWidth * Math.sin(theta)) / visualWavelength
      let singleSlitFactor
      if (Math.abs(alpha) < 0.001) {
        singleSlitFactor = 1.0
      } else {
        singleSlitFactor = Math.pow(Math.sin(alpha) / alpha, 2)
      }

      // Multiple slit factor: [sin(Nβ)/sin(β)]² where β = (π*d*sin(θ))/λ
      const beta = (Math.PI * visualSlitSpacing * Math.sin(theta)) / visualWavelength
      let multipleSlitFactor
      if (Math.abs(beta) < 0.001) {
        multipleSlitFactor = Math.pow(slitCount, 2)
      } else {
        multipleSlitFactor = Math.pow(Math.sin(slitCount * beta) / Math.sin(beta), 2)
      }

      // Total intensity is the product of the two factors
      const intensity = (singleSlitFactor * multipleSlitFactor) / Math.pow(slitCount, 2)

      intensities.push({ y, intensity })
    }

    return intensities
  }, [
    gratingPosition,
    screenPositionX,
    visualSlitWidth,
    visualSlitSpacing,
    visualWavelength,
    slitCount,
    screenHeight,
    numScreenPoints,
  ])

  // Generate wavefronts
  const wavefronts = useMemo(() => {
    if (!showWavefronts) return []

    const fronts = []
    const numWavefronts = 15
    const maxRadius = 20

    // Incident wavefronts (from source to grating)
    for (let i = 0; i < numWavefronts; i++) {
      const radius = (i * visualWavelength + time * 5) % maxRadius
      if (radius > 0.5) {
        const points = []
        for (let j = 0; j <= 32; j++) {
          const angle = (j / 32) * Math.PI
          const x = sourcePosition + radius * Math.cos(angle)
          const y = radius * Math.sin(angle)
          if (x <= gratingPosition) {
            points.push([x, y, 0])
          }
        }
        if (points.length > 0) {
          fronts.push(points)
        }
      }
    }

    // Diffracted wavefronts from each slit
    for (let slitIndex = 0; slitIndex < slitPositions.length; slitIndex++) {
      const slitY = slitPositions[slitIndex]

      for (let i = 0; i < numWavefronts; i++) {
        const radius = (i * visualWavelength + time * 5) % maxRadius
        if (radius > 0.5) {
          const points = []
          // Create semicircular wavefronts emanating from each slit
          for (let j = 0; j <= 32; j++) {
            const angle = (j / 32) * Math.PI - Math.PI / 2
            const x = gratingPosition + radius * Math.cos(angle)
            const y = slitY + radius * Math.sin(angle)
            if (x >= gratingPosition && x <= screenPositionX) {
              points.push([x, y, 0])
            }
          }
          if (points.length > 0) {
            fronts.push(points)
          }
        }
      }
    }

    return fronts
  }, [showWavefronts, visualWavelength, time, sourcePosition, gratingPosition, screenPositionX, slitPositions])

  // Sample points on the screen for ray visualization
  const samplePoints = useMemo(() => {
    if (!showRays) return []

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
  }, [showRays, screenHeight, screenIntensity])

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
      <mesh position={[gratingPosition, 0, 0]}>
        <boxGeometry args={[0.2, screenHeight, 0.2]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Slits */}
      {slitPositions.map((slitY, index) => (
        <mesh key={`slit-${index}`} position={[gratingPosition, slitY, 0]}>
          <boxGeometry args={[0.3, visualSlitWidth, 0.3]} />
          <meshStandardMaterial color="black" transparent opacity={0} />
        </mesh>
      ))}

      <Text position={[gratingPosition - 2, gratingWidth / 2 + 1, 0]} fontSize={0.6} color="#FFFF00" anchorX="center">
        DIFFRACTION GRATING
      </Text>
      <Text position={[gratingPosition - 2, gratingWidth / 2, 0]} fontSize={0.5} color="#FFFFFF" anchorX="center">
        {slitCount} slits, {slitSpacing} mm spacing
      </Text>

      {/* Screen */}
      <mesh position={[screenPositionX, 0, 0]}>
        <boxGeometry args={[0.1, screenHeight, 0.5]} />
        <meshStandardMaterial color="#DDDDDD" />
      </mesh>
      <Text position={[screenPositionX, screenHeight / 2 + 1.5, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
        SCREEN
      </Text>

      {/* Diffraction pattern on screen */}
      {showIntensity &&
        screenIntensity.map((point, index) => {
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
      {wavefronts.map((points, index) => (
        <Line key={`wavefront-${index}`} points={points.map(p => [p[0], p[1], 0] as [number, number, number])} color={lightColor} lineWidth={1} opacity={0.5} />
      ))}

      {/* Light rays */}
      {showRays &&
        samplePoints.map((point, index) => {
          return (
            <group key={`rays-${index}`}>
              {/* Rays from source to each slit */}
              {slitPositions.map((slitY, slitIndex) => {
                // Ray from source to slit
                const raySourceToSlit = [
                  [sourcePosition, 0, 0],
                  [gratingPosition, slitY, 0],
                ]

                // Ray from slit to screen
                const raySlitToScreen = [
                  [gratingPosition, slitY, 0],
                  [screenPositionX, point.y, 0],
                ]

                return (
                  <group key={`ray-${index}-${slitIndex}`}>
                    <Line points={[[sourcePosition, 0, 0], [slitPositions[slitIndex], 0, 0]] as [number, number, number][]} color={lightColor} lineWidth={1} opacity={0.2} />
                    <Line
                      points={[[slitPositions[slitIndex], 0, 0], [screenPositionX, point.y, 0]] as [number, number, number][]}
                      color={lightColor}
                      lineWidth={1}
                      opacity={(point.intensity * 0.5) / slitCount}
                    />
                  </group>
                )
              })}
            </group>
          )
        })}

      {/* Intensity graph */}
      {showIntensity && (
        <group position={[screenPositionX + 3, 0, 0]}>
          <Text position={[0, screenHeight / 2 + 1, 0]} fontSize={0.6} color="#FFFFFF" anchorX="center">
            INTENSITY PATTERN
          </Text>

          {/* Intensity curve */}
          <Line
            points={screenIntensity.map((point) => [point.intensity * 3, point.y, 0])}
            color={lightColor}
            lineWidth={2}
          />

          {/* Axis */}
          <Line
            points={[
              [0, -screenHeight / 2, 0],
              [0, screenHeight / 2, 0],
            ]}
            color="#FFFFFF"
            lineWidth={1}
          />

          {/* Intensity markers */}
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
            <group key={`marker-${i}`}>
              <Line
                points={[
                  [intensity * 3, -screenHeight / 2, 0],
                  [intensity * 3, -screenHeight / 2 + 0.3, 0],
                ]}
                color="#FFFFFF"
                lineWidth={1}
              />
              <Text
                position={[intensity * 3, -screenHeight / 2 - 0.5, 0]}
                fontSize={0.3}
                color="#FFFFFF"
                anchorX="center"
              >
                {intensity}
              </Text>
            </group>
          ))}

          <Text position={[1.5, -screenHeight / 2 - 1, 0]} fontSize={0.4} color="#FFFFFF" anchorX="center">
            Relative Intensity
          </Text>
        </group>
      )}

      {/* Explanation */}
      <group position={[0, screenHeight / 2 + 8, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.9} color="#FFFFFF" anchorX="center">
          DIFFRACTION GRATING
        </Text>

        <Text position={[0, -2, 0]} fontSize={0.7} color="#FFFFFF" anchorX="center">
          Multiple slits produce sharp, bright principal maxima
        </Text>

        <Text position={[0, -4, 0]} fontSize={0.6} color="#FFFF00" anchorX="center">
          Principal maxima occur at angles where d sin θ = mλ
        </Text>

        <Text position={[0, -6, 0]} fontSize={0.6} color="#00FF00" anchorX="center">
          More slits produce sharper, more intense maxima
        </Text>

        <Text position={[0, -8, 0]} fontSize={0.6} color="#FF0000" anchorX="center">
          Intensity pattern is the product of single-slit and multiple-slit factors
        </Text>
      </group>

      {/* Formulas and calculations */}
      <group position={[0, -screenHeight / 2 - 5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
          Wavelength: {wavelength} nm, Slit Spacing: {slitSpacing} mm
        </Text>

        <Text position={[0, -2, 0]} fontSize={0.7} color="#FFFF00" anchorX="center">
          First order maximum at angle:{" "}
          {(() => {
            const angle = Math.asin((wavelength * 1e-9) / (slitSpacing * 1e-3)) * (180 / Math.PI);
            return angle.toFixed(2);
          })()}°
        </Text>
      </group>
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
