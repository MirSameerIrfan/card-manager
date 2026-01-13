import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  ChevronDown,
  Home,
  Menu,
  StickyNote,
  X,
  CreditCard,
  BarChart3,
  LogIn,
  UserPlus,
} from 'lucide-react'

const navTabs = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-linear-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl text-gray-900 hidden sm:inline">
              Card Manager
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors relative group"
                  activeProps={{
                    className: "flex items-center gap-2 px-4 py-2 text-emerald-600 font-bold transition-colors relative group"
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-emerald-600 to-teal-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )
            })}
          </nav>

          {/* Auth Buttons & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                to="/auth/signup"
                className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <UserPlus size={18} />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white text-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Menu</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Main Navigation Tabs */}
          {navTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Link
                key={tab.to}
                to={tab.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-gray-700 transition-all mb-2 font-medium"
                activeProps={{
                  className:
                    'flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700 font-bold transition-all mb-2 border-l-4 border-emerald-600',
                }}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </Link>
            )
          })}

          <div className="mt-6">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-2 font-semibold"
              onClick={() =>
                setGroupedExpanded((prev) => ({
                  ...prev,
                  StartSSRDemo: !prev.StartSSRDemo,
                }))
              }
            >
              <span className="flex items-center gap-3">
                <StickyNote size={20} />
                Examples
              </span>
              <span className={`transition-transform duration-300 ${groupedExpanded.StartSSRDemo ? 'rotate-180' : ''}`}>
                <ChevronDown size={20} />
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile Auth Buttons */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <Link
            to="/auth/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-emerald-600 font-semibold hover:bg-emerald-50 rounded-xl transition-all border-2 border-emerald-600"
          >
            <LogIn size={18} />
            Login
          </Link>
          <Link
            to="/auth/signup"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <UserPlus size={18} />
            Sign Up
          </Link>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
