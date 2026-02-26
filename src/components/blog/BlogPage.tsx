import { Calendar, Clock, ArrowRight, User, Tag } from 'lucide-react'
import { useScrollReveal } from '@/utils/useScrollReveal'
import { Footer } from '@/components/landing/Footer'

type BlogPost = {
    slug: string
    title: string
    excerpt: string
    date: string
    readTime: string
    author: string
    category: string
    categoryColor: string
    featured?: boolean
}

const blogPosts: BlogPost[] = [
    {
        slug: 'why-late-fees-cost-you-more-than-you-think',
        title: 'Why Late Fees Cost You More Than You Think',
        excerpt: 'Late fees aren\'t just a one-time hit. They affect your credit score, compound over time, and add stress you don\'t need. Here\'s the real cost — and how to stop the cycle.',
        date: 'Feb 20, 2026',
        readTime: '5 min read',
        author: 'Mir Sameer Irfan',
        category: 'Finance Tips',
        categoryColor: 'bg-emerald-100 text-emerald-700',
        featured: true,
    },
    {
        slug: 'how-to-organize-bills-in-5-minutes',
        title: 'How to Organize All Your Bills in Under 5 Minutes',
        excerpt: 'Stop juggling paper statements, email reminders, and mental notes. A simple system to track every bill — credit cards, loans, and subscriptions — in one place.',
        date: 'Feb 12, 2026',
        readTime: '4 min read',
        author: 'Mir Sameer Irfan',
        category: 'Guides',
        categoryColor: 'bg-blue-100 text-blue-700',
    },
    {
        slug: 'autopay-vs-manual-payments',
        title: 'Auto-Pay vs. Manual Payments: Which is Better?',
        excerpt: 'Auto-pay sounds perfect, but it comes with risks. We break down the pros and cons and show you a hybrid approach that gives you the best of both worlds.',
        date: 'Feb 5, 2026',
        readTime: '6 min read',
        author: 'Mir Sameer Irfan',
        category: 'Finance Tips',
        categoryColor: 'bg-emerald-100 text-emerald-700',
    },
    {
        slug: 'building-moneyscope-tech-stack',
        title: 'Building MoneyScope: Our Tech Stack Explained',
        excerpt: 'A deep dive into the engineering behind MoneyScope — from React 19 and TanStack Start to Prisma and Tailwind CSS v4. Why we chose each piece and what we learned.',
        date: 'Jan 28, 2026',
        readTime: '8 min read',
        author: 'Mir Sameer Irfan',
        category: 'Engineering',
        categoryColor: 'bg-purple-100 text-purple-700',
    },
    {
        slug: 'credit-score-payment-history',
        title: 'How Payment History Impacts Your Credit Score',
        excerpt: 'Payment history accounts for 35% of your FICO score. Learn exactly how missed payments affect your score and the concrete steps to build a perfect track record.',
        date: 'Jan 20, 2026',
        readTime: '5 min read',
        author: 'Mir Sameer Irfan',
        category: 'Finance Tips',
        categoryColor: 'bg-emerald-100 text-emerald-700',
    },
    {
        slug: 'subscription-audit-save-money',
        title: 'The Subscription Audit: How We Saved $200/Month',
        excerpt: 'Most people don\'t realize how much they spend on subscriptions. We walked through a real audit process and the results were eye-opening.',
        date: 'Jan 14, 2026',
        readTime: '4 min read',
        author: 'Mir Sameer Irfan',
        category: 'Guides',
        categoryColor: 'bg-blue-100 text-blue-700',
    },
]

function FeaturedCard({ post }: { post: BlogPost }) {
    return (
        <article className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
            {/* Gradient banner */}
            <div className="h-48 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>
                <div className="absolute bottom-4 left-6">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-emerald-700">
                        ⭐ Featured
                    </span>
                </div>
            </div>

            <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${post.categoryColor}`}>
                        {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="font-medium text-gray-700">{post.author}</span>
                        <span>·</span>
                        <span>{post.date}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </article>
    )
}

function PostCard({ post, index, isVisible }: { post: BlogPost; index: number; isVisible: boolean }) {
    return (
        <article
            className={`group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            style={{ transitionDelay: isVisible ? `${index * 100 + 200}ms` : '0ms' }}
        >
            <div className="flex items-center gap-3 mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${post.categoryColor}`}>
                    {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                {post.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                </div>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </article>
    )
}

export function BlogPage() {
    const { ref: heroRef, isVisible: heroVisible } = useScrollReveal({ threshold: 0.1 })
    const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.05 })
    const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal({ threshold: 0.15 })

    const featured = blogPosts.find((p) => p.featured)
    const rest = blogPosts.filter((p) => !p.featured)

    // Unique categories
    const categories = [...new Set(blogPosts.map((p) => p.category))]

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section
                ref={heroRef}
                className="relative py-20 overflow-hidden bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50"
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/4 w-150 h-150 rounded-full bg-emerald-200/20 blur-3xl animate-gentle-pulse"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1
                        className={`text-5xl sm:text-6xl font-black text-gray-900 leading-tight mb-4 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                    >
                        The MoneyScope{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
                            Blog
                        </span>
                    </h1>
                    <p
                        className={`text-xl text-gray-600 max-w-2xl mx-auto mb-8 transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                    >
                        Tips, guides, and insights to help you master your finances and never miss a payment.
                    </p>

                    {/* Category pills */}
                    <div
                        className={`flex flex-wrap gap-2 justify-center transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                    >
                        <span className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-semibold">
                            All Posts
                        </span>
                        {categories.map((cat) => (
                            <span
                                key={cat}
                                className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                                <Tag className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {featured && (
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16 relative z-10">
                    <FeaturedCard post={featured} />
                </section>
            )}

            {/* Post Grid */}
            <section ref={gridRef} className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2
                        className={`text-2xl font-bold text-gray-900 mb-8 transition-all duration-700 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                    >
                        Latest articles
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rest.map((post, index) => (
                            <PostCard key={post.slug} post={post} index={index} isVisible={gridVisible} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section ref={ctaRef} className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2
                        className={`text-3xl sm:text-4xl font-black text-gray-900 mb-4 transition-all duration-700 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                    >
                        Stay in the loop
                    </h2>
                    <p
                        className={`text-lg text-gray-600 mb-8 transition-all duration-700 delay-100 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                    >
                        Get the latest finance tips and MoneyScope updates delivered to your inbox.
                    </p>
                    <div
                        className={`flex flex-col sm:flex-row gap-3 max-w-md mx-auto transition-all duration-700 delay-200 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                            }`}
                    >
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="flex-1 px-5 py-3.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <button className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 shrink-0">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">No spam. Unsubscribe anytime.</p>
                </div>
            </section>

            <Footer />
        </div>
    )
}
