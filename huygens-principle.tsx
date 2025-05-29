"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { useState, useEffect } from "react"
import { Vector3, Color } from "three"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types for our animation
type WaveletPoint = {
  position: Vector3
  phase: number
  active: boolean
}

type DemoType = "propagation" | "reflection" | "refraction" | "diffraction"

// Main component
export default function HuygensPrinciple() {
  const [demoType, setDemoType] = useState<DemoType>("propagation")
  const [waveSpeed, setWaveSpeed] = useState(1)
  const [wavelength, setWavelength] = useState(1)
  const [waveletDensity, setWaveletDensity] = useState(10)
  const [showSecondaryWavelets, setShowSecondaryWavelets] = useState(true)
  const [showWavefronts, setShowWavefronts] = useState(true)
  const [paused, setPaused] = useState(false)

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-white">
      {/* 3D Animation Canvas - Takes 2/3 of the screen on larger devices */}
      <div className="w-full md:w-2/3 h-1/2 md:h-screen">
        <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
          <color attach="background" args={["#f8f9fa"]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* Simple scene */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>

          <gridHelper args={[10, 10]} />
          <OrbitControls />
        </Canvas>
      </div>

      {/* Controls and Explanation Panel - Takes 1/3 of the screen on larger devices */}
      <div className="w-full md:w-1/3 h-1/2 md:h-screen overflow-y-auto p-4 bg-gray-50">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Huygens' Principle</CardTitle>
            <CardDescription>Visualize how waves propagate according to Huygens' Principle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Huygens' Principle states that every point on a wavefront serves as a source of secondary wavelets that
              spread out in all directions with the same speed as the wave. The new wavefront is the tangent to all of
              these secondary wavelets.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Demonstration Type</label>
              <Select value={demoType} onValueChange={(value) => setDemoType(value as DemoType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select demonstration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="propagation">Wave Propagation</SelectItem>
                  <SelectItem value="reflection">Reflection</SelectItem>
                  <SelectItem value="refraction">Refraction</SelectItem>
                  <SelectItem value="diffraction">Diffraction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
              </TabsList>

              <TabsContent value="controls" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Wave Speed: {waveSpeed.toFixed(1)}</label>
                  <Slider
                    value={[waveSpeed]}
                    min={0.1}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setWaveSpeed(value[0])}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Wavelength: {wavelength.toFixed(1)}</label>
                  <Slider
                    value={[wavelength]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setWavelength(value[0])}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Wavelet Density: {waveletDensity}</label>
                  <Slider
                    value={[waveletDensity]}
                    min={5}
                    max={20}
                    step={1}
                    onValueChange={(value) => setWaveletDensity(Math.round(value[0]))}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant={showSecondaryWavelets ? "default" : "outline"}
                    onClick={() => setShowSecondaryWavelets(!showSecondaryWavelets)}
                  >
                    {showSecondaryWavelets ? "Hide" : "Show"} Secondary Wavelets
                  </Button>

                  <Button
                    variant={showWavefronts ? "default" : "outline"}
                    onClick={() => setShowWavefronts(!showWavefronts)}
                  >
                    {showWavefronts ? "Hide" : "Show"} Wavefronts
                  </Button>
                </div>

                <Button onClick={() => setPaused(!paused)} variant="outline" className="w-full">
                  {paused ? "Resume" : "Pause"} Animation
                </Button>
              </TabsContent>

              <TabsContent value="explanation">
                <DemoExplanation demoType={demoType} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm">Wave Speed:</div>
              <div className="text-sm font-medium">{waveSpeed.toFixed(1)} units/s</div>

              <div className="text-sm">Wavelength:</div>
              <div className="text-sm font-medium">{wavelength.toFixed(1)} units</div>

              <div className="text-sm">Frequency:</div>
              <div className="text-sm font-medium">{(waveSpeed / wavelength).toFixed(2)} Hz</div>

              <div className="text-sm">Wavelet Density:</div>
              <div className="text-sm font-medium">{waveletDensity} points/wavefront</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Scene component that handles the 3D visualization
function HuygensPrincipleScene({
  demoType,
  waveSpeed,
  wavelength,
  waveletDensity,
  showSecondaryWavelets,
  showWavefronts,
  paused,
}: {
  demoType: DemoType
  waveSpeed: number
  wavelength: number
  waveletDensity: number
  showSecondaryWavelets: boolean
  showWavefronts: boolean
  paused: boolean
}) {
  const [time, setTime] = useState(0)
  const [waveletPoints, setWaveletPoints] = useState<WaveletPoint[]>([])
  const [wavefronts, setWavefronts] = useState<Vector3[][]>([])

  // Generate initial wavelet points based on demo type
  useEffect(() => {
    const newWaveletPoints: WaveletPoint[] = []
    const newWavefronts: Vector3[][] = []

    // Create more visible initial wavelets
    for (let i = 0; i < waveletDensity; i++) {
      const x = -5 + (10 * i) / (waveletDensity - 1)
      newWaveletPoints.push({
        position: new Vector3(x, 0, -5),
        phase: 0,
        active: true,
      })
    }

    // Add an initial wavefront
    const initialWavefront = newWaveletPoints.map((w) => w.position.clone())
    newWavefronts.push(initialWavefront)

    setWaveletPoints(newWaveletPoints)
    setWavefronts(newWavefronts)
    setTime(0)
  }, [demoType, waveletDensity])

  // Animation frame update
  useFrame((_, delta) => {
    if (paused) return

    // Update time
    const newTime = time + delta * waveSpeed
    setTime(newTime)

    // Update wavelet points
    const newWaveletPoints = [...waveletPoints]
    let newWavefronts = [...wavefronts]

    // Update existing wavelet points
    for (let i = 0; i < newWaveletPoints.length; i++) {
      const wavelet = newWaveletPoints[i]
      wavelet.phase = (wavelet.phase + delta * waveSpeed) % (2 * Math.PI)

      if (wavelet.position.z < 5) {
        wavelet.position.z += delta * waveSpeed * 0.8
      } else {
        wavelet.position.z = -5
        wavelet.phase = 0
      }
    }

    // Generate new wavefronts periodically
    if (Math.floor(newTime / wavelength) > Math.floor(time / wavelength)) {
      const newWavefront = newWaveletPoints.filter((w) => w.active).map((w) => w.position.clone())
      if (newWavefront.length > 0) {
        newWavefronts.push(newWavefront)
        if (newWavefronts.length > 10) {
          newWavefronts.shift()
        }
      }
    }

    // Update wavefronts
    newWavefronts = newWavefronts.map((wavefront) => {
      return wavefront.map((point) => {
        const newPoint = point.clone()
        newPoint.z += delta * waveSpeed
        return newPoint
      })
    })

    // Remove wavefronts that have moved out of view
    newWavefronts = newWavefronts.filter((wavefront) => {
      const avgZ = wavefront.reduce((sum, point) => sum + point.z, 0) / wavefront.length
      return avgZ < 6
    })

    setWaveletPoints(newWaveletPoints)
    setWavefronts(newWavefronts)
  })

  return (
    <>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Wave source */}
      <mesh position={[0, 0, -5]}>
        <boxGeometry args={[10, 0.5, 0.5]} />
        <meshStandardMaterial color="#ff9800" />
      </mesh>

      {/* Render secondary wavelets */}
      {showSecondaryWavelets &&
        waveletPoints.map(
          (wavelet, index) =>
            wavelet.active && (
              <mesh key={`wavelet-${index}`} position={wavelet.position}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color={new Color().setHSL((wavelet.phase / (2 * Math.PI)) % 1, 0.8, 0.5)} />
              </mesh>
            ),
        )}

      {/* Render wavefronts */}
      {showWavefronts &&
        wavefronts.map((wavefront, wfIndex) => (
          <group key={`wavefront-${wfIndex}`}>
            {wavefront.map((point, pointIndex) => (
              <mesh key={`wf-${wfIndex}-point-${pointIndex}`} position={point}>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshStandardMaterial color={new Color().setHSL((wfIndex * 0.1) % 1, 0.8, 0.5)} />
              </mesh>
            ))}
          </group>
        ))}

      {/* Demo-specific elements */}
      {demoType === "reflection" && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10, 1, 0.2]} />
          <meshStandardMaterial color="#2196f3" transparent opacity={0.8} />
        </mesh>
      )}

      {demoType === "refraction" && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10, 1, 0.2]} />
          <meshStandardMaterial color="#4fc3f7" transparent opacity={0.6} />
        </mesh>
      )}

      {demoType === "diffraction" && (
        <>
          <mesh position={[-3, 0, 0]}>
            <boxGeometry args={[4, 1, 0.2]} />
            <meshStandardMaterial color="#455a64" />
          </mesh>

          <mesh position={[3, 0, 0]}>
            <boxGeometry args={[4, 1, 0.2]} />
            <meshStandardMaterial color="#455a64" />
          </mesh>
        </>
      )}

      {/* Labels */}
      <Text position={[0, 1.5, -5]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
        Wave Source
      </Text>

      {/* Visual helpers */}
      <gridHelper args={[20, 20]} position={[0, -0.05, 0]} />
    </>
  )
}

