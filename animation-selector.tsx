"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AnimationSelector() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const animations = [
    {
      id: "right-hand-rule",
      title: "Right Hand Rule",
      description: "Visualize the right hand rule for angular displacement in 3D space.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: "simple-harmonic-motion",
      title: "Simple Harmonic Motion",
      description: "Explore the physics of simple harmonic motion with an interactive spring-mass system.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-green-500 to-teal-600",
    },
    {
      id: "damped-oscillations",
      title: "Damped Oscillations",
      description:
        "Understand how damping affects oscillatory motion with underdamped, critically damped, and overdamped systems.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-red-500 to-orange-600",
    },
    {
      id: "newtons-gravitation",
      title: "Newton's Law of Gravitation",
      description:
        "Explore how masses attract each other with a force proportional to their masses and inversely proportional to the square of the distance.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-yellow-500 to-amber-600",
    },
    {
      id: "planetary-motion",
      title: "Planetary Motion",
      description:
        "Visualize the motion of planets around the Sun and satellites around planets, following Kepler's laws of planetary motion.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-indigo-500 to-purple-600",
    },
    {
      id: "fluid-statics",
      title: "Fluid Statics",
      description: "Understand pressure, buoyancy, Pascal's law, and pressure measurement in static fluids.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "fluid-dynamics",
      title: "Fluid Dynamics",
      description:
        "Explore Bernoulli's principle, continuity equation, flow types, and viscosity effects in moving fluids.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-pink-500 to-rose-600",
    },
    {
      id: "wave-types",
      title: "Types of Waves",
      description: "Explore different wave types including transverse, longitudinal, surface, and standing waves.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "wave-propagation",
      title: "Wave Propagation",
      description: "Understand wave speed, energy transfer, impedance, and intensity in wave propagation.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-teal-500 to-green-600",
    },
    {
      id: "wave-superposition",
      title: "Wave Superposition",
      description:
        "Learn how waves combine through the principle of superposition, including constructive and destructive interference.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-blue-400 to-violet-600",
    },
    {
      id: "wave-properties",
      title: "Wave Properties",
      description: "Explore wave reflection, transmission, refraction, diffraction, and dispersion phenomena.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "doppler-effect",
      title: "Doppler Effect",
      description: "Visualize how wave frequencies change when there's relative motion between source and observer.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-red-500 to-orange-600",
    },
    {
      id: "sound-resonance",
      title: "Sound Resonance",
      description:
        "Explore how sound waves create resonance in tubes, strings, and cavities, demonstrating how amplitude increases dramatically at natural frequencies.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: "em-radiation-pressure",
      title: "EM Radiation Pressure",
      description:
        "Understand how electromagnetic waves carry energy and momentum, and how they exert pressure on objects.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-yellow-500 to-red-600",
    },
    {
      id: "wave-optics-interference",
      title: "Wave Optics: Interference",
      description:
        "Explore interference phenomena in wave optics, including Young's double slit experiment and thin film interference.",
      image: "/placeholder.svg?height=200&width=300",
      color: "from-violet-500 to-indigo-600",
    },
  ]

  const navigateToAnimation = (id: string) => {
    router.push(`/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Physics Animations</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive 3D visualizations to help understand fundamental physics concepts. Select an animation below to
            explore.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {animations.map((animation) => (
            <div
              key={animation.id}
              className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform ${
                hoveredCard === animation.id ? "scale-105" : ""
              }`}
              onMouseEnter={() => setHoveredCard(animation.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigateToAnimation(animation.id)}
            >
              <div className={`h-3 bg-gradient-to-r ${animation.color}`}></div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3">{animation.title}</h2>
                <p className="text-gray-300 mb-4 text-sm">{animation.description}</p>
                <button
                  className={`px-4 py-2 rounded bg-gradient-to-r ${animation.color} text-white font-medium hover:opacity-90 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateToAnimation(animation.id)
                  }}
                >
                  Launch
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-400">
          <p>Created with React Three Fiber and Next.js</p>
          <p className="mt-2">© {new Date().getFullYear()} Physics Animations</p>
        </footer>
      </div>
    </div>
  )
}
