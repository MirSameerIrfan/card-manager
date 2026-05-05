import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { NotFound } from '@/components/NotFound'
import { useEffect, useRef } from 'react'

import Header from '../components/Header'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
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
  const currentPath = useRouterState({
    select: (state) => state.location.pathname,
  })

  const prevPathRef = useRef(currentPath)
  const contentRef = useRef<HTMLDivElement>(null)

  // Only animate on actual route changes
  useEffect(() => {
    if (prevPathRef.current !== currentPath) {
      prevPathRef.current = currentPath
      const el = contentRef.current
      if (el) {
        el.style.opacity = '0'
        el.style.transform = 'translateY(8px)'
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        })
      }
    }
  }, [currentPath])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        <div ref={contentRef}>
          {children}
        </div>
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
