"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Percent, DollarSign } from "lucide-react"
import { generatePnLData } from "@/lib/mock-data"
import type { PnLDataPoint, PnLSummary, PnLByMarket } from "@/types/history"

export default function PnLAnalysis() {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">("month")
  const [pnlData, setPnlData] = useState<PnLDataPoint[]>([])
  const [pnlSummary, setPnlSummary] = useState<PnLSummary>({
    totalPnL: 0,
    winRate: 0,
    bestTrade: 0,
    worstTrade: 0,
    averageProfitPerTrade: 0,
    averageLossPerTrade: 0,
    profitFactor: 0,
  })
  const [pnlByMarket, setPnlByMarket] = useState<PnLByMarket[]>([])

  useEffect(() => {
    // Generate mock PnL data based on timeframe
    const { data, summary, byMarket } = generatePnLData(timeframe)
    setPnlData(data)
    setPnlSummary(summary)
    setPnlByMarket(byMarket)
  }, [timeframe])

  // Find min and max values for chart scaling
  const maxPnL = Math.max(...pnlData.map((d) => d.cumulativePnL), 0)
  const minPnL = Math.min(...pnlData.map((d) => d.cumulativePnL), 0)
  const range = Math.max(maxPnL - minPnL, 1000) // Ensure a minimum range

  // Format date based on timeframe
  const formatDate = (date: string) => {
    const d = new Date(date)
    if (timeframe === "day") {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (timeframe === "week" || timeframe === "month") {
      return d.toLocaleDateString([], { month: "short", day: "numeric" })
    } else {
      return d.toLocaleDateString([], { month: "short", year: "2-digit" })
    }
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">Total PnL</h3>
            <DollarSign size={16} className={pnlSummary.totalPnL >= 0 ? "text-green-500" : "text-red-500"} />
          </div>
          <div className={`text-2xl font-bold ${pnlSummary.totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
            {pnlSummary.totalPnL >= 0 ? "+" : ""}
            {pnlSummary.totalPnL.toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">Win Rate</h3>
            <Percent size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{(pnlSummary.winRate * 100).toFixed(1)}%</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">Best Trade</h3>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-500">+{pnlSummary.bestTrade.toFixed(2)}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400">Worst Trade</h3>
            <TrendingDown size={16} className="text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-500">{pnlSummary.worstTrade.toFixed(2)}</div>
        </div>
      </div>

      {/* Timeframe selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">PnL Over Time</h2>

        <div className="flex rounded-md overflow-hidden border border-gray-700">
          <button
            className={`px-3 py-1.5 text-sm ${
              timeframe === "day" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setTimeframe("day")}
          >
            Day
          </button>
          <button
            className={`px-3 py-1.5 text-sm ${
              timeframe === "week" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setTimeframe("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1.5 text-sm ${
              timeframe === "month" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setTimeframe("month")}
          >
            Month
          </button>
          <button
            className={`px-3 py-1.5 text-sm ${
              timeframe === "year" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setTimeframe("year")}
          >
            Year
          </button>
        </div>
      </div>

      {/* PnL Chart */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
        <div className="h-64 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-400 py-2">
            <div>${maxPnL.toFixed(0)}</div>
            <div>{(maxPnL - range / 4).toFixed(0)}</div>
            <div>{(maxPnL - range / 2).toFixed(0)}</div>
            <div>{(maxPnL - (3 * range) / 4).toFixed(0)}</div>
            <div>{minPnL.toFixed(0)}</div>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full relative">
            {/* Zero line */}
            <div
              className="absolute border-t border-gray-600 w-full"
              style={{
                top: `${(maxPnL / range) * 100}%`,
              }}
            ></div>

            {/* PnL line */}
            <svg className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="pnlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
                  <stop offset="50%" stopColor="rgba(34, 197, 94, 0.1)" />
                  <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                </linearGradient>
              </defs>

              {/* Area under the line */}
              <path
                d={`
                  M 0 ${((maxPnL - pnlData[0]?.cumulativePnL) / range) * 100}%
                  ${pnlData
                    .map((point, i) => {
                      const x = (i / (pnlData.length - 1)) * 100
                      const y = ((maxPnL - point.cumulativePnL) / range) * 100
                      return `L ${x}% ${y}%`
                    })
                    .join(" ")}
                  L 100% ${((maxPnL - pnlData[pnlData.length - 1]?.cumulativePnL) / range) * 100}%
                  L 100% ${(maxPnL / range) * 100}%
                  L 0 ${(maxPnL / range) * 100}%
                  Z
                `}
                fill="url(#pnlGradient)"
                className={pnlSummary.totalPnL >= 0 ? "text-green-500" : "text-red-500"}
              />

              {/* Line */}
              <path
                d={`
                  M 0 ${((maxPnL - pnlData[0]?.cumulativePnL) / range) * 100}%
                  ${pnlData
                    .map((point, i) => {
                      const x = (i / (pnlData.length - 1)) * 100
                      const y = ((maxPnL - point.cumulativePnL) / range) * 100
                      return `L ${x}% ${y}%`
                    })
                    .join(" ")}
                `}
                fill="none"
                stroke={pnlSummary.totalPnL >= 0 ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
              />

              {/* Data points */}
              {pnlData
                .filter((_, i) => i % Math.ceil(pnlData.length / 20) === 0 || i === pnlData.length - 1)
                .map((point, i) => {
                  const x = (pnlData.indexOf(point) / (pnlData.length - 1)) * 100
                  const y = ((maxPnL - point.cumulativePnL) / range) * 100
                  return (
                    <circle
                      key={i}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="3"
                      fill={point.cumulativePnL >= 0 ? "#22c55e" : "#ef4444"}
                    />
                  )
                })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              {pnlData
                .filter((_, i) => i % Math.ceil(pnlData.length / 6) === 0 || i === pnlData.length - 1)
                .map((point, i) => (
                  <div key={i}>{formatDate(point.timestamp)}</div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* PnL by market */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium mb-4">PnL by Market</h3>

          <div className="space-y-3">
            {pnlByMarket.map((market) => (
              <div key={market.market}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{market.market}</span>
                  <span className={`text-sm font-medium ${market.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {market.pnl >= 0 ? "+" : ""}
                    {market.pnl.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${market.pnl >= 0 ? "bg-green-500" : "bg-red-500"}`}
                    style={{
                      width: `${Math.min((Math.abs(market.pnl) / Math.max(...pnlByMarket.map((m) => Math.abs(m.pnl)))) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading statistics */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium mb-4">Trading Statistics</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Win Rate</div>
              <div className="text-lg font-medium">{(pnlSummary.winRate * 100).toFixed(1)}%</div>
            </div>

            <div>
              <div className="text-xs text-gray-400 mb-1">Profit Factor</div>
              <div className="text-lg font-medium">{pnlSummary.profitFactor.toFixed(2)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-400 mb-1">Avg. Profit</div>
              <div className="text-lg font-medium text-green-500">+{pnlSummary.averageProfitPerTrade.toFixed(2)}</div>
            </div>

            <div>
              <div className="text-xs text-gray-400 mb-1">Avg. Loss</div>
              <div className="text-lg font-medium text-red-500">{pnlSummary.averageLossPerTrade.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-l-full"
                  style={{ width: `${pnlSummary.winRate * 100}%` }}
                ></div>
              </div>
              <div className="ml-2 text-xs">
                <span className="text-green-500">{Math.round(pnlSummary.winRate * 100)}%</span>
                <span className="text-gray-400"> / </span>
                <span className="text-red-500">{Math.round((1 - pnlSummary.winRate) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

