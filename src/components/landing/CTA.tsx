import { Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const benefits = [
    'No credit card required',
    'Free forever plan',
    'Setup in under 2 minutes',
    'Cancel anytime'
]

export function CTA() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background with pattern */}
            <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600"></div>
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
                    Ready to take control?
                </h2>
                <p className="text-xl text-emerald-50 mb-12 max-w-2xl mx-auto">
                    Join thousands of users who've said goodbye to late fees and hello to financial peace of mind.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link
                        to="/example/example1"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-xl transition-all transform hover:scale-105 shadow-xl"
                    >
                        Start for Free
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl border-2 border-white transition-all">
                        Schedule Demo
                    </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
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
