import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { getVerifyEmailErrorMessage } from '@/components/auth/verify-email-utils'

const verifyEmailSearchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/auth/verify-email/')({
  validateSearch: verifyEmailSearchSchema,
  component: VerifyEmailPage,
})

type VerifyState = 'verifying' | 'success' | 'error'

function VerifyEmailPage() {
  const { token, error: initialError } = useSearch({ from: '/auth/verify-email/' })
  const navigate = useNavigate()
  const [state, setState] = useState<VerifyState>('verifying')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      // ── Case 1: better-auth redirected here with an explicit error param ──
      // The server-side verification failed (expired/invalid token). Show the
      // mapped error message immediately — no further network calls needed.
      if (initialError) {
        setState('error')
        setErrorMessage(getVerifyEmailErrorMessage(initialError))
        return
      }

      // ── Case 2: token present — client-side verification path ──
      // This happens when the verification link is opened in a context where
      // we want to verify client-side (e.g. re-send flow with a fresh token).
      if (token) {
        try {
          const result = await authClient.verifyEmail({ query: { token } })
          if (cancelled) return

          if (result.error) {
            setState('error')
            setErrorMessage(getVerifyEmailErrorMessage(result.error.code ?? 'unknown'))
            return
          }

          setState('success')
          setTimeout(() => {
            if (!cancelled) void navigate({ to: '/dashboard' })
          }, 1500)
        } catch (err) {
          if (cancelled) return
          setState('error')
          setErrorMessage(
            err instanceof Error ? err.message : 'Verification failed. Please try again.',
          )
        }
        return
      }

      // ── Case 3: no token, no error — standard better-auth callback redirect ──
      // better-auth verifies the token server-side at /api/auth/verify-email,
      // then HTTP 302 redirects to callbackURL (/auth/verify-email) WITHOUT
      // re-sending the token. At this point the session cookie is already set
      // and emailVerified is true. Check the session and redirect to dashboard.
      try {
        const session = await authClient.getSession()
        if (cancelled) return

        if (session?.data?.user?.emailVerified) {
          setState('success')
          setTimeout(() => {
            if (!cancelled) void navigate({ to: '/dashboard' })
          }, 1500)
          return
        }

        // Session exists but email still not verified, or no session at all —
        // the user navigated here manually or something went wrong server-side.
        setState('error')
        setErrorMessage(
          'We could not confirm your email verification. Please try signing in, or request a new verification email.',
        )
      } catch (err) {
        if (cancelled) return
        setState('error')
        setErrorMessage(
          err instanceof Error ? err.message : 'Verification failed. Please try again.',
        )
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [token, initialError, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 text-center">

        {state === 'verifying' && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <svg
                className="h-8 w-8 animate-spin text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Verifying your email…</h1>
            <p className="mt-2 text-sm text-gray-500">This will only take a moment.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Email verified!</h1>
            <p className="mt-2 text-sm text-gray-500">Redirecting you to your dashboard…</p>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
              <svg className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Verification failed</h1>
            <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void navigate({ to: '/auth/login' })}
              className="mt-6 w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700"
            >
              Back to sign in
            </button>
          </>
        )}

      </div>
    </div>
  )
}
