import { Zap, Shield, Bell, Calendar, TrendingUp, Smartphone } from 'lucide-react'

const features = [
    {
        icon: Bell,
        title: 'Smart Reminders',
        description: 'Get notifications days before due dates via email, SMS, or push notifications.',
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
        title: 'Bank-Level Security',
        description: 'Your financial data is encrypted and protected with industry-standard security.',
        color: 'from-cyan-500 to-sky-500'
    },
    {
        icon: TrendingUp,
        title: 'Spending Insights',
        description: 'Track patterns, identify trends, and optimize your monthly cash flow.',
        color: 'from-sky-500 to-blue-500'
    },
    {
        icon: Zap,
        title: 'Quick Add',
        description: 'Add new bills in seconds with smart detection and auto-fill features.',
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
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
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
                                className="group relative bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gray-200"
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
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
