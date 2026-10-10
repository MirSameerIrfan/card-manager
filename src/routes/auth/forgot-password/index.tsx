import { createFileRoute } from '@tanstack/react-router'
import { redirectIfAuthenticated } from '@/utils/route-guards'
import { ForgotPasswordPage } from '@/components/auth/ForgotPasswordPage'

export const Route = createFileRoute('/auth/forgot-password/')({
  beforeLoad: async () => redirectIfAuthenticated(),
  component: ForgotPasswordPage,
})
