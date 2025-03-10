"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { Position } from "@/types/trading"

// Mock positions data
const mockPositions: Position[] = [
  {
    id: "1",
    market: "BTC-PERP",
    side: "long",
    size: 0.5,
    leverage: 10,
    entryPrice: 64250.75,
    markPrice: 65100.25,
    liquidationPrice: 58200.5,
    pnl: 424.75,
    pnlPercentage: 1.32,
    margin: 3212.54,
    timestamp: new Date().getTime() - 3600000 * 2,
  },
  {
    id: "2",
    market: "ETH-PERP",
    side: "short",
    size: 5,
    leverage: 5,
    entryPrice: 3450.25,
    markPrice: 3520.75,
    liquidationPrice: 3800.5,
    pnl: -352.5,
    pnlPercentage: -2.04,
    margin: 3450.25,
    timestamp: new Date().getTime() - 3600000 * 5,
  },
  {
    id: "3",
    market: "SOL-PERP",
    side: "long",
    size: 50,
    leverage: 20,
    entryPrice: 145.75,
    markPrice: 152.25,
    liquidationPrice: 138.5,
    pnl: 325.0,
    pnlPercentage: 4.46,
    margin: 364.38,
    timestamp: new Date().getTime() - 3600000 * 12,
  },
]

export default function PositionsTable() {
  const [positions] = useState<Position[]>(mockPositions)

  const totalPnl = positions.reduce((sum, position) => sum + position.pnl, 0)
  const totalMargin = positions.reduce((sum, position) => sum + position.margin, 0)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="text-sm font-medium">Positions</h3>
        <div className="flex space-x-4 text-sm">
          <div className={`${totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}>PnL: ${totalPnl.toFixed(2)}</div>
          <div className="text-gray-400">Margin: ${totalMargin.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-gray-400">Market</th>
              <th className="text-left p-3 text-xs font-medium text-gray-400">Side</th>
              <th className="text-right p-3 text-xs font-medium text-gray-400">Size</th>
              <th className="text-right p-3 text-xs font-medium text-gray-400">Leverage</th>
              <th className="text-right p-3 text-xs font-medium text-gray-400">Entry Price</th>
              <th className="text-right p-3 text-xs font-medium text-gray-400">Mark Price</th>
              <th className="text-right p-3 text-xs font-medium text-gray-400">Liq. Price</th>
              <th className="text-right p-3 text-xs font-medium text-gray-400">PnL</th>
              <th className="text-right p-3 text-xs font-medium text-gray-400">Margin</th>
              <th className="text-center p-3 text-xs font-medium text-gray-400">Close</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {positions.map((position) => (
              <tr key={position.id} className="hover:bg-gray-800/50">
                <td className="p-3 font-medium">{position.market}</td>
                <td className={`p-3 ${position.side === "long" ? "text-green-500" : "text-red-500"}`}>
                  {position.side === "long" ? (
                    <div className="flex items-center">
                      <ChevronUp size={16} className="mr-1" />
                      Long
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ChevronDown size={16} className="mr-1" />
                      Short
                    </div>
                  )}
                </td>
                <td className="p-3 text-right">{position.size}</td>
                <td className="p-3 text-right">{position.leverage}x</td>
                <td className="p-3 text-right">${position.entryPrice.toFixed(2)}</td>
                <td className="p-3 text-right">${position.markPrice.toFixed(2)}</td>
                <td className="p-3 text-right">${position.liquidationPrice.toFixed(2)}</td>
                <td className={`p-3 text-right ${position.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${position.pnl.toFixed(2)} ({position.pnlPercentage >= 0 ? "+" : ""}
                  {position.pnlPercentage.toFixed(2)}%)
                </td>
                <td className="p-3 text-right">${position.margin.toFixed(2)}</td>
                <td className="p-3 text-center">
                  <button className="p-1 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white">
                    <X size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {positions.length === 0 && (
              <tr>
                <td colSpan={10} className="p-4 text-center text-gray-500">
                  No open positions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

