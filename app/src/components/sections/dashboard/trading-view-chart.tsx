"use client"

import { useEffect, useRef } from "react"

interface TradingViewChartProps {
  symbol: string
}

declare global {
  interface Window {
    TradingView?: any
  }
}

export default function TradingViewChart({ symbol }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load TradingView widget script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = initializeWidget
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (window.TradingView && containerRef.current) {
      initializeWidget()
    }
  }, [symbol])

  const initializeWidget = () => {
    if (!window.TradingView || !containerRef.current) return

    containerRef.current.innerHTML = ""

    new window.TradingView.widget({
      container_id: containerRef.current.id,
      symbol: `BINANCE:${symbol.replace("-", "")}`,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#1e1e2d",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      height: "100%",
      width: "100%",
      studies: ["MASimple@tv-basicstudies", "RSI@tv-basicstudies"],
      disabled_features: ["header_symbol_search", "header_compare"],
      enabled_features: ["use_localstorage_for_settings"],
    })
  }

  return (
    <div className="w-full h-full min-h-[400px] bg-gray-900">
      <div id="tradingview_widget" ref={containerRef} className="w-full h-full" />
    </div>
  )
}

