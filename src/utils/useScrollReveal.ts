import { useEffect, useRef, useState } from 'react'

interface UseScrollRevealOptions {
    threshold?: number
    rootMargin?: string
    once?: boolean
}

/**
 * Lightweight scroll-reveal hook using IntersectionObserver.
 * Returns a ref to attach and an isVisible boolean.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollRevealOptions = {},
) {
    const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = options
    const ref = useRef<T>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (once) observer.unobserve(element)
                } else if (!once) {
                    setIsVisible(false)
                }
            },
            { threshold, rootMargin },
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [threshold, rootMargin, once])

    return { ref, isVisible }
}
