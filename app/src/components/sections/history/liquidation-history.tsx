"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Calendar, Search, Filter } from "lucide-react"
import { generateLiquidationHistory } from "@/lib/mock-data"
import type { LiquidationHistoryItem } from "@/types/history"

export default function LiquidationHistory() {
  const [liquidations, setLiquidations] = useState<LiquidationHistoryItem[]>([])
  const [filteredLiquidations, setFilteredLiquidations] = useState<LiquidationHistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [marketFilter, setMarketFilter] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<"all" | "week" | "month" | "year">("all")

  useEffect(() => {
    // Generate mock liquidation history
    const mockLiquidations = generateLiquidationHistory(15)
    setLiquidations(mockLiquidations)
    setFilteredLiquidations(mockLiquidations)
  }, [])

  // Apply filters and search
  useEffect(() => {
    let result = [...liquidations]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) => item.market.toLowerCase().includes(query) || item.positionId.toLowerCase().includes(query),
      )
    }

    // Apply market filter
    if (marketFilter) {
      result = result.filter((item) => item.market === marketFilter)
    }

    // Apply timeframe filter
    if (timeframe !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      if (timeframe === "week") {
        cutoffDate.setDate(now.getDate() - 7)
      } else if (timeframe === "month") {
        cutoffDate.setMonth(now.getMonth() - 1)
      } else if (timeframe === "year") {
        cutoffDate.setFullYear(now.getFullYear() - 1)
      }

      result = result.filter((item) => new Date(item.timestamp) >= cutoffDate)
    }

    setFilteredLiquidations(result)
  }, [liquidations, searchQuery, marketFilter, timeframe])

  // Get unique markets for filter dropdown
  const uniqueMarkets = Array.from(new Set(liquidations.map((item) => item.market)))

  // Calculate total liquidation amount
  const totalLiquidationAmount = filteredLiquidations.reduce((sum, item) => sum + item.liquidationValue, 0)

  return (
    <div>
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start">
        <AlertTriangle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-red-500 font-medium mb-1">Liquidation History</h3>
          <p className="text-sm text-gray-300">
            This section shows your liquidated positions. Understanding why positions were liquidated can help improve
            your risk management strategy.
          </p>
        </div>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Liquidations</div>
          <div className="text-2xl font-bold">{filteredLiquidations.length}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Value Lost</div>
          <div className="text-2xl font-bold text-red-500">${totalLiquidationAmount.toFixed(2)}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Most Recent Liquidation</div>
          <div className="text-lg font-medium">
            {filteredLiquidations.length > 0 ? new Date(filteredLiquidations[0].timestamp).toLocaleDateString() : "N/A"}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by market or position ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Market filter */}
          <div className="relative">
            <select
              value={marketFilter || ""}
              onChange={(e) => setMarketFilter(e.target.value || null)}
              className="appearance-none pl-3 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Markets</option>
              {uniqueMarkets.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
            <Filter
              size={14}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          {/* Timeframe filter */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
            <Calendar
              size={14}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Liquidations table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Position
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reason</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Entry Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Liquidation Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Value Lost
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredLiquidations.map((item) => (
              <tr key={item.positionId} className="hover:bg-gray-750">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.market}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center ${item.side === "long" ? "text-green-500" : "text-red-500"}`}
                  >
                    {item.side === "long" ? "Long" : "Short"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-xs">
                    <AlertTriangle size={12} className="mr-1" />
                    {item.reason}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">{item.size.toFixed(4)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
                  ${item.entryPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
                  ${item.liquidationPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-red-500 text-right font-medium">
                  -${item.liquidationValue.toFixed(2)}
                </td>
              </tr>
            ))}

            {filteredLiquidations.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No liquidations found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Liquidation prevention tips */}
      {filteredLiquidations.length > 0 && (
        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium mb-3">Tips to Avoid Liquidations</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Use lower leverage to increase the distance between your entry price and liquidation price.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Set stop losses to exit positions before they reach liquidation price.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Add margin to your positions during high volatility periods.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Monitor funding rates to avoid paying high fees that reduce your margin buffer.</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

