"use client"

import type React from "react"

import { useState } from "react"
import {
  Home,
  BarChart2,
  Wallet,
  History,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Zap,
  Users,
  Shield,
} from "lucide-react"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  hasSubmenu?: boolean
  open?: boolean
  onClick?: () => void
}

function SidebarItem({ icon, label, active = false, hasSubmenu = false, open = false, onClick }: SidebarItemProps) {
  return (
    <button
      className={`w-full flex items-center px-4 py-3 text-left ${
        active ? "bg-blue-500/10 text-blue-500" : "text-gray-400 hover:bg-gray-800 hover:text-white"
      } transition-colors rounded-md`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span className="flex-1">{label}</span>
      {hasSubmenu && <span className="ml-2">{open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
    </button>
  )
}

interface DashboardSidebarProps {
  open: boolean
}

export default function DashboardSidebar({ open }: DashboardSidebarProps) {
  const [marketsOpen, setMarketsOpen] = useState(true)

  return (
    <aside
      className={`fixed top-16 bottom-0 left-0 w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto transition-transform duration-300 z-10 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <div className="mb-6">
          <div className="text-xs uppercase text-gray-500 font-semibold mb-2 px-2">Main</div>
          <nav className="space-y-1">
            <SidebarItem icon={<Home size={18} />} label="Dashboard" />
            <SidebarItem
              icon={<BarChart2 size={18} />}
              label="Markets"
              active={true}
              hasSubmenu={true}
              open={marketsOpen}
              onClick={() => setMarketsOpen(!marketsOpen)}
            />

            {marketsOpen && (
              <div className="ml-8 space-y-1 mt-1">
                <SidebarItem icon={<DollarSign size={16} />} label="BTC-PERP" active={true} />
                <SidebarItem icon={<DollarSign size={16} />} label="ETH-PERP" />
                <SidebarItem icon={<DollarSign size={16} />} label="SOL-PERP" />
                <SidebarItem icon={<DollarSign size={16} />} label="AVAX-PERP" />
              </div>
            )}

            <SidebarItem icon={<Wallet size={18} />} label="Wallet" />
            <SidebarItem icon={<History size={18} />} label="History" />
          </nav>
        </div>

        <div className="mb-6">
          <div className="text-xs uppercase text-gray-500 font-semibold mb-2 px-2">Account</div>
          <nav className="space-y-1">
            <SidebarItem icon={<Settings size={18} />} label="Settings" />
            <SidebarItem icon={<Shield size={18} />} label="Security" />
            <SidebarItem icon={<Users size={18} />} label="Referrals" />
          </nav>
        </div>

        <div className="mb-6">
          <div className="text-xs uppercase text-gray-500 font-semibold mb-2 px-2">Support</div>
          <nav className="space-y-1">
            <SidebarItem icon={<HelpCircle size={18} />} label="Help Center" />
            <SidebarItem icon={<Zap size={18} />} label="Status" />
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-800">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mr-3">
                <Wallet size={16} />
              </div>
              <div>
                <div className="text-sm font-medium">Total Balance</div>
                <div className="text-xs text-gray-400">Across all markets</div>
              </div>
            </div>
            <div className="text-xl font-bold">$24,385.00</div>
            <div className="text-xs text-green-500 mt-1">+$1,240.00 (5.4%)</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

