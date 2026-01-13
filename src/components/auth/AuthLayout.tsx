import { Link } from '@tanstack/react-router'
import { CreditCard, CheckCircle2 } from 'lucide-react'

interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    subtitle: string
}

const features = [
    'Bank-level security',
    'No credit card required',
    '2-minute setup',
    'Cancel anytime'
]

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-8 group">
                        <div className="w-12 h-12 bg-linear-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                            <CreditCard className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-black text-2xl text-gray-900">
                            Card Manager
                        </span>
                    </Link>

                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">
                            {title}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {subtitle}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>

            {/* Right Side - Visual/Benefits */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/4 w-150 h-150 rounded-full bg-emerald-200/20 blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-1/3 -left-1/4 w-125 h-125 rounded-full bg-teal-200/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">
                            Never miss a payment again
                        </h2>
                        <p className="text-xl text-gray-600">
                            Join thousands who track bills effortlessly and save money every month.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-medium text-gray-700">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8">
                        <div>
                            <div className="text-3xl font-black text-gray-900">50K+</div>
                            <div className="text-sm text-gray-600">Active users</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-gray-900">$2.5M+</div>
                            <div className="text-sm text-gray-600">Saved in fees</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-gray-900">99.9%</div>
                            <div className="text-sm text-gray-600">Success rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
