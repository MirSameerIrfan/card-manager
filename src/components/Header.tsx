import { Link, useNavigate } from '@tanstack/react-router'

import { useEffect, useRef, useState } from 'react'
import {
  Home,
  Menu,
  X,
  BarChart3,
  LogIn,
  UserPlus,
  LogOut,
  Settings,
  ChevronDown,
  Info,
} from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'

const navTabs = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'About', to: '/about', icon: Info },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { data: session, isPending: isSessionLoading } = useSession()
  const isLoggedIn = !!session?.user && session.user.emailVerified === true
  const user = session?.user ?? null
  const navigate = useNavigate()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Track scroll position for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mark as mounted after hydration to prevent SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isUserMenuOpen) return
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isUserMenuOpen])

  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false)
      await signOut()
      await navigate({ to: '/auth/login' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const userInitial = (user?.name?.trim() || user?.email?.trim() || 'U')
    .charAt(0)
    .toUpperCase()

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm shadow-gray-900/5'
          : 'bg-white border-b border-gray-200 shadow-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-linear-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all">
              <img src="/logo.svg" alt="MoneyScope logo" className="h-6 w-6" />
            </div>
            <span className="font-black text-xl text-gray-900 hidden sm:inline">
              MoneyScope
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              Early access
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
              {!mounted || isSessionLoading ? (
                <>
                  <div className="h-10 w-24 rounded-xl bg-gray-100 animate-pulse" />
                  <div className="h-10 w-28 rounded-xl bg-emerald-100 animate-pulse" />
                </>
              ) : (
                isLoggedIn ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen((open) => !open)}
                      className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-800 transition-all hover:border-emerald-200 hover:bg-emerald-50"
                      aria-haspopup="menu"
                      aria-expanded={isUserMenuOpen}
                      aria-label="Open user menu"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-sm">
                        {userInitial}
                      </span>
                      <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen ? (
                      <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-lg p-2 shadow-xl">
                        <Link
                          to="/settings/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Settings size={16} />
                          Profile settings
                        </Link>
                        <button
                          onClick={() => void handleLogout()}
                          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                    >
                      <LogIn size={18} />
                      <span className="hidden sm:inline">Login</span>
                    </Link>
                    <Link
                      to="/auth/signup"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                      <UserPlus size={18} />
                      <span className="hidden sm:inline">Sign Up</span>
                    </Link>
                  </>
                )
              )}
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
        className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl text-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <img src="/logo.svg" alt="MoneyScope logo" className="h-6 w-6" />
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
        </nav>

        {/* Mobile Auth Buttons */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {mounted && !isSessionLoading && (
            isLoggedIn ? (
              <>
                <Link
                  to="/settings/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-emerald-700 font-semibold hover:bg-emerald-50 rounded-xl transition-all border border-emerald-200"
                >
                  <Settings size={18} />
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    void handleLogout()
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )
          )}
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
