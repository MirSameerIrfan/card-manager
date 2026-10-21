# Card Manager - AI Coding Agent Instructions

## Before Committing

- [ ] Run `npm run test` — all tests pass
- [ ] Run `npm run lint` — no ESLint errors
- [ ] Run `npx tsc --noEmit` — no TypeScript errors (`npm run build` does not type-check)
- [ ] Run `npm run build` — production build succeeds
- [ ] Verify `src/routeTree.gen.ts` was auto-regenerated (if routes changed)

---

## Project Overview

**MoneyScope** (repo `card-manager`), a bill & payment tracker: personal finance tracker for recurring payments (credit cards, loans, bills). It sends no reminder emails; the only emails are email verification and password reset.  
**Stack**: React 19 + TanStack Start + Vite 7 + TypeScript + Tailwind CSS 4 + Nitro + Prisma 7 (PostgreSQL) + better-auth + Sentry

---

## Key Architecture

### File-Based Routing

- Routes in `src/routes/` auto-generate `src/routeTree.gen.ts` (do NOT edit)
- Pattern: `createFileRoute('/path')({ component: MyComponent })`
- Route files stay thin (`beforeLoad` guard, `loader`, zod search-param validation); the page component lives in `src/components/<area>/`
- Root layout: `src/routes/__root.tsx` (Header + devtools)

### Server Functions (Type-Safe RPC)

- Location: `src/utils/auth.functions.ts` (auth and profile), and feature files colocated with their components, e.g. `src/components/dashboard/dashboard.functions.ts`
- Pattern: `createServerFn({ method: 'GET' | 'POST' }).inputValidator(zodSchema).handler(async ({ data }) => { ... })`
- Called directly from loaders and components with full type inference—no API routes needed. The only API routes are the better-auth catch-all (`src/routes/api/auth/$.ts`) and `GET /api/health`

### Data & State

- PostgreSQL (Supabase-hosted) via Prisma 7. Schema in `prisma/schema.prisma`; the client is generated into `generated/prisma/` (gitignored), so run `npx prisma generate` after install and after schema changes
- Import `prisma` from `@/lib/prisma` (one shared pg pool and client); never construct another `PrismaClient`
- Loader data is the source of truth (`getRouteApi('/dashboard').useLoaderData()`). After a mutation, call `await router.invalidate()` to re-run loaders

### Auth

- better-auth: server instance in `src/lib/auth.ts`, browser client in `src/lib/auth-client.ts` (`useSession`, `signOut`)
- Anything that checks a password or sends an email (sign up, sign in, resend verification, change email, change password, forgot/reset password) calls `authClient` from the page instead of a server function, so the request goes through `/api/auth/*` where better-auth's rate limiter applies (it does not apply to `auth.api.*` calls). Don't wrap these in a server function: its id is a SHA-256 of the file path and export name, so anyone can call it even if no page imports it
- Server functions call `auth.api.*` and forward the incoming request headers (`getRequest()` → `Object.fromEntries(req.headers.entries())`) so the session cookie is read and set
- Email verification is required: a session alone is not enough. Protected routes check `session.user.emailVerified === true` in `beforeLoad` (redirect to `/auth/login`), and protected server functions check it again (throw `Unauthorized`). New protected routes and server functions need both
- Guest-only routes (`/`, `/auth/login`, `/auth/signup`) use `redirectIfAuthenticated()` from `src/utils/route-guards.ts`

### Styling & Components

- **Tailwind CSS 4.0**: Inline classes, no separate CSS files
- **Global styles**: `src/styles.css`
- **Icons**: `lucide-react` library
- **No component libraries**: Hand-built UI with Tailwind + React hooks

---

## Commands & Conventions

| Command                  | Purpose                                         |
| ------------------------ | ----------------------------------------------- |
| `npm run dev`            | Start dev server (port 3000)                    |
| `npm run build`          | Production build (Vite + Nitro), no type-check  |
| `npm run test`           | Run Vitest tests                                |
| `npm run lint`           | Run ESLint (type-aware)                         |
| `npx tsc --noEmit`       | Type-check                                      |
| `npx prisma generate`    | Generate the Prisma client (after schema edits) |
| `npx prisma migrate dev` | Create/apply a migration locally                |

**TypeScript Strict Mode** (enforced):

- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Prefix intentionally unused names with `_`; ESLint errors on floating promises, so use `void` for fire-and-forget calls in handlers
- Use path aliases: `@/components/Header` (not relative imports)

---

## Common Tasks

**Add a new page**:

1. Create `src/routes/page-name.tsx` with `createFileRoute('/page-name')({ component: Component })`, pointing `component` at a page component in `src/components/<area>/`
2. If it needs a signed-in user, add a `beforeLoad` guard that checks `session.user.emailVerified === true` (see `src/routes/dashboard.tsx`)
3. Add an entry to `navTabs` in `src/components/Header.tsx` if it belongs in the nav
4. Routes auto-regenerate

**Add a server function**:

1. Add it to the feature's colocated `*.functions.ts` file (e.g. `src/components/dashboard/dashboard.functions.ts`), or to `src/utils/auth.functions.ts` for auth
2. Export `createServerFn({ method: 'POST' }).inputValidator(zodSchema).handler(async ({ data }) => { ... })`
3. For user data: get the session with `auth.api.getSession({ headers })`, require `emailVerified === true`, scope Prisma queries by `userId`, and verify ownership before updates
4. Import and call from a loader or component—fully typed. Call `router.invalidate()` after a mutation

