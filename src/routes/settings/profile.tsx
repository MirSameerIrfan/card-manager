import { createFileRoute, redirect } from '@tanstack/react-router'
import { ProfileSettingsPage } from '@/components/settings/ProfileSettingsPage'
import { getSessionFn } from '@/utils/auth.functions'

export const Route = createFileRoute('/settings/profile')({
  beforeLoad: async () => {
    try {
      const session = await getSessionFn()
      if (!session?.user || session.user.emailVerified !== true) {
        throw redirect({ to: '/auth/login', search: { redirect: '/settings/profile' } })
      }
      return { session }
    } catch (_error) {
      throw redirect({ to: '/auth/login', search: { redirect: '/settings/profile' } })
    }
  },
  loader: async () => {
    const session = await getSessionFn()
    if (!session?.user || session.user.emailVerified !== true) {
      throw redirect({ to: '/auth/login', search: { redirect: '/settings/profile' } })
    }
    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        paymentReminders: session.user.paymentReminders,
      },
    }
  },
  component: ProfileSettingsPage,
})
