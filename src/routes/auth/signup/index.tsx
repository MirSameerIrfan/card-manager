import { createFileRoute } from '@tanstack/react-router'
import { redirectIfAuthenticated } from '@/utils/route-guards'
import { SignupPage } from '@/components/auth/SignupPage'

export const Route = createFileRoute('/auth/signup/')({
  beforeLoad: async () => redirectIfAuthenticated(),
  component: SignupPage,
})
