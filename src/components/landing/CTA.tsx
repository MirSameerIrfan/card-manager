import { Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useScrollReveal } from '@/utils/useScrollReveal'

const benefits = [
    'No credit card required',
    'Free in early access',
    'Set up in minutes',
    'Your data is never sold'
]

export function CTA() {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.15 })

    return (
        <section ref={sectionRef} className="relative py-24 overflow-hidden">
            {/* Background with pattern */}
            <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2
                    className={`text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                >
                    Ready to take control?
                </h2>
                <p
                    className={`text-xl text-emerald-50 mb-12 max-w-2xl mx-auto transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                >
                    See every bill, card, and loan in one place, with what's due and what's overdue at a glance. Free while in early access.
                </p>

                <div
                    className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                >
                    <Link
                        to="/auth"
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                        Start for Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                <div
                    className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                >
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-white justify-center sm:justify-start">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span className="font-medium">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
