"use client"

import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3 } from "three"

interface EMRadiationSceneProps {
  waveType: "monochromatic" | "broadband";
  frequency: number;
  intensity: number;
  reflectivity: number;
  targetMass: number;
  showEField: boolean;
  showBField: boolean;
  showPoyntingVector: boolean;
  showPressureForce: boolean;
  paused: boolean;
  demoMode: "basic" | "solar-sail" | "laser-cooling";
}

interface DemoProps extends EMRadiationSceneProps {
  time: number;
  targetPosition: number;
  targetVelocity: number;
  radiationPressure: number;
  pressureForce: number;
  targetAcceleration: number;
  energyTransferred: number;
  momentumTransferred: number;
}

interface ArrowHelperProps {
  dir: Vector3;
  origin: Vector3;
  length: number;
  color: string;
}

export default function EMRadiationPressure() {
  const [waveType, setWaveType] = useState<"monochromatic" | "broadband">("monochromatic")
  const [frequency, setFrequency] = useState(1)
  const [intensity, setIntensity] = useState(0.5)
  const [reflectivity, setReflectivity] = useState(0.5)
  const [targetMass, setTargetMass] = useState(1)
  const [showEField, setShowEField] = useState(true)
  const [showBField, setShowBField] = useState(true)
  const [showPoyntingVector, setShowPoyntingVector] = useState(true)
  const [showPressureForce, setShowPressureForce] = useState(true)
  const [paused, setPaused] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [demoMode, setDemoMode] = useState<"basic" | "solar-sail" | "laser-cooling">("basic")

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
        <h2 className="text-xl font-bold mb-4">EM Energy, Momentum & Radiation Pressure</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Demonstration Mode:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setDemoMode("basic")
                  setWaveType("monochromatic")
                  setFrequency(1)
                  setIntensity(0.5)
                  setReflectivity(0.5)
                  setTargetMass(1)
                }}
                className={`px-2 py-1 rounded ${demoMode === "basic" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Basic Radiation Pressure
              </button>
              <button
                onClick={() => {
                  setDemoMode("solar-sail")
                  setWaveType("broadband")
                  setFrequency(1.2)
                  setIntensity(0.8)
                  setReflectivity(0.9)
                  setTargetMass(0.5)
                }}
                className={`px-2 py-1 rounded ${demoMode === "solar-sail" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Solar Sail
              </button>
              <button
                onClick={() => {
                  setDemoMode("laser-cooling")
                  setWaveType("monochromatic")
                  setFrequency(1.5)
                  setIntensity(0.6)
                  setReflectivity(0.3)
                  setTargetMass(0.2)
                }}
                className={`px-2 py-1 rounded ${demoMode === "laser-cooling" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Laser Cooling
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="block">Wave Type:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setWaveType("monochromatic")}
                className={`px-2 py-1 rounded ${waveType === "monochromatic" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Monochromatic (Laser)
              </button>
              <button
                onClick={() => setWaveType("broadband")}
                className={`px-2 py-1 rounded ${waveType === "broadband" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Broadband (Sunlight)
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Frequency: {frequency.toFixed(1)} × 10¹⁴ Hz</label>
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
            <label className="block mb-1">Intensity: {intensity.toFixed(1)} kW/m²</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Target Reflectivity: {(reflectivity * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={reflectivity}
              onChange={(e) => setReflectivity(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Target Mass: {targetMass.toFixed(1)} g</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={targetMass}
              onChange={(e) => setTargetMass(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showEField}
                onChange={() => setShowEField(!showEField)}
                className="mr-2"
              />
              E-Field
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showBField}
                onChange={() => setShowBField(!showBField)}
                className="mr-2"
              />
              B-Field
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPoyntingVector}
                onChange={() => setShowPoyntingVector(!showPoyntingVector)}
                className="mr-2"
              />
              Poynting Vector
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPressureForce}
                onChange={() => setShowPressureForce(!showPressureForce)}
                className="mr-2"
              />
              Pressure Force
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
        <PerspectiveCamera makeDefault position={[0, 0, 20]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <EMRadiationScene
          waveType={waveType}
          frequency={frequency}
          intensity={intensity}
          reflectivity={reflectivity}
          targetMass={targetMass}
          showEField={showEField}
          showBField={showBField}
          showPoyntingVector={showPoyntingVector}
          showPressureForce={showPressureForce}
          paused={paused}
          demoMode={demoMode}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function EMRadiationScene(props: EMRadiationSceneProps) {
  const {
    waveType,
    frequency,
    intensity,
    reflectivity,
    targetMass,
    showEField,
    showBField,
    showPoyntingVector,
    showPressureForce,
    paused,
    demoMode,
  } = props;
  const timeRef = useRef(0)
  const [time, setTime] = useState(0)
  const [targetPosition, setTargetPosition] = useState(0)
  const [targetVelocity, setTargetVelocity] = useState(0)
  const [radiationPressure, setRadiationPressure] = useState(0)
  const [pressureForce, setPressureForce] = useState(0)
  const [targetAcceleration, setTargetAcceleration] = useState(0)
  const [energyTransferred, setEnergyTransferred] = useState(0)
  const [momentumTransferred, setMomentumTransferred] = useState(0)

  // Update time and physics
  useFrame((state, delta) => {
    if (!paused) {
      // Update time
      const newTime = timeRef.current + delta
      timeRef.current = newTime
      setTime(newTime)

      // Calculate radiation pressure
      // P = I/c for complete absorption, P = 2I/c for perfect reflection
      const c = 299792458 // Speed of light in m/s
      const absorptionFactor = 1 + reflectivity // 1 for absorption + reflectivity for reflection
      const pressureValue = (intensity * 1000 * absorptionFactor) / c // Convert kW/m² to W/m²
      setRadiationPressure(pressureValue)

      // Calculate force on target (F = P * A)
      // Assuming target area of 1 m² for simplicity
      const targetArea = 1 // m²
      const forceValue = pressureValue * targetArea // N
      setPressureForce(forceValue)

      // Calculate target acceleration (F = ma)
      const targetMassKg = targetMass / 1000 // Convert g to kg
      const accelerationValue = forceValue / targetMassKg // m/s²
      setTargetAcceleration(accelerationValue)

      // Update target velocity and position
      // Scale down for visualization
      const scaleFactor = demoMode === "laser-cooling" ? -0.01 : 0.01 // Negative for laser cooling
      const newVelocity = targetVelocity + accelerationValue * delta * scaleFactor
      setTargetVelocity(newVelocity)

      const newPosition = targetPosition + newVelocity * delta
      setTargetPosition(newPosition)

      // Calculate energy and momentum transfer
      const energyRate = intensity * 1000 * targetArea // W
      const newEnergyTransferred = energyTransferred + energyRate * delta
      setEnergyTransferred(newEnergyTransferred)

      const momentumRate = pressureValue * targetArea // N = kg·m/s²
      const newMomentumTransferred = momentumTransferred + momentumRate * delta
      setMomentumTransferred(newMomentumTransferred)
    }
  })

  // Render the appropriate demo
  switch (demoMode) {
    case "solar-sail":
      return (
        <SolarSailDemo
          waveType={waveType}
          frequency={frequency}
          intensity={intensity}
          reflectivity={reflectivity}
          targetMass={targetMass}
          showEField={showEField}
          showBField={showBField}
          showPoyntingVector={showPoyntingVector}
          showPressureForce={showPressureForce}
          time={time}
          targetPosition={targetPosition}
          targetVelocity={targetVelocity}
          radiationPressure={radiationPressure}
          pressureForce={pressureForce}
          targetAcceleration={targetAcceleration}
          energyTransferred={energyTransferred}
          momentumTransferred={momentumTransferred}
          paused={paused}
          demoMode={demoMode}
        />
      )
    case "laser-cooling":
      return (
        <LaserCoolingDemo
          waveType={waveType}
          frequency={frequency}
          intensity={intensity}
          reflectivity={reflectivity}
          targetMass={targetMass}
          showEField={showEField}
          showBField={showBField}
          showPoyntingVector={showPoyntingVector}
          showPressureForce={showPressureForce}
          time={time}
          targetPosition={targetPosition}
          targetVelocity={targetVelocity}
          radiationPressure={radiationPressure}
          pressureForce={pressureForce}
          targetAcceleration={targetAcceleration}
          energyTransferred={energyTransferred}
          momentumTransferred={momentumTransferred}
          paused={paused}
          demoMode={demoMode}
        />
      )
    default:
      return (
        <BasicRadiationPressureDemo
          waveType={waveType}
          frequency={frequency}
          intensity={intensity}
          reflectivity={reflectivity}
          targetMass={targetMass}
          showEField={showEField}
          showBField={showBField}
          showPoyntingVector={showPoyntingVector}
          showPressureForce={showPressureForce}
          time={time}
          targetPosition={targetPosition}
          targetVelocity={targetVelocity}
          radiationPressure={radiationPressure}
          pressureForce={pressureForce}
          targetAcceleration={targetAcceleration}
          energyTransferred={energyTransferred}
          momentumTransferred={momentumTransferred}
          paused={paused}
          demoMode={demoMode}
        />
      )
  }
}

function BasicRadiationPressureDemo(props: DemoProps) {
  const {
    waveType,
    frequency,
    intensity,
    reflectivity,
    targetMass,
    showEField,
    showBField,
    showPoyntingVector,
    showPressureForce,
    time,
    targetPosition,
    targetVelocity,
    radiationPressure,
    pressureForce,
    targetAcceleration,
    energyTransferred,
    momentumTransferred,
    paused,
    demoMode,
  } = props;
  // Constants for visualization
  const sourcePosition = -8
  const initialTargetPosition = 0
  const waveLength = 16
  const numWaves = 8
  const waveSpeed = 3 // For visualization

  // Calculate wavelength based on frequency (for visualization)
  const visualWavelength = 2 / frequency

  // Generate EM wave visualization
  const wavePoints = useMemo(() => {
    const points = []
    const numPoints = 100

    for (let i = 0; i <= numPoints; i++) {
      const x = sourcePosition + (i / numPoints) * waveLength
      points.push(x)
    }

    return points
  }, [sourcePosition, waveLength])

  return (
    <group>
      {/* EM Source - Laser or Light Source */}
      <group position={[sourcePosition, 0, 0]}>
        {waveType === "monochromatic" ? (
          // Laser source
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
              <meshStandardMaterial color="#4a90e2" />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
              <meshStandardMaterial color="#4a90e2" />
            </mesh>
          </group>
        ) : (
          // Broadband light source
          <group>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial
                color="#FFDD00"
                emissive="#FFDD00"
                emissiveIntensity={intensity * 2}
                roughness={0.3}
                metalness={0.8}
              />
            </mesh>
            {/* Light rays */}
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2
              return (
                <mesh 
                  key={i}
                  position={[Math.cos(angle) * 0.75, Math.sin(angle) * 0.75, 0]}
                  rotation={[0, 0, angle]}
                >
                  <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
                  <meshStandardMaterial
                    color="#FFDD00"
                    emissive="#FFDD00"
                    emissiveIntensity={intensity * 2}
                    roughness={0.3}
                    metalness={0.8}
                  />
                </mesh>
              )
            })}
          </group>
        )}
      </group>

      {/* Target Object */}
      <group position={[initialTargetPosition + targetPosition, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 2, 2]} />
          <meshStandardMaterial
            color={reflectivity > 0.5 ? "#DDDDDD" : "#555555"}
            roughness={1 - reflectivity}
            metalness={reflectivity}
          />
        </mesh>
      </group>

      {/* EM Wave Visualization */}
      {wavePoints.map((x, i) => {
        if (i % 2 === 0) return null // Skip every other point for performance

        const wavePhase = (time * waveSpeed - (x - sourcePosition)) / visualWavelength
        const amplitude = intensity * 1.5

        // E-field oscillates in y-direction
        const eFieldY = amplitude * Math.sin(2 * Math.PI * wavePhase)

        // B-field oscillates in z-direction (perpendicular to E-field and propagation)
        const bFieldZ = amplitude * 0.5 * Math.sin(2 * Math.PI * wavePhase)

        // Only show waves between source and target
        if (x < initialTargetPosition + targetPosition + 0.25 && x > sourcePosition) {
          return (
            <group key={i} position={[x, 0, 0]}>
              {/* E-field vector */}
              {showEField && (
                <group>
                  <Line
                    points={[
                      [0, 0, 0],
                      [0, eFieldY, 0],
                    ]}
                    color={waveType === "monochromatic" ? "#FF0000" : "#FFDD00"}
                    lineWidth={2}
                  />
                  <mesh position={[0, eFieldY / 2, 0]} scale={[0.05, Math.abs(eFieldY), 0.05]}>
                    <boxGeometry />
                    <meshBasicMaterial
                      color={waveType === "monochromatic" ? "#FF0000" : "#FFDD00"}
                      transparent
                      opacity={0.5}
                    />
                  </mesh>
                </group>
              )}

              {/* B-field vector */}
              {showBField && (
                <group>
                  <Line
                    points={[
                      [0, 0, 0],
                      [0, 0, bFieldZ],
                    ]}
                    color="#0088FF"
                    lineWidth={2}
                  />
                  <mesh position={[0, 0, bFieldZ / 2]} scale={[0.05, 0.05, Math.abs(bFieldZ)]}>
                    <boxGeometry />
                    <meshBasicMaterial color="#0088FF" transparent opacity={0.5} />
                  </mesh>
                </group>
              )}

              {/* Poynting vector (energy flow direction) */}
              {showPoyntingVector && i % 10 === 0 && (
                <ArrowHelper
                  dir={new Vector3(1, 0, 0)}
                  origin={new Vector3(0, eFieldY * 0.5, bFieldZ * 0.5)}
                  length={0.5}
                  color="#FFFFFF"
                />
              )}
            </group>
          )
        }
        return null
      })}

      {/* Pressure Force Visualization */}
      {showPressureForce && (
        <ArrowHelper
          dir={new Vector3(1, 0, 0)}
          origin={new Vector3(initialTargetPosition + targetPosition, 0, 0)}
          length={pressureForce * 10}
          color="#00FF00"
        />
      )}

      {/* Physics Information Display */}
      <group position={[0, 5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.7} color="white" anchorX="center">
          Electromagnetic Radiation Pressure
        </Text>

        <Text position={[0, -1, 0]} fontSize={0.4} color="white" anchorX="center">
          Radiation Pressure: {(radiationPressure * 1e9).toFixed(2)} nPa
        </Text>

        <Text position={[0, -1.7, 0]} fontSize={0.4} color="white" anchorX="center">
          Force on Target: {(pressureForce * 1e9).toFixed(2)} nN
        </Text>

        <Text position={[0, -2.4, 0]} fontSize={0.4} color="white" anchorX="center">
          Target Acceleration: {(targetAcceleration * 1e6).toFixed(2)} μm/s²
        </Text>

        <Text position={[0, -3.1, 0]} fontSize={0.4} color="white" anchorX="center">
          Target Velocity: {(targetVelocity * 1e3).toFixed(2)} mm/s
        </Text>

        <Text position={[0, -3.8, 0]} fontSize={0.4} color="white" anchorX="center">
          Energy Transferred: {energyTransferred.toFixed(2)} J
        </Text>

        <Text position={[0, -4.5, 0]} fontSize={0.4} color="white" anchorX="center">
          Momentum Transferred: {(momentumTransferred * 1e6).toFixed(2)} μN·s
        </Text>
      </group>

      {/* Explanation */}
      <group position={[0, -5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.5} color="white" anchorX="center">
          P = I/c for complete absorption
        </Text>

        <Text position={[0, -0.7, 0]} fontSize={0.5} color="white" anchorX="center">
          P = 2I/c for perfect reflection
        </Text>

        <Text position={[0, -1.4, 0]} fontSize={0.5} color="white" anchorX="center">
          P = (1+R)I/c for partial reflection (R = reflectivity)
        </Text>

        <Text position={[0, -2.1, 0]} fontSize={0.4} color="white" anchorX="center">
          EM waves carry both energy (E = hf) and momentum (p = E/c)
        </Text>

        <Text position={[0, -2.8, 0]} fontSize={0.4} color="white" anchorX="center">
          Radiation pressure results from momentum transfer to the target
        </Text>
      </group>

      {/* Legend */}
      <group position={[-8, -7, 0]}>
        <Line
          points={[
            [0, 0, 0],
            [0, 0.5, 0],
          ]}
          color="#FF0000"
          lineWidth={2}
        />
        <Text position={[1, 0.25, 0]} fontSize={0.4} color="#FF0000" anchorX="left">
          Electric Field (E)
        </Text>

        <Line
          points={[
            [0, -0.7, 0],
            [0, -0.7, 0.5],
          ]}
          color="#0088FF"
          lineWidth={2}
        />
        <Text position={[1, -0.7, 0]} fontSize={0.4} color="#0088FF" anchorX="left">
          Magnetic Field (B)
        </Text>

        <ArrowHelper dir={new Vector3(1, 0, 0)} origin={new Vector3(0, -1.4, 0)} length={0.5} color="#FFFFFF" />
        <Text position={[1, -1.4, 0]} fontSize={0.4} color="#FFFFFF" anchorX="left">
          Poynting Vector (S = E×B)
        </Text>

        <ArrowHelper dir={new Vector3(1, 0, 0)} origin={new Vector3(0, -2.1, 0)} length={0.5} color="#00FF00" />
        <Text position={[1, -2.1, 0]} fontSize={0.4} color="#00FF00" anchorX="left">
          Radiation Pressure Force
        </Text>
      </group>
    </group>
  )
}

function SolarSailDemo(props: DemoProps) {
  const {
    waveType,
    frequency,
    intensity,
    reflectivity,
    targetMass,
    showEField,
    showBField,
    showPoyntingVector,
    showPressureForce,
    time,
    targetPosition,
    targetVelocity,
    radiationPressure,
    pressureForce,
    targetAcceleration,
    energyTransferred,
    momentumTransferred,
    paused,
    demoMode,
  } = props;
  // Constants for visualization
  const sourcePosition = -10
  const initialTargetPosition = 0
  const waveLength = 20
  const waveSpeed = 3 // For visualization

  // Calculate wavelength based on frequency (for visualization)
  const visualWavelength = 2 / frequency

  // Generate EM wave visualization
  const wavePoints = useMemo(() => {
    const points = []
    const numPoints = 100

    for (let i = 0; i <= numPoints; i++) {
      const x = sourcePosition + (i / numPoints) * waveLength
      points.push(x)
    }

    return points
  }, [sourcePosition, waveLength])

  // Calculate sail tilt based on time (for animation)
  const sailTilt = Math.sin(time * 0.2) * 0.1

  return (
    <group>
      {/* Sun (EM Source) */}
      <group position={[sourcePosition, 0, 0]}>
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial
            color="#FFDD00"
            emissive="#FFDD00"
            emissiveIntensity={intensity * 2}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Sun corona */}
        <mesh position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial
            color="#FFAA00"
            emissive="#FFAA00"
            emissiveIntensity={intensity}
            transparent={true}
            opacity={0.3}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* Solar Sail */}
      <group position={[initialTargetPosition + targetPosition, 0, 0]} rotation={[0, 0, sailTilt]}>
        {/* Sail material */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1, 0.2, 16, 32]} />
          <meshStandardMaterial color="#4a90e2" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.2, 16, 32]} />
          <meshStandardMaterial color="#4a90e2" />
        </mesh>
        {/* Sail frame */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.05, 16, 32]} />
          <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.05, 16, 32]} />
          <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Spacecraft body */}
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[1, 0.5, 0.5]} />
          <meshStandardMaterial color="#444444" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Solar panels */}
        <mesh position={[0.5, 0, 1]}>
          <boxGeometry args={[0.8, 0.1, 1.5]} />
          <meshStandardMaterial color="#2244AA" roughness={0.5} metalness={0.7} />
        </mesh>
      </group>

      {/* EM Wave Visualization */}
      {wavePoints.map((x, i) => {
        if (i % 3 === 0) return null // Skip some points for performance

        const wavePhase = (time * waveSpeed - (x - sourcePosition)) / visualWavelength
        const amplitude = intensity * 1.5 * (1 - Math.min(1, Math.max(0, (x - sourcePosition) / waveLength)))

        // E-field oscillates in y-direction
        const eFieldY = amplitude * Math.sin(2 * Math.PI * wavePhase)

        // B-field oscillates in z-direction (perpendicular to E-field and propagation)
        const bFieldZ = amplitude * 0.5 * Math.sin(2 * Math.PI * wavePhase)

        // Only show waves between source and target
        if (x < initialTargetPosition + targetPosition - 0.5 && x > sourcePosition + 2) {
          return (
            <group key={i} position={[x, 0, 0]}>
              {/* E-field vector */}
              {showEField && (
                <group>
                  <Line
                    points={[
                      [0, 0, 0],
                      [0, eFieldY, 0],
                    ]}
                    color="#FFDD00"
                    lineWidth={2}
                  />
                  <mesh position={[0, eFieldY / 2, 0]} scale={[0.05, Math.abs(eFieldY), 0.05]}>
                    <boxGeometry />
                    <meshBasicMaterial color="#FFDD00" transparent opacity={0.3} />
                  </mesh>
                </group>
              )}

              {/* B-field vector */}
              {showBField && (
                <group>
                  <Line
                    points={[
                      [0, 0, 0],
                      [0, 0, bFieldZ],
                    ]}
                    color="#0088FF"
                    lineWidth={2}
                  />
                  <mesh position={[0, 0, bFieldZ / 2]} scale={[0.05, 0.05, Math.abs(bFieldZ)]}>
                    <boxGeometry />
                    <meshBasicMaterial color="#0088FF" transparent opacity={0.3} />
                  </mesh>
                </group>
              )}

              {/* Poynting vector (energy flow direction) */}
              {showPoyntingVector && i % 15 === 0 && (
                <ArrowHelper
                  dir={new Vector3(1, 0, 0)}
                  origin={new Vector3(0, eFieldY * 0.5, bFieldZ * 0.5)}
                  length={0.5}
                  color="#FFFFFF"
                />
              )}
            </group>
          )
        }
        return null
      })}

      {/* Pressure Force Visualization */}
      {showPressureForce && (
        <ArrowHelper
          dir={new Vector3(1, 0, 0)}
          origin={new Vector3(initialTargetPosition + targetPosition, 0, 0)}
          length={pressureForce * 20}
          color="#00FF00"
        />
      )}

      {/* Physics Information Display */}
      <group position={[0, 5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.7} color="white" anchorX="center">
          Solar Sail Propulsion
        </Text>

        <Text position={[0, -1, 0]} fontSize={0.4} color="white" anchorX="center">
          Solar Radiation Pressure: {(radiationPressure * 1e6).toFixed(2)} μPa
        </Text>

        <Text position={[0, -1.7, 0]} fontSize={0.4} color="white" anchorX="center">
          Force on Sail: {(pressureForce * 1e6).toFixed(2)} μN
        </Text>

        <Text position={[0, -2.4, 0]} fontSize={0.4} color="white" anchorX="center">
          Sail Acceleration: {(targetAcceleration * 1e3).toFixed(2)} mm/s²
        </Text>

        <Text position={[0, -3.1, 0]} fontSize={0.4} color="white" anchorX="center">
          Sail Velocity: {(targetVelocity * 1e3).toFixed(2)} mm/s
        </Text>

        <Text position={[0, -3.8, 0]} fontSize={0.4} color="white" anchorX="center">
          Energy Transferred: {energyTransferred.toFixed(2)} J
        </Text>

        <Text position={[0, -4.5, 0]} fontSize={0.4} color="white" anchorX="center">
          Momentum Transferred: {(momentumTransferred * 1e6).toFixed(2)} μN·s
        </Text>
      </group>

      {/* Explanation */}
      <group position={[0, -5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.5} color="white" anchorX="center">
          Solar sails use radiation pressure from sunlight for propulsion
        </Text>

        <Text position={[0, -0.7, 0]} fontSize={0.5} color="white" anchorX="center">
          Highly reflective materials maximize momentum transfer
        </Text>

        <Text position={[0, -1.4, 0]} fontSize={0.5} color="white" anchorX="center">
          Force = (2 × Solar Intensity × Sail Area) / c
        </Text>

        <Text position={[0, -2.1, 0]} fontSize={0.4} color="white" anchorX="center">
          Acceleration is inversely proportional to spacecraft mass
        </Text>

        <Text position={[0, -2.8, 0]} fontSize={0.4} color="white" anchorX="center">
          Solar sails can achieve continuous acceleration without propellant
        </Text>
      </group>
    </group>
  )
}

function LaserCoolingDemo(props: DemoProps) {
  const {
    waveType,
    frequency,
    intensity,
    reflectivity,
    targetMass,
    showEField,
    showBField,
    showPoyntingVector,
    showPressureForce,
    time,
    targetPosition,
    targetVelocity,
    radiationPressure,
    pressureForce,
    targetAcceleration,
    energyTransferred,
    momentumTransferred,
    paused,
    demoMode,
  } = props;
  // Constants for visualization
  const sourcePosition = -8
  const initialTargetPosition = 0
  const waveLength = 16
  const waveSpeed = 3 // For visualization

  // Calculate wavelength based on frequency (for visualization)
  const visualWavelength = 2 / frequency

  // Generate EM wave visualization
  const wavePoints = useMemo(() => {
    const points = []
    const numPoints = 100

    for (let i = 0; i <= numPoints; i++) {
      const x = sourcePosition + (i / numPoints) * waveLength
      points.push(x)
    }

    return points
  }, [sourcePosition, waveLength])

  // Calculate atom vibration based on time (for animation)
  const atomVibration = Math.sin(time * 10) * 0.2

  return (
    <group>
      {/* Laser Source */}
      <group position={[sourcePosition, 0, 0]}>
        {/* Laser body */}
        <mesh position={[-1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
          <meshStandardMaterial color="#444444" roughness={0.7} metalness={0.5} />
        </mesh>
        {/* Laser aperture */}
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial
            color="#0088FF"
            emissive="#0088FF"
            emissiveIntensity={intensity * 2}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* Atom/Particle Target */}
      <group position={[initialTargetPosition + targetPosition, 0, 0]}>
        {/* Atom nucleus */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#FF4400" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* Electron cloud */}
        <mesh position={[0, 0, 0]} scale={[1 + atomVibration, 1 + atomVibration, 1 + atomVibration]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#4488FF" transparent={true} opacity={0.3} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Electron particles */}
        {[...Array(8)].map((_, i) => {
          const angle1 = time * 2 + (i / 8) * Math.PI * 2
          const angle2 = time * 3 + (i / 8) * Math.PI * 2
          const radius = 0.6 + atomVibration * 0.3
          const x = Math.cos(angle1) * Math.sin(angle2) * radius
          const y = Math.sin(angle1) * radius
          const z = Math.cos(angle1) * Math.cos(angle2) * radius

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#00AAFF" emissive="#00AAFF" emissiveIntensity={0.5} />
            </mesh>
          )
        })}
      </group>

      {/* EM Wave Visualization */}
      {wavePoints.map((x, i) => {
        if (i % 2 === 0) return null // Skip every other point for performance

        const wavePhase = (time * waveSpeed - (x - sourcePosition)) / visualWavelength
        const amplitude = intensity * 1.5

        // E-field oscillates in y-direction
        const eFieldY = amplitude * Math.sin(2 * Math.PI * wavePhase)

        // B-field oscillates in z-direction (perpendicular to E-field and propagation)
        const bFieldZ = amplitude * 0.5 * Math.sin(2 * Math.PI * wavePhase)

        // Only show waves between source and target
        if (x < initialTargetPosition + targetPosition - 0.3 && x > sourcePosition + 0.3) {
          return (
            <group key={i} position={[x, 0, 0]}>
              {/* E-field vector */}
              {showEField && (
                <group>
                  <Line
                    points={[
                      [0, 0, 0],
                      [0, eFieldY, 0],
                    ]}
                    color="#0088FF"
                    lineWidth={2}
                  />
                  <mesh position={[0, eFieldY / 2, 0]} scale={[0.05, Math.abs(eFieldY), 0.05]}>
                    <boxGeometry />
                    <meshBasicMaterial color="#0088FF" transparent opacity={0.5} />
                  </mesh>
                </group>
              )}

              {/* B-field vector */}
              {showBField && (
                <group>
                  <Line
                    points={[
                      [0, 0, 0],
                      [0, 0, bFieldZ],
                    ]}
                    color="#00FFFF"
                    lineWidth={2}
                  />
                  <mesh position={[0, 0, bFieldZ / 2]} scale={[0.05, 0.05, Math.abs(bFieldZ)]}>
                    <boxGeometry />
                    <meshBasicMaterial color="#00FFFF" transparent opacity={0.5} />
                  </mesh>
                </group>
              )}

              {/* Poynting vector (energy flow direction) */}
              {showPoyntingVector && i % 10 === 0 && (
                <ArrowHelper
                  dir={new Vector3(1, 0, 0)}
                  origin={new Vector3(0, eFieldY * 0.5, bFieldZ * 0.5)}
                  length={0.5}
                  color="#FFFFFF"
                />
              )}
            </group>
          )
        }
        return null
      })}

      {/* Scattered Photons */}
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const distance = ((time * 2) % 5) + 1
        const x = initialTargetPosition + targetPosition + Math.cos(angle) * distance
        const y = Math.sin(angle) * distance

        if (distance > 1 && distance < 5) {
          return (
            <mesh key={i} position={[x, y, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color="#0088FF"
                emissive="#0088FF"
                emissiveIntensity={0.8}
                transparent
                opacity={0.8}
              />
            </mesh>
          )
        }
        return null
      })}

      {/* Pressure Force Visualization */}
      {showPressureForce && (
        <ArrowHelper
          dir={new Vector3(-1, 0, 0)} // Opposite direction for cooling
          origin={new Vector3(initialTargetPosition + targetPosition, 0, 0)}
          length={pressureForce * 10}
          color="#00FF00"
        />
      )}

      {/* Physics Information Display */}
      <group position={[0, 5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.7} color="white" anchorX="center">
          Laser Cooling of Atoms
        </Text>

        <Text position={[0, -1, 0]} fontSize={0.4} color="white" anchorX="center">
          Radiation Pressure: {(radiationPressure * 1e9).toFixed(2)} nPa
        </Text>

        <Text position={[0, -1.7, 0]} fontSize={0.4} color="white" anchorX="center">
          Force on Atom: {(pressureForce * 1e15).toFixed(2)} fN
        </Text>

        <Text position={[0, -2.4, 0]} fontSize={0.4} color="white" anchorX="center">
          Atom Deceleration: {(targetAcceleration * 1e3).toFixed(2)} mm/s²
        </Text>

        <Text position={[0, -3.1, 0]} fontSize={0.4} color="white" anchorX="center">
          Atom Velocity: {(targetVelocity * 1e3).toFixed(2)} mm/s
        </Text>

        <Text position={[0, -3.8, 0]} fontSize={0.4} color="white" anchorX="center">
          Energy Transferred: {(energyTransferred * 1e6).toFixed(2)} μJ
        </Text>

        <Text position={[0, -4.5, 0]} fontSize={0.4} color="white" anchorX="center">
          Temperature Reduction: {(Math.abs(targetVelocity) * 1e3).toFixed(2)} K
        </Text>
      </group>

      {/* Explanation */}
      <group position={[0, -5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.5} color="white" anchorX="center">
          Laser cooling uses radiation pressure to slow atoms
        </Text>

        <Text position={[0, -0.7, 0]} fontSize={0.5} color="white" anchorX="center">
          Doppler effect tunes laser frequency to moving atoms
        </Text>

        <Text position={[0, -1.4, 0]} fontSize={0.5} color="white" anchorX="center">
          Atoms absorb photons from one direction, emit in random directions
        </Text>

        <Text position={[0, -2.1, 0]} fontSize={0.4} color="white" anchorX="center">
          Net momentum transfer slows the atoms (reduces temperature)
        </Text>

        <Text position={[0, -2.8, 0]} fontSize={0.4} color="white" anchorX="center">
          Used to create ultra-cold atoms and Bose-Einstein condensates
        </Text>
      </group>
    </group>
  )
}

// Helper component for arrows
function ArrowHelper({ dir, origin, length, color }: ArrowHelperProps) {
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
