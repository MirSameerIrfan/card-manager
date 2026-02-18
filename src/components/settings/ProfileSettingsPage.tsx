import { getRouteApi, useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useAuth } from '@/utils/auth-context'
import { changeEmailFn, changePasswordFn, updateProfileNameFn } from '@/utils/auth.functions'

const routeApi = getRouteApi('/settings/profile')

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function ProfileSettingsPage() {
  const { user, refetchSession } = useAuth()
  const router = useRouter()
  const data = routeApi.useLoaderData()

  const currentName = user?.name ?? data.user.name
  const currentEmail = user?.email ?? data.user.email

  const [name, setName] = useState(currentName)
  const [email, setEmail] = useState(currentEmail)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const [nameErrorMessage, setNameErrorMessage] = useState<string | null>(null)
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null)

  const [nameSuccessMessage, setNameSuccessMessage] = useState<string | null>(null)
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null)
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setName(currentName)
  }, [currentName])

  useEffect(() => {
    setEmail(currentEmail)
  }, [currentEmail])

  const normalizedName = name.trim()
  const normalizedEmail = email.trim().toLowerCase()
  const currentEmailNormalized = currentEmail.trim().toLowerCase()
  const currentNameNormalized = currentName.trim()

  const nameValidationError = useMemo(() => {
    if (!normalizedName) return 'Name is required'
    if (normalizedName.length < 3) return 'Name must be at least 3 characters'
    return null
  }, [normalizedName])

  const emailValidationError = useMemo(() => {
    if (!normalizedEmail) return 'Email is required'
    if (!isValidEmail(normalizedEmail)) return 'Please enter a valid email address'
    if (normalizedEmail === currentEmailNormalized) return 'Please enter a different email address'
    return null
  }, [normalizedEmail, currentEmailNormalized])

  const passwordValidationError = useMemo(() => {
    if (!currentPassword) return 'Current password is required'
    if (!newPassword) return 'New password is required'
    if (newPassword.length < 8) return 'New password must be at least 8 characters'
    if (!confirmPassword) return 'Please confirm your new password'
    if (newPassword !== confirmPassword) return 'New password and confirm password do not match'
    return null
  }, [currentPassword, newPassword, confirmPassword])

  const nameUnchanged = normalizedName === currentNameNormalized

  const refreshAppState = async () => {
    await Promise.all([refetchSession(), router.invalidate()])
  }

  const handleNameSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setNameErrorMessage(null)
    setNameSuccessMessage(null)

    if (nameValidationError) {
      setNameErrorMessage(nameValidationError)
      return
    }

    if (nameUnchanged) {
      setNameErrorMessage('No changes to save.')
      return
    }

    setIsUpdatingName(true)
    try {
      const result = await updateProfileNameFn({ data: { name: normalizedName } })
      if (!result.success) {
        setNameErrorMessage(result.error ?? 'Unable to update your name.')
        return
      }

      await refreshAppState()
      setNameSuccessMessage('Your name has been updated.')
    } catch (error) {
      setNameErrorMessage(error instanceof Error ? error.message : 'Unable to update your name.')
    } finally {
      setIsUpdatingName(false)
    }
  }

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setEmailErrorMessage(null)
    setEmailSuccessMessage(null)

    if (emailValidationError) {
      setEmailErrorMessage(emailValidationError)
      return
    }

    setIsUpdatingEmail(true)
    try {
      const result = await changeEmailFn({ data: { newEmail: normalizedEmail } })
      if (!result.success) {
        setEmailErrorMessage(result.error ?? 'Unable to update your email.')
        return
      }

      await refreshAppState()
      setEmailSuccessMessage('Your email address has been updated.')
    } catch (error) {
      setEmailErrorMessage(error instanceof Error ? error.message : 'Unable to update your email.')
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPasswordErrorMessage(null)
    setPasswordSuccessMessage(null)

    if (passwordValidationError) {
      setPasswordErrorMessage(passwordValidationError)
      return
    }

    setIsUpdatingPassword(true)
    try {
      const result = await changePasswordFn({
        data: {
          currentPassword,
          newPassword,
        },
      })

      if (!result.success) {
        setPasswordErrorMessage(result.error ?? 'Unable to update your password.')
        return
      }

      await refreshAppState()
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccessMessage('Your password has been updated.')
    } catch (error) {
      setPasswordErrorMessage(error instanceof Error ? error.message : 'Unable to update your password.')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 pb-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Account</p>
          <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">Profile Settings</h1>
          <p className="text-base text-gray-600">
            Update your name, email, and password.
          </p>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-gray-900">Profile</h2>
          <p className="mt-1 text-sm text-gray-600">This is the name shown in your account.</p>

          <form onSubmit={(event) => void handleNameSubmit(event)} className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                Display name
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="block w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-gray-900 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Your name"
                />
              </div>
            </div>

            {nameErrorMessage ? (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {nameErrorMessage}
              </div>
            ) : null}

            {nameSuccessMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {nameSuccessMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isUpdatingName || !!nameValidationError || nameUnchanged}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isUpdatingName ? 'Saving...' : 'Save name'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-gray-900">Email</h2>
          <p className="mt-1 text-sm text-gray-600">Use an email address you can access.</p>

          <form onSubmit={(event) => void handleEmailSubmit(event)} className="mt-5 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                Email address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="block w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 text-gray-900 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {emailErrorMessage ? (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {emailErrorMessage}
              </div>
            ) : null}

            {emailSuccessMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {emailSuccessMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isUpdatingEmail || !!emailValidationError}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isUpdatingEmail ? 'Saving...' : 'Save email'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-gray-900">Password</h2>
          <p className="mt-1 text-sm text-gray-600">Choose a secure password with at least 8 characters.</p>

          <form onSubmit={(event) => void handlePasswordSubmit(event)} className="mt-5 space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-semibold text-gray-900">
                Current password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="block w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 text-gray-900 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-semibold text-gray-900">
                New password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="block w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 text-gray-900 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-900">
                Confirm new password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="block w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 text-gray-900 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {passwordErrorMessage ? (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {passwordErrorMessage}
              </div>
            ) : null}

            {passwordSuccessMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {passwordSuccessMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isUpdatingPassword || !!passwordValidationError}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isUpdatingPassword ? 'Saving...' : 'Update password'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
