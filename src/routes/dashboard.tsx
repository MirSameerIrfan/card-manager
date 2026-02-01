import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { getSessionFn } from '@/utils/auth.functions'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    try {
      const session = await getSessionFn()
      if (!session?.user) {
        throw redirect({ to: '/auth/login', search: { redirect: '/dashboard' } })
      }
      return { session }
    } catch (_error) {
      // If there's an error getting the session, assume user is not authenticated
      throw redirect({ to: '/auth/login', search: { redirect: '/dashboard' } })
    }
  },
  component: Dashboard,
})