**State management**: Route loaders + `router.invalidate()`, plus local React state (no TanStack Query, Redux or Zustand)

---

## Critical Notes

- ⚠️ Do NOT edit `src/routeTree.gen.ts`
- ✅ Always import `Link` from `@tanstack/react-router`
- ✅ Devtools (Router + React) enabled in dev—use for debugging
- ✅ Data is persisted in PostgreSQL via Prisma (`@/lib/prisma`); a migration that adds a table must also enable row level security on it
- ✅ Payment tables' `updatedAt` has no `@updatedAt`; set it explicitly on writes
- ✅ Do NOT use React Server Components.

---

## Design Guide

### Color System

**Primary Palette**: Emerald/Teal Gradient Theme

- **Primary**: Emerald (emerald-50 through emerald-800)
- **Secondary**: Teal (teal-50 through teal-800)
- **Accent**: Cyan (cyan-50 through cyan-600)
- **Neutral**: Gray scale (gray-50 through gray-900)
- **Status Colors**:
  - Amber for warnings/due soon (amber-100, amber-400, amber-700)
  - Red for overdue/errors (red-100, red-500, red-700)
  - Green for success/paid (emerald-100, emerald-500, emerald-700)

**Gradient Combinations** (use `bg-linear-to-*` in Tailwind v4):

```
bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50    // Light backgrounds
bg-linear-to-br from-emerald-500 to-teal-500              // Icons
bg-linear-to-r from-emerald-600 to-teal-600               // Text gradients
bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 // CTAs
```

### Typography

- **Fonts**: Sora for headings (applied to `h1`–`h6` and `.font-display` in `src/styles.css`), Manrope for body
- **Headings**: `font-black` (900 weight) for impact
- **Sizes**:
  - Hero H1: `text-5xl sm:text-6xl lg:text-7xl`
  - Section H2: `text-4xl sm:text-5xl`
  - Card H3: `text-xl`
- **Body Text**: `text-gray-600` for descriptions, `text-gray-900` for primary
- **Leading**: Use `leading-tight` for headlines, `leading-relaxed` for body

### Spacing & Layout

- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Section Padding**: `py-24` (vertical), `py-20` for tighter sections
- **Card Padding**: `p-6` or `p-8` depending on content density
- **Grid Gaps**: `gap-8` for cards, `gap-4` for form elements
- **Responsive Grids**:
  - 2-col: `md:grid-cols-2`
  - 3-col: `md:grid-cols-2 lg:grid-cols-3`

### Components

**Buttons**:

```tsx
// Primary CTA
className="inline-flex items-center justify-center gap-2 px-8 py-4
  bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
  rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"

// Secondary
className="inline-flex items-center justify-center gap-2 px-8 py-4
  bg-white hover:bg-gray-50 text-gray-900 font-semibold
  rounded-xl border-2 border-gray-200 transition-all"
```

**Cards**:

```tsx
// Feature cards
className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-2xl
  transition-all duration-300 border border-transparent hover:border-gray-200"

// Content cards (mockups)
className="bg-white rounded-2xl shadow-2xl p-6"
```

**Badges/Tags**:

```tsx
// Status badges
className =
  "px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium";
className =
  "px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium";
```

**Icon Containers**:

```tsx
// Gradient icon boxes
className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500
  rounded-xl flex items-center justify-center"
```

### Animation & Interaction

- **Hover Transforms**: `hover:scale-105` for buttons, `group-hover:scale-110` for icons
- **Transitions**: `transition-all` for smooth effects, `duration-300` for specific timing
- **Animations**:
  - `animate-pulse` for background blobs (with `style={{ animationDelay: '1s' }}` for variety)
  - `animate-bounce` for notifications
- **Rotation Effects**: `rotate-2` and `-rotate-1` for card mockups, `hover:rotate-0` to straighten

### Background Patterns

**Animated Blobs**:

```tsx
<div className="absolute inset-0 overflow-hidden">
  <div
    className="absolute -top-1/2 -right-1/4 w-150 h-150 
    rounded-full bg-emerald-200/20 blur-3xl animate-pulse"
  ></div>
  <div
    className="absolute -bottom-1/3 -left-1/4 w-125 h-125 
    rounded-full bg-teal-200/20 blur-3xl animate-pulse"
    style={{ animationDelay: "1s" }}
  ></div>
</div>
```

**SVG Patterns** (for textured backgrounds):

```tsx
<div className="absolute inset-0 opacity-10">
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60'...")`,
    }}
  ></div>
</div>
```

### Responsive Design

- **Mobile-first**: Start with base classes, add `sm:`, `md:`, `lg:` breakpoints
- **Flex Direction**: `flex-col sm:flex-row` for stacking on mobile
- **Text Alignment**: `text-center sm:text-left` when appropriate
- **Hidden Elements**: Use `hidden sm:block` sparingly

### Accessibility

- Use semantic HTML (`<section>`, `<header>`, `<nav>`)
- Include descriptive text for icons (wrapped in `<span className="sr-only">`)
- Maintain color contrast ratios (gray-600 on white, white on emerald-600)
- Ensure interactive elements are keyboard accessible

### Design Principles

1. **No Generic Corporate**: Avoid overused Bootstrap/Material Design patterns
2. **Character**: Use playful rotations, gradients, and animations
3. **Whitespace**: Don't crowd—give elements room to breathe
4. **Consistency**: Reuse gradient combinations and spacing tokens
5. **Hierarchy**: Bold headings, clear visual weight differences
6. **Modern**: Embrace Tailwind v4 features (native opacity, gradients)
