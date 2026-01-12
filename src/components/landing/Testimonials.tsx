import { Star } from 'lucide-react'

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Small Business Owner',
        image: '👩‍💼',
        rating: 5,
        text: 'Finally, a bill tracker that actually works! I used to forget payments all the time, but this app has saved me hundreds in late fees.'
    },
    {
        name: 'Marcus Johnson',
        role: 'Freelance Designer',
        image: '👨‍🎨',
        rating: 5,
        text: 'The reminders are a lifesaver. I juggle multiple credit cards and subscriptions, and this keeps everything organized in one place.'
    },
    {
        name: 'Emily Rodriguez',
        role: 'Marketing Manager',
        image: '👩‍💻',
        rating: 5,
        text: 'Clean interface, smart features, and zero hassle. This is exactly what I needed to manage my family\'s bills and subscriptions.'
    }
]

export function Testimonials() {
    return (
        <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
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
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="text-4xl">
                                    {testimonial.image}
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
