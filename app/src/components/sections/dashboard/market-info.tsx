"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

interface MarketInfoProps {
  market: string
}

export default function MarketInfo({ market }: MarketInfoProps) {
  const [price, setPrice] = useState(0)
  const [change24h, setChange24h] = useState(0)
  const [high24h, setHigh24h] = useState(0)
  const [low24h, setLow24h] = useState(0)
  const [volume24h, setVolume24h] = useState(0)

  useEffect(() => {
    // Set initial values based on market
    const basePrice = market.startsWith("BTC") ? 65000 : market.startsWith("ETH") ? 3500 : 150
    const randomChange = Math.random() * 6 - 3 // -3% to +3%

    setPrice(basePrice)
    setChange24h(randomChange)
    setHigh24h(basePrice * (1 + Math.random() * 0.05)) // Up to 5% higher
    setLow24h(basePrice * (1 - Math.random() * 0.05)) // Up to 5% lower
    setVolume24h(Math.random() * 1000000000) // Random volume up to 1B

    // Simulate price updates
    const interval = setInterval(() => {
      setPrice((prev) => {
        const change = prev * (1 + (Math.random() * 0.002 - 0.001)) // Small random change
        return Number.parseFloat(change.toFixed(2))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [market])

  return (
    <div className="flex items-center space-x-6 text-sm">
      <div>
        <div className="text-lg font-bold">${price.toFixed(2)}</div>
        <div className={`text-xs flex items-center ${change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
          {change24h >= 0 ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
          {change24h >= 0 ? "+" : ""}
          {change24h.toFixed(2)}%
        </div>
      </div>

      <div className="hidden md:block">
        <div className="text-xs text-gray-400">24h High</div>
        <div>${high24h.toFixed(2)}</div>
      </div>

      <div className="hidden md:block">
        <div className="text-xs text-gray-400">24h Low</div>
        <div>${low24h.toFixed(2)}</div>
      </div>

      <div>
        <div className="text-xs text-gray-400">24h Volume</div>
        <div>${(volume24h / 1000000).toFixed(2)}M</div>
      </div>
    </div>
  )
}

