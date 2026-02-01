import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { signUpUser } from '@/utils/auth.functions'
import { useAuth } from '@/utils/auth-context'

export const Route = createFileRoute('/auth/signup/')({
    component: SignupPage,
})

function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
            ) : null}
            {field.state.meta.isValidating ? (
                <span className="text-amber-500 text-sm">Validating...</span>
            ) : null}
        </>
    )
}

function SignupPage() {
    const navigate = useNavigate()
    const { refetchSession } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: async ({ value }) => {
            setSubmitError(null)

            try {

                const result = await signUpUser({
                    data: {
                        name: value.name,
                        email: value.email,
                        password: value.password,
                    }
                })

                if (!result.success) {
                    setSubmitError(result.error ?? 'sign up failed')
                    return
                }
                await refetchSession()
                await navigate({ to: '/dashboard' })

            } catch (error) {
                setSubmitError(error instanceof Error ? error.message : 'Sign up failed')
            }

        },
    })

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Start tracking your bills in minutes"
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    void form.handleSubmit()
                }}
                className="space-y-6"
            >
                {/* Name Field */}
                <div>
                    <form.Field
                        name="name"
                        validators={{
                            onChange: ({ value }) =>
                                !value
                                    ? 'Name is required'
                                    : value.length < 3
                                        ? 'Name must be at least 3 characters'
                                        : undefined,
                        }}
                        children={(field) => (
                            <>
                                <label htmlFor={field.name} className="block text-sm font-semibold text-gray-900 mb-2">
                                    Full name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type="text"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <FieldInfo field={field} />
                            </>
                        )}
                    />
                </div>

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
                                <label htmlFor={field.name} className="block text-sm font-semibold text-gray-900 mb-2">
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
                                <label htmlFor={field.name} className="block text-sm font-semibold text-gray-900 mb-2">
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
                                <p className="mt-2 text-xs text-gray-500">
                                    Must be at least 8 characters
                                </p>
                                <FieldInfo field={field} />
                            </>
                        )}
                    />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <form.Field
                        name="confirmPassword"
                        validators={{
                            onChange: ({ value }) =>
                                !value
                                    ? 'Please confirm your password'
                                    : value !== form.getFieldValue('password')
                                        ? 'Passwords do not match'
                                        : undefined,
                        }}
                        children={(field) => (
                            <>
                                <label htmlFor={field.name} className="block text-sm font-semibold text-gray-900 mb-2">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
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

                {/* Terms & Conditions */}
                <div className="flex items-start">
                    <input
                        id="terms"
                        type="checkbox"
                        required
                        className="w-4 h-4 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700">
                            Terms of Service
                        </a>
                        {' '}and{' '}
                        <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700">
                            Privacy Policy
                        </a>
                    </label>
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
                            {isSubmitting ? 'Creating account...' : 'Create account'}
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


                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                    </div>
                </div>

                {/* Social Signup Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        GitHub
                    </button>
                </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}
