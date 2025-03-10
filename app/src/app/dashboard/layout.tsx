"use client"

import DashboardHeader from "@/components/layout/dashboard/header";
import DashboardSidebar from "@/components/layout/dashboard/sidebar";
import { useState, type ReactNode } from "react"

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <DashboardHeader sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <DashboardSidebar open={sidebarOpen} />
        <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

