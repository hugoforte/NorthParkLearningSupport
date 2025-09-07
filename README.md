# NorthPark Learning Support

A comprehensive learning support platform built with Next.js and Convex, designed to manage educational institutions, track student progress, and support learning outcomes.

## 🏗️ Architecture Overview

This project provides a full-stack TypeScript application with real-time data synchronization, modern UI components, and comprehensive educational management features.

### Technology Stack

- **Frontend**: Next.js 15.5.2 with App Router
- **Backend**: Convex (real-time database and serverless functions)
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Environment**: T3 Env with Zod validation
- **Package Manager**: pnpm 9.14.2
- **Code Quality**: ESLint + Prettier

### Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # Root layout with navigation
│   ├── page.tsx                  # Enhanced homepage with feature cards
│   ├── teachers/                 # Teacher management pages
│   ├── students/                 # Student management pages
│   ├── classes/                  # Class management pages
│   ├── notes/                    # Notes management pages
│   └── goals/                    # Goals management pages
├── components/                    # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── navigation/               # Navigation components
│   ├── teachers/                 # Teacher-specific components
│   ├── students/                 # Student-specific components
│   ├── classes/                  # Class-specific components
│   ├── notes/                    # Notes-specific components
│   ├── goals/                    # Goals-specific components
│   └── providers/                # React context providers
├── lib/                          # Utility functions
└── styles/
    └── globals.css               # Global styles with Tailwind

convex/                           # Convex backend
├── schema.ts                     # Database schema definition
├── teachers.ts                   # Teacher CRUD operations
├── students.ts                   # Student CRUD operations
├── classes.ts                    # Class CRUD operations
├── grades.ts                     # Grade CRUD operations
├── notes.ts                      # Notes CRUD operations
├── goals.ts                      # Goals CRUD operations
├── subjects.ts                   # Subjects CRUD operations
├── classAssignments.ts           # Class assignment operations
└── migrations.ts                 # Database migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Convex account (for backend services)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd northpark-learning-support

# Install dependencies
pnpm install

# Set up Convex
npx convex dev

# Start development server (in another terminal)
pnpm dev
```

### Environment Setup

Create a `.env.local` file with the following variables:

```bash
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

The Convex URL will be provided when you run `npx convex dev`.

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

## ✨ Features

### 🏫 Educational Management

- **Teacher Management**: Complete CRUD operations for teaching staff
- **Student Management**: Track student information and progress
- **Class Organization**: Organize students into classes with grade levels
- **Class Assignments**: Assign teachers to classes with specific roles

### 📚 Learning Support

- **Learning Goals**: Set and track learning objectives for students
- **Progress Tracking**: Monitor goal completion with status indicators
- **Subject Management**: Organize goals by subject areas
- **Notes & Observations**: Record teacher observations and student behavior

### 🎯 Student Dashboard

- **Comprehensive View**: 360° view of each student's information
- **Goal Tracking**: Visual progress indicators for learning goals
- **Note History**: Chronological display of all student notes
- **Class Information**: Current class details and assigned teachers
- **Quick Actions**: Direct access to add goals and notes

### 🎨 Modern UI/UX

- **Dark Theme**: Sleek, modern dark interface
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive Cards**: Hover effects and smooth animations
- **Excel-like Grids**: Sortable and filterable data tables
- **Real-time Updates**: Live data synchronization with Convex

### 🔧 Technical Features

- **Real-time Database**: Convex provides instant data updates
- **Type Safety**: End-to-end TypeScript with strict configuration
- **Modern Components**: shadcn/ui component library
- **Optimized Performance**: Next.js 15 with App Router
- **Code Quality**: ESLint + Prettier for consistent code

## 📁 Key Files

### Frontend
- `src/app/layout.tsx` - Root layout with navigation and Convex provider
- `src/app/page.tsx` - Enhanced homepage with interactive feature cards
- `src/components/navigation/main-nav.tsx` - Responsive navigation component
- `src/components/students/student-dashboard.tsx` - Comprehensive student dashboard
- `src/lib/utils.ts` - Utility functions for Tailwind class merging

