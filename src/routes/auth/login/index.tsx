import { createFileRoute } from '@tanstack/react-router'
import { redirectIfAuthenticated } from '@/utils/route-guards'
import { LoginPage } from '@/components/auth/LoginPage'

export const Route = createFileRoute('/auth/login/')({
  beforeLoad: async () => redirectIfAuthenticated(),
  component: LoginPage,
})
