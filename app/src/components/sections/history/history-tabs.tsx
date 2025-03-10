"use client"

import { LineChart, AlertTriangle, DollarSign, Clock } from "lucide-react"

type TabType = "trades" | "pnl" | "liquidations" | "funding"

interface HistoryTabsProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export default function HistoryTabs({ activeTab, setActiveTab }: HistoryTabsProps) {
  const tabs = [
    {
      id: "trades" as TabType,
      label: "Trade History",
      icon: <Clock size={16} />,
    },
    {
      id: "pnl" as TabType,
      label: "PnL Analysis",
      icon: <LineChart size={16} />,
    },
    {
      id: "liquidations" as TabType,
      label: "Liquidations",
      icon: <AlertTriangle size={16} />,
    },
    {
      id: "funding" as TabType,
      label: "Funding Rates",
      icon: <DollarSign size={16} />,
    },
  ]

  return (
    <div className="flex flex-wrap border-b border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
            activeTab === tab.id
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}

