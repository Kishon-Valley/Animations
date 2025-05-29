"use client"

import { useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line, PerspectiveCamera } from "@react-three/drei"
import { Vector3 } from "three"

export default function FluidStatics() {
  const [selectedDemo, setSelectedDemo] = useState("pressure")
  const [fluidDensity, setFluidDensity] = useState(1.0)
  const [objectDensity, setObjectDensity] = useState(0.8)
  const [containerHeight, setContainerHeight] = useState(10)
  const [showPressureVectors, setShowPressureVectors] = useState(true)
  const [showForceVectors, setShowForceVectors] = useState(true)
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
        <h2 className="text-xl font-bold mb-4">Fluid Statics</h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block">Demonstration:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDemo("pressure")}
                className={`px-2 py-1 rounded ${selectedDemo === "pressure" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Pressure with Depth
              </button>
              <button
                onClick={() => setSelectedDemo("buoyancy")}
                className={`px-2 py-1 rounded ${selectedDemo === "buoyancy" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Buoyancy
              </button>
              <button
                onClick={() => setSelectedDemo("pascal")}
                className={`px-2 py-1 rounded ${selectedDemo === "pascal" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Pascal's Law
              </button>
              <button
                onClick={() => setSelectedDemo("manometer")}
                className={`px-2 py-1 rounded ${selectedDemo === "manometer" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Manometer
              </button>
            </div>
          </div>

          {selectedDemo === "pressure" && (
            <>
              <div>
                <label className="block mb-1">Container Height: {containerHeight.toFixed(1)} m</label>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.5"
                  value={containerHeight}
                  onChange={(e) => setContainerHeight(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Fluid Density: {fluidDensity.toFixed(1)} g/cm³</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={fluidDensity}
                  onChange={(e) => setFluidDensity(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPressureVectors}
                    onChange={() => setShowPressureVectors(!showPressureVectors)}
                    className="mr-2"
                  />
                  Show Pressure Vectors
                </label>
              </div>
            </>
          )}

          {selectedDemo === "buoyancy" && (
            <>
              <div>
                <label className="block mb-1">Fluid Density: {fluidDensity.toFixed(1)} g/cm³</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={fluidDensity}
                  onChange={(e) => setFluidDensity(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Object Density: {objectDensity.toFixed(1)} g/cm³</label>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={objectDensity}
                  onChange={(e) => setObjectDensity(Number.parseFloat(e.target.value))}
                  className="w-full"
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
              </div>
            </>
          )}

          {selectedDemo === "pascal" && (
            <>
              <div>
                <label className="block mb-1">Fluid Density: {fluidDensity.toFixed(1)} g/cm³</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={fluidDensity}
                  onChange={(e) => setFluidDensity(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPressureVectors}
                    onChange={() => setShowPressureVectors(!showPressureVectors)}
                    className="mr-2"
                  />
                  Show Pressure Vectors
                </label>
              </div>
            </>
          )}

          {selectedDemo === "manometer" && (
            <>
              <div>
                <label className="block mb-1">Fluid Density: {fluidDensity.toFixed(1)} g/cm³</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={fluidDensity}
                  onChange={(e) => setFluidDensity(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Pressure Difference: {(containerHeight * 0.5).toFixed(1)} kPa</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={containerHeight}
                  onChange={(e) => setContainerHeight(Number.parseFloat(e.target.value))}
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

        {selectedDemo === "pressure" && (
          <PressureDepthDemo
            containerHeight={containerHeight}
            fluidDensity={fluidDensity}
            showPressureVectors={showPressureVectors}
          />
        )}

        {selectedDemo === "buoyancy" && (
          <BuoyancyDemo fluidDensity={fluidDensity} objectDensity={objectDensity} showForceVectors={showForceVectors} />
        )}

        {selectedDemo === "pascal" && (
          <PascalLawDemo fluidDensity={fluidDensity} showPressureVectors={showPressureVectors} />
        )}

        {selectedDemo === "manometer" && (
          <ManometerDemo fluidDensity={fluidDensity} pressureDifference={containerHeight * 0.5} />
        )}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

function PressureDepthDemo({ containerHeight, fluidDensity, showPressureVectors }) {
  const containerWidth = 8
  const g = 9.81 // Gravitational acceleration (m/s²)

  // Calculate pressures at different depths
  const calculatePressure = (depth) => {
    return fluidDensity * g * depth
  }

  // Generate pressure vectors at different depths
  const pressureVectors = []
  const numVectors = 10
  for (let i = 0; i <= numVectors; i++) {
    const depth = (i / numVectors) * containerHeight
    const pressure = calculatePressure(depth)
    const vectorLength = Math.min(pressure * 0.05, containerWidth * 0.4)
    pressureVectors.push({
      position: [-containerWidth / 2, containerHeight / 2 - depth, 0],
      length: vectorLength,
      pressure: pressure,
    })
  }

  return (
    <group>
      {/* Container */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[containerWidth, containerHeight]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Fluid */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[containerWidth - 0.2, containerHeight - 0.2]} />
        <meshStandardMaterial color="#1E90FF" opacity={0.7} transparent />
      </mesh>

      {/* Container outline */}
      <Line
        points={[
          [-containerWidth / 2, -containerHeight / 2, 0],
          [-containerWidth / 2, containerHeight / 2, 0],
          [containerWidth / 2, containerHeight / 2, 0],
          [containerWidth / 2, -containerHeight / 2, 0],
          [-containerWidth / 2, -containerHeight / 2, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
      />

      {/* Depth markers */}
      {[0, 0.25, 0.5, 0.75, 1].map((fraction, index) => {
        const depth = fraction * containerHeight
        return (
          <group key={index}>
            <Line
              points={[
                [-containerWidth / 2 - 0.5, containerHeight / 2 - depth, 0],
                [-containerWidth / 2, containerHeight / 2 - depth, 0],
              ]}
              color="#FFFFFF"
              lineWidth={1}
            />
            <Text
              position={[-containerWidth / 2 - 1, containerHeight / 2 - depth, 0]}
              fontSize={0.4}
              color="white"
              anchorX="right"
            >
              {depth.toFixed(1)} m
            </Text>
            <Text
              position={[containerWidth / 2 + 2, containerHeight / 2 - depth, 0]}
              fontSize={0.4}
              color="white"
              anchorX="left"
            >
              {calculatePressure(depth).toFixed(1)} kPa
            </Text>
          </group>
        )
      })}

      {/* Pressure vectors */}
      {showPressureVectors &&
        pressureVectors.map((vector, index) => (
          <group key={index}>
            <ArrowHelper
              dir={new Vector3(1, 0, 0)}
              origin={new Vector3(...vector.position)}
              length={vector.length}
              color="#FF0000"
            />
            {index % 2 === 0 && (
              <Text
                position={[vector.position[0] + vector.length + 0.5, vector.position[1], 0]}
                fontSize={0.3}
                color="#FF0000"
              >
                {vector.pressure.toFixed(1)} kPa
              </Text>
            )}
          </group>
        ))}

      {/* Title and explanation */}
      <Text position={[0, containerHeight / 2 + 1.5, 0]} fontSize={0.7} color="white" anchorX="center">
        Pressure Variation with Depth
      </Text>
      <Text position={[0, -containerHeight / 2 - 1, 0]} fontSize={0.5} color="white" anchorX="center">
        P = ρgh (ρ: fluid density, g: gravity, h: depth)
      </Text>
      <Text position={[0, -containerHeight / 2 - 2, 0]} fontSize={0.5} color="white" anchorX="center">
        Pressure increases linearly with depth
      </Text>
    </group>
  )
}

function BuoyancyDemo({ fluidDensity, objectDensity, showForceVectors }) {
  const containerWidth = 8
  const containerHeight = 10
  const objectRadius = 1.5
  const g = 9.81 // Gravitational acceleration (m/s²)

  // Calculate forces
  const objectVolume = (4 / 3) * Math.PI * Math.pow(objectRadius, 3)
  const objectMass = objectDensity * objectVolume
  const displacedFluidMass = fluidDensity * objectVolume

  const weightForce = objectMass * g
  const buoyancyForce = displacedFluidMass * g
  const netForce = buoyancyForce - weightForce

  // Determine object position based on densities
  let objectPosition
  let submergedFraction

  if (objectDensity < fluidDensity) {
    // Object floats
    submergedFraction = objectDensity / fluidDensity
    objectPosition = [0, containerHeight / 2 - objectRadius * (2 - submergedFraction), 0]
  } else if (objectDensity > fluidDensity) {
    // Object sinks
    submergedFraction = 1
    objectPosition = [0, -containerHeight / 2 + objectRadius, 0]
  } else {
    // Object is neutrally buoyant
    submergedFraction = 1
    objectPosition = [0, 0, 0]
  }

  // Scale forces for visualization
  const forceScale = 0.5
  const weightVectorLength = weightForce * forceScale
  const buoyancyVectorLength = buoyancyForce * forceScale

  return (
    <group>
      {/* Container */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[containerWidth, containerHeight]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Fluid */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[containerWidth - 0.2, containerHeight - 0.2]} />
        <meshStandardMaterial color="#1E90FF" opacity={0.7} transparent />
      </mesh>

      {/* Container outline */}
      <Line
        points={[
          [-containerWidth / 2, -containerHeight / 2, 0],
          [-containerWidth / 2, containerHeight / 2, 0],
          [containerWidth / 2, containerHeight / 2, 0],
          [containerWidth / 2, -containerHeight / 2, 0],
          [-containerWidth / 2, -containerHeight / 2, 0],
        ]}
        color="#FFFFFF"
        lineWidth={2}
      />

      {/* Object */}
      <group position={objectPosition}>
        <mesh>
          <sphereGeometry args={[objectRadius, 32, 32]} />
          <meshStandardMaterial
            color={objectDensity < fluidDensity ? "#FF9900" : objectDensity === fluidDensity ? "#00FF00" : "#FF0000"}
          />
        </mesh>

        {/* Force vectors */}
        {showForceVectors && (
          <>
            {/* Weight force */}
            <ArrowHelper
              dir={new Vector3(0, -1, 0)}
              origin={new Vector3(0, 0, 0)}
              length={weightVectorLength}
              color="#FF0000"
            />
            <Text position={[1.5, -weightVectorLength / 2, 0]} fontSize={0.4} color="#FF0000">
              Weight: {weightForce.toFixed(1)} N
            </Text>

            {/* Buoyancy force */}
            <ArrowHelper
              dir={new Vector3(0, 1, 0)}
              origin={new Vector3(0, 0, 0)}
              length={buoyancyVectorLength}
              color="#00FF00"
            />
            <Text position={[-1.5, buoyancyVectorLength / 2, 0]} fontSize={0.4} color="#00FF00">
              Buoyancy: {buoyancyForce.toFixed(1)} N
            </Text>
          </>
        )}
      </group>

      {/* Title and explanation */}
      <Text position={[0, containerHeight / 2 + 1.5, 0]} fontSize={0.7} color="white" anchorX="center">
        Buoyancy and Archimedes' Principle
      </Text>
      <Text position={[0, -containerHeight / 2 - 1, 0]} fontSize={0.5} color="white" anchorX="center">
        Buoyant Force = Weight of Displaced Fluid
      </Text>
      <Text position={[0, -containerHeight / 2 - 2, 0]} fontSize={0.5} color="white" anchorX="center">
        {objectDensity < fluidDensity
          ? "Object Floats (ρₒ < ρf)"
          : objectDensity === fluidDensity
            ? "Neutral Buoyancy (ρₒ = ρf)"
            : "Object Sinks (ρₒ > ρf)"}
      </Text>
      <Text position={[0, -containerHeight / 2 - 3, 0]} fontSize={0.5} color="white" anchorX="center">
        Submerged Fraction: {(submergedFraction * 100).toFixed(0)}%
      </Text>
    </group>
  )
}

function PascalLawDemo({ fluidDensity, showPressureVectors }) {
  const [pistonPosition, setPistonPosition] = useState(0)
  const [_, forceUpdate] = useState(0)

  // Dimensions
  const smallCylinderRadius = 1
  const largeCylinderRadius = 3
  const cylinderHeight = 8
  const pistonHeight = 1
  const baseHeight = 1
  const connectorWidth = 6
  const connectorHeight = 1

  // Calculate forces and pressures
  const smallArea = Math.PI * Math.pow(smallCylinderRadius, 2)
  const largeArea = Math.PI * Math.pow(largeCylinderRadius, 2)
  const areaRatio = largeArea / smallArea

  const appliedForce = 100 * (pistonPosition + 1) // Force increases with piston position
  const pressure = appliedForce / smallArea
  const outputForce = pressure * largeArea

  // Animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const newPosition = Math.sin(time) * 0.5
    setPistonPosition(newPosition)
    forceUpdate((prev) => (prev + 1) % 1000) // Force re-render
  })

  return (
    <group>
      {/* Base */}
      <mesh position={[0, -cylinderHeight / 2 - baseHeight / 2, 0]}>
        <boxGeometry args={[largeCylinderRadius * 2 + smallCylinderRadius * 2 + connectorWidth, baseHeight, 2]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Small cylinder */}
      <group position={[-largeCylinderRadius - connectorWidth / 2, 0, 0]}>
        {/* Cylinder walls */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[smallCylinderRadius, smallCylinderRadius, cylinderHeight, 32, 1, true]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.7} />
        </mesh>

        {/* Fluid */}
        <mesh position={[0, -cylinderHeight / 2 + (cylinderHeight / 2) * (1 - pistonPosition), 0]}>
          <cylinderGeometry
            args={[smallCylinderRadius - 0.1, smallCylinderRadius - 0.1, cylinderHeight * (1 - pistonPosition), 32]}
          />
          <meshStandardMaterial color="#1E90FF" transparent opacity={0.7} />
        </mesh>

        {/* Piston */}
        <mesh position={[0, cylinderHeight / 2 - pistonHeight / 2 - (pistonPosition * cylinderHeight) / 2, 0]}>
          <cylinderGeometry args={[smallCylinderRadius, smallCylinderRadius, pistonHeight, 32]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>

        {/* Applied force arrow */}
        <ArrowHelper
          dir={new Vector3(0, -1, 0)}
          origin={new Vector3(0, cylinderHeight / 2 + 1, 0)}
          length={1 + pistonPosition}
          color="#FF0000"
        />

        <Text position={[0, cylinderHeight / 2 + 2, 0]} fontSize={0.4} color="white">
          F₁ = {appliedForce.toFixed(0)} N
        </Text>

        <Text position={[0, 0, 0]} fontSize={0.4} color="white">
          A₁ = {smallArea.toFixed(1)} m²
        </Text>

        {/* Pressure vectors */}
        {showPressureVectors && (
          <>
            <ArrowHelper
              dir={new Vector3(1, 0, 0)}
              origin={new Vector3(-smallCylinderRadius, 0, 0)}
              length={1 + pistonPosition * 0.5}
              color="#FFFF00"
            />
            <ArrowHelper
              dir={new Vector3(-1, 0, 0)}
              origin={new Vector3(smallCylinderRadius, 0, 0)}
              length={1 + pistonPosition * 0.5}
              color="#FFFF00"
            />
            <ArrowHelper
              dir={new Vector3(0, -1, 0)}
              origin={new Vector3(0, smallCylinderRadius, 0)}
              length={1 + pistonPosition * 0.5}
              color="#FFFF00"
            />
            <Text position={[0, -2, 0]} fontSize={0.4} color="#FFFF00">
              P = {pressure.toFixed(1)} Pa
            </Text>
          </>
        )}
      </group>

      {/* Connector */}
      <mesh position={[0, -cylinderHeight / 2 + connectorHeight / 2, 0]}>
        <boxGeometry args={[connectorWidth, connectorHeight, 1.5]} />
        <meshStandardMaterial color="#1E90FF" transparent opacity={0.7} />
      </mesh>

      {/* Large cylinder */}
      <group position={[largeCylinderRadius + connectorWidth / 2, 0, 0]}>
        {/* Cylinder walls */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[largeCylinderRadius, largeCylinderRadius, cylinderHeight, 32, 1, true]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.7} />
        </mesh>

        {/* Fluid */}
        <mesh position={[0, -cylinderHeight / 2 + (cylinderHeight / 2) * (1 - pistonPosition / areaRatio), 0]}>
          <cylinderGeometry
            args={[
              largeCylinderRadius - 0.1,
              largeCylinderRadius - 0.1,
              cylinderHeight * (1 - pistonPosition / areaRatio),
              32,
            ]}
          />
          <meshStandardMaterial color="#1E90FF" transparent opacity={0.7} />
        </mesh>

        {/* Piston */}
        <mesh
          position={[0, cylinderHeight / 2 - pistonHeight / 2 - ((pistonPosition / areaRatio) * cylinderHeight) / 2, 0]}
        >
          <cylinderGeometry args={[largeCylinderRadius, largeCylinderRadius, pistonHeight, 32]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>

        {/* Output force arrow */}
        <ArrowHelper
          dir={new Vector3(0, 1, 0)}
          origin={
            new Vector3(0, cylinderHeight / 2 - pistonHeight - ((pistonPosition / areaRatio) * cylinderHeight) / 2, 0)
          }
          length={1 + pistonPosition}
          color="#00FF00"
        />

        <Text position={[0, cylinderHeight / 2 + 2, 0]} fontSize={0.4} color="white">
          F₂ = {outputForce.toFixed(0)} N
        </Text>

        <Text position={[0, 0, 0]} fontSize={0.4} color="white">
          A₂ = {largeArea.toFixed(1)} m²
        </Text>

        {/* Pressure vectors */}
        {showPressureVectors && (
          <>
            <ArrowHelper
              dir={new Vector3(1, 0, 0)}
              origin={new Vector3(-largeCylinderRadius, 0, 0)}
              length={1 + pistonPosition * 0.5}
              color="#FFFF00"
            />
            <ArrowHelper
              dir={new Vector3(-1, 0, 0)}
              origin={new Vector3(largeCylinderRadius, 0, 0)}
              length={1 + pistonPosition * 0.5}
              color="#FFFF00"
            />
            <ArrowHelper
              dir={new Vector3(0, 1, 0)}
              origin={new Vector3(0, -largeCylinderRadius, 0)}
              length={1 + pistonPosition * 0.5}
              color="#FFFF00"
            />
            <Text position={[0, -2, 0]} fontSize={0.4} color="#FFFF00">
              P = {pressure.toFixed(1)} Pa
            </Text>
          </>
        )}
      </group>

      {/* Title and explanation */}
      <Text position={[0, cylinderHeight / 2 + 4, 0]} fontSize={0.7} color="white" anchorX="center">
        Pascal's Law: Hydraulic Press
      </Text>
      <Text position={[0, -cylinderHeight / 2 - 3, 0]} fontSize={0.5} color="white" anchorX="center">
        Pressure is transmitted equally throughout a confined fluid
      </Text>
      <Text position={[0, -cylinderHeight / 2 - 4, 0]} fontSize={0.5} color="white" anchorX="center">
        F₂/F₁ = A₂/A₁ (Force multiplier = Area ratio)
      </Text>
      <Text position={[0, -cylinderHeight / 2 - 5, 0]} fontSize={0.5} color="white" anchorX="center">
        Area Ratio: {areaRatio.toFixed(1)}, Force Multiplier: {(outputForce / appliedForce).toFixed(1)}
      </Text>
    </group>
  )
}

function ManometerDemo({ fluidDensity, pressureDifference }) {
  const tubeWidth = 0.8
  const tubeHeight = 12
  const tubeSpacing = 4
  const connectorWidth = tubeSpacing
  const connectorHeight = 1
  const g = 9.81 // Gravitational acceleration (m/s²)

  // Calculate height difference based on pressure difference
  // ΔP = ρgΔh
  const heightDifference = pressureDifference / (fluidDensity * g)

  // Calculate fluid levels
  const leftFluidHeight = tubeHeight / 2 + heightDifference / 2
  const rightFluidHeight = tubeHeight / 2 - heightDifference / 2

  return (
    <group>
      {/* Left tube */}
      <group position={[-tubeSpacing / 2, 0, 0]}>
        {/* Tube walls */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[tubeWidth, tubeHeight, tubeWidth]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.3} />
        </mesh>

        {/* Fluid */}
        <mesh position={[0, -tubeHeight / 2 + leftFluidHeight / 2, 0]}>
          <boxGeometry args={[tubeWidth - 0.1, leftFluidHeight, tubeWidth - 0.1]} />
          <meshStandardMaterial color="#1E90FF" transparent opacity={0.7} />
        </mesh>

        {/* Pressure indicator */}
        <Text position={[-1.5, tubeHeight / 2 + 0.5, 0]} fontSize={0.4} color="white" anchorX="right">
          P₁ = {pressureDifference.toFixed(1)} kPa
        </Text>
      </group>

      {/* Right tube */}
      <group position={[tubeSpacing / 2, 0, 0]}>
        {/* Tube walls */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[tubeWidth, tubeHeight, tubeWidth]} />
          <meshStandardMaterial color="#888888" transparent opacity={0.3} />
        </mesh>

        {/* Fluid */}
        <mesh position={[0, -tubeHeight / 2 + rightFluidHeight / 2, 0]}>
          <boxGeometry args={[tubeWidth - 0.1, rightFluidHeight, tubeWidth - 0.1]} />
          <meshStandardMaterial color="#1E90FF" transparent opacity={0.7} />
        </mesh>

        {/* Pressure indicator */}
        <Text position={[1.5, tubeHeight / 2 + 0.5, 0]} fontSize={0.4} color="white" anchorX="left">
          P₂ = 0 kPa (atm)
        </Text>
      </group>

      {/* Connector */}
      <mesh position={[0, -tubeHeight / 2 + connectorHeight / 2, 0]}>
        <boxGeometry args={[connectorWidth, connectorHeight, tubeWidth]} />
        <meshStandardMaterial color="#1E90FF" transparent opacity={0.7} />
      </mesh>

      {/* Height difference indicators */}
      <Line
        points={[
          [-tubeSpacing / 2 - tubeWidth, -tubeHeight / 2 + leftFluidHeight, 0],
          [-tubeSpacing / 2 + tubeWidth, -tubeHeight / 2 + leftFluidHeight, 0],
        ]}
        color="#FFFFFF"
        lineWidth={1}
      />
      <Line
        points={[
          [tubeSpacing / 2 - tubeWidth, -tubeHeight / 2 + rightFluidHeight, 0],
          [tubeSpacing / 2 + tubeWidth, -tubeHeight / 2 + rightFluidHeight, 0],
        ]}
        color="#FFFFFF"
        lineWidth={1}
      />
      <Line
        points={[
          [-tubeSpacing / 2 - tubeWidth - 0.5, -tubeHeight / 2 + leftFluidHeight, 0],
          [-tubeSpacing / 2 - tubeWidth - 0.5, -tubeHeight / 2 + rightFluidHeight, 0],
        ]}
        color="#FFFFFF"
        lineWidth={1}
        dashed={true}
      />
      <Text
        position={[-tubeSpacing / 2 - tubeWidth - 1, -tubeHeight / 2 + (leftFluidHeight + rightFluidHeight) / 2, 0]}
        fontSize={0.4}
        color="white"
        anchorX="right"
      >
        Δh = {heightDifference.toFixed(2)} m
      </Text>

      {/* Title and explanation */}
      <Text position={[0, tubeHeight / 2 + 2, 0]} fontSize={0.7} color="white" anchorX="center">
        Manometer: Pressure Measurement
      </Text>
      <Text position={[0, -tubeHeight / 2 - 2, 0]} fontSize={0.5} color="white" anchorX="center">
        ΔP = ρgΔh
      </Text>
      <Text position={[0, -tubeHeight / 2 - 3, 0]} fontSize={0.5} color="white" anchorX="center">
        Pressure difference is proportional to height difference
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
