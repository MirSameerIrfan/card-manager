import { Link, useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { authClient, signIn } from '@/lib/auth-client'
import { getAuthErrorMessage } from '@/utils/auth-errors'
import { FieldInfo } from '@/components/auth/FieldInfo'

function getVerificationErrorMessage(error: string): string {
  switch (error) {
    case 'token_expired':
      return 'Your verification link has expired. Please request a new one below.'
    case 'invalid_token':
      return 'Your verification link is invalid. Please request a new one below.'
    case 'user_not_found':
      return 'No account was found for this verification link. Please sign up again.'
    default:
      return 'Email verification failed. Please request a new verification link below.'
  }
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const search = useSearch({ from: '/auth/login/' })
  const verificationError = search.error
  const [submitError, setSubmitError] = useState<string | null>(
    verificationError ? getVerificationErrorMessage(verificationError) : null,
  )
  const [submitInfo, setSubmitInfo] = useState<string | null>(null)
  const [needsVerification, setNeedsVerification] = useState(!!verificationError)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const navigate = useNavigate()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      setSubmitInfo(null)
      setNeedsVerification(false)
      try {
        const result = await signIn.email({
          email: value.email,
          password: value.password,
        })

        if (result.error) {
          const message = result.error.message ?? 'Invalid email or password'
          const requiresVerification = message.toLowerCase().includes('verify your email')
          setSubmitError(message)
          setNeedsVerification(requiresVerification)
          return
        }
        await navigate({ to: '/dashboard' })
        await router.invalidate()
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Sign in failed')
      }
    },
  })

  const handleResendVerification = async () => {
    const email = form.getFieldValue('email')?.trim().toLowerCase() ?? ''
    if (!email) {
      setSubmitError('Please enter your email address to resend verification.')
      return
    }

    setIsResendingVerification(true)
    setSubmitError(null)
    setSubmitInfo(null)
    try {
      // Called through authClient so better-auth's rate limiter applies.
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: '/auth/verify-email',
      })
      if (error) {
        setSubmitError(getAuthErrorMessage(error, 'Unable to resend verification email.'))
        return
      }

      setSubmitInfo('Verification email sent. Please check your inbox.')
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Unable to resend verification email.',
      )
    } finally {
      setIsResendingVerification(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-3"
      >
        {/* Email Field */}
        <div>
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'Email is required'
                  : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? 'Please enter a valid email address'
                    : undefined,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-semibold text-gray-900 mb-1"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>

        {/* Password Field */}
        <div>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? 'Password is required'
                  : value.length < 8
                    ? 'Password must be at least 8 characters'
                    : undefined,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-semibold text-gray-900 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>

        {/* Remember/Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            Remember me
          </label>
          <Link to="/auth/forgot-password" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full flex items-center justify-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          )}
        />

        {submitError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {submitError}
          </div>
        ) : null}

        {needsVerification ? (
          <button
            type="button"
            onClick={() => void handleResendVerification()}
            disabled={isResendingVerification}
            className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResendingVerification ? 'Sending verification...' : 'Resend verification email'}
          </button>
        ) : null}

        {submitInfo ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {submitInfo}
          </div>
        ) : null}
      </form>

      {/* Signup Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/auth/signup" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign up for free
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
