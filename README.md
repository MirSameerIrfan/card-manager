<div align="center">

# 💳 MoneyScope

### Never Miss a Payment Again

**A modern personal finance hub for tracking bills, income, assets, and recurring payments**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TanStack](https://img.shields.io/badge/TanStack-FF4154?style=for-the-badge&logo=react&logoColor=white)](https://tanstack.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📖 Documentation](#-documentation)

</div>

---

## 🎯 Why MoneyScope?

Tired of late fees and missed payment deadlines? **MoneyScope** consolidates bills, income, and assets into one intuitive dashboard. Track credit card statements, loan installments, monthly bills, and more—all in one place.

### ✨ Features

<table>
<tr>
<td width="50%">

**📅 Payment Tracking**
- Track multiple credit cards and their billing cycles
- Monitor loan payment schedules
- Manage recurring bills and subscriptions

</td>
<td width="50%">

**💰 Financial Overview**
- Dashboard view of upcoming payments
- Automatic calculation of total dues
- Visual payment calendar with daily totals

</td>
</tr>
<tr>
<td width="50%">

**🎨 Modern UI**
- Scroll-triggered entrance animations
- Glassmorphism header with frosted blur effect
- Responsive design for all devices
- Premium feature card shimmer borders on hover

</td>
<td width="50%">

**⚡ Performance**
- Lightning-fast with React 19
- Type-safe with TypeScript
- Optimized with Vite 7
- Lightweight IntersectionObserver-based animations

</td>
</tr>
<tr>
<td width="50%">

**🔐 Authentication**
- Email/password sign up & sign in
- Email verification flow
- Forgot password / reset by email
- Profile settings (name, email, password)
- Session management with better-auth

</td>
<td width="50%">

**📝 Content Pages**
- About page with mission, values, timeline & team
- Blog with featured posts, category filters & newsletter
- Full-width footer with social links
- Custom animated 404 page

</td>
</tr>
</table>

---

## 🚀 Quick Start

Get up and running in less than a minute:

```bash
# Clone the repository
git clone https://github.com/<your-username>/moneyscope.git
cd moneyscope

# Install dependencies
npm install

# Configure environment (see "Environment & Database" below)
cp .env.example .env

# Generate the Prisma client and create the database tables
npx prisma generate
npx prisma migrate deploy

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser. 🎉

---

## 🛠️ Tech Stack

Built with modern, cutting-edge technologies:

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript |
| **Routing** | TanStack Router (File-based) |
| **Forms** | TanStack Form |
| **Styling** | Tailwind CSS 4.0 |
| **Build Tool** | Vite 7 |
| **Server** | Nitro (TanStack Start) |
| **Database** | Supabase PostgreSQL via Prisma ORM |
| **Auth** | better-auth (email/password) |
| **Monitoring** | Sentry |
| **Calendar** | FullCalendar |
| **Icons** | Lucide React |
| **Testing** | Vitest |

---

## 📖 Documentation

### 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run test` | Run test suite |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint code with ESLint |

### 🗄️ Environment & Database

All configuration lives in `.env` (see [`.env.example`](.env.example) for every variable).

**Database (Supabase Postgres via Prisma ORM)**

The app uses the Prisma ORM against a Supabase-hosted Postgres database. In the Supabase dashboard, open your project, click **Connect**, and copy two connection strings:

| Variable | Supabase connection | Used for |
|----------|--------------------|----------|
| `DATABASE_URL` | Transaction pooler (port `6543`) | The running app |
| `DIRECT_URL` | Session pooler (port `5432`) | `prisma migrate` |

Then run `npx prisma migrate deploy` to create the tables. The migrations enable row level security on every table, so Supabase's public Data API cannot read them; the app connects as the table owner and is unaffected.

**Connection pooling**

- The server keeps a single `pg` pool per instance (`src/lib/prisma.ts`), reused across requests and across dev hot reloads.
- Limits are set with `DATABASE_POOL_MAX` (default `5`), `DATABASE_POOL_IDLE_TIMEOUT_MS` (default `10000`) and `DATABASE_POOL_CONNECTION_TIMEOUT_MS` (default `10000`, long enough for a cold serverless start).
- On serverless hosts every instance has its own pool, so keep `DATABASE_POOL_MAX` small and use the Supabase pooler URL for `DATABASE_URL`.
- `GET /api/health` runs a test query and reports pool usage (`max`, `total`, `idle`, `waiting`).
- The pool is closed on `SIGTERM`/`SIGINT` when running `npm run start`.

**Auth**

- `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` are required in production.
- Without `RESEND_API_KEY`, email verification and password reset links are printed to the server console instead of being emailed, which is how you complete those flows locally.
- Password reset: `/auth/forgot-password` emails a link that is valid for 1 hour and can be used once; `/auth/reset-password` sets the new password and signs the user out of all sessions. The response is the same whether or not the email is registered.
- Auth endpoints are rate limited in production (for example 3 reset requests per minute per IP). Counters are stored in the `rateLimit` table.

**Error monitoring (Sentry)**

Set `SENTRY_DSN` (server) and `VITE_SENTRY_DSN` (browser) to enable error reporting, and `SENTRY_AUTH_TOKEN` at build time to upload source maps. All three are optional: with no DSN, Sentry is disabled and the app runs normally. Default PII collection (IP addresses, cookies, request headers) is turned off.

### 🏗️ Project Structure

```
moneyscope/
├── src/
│   ├── components/
│   │   ├── about/           # About page (mission, values, timeline, team)
│   │   ├── auth/            # Auth layout, login, signup, password reset
│   │   ├── blog/            # Blog page (posts, featured, newsletter)
│   │   ├── dashboard/       # Dashboard, stats, payment cards, calendar, server functions
│   │   ├── landing/         # Hero, Features, Testimonials, CTA, Footer
│   │   ├── settings/        # Profile settings page
│   │   ├── Header.tsx       # Glassmorphism header with scroll effect
│   │   └── NotFound.tsx     # Animated 404 page
│   ├── routes/              # File-based routing (auto-generates route tree)
│   │   ├── __root.tsx       # Root layout with AuthProvider
│   │   ├── index.tsx        # Landing page (/)
│   │   ├── about.tsx        # About page (/about)
│   │   ├── blog.tsx         # Blog page (/blog)
│   │   ├── dashboard.tsx    # Dashboard (/dashboard, authenticated)
│   │   ├── auth/            # Auth routes (login, signup, verify-email, forgot/reset password)
│   │   ├── settings/        # Settings routes (/settings/profile)
│   │   └── api/             # API routes (auth handler, health check)
│   ├── lib/
│   │   ├── auth.ts          # better-auth server config
│   │   ├── auth-client.ts   # better-auth browser client
│   │   ├── prisma.ts        # Prisma client and pooled pg connection
│   │   ├── db-pool.ts       # Pool settings read from the environment
│   │   └── email.ts         # Verification and password reset emails
│   ├── utils/
│   │   ├── auth.functions.ts# Auth server functions
│   │   ├── route-guards.ts  # Auth redirect guards
│   │   └── useScrollReveal.ts # IntersectionObserver scroll animation hook
│   └── styles.css           # Global styles, keyframes, animations, dark mode vars
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets (logo, favicon, manifest)
└── vite.config.ts           # Vite configuration
```

### 🔧 Key Concepts

#### File-Based Routing
Routes are automatically generated from files in `src/routes/`:
```tsx
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '@/components/about/AboutPage'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})
```

#### Server Functions
Type-safe server functions with full IntelliSense:
```tsx
import { createServerFn } from '@tanstack/react-start'

export const getPayments = createServerFn({ method: 'GET' })
  .handler(async () => {
    // Server-side logic
    return payments
  })
```

#### Styling Guide
**Typography**
- Headings: `Sora`
- Body/UI: `Manrope`

**Colors**
- Primary: Emerald/Teal gradient (`from-emerald-600 to-teal-600`)
- Accents: Cyan, Emerald, and Teal variants for status and highlights
- Surface: White with soft gray borders for cards and panels

**Animations**
- Scroll-reveal via `.reveal` / `.visible` CSS classes
- Custom keyframes: `fade-in-up`, `float`, `shimmer`, `scale-in`, `slide-in-left/right`
- Feature card hover shimmer via `.feature-card` CSS class
- Glassmorphism header via `backdrop-blur-xl` on scroll

**UI Patterns**
- Cards use rounded corners (`rounded-2xl`) and soft shadows (`shadow-sm`/`shadow-lg`)
- Buttons are pill‑like with subtle lift on hover
- Use consistent spacing (`gap-3` to `gap-6`) for rhythm

---

## 🗺️ Roadmap

- [x] 🔐 User authentication with email verification
- [x] 📊 Dashboard with payment tracking
- [x] 📅 Payment calendar with daily totals
- [x] ➕ Add/delete payments (credit cards, loans, bills)
- [x] 👤 Profile settings (name, email, password)
- [x] 🔑 Forgot password flow
- [x] 📝 About page and Blog
- [x] 🎨 Scroll animations and glassmorphism effects
- [ ] 📱 Mobile app (React Native)
- [ ] 🔔 Push notifications for upcoming payments
- [ ] 📊 Payment history and analytics
- [ ] 💾 Cloud sync across devices
- [ ] 📈 Spending insights and reports
- [ ] 🌐 Multi-currency support

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:
- ✅ All tests pass (`npm run test`)
- ✅ Code builds successfully (`npm run build`)
- ✅ Code follows the existing style

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Mir Sameer Irfan**

- GitHub: [@MirSameerIrfan](https://github.com/MirSameerIrfan)

---

## 🙏 Acknowledgments

Built with amazing open-source projects:
- [React](https://reactjs.org/) - UI library
- [TanStack](https://tanstack.com/) - Router, Query, Form, and Start
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vite](https://vitejs.dev/) - Build tool
- [Prisma](https://www.prisma.io/) - Database ORM
- [better-auth](https://www.better-auth.com/) - Authentication
- [FullCalendar](https://fullcalendar.io/) - Calendar component
- [Lucide](https://lucide.dev/) - Icon library

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Mir Sameer Irfan](https://github.com/MirSameerIrfan)

</div>
