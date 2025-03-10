// Trade History Types
export interface TradeHistoryItem {
  orderId: string;
  market: string;
  side: "buy" | "sell";
  type: string;
  size: number;
  price: number;
  value: number;
  fee: number;
  pnl: number;
  timestamp: string;
}

// PnL Analysis Types
export interface PnLDataPoint {
  timestamp: string;
  pnL: number;
  cumulativePnL: number;
}

export interface PnLSummary {
  totalPnL: number;
  winRate: number;
  bestTrade: number;
  worstTrade: number;
  averageProfitPerTrade: number;
  averageLossPerTrade: number;
  profitFactor: number;
}

export interface PnLByMarket {
  market: string;
  pnl: number;
}

// Liquidation History Types
export interface LiquidationHistoryItem {
  positionId: string;
  market: string;
  side: "long" | "short";
  reason: string;
  size: number;
  entryPrice: number;
  liquidationPrice: number;
  leverage: number;
  liquidationValue: number;
  timestamp: string;
}

// Funding Rate Types
export interface FundingRateDataPoint {
  timestamp: string;
  market: string;
  rate: number;
  amount: number;
  positionSize: number;
}

export interface FundingRateSummary {
  totalPaid: number;
  totalReceived: number;
  netFunding: number;
  averageRate: number;
}
