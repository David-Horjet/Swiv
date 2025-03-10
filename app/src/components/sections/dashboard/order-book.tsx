"use client"

import { OrderBookEntry } from "@/types/trading";
import { useState, useEffect } from "react"

interface OrderBookProps {
  market: string
}

// Mock data generator
const generateOrderBook = (market: string): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } => {
  const basePrice = market.startsWith("BTC") ? 65000 : market.startsWith("ETH") ? 3500 : 100
  const variance = basePrice * 0.01

  const bids: OrderBookEntry[] = Array.from({ length: 12 }, (_, i) => {
    const price = basePrice - i * variance * Math.random()
    return {
      price: price,
      size: Math.random() * 10 + 0.1,
      total: 0, // Will calculate
      depth: 0, // Will calculate
    }
  }).sort((a, b) => b.price - a.price)

  const asks: OrderBookEntry[] = Array.from({ length: 12 }, (_, i) => {
    const price = basePrice + i * variance * Math.random()
    return {
      price: price,
      size: Math.random() * 10 + 0.1,
      total: 0, // Will calculate
      depth: 0, // Will calculate
    }
  }).sort((a, b) => a.price - b.price)

  // Calculate totals and depth
  let bidTotal = 0
  let askTotal = 0
  const maxDepth = Math.max(
    bids.reduce((acc, bid) => acc + bid.size, 0),
    asks.reduce((acc, ask) => acc + ask.size, 0),
  )

  bids.forEach((bid) => {
    bidTotal += bid.size
    bid.total = bidTotal
    bid.depth = (bid.size / maxDepth) * 100
  })

  asks.forEach((ask) => {
    askTotal += ask.size
    ask.total = askTotal
    ask.depth = (ask.size / maxDepth) * 100
  })

  return { bids, asks }
}

export default function OrderBook({ market }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({ bids: [], asks: [] })
  const [view, setView] = useState<"both" | "bids" | "asks">("both")

  useEffect(() => {
    // Initial order book
    setOrderBook(generateOrderBook(market))

    // Simulate updates
    const interval = setInterval(() => {
      setOrderBook((prev) => {
        const newOrderBook = generateOrderBook(market)
        // Keep some entries the same for stability
        return {
          bids: prev.bids.map((bid, i) => (Math.random() > 0.3 ? bid : newOrderBook.bids[i])),
          asks: prev.asks.map((ask, i) => (Math.random() > 0.3 ? ask : newOrderBook.asks[i])),
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [market])

  const spreadAmount = orderBook.asks[0]?.price - orderBook.bids[0]?.price
  const spreadPercentage = (spreadAmount / orderBook.bids[0]?.price) * 100 || 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b border-gray-800">
        <h3 className="text-sm font-medium">Order Book</h3>
        <div className="flex space-x-1">
          <button
            className={`px-2 py-1 text-xs rounded ${view === "both" ? "bg-blue-500/20 text-blue-500" : "hover:bg-gray-800"}`}
            onClick={() => setView("both")}
          >
            Both
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${view === "bids" ? "bg-green-500/20 text-green-500" : "hover:bg-gray-800"}`}
            onClick={() => setView("bids")}
          >
            Bids
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${view === "asks" ? "bg-red-500/20 text-red-500" : "hover:bg-gray-800"}`}
            onClick={() => setView("asks")}
          >
            Asks
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Headers */}
        <div className="grid grid-cols-3 text-xs text-gray-500 p-2 border-b border-gray-800">
          <div>Price (USD)</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks (Sell orders) */}
        {(view === "both" || view === "asks") && (
          <div className="overflow-y-auto max-h-[200px] scrollbar-thin">
            {orderBook.asks.map((ask, index) => (
              <div key={`ask-${index}`} className="relative grid grid-cols-3 text-xs p-1 hover:bg-gray-800/50">
                <div className="text-red-500">{ask.price.toFixed(2)}</div>
                <div className="text-right">{ask.size.toFixed(4)}</div>
                <div className="text-right">{ask.total.toFixed(4)}</div>
                <div className="absolute right-0 top-0 h-full bg-red-500/10" style={{ width: `${ask.depth}%` }}></div>
              </div>
            ))}
          </div>
        )}

        {/* Spread */}
        {view === "both" && (
          <div className="text-center py-1 text-xs text-gray-400 border-y border-gray-800">
            Spread: {spreadAmount.toFixed(2)} ({spreadPercentage.toFixed(3)}%)
          </div>
        )}

        {/* Bids (Buy orders) */}
        {(view === "both" || view === "bids") && (
          <div className="overflow-y-auto max-h-[200px] scrollbar-thin">
            {orderBook.bids.map((bid, index) => (
              <div key={`bid-${index}`} className="relative grid grid-cols-3 text-xs p-1 hover:bg-gray-800/50">
                <div className="text-green-500">{bid.price.toFixed(2)}</div>
                <div className="text-right">{bid.size.toFixed(4)}</div>
                <div className="text-right">{bid.total.toFixed(4)}</div>
                <div className="absolute right-0 top-0 h-full bg-green-500/10" style={{ width: `${bid.depth}%` }}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

