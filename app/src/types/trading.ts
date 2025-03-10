export interface OrderBookEntry {
    price: number
    size: number
    total: number
    depth: number
  }
  
  export interface Position {
    id: string
    market: string
    side: "long" | "short"
    size: number
    leverage: number
    entryPrice: number
    markPrice: number
    liquidationPrice: number
    pnl: number
    pnlPercentage: number
    margin: number
    timestamp: number
  }
  
  export interface Trade {
    id: string
    market: string
    price: number
    size: number
    side: "buy" | "sell"
    timestamp: number
  }
  
  