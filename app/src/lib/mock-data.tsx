import type {
    TradeHistoryItem,
    PnLDataPoint,
    PnLSummary,
    PnLByMarket,
    LiquidationHistoryItem,
    FundingRateDataPoint,
    FundingRateSummary,
  } from "@/types/history"
  
  // Helper to generate random date within a timeframe
  // const getRandomDate = (timeframe: "day" | "week" | "month" | "year"): Date => {
  //   const now = new Date()
  //   const pastDate = new Date()
  
  //   switch (timeframe) {
  //     case "day":
  //       pastDate.setHours(now.getHours() - 24)
  //       break
  //     case "week":
  //       pastDate.setDate(now.getDate() - 7)
  //       break
  //     case "month":
  //       pastDate.setMonth(now.getMonth() - 1)
  //       break
  //     case "year":
  //       pastDate.setFullYear(now.getFullYear() - 1)
  //       break
  //   }
  
  //   return new Date(pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime()))
  // }
  
  // Generate mock trade history data
  export const generateTradeHistory = (count: number): TradeHistoryItem[] => {
    const markets = ["BTC-PERP", "ETH-PERP", "SOL-PERP", "AVAX-PERP", "MATIC-PERP"]
    const orderTypes = ["market", "limit", "stop", "stopLimit"]
  
    return Array.from({ length: count }, (_, i) => {
      const market = markets[Math.floor(Math.random() * markets.length)]
      const side = Math.random() > 0.5 ? "buy" : "sell"
      const type = orderTypes[Math.floor(Math.random() * orderTypes.length)]
      const basePrice = market.startsWith("BTC")
        ? 65000
        : market.startsWith("ETH")
          ? 3500
          : market.startsWith("SOL")
            ? 150
            : 100
  
      const price = basePrice * (1 + (Math.random() * 0.1 - 0.05)) // ±5% from base price
      const size = Math.random() * 5 // Random size up to 5 units
      const value = price * size
      const fee = value * 0.0005 // 0.05% fee
      const pnl =
        Math.random() > 0.6
          ? Math.random() * 500
          : // 60% chance of profit
            -Math.random() * 300 // 40% chance of loss
  
      return {
        orderId: `ORD-${Date.now()}-${i}`,
        market,
        side,
        type,
        size,
        price,
        value,
        fee,
        pnl,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 30 days
      }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by timestamp descending
  }
  
  // Generate mock PnL data
  export const generatePnLData = (timeframe: "day" | "week" | "month" | "year") => {
    const markets = ["BTC-PERP", "ETH-PERP", "SOL-PERP", "AVAX-PERP", "MATIC-PERP"]
    const dataPoints: PnLDataPoint[] = []
  
    // Determine number of data points based on timeframe
    let numPoints = 0
    switch (timeframe) {
      case "day":
        numPoints = 24 // Hourly for a day
        break
      case "week":
        numPoints = 7 * 4 // 4 times a day for a week
        break
      case "month":
        numPoints = 30 // Daily for a month
        break
      case "year":
        numPoints = 52 // Weekly for a year
        break
    }
  
    // Generate data points
    let cumulativePnL = 0
    const now = new Date()
    const startDate = new Date()
  
    switch (timeframe) {
      case "day":
        startDate.setHours(now.getHours() - 24)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }
  
    const timeInterval = (now.getTime() - startDate.getTime()) / numPoints
  
    for (let i = 0; i < numPoints; i++) {
      const timestamp = new Date(startDate.getTime() + i * timeInterval).toISOString()
  
      // Generate random PnL with some trend
      const pnlChange = (Math.random() * 200 - 80) * (1 + i / numPoints) // Tends to improve over time
      cumulativePnL += pnlChange
  
      dataPoints.push({
        timestamp,
        pnL: pnlChange,
        cumulativePnL,
      })
    }
  
    // Generate PnL by market
    const pnlByMarket: PnLByMarket[] = markets
      .map((market) => {
        return {
          market,
          pnl: Math.random() * 2000 - 800, // Random PnL between -800 and +1200
        }
      })
      .sort((a, b) => b.pnl - a.pnl) // Sort by PnL descending
  
    // Calculate summary statistics
    const trades = generateTradeHistory(100) // Generate some trades for statistics
    const winningTrades = trades.filter((t) => t.pnl > 0)
    const losingTrades = trades.filter((t) => t.pnl < 0)
  
    const summary: PnLSummary = {
      totalPnL: cumulativePnL,
      winRate: winningTrades.length / trades.length,
      bestTrade: Math.max(...trades.map((t) => t.pnl)),
      worstTrade: Math.min(...trades.map((t) => t.pnl)),
      averageProfitPerTrade:
        winningTrades.length > 0 ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0,
      averageLossPerTrade:
        losingTrades.length > 0 ? losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length : 0,
      profitFactor:
        losingTrades.length > 0
          ? Math.abs(winningTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.reduce((sum, t) => sum + t.pnl, 0))
          : 0,
    }
  
    return { data: dataPoints, summary, byMarket: pnlByMarket }
  }
  
  // Generate mock liquidation history
  export const generateLiquidationHistory = (count: number): LiquidationHistoryItem[] => {
    const markets = ["BTC-PERP", "ETH-PERP", "SOL-PERP", "AVAX-PERP", "MATIC-PERP"]
    const reasons = ["Insufficient margin", "Market volatility", "Funding rate impact", "Stop loss failure"]
  
    return Array.from({ length: count }, (_, i) => {
      const market = markets[Math.floor(Math.random() * markets.length)]
      const side = Math.random() > 0.5 ? "long" : "short"
      const reason = reasons[Math.floor(Math.random() * reasons.length)]
      const basePrice = market.startsWith("BTC")
        ? 65000
        : market.startsWith("ETH")
          ? 3500
          : market.startsWith("SOL")
            ? 150
            : 100
  
      const entryPrice = basePrice * (1 + (Math.random() * 0.1 - 0.05)) // ±5% from base price
      const liquidationPrice =
        side === "long"
          ? entryPrice * (1 - Math.random() * 0.2)
          : // 0-20% below entry for longs
            entryPrice * (1 + Math.random() * 0.2) // 0-20% above entry for shorts
  
      const size = Math.random() * 5 // Random size up to 5 units
      const leverage = 5 + Math.floor(Math.random() * 45) // Random leverage between 5x and 50x
      const liquidationValue = (entryPrice * size) / leverage
  
      return {
        positionId: `POS-${Date.now()}-${i}`,
        market,
        side,
        reason,
        size,
        entryPrice,
        liquidationPrice,
        leverage,
        liquidationValue,
        timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 90 days
      }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by timestamp descending
  }
  
  // Generate mock funding rate data
  export const generateFundingRateData = (timeframe: "week" | "month" | "year") => {
    const markets = ["BTC-PERP", "ETH-PERP", "SOL-PERP", "AVAX-PERP", "MATIC-PERP"]
    const dataPoints: FundingRateDataPoint[] = []
  
    // Determine number of funding periods based on timeframe (8-hour periods)
    let numPeriods = 0
    switch (timeframe) {
      case "week":
        numPeriods = 7 * 3 // 3 times a day for a week
        break
      case "month":
        numPeriods = 30 * 3 // 3 times a day for a month
        break
      case "year":
        numPeriods = 365 * 3 // 3 times a day for a year
        break
    }
  
    // Generate data points
    const now = new Date()
    const startDate = new Date()
  
    switch (timeframe) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }
  
    const timeInterval = (now.getTime() - startDate.getTime()) / numPeriods
  
    let totalPaid = 0
    let totalReceived = 0
    let rateSum = 0
    let rateCount = 0
  
    for (let i = 0; i < numPeriods; i++) {
      const timestamp = new Date(startDate.getTime() + i * timeInterval).toISOString()
  
      // For each funding period, generate 1-3 funding payments for different markets
      const numPayments = 1 + Math.floor(Math.random() * 3)
  
      for (let j = 0; j < numPayments; j++) {
        const market = markets[Math.floor(Math.random() * markets.length)]
  
        // Generate random funding rate between -0.1% and 0.1%
        const rate = Math.random() * 0.002 - 0.001
  
        // Position size
        const positionSize = Math.random() * 10 + 0.5
  
        // Calculate funding amount
        const basePrice = market.startsWith("BTC")
          ? 65000
          : market.startsWith("ETH")
            ? 3500
            : market.startsWith("SOL")
              ? 150
              : 100
  
        const positionValue = basePrice * positionSize
        const amount = positionValue * rate
  
        dataPoints.push({
          timestamp,
          market,
          rate,
          amount,
          positionSize,
        })
  
        // Update summary statistics
        if (amount < 0) {
          totalPaid += Math.abs(amount)
        } else {
          totalReceived += amount
        }
  
        rateSum += rate
        rateCount++
      }
    }
  
    // Calculate summary
    const summary: FundingRateSummary = {
      totalPaid,
      totalReceived,
      netFunding: totalReceived - totalPaid,
      averageRate: rateCount > 0 ? rateSum / rateCount : 0,
    }
  
    return {
      data: dataPoints.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      summary,
    }
  }
  
  