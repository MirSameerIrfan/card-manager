<div align="center">

# 💳 Card Manager

### Never Miss a Payment Again

**A modern, lightweight personal finance tracker for managing credit cards, loans, and recurring bills**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TanStack](https://img.shields.io/badge/TanStack-FF4154?style=for-the-badge&logo=react&logoColor=white)](https://tanstack.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📖 Documentation](#-documentation)

</div>

---

## 🎯 Why Card Manager?

Tired of late fees and missed payment deadlines? **Card Manager** consolidates all your recurring payments into one intuitive dashboard. Track credit card statements, loan installments, and monthly bills—all in one place.

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
- Visual timeline of payment deadlines

</td>
</tr>
<tr>
<td width="50%">

**🎨 Modern UI**
- Clean, intuitive interface
- Responsive design for all devices
- Built with Tailwind CSS

</td>
<td width="50%">

**⚡ Performance**
- Lightning-fast with React 19
- Type-safe with TypeScript
- Optimized with Vite

</td>
</tr>
</table>

---

## 🚀 Quick Start

Get up and running in less than a minute:

```bash
# Clone the repository
git clone https://github.com/<your-username>/card-manager.git
cd card-manager

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL and other credentials

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data (optional)
npm run db:seed

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
| **State Management** | TanStack Query, React Hooks |
| **Styling** | Tailwind CSS 4.0 |
| **Build Tool** | Vite 7 |
| **Server** | Nitro (TanStack Start) |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | Better Auth |
| **Testing** | Vitest |
| **Icons** | Lucide React |

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
| `npm run db:seed` | Seed database with sample data |

### 🏗️ Project Structure

```
card-manager/
├── src/
│   ├── components/     # Reusable UI components
│   ├── data/          # Server functions (type-safe RPC)
│   ├── lib/           # Utility functions and DB client
│   ├── routes/        # File-based routing
│   ├── utils/         # Authentication utilities
│   └── styles.css     # Global styles
├── prisma/            # Database schema and migrations
│   ├── schema.prisma  # Prisma schema definition
│   ├── migrations/    # Database migration files
│   └── seed.ts        # Database seed script
├── public/            # Static assets
└── vite.config.ts     # Vite configuration
```

### 🔧 Key Concepts

#### File-Based Routing
Routes are automatically generated from files in `src/routes/`:
```tsx
// src/routes/payments.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/payments')({
  component: () => <div>Payments Page</div>
})
```

#### Server Functions
Type-safe server functions with full IntelliSense:
```tsx
// src/data/payments.ts
import { createServerFn } from '@tanstack/react-start'

export const getPayments = createServerFn({ method: 'GET' })
  .handler(async () => {
    // Server-side logic
    return payments
  })
```

#### Styling with Tailwind
```tsx
<div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md">
  {/* Your content */}
</div>
```

---

## 🗺️ Roadmap

- [ ] 📱 Mobile app (React Native)
- [ ] 🔔 Push notifications for upcoming payments
- [ ] 📊 Payment history and analytics
- [ ] 💾 Cloud sync across devices
- [ ] 🔐 Multi-user support with authentication
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
- [TanStack](https://tanstack.com/) - Router, Query, and Start
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide](https://lucide.dev/) - Icon library

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Mir Sameer Irfan](https://github.com/MirSameerIrfan)

</div>
