import { Link } from '@tanstack/react-router'
import { ArrowRight, CreditCard, Bell, CheckCircle2, Clock } from 'lucide-react'
import { useScrollReveal } from '@/utils/useScrollReveal'

export function Hero() {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 })

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[90vh] flex items-center overflow-hidden bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/4 w-150 h-150 rounded-full bg-emerald-200/20 blur-3xl animate-gentle-pulse"></div>
                <div className="absolute -bottom-1/3 -left-1/4 w-125 h-125 rounded-full bg-teal-200/20 blur-3xl animate-gentle-pulse" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-1/4 left-1/2 w-80 h-80 rounded-full bg-cyan-200/10 blur-3xl animate-gentle-pulse" style={{ animationDelay: '5s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div className="space-y-8">
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                }`}
                        >
                            <Bell className="w-4 h-4" />
                            Early access · Free while in beta
                        </div>

                        <h1
                            className={`text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                }`}
                        >
                            Your bills,
                            <span className="block text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
                                on autopilot
                            </span>
                        </h1>

                        <p
                            className={`text-xl text-gray-600 max-w-xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                }`}
                        >
                            Track credit cards, loans, and recurring bills in one place. See what's due, what's overdue, and what's on auto-pay, and stay ahead of late fees.
                        </p>

                        <div
                            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                }`}
                        >
                            <Link
                                to="/auth/signup"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <a href="#features" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
                                See How It Works
                            </a>
                        </div>

                        {/* Stats */}
                        <div
                            className={`flex gap-8 pt-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                                }`}
                        >
                            {[
                                { value: 'Free', label: 'During early access' },
                                { value: '3', label: 'Payment types: cards, loans, bills' },
                                { value: '0', label: 'Bank logins needed' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right visual */}
                    <div className="relative">
                        <div className="relative z-10 space-y-4">
                            {/* Card mockup 1 */}
                            <div
                                className={`bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-all duration-500 relative overflow-hidden ring-1 ring-white/40 hover:shadow-emerald-500/10 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                                    }`}
                                style={{ transitionDelay: '300ms' }}
                            >
                                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-white/80 via-white/20 to-emerald-100/30 opacity-60"></div>
                                <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/50 blur-2xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Chase Sapphire</div>
                                                <div className="text-sm text-gray-500">••••4589</div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                            Due in 3 days
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-sm text-gray-500">Amount Due</div>
                                            <div className="text-2xl font-bold text-gray-900">$1,247.50</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">Due Date</div>
                                            <div className="font-semibold text-gray-900">Jan 15, 2026</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card mockup 2 */}
                            <div
                                className={`bg-white rounded-2xl shadow-2xl p-6 transform -rotate-1 hover:rotate-0 transition-all duration-500 ml-8 relative overflow-hidden ring-1 ring-white/40 hover:shadow-teal-500/10 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                                    }`}
                                style={{ transitionDelay: '500ms' }}
                            >
                                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-white/80 via-white/20 to-cyan-100/30 opacity-60"></div>
                                <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/50 blur-2xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">Car Loan</div>
                                                <div className="text-sm text-gray-500">Honda Finance</div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                            Auto-pay on
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-sm text-gray-500">Monthly Payment</div>
                                            <div className="text-2xl font-bold text-gray-900">$485.00</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">Next Payment</div>
                                            <div className="font-semibold text-gray-900">Jan 20, 2026</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating notification */}
                        <div
                            className={`absolute -bottom-4 -left-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl shadow-emerald-600/30 animate-float z-20 ${isVisible ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{ transitionDelay: '700ms', transition: 'opacity 0.7s ease' }}
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-semibold">Marked as paid!</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
