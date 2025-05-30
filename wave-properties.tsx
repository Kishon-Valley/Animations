"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3, CatmullRomCurve3, TubeGeometry } from "three"

interface WavePropertiesSceneProps {
  selectedProperty: string;
  amplitude: number;
  frequency: number;
  wavelength: number;
  mediumDensity1: number;
  mediumDensity2: number;
  obstacleWidth: number;
  apertureWidth: number;
  stringThickness: number;
  showParticles: boolean;
  paused: boolean;
}

interface ReflectionDemoProps {
  amplitude: number;
  frequency: number;
  wavelength: number;
  time: number;
  stringThickness: number;
  showParticles: boolean;
}

interface TransmissionDemoProps {
  amplitude: number;
  frequency: number;
  wavelength: number;
  mediumDensity1: number;
  mediumDensity2: number;
  time: number;
  stringThickness: number;
  showParticles: boolean;
}

interface RefractionDemoProps {
  amplitude: number;
  frequency: number;
  wavelength: number;
  mediumDensity1: number;
  mediumDensity2: number;
  time: number;
  stringThickness: number;
  showParticles: boolean;
}

interface DiffractionDemoProps {
  amplitude: number;
  frequency: number;
  wavelength: number;
  obstacleWidth: number;
  apertureWidth: number;
  time: number;
  stringThickness: number;
  showParticles: boolean;
}

interface DispersionDemoProps {
  amplitude: number;
  frequency: number;
  wavelength: number;
  time: number;
  stringThickness: number;
  showParticles: boolean;
}

interface StringMeshProps {
  points: [number, number, number][];
  thickness: number;
  color: string;
  segments?: number;
}

interface ArrowHelperProps {
  dir: Vector3;
  origin: Vector3;
  length: number;
  color: string;
}

interface ParticleSystemProps {
  points: [number, number, number][];
  color: string;
}

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
}: WavePropertiesSceneProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [paused]);

  const renderDemo = () => {
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
        );
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
        );
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
        );
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
        );
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
        );
      default:
        return null;
    }
  };

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {renderDemo()}
    </Canvas>
  );
}

function ReflectionDemo({ amplitude, frequency, wavelength, time, stringThickness, showParticles }: ReflectionDemoProps) {
  const waveLength = 20
  const numPoints = 100
  const points: [number, number, number][] = []
  const reflectedPoints: [number, number, number][] = []

  // Generate points for incident wave
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * time))
    points.push([x, y, 0])
  }

  // Generate points for reflected wave
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = -amplitude * Math.sin(2 * Math.PI * (x / wavelength + frequency * time))
    reflectedPoints.push([x, y, 0])
  }

  return (
    <>
      <StringMesh points={points} thickness={stringThickness} color="#4a90e2" />
      <StringMesh points={reflectedPoints} thickness={stringThickness} color="#e24a4a" />
      {showParticles && (
        <>
          <ParticleSystem points={points} color="#4a90e2" />
          <ParticleSystem points={reflectedPoints} color="#e24a4a" />
        </>
      )}
    </>
  )
}

function TransmissionDemo({ amplitude, frequency, wavelength, mediumDensity1, mediumDensity2, time, stringThickness, showParticles }: TransmissionDemoProps) {
  const waveLength = 20
  const numPoints = 100
  const points: [number, number, number][] = []
  const transmittedPoints: [number, number, number][] = []

  // Generate points for incident wave
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * time))
    points.push([x, y, 0])
  }

  // Generate points for transmitted wave
  const transmissionCoefficient = 2 * mediumDensity2 / (mediumDensity1 + mediumDensity2)
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = amplitude * transmissionCoefficient * Math.sin(2 * Math.PI * (x / wavelength - frequency * time))
    transmittedPoints.push([x, y, 0])
  }

  return (
    <>
      <StringMesh points={points} thickness={stringThickness} color="#4a90e2" />
      <StringMesh points={transmittedPoints} thickness={stringThickness} color="#4ae24a" />
      {showParticles && (
        <>
          <ParticleSystem points={points} color="#4a90e2" />
          <ParticleSystem points={transmittedPoints} color="#4ae24a" />
        </>
      )}
    </>
  )
}

