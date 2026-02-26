import { Link } from '@tanstack/react-router'
import { Home, ArrowLeft, CreditCard, Search } from 'lucide-react'

export function NotFound() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-4 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-linear-to-br from-emerald-50/50 via-white to-cyan-50/50"></div>
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-200/15 blur-3xl animate-gentle-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-teal-200/15 blur-3xl animate-gentle-pulse" style={{ animationDelay: '3s' }}></div>

            {/* Floating cards illustration */}
            <div className="relative w-64 h-40 mb-4">
                <div className="absolute top-0 left-6 w-44 h-28 bg-white rounded-2xl shadow-xl border border-gray-100 transform -rotate-6 animate-float">
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-white" />
                            </div>
                            <div className="w-16 h-2.5 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="w-24 h-2 bg-gray-100 rounded-full mb-1.5"></div>
                        <div className="w-16 h-2 bg-gray-100 rounded-full"></div>
                    </div>
                </div>
                <div className="absolute top-8 right-4 w-44 h-28 bg-white rounded-2xl shadow-xl border border-gray-100 transform rotate-3 animate-float" style={{ animationDelay: '1.5s' }}>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
                                <Search className="w-4 h-4 text-white" />
                            </div>
                            <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="w-28 h-2 bg-gray-100 rounded-full mb-1.5"></div>
                        <div className="w-20 h-2 bg-gray-100 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                    Looks like this page has gone off the grid. Don't worry — your payments are still safe and sound.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-0.5"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
