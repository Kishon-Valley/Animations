"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

// Animation categories
const categories = [
  {
    name: "Waves",
    description: "Explore wave phenomena and their properties",
    animations: [
      { name: "Wave Types", path: "/wave-types" },
      { name: "Wave Properties", path: "/wave-properties" },
      { name: "Wave Propagation", path: "/wave-propagation" },
      { name: "Wave Superposition", path: "/wave-superposition" },
      { name: "Doppler Effect", path: "/doppler-effect" },
      { name: "Sound Resonance", path: "/sound-resonance" },
    ],
  },
  {
    name: "Light & Optics",
    description: "Discover the fascinating world of light and optical phenomena",
    animations: [
      { name: "Wave Optics Interference", path: "/wave-optics-interference" },
      { name: "Wave Optics Diffraction", path: "/wave-optics-diffraction" },
      { name: "Huygens Principle", path: "/huygens-principle" },
      { name: "EM Radiation Pressure", path: "/em-radiation-pressure" },
    ],
  },
  {
    name: "Classical Mechanics",
    description: "Learn about motion, forces, and energy",
    animations: [
      { name: "Simple Harmonic Motion", path: "/simple-harmonic-motion" },
      { name: "Damped Oscillations", path: "/damped-oscillations" },
      { name: "Newton's Gravitation", path: "/newtons-gravitation" },
      { name: "Planetary Motion", path: "/planetary-motion" },
    ],
  },
  {
    name: "Fluids",
    description: "Explore fluid behavior and properties",
    animations: [
      { name: "Fluid Statics", path: "/fluid-statics" },
      { name: "Fluid Dynamics", path: "/fluid-dynamics" },
    ],
  },
  {
    name: "Electromagnetism",
    description: "Understand electromagnetic phenomena",
    animations: [
      { name: "Right Hand Rule", path: "/right-hand-rule" },
    ],
  },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        >
          Physics Animations
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-center text-gray-300 mb-12"
        >
          Interactive visualizations to help you understand physics concepts
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-3 text-blue-400">{category.name}</h2>
              <p className="text-gray-400 mb-4">{category.description}</p>
              <div className="space-y-2">
                {category.animations.map((animation) => (
                  <Link
                    key={animation.path}
                    href={animation.path}
                    className="block p-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
                  >
                    {animation.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
