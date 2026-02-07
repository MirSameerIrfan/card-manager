import { Link } from '@tanstack/react-router'
import { Home } from 'lucide-react'

export function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
            <h1 className="text-4xl font-black text-gray-900">404</h1>
            <p className="text-xl text-gray-600">Page not found</p>
            <p className="text-gray-500 max-w-md">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-emerald-700 transition-all hover:-translate-y-0.5"
            >
                <Home className="w-5 h-5" />
                Go Home
            </Link>
        </div>
    )
}
