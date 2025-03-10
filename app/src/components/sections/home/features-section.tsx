"use client"

import { motion } from "framer-motion"
import { BarChart2, Zap, Shield } from "lucide-react"
import type { FeatureItem } from "@/types"
import FeatureCard from "@/components/ui/home/feature-card"
import TradingInterface from "@/components/ui/home/trading-interface"

const features: FeatureItem[] = [
  {
    icon: <Zap className="h-10 w-10 text-blue-500" />,
    title: "Ultra-Low Fees",
    description: "Trade with fees as low as 0.01%, the lowest in the industry for perpetual swaps.",
  },
  {
    icon: <BarChart2 className="h-10 w-10 text-blue-500" />,
    title: "50x Leverage",
    description: "Maximize your trading potential with up to 50x leverage on all synthetic assets.",
  },
  {
    icon: <Shield className="h-10 w-10 text-blue-500" />,
    title: "Instant Execution",
    description: "Experience lightning-fast trade execution with no slippage or front-running.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why Trade on Swiv
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Built for both retail traders and institutional liquidity providers
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        <div className="mt-16">
          <TradingInterface />
        </div>
      </div>
    </section>
  )
}

