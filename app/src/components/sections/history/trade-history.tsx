"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { generateTradeHistory } from "@/lib/mock-data"
import type { TradeHistoryItem } from "@/types/history"

export default function TradeHistory() {
  const [trades, setTrades] = useState<TradeHistoryItem[]>([])
  const [filteredTrades, setFilteredTrades] = useState<TradeHistoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [marketFilter, setMarketFilter] = useState<string | null>(null)
  const [sideFilter, setSideFilter] = useState<"buy" | "sell" | null>(null)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TradeHistoryItem
    direction: "asc" | "desc"
  }>({ key: "timestamp", direction: "desc" })

  const tradesPerPage = 10

  useEffect(() => {
    // Generate mock trade history data
    const mockTrades = generateTradeHistory(50)
    setTrades(mockTrades)
    setFilteredTrades(mockTrades)
  }, [])

  // Apply filters and search
  useEffect(() => {
    let result = [...trades]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (trade) => trade.market.toLowerCase().includes(query) || trade.orderId.toLowerCase().includes(query),
      )
    }

    // Apply market filter
    if (marketFilter) {
      result = result.filter((trade) => trade.market === marketFilter)
    }

    // Apply side filter
    if (sideFilter) {
      result = result.filter((trade) => trade.side === sideFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Handle date comparison
      if (sortConfig.key === "timestamp") {
        return sortConfig.direction === "asc"
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }

      return 0
    })

    setFilteredTrades(result)
    setCurrentPage(1)
  }, [trades, searchQuery, marketFilter, sideFilter, sortConfig])

  // Get unique markets for filter dropdown
  const uniqueMarkets = Array.from(new Set(trades.map((trade) => trade.market)))

  // Calculate pagination
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage)
  const indexOfLastTrade = currentPage * tradesPerPage
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage
  const currentTrades = filteredTrades.slice(indexOfFirstTrade, indexOfLastTrade)

  // Handle sort
  const handleSort = (key: keyof TradeHistoryItem) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Order ID", "Market", "Side", "Type", "Size", "Price", "Value", "Fee", "PnL", "Timestamp"]

    const csvRows = [
      headers.join(","),
      ...filteredTrades.map((trade) =>
        [
          trade.orderId,
          trade.market,
          trade.side,
          trade.type,
          trade.size,
          trade.price,
          trade.value,
          trade.fee,
          trade.pnl,
          new Date(trade.timestamp).toLocaleString(),
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `trade_history_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by market or order ID"
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

          {/* Side filter */}
          <div className="flex rounded-md overflow-hidden border border-gray-700">
            <button
              className={`px-3 py-2 text-sm ${
                sideFilter === null ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setSideFilter(null)}
            >
              All
            </button>
            <button
              className={`px-3 py-2 text-sm flex items-center ${
                sideFilter === "buy" ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setSideFilter("buy")}
            >
              <ArrowUp size={14} className="mr-1" /> Buy
            </button>
            <button
              className={`px-3 py-2 text-sm flex items-center ${
                sideFilter === "sell" ? "bg-red-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setSideFilter("sell")}
            >
              <ArrowDown size={14} className="mr-1" /> Sell
            </button>
          </div>

          {/* Export button */}
          <button
            onClick={exportToCSV}
            className="flex items-center px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm hover:bg-gray-700"
          >
            <Download size={14} className="mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Trades table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("timestamp")}
              >
                Time
                {sortConfig.key === "timestamp" && (
                  <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("market")}
              >
                Market
                {sortConfig.key === "market" && (
                  <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("side")}
              >
                Side
                {sortConfig.key === "side" && (
                  <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("type")}
              >
                Type
                {sortConfig.key === "type" && (
                  <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("size")}
              >
                Size
                {sortConfig.key === "size" && (
                  <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("price")}
              >
                Price
                {sortConfig.key === "price" && (
                  <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("value")}
              >
                Value
                {sortConfig.key === "value" && (
                  <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("fee")}
              >
                Fee
                {sortConfig.key === "fee" && <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-300"
                onClick={() => handleSort("pnl")}
              >
                PnL
                {sortConfig.key === "pnl" && <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>}
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {currentTrades.map((trade) => (
              <tr key={trade.orderId} className="hover:bg-gray-750">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {new Date(trade.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{trade.market}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center ${trade.side === "buy" ? "text-green-500" : "text-red-500"}`}
                  >
                    {trade.side === "buy" ? (
                      <ArrowUp size={14} className="mr-1" />
                    ) : (
                      <ArrowDown size={14} className="mr-1" />
                    )}
                    {trade.side === "buy" ? "Buy" : "Sell"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 capitalize">{trade.type}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
                  {trade.size.toFixed(4)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
                  ${trade.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
                  ${trade.value.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
                  ${trade.fee.toFixed(2)}
                </td>
                <td
                  className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${
                    trade.pnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trade.pnl >= 0 ? "+" : ""}
                  {trade.pnl.toFixed(2)}
                </td>
              </tr>
            ))}

            {currentTrades.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No trades found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredTrades.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstTrade + 1}-{Math.min(indexOfLastTrade, filteredTrades.length)} of{" "}
            {filteredTrades.length} trades
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum = currentPage
              if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-md text-sm ${
                      currentPage === pageNum ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              }
              return null
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

