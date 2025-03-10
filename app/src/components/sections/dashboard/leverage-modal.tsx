"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, AlertTriangle, Info } from "lucide-react"

interface LeverageModalProps {
  isOpen: boolean
  onClose: () => void
  initialLeverage: number
  market: string
  onConfirm: (leverage: number) => void
}

export default function LeverageModal({
  isOpen,
  onClose,
  initialLeverage = 10,
  market,
  onConfirm,
}: LeverageModalProps) {
  const [leverage, setLeverage] = useState(initialLeverage)
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low")

  // Update risk level based on leverage
  useEffect(() => {
    if (leverage <= 10) {
      setRiskLevel("low")
    } else if (leverage <= 25) {
      setRiskLevel("medium")
    } else {
      setRiskLevel("high")
    }
  }, [leverage])

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeverage(Number.parseInt(e.target.value))
  }

  // Quick select buttons
  const leveragePresets = [1, 5, 10, 25, 50]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Adjust Leverage for {market}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Leverage</span>
            <span className="text-xl font-bold">{leverage}×</span>
          </div>

          <div className="relative mb-4">
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={leverage}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  ${leverage <= 10 ? "#10b981" : leverage <= 25 ? "#f59e0b" : "#ef4444"} 0%, 
                  ${leverage <= 10 ? "#10b981" : leverage <= 25 ? "#f59e0b" : "#ef4444"} ${(leverage / 50) * 100}%, 
                  #374151 ${(leverage / 50) * 100}%, 
                  #374151 100%)`,
              }}
            />

            {/* Custom thumb */}
            <div
              className="absolute w-5 h-5 bg-white rounded-full shadow pointer-events-none"
              style={{
                left: `calc(${(leverage / 50) * 100}% - 10px)`,
                top: "-6px",
              }}
            ></div>

            {/* Tick marks */}
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-gray-500">1×</span>
              <span className="text-xs text-gray-500">10×</span>
              <span className="text-xs text-gray-500">20×</span>
              <span className="text-xs text-gray-500">30×</span>
              <span className="text-xs text-gray-500">40×</span>
              <span className="text-xs text-gray-500">50×</span>
            </div>
          </div>

          {/* Quick select buttons */}
          <div className="flex justify-between gap-2 mb-4">
            {leveragePresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setLeverage(preset)}
                className={`flex-1 py-1.5 text-sm rounded-md ${
                  leverage === preset ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {preset}×
              </button>
            ))}
          </div>

          {/* Risk indicator */}
          <div
            className={`p-3 rounded-md flex items-start ${
              riskLevel === "low"
                ? "bg-green-500/10 text-green-500"
                : riskLevel === "medium"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-red-500/10 text-red-500"
            }`}
          >
            <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">
                {riskLevel === "low" ? "Low Risk" : riskLevel === "medium" ? "Medium Risk" : "High Risk"}
              </p>
              <p className="text-sm mt-1 opacity-80">
                {riskLevel === "low"
                  ? "Conservative leverage with lower liquidation risk."
                  : riskLevel === "medium"
                    ? "Moderate risk with potential for higher returns."
                    : "High liquidation risk. Only for experienced traders."}
              </p>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="bg-gray-800/50 p-3 rounded-md mb-6 flex items-start">
          <Info size={18} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p>
              Higher leverage increases both potential profits and losses. Your liquidation price will be closer to your
              entry price with higher leverage.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(leverage)}
            className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

