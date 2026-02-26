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
| **Database** | PostgreSQL via Prisma ORM |
| **Auth** | better-auth (email/password) |
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

### 🏗️ Project Structure

```
moneyscope/
├── src/
│   ├── components/
│   │   ├── about/           # About page (mission, values, timeline, team)
│   │   ├── auth/            # Auth layout, login, signup, field info
│   │   ├── blog/            # Blog page (posts, featured, newsletter)
│   │   ├── dashboard/       # Dashboard, stats, payment cards, calendar
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
│   │   ├── auth/            # Auth routes (/auth/login, /auth/signup)
│   │   ├── settings/        # Settings routes (/settings/profile)
│   │   └── api/             # API routes (auth handler)
│   ├── utils/
│   │   ├── auth-context.tsx # React context for auth state
│   │   ├── auth.ts          # better-auth client config
│   │   ├── auth.server.ts   # Server-side auth functions
│   │   ├── auth.functions.ts# Client-callable server functions
│   │   ├── dashboard.functions.ts # Dashboard data server functions
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
