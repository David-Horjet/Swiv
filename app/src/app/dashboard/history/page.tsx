"use client";

import FundingRateAnalysis from "@/components/sections/history/funding-rate-analysis";
import HistoryTabs from "@/components/sections/history/history-tabs";
import LiquidationHistory from "@/components/sections/history/liquidation-history";
import PnLAnalysis from "@/components/sections/history/pnl-analysis";
import TradeHistory from "@/components/sections/history/trade-history";
import { useState } from "react";

type TabType = "trades" | "pnl" | "liquidations" | "funding";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("trades");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Transaction History & Analytics
        </h1>
        <p className="text-gray-400">
          View your trading history, analyze performance, and track funding
          payments
        </p>
      </div>

      <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6">
        {activeTab === "trades" && <TradeHistory />}
        {activeTab === "pnl" && <PnLAnalysis />}
        {activeTab === "liquidations" && <LiquidationHistory />}
        {activeTab === "funding" && <FundingRateAnalysis />}
      </div>
    </div>
  );
}
