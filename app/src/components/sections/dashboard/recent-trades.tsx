"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Trade } from "@/types/trading"

interface RecentTradesProps {
  market: string
}

// Generate mock trades
const generateTrades = (market: string, count: number): Trade[] => {
  const basePrice = market.startsWith("BTC") ? 65000 : market.startsWith("ETH") ? 3500 : 150
  const now = new Date().getTime()

  return Array.from({ length: count }, (_, i) => {
    const isBuy = Math.random() > 0.5
    const price = basePrice * (1 + (Math.random() * 0.01 - 0.005)) // ±0.5% from base price
    const size = Math.random() * 2 // Random size up to 2 units

    return {
      id: `trade-${now}-${i}`,
      market,
      price,
      size,
      side: isBuy ? "buy" : "sell",
      timestamp: now - i * 1000, // 1 second apart
    }
  })
}

export default function RecentTrades({ market }: RecentTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    // Initial trades
    setTrades(generateTrades(market, 20))

    // Simulate new trades coming in
    const interval = setInterval(() => {
      const newTrade = generateTrades(market, 1)[0]
      setTrades((prev) => [newTrade, ...prev.slice(0, 19)]) // Keep only 20 most recent
    }, 2000)

    return () => clearInterval(interval)
  }, [market])

  return (
    <div className="flex flex-col h-48 border-t border-gray-800">
      <div className="flex items-center justify-between p-2 border-b border-gray-800">
        <h3 className="text-sm font-medium">Recent Trades</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left p-2 text-gray-400 font-medium">Price</th>
              <th className="text-right p-2 text-gray-400 font-medium">Size</th>
              <th className="text-right p-2 text-gray-400 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-800/30">
                <td className={`p-2 ${trade.side === "buy" ? "text-green-500" : "text-red-500"}`}>
                  <div className="flex items-center">
                    {trade.side === "buy" ? (
                      <ArrowUp size={12} className="mr-1" />
                    ) : (
                      <ArrowDown size={12} className="mr-1" />
                    )}
                    ${trade.price.toFixed(2)}
                  </div>
                </td>
                <td className="p-2 text-right">{trade.size.toFixed(4)}</td>
                <td className="p-2 text-right text-gray-400">{new Date(trade.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

