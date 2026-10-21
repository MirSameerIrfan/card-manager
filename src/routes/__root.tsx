import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { NotFound } from '@/components/NotFound'
import { useLayoutEffect, useRef } from 'react'

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
      {
        name: 'description',
        content:
          'MoneyScope tracks your credit cards, loans, and recurring bills in one place and shows what is due before it is late. Free in early access.',
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
  // resolvedLocation changes once the new page has rendered. location changes
  // at the click, while the old page is still on screen waiting for the new
  // route to load, so fading on it replayed the old page like a reload.
  const currentPath = useRouterState({
    select: (state) => state.resolvedLocation?.pathname ?? state.location.pathname,
  })

  const prevPathRef = useRef(currentPath)
  const contentRef = useRef<HTMLDivElement>(null)

  // Fade the new page in; a layout effect runs before it is first painted.
  useLayoutEffect(() => {
    if (prevPathRef.current === currentPath) return
    prevPathRef.current = currentPath
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    contentRef.current?.animate(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 300, easing: 'ease-out' },
    )
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
