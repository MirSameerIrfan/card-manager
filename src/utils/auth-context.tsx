import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { getSessionFn } from './auth.functions'

interface AuthContextType {
    isLoggedIn: boolean
    loading: boolean
    refetchSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
    children,
    initialSession,
}: {
    children: ReactNode
    initialSession: boolean
}) {
    const [isLoggedIn, setIsLoggedIn] = useState(initialSession)
    const [loading, setLoading] = useState(false)

    const refetchSession = useCallback(async () => {
        setLoading(true)
        try {
            const session = await getSessionFn()
            setIsLoggedIn(!!session)
        } catch (_error) {
            setIsLoggedIn(false)
        } finally {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, refetchSession }}>
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
