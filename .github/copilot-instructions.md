# Card Manager - AI Coding Agent Instructions

## Before Committing

- [ ] Run `npm run test` — all tests pass
- [ ] Run `npm run build` — no TypeScript errors
- [ ] Verify `src/routeTree.gen.ts` was auto-regenerated (if routes changed)

---

## Project Overview

**Bill & Payment Reminder**: Personal finance tracker for recurring payments (credit cards, loans, bills).  
**Stack**: React 19 + TanStack Start + Vite + TypeScript + Tailwind CSS + Nitro

---

## Key Architecture

### File-Based Routing

- Routes in `src/routes/` auto-generate `src/routeTree.gen.ts` (do NOT edit)
- Pattern: `createFileRoute('/path')({ component: MyComponent })`
- Root layout: `src/routes/__root.tsx` (Header + devtools)

### Server Functions (Type-Safe RPC)

- Location: `src/data/` directory
- Pattern: `createServerFn({ method: 'GET/POST' }).handler(async () => { ... })`
- Client imports get full type inference—no API routes needed

### Styling & Components

- **Tailwind CSS 4.0**: Inline classes, no separate CSS files
- **Global styles**: `src/styles.css`
- **Icons**: `lucide-react` library
- **No component libraries**: Hand-built UI with Tailwind + React hooks

---

## Commands & Conventions

| Command         | Purpose                         |
| --------------- | ------------------------------- |
| `npm run dev`   | Start dev server (port 3000)    |
| `npm run build` | Production build (Vite + Nitro) |
| `npm run test`  | Run Vitest tests                |

**TypeScript Strict Mode** (enforced):

- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Use path aliases: `@/components/Header` (not relative imports)

---

## Common Tasks

**Add a new page**:

1. Create `src/routes/page-name.tsx` with `createFileRoute('/page-name')({ component: Component })`
2. Add Link in `src/components/Header.tsx`
3. Routes auto-regenerate

**Add a server function**:

1. Create `src/data/my-function.ts`
2. Export `createServerFn({ method: 'POST' }).handler(async (input) => { ... })`
3. Import and call from client—fully typed

**State management**: React hooks + TanStack Query (no Redux/Zustand)

---

## Critical Notes

- ⚠️ Do NOT edit `src/routeTree.gen.ts`
- ✅ Always import `Link` from `@tanstack/react-router`
- ✅ Devtools (Router + React) enabled in dev—use for debugging
- ✅ No persistent storage yet; MVP uses localStorage only
