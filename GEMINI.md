# MoneyScope: Project Instructions

## Project Overview
MoneyScope is a modern personal finance hub designed for tracking bills, income, assets, and recurring payments. It provides users with an intuitive dashboard to monitor credit card statements, loan installments, and monthly bills.

### Core Tech Stack
- **Framework:** [TanStack Start](https://tanstack.com/start) (Full-stack React)
- **Frontend Library:** React 19
- **Routing:** TanStack Router (File-based)
- **State Management & Data Fetching:** TanStack Query (integrated via Start)
- **Forms:** TanStack Form
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) with Vanilla CSS enhancements
- **Database:** PostgreSQL via [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [better-auth](https://www.better-auth.com/)
- **Build Tool:** Vite 7
- **Deployment:** Optimized for Netlify (via Nitro preset)
- **Monitoring:** Sentry integration for error tracking

---

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- PostgreSQL database
- Environment variables configured (see `.env.example` if available, or infer from `package.json` and `src/lib/auth.ts`)

### Commands
- **Development:** `npm run dev` (Starts Vite dev server on port 3000)
- **Build:** `npm run build` (Builds for production and copies instrument script)
- **Start:** `npm run start` (Runs the production build using Nitro)
- **Test:** `npm run test` (Runs Vitest)
- **Lint:** `npm run lint` (Lints code with ESLint)
- **Database Migrations:** `npx prisma migrate dev` (during development)
- **Prisma Studio:** `npx prisma studio` (to view/edit database data)

---

## Architecture & Key Concepts

### File-Based Routing
Routes are defined in `src/routes/`. The route tree is automatically generated into `src/routeTree.gen.ts`.
- **Root Layout:** `src/routes/__root.tsx` contains the base HTML structure, global providers, and layout-level animations.
- **Authenticated Routes:** Routes like `dashboard.tsx` and `settings/profile.tsx` are protected via auth guards.

### Server Functions
Backend logic is implemented using TanStack Start's `createServerFn`.
- **Location:** Primarily found in `src/utils/*.functions.ts` (e.g., `auth.functions.ts`, `dashboard.functions.ts`).
- **Patterns:** Always use `inputValidator` (with Zod) and handle errors gracefully using normalized error messages.

### Authentication
Powered by `better-auth`, configured in `src/lib/auth.ts`.
- **Client Access:** Use the `auth` client in `src/lib/auth-client.ts`.
- **Server Access:** Use the `auth` instance in `src/lib/auth.ts` within server functions.
- **Workflow:** Supports email/password signup, email verification, and session management.

### Database (Prisma)
- **Schema:** Defined in `prisma/schema.prisma`.
- **Client:** A singleton instance is exported from `src/lib/prisma.ts`.
- **Models:** `User`, `Session`, `Account`, `Verification`, `credit_card`, `loan`, `recurring_bill`.

### Styling & Animations
- **Typography:** Sora (Headings), Manrope (Body).
- **Animations:** Extensive use of CSS keyframes and IntersectionObserver-based "scroll-reveal" effects.
- **Utility Classes:** Custom classes like `.reveal`, `.reveal-stagger`, and `.feature-card` (for shimmer effects) are defined in `src/styles.css`.

---

## Development Conventions

### Code Style
- **TypeScript:** Strict typing is required. Avoid `any`.
- **React:** Prefer functional components and hooks. Use React 19 features where appropriate.
- **State Management:** Leverage TanStack Query for server state and TanStack Router for URL-based state.
- **Variables:** Prefer `const` over `let`. (User preference from global memory).

### Naming Conventions
- **Components:** PascalCase (e.g., `PaymentCard.tsx`).
- **Functions/Variables:** camelCase (e.g., `getPayments`).
- **Files:** Follow existing patterns (PascalCase for components, kebab-case or camelCase for utils).
- **Prisma Models:** snake_case for financial models (`credit_card`, `loan`), camelCase/PascalCase for auth models.

### Project Structure
- `src/components/`: UI components organized by feature (auth, dashboard, landing, etc.).
- `src/lib/`: Library initializations (Prisma, auth, email).
- `src/routes/`: Route definitions and layouts.
- `src/utils/`: Utility functions, server functions, and hooks.
- `prisma/`: Database schema and migrations.

---

## UI Patterns
- **Cards:** Rounded (`2xl`), soft shadows, glassmorphism headers on scroll.
- **Buttons:** Pill-shaped, subtle hover animations.
- **Colors:** Emerald/Teal gradients for primary actions and status.
- **Feedback:** Use shimmer effects and scale-in animations for interactive elements.
