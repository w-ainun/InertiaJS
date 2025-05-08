"use client"

import { useState } from "react"
// import { motion } from "framer-motion"

// Sample data for 10 food items
const foodItems = [
  {
    id: 1,
    name: "Dadar Gulung",
    description: "Kue tradisional berbentuk gulungan berwarna hijau dengan isian kelapa manis.",
    price: "Rp. 3.000/pcs",
    image: "/img/dadar-gulung.png",
  },
  {
    id: 2,
    name: "Klepon",
    description: "Kue tradisional berbentuk bulat berwarna hijau dengan isian gula merah cair.",
    price: "Rp. 2.500/pcs",
    image: "/img/dadar-gulung.png",
  },
  {
    id: 3,
    name: "Onde-Onde",
    description: "Kue bulat dengan taburan wijen dan isian kacang hijau yang lezat.",
    price: "Rp. 3.500/pcs",
    image: "/img/dadar-gulung.png",
  },
  {
    id: 4,
    name: "Lemper",
    description: "Kue ketan dengan isian ayam yang dibungkus daun pisang.",
    price: "Rp. 4.000/pcs",
    image: "/img/dadar-gulung.png",
  },
  {
    id: 5,
    name: "Kue Lumpur",
    description: "Kue lembut dengan topping kismis dan rasa yang manis.",
    price: "Rp. 3.000/pcs",
    image: "/img/dadar-gulung.png",
  },
  {
    id: 6,
    name: "Risoles",
    description: "Kulit tepung yang digoreng dengan isian sayuran dan daging.",
    price: "Rp. 3.500/pcs",
    image: "/img/dadar-gulung.png",
  },
  {
    id: 7,
    name: "Serabi",
    description: "Kue tradisional berbentuk bulat dengan kuah santan yang manis.",
    price: "Rp. 4.000/pcs",
    image: "/img/dadar-gulung.png",
  },
  {
    id: 8,
    name: "Putu Ayu",
    description: "Kue berwarna hijau dengan taburan kelapa di atasnya.",
    price: "Rp. 3.000/pcs",
    image: "/img/dadar-gulung.png",
  },
  {
    id: 9,
    name: "Getuk",
    description: "Kue dari singkong yang dihaluskan dengan tambahan gula dan kelapa.",
    price: "Rp. 2.500/pcs",
    image: "/img/dadar-gulung.png",
  },
  {
    id: 10,
    name: "Nagasari",
    description: "Kue dari tepung beras dengan isian pisang yang dibungkus daun pisang.",
    price: "Rp. 3.500/pcs",
    image: "/img/dadar-gulung.png",
  },
]

export default function FoodMenuGrid() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Menu Makanan Tradisional</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative"
            initial="hidden"
            animate="visible"
            custom={index}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setHoveredCard(item.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              aria-label="card menu"
              className="flex flex-col sm:flex-row items-center sm:items-start justify-between p-4 border border-gray-200 rounded-xl shadow-md bg-white h-full transition-all duration-300 hover:shadow-lg"
            >
              <div className="max-w-sm mb-4 sm:mb-0 sm:mr-4">
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600 mt-1">{item.description}</p>
                <span className="text-green-700 font-medium mt-2 block">{item.price}</span>
              </div>
              <div
                className="relative w-full sm:w-64 h-40 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                style={{ backgroundImage: `url('${item.image}')` }}
              >
                <div
                  className={`absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ${hoveredCard === item.id ? "bg-opacity-10" : ""}`}
                ></div>
                <motion.button
                  type="button"
                  className="absolute bottom-2 right-2 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-100"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-xl">+</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}