"use client"

import { motion } from "framer-motion"
import type { StatItem } from "@/types"

const stats: StatItem[] = [
  { label: "24h Volume", value: "$1.2B+" },
  { label: "Total Users", value: "50K+" },
  { label: "Avg. Execution", value: "<10ms" },
  { label: "Available Assets", value: "25+" },
]

export default function TradingStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
          className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center"
        >
          <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

