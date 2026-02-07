import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { getSessionFn } from '@/utils/auth.functions'
import { getDashboardDataFn } from '@/utils/dashboard.functions'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    try {
      const session = await getSessionFn()
      if (!session?.user) {
        throw redirect({ to: '/auth/login', search: { redirect: '/dashboard' } })
      }
      return { session }
    } catch (_error) {
      throw redirect({ to: '/auth/login', search: { redirect: '/dashboard' } })
    }
  },
  loader: async () => {
    return await getDashboardDataFn()
  },
  pendingComponent: DashboardSkeleton,
  component: Dashboard,
})
