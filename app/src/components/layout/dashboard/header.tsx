"use client"

import { useState } from "react"
import { Menu, Bell, ChevronDown, User, LogOut, Settings, Moon, Sun } from "lucide-react"
import Logo from "@/components/ui/logo"

interface DashboardHeaderProps {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export default function DashboardHeader({ sidebarOpen, toggleSidebar }: DashboardHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 z-10">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-md hover:bg-gray-800 transition-colors"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu size={20} />
        </button>
        <Logo />
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-md hover:bg-gray-800 transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 rounded-md hover:bg-gray-800 transition-colors relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800 transition-colors"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="hidden md:block">trader@swiv.io</span>
            <ChevronDown size={16} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-20">
              <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
                <User size={16} className="mr-2" />
                <span>Profile</span>
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 transition-colors">
                <Settings size={16} className="mr-2" />
                <span>Settings</span>
              </button>
              <div className="border-t border-gray-700 my-1"></div>
              <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors">
                <LogOut size={16} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

