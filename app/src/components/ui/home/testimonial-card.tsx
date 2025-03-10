"use client"

import { motion } from "framer-motion"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  delay: number
}

export default function TestimonialCard({ quote, author, role, delay }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-4 text-blue-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>★</span>
        ))}
      </div>
      <p className="text-gray-300 mb-6">"{quote}"</p>
      <div>
        <div className="font-medium">{author}</div>
        <div className="text-sm text-gray-400">{role}</div>
      </div>
    </motion.div>
  )
}

