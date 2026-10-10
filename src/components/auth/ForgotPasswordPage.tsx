import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FieldInfo } from '@/components/auth/FieldInfo'
import { authClient } from '@/lib/auth-client'

export function ForgotPasswordPage() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      try {
        const result = await authClient.requestPasswordReset({
          email: value.email.trim().toLowerCase(),
          redirectTo: '/auth/reset-password',
        })

        if (result.error) {
          setSubmitError(
            result.error.status === 429
              ? 'Too many requests. Please wait a minute and try again.'
              : 'We could not send a reset link right now. Please try again.',
          )
          return
        }

        // Same confirmation whether or not the account exists, so this form
        // cannot be used to discover which emails are registered.
        setIsSent(true)
      } catch (_error) {
        setSubmitError('We could not send a reset link right now. Please try again.')
      }
    },
  })

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we’ll send you a link to reset it"
    >
      {isSent ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          If an account exists for that email, a password reset link is on its way. The link
          expires in 1 hour.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-3"
        >
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
                      autoComplete="email"
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

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full flex items-center justify-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? 'Sending link...' : 'Send reset link'}
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
        </form>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remembered your password?{' '}
          <Link to="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