// Component to display explanations based on the demo type
function DemoExplanation({ demoType }: { demoType: DemoType }) {
  switch (demoType) {
    case "propagation":
      return (
        <div className="space-y-2">
          <p>
            <strong>Wave Propagation</strong> demonstrates the most basic application of Huygens' Principle.
          </p>
          <p>
            Each point on the wavefront acts as a source of secondary wavelets. These wavelets combine to form the next
            wavefront. In free space, a plane wave continues as a plane wave because the secondary wavelets combine to
            form a plane.
          </p>
          <p>This principle explains how waves maintain their shape as they travel through a medium.</p>
        </div>
      )

    case "reflection":
      return (
        <div className="space-y-2">
          <p>
            <strong>Reflection</strong> occurs when a wave encounters a boundary and changes direction.
          </p>
          <p>
            According to Huygens' Principle, when a wavefront hits a reflecting surface, each point on the wavefront
            generates secondary wavelets. However, the wavelets can only propagate away from the boundary, resulting in
            a reflected wavefront.
          </p>
          <p>
            The angle of reflection equals the angle of incidence because of the way these secondary wavelets combine to
            form the new wavefront.
          </p>
        </div>
      )

    case "refraction":
      return (
        <div className="space-y-2">
          <p>
            <strong>Refraction</strong> occurs when a wave passes from one medium to another, changing its speed and
            direction.
          </p>
          <p>
            Huygens' Principle explains refraction by considering that the wave speed changes in the new medium. When a
            wavefront crosses a boundary, the secondary wavelets travel at a different speed in the new medium, causing
            the wavefront to change direction.
          </p>
          <p>
            This principle leads to Snell's Law: n₁sin(θ₁) = n₂sin(θ₂), where n is the refractive index of each medium
            and θ is the angle from the normal.
          </p>
        </div>
      )

    case "diffraction":
      return (
        <div className="space-y-2">
          <p>
            <strong>Diffraction</strong> is the bending of waves around obstacles or through openings.
          </p>
          <p>
            When a wave encounters an obstacle with a small opening (like a slit), Huygens' Principle explains how the
            wave can spread out after passing through. Each point in the opening acts as a source of secondary wavelets
            that propagate beyond the obstacle.
          </p>
          <p>
            This is why waves can "bend" around corners or spread out after passing through a narrow opening. The
            smaller the opening relative to the wavelength, the more pronounced the diffraction effect.
          </p>
        </div>
      )

    default:
      return null
  }
}
