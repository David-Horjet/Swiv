"use client"

import { X, AlertTriangle, Check } from "lucide-react"

interface TradeDetails {
  market: string
  side: "buy" | "sell"
  type: "market" | "limit" | "stop" | "stopLimit" | "trailingStop"
  size: number
  price?: number
  stopPrice?: number
  trailingPercent?: number
  leverage: number
  liquidationPrice: number
  margin: number
  fees: number
  total: number
}

interface TradeConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  tradeDetails: TradeDetails
  onConfirm: () => void
}

export default function TradeConfirmationModal({
  isOpen,
  onClose,
  tradeDetails,
  onConfirm,
}: TradeConfirmationModalProps) {
  if (!isOpen) return null

  const {
    market,
    side,
    type,
    size,
    price,
    stopPrice,
    trailingPercent,
    leverage,
    liquidationPrice,
    margin,
    fees,
    total,
  } = tradeDetails

  // Format order type for display
  const formatOrderType = (type: string) => {
    switch (type) {
      case "stopLimit":
        return "Stop Limit"
      case "trailingStop":
        return "Trailing Stop"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Confirm {side === "buy" ? "Buy" : "Sell"} Order</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Order summary */}
        <div className="bg-gray-800/50 p-4 rounded-md mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Market</span>
            <span className="font-medium">{market}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Order Type</span>
            <span className="font-medium">{formatOrderType(type)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Side</span>
            <span className={`font-medium ${side === "buy" ? "text-green-500" : "text-red-500"}`}>
              {side === "buy" ? "Buy / Long" : "Sell / Short"}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Size</span>
            <span className="font-medium">
              {size} {market.split("-")[0]}
            </span>
          </div>

          {price !== undefined && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Price</span>
              <span className="font-medium">${price.toFixed(2)}</span>
            </div>
          )}

          {stopPrice !== undefined && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Stop Price</span>
              <span className="font-medium">${stopPrice.toFixed(2)}</span>
            </div>
          )}

          {trailingPercent !== undefined && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Trailing %</span>
              <span className="font-medium">{trailingPercent}%</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Leverage</span>
            <span className="font-medium">{leverage}×</span>
          </div>

          <div className="border-t border-gray-700 my-3"></div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Liquidation Price</span>
            <span className="font-medium">${liquidationPrice.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Required Margin</span>
            <span className="font-medium">${margin.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Fees</span>
            <span className="font-medium">${fees.toFixed(2)}</span>
          </div>

          <div className="border-t border-gray-700 my-3"></div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Warning */}
        <div className="p-3 rounded-md flex items-start bg-yellow-500/10 text-yellow-500 mb-6">
          <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p>
              Please review your order details carefully. All trades are final and cannot be reversed once executed.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 ${
              side === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            } text-white rounded-md font-medium flex items-center justify-center`}
          >
            <Check size={18} className="mr-2" />
            Confirm {side === "buy" ? "Buy" : "Sell"}
          </button>
        </div>
      </div>
    </div>
  )
}

