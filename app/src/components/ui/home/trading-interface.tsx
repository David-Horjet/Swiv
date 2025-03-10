"use client"

import { motion } from "framer-motion"

export default function TradingInterface() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative rounded-xl overflow-hidden border border-gray-700/50"
    >
      <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-sm text-gray-400">Swiv Trading Interface</div>
      </div>
      <div className="pt-10 bg-gray-900">
        <div className="aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">Advanced Trading Interface</div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
              Preview Dashboard
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

