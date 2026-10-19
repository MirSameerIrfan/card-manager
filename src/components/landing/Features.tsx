import { Zap, Shield, Bell, Calendar, TrendingUp, Smartphone } from 'lucide-react'
import { useScrollReveal } from '@/utils/useScrollReveal'

const features = [
    {
        icon: Bell,
        title: 'Email Reminders',
        description: 'A daily email lists what is due in the next 3 days, so nothing sneaks up on you.',
        color: 'from-emerald-500 to-teal-500'
    },
    {
        icon: Calendar,
        title: 'Payment Calendar',
        description: 'Visual monthly calendar showing all upcoming bills and payments at a glance.',
        color: 'from-teal-500 to-cyan-500'
    },
    {
        icon: Shield,
        title: 'Private by Design',
        description: 'Your data is encrypted in transit and at rest, never sold, and never shown to anyone else.',
        color: 'from-cyan-500 to-sky-500'
    },
    {
        icon: TrendingUp,
        title: 'Payment History',
        description: 'Mark a payment as paid and it moves to its next due date, with a record of what you paid.',
        color: 'from-sky-500 to-blue-500'
    },
    {
        icon: Zap,
        title: 'Smart Add with Claude',
        description: 'Paste a bill or upload a photo of it, and Claude fills in the payment for you to check.',
        color: 'from-blue-500 to-indigo-500'
    },
    {
        icon: Smartphone,
        title: 'Works Everywhere',
        description: 'Responsive design works seamlessly on desktop, tablet, and mobile devices.',
        color: 'from-indigo-500 to-violet-500'
    }
]

export function Features() {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.08 })

    return (
        <section id="features" ref={sectionRef} className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                >
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                        Everything you need to stay on top
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Powerful features designed to make bill management effortless and stress-free
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className={`feature-card group relative bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                                style={{ transitionDelay: isVisible ? `${index * 100 + 200}ms` : '0ms' }}
                            >
                                {/* Decorative number */}
                                <span className="absolute top-5 right-5 text-5xl font-black text-gray-100 group-hover:text-emerald-50 transition-colors select-none pointer-events-none">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
