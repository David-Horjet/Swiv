"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

interface MarketSelectorProps {
  selectedMarket: string
  onSelectMarket: (market: string) => void
}

const markets = [
  { id: "BTC-PERP", name: "Bitcoin", symbol: "BTC-PERP" },
  { id: "ETH-PERP", name: "Ethereum", symbol: "ETH-PERP" },
  { id: "SOL-PERP", name: "Solana", symbol: "SOL-PERP" },
  { id: "AVAX-PERP", name: "Avalanche", symbol: "AVAX-PERP" },
  { id: "MATIC-PERP", name: "Polygon", symbol: "MATIC-PERP" },
  { id: "DOGE-PERP", name: "Dogecoin", symbol: "DOGE-PERP" },
  { id: "LINK-PERP", name: "Chainlink", symbol: "LINK-PERP" },
  { id: "UNI-PERP", name: "Uniswap", symbol: "UNI-PERP" },
]

export default function MarketSelector({ selectedMarket, onSelectMarket }: MarketSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMarkets = markets.filter(
    (market) =>
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedMarketData = markets.find((m) => m.symbol === selectedMarket)

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-md px-3 py-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{selectedMarketData?.name || selectedMarket}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
          <div className="p-2">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredMarkets.map((market) => (
              <button
                key={market.id}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 flex items-center justify-between ${
                  market.symbol === selectedMarket ? "bg-blue-500/10 text-blue-500" : ""
                }`}
                onClick={() => {
                  onSelectMarket(market.symbol)
                  setIsOpen(false)
                }}
              >
                <span>{market.name}</span>
                <span className="text-gray-400">{market.symbol}</span>
              </button>
            ))}

            {filteredMarkets.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">No markets found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

