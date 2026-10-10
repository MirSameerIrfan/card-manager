import { Link, useSearch } from '@tanstack/react-router'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FieldInfo } from '@/components/auth/FieldInfo'
import { authClient } from '@/lib/auth-client'
import {
  getResetPasswordErrorMessage,
  validateNewPassword,
  validatePasswordConfirmation,
} from '@/components/auth/password-reset-utils'

export function ResetPasswordPage() {
  const { token, error: linkError } = useSearch({ from: '/auth/reset-password/' })
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isReset, setIsReset] = useState(false)

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (!token) return
      setSubmitError(null)
      try {
        const result = await authClient.resetPassword({
          newPassword: value.password,
          token,
        })

        if (result.error) {
          setSubmitError(getResetPasswordErrorMessage(result.error.code))
          return
        }

        setIsReset(true)
      } catch (_error) {
        setSubmitError(getResetPasswordErrorMessage())
      }
    },
  })

  if (isReset) {
    return (
      <AuthLayout title="Password updated" subtitle="You can now sign in with your new password">
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          Your password has been reset. For your security, you have been signed out on all
          devices.
        </div>
        <Link
          to="/auth/login"
          className="mt-6 w-full flex items-center justify-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Sign in
        </Link>
      </AuthLayout>
    )
  }

  if (linkError || !token) {
    return (
      <AuthLayout title="Reset link not valid" subtitle="Request a new link to reset your password">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {getResetPasswordErrorMessage(linkError ?? 'INVALID_TOKEN')}
        </div>
        <Link
          to="/auth/forgot-password"
          className="mt-6 w-full flex items-center justify-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Request a new link
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a password you don’t use elsewhere">
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
            name="password"
            validators={{
              onChange: ({ value }) => validateNewPassword(value),
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-semibold text-gray-900 mb-1"
                >
                  New password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>

        <div>
          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ['password'],
              onChange: ({ value, fieldApi }) =>
                validatePasswordConfirmation(fieldApi.form.getFieldValue('password'), value),
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-semibold text-gray-900 mb-1"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
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
              {isSubmitting ? 'Updating password...' : 'Update password'}
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
    </AuthLayout>
  )
}
