import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { getSessionFn } from './auth.functions'

export interface AuthUser {
    id: string
    name: string
    email: string
    image?: string | null
    emailVerified?: boolean
}

interface AuthContextType {
    isLoggedIn: boolean
    user: AuthUser | null
    loading: boolean
    refetchSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
    children,
    initialUser,
}: {
    children: ReactNode
    initialUser: AuthUser | null
}) {
    const [user, setUser] = useState<AuthUser | null>(initialUser)
    const [isLoggedIn, setIsLoggedIn] = useState(!!initialUser && initialUser.emailVerified === true)
    const [loading, setLoading] = useState(false)

    const refetchSession = useCallback(async () => {
        setLoading(true)
        try {
            const session = await getSessionFn()
            const currentUser = session?.user
                ? {
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image ?? null,
                    emailVerified: session.user.emailVerified,
                }
                : null

            setUser(currentUser)
            setIsLoggedIn(!!currentUser && currentUser.emailVerified === true)
        } catch (_error) {
            setUser(null)
            setIsLoggedIn(false)
        } finally {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loading, refetchSession }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
