"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Sliders } from "lucide-react"
import LeverageModal from "./leverage-modal"
import TradeConfirmationModal from "./trade-confirmation-modal"

interface OrderFormProps {
  market: string
}

type OrderType = "market" | "limit" | "stop" | "stopLimit" | "trailingStop"
type OrderSide = "buy" | "sell"

export default function OrderForm({ market }: OrderFormProps) {
  const [orderType, setOrderType] = useState<OrderType>("market")
  const [orderSide, setOrderSide] = useState<OrderSide>("buy")
  const [price, setPrice] = useState("")
  const [amount, setAmount] = useState("")
  const [stopPrice, setStopPrice] = useState("")
  const [trailingPercent, setTrailingPercent] = useState("")
  const [leverage, setLeverage] = useState(10)
  const [liquidationPrice, setLiquidationPrice] = useState(0)

  // Modals
  const [leverageModalOpen, setLeverageModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  // Market price (simulated)
  const [marketPrice, setMarketPrice] = useState(
    market.startsWith("BTC") ? 65000 : market.startsWith("ETH") ? 3500 : market.startsWith("SOL") ? 150 : 100,
  )

  console.log(setMarketPrice(100))

  // Calculate estimated total
  const total =
    price && amount
      ? Number.parseFloat(price) * Number.parseFloat(amount)
      : marketPrice * (amount ? Number.parseFloat(amount) : 0)

  // Calculate margin
  const margin = total / leverage

  // Calculate fees (0.05%)
  const fees = total * 0.0005

  // Calculate liquidation price
  useEffect(() => {
    if (!amount || (!price && orderType !== "market")) return

    const entryPrice = orderType === "market" ? marketPrice : Number.parseFloat(price)
    const positionSize = Number.parseFloat(amount || "0")

    if (entryPrice && positionSize) {
      // Simplified liquidation price calculation
      // In reality, this would include funding rates, maintenance margin, etc.
      const liquidationBuffer = 1 / leverage

      if (orderSide === "buy") {
        // For long positions: entry price * (1 - liquidation buffer)
        setLiquidationPrice(entryPrice * (1 - liquidationBuffer))
      } else {
        // For short positions: entry price * (1 + liquidation buffer)
        setLiquidationPrice(entryPrice * (1 + liquidationBuffer))
      }
    }
  }, [amount, price, leverage, orderSide, orderType, marketPrice])

  // Determine if the form is valid
  const isValid = () => {
    if (orderType === "market" && amount) return true
    if (orderType === "limit" && price && amount) return true
    if (orderType === "stop" && stopPrice && amount) return true
    if (orderType === "stopLimit" && price && stopPrice && amount) return true
    if (orderType === "trailingStop" && trailingPercent && amount) return true
    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isValid()) {
      setConfirmModalOpen(true)
    }
  }

  const handleConfirmTrade = () => {
    // Here you would submit the order to your backend
    console.log({
      market,
      orderType,
      orderSide,
      price: price ? Number.parseFloat(price) : marketPrice,
      amount: amount ? Number.parseFloat(amount) : 0,
      stopPrice: stopPrice ? Number.parseFloat(stopPrice) : undefined,
      trailingPercent: trailingPercent ? Number.parseFloat(trailingPercent) : undefined,
      leverage,
      liquidationPrice,
      margin,
      fees,
      total,
    })

    // Close modal and reset form
    setConfirmModalOpen(false)

    // Show success message or notification
    alert(`${orderSide === "buy" ? "Buy" : "Sell"} order placed successfully!`)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Place Order</h3>
        <div className="text-xs text-gray-400">Balance: 2.5 BTC / $125,000</div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Order type selector */}
        <div className="mb-4">
          <div className="flex bg-gray-800 rounded-md p-1">
            <button
              type="button"
              className={`flex-1 text-xs py-1.5 rounded-md ${orderType === "market" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setOrderType("market")}
            >
              Market
            </button>
            <button
              type="button"
              className={`flex-1 text-xs py-1.5 rounded-md ${orderType === "limit" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setOrderType("limit")}
            >
              Limit
            </button>
            <button
              type="button"
              className={`flex-1 text-xs py-1.5 rounded-md ${orderType === "stop" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setOrderType("stop")}
            >
              Stop
            </button>
            <button
              type="button"
              className={`flex-1 text-xs py-1.5 rounded-md ${orderType === "stopLimit" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setOrderType("stopLimit")}
            >
              Stop Limit
            </button>
            <button
              type="button"
              className={`flex-1 text-xs py-1.5 rounded-md ${orderType === "trailingStop" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"}`}
              onClick={() => setOrderType("trailingStop")}
            >
              Trailing
            </button>
          </div>
        </div>

        {/* Buy/Sell selector */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`py-2 rounded-md flex items-center justify-center ${
                orderSide === "buy" ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setOrderSide("buy")}
            >
              <ArrowUp size={16} className="mr-1" />
              Buy
            </button>
            <button
              type="button"
              className={`py-2 rounded-md flex items-center justify-center ${
                orderSide === "sell" ? "bg-red-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setOrderSide("sell")}
            >
              <ArrowDown size={16} className="mr-1" />
              Sell
            </button>
          </div>
        </div>

        {/* Leverage selector */}
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Leverage</label>
          <button
            type="button"
            onClick={() => setLeverageModalOpen(true)}
            className="w-full flex items-center justify-between bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm hover:bg-gray-700"
          >
            <span>{leverage}×</span>
            <Sliders size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Price input (for limit, stop limit) */}
        {(orderType === "limit" || orderType === "stopLimit") && (
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Price (USD)</label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        )}

        {/* Stop Price input (for stop, stop limit) */}
        {(orderType === "stop" || orderType === "stopLimit") && (
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Stop Price (USD)</label>
            <div className="relative">
              <input
                type="number"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        )}

        {/* Trailing Percent (for trailing stop) */}
        {orderType === "trailingStop" && (
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Trailing Percent (%)</label>
            <div className="relative">
              <input
                type="number"
                value={trailingPercent}
                onChange={(e) => setTrailingPercent(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>
        )}

        {/* Amount input */}
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Amount ({market.split("-")[0]})</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
              step="0.001"
              min="0"
            />
            <div className="absolute right-0 top-0 h-full flex space-x-1 p-1">
              <button
                type="button"
                className="px-2 bg-gray-700 rounded text-xs hover:bg-gray-600"
                onClick={() => setAmount((Number.parseFloat(amount) || 0) * 0.25 + "")}
              >
                25%
              </button>
              <button
                type="button"
                className="px-2 bg-gray-700 rounded text-xs hover:bg-gray-600"
                onClick={() => setAmount((Number.parseFloat(amount) || 0) * 0.5 + "")}
              >
                50%
              </button>
              <button
                type="button"
                className="px-2 bg-gray-700 rounded text-xs hover:bg-gray-600"
                onClick={() => setAmount((Number.parseFloat(amount) || 0) * 0.75 + "")}
              >
                75%
              </button>
              <button
                type="button"
                className="px-2 bg-gray-700 rounded text-xs hover:bg-gray-600"
                onClick={() => setAmount("2.5")} // Max balance
              >
                Max
              </button>
            </div>
          </div>
        </div>

        {/* Liquidation price */}
        {amount && (
          <div className="mb-4 p-3 bg-gray-800/50 rounded-md">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Liquidation Price:</span>
              <span className={`font-medium ${orderSide === "buy" ? "text-red-500" : "text-green-500"}`}>
                ${liquidationPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Margin:</span>
            <span>${margin.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Fee (0.05%):</span>
            <span>${fees.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!isValid()}
          className={`w-full py-3 rounded-md font-medium ${
            orderSide === "buy"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {orderSide === "buy" ? "Buy" : "Sell"} {market.split("-")[0]}
        </button>
      </form>

      {/* Leverage Modal */}
      <LeverageModal
        isOpen={leverageModalOpen}
        onClose={() => setLeverageModalOpen(false)}
        initialLeverage={leverage}
        market={market}
        onConfirm={(newLeverage) => {
          setLeverage(newLeverage)
          setLeverageModalOpen(false)
        }}
      />

      {/* Confirmation Modal */}
      <TradeConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        tradeDetails={{
          market,
          side: orderSide,
          type: orderType,
          size: Number.parseFloat(amount || "0"),
          price: orderType === "market" ? marketPrice : Number.parseFloat(price || "0"),
          stopPrice: stopPrice ? Number.parseFloat(stopPrice) : undefined,
          trailingPercent: trailingPercent ? Number.parseFloat(trailingPercent) : undefined,
          leverage,
          liquidationPrice,
          margin,
          fees,
          total,
        }}
        onConfirm={handleConfirmTrade}
      />
    </div>
  )
}

