"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Download } from "lucide-react"
import { generateFundingRateData } from "@/lib/mock-data"
import { FundingRateDataPoint, FundingRateSummary } from "@/types/history"

export default function FundingRateAnalysis() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month")
  const [fundingData, setFundingData] = useState<FundingRateDataPoint[]>([])
  const [summary, setSummary] = useState<FundingRateSummary>({
    totalPaid: 0,
    totalReceived: 0,
    netFunding: 0,
    averageRate: 0,
  })

  useEffect(() => {
    // Generate mock funding rate data based on timeframe
    const { data, summary } = generateFundingRateData(timeframe)
    setFundingData(data)
    setSummary(summary)
  }, [timeframe])

  // Group funding payments by day for the chart
  const groupedByDay = fundingData.reduce(
    (acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = {
          date,
          paid: 0,
          received: 0,
          net: 0,
        }
      }

      if (item.amount < 0) {
        acc[date].paid += Math.abs(item.amount)
      } else {
        acc[date].received += item.amount
      }

      acc[date].net += item.amount

      return acc
    },
    {} as Record<string, { date: string; paid: number; received: number; net: number }>,
  )

  const dailyData = Object.values(groupedByDay).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Find max value for chart scaling
  const maxValue = Math.max(...dailyData.map((d) => Math.max(d.paid, d.received, Math.abs(d.net))))

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Timestamp", "Market", "Rate", "Amount", "Position Size"]

    const csvRows = [
      headers.join(","),
      ...fundingData.map((item) =>
        [
          new Date(item.timestamp).toLocaleString(),
          item.market,
          (item.rate * 100).toFixed(4) + "%",
          item.amount.toFixed(2),
          item.positionSize.toFixed(4),
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `funding_payments_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Paid</div>
          <div className="text-2xl font-bold text-red-500">-${summary.totalPaid.toFixed(2)}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Total Received</div>
          <div className="text-2xl font-bold text-green-500">+${summary.totalReceived.toFixed(2)}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Net Funding</div>
          <div className={`text-2xl font-bold ${summary.netFunding >= 0 ? "text-green-500" : "text-red-500"}`}>
            {summary.netFunding >= 0 ? "+" : ""}
            {summary.netFunding.toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Average Rate</div>
          <div className={`text-2xl font-bold ${summary.averageRate >= 0 ? "text-green-500" : "text-red-500"}`}>
            {summary.averageRate >= 0 ? "+" : ""}
            {(summary.averageRate * 100).toFixed(4)}%
          </div>
        </div>
      </div>

      {/* Timeframe selector and export */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex rounded-md overflow-hidden border border-gray-700">
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

        <button
          onClick={exportToCSV}
          className="flex items-center px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm hover:bg-gray-700"
        >
          <Download size={14} className="mr-1" />
          Export
        </button>
      </div>

      {/* Funding rate chart */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
        <h3 className="text-sm font-medium mb-4">Funding Payments Over Time</h3>

        <div className="h-64 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-400 py-2">
            <div>${maxValue.toFixed(2)}</div>
            <div>${(maxValue * 0.5).toFixed(2)}</div>
            <div>$0.00</div>
            <div>-${(maxValue * 0.5).toFixed(2)}</div>
            <div>-${maxValue.toFixed(2)}</div>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full relative">
            {/* Zero line */}
            <div className="absolute border-t border-gray-600 w-full top-1/2"></div>

            {/* Bars */}
            <div className="h-full flex items-center">
              {dailyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-center">
                  {/* Received (positive) */}
                  <div
                    className="w-4 bg-green-500 rounded-t-sm"
                    style={{
                      height: `${(day.received / maxValue) * 50}%`,
                      marginBottom: day.net >= 0 ? 0 : "1px",
                    }}
                  ></div>

                  {/* Paid (negative) */}
                  <div
                    className="w-4 bg-red-500 rounded-b-sm"
                    style={{
                      height: `${(day.paid / maxValue) * 50}%`,
                      marginTop: day.net < 0 ? 0 : "1px",
                    }}
                  ></div>

                  {/* Net line */}
                  <div
                    className={`absolute w-2 h-1 rounded-full ${day.net >= 0 ? "bg-green-300" : "bg-red-300"}`}
                    style={{
                      bottom: day.net >= 0 ? `calc(50% + ${(day.net / maxValue) * 50}%)` : "auto",
                      top: day.net < 0 ? `calc(50% + ${(Math.abs(day.net) / maxValue) * 50}%)` : "auto",
                      left: `calc(${((index + 0.5) / dailyData.length) * 100}%)`,
                    }}
                  ></div>
                </div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              {dailyData
                .filter((_, i) => i % Math.ceil(dailyData.length / 6) === 0 || i === dailyData.length - 1)
                .map((day, i) => (
                  <div key={i}>{new Date(day.date).toLocaleDateString([], { month: "short", day: "numeric" })}</div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-400">Received</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-400">Paid</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
            <span className="text-xs text-gray-400">Net Position</span>
          </div>
        </div>
      </div>

      {/* Funding payments table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Rate</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Position Size
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {fundingData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-750">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.market}</td>
                <td
                  className={`px-4 py-3 whitespace-nowrap text-sm text-right ${
                    item.rate >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.rate >= 0 ? "+" : ""}
                  {(item.rate * 100).toFixed(4)}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 text-right">
                  {item.positionSize.toFixed(4)}
                </td>
                <td
                  className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${
                    item.amount >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.amount >= 0 ? "+" : ""}
                  {item.amount.toFixed(2)}
                </td>
              </tr>
            ))}

            {fundingData.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No funding payments found for the selected timeframe
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Funding rate explanation */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-medium mb-3">Understanding Funding Rates</h3>
        <p className="text-sm text-gray-300 mb-3">
          Funding rates are periodic payments exchanged between long and short traders in perpetual contracts. They help
          keep the perpetual contract price aligned with the spot price.
        </p>
        <ul className="text-sm text-gray-300 space-y-2">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">
              <ArrowUp size={14} />
            </span>
            <span>
              <strong>Positive rate:</strong> Long positions pay short positions. This occurs when perpetual prices are
              higher than spot prices.
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">
              <ArrowDown size={14} />
            </span>
            <span>
              <strong>Negative rate:</strong> Short positions pay long positions. This occurs when perpetual prices are
              lower than spot prices.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

