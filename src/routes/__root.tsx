import { HeadContent, Scripts, createRootRoute, useLoaderData, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { NotFound } from '@/components/NotFound'

import Header from '../components/Header'
import { AuthProvider } from '@/utils/auth-context'
import { getSessionFn } from '@/utils/auth.functions'

import appCss from '../styles.css?url'

async function rootLoader() {
  try {
    const session = await getSessionFn()
    return { isLoggedIn: !!session }
  } catch (_error) {
    return { isLoggedIn: false }
  }
}

export const Route = createRootRoute({
  loader: rootLoader,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'MoneyScope',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useLoaderData({ from: '__root__' })
  const isRoutePending = useRouterState({
    select: (state) => state.status === 'pending',
  })

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider initialSession={isLoggedIn}>
          <Header isPending={isRoutePending} />
          {children}
        </AuthProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