### Backend
- `convex/schema.ts` - Database schema with all entities and relationships
- `convex/migrations.ts` - Database migrations for initial data
- `convex/teachers.ts` - Teacher CRUD operations
- `convex/students.ts` - Student CRUD operations
- `convex/goals.ts` - Goals CRUD operations with status tracking

### Configuration
- `src/env.js` - Environment variable validation with Zod
- `tsconfig.json` - TypeScript configuration with path aliases
- `next.config.js` - Next.js configuration
- `eslint.config.js` - ESLint configuration with TypeScript rules

## 🎯 Usage Guide

### Getting Started with the Application

1. **Add Teachers**: Start by adding your teaching staff
2. **Create Classes**: Set up classes with grade levels
3. **Add Students**: Enroll students and assign them to classes
4. **Assign Teachers**: Assign teachers to classes with specific roles
5. **Set Goals**: Create learning goals for students
6. **Record Notes**: Add observations and notes about students

### Navigation

- **Home**: Interactive dashboard with feature overview
- **Teachers**: Manage teaching staff and their information
- **Students**: View student list and individual dashboards
- **Classes**: Organize classes and manage assignments
- **Notes**: Record and track student observations
- **Goals**: Set and monitor learning objectives

### Student Dashboard Features

- **Student Info**: Personal details, age, and status
- **Class Information**: Current class and assigned teachers
- **Learning Goals**: Active and completed goals with status tracking
- **Notes History**: Chronological list of all observations
- **Quick Actions**: Direct links to add goals and notes

## 🚀 Deployment

This project is optimized for deployment on Vercel with Convex backend services.

### Vercel Deployment

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your repository

2. **Configure environment variables in Vercel:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variable:
     ```
     NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
     ```

3. **Deploy:**
   - Vercel will automatically deploy on every push to main
   - Or manually trigger deployment from the Vercel dashboard

### Convex Setup

1. **Create a Convex account:**
   - Go to [convex.dev](https://convex.dev)
   - Sign up for a free account
   - Create a new project

2. **Deploy your Convex backend:**
   ```bash
   # Install Convex CLI globally
   npm install -g convex
   
   # Login to Convex
   npx convex login
   
   # Initialize Convex in your project (if not already done)
   npx convex dev
   
   # Deploy to production
   npx convex deploy
   ```

3. **Get your deployment URL:**
   - After running `npx convex deploy`, you'll get a deployment URL
   - Copy this URL and add it to your Vercel environment variables as `NEXT_PUBLIC_CONVEX_URL`

### Database Migrations

Run the following migrations to populate your database with initial data:

```bash
# Populate grades (K-8)
npx convex run migrations:populateGrades

# Populate subjects (common subjects)
npx convex run migrations:populateSubjects
```

### Environment Variables

Configure the following environment variables for production:

```bash
# Required for Vercel deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Optional
NODE_ENV=production
```

### Making Your App Public

To make your Vercel app publicly accessible:

1. **Via Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "General"
   - Scroll down to "Visibility"
   - Change from "Private" to "Public"

2. **Via Vercel CLI:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy and make public
   vercel --prod
   ```

## 📚 Learn More

### Technology Resources

- [Next.js Documentation](https://nextjs.org/docs) - React framework with App Router
- [Convex Documentation](https://docs.convex.dev/) - Real-time backend platform
- [shadcn/ui Documentation](https://ui.shadcn.com/) - Reusable UI components
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Type safety
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library

### Project-Specific

- Built with Next.js 15.5.2 and Convex for real-time data
- Uses shadcn/ui components for consistent design
- Implements comprehensive CRUD operations for educational management
- Features real-time data synchronization and modern UI/UX patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm check` to ensure code quality
5. Submit a pull request

## 📄 License

This project is private and proprietary to NorthPark Learning Support.
