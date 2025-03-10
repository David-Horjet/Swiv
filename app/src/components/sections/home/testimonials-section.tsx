"use client"

import { motion } from "framer-motion"
import type { TestimonialItem } from "@/types"
import TestimonialCard from "@/components/ui/home/testimonial-card"

const testimonials: TestimonialItem[] = [
  {
    quote: "Swiv's execution speed is unmatched. I've never experienced such smooth trading on any other platform.",
    author: "Alex Chen",
    role: "Professional Trader",
  },
  {
    quote: "The leverage options and low fees have completely transformed my trading strategy. Swiv is a game-changer.",
    author: "Sarah Johnson",
    role: "Institutional Investor",
  },
  {
    quote:
      "As a liquidity provider, I appreciate the robust infrastructure and security measures Swiv has implemented.",
    author: "Michael Rodriguez",
    role: "Market Maker",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Trusted by Traders Worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Join thousands of traders who have already made the switch to Swiv
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