function RefractionDemo({ amplitude, frequency, wavelength, mediumDensity1, mediumDensity2, time, stringThickness, showParticles }: RefractionDemoProps) {
  const waveLength = 20
  const numPoints = 100
  const points: [number, number, number][] = []
  const refractedPoints: [number, number, number][] = []

  // Generate points for incident wave
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * time))
    points.push([x, y, 0])
  }

  // Generate points for refracted wave
  const refractionIndex = mediumDensity2 / mediumDensity1
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = amplitude * Math.sin(2 * Math.PI * (x / (wavelength * refractionIndex) - frequency * time))
    refractedPoints.push([x, y, 0])
  }

  return (
    <>
      <StringMesh points={points} thickness={stringThickness} color="#4a90e2" />
      <StringMesh points={refractedPoints} thickness={stringThickness} color="#e24ae2" />
      {showParticles && (
        <>
          <ParticleSystem points={points} color="#4a90e2" />
          <ParticleSystem points={refractedPoints} color="#e24ae2" />
        </>
      )}
    </>
  )
}

function DiffractionDemo({ amplitude, frequency, wavelength, obstacleWidth, apertureWidth, time, stringThickness, showParticles }: DiffractionDemoProps) {
  const waveLength = 20
  const numPoints = 100
  const points: [number, number, number][] = []
  const diffractedPoints: [number, number, number][] = []

  // Generate points for incident wave
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * time))
    points.push([x, y, 0])
  }

  // Generate points for diffracted wave
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * time)) * 
             Math.sin(Math.PI * apertureWidth * (x - waveLength/2) / (wavelength * obstacleWidth))
    diffractedPoints.push([x, y, 0])
  }

  return (
    <>
      <StringMesh points={points} thickness={stringThickness} color="#4a90e2" />
      <StringMesh points={diffractedPoints} thickness={stringThickness} color="#e2e24a" />
      {showParticles && (
        <>
          <ParticleSystem points={points} color="#4a90e2" />
          <ParticleSystem points={diffractedPoints} color="#e2e24a" />
        </>
      )}
    </>
  )
}

function DispersionDemo({ amplitude, frequency, wavelength, time, stringThickness, showParticles }: DispersionDemoProps) {
  const waveLength = 20
  const numPoints = 100
  const points: [number, number, number][] = []
  const dispersedPoints: [number, number, number][] = []

  // Generate points for incident wave
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * time))
    points.push([x, y, 0])
  }

  // Generate points for dispersed wave
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * waveLength
    const y = amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * time)) * 
             Math.sin(2 * Math.PI * (x / (wavelength * 0.5) - frequency * time))
    dispersedPoints.push([x, y, 0])
  }

  return (
    <>
      <StringMesh points={points} thickness={stringThickness} color="#4a90e2" />
      <StringMesh points={dispersedPoints} thickness={stringThickness} color="#4ae2e2" />
      {showParticles && (
        <>
          <ParticleSystem points={points} color="#4a90e2" />
          <ParticleSystem points={dispersedPoints} color="#4ae2e2" />
        </>
      )}
    </>
  )
}

function StringMesh({ points, thickness, color, segments = 64 }: StringMeshProps) {
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

function ParticleSystem({ points, color }: ParticleSystemProps) {
  const numParticles = 30;
  const particles = useMemo(() => {
    return Array.from({ length: numParticles }, () => {
      const randomPoint = points[Math.floor(Math.random() * points.length)];
      return {
        position: new Vector3(randomPoint[0], randomPoint[1], randomPoint[2]),
        velocity: new Vector3(0, 0, 0),
        acceleration: new Vector3(0, 0, 0),
      };
    });
  }, [points]);

  return (
    <>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </>
  );
}
