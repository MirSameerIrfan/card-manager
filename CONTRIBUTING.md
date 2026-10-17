# Contributing to Card Manager

First off, thank you for considering contributing to Card Manager! 🎉

It's people like you that make Card Manager such a great tool for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. By participating, you are expected to uphold this standard. Please be respectful and constructive in your interactions.

## 🚀 Getting Started

Before you begin:
- Make sure you have [Node.js](https://nodejs.org/) 20.19+ or 22.12+ installed (required by Vite 7 and Prisma 7)
- Have a PostgreSQL database to develop against: a [Supabase](https://supabase.com/) project, or a local throwaway one started with `npx prisma dev --name card-manager`
- Familiarize yourself with [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [TanStack Router](https://tanstack.com/router) and [TanStack Start](https://tanstack.com/start)
- Read the [README.md](README.md) to understand the project structure

## 💡 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other tools**

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good-first-issue` - Simple issues for beginners
- `help-wanted` - Issues where we need community help

## 🛠️ Development Setup

1. **Fork the repository** and clone your fork:
   ```bash
   git clone https://github.com/your-username/card-manager.git
   cd card-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your environment**: copy `.env.example` to `.env` and set at least `DATABASE_URL` and `DIRECT_URL` (see "Environment & Database" in the [README](README.md)). Without `RESEND_API_KEY`, verification and password reset links are printed to the server console, which is how you complete those flows locally:
   ```bash
   cp .env.example .env
   ```

4. **Generate the Prisma client and create the database tables** (the app will not build or run until the client has been generated into `generated/prisma/`):
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Make your changes** and test them thoroughly

## 📏 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Provide proper type annotations
- Avoid using `any` type unless absolutely necessary
- Use interfaces for object types

### React

- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use meaningful component and prop names

### Styling

- Use Tailwind CSS utility classes
- Follow existing styling patterns
- Keep styles consistent across the app
- Mobile-first responsive design

### File Structure

- Place components in `src/components/<area>/`
- Place routes in `src/routes/`; keep route files thin (guards, loader, search-param validation) and point `component` at a page component
- Place server functions (`createServerFn`) in a `*.functions.ts` file colocated with the feature, e.g. `src/components/dashboard/dashboard.functions.ts`; auth server functions live in `src/utils/auth.functions.ts`
- Access the database only through server functions, importing `prisma` from `@/lib/prisma`. After a mutation, call `router.invalidate()` so route loaders re-run
- Protected routes and server functions must both check `session.user.emailVerified === true`
- After changing `prisma/schema.prisma`, run `npx prisma migrate dev` and `npx prisma generate`; a migration that adds a table must also enable row level security on it
- Use path aliases: `@/components/Header` instead of relative imports

### Code Quality

- Run ESLint before committing: `npm run lint`
- Ensure all tests pass: `npm run test`
- Build succeeds: `npm run build`
- No TypeScript errors: `npx tsc --noEmit` (the build does not type-check)
- No console.log statements in production code

## 📝 Commit Message Guidelines

We follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

### Examples

```
feat(payments): add recurring payment support
fix(dashboard): correct total calculation
docs(readme): update installation instructions
style(header): improve responsive layout
refactor(api): simplify payment data fetching
```

## 🔄 Pull Request Process

1. **Update the README.md** with details of changes if applicable
2. **Update documentation** if you're changing functionality
3. **Ensure all checks pass**:
   - ✅ Tests pass (`npm run test`)
   - ✅ Build succeeds (`npm run build`)
   - ✅ No linting errors (`npm run lint`)
   - ✅ No TypeScript errors (`npx tsc --noEmit`)

4. **Keep PRs focused**: One feature/fix per PR
5. **Write a clear PR description**:
   - What changes are included
   - Why these changes are needed
   - How to test the changes
   - Screenshots for UI changes

6. **Link related issues**: Use keywords like "Closes #123" or "Fixes #456"
7. **Be responsive**: Address review comments promptly
8. **Be patient**: Maintainers will review your PR as soon as possible

## 🧪 Testing

- Write tests for new features
- Update tests when modifying existing features
- Ensure test coverage doesn't decrease
- Run tests locally before pushing

```bash
npm run test
```

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Router Docs](https://tanstack.com/router)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## ❓ Questions?

Feel free to:
- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing discussions

---

Thank you for contributing to Card Manager! 🙏

Your efforts help make financial management easier for everyone. 💙
