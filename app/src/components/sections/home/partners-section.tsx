"use client"

import { motion } from "framer-motion"

export default function PartnersSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="text-xl font-medium text-gray-400">Our Partners & Integrations</h3>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="h-12 w-32 bg-gray-800/50 rounded-lg flex items-center justify-center"
            >
              <div className="text-gray-400 font-medium">Partner {i}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

