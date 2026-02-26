import { Star, Quote } from 'lucide-react'
import { useScrollReveal } from '@/utils/useScrollReveal'

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Small Business Owner',
        initials: 'SC',
        gradient: 'from-emerald-500 to-teal-500',
        rating: 5,
        text: 'Finally, a bill tracker that actually works! I used to forget payments all the time, but this app has saved me hundreds in late fees.'
    },
    {
        name: 'Marcus Johnson',
        role: 'Freelance Designer',
        initials: 'MJ',
        gradient: 'from-teal-500 to-cyan-500',
        rating: 5,
        text: 'The reminders are a lifesaver. I juggle multiple credit cards and subscriptions, and this keeps everything organized in one place.'
    },
    {
        name: 'Emily Rodriguez',
        role: 'Marketing Manager',
        initials: 'ER',
        gradient: 'from-cyan-500 to-sky-500',
        rating: 5,
        text: 'Clean interface, smart features, and zero hassle. This is exactly what I needed to manage my family\'s bills and subscriptions.'
    }
]

export function Testimonials() {
    const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 })

    return (
        <section ref={sectionRef} className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                >
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                        Loved by thousands
                    </h2>
                    <p className="text-xl text-gray-600">
                        Join the community of people who never miss a payment
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                }`}
                            style={{ transitionDelay: isVisible ? `${index * 120 + 200}ms` : '0ms' }}
                        >
                            {/* Decorative quote */}
                            <Quote className="absolute top-6 right-6 w-10 h-10 text-emerald-100 rotate-180" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                                "{testimonial.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                {/* Gradient avatar with initials */}
                                <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center shadow-md`}>
                                    <span className="text-white text-sm font-bold">{testimonial.initials}</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
