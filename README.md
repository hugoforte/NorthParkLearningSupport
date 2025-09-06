# NorthPark Learning Support

A modern learning support platform built with the T3 Stack, designed to provide comprehensive educational resources and support services.

## 🏗️ Architecture Overview

This project follows the T3 Stack architecture pattern, providing a full-stack TypeScript application with end-to-end type safety.

### Technology Stack

- **Frontend**: Next.js 15.2.3 with App Router
- **Language**: TypeScript 5.8.2 with strict configuration
- **Styling**: Tailwind CSS 4.0.15 with PostCSS
- **Environment**: T3 Env with Zod validation
- **Package Manager**: pnpm 9.14.2
- **Code Quality**: ESLint 9.23.0 + Prettier 3.5.3

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Geist font
│   └── page.tsx           # Homepage with T3 branding
├── styles/
│   └── globals.css        # Global styles with Tailwind
└── env.js                 # Environment validation with Zod
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd northpark-learning-support

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbo
pnpm build        # Build for production
pnpm start        # Start production server
pnpm preview      # Build and preview production

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm check        # Run linting and type checking
pnpm typecheck    # TypeScript type checking only

# Formatting
pnpm format:check # Check code formatting
pnpm format:write # Format code with Prettier
```

## 🏛️ Architecture Details

### Frontend Architecture

- **Next.js App Router**: Modern routing with server and client components
- **TypeScript**: Strict type checking with `noUncheckedIndexedAccess`
- **Tailwind CSS**: Utility-first styling with custom theme configuration
- **Geist Font**: Modern typography with CSS variables

### Environment Configuration

- **T3 Env**: Type-safe environment variable validation
- **Zod Schema**: Runtime validation for environment variables
- **Client/Server Separation**: Clear distinction between client and server env vars

### Code Quality Setup

- **ESLint**: TypeScript-aware linting with Next.js rules
- **Prettier**: Code formatting with Tailwind CSS plugin
- **TypeScript**: Strict configuration with path aliases (`~/*`)

### Build Configuration

- **Next.js**: Optimized build with Turbo mode for development
- **PostCSS**: Tailwind CSS processing
- **TypeScript**: ES2022 target with ESNext modules

## 🔧 Development Features

### Type Safety
- End-to-end TypeScript with strict configuration
- Environment variable validation with Zod
- Path aliases for clean imports (`~/` prefix)

### Performance
- Next.js Turbo mode for faster development
- Optimized build configuration
- Modern ES2022 target for better performance

### Developer Experience
- Hot reload with Next.js
- Automatic code formatting with Prettier
- TypeScript error checking in real-time
- ESLint integration with IDE support

## 📁 Key Files

- `src/app/layout.tsx` - Root layout with font configuration
- `src/app/page.tsx` - Homepage component
- `src/env.js` - Environment variable validation
- `src/styles/globals.css` - Global styles and Tailwind configuration
- `tsconfig.json` - TypeScript configuration with strict settings
- `next.config.js` - Next.js configuration
- `eslint.config.js` - ESLint configuration with TypeScript rules

## 🚀 Deployment

This project is optimized for deployment on modern platforms:

- **Vercel** (Recommended) - Zero-config deployment
- **Netlify** - Static site deployment
- **Docker** - Containerized deployment

### Environment Variables

Configure the following environment variables for production:

```bash
NODE_ENV=production
# Add other required environment variables as needed
```

## 📚 Learn More

### T3 Stack Resources
- [T3 Stack Documentation](https://create.t3.gg/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Project-Specific
- This project uses the latest T3 Stack version (7.39.3)
- Built with create-t3-app scaffolding
- Follows T3 Stack best practices and conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm check` to ensure code quality
5. Submit a pull request

## 📄 License

This project is private and proprietary to NorthPark Learning Support.
