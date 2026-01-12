# Card Manager - AI Coding Agent Instructions

## Project Overview

**Bill & Payment Reminder**: A personal finance tracker web app for managing recurring payments (credit card dues, loans, bills) in one unified dashboard.

**Tech Stack**: React 19 + TanStack Start (full-stack framework) + Vite + TypeScript + Tailwind CSS + Nitro backend

---

## Architecture & Key Patterns

### File-Based Routing (TanStack Router)

- Routes defined as files in `src/routes/` with automatic code generation
- Root route: `src/routes/__root.tsx` (layout, devtools, header)
- Index route: `src/routes/index.tsx` (landing page)
- Example nested routes: `src/routes/example/example1.tsx`, etc.
- **Pattern**: Use `createFileRoute()` and export named `Route` object in each file
- Auto-generated: `src/routeTree.gen.ts` — do NOT edit manually

### Server Functions (TanStack Start)

- Defined using `createServerFn()` with `.handler()` — handles both server/client seamlessly
- Example: `src/data/demo.punk-songs.ts` shows `getPunkSongs()` server function
- **Key advantage**: Type-safe client→server calls without explicit API routes
- Nitro enables both server-side rendering (SSR) and API endpoints

### Styling Strategy

- **Tailwind CSS 4.0** (via `@tailwindcss/vite` plugin for zero-config)
- Global styles in `src/styles.css`
- Component styles use inline Tailwind classes (no separate CSS files)
- Icons: `lucide-react` library (see Header.tsx for usage pattern)

### Component Structure

- Functional React components with hooks (useState, etc.)
- Example: [Header.tsx](src/components/Header.tsx) — responsive sidebar navigation with state management
- No component library; hand-built UI with Tailwind
- Devtools: TanStack devtools baked into root layout for debugging

---

## Critical Developer Workflows

### Local Development

```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server on port 3000
```

### Build & Preview

```bash
npm run build      # Vite build + Nitro SSR bundle
npm run preview    # Preview production build locally
```

### Testing

```bash
npm run test       # Run Vitest (unit/integration tests)
```

### File Generation

- Route changes trigger automatic `routeTree.gen.ts` regeneration (handled by `@tanstack/router-plugin`)
- No manual route registration needed

---

## Project-Specific Conventions

1. **TypeScript Strict Mode**: `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` enforced
2. **Path Aliases**: `@/*` maps to `src/*` — use `import x from '@/components/Header'` not relative paths
3. **React Router Pattern**: Always import `Link` from `@tanstack/react-router` for SPA navigation
4. **Server Functions**: Place in `src/data/` directory; use async `.handler()` pattern
5. **Styling**: No CSS Modules or separate stylesheets — keep Tailwind inline
6. **No External State Management**: Rely on React hooks + TanStack Query (when needed) — no Redux/Zustand

---

## Common Tasks & Patterns

### Adding a New Page

1. Create `src/routes/your-page.tsx`
2. Use `createFileRoute('/your-page')({ component: YourComponent })`
3. Add Link in Header.tsx navigation sidebar
4. Route generation is automatic

### Adding a Server Function

1. Create file in `src/data/your-function.ts`
2. Export `createServerFn({ method: 'GET/POST' }).handler(async () => { ... })`
3. Import and call from client components — TypeScript infers types automatically

### Component Development

- Use Tailwind for layout/spacing (not CSS)
- Import icons from `lucide-react` as needed
- Prefer controlled components with useState for forms/interactions
- Devtools available in browser (TanStack Router + React devtools panel)

---

## Integration Points & Dependencies

- **@tanstack/react-router**: File-based routing, type-safe navigation
- **@tanstack/react-start**: Full-stack framework, server functions
- **nitro**: Backend runtime (SSR + API endpoints)
- **vite**: Build tool with HMR during dev
- **tailwindcss**: CSS utilities (v4, no build step required)
- **lucide-react**: Icon library
- **vitest + @testing-library/react**: Testing framework

## Notes for AI Agents

- Always respect `tsconfig.json` strict settings — TypeScript errors must be resolved
- When adding routes, ensure backward compatibility with existing navigation
- Server functions are type-safe; leverage IntelliSense for async data flows
- Devtools (Router + React) are enabled in dev; use them for debugging
- No runtime state persist; localStorage used for MVP (frontend only currently)
