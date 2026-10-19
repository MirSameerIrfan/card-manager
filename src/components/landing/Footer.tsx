import { Link } from '@tanstack/react-router'
import { CONTACT_EMAIL } from '@/lib/contact'

type FooterLink = {
    label: string
    href: string
    internal?: boolean
}

const footerLinks: Record<string, FooterLink[]> = {
    Product: [
        { label: 'Features', href: '/#features' },
        { label: 'Dashboard', href: '/dashboard', internal: true },
    ],
    Company: [
        { label: 'About', href: '/about', internal: true },
        { label: 'Contact', href: `mailto:${CONTACT_EMAIL}` },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '/privacy', internal: true },
        { label: 'Terms of Service', href: '/terms', internal: true },
    ],
}

const socialLinks = [
    {
        label: 'GitHub',
        href: 'https://github.com/MirSameerIrfan',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
        ),
    },
]

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-4 group">
                            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all">
                                <img src="/logo.svg" alt="MoneyScope logo" className="h-6 w-6" />
                            </div>
                            <span className="font-black text-xl text-white">MoneyScope</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 max-w-xs">
                            Track your bills, cards, and loans effortlessly. Never miss a payment again.
                            Questions? <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-300 hover:text-emerald-400">{CONTACT_EMAIL}</a>
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                                {category}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        {link.internal ? (
                                            <Link
                                                to={link.href}
                                                className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={link.href}
                                                className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} MoneyScope. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-600">
                        Built with ♥ for people who hate late fees
                    </p>
                </div>
            </div>
        </footer>
    )
}
