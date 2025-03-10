"use client";

import MarketInfo from "@/components/sections/dashboard/market-info";
import MarketSelector from "@/components/sections/dashboard/market-selector";
import OrderBook from "@/components/sections/dashboard/order-book";
import OrderForm from "@/components/sections/dashboard/order-form";
import PositionsTable from "@/components/sections/dashboard/positions-table";
import RecentTrades from "@/components/sections/dashboard/recent-trades";
import TradingViewChart from "@/components/sections/dashboard/trading-view-chart";
import { useState } from "react";

export default function TradingDashboard() {
  const [selectedMarket, setSelectedMarket] = useState("BTC-PERP");

  return (
    <div className="h-full flex flex-col">
      {/* Market selector and info bar */}
      <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 p-2">
        <MarketSelector
          selectedMarket={selectedMarket}
          onSelectMarket={setSelectedMarket}
        />
        <MarketInfo market={selectedMarket} />
      </div>

      {/* Main trading area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-1 overflow-hidden">
        {/* Left panel - Chart */}
        <div className="lg:col-span-2 bg-gray-900 flex flex-col">
          <TradingViewChart symbol={selectedMarket} />
        </div>

        {/* Right panel - Order book and trades */}
        <div className="bg-gray-900 flex flex-col h-full overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col">
            <OrderBook market={selectedMarket} />
            <RecentTrades market={selectedMarket} />
          </div>
        </div>
      </div>

      {/* Bottom panel - Order form and positions */}
      <div className="h-80 grid grid-cols-1 lg:grid-cols-3 gap-1 bg-gray-900">
        <div className="lg:col-span-1 bg-gray-900 border-t border-gray-800">
          <OrderForm market={selectedMarket} />
        </div>
        <div className="lg:col-span-2 bg-gray-900 border-t border-gray-800 overflow-auto">
          <PositionsTable />
        </div>
      </div>
    </div>
  );
}
